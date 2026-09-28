// src/app/layout/ui/Header.tsx

import "./app-header.css";

export interface TabItem {
  path: string;
  title: string;
}

interface HeaderProps {
  tabs?: TabItem[];
  activePath?: string;
  onSelectTab?: (path: string) => void;
  onCloseTab?: (path: string) => void;
}

const Header = ({ tabs = [], activePath, onSelectTab, onCloseTab }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-logo">로고</div>
      <div className="header-right">
        <nav>
          <ul className="nav-list">
            {tabs.map((tab) => {
              const isActive = activePath === tab.path;
              return (
                <li
                  key={tab.path}
                  className={`header-tab ${isActive ? "active" : ""}`.trim()}
                  onClick={() => onSelectTab?.(tab.path)}
                >
                  <span className="tab-title">{tab.title}</span>
                  <button
                    type="button"
                    className="tab-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab?.(tab.path);
                    }}
                    title={`${tab.title} 닫기`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <button className="header-logout-btn">로그아웃</button>
      </div>
    </header>
  );
};

export default Header;