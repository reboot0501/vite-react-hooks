import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { DEFAULT_MENUS, type Menu } from "@/entities/model/menu.entity";
import "./app-sidebar.css";

interface SidebarProps {
  menus?: Menu[];
}

const Sidebar = ({ menus = DEFAULT_MENUS }: SidebarProps) => {
  const location = useLocation();

  // 현재 열려있는 1depth 메뉴 식별자 (단일 아코디언: 한 번에 단 하나의 1depth만 열림)
  const [openMenuId, setOpenMenuId] = useState<string | null>(() => {
    // 최초 마운트 시 현재 URL이 속한 1depth 메뉴를 찾아 기본 열림 상태로 지정
    const activeParent = menus.find((item) =>
      item.children?.some((child) => child.path === location.pathname)
    );
    return activeParent ? (activeParent.id || activeParent.name) : null;
  });

  // URL 변경 시 현재 경로가 속한 1depth 메뉴가 있다면 해당 메뉴만 열림 유지 및 동기화
  useEffect(() => {
    const activeParent = menus.find((item) =>
      item.children?.some((child) => child.path === location.pathname)
    );
    if (activeParent) {
      setOpenMenuId(activeParent.id || activeParent.name);
    }
  }, [location.pathname, menus]);

  // 1depth 메뉴 클릭 핸들러 (토글 기능: 다른 1depth 클릭 시 기존 열린 1depth는 자동 닫힘)
  const handleToggleDepth1 = (menuKey: string) => {
    setOpenMenuId((prev) => (prev === menuKey ? null : menuKey));
  };

  // 자식이 없는 일반 1depth 메뉴 클릭 시 열려있던 아코디언 메뉴 닫기
  const handleLeaf1DepthClick = () => {
    setOpenMenuId(null);
  };

  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-nav-list">
          {menus.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const menuKey = item.id || item.name;
            const isOpen = openMenuId === menuKey;

            // 자식(2 depth)을 가진 1 depth 메뉴 (클릭 시 2depth 서브메뉴 노출 및 아코디언 동작)
            if (hasChildren) {
              const isChildActive = item.children!.some(
                (child) => child.path === location.pathname
              );

              return (
                <li key={menuKey} className="sidebar-nav-group">
                  {/* 1depth 클릭 버튼: 클릭 시 해당 서브메뉴만 열리고 기존 서브메뉴는 닫힘 */}
                  <button
                    type="button"
                    className={`sidebar-group-btn ${isOpen ? "open" : ""} ${isChildActive ? "active" : ""}`}
                    onClick={() => handleToggleDepth1(menuKey)}
                  >
                    <span className="sidebar-group-name">{item.name}</span>
                    <span className="sidebar-group-arrow">{isOpen ? "▾" : "▸"}</span>
                  </button>

                  {/* 1depth가 열려있을 때만 2depth 메뉴 노출 */}
                  {isOpen && (
                    <ul className="sidebar-sub-list">
                      {item.children!.map((subItem) => (
                        <li key={subItem.path}>
                          {/* leaf node 2depth 메뉴 클릭 시에만 해당 화면 컴포넌트 온디맨드(lazy) 로딩 */}
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `sidebar-nav-link ${isActive ? "active" : ""}`.trim()
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // 자식이 없는 일반 1 depth 메뉴
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleLeaf1DepthClick}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? "active" : ""}`.trim()
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;