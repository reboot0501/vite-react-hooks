// src/app/routes/ui/route-fallbacks.tsx

import styles from '../routes.module.css';

/**
 * 애플리케이션 초기화 및 라우트 대기 시 표시할 공통 Fallback 컴포넌트
 */
export const HydrateFallback = () => (
  <div className={styles.hydrateFallback}>
    애플리케이션을 초기화하는 중입니다...
  </div>
);

/**
 * 루트 라우트의 데이터 로딩 또는 렌더링 에러를 포착하는 에러 바운더리 컴포넌트
 */
export const RootErrorBoundary = () => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>🚨</div>
        <h2 className={styles.errorTitle}>서버 오류 입니다.</h2>
        <p className={styles.errorDescription}>
          백엔드 서버(<code>http://localhost:4000</code>)와 연결할 수 없습니다.
          <br />
          Mock 서버가 켜져 있는지 확인해 주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
};

/**
 * 404 Not Found 화면 컴포넌트
 */
export const NotFoundComponent = () => (
  <div className={styles.fallbackMessage}>
    페이지를 찾을 수 없습니다. (404)
  </div>
);

/**
 * 아직 페이지 컴포넌트 파일이 생성되지 않은 메뉴 진입 시 표시할 안내 컴포넌트
 */
export const PreparingPageFallback = ({ menuName }: { menuName: string }) => (
  <div className={styles.fallbackMessage}>
    {menuName} 화면 준비 중입니다.
  </div>
);

