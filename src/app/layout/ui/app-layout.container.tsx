import { useState, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useLoaderData, useNavigation, useOutlet } from 'react-router-dom';
import { flattenMenuTitles } from '@/entities/menu';
import type { AppLayoutLoaderData } from '@/app/routes/routes';
import Main from './app-main';
import Header, { type TabItem } from './app-header';
import Sidebar from './app-sidebar';
import './app-layout.container.css';

/**
 * 실무 표준 권장 정책: 최대 동시 오픈 가능 탭 개수 (10개)
 */
const MAX_TABS = 10;

const AppLayout = () => {
  // "현재 어디에 있는가?" (위치 정보 조회)
  const location = useLocation();
  // "어디로 갈 것인가?" (화면 이동 기능)
  const navigate = useNavigate();

  // React Router v6/v7 현재 매칭된 자식 라우트의 엘리먼트 추출 (Keep-Alive 용)
  const currentOutlet = useOutlet();

  // 각 탭 경로(path)별로 렌더링된 컴포넌트 엘리먼트를 캐싱 (Keep-Alive 저장소)
  const [outletCache, setOutletCache] = useState<Record<string, ReactNode>>({});

  // 직전 활성화 탭 경로 기록 (최대 탭 수 초과 시 롤백용)
  const prevActivePathRef = useRef<string>(location.pathname);

  // React Router loader가 사전 패칭한 메뉴 데이터 수신
  const loaderData = useLoaderData() as AppLayoutLoaderData | undefined;
  const isError = loaderData?.isError ?? false;
  // loaderData?.menus 가 undefined이면 빈 배열로 초기화 (?? : 연산자 활용)
  const menus = loaderData?.menus ?? [];

  // 라우트 전환 및 loader 비동기 처리 중 로딩 상태 감지 (실무 필수 UX)
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  // loader로 전달받은 메뉴 목록(계층형 포함)을 기반으로 경로별 제목 매핑 객체(O(1) 룩업) 동적 생성
  const menuTitles = useMemo<Record<string, string>>(() => {
    if (isError || !menus.length) return {};
    return flattenMenuTitles(menus);
  }, [menus, isError]);

  /** 열려있는 Tab 리스트 상태 관리 (Lazy Initial State, 지연 초기화)
   * 1. useState에 함수 () => { ... }를 넘기면, 컴포넌트가 처음 화면 Rendering 될 때만 이 함수가 실행
   * 2. 이후 다른 State 가 변경이 되더라도 이 함수로 정의된 Callback 함수는 다시 실행되지 않는다.
   * 3. 이 예제에서는 초기값을 계산하는 함수를 인자로 전달하여, 최초 마운트 시 location.pathname 을 확인하여 초기 탭 구성
   */
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    // useLocation() React Router Hook 으로 현재 URL 의 정보를 location 에 할당
    const title = menuTitles[location.pathname] ?? 'useState-timer';
    const path = menuTitles[location.pathname] ? location.pathname : '/use-state/timer';
    return [{ path, title }];
  });

  // 1. 현재 라우트 엘리먼트를 캐시(outletCache)에 등록 (Keep-Alive 화면 보존)
  useEffect(() => {
    if (currentOutlet && location.pathname) {
      setOutletCache((prev) => {
        if (prev[location.pathname] === currentOutlet) return prev;
        return {
          ...prev,
          [location.pathname]: currentOutlet,
        };
      });
    }
  }, [location.pathname, currentOutlet]);

  // 2. LNB 메뉴 클릭이나 URL 변경 시 Tab 자동 추가 & 최대 탭 개수(10개) 제약 검증
  useEffect(() => {
    const title = menuTitles[location.pathname];
    if (!title) return;

    setTabs((prev) => {
      // 이미 열려있는 탭인 경우 그대로 유지
      if (prev.some((tab) => tab.path === location.pathname)) {
        prevActivePathRef.current = location.pathname;
        return prev;
      }

      // [실무 Best Practice] 최대 탭 개수(10개) 초과 시 오픈 차단 및 사용자 안내
      if (prev.length >= MAX_TABS) {
        alert(`탭은 최대 ${MAX_TABS}개까지만 열 수 있습니다.\n기존 탭을 먼저 닫은 후 다시 시도해 주세요.`);
        // 직전에 보던 탭으로 되돌리기 (롤백)
        navigate(prevActivePathRef.current, { replace: true });
        return prev;
      }

      // 신규 탭 추가 및 활성 경로 기록
      prevActivePathRef.current = location.pathname;
      return [...prev, { path: location.pathname, title }];
    });
  }, [location.pathname, menuTitles, navigate]);

  // Tab 클릭 시 해당 페이지로 라우팅
  const handleSelectTab = (path: string) => {
    // 화면 이동 기능 React Router Hook 의 navigate 함수를 사용하여 해당 페이지로 이동
    navigate(path);
  };

  // Tab 삭제 (X 아이콘 클릭)
  const handleCloseTab = (pathToRemove: string) => {
    // 1. 삭제할 탭의 인덱스 위치 검색
    const targetIndex = tabs.findIndex((tab) => tab.path === pathToRemove);
    if (targetIndex === -1) return; // 탭을 찾지 못하면 중단

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
        navigate(updatedTabs[nextActiveIndex].path);
      } else {
        // 열려있는 모든 탭이 닫히면 기본 시작 페이지(/use-state/timer)로 복귀
        navigate('/use-state/timer');
      }
    }
  };

  // menuTitles[location.pathname] 의 값이 null이거나 undefined이면 Fallback 표시
  const currentTitle = isError ? '오류 안내' : (menuTitles[location.pathname] ?? '메인 콘텐츠');

  return (
    <div className="page-wrapper">
      {/* 라우트 이동 및 loader 비동기 처리 중 상단 글로벌 로딩 진행 표시줄 표시 */}
      {isLoading && <div className="global-loading-bar" />}
      <Header
        // 열려있는 탭 리스트를 자식 컴포넌트에게 전달
        tabs={tabs}
        // 현재 활성화된 탭의 경로를 자식 컴포넌트에게 전달
        activePath={location.pathname}
        // 탭 클릭 시 해당 페이지로 이동하는 콜백 함수를 자식 컴포넌트에게 전달
        onSelectTab={handleSelectTab}
        // 탭 닫기 클릭시 탭 닫는 콜백 함수를 자식 컴포넌트에게 전달
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