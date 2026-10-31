// src/app/layout/ui/app-layout.container.tsx

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  useLocation,
  useNavigate,
  useLoaderData,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { findFirstLeafPath, flattenMenuTitles } from '@/entities/menu';
import {
  resolvePageComponent,
  type AppLayoutLoaderData,
} from '@/app/routes/routes';
import Main from './app-main';
import Header, { type TabItem } from './app-header';
import Sidebar from './app-sidebar';
import './app-layout.container.css';

/**
 * 실무 표준 권장 정책: 최대 동시 오픈 가능 탭 개수 (5개)
 */
const MAX_TABS = 5;

/**
 * 경로에 매칭되는 FSD pages 지연 로딩 컴포넌트를 Suspense로 감싼 엘리먼트로 생성
 */
function createTabElement(path: string, title?: string): ReactNode {
  const PageComponent = resolvePageComponent(path, title);
  return (
    <Suspense
      fallback={<div style={{ padding: '24px' }}>화면 로딩 중...</div>}
    >
      <PageComponent />
    </Suspense>
  );
}

const AppLayout = () => {
  const router = useRouter();
  // "현재 어디에 있는가?" (TanStack Router 위치 정보 조회)
  const location = useLocation();
  // "어디로 갈 것인가?" (TanStack Router 화면 이동 기능)
  const navigate = useNavigate();

  // 직전 활성화 탭 경로 기록 (최대 탭 수 초과 시 롤백용)
  const prevActivePathRef = useRef<string>(location.pathname);

  // TanStack Router Root Route loader가 사전 패칭한 메뉴 데이터 수신
  const loaderData = useLoaderData({ from: '__root__' }) as
    | AppLayoutLoaderData
    | undefined;
  const isError = loaderData?.isError ?? false;
  const menus = useMemo(() => loaderData?.menus ?? [], [loaderData?.menus]);

  // 라우트 전환 및 loader 비동기 처리 중 로딩 상태 감지 (실무 필수 UX)
  const isLoading = useRouterState({
    select: (state) => state.isLoading,
  });

  // loader로 전달받은 메뉴 목록(계층형 포함)을 기반으로 경로별 제목 매핑 객체(O(1) 룩업) 동적 생성
  const menuTitles = useMemo<Record<string, string>>(() => {
    if (isError || !menus.length) return {};
    return flattenMenuTitles(menus);
  }, [menus, isError]);

  // DB 메뉴 기반 기본 시작 경로 (예: '/use-state/timer')
  const defaultStartPath = useMemo(() => findFirstLeafPath(menus), [menus]);

  /**
   * 열려있는 Tab 리스트 상태 관리 (Lazy Initial State, 지연 초기화)
   * - 최초 마운트 시 현재 URL(location.pathname)을 확인하여 초기 탭 구성
   */
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const path = menuTitles[location.pathname]
      ? location.pathname
      : defaultStartPath;
    const title = menuTitles[path] ?? 'useState-timer';
    return [{ path, title }];
  });

  /**
   * 각 탭 경로(path)별로 렌더링된 컴포넌트 엘리먼트를 캐싱 (Keep-Alive 저장소)
   */
  const [outletCache, setOutletCache] = useState<Record<string, ReactNode>>(
    () => {
      const path = menuTitles[location.pathname]
        ? location.pathname
        : defaultStartPath;
      const title = menuTitles[path] ?? 'useState-timer';
      return {
        [path]: createTabElement(path, title),
      };
    },
  );

  // TanStack Router 네비게이션 완료 이벤트(onResolved) 구독을 통한 탭 추가, Keep-Alive 캐싱 및 최대 탭 개수 제한
  useEffect(() => {
    return router.subscribe('onResolved', ({ toLocation }) => {
      const targetPath = toLocation.pathname;
      const title = menuTitles[targetPath];
      if (!title) return;

      setTabs((prev) => {
        // 1. 이미 열려있는 탭인 경우 그대로 유지
        if (prev.some((tab) => tab.path === targetPath)) {
          prevActivePathRef.current = targetPath;
          setOutletCache((cachePrev) => {
            if (cachePrev[targetPath]) return cachePrev;
            return {
              ...cachePrev,
              [targetPath]: createTabElement(targetPath, title),
            };
          });
          return prev;
        }

        // 2. [실무 Best Practice] 최대 탭 개수 초과 시 오픈 차단 및 직전 탭으로 롤백
        if (prev.length >= MAX_TABS) {
          alert(
            `탭은 최대 ${MAX_TABS}개까지만 열 수 있습니다.\n기존 탭을 먼저 닫은 후 다시 시도해 주세요.`,
          );
          navigate({ to: prevActivePathRef.current, replace: true });
          return prev;
        }

        // 3. 신규 탭 추가 및 Keep-Alive 캐시에 화면 인스턴스 등록
        prevActivePathRef.current = targetPath;
        setOutletCache((cachePrev) => {
          if (cachePrev[targetPath]) return cachePrev;
          return {
            ...cachePrev,
            [targetPath]: createTabElement(targetPath, title),
          };
        });
        return [...prev, { path: targetPath, title }];
      });
    });
  }, [router, menuTitles, navigate]);

  // Tab 클릭 시 해당 페이지로 라우팅
  const handleSelectTab = (path: string) => {
    navigate({ to: path });
  };

  // Tab 삭제 (X 아이콘 클릭)
  const handleCloseTab = (pathToRemove: string) => {
    // 1. 삭제할 탭의 인덱스 위치 검색
    const targetIndex = tabs.findIndex((tab) => tab.path === pathToRemove);
    if (targetIndex === -1) return;

    // 2. Spread(...) 연산자와 slice()를 활용한 불변성 유지 삭제
    const updatedTabs = [
      ...tabs.slice(0, targetIndex),
      ...tabs.slice(targetIndex + 1),
    ];
    setTabs(updatedTabs);

    // [메모리 해제] 닫힌 탭의 컴포넌트 인스턴스를 캐시에서 완전히 제거하여 GC 유도
    setOutletCache((prev) => {
      const next = { ...prev };
      delete next[pathToRemove];
      return next;
    });

    // 3. 삭제한 탭이 현재 활성화되어 보고 있던 페이지일 경우 후속 라우팅 처리
    if (location.pathname === pathToRemove) {
      if (updatedTabs.length > 0) {
        // 인접 탭(닫힌 탭의 이전 탭 우선, 맨 앞이었으면 0번 탭)으로 자동 이동
        const nextActiveIndex = Math.max(0, targetIndex - 1);
        navigate({ to: updatedTabs[nextActiveIndex].path });
      } else {
        // 열려있는 모든 탭이 닫히면 기본 시작 페이지로 복귀
        navigate({ to: defaultStartPath });
      }
    }
  };

  // menuTitles[location.pathname] 의 값이 null이거나 undefined이면 Fallback 표시
  const currentTitle = isError
    ? '오류 안내'
    : (menuTitles[location.pathname] ?? '메인 콘텐츠');

  return (
    <div className="page-wrapper">
      {/* 라우트 이동 및 loader 비동기 처리 중 상단 글로벌 로딩 진행 표시줄 표시 */}
      {isLoading && <div className="global-loading-bar" />}
      <Header
        tabs={tabs}
        activePath={location.pathname}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
      />
      <div className="page-body">
        {/* 사이드바 영역에 loader로 패칭한 menus 데이터 및 에러 상태 전달 */}
        <Sidebar menus={menus} isError={isError} />
        {/* Keep-Alive 캐시 및 열린 탭 정보를 Main 컴포넌트에 전달 */}
        <Main
          title={currentTitle}
          isError={isError}
          tabs={tabs}
          activePath={location.pathname}
          outletCache={outletCache}
        />
      </div>
    </div>
  );
};

export default AppLayout;
