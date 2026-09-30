// src/app/routes/app-router.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

/* createBrowserRouter(): route instanse 를 생성하는 함수 */
const router = createBrowserRouter(routes);

/* RouterProvider: 생성된 route instanse 를 감싸서 React 콤포넌트로 제공하는 역할 */
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
