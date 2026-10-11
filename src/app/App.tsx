// src/app/App.tsx

import AppRouter from "./routes/app-router";
import { AppProvider } from "./providers";
import { ErrorAlert } from "@/shared/ui";

const App = () => {
  // 생성된 메뉴 정보를 담고 있는 AppRouter 객체 반환
  return (
    <AppProvider>
      <AppRouter />
      {/* 전역 에러 팝업: errorAtom 값이 설정되면 표시 (앱 전체에서 한 번만 배치) */}
      <ErrorAlert />
    </AppProvider>
  );
};

export default App;