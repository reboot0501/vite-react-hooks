// src/app/routes/routes.ts

import { createElement } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
  type RouteComponent,
} from '@tanstack/react-router';
import AppLayout from '../layout/ui/app-layout.container';
import {
  findFirstLeafPath,
  menuListQueryOptions,
  type Menu,
} from '@/entities/menu';
import {
  HydrateFallback,
  NotFoundComponent,
  PreparingPageFallback,
  RootErrorBoundary,
} from './ui/route-fallbacks';

/**
 * TanStack Router 전역 컨텍스트 타입 정의
 * - FSD의 app/providers에서 생성한 QueryClient를 라우터 전체(beforeLoad, loader)에 주입
 */
export interface RouterContext {
  queryClient: QueryClient;
}

/**
 * 루트 레이아웃 라우트가 loader를 통해 하위 레이아웃에 공급하는 데이터 타입
 */
export interface AppLayoutLoaderData {
  menus: Menu[];
  isError: boolean;
}

/**
 * ============================================================================
 * [Vite import.meta.glob 기반 제로-컨피그 페이지 모듈 스캔]
 * ============================================================================
 * - FSD의 pages 레이어('@/pages/') 하위 모든 화면 컴포넌트(.tsx)를 자동 수집합니다.
 * - 실제 메뉴 진입 시점에만 해당 번들 청크(.js)를 네트워크로 지연 로딩(Code Splitting)합니다.
 */
const PAGE_MODULES = import.meta.glob<{ default: RouteComponent }>(
  '@/pages/**/*.tsx',
);

/**
 * 경로(path)별 생성된 지연 로딩 컴포넌트 인스턴스 캐시
 * - 동일한 URL 경로에 대해 컴포넌트 참조 동일성(Reference Identity)을 보장하여
 *   Keep-Alive 탭 전환 시 불필요한 언마운트/리마운트를 방지합니다.
 */
const PAGE_COMPONENT_CACHE = new Map<string, RouteComponent>();

/**
 * [URL path 기반 온디맨드 lazyRouteComponent 자동 매칭 헬퍼 함수]
 * - DB(API)에서 조회한 메뉴의 path(예: '/use-state/timer')를
 *   FSD pages 레이어 파일 경로('/src/pages/use-state/timer.tsx')와 1:1 매칭합니다.
 * - 파일이 존재하면 TanStack Router의 lazyRouteComponent로 감싸 반환하고,
 *   파일이 아직 없으면 '화면 준비 중' Fallback 컴포넌트를 반환합니다.
 */
export function resolvePageComponent(
  path: string,
  menuName?: string,
): RouteComponent {
  const cached = PAGE_COMPONENT_CACHE.get(path);
  if (cached) {
    return cached;
  }

  const importFn =
    PAGE_MODULES[`/src/pages${path}.tsx`] ||
    PAGE_MODULES[`@/pages${path}.tsx`];

  const resolvedComponent: RouteComponent = importFn
    ? lazyRouteComponent(importFn)
    : () => createElement(PreparingPageFallback, { menuName: menuName ?? path });

  PAGE_COMPONENT_CACHE.set(path, resolvedComponent);
  return resolvedComponent;
}

/**
 * ============================================================================
 * [DB(API) 메뉴 데이터 기반 TanStack Router 동적 라우트 트리 생성 팩토리]
 * ============================================================================
 * - 백엔드 API(/menus)를 통해 DB(db.json)에서 읽어온 메뉴 계층 구조(Menu[])를 순회하여
 *   1-depth 부모 그룹 라우트 및 2-depth 서브메뉴 라우트를 동적으로 생성합니다.
 */
export function createRouteTreeFromMenus(
  menus: Menu[],
  initialIsError = false,
) {
  // 1. 최상위 Root Route 생성 (QueryClient 컨텍스트 주입 및 레이아웃/에러/404 설정)
  const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: AppLayout,
    pendingComponent: HydrateFallback,
    errorComponent: RootErrorBoundary,
    notFoundComponent: NotFoundComponent,
    loader: async ({ context }): Promise<AppLayoutLoaderData> => {
      if (initialIsError) {
        return { menus: [], isError: true };
      }
      try {
        // QueryClient에 사전 패칭된 메뉴 캐시가 있으면 즉시 반환하고, 없으면 API 호출
        const loadedMenus = await context.queryClient.ensureQueryData(
          menuListQueryOptions(),
        );
        return { menus: loadedMenus, isError: false };
      } catch (error) {
        console.warn('[Menu API] 서버로부터 메뉴를 가져오지 못했습니다:', error);
        return { menus: [], isError: true };
      }
    },
  });

  // 2. Index Route ('/') 진입 시 DB 메뉴의 첫 번째 Leaf 메뉴로 자동 리다이렉트
  const defaultStartPath = findFirstLeafPath(menus);
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
      throw redirect({ to: defaultStartPath, replace: true });
    },
  });

  // 3. DB에서 조회한 메뉴 목록(Menu[])을 기반으로 하위 라우트 트리 동적 생성
  const dynamicMenuRoutes = menus.map((menu) => {
    // 3-1. 자식(children)이 존재하는 1-depth 계층형 메뉴
    if (menu.children && menu.children.length > 0) {
      const parentPath = menu.path.replace(/^\//, ''); // 예: 'use-state'
      const firstChildPath = menu.children[0].path; // 예: '/use-state/timer'

      const parentRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: parentPath,
      });

      // 1-depth 부모 경로(/use-state) 단독 진입 시 첫 번째 자식 메뉴로 리다이렉트
      const parentIndexRoute = createRoute({
        getParentRoute: () => parentRoute,
        path: '/',
        beforeLoad: () => {
          throw redirect({ to: firstChildPath, replace: true });
        },
      });

      // 2-depth 자식 라우트들을 FSD pages 컴포넌트와 온디맨드 lazy 매칭
      const childRoutes = menu.children.map((child) => {
        const childRelativePath =
          child.path.split('/').pop() || child.path.replace(/^\//, '');
        const PageComponent = resolvePageComponent(child.path, child.name);

        return createRoute({
          getParentRoute: () => parentRoute,
          path: childRelativePath,
          component: PageComponent,
        });
      });

      return parentRoute.addChildren([parentIndexRoute, ...childRoutes]);
    }

    // 3-2. 자식이 없는 단일 1-depth 메뉴
    const relativePath = menu.path.replace(/^\//, '');
    const PageComponent = resolvePageComponent(menu.path, menu.name);

    return createRoute({
      getParentRoute: () => rootRoute,
      path: relativePath,
      component: PageComponent,
    });
  });

  return rootRoute.addChildren([indexRoute, ...dynamicMenuRoutes]);
}

export interface CreateAppRouterParams {
  menus: Menu[];
  queryClient: QueryClient;
  isError?: boolean;
}

/**
 * DB 메뉴 데이터와 QueryClient 컨텍스트를 결합하여 TanStack Router 인스턴스를 생성합니다.
 */
export function createAppRouter({
  menus,
  queryClient,
  isError = false,
}: CreateAppRouterParams) {
  const routeTree = createRouteTreeFromMenus(menus, isError);

  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  });
}

export type AppRouterInstance = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouterInstance;
  }
}

