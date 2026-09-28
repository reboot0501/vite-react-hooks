// src/app/routes/routes.tsx

import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AppLayout from "../layout/ui/app-layout.container";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/menu1" replace />,
      },
      {
        path: "menu1",
        element: <div>메뉴 1 페이지 본문</div>,
      },
      {
        path: "menu2",
        element: <div>메뉴 2 페이지 본문</div>,
      },
      {
        path: "menu3",
        element: <div>메뉴 3 페이지 본문</div>,
      },
      {
        path: "menu4",
        element: <div>메뉴 4 페이지 본문</div>,
      },
      {
        path: "menu5",
        element: <div>메뉴 5 페이지 본문</div>,
      },
      {
        path: "*",
        element: <div>페이지를 찾을 수 없습니다. (404)</div>,
      },
    ],
  },
];
