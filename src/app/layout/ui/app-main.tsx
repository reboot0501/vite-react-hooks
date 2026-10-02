import { Outlet } from "react-router-dom";
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
}

/**
 * 메인 콘텐츠 영역을 담당하는 프레젠테이션 컴포넌트(Presentational Component)
 * - 부모로부터 전달받은 title을 상단 헤더에 표출
 * - React Router의 <Outlet />을 통해 현재 URL에 해당하는 실제 자식 페이지를 렌더링
 */
const Main = ({ title, isError = false }: MainProps) => {
  return (
    <main className="app-main">
      <section className="main-header">
        {/* 부모(AppLayout)가 전달한 확정된 페이지 타이틀 표출 */}
        <h3>{title}</h3>
      </section>
      <section className="main-content">
        {isError ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '320px',
              color: '#4b5563',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #e5e7eb',
              margin: '20px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚫</div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1f2937' }}>화면 로딩 실패</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              서버와의 통신에 실패하여 화면 콘텐츠를 불러올 수 없습니다.
            </p>
          </div>
        ) : (
          /* Outlet 위치에 React Router의 현재 URL에 매칭된 하위 라우트 컴포넌트를 표출 */
          <Outlet />
        )}
      </section>
    </main>
  );
};

export default Main;
