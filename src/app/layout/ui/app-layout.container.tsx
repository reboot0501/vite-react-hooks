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
  const location = useLocation();
  const navigate = useNavigate();

  // 열려있는 Tab 리스트 상태
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const title = MENU_TITLES[location.pathname] ?? '메뉴1';
    const path = MENU_TITLES[location.pathname] ? location.pathname : '/menu1';
    return [{ path, title }];
  });

  // LNB 메뉴 클릭이나 URL 변경 시 Tab에 없으면 자동 추가
  useEffect(() => {
    const title = MENU_TITLES[location.pathname];
    if (title) {
      setTabs((prev) => {
        if (prev.some((tab) => tab.path === location.pathname)) {
          return prev;
        }
        return [...prev, { path: location.pathname, title }];
      });
    }
  }, [location.pathname]);

  // Tab 클릭 시 해당 페이지로 라우팅
  const handleSelectTab = (path: string) => {
    navigate(path);
  };

  // Tab 삭제 (X 아이콘 클릭)
  const handleCloseTab = (pathToRemove: string) => {
    const targetIndex = tabs.findIndex((tab) => tab.path === pathToRemove);
    const updatedTabs = tabs.filter((tab) => tab.path !== pathToRemove);
    setTabs(updatedTabs);

    // 닫은 탭이 현재 보고 있던 페이지일 경우
    if (location.pathname === pathToRemove) {
      if (updatedTabs.length > 0) {
        // 인접 탭(이전 탭 우선)으로 이동
        const nextActiveIndex = Math.max(0, targetIndex - 1);
        navigate(updatedTabs[nextActiveIndex].path);
      } else {
        // 모든 탭이 닫히면 기본 메뉴1로 이동
        navigate('/menu1');
      }
    }
  };

  const currentTitle = MENU_TITLES[location.pathname] ?? '메인 콘텐츠';

  return (
    <div className="page-wrapper">
      <Header
        tabs={tabs}
        activePath={location.pathname}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
      />
      <div className="page-body">
        <Sidebar className="app-sidebar" />
        <Main
          className="app-main"
          title={currentTitle}
        />
      </div>
    </div>
  );
};

export default AppLayout;