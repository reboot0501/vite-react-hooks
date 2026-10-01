import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import AppLayout from '../layout/ui/app-layout.container';
import { fetchMenus } from '@/entities/api/menu.api';
import { DEFAULT_MENUS, type Menu } from '@/entities/model/menu.entity';

export interface AppLayoutLoaderData {
  menus: Menu[];
}

/**
 * 루트 레이아웃 라우트 진입 전 메뉴 데이터를 사전 패칭하는 loader
 */
export const appLayoutLoader = async (): Promise<AppLayoutLoaderData> => {
  const menus = await fetchMenus();
  return { menus };
};

/**
 * ============================================================================
 * [대안 1: Vite import.meta.glob 기반 제로-컨피그 자동 수집]
 * ============================================================================
 * - COMPONENT_REGISTRY와 같은 수작업 하드코딩 맵을 완전히 제거합니다.
 * - Vite의 경로 별칭('@')을 활용하여 '@/pages' 하위의 모든 .tsx 파일들을 자동으로 스캔합니다.
 * - 결과 객체 형태:
 *   {
 *     '@/pages/use-state/timer.tsx': () => import('@/pages/use-state/timer.tsx'),
 *     '@/pages/use-state/set-state-callback.tsx': () => import('@/pages/use-state/set-state-callback.tsx'),
 *     ...
 *   }
 */
const PAGE_MODULES = import.meta.glob<{ default: ComponentType }>('@/pages/**/*.tsx');

/**
 * [대안 1: URL path 기반 온디맨드 lazy 로더 자동 매칭 헬퍼 함수]
 * - 메뉴의 path(예: '/use-state/timer')를 파일 경로('@/pages/use-state/timer.tsx')로 변환하여
 *   일치하는 파일이 존재하면 React Router의 lazy 속성에 맞는 온디맨드 로더 함수를 반환합니다.
 * - 실제 메뉴를 클릭하는 시점에만 해당 컴포넌트의 번들 청크(.js)가 네트워크로 다운로드됩니다.
 * - 파일이 존재하지 않는 경우 undefined를 반환하여 Fallback UI가 출력되도록 안전하게 처리합니다.
 */
function getLazyComponent(path: string) {
  // Vite의 import.meta.glob은 내부 키를 '/src/pages/...' 형태로 정규화하여 관리합니다.
  const importFn =
    PAGE_MODULES[`/src/pages${path}.tsx`] ||
    PAGE_MODULES[`@/pages${path}.tsx`];

  if (!importFn) return undefined;

  // React Router v6.4+ lazy 규격: { Component } 객체를 비동기 반환
  return async () => {
    const module = await importFn();
    return { Component: module.default };
  };
}

/**
 * ============================================================================
 * [라우트 자동 생성 팩토리 함수]
 * ============================================================================
 * - 메뉴 메타데이터(Menu[])를 순회하면서 React Router의 RouteObject[] 배열을 자동 생성합니다.
 * - 1 depth 부모 그룹 및 2 depth 서브메뉴 구조를 자동으로 파싱합니다.
 * - 컴포넌트 파일이 아직 없는 메뉴는 '준비 중' 안내 UI를 자동으로 렌더링합니다.
 */
function createRoutesFromMenus(menus: Menu[]): RouteObject[] {
  return menus.map((menu) => {
    // 1. 자식(children)이 존재하는 1 depth 계층형 메뉴 (중첩 라우팅 자동 생성)
    if (menu.children && menu.children.length > 0) {
      const parentPath = menu.path.replace(/^\//, ''); // 루트 상대 경로화 (예: 'use-state')
      const firstChildRelativePath = menu.children[0].path.split('/').pop() || '';

      return {
        path: parentPath,
        children: [
          // 1depth 부모 경로(/use-state) 진입 시 첫 번째 자식 메뉴로 자동 리다이렉트
          {
            index: true,
            element: <Navigate to={firstChildRelativePath} replace />,
          },
          // 2depth 자식 라우트 목록을 import.meta.glob 기반으로 자동 연결
          ...menu.children.map((child) => {
            const childRelativePath = child.path.split('/').pop() || child.path;
            const lazyLoader = getLazyComponent(child.path);

            return {
              path: childRelativePath,
              // 파일이 존재하면 클릭 시 온디맨드로 다운로드되는 lazy 적용
              lazy: lazyLoader,
              // 파일이 아직 없는 메뉴는 안전한 Fallback UI 렌더링
              element: !lazyLoader ? (
                <div style={{ padding: '24px' }}>{child.name} 화면 준비 중입니다.</div>
              ) : undefined,
            };
          }),
        ],
      };
    }

    // 2. 자식이 없는 단일 1 depth 메뉴 (예: /menu4, /menu5)
    const relativePath = menu.path.replace(/^\//, '');
    const lazyLoader = getLazyComponent(menu.path);

    return {
      path: relativePath,
      lazy: lazyLoader,
      element: !lazyLoader ? (
        <div style={{ padding: '24px' }}>{menu.name} 화면 준비 중입니다.</div>
      ) : undefined,
    };
  });
}

/**
 * ============================================================================
 * [RouteObject[] 전체 라우팅 트리 정의]
 * ============================================================================
 * - 하위 모든 메뉴 라우트는 createRoutesFromMenus(DEFAULT_MENUS)에 의해
 *   파일 시스템과 메뉴 데이터로부터 100% 자동 생성됩니다.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    id: 'root',
    element: <AppLayout />, // 공통 헤더, 사이드바, 푸터를 렌더링하는 Base Layout
    loader: appLayoutLoader, // 화면 렌더링 전 메뉴 데이터 사전 패칭
    children: [
      // 1. Index Route (최초 진입 시 기본 시작 페이지로 리다이렉트)
      {
        index: true,
        element: <Navigate to="/use-state/timer" replace />,
      },
      // 2. 메뉴 데이터와 파일 시스템(import.meta.glob)으로부터 100% 자동 생성된 라우트 목록
      ...createRoutesFromMenus(DEFAULT_MENUS),
      // 3. Catch-all 라우트 (404 예외 처리)
      {
        path: '*',
        element: <div>페이지를 찾을 수 없습니다. (404)</div>,
      },
    ],
  },
];
