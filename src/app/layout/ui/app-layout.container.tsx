import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Main from './app-main';
import Header, { type TabItem } from './app-header';
import Sidebar from './app-sidebar';
import './app-layout.container.css';

const MENU_TITLES: Record<string, string> = {
  '/menu1': '메뉴1',
  '/menu2': '메뉴2',
  '/menu3': '메뉴3',
  '/menu4': '메뉴4',
  '/menu5': '메뉴5',
};

const AppLayout = () => {
  // "현재 어디에 있는가?" (위치 정보 조회)
  const location = useLocation();
  // "어디로 갈 것인가?" (화면 이동 기능)
  const navigate = useNavigate();

  /** 열려있는 Tab 리스트 상태 관리 (Lazy Initial State, 지연 초기화)
   * 1. useState에 함수 () => { ... }를 넘기면, 컴포넌트가 처음 화면 Rendering 될 때만 이 함수가 실행
   * 2. 이후 다른 State 가 변경이 되더라도 이 함수로 정의된 Callback 함수는 다시 실행되지 않는다.
   * 3. 이 예제에서는 초기값을 계산하는 함수를 인자로 전달하여, 최초 마운트 시 location.pathname 을 확인하여 
   */
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    // useLocation() React Router Hook 으로 현재 URL 의 정보를 location 에 할당
    // /menu1 ➡️ /menu2 로 변경
    const title = MENU_TITLES[location.pathname] ?? '메뉴1';
    const path = MENU_TITLES[location.pathname] ? location.pathname : '/menu1';
    return [{ path, title }];
  });

  // LNB 메뉴 클릭이나 URL 변경 시 Tab에 없으면 자동 추가
  useEffect(() => {
    const title = MENU_TITLES[location.pathname];
    if (title) {
      setTabs((prev) => {
        // 이전에 열려있는 탭들의 path 와 현재 선택한 path 비교하여 같은 것이 있으면
        // 탭을 추가하지 않고 이전 탭 객체 전체 반환
        if (prev.some((tab) => tab.path === location.pathname)) {
          return prev;
        }
        // 새로운 탭 추가하여 탭 객체 전체 반환
        return [...prev, { path: location.pathname, title }];
      });
    }
  }, [location.pathname]); // 현재 위치 pathname이 변경될 때마다 실행

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
    // - 두 배열 조각을 펼쳐서 대상 탭만 제외된 새로운 배열을 생성 (filter 대비 전체 순회 방지)
    const updatedTabs = [
      ...tabs.slice(0, targetIndex), // - tabs.slice(0, targetIndex): 삭제 대상 이전의 탭들
      ...tabs.slice(targetIndex + 1), // - tabs.slice(targetIndex + 1): 삭제 대상 이후의 탭들
    ];
    setTabs(updatedTabs);
    // 3. 삭제한 탭이 현재 활성화되어 보고 있던 페이지일 경우 후속 라우팅 처리
    if (location.pathname === pathToRemove) {
      if (updatedTabs.length > 0) {
        // 인접 탭(닫힌 탭의 이전 탭 우선, 맨 앞이었으면 0번 탭)으로 자동 이동
        const nextActiveIndex = Math.max(0, targetIndex - 1);
        navigate(updatedTabs[nextActiveIndex].path);
      } else {
        // 열려있는 모든 탭이 닫히면 기본 시작 페이지(/menu1)로 복귀
        navigate('/menu1');
      }
    }
  };
  // MENU_TITLES[location.pathname] 의 값이 null이거나 undefined이면 ➡️ 오른쪽 인 '메인 콘텐츠' 표시
  const currentTitle = MENU_TITLES[location.pathname] ?? '메인 콘텐츠';

  return (
    <div className="page-wrapper">
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
        {/* 사이드바 영역에 Sidebar 컴포넌트를 렌더링합니다. */}
        <Sidebar />
        {/* 현재 선택된 메뉴에 대한 title 값을 자식 컴포넌트에게 전달 */}
        <Main title={currentTitle} />
      </div>
    </div>
  );
};

export default AppLayout;