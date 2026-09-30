// src/app/layout/ui/app-header.tsx
// shared 이미지 참조시 단축 경로 사용
import { viteLogo } from "@/shared/assets";
import "./app-header.css";

export interface TabItem {
  path: string;
  title: string;
}

interface HeaderProps {
  // 열러진 메뉴 텝 들
  tabs?: TabItem[];
  //  현재 활성화된 탭의 경로
  activePath?: string;
  // 탭 선택 시 호출될 콜백 함수
  onSelectTab?: (path: string) => void;
  // 탭 닫기 시 호출될 콜백 함수
  onCloseTab?: (path: string) => void;
}

const Header = ({ tabs, activePath, onSelectTab, onCloseTab }: HeaderProps) => {
  return (
    <header className="page-header">
      <div className="page-header-logo">
        <img src={viteLogo} alt="로고" className="header-logo-img" />
      </div>
      <div className="page-header-right">
        <nav>
          <ul className="nav-list">
            {/* tabs 배열을 Looping 으로 li Tag 생성  */}
            {tabs?.map((tab) => { // 예전에는 기본값을 [] 로 주거나 tabs && 로 처리했음
              // 현재 활성화된 탭 path 와 텝 path 를 비교하여 같으면
              const isActive = activePath === tab.path;
              return (
                <li
                  key={tab.path}
                  // 현재 활성화된 탭이면 page-header-tab.active 클래스 추가 아니면 page-header-tab 클래스만 추가
                  className={`page-header-tab ${isActive ? "active" : ""}`.trim()}
                  // Tab 클릭 시 해당 페이지로 이동하는 부모 컴포넌트의 콜백 함수 호출
                  onClick={() => onSelectTab?.(tab.path)}
                >
                  {/* 텝 페이지 title 표시 */}
                  <span className="tab-title">{tab.title}</span>
                  {/* Tab 닫기 버튼 x 표시 */}
                  <button
                    type="button"
                    className="tab-close-btn"
                    onClick={(e) => {
                      // 이벤트 버블링 방지 : 클릭 이벤트가 부모 요소(li)로 전파되는 것을 막는 기능
                      e.stopPropagation();
                      // 탭 닫기 x 클릭시 부모 컴포넌트의 콜백 함수 호출
                      onCloseTab?.(tab.path);
                    }}
                    // 툴팁 : 탭 닫기 버튼 위에 마우스를 올렸을 때 표시되는 텍스트
                    title={`${tab.title} 닫기`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <button className="page-header-logout-btn">로그아웃</button>
      </div>
    </header>
  );
};

export default Header;