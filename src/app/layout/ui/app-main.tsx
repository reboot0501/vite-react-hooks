import type { ReactNode } from "react";
import type { TabItem } from "./app-header";
import "./app-main.css";

interface MainProps {
  /**
   * 페이지 메인 타이틀 (필수 Prop)
   * - 부모 컨테이너(AppLayout)에서 URL(location.pathname) 매핑 및 
   *   Fallback(?? '메인 콘텐츠') 처리를 완료한 확정된 제목 문자열을 전달받음
   */
  title: string;
  /** 서버 오류 등 예외 발생 시 true */
  isError?: boolean;
  /** 현재 열려있는 탭 목록 (Keep-Alive 다중 탭 지원) */
  tabs?: TabItem[];
  /** 현재 활성화된 탭의 경로 */
  activePath?: string;
  /** 각 탭 경로별로 캐싱된 라우트 컴포넌트 엘리먼트 맵 */
  outletCache?: Record<string, ReactNode>;
}

/**
 * 메인 콘텐츠 영역을 담당하는 프레젠테이션 컴포넌트(Presentational Component)
 * - 부모로부터 전달받은 title을 상단 헤더에 표출
 * - 각 탭별 화면 인스턴스(outletCache)를 보존하며, 활성 탭만 display: block으로 노출 (Keep-Alive)
 */
const Main = ({
  title,
  isError = false,
  tabs = [],
  activePath = "",
  outletCache = {},
}: MainProps) => {
  return (
    <main className="app-main">
      <section className="main-header">
        {/* 부모(AppLayout)가 전달한 확정된 페이지 타이틀 표출 */}
        <h3>{title}</h3>
      </section>
      <section className="main-content">
        {isError ? (
          <div className="main-error-fallback">
            <div className="main-error-icon">🚫</div>
            <h4 className="main-error-title">화면 로딩 실패</h4>
            <p className="main-error-message">
              서버와의 통신에 실패하여 화면 콘텐츠를 불러올 수 없습니다.
            </p>
          </div>
        ) : (
          /* Keep-Alive: 열려있는 탭들을 DOM에 유지하고 활성 탭만 노출 */
          tabs.map((tab) => (
            <div
              key={tab.path}
              className="tab-content-panel"
              style={{
                display: tab.path === activePath ? "block" : "none",
                height: "100%",
              }}
            >
              {outletCache[tab.path]}
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Main;
