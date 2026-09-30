// src/app/routes/routes.tsx
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AppLayout from "../layout/ui/app-layout.container";
/** RouteObject[]: 
 * 1. RouteObject (URL 경로와 해당 경로에서 보여줄 UI를 정의하는 라우팅 설정 객체의 타입)들의 배열
 * 2. route instane 를 생성하는 함수 createBrowserRouter 의 파라미터 가 RouteObject[] 타입의 배열을 받도록 설계
 * 3. 기본 속성 정의 및 자동완성 (Type Safety)
 *    - path: 매칭할 URL Path 패턴 정의 (e.g. dynamic segment, wildcard 등)
 *    - element: 공통 헤더, 사이드바, 푸터를 렌더링하는 기본 레이아웃 컴포넌트를 배치
 *    - children: Nested Routing(중첩 라우팅)을 구성하는 하위 RouteObject 배열
 *    - index: 부모 Route의 Default Route 여부 설정 (true 시 children 및 path 사용 불가)
 * 3. 중첩 라우팅(Nested Routing)의 직관적인 트리 구조화
 *    - AppLayout 과 같은 공통 레이아웃 아래 하위 메뉴들을 배치할 때,
 *      children 프로퍼티를 통해 부모-자식 관계를 트리 형태로 한눈에 파악하기 쉽습니다.
 * 4. 고급 기능(Data API & Lazy Loading) 확장 용이
 *    - loader: Route 진입 전 Data Pre-fetching을 수행하는 비동기 함수
 *      . 로그인 여부 확인, 관리자 권한 검증, 토큰 유효성 검사 등 "해당 페이지에 진입할 자격이 있는지 검증하는 관문(Guard)" 역할
 *      . 페이지 렌더링에 필요한 데이터를 미리 불러와서 화면이 빈 상태로 깜빡이는 현상 방지 (UX 향상)
 *    - action: Form submission 및 Data Mutation 자동 데이터 갱신 (Auto Revalidation) 중앙에서 정의
 *      . <Form method="post">**를 제출하거나 useSubmit()을 호출 할 때 자동으로 실행 됨
 *      . 폼 제출 후, 새로고침 없이 해당 라우트에 등록된 action 비동기 함수가 자동으로 호출됨
 *      . action 내부에서 전달받은 request.formData()를 꺼내 백엔드 API를 호출(DB 저장/수정/삭제) 함
 *      . action 완료 ➡️ React Router가 화면에 있는 모든 loader를 자동으로 다시 실행(Revalidate) ➡️ 최신 데이터로 화면 자동 동기화!
 *    - errorElement: 렌더링/데이터 로딩 에러 표시를 위한 공통 콤포넌트 (Fallback UI)
 *    - lazy: 모든 페이지를 처음에 다 다운로드하지 않고, 해당 메뉴를 클릭하는 순간에만 다운로드하여 초기 로딩 속도를 빠르게 함
 *    - handle: Breadcrumbs, Document Title 등 Route별 Custom Metadata 관리 객체
 * 5. 라우트 설정 데이터와 UI 렌더링의 분리
 *    - 라우팅 정보를 순수 데이터(배열)로 관리하므로, 권한별 메뉴 필터링(Role-based Routing)이나 동적 라우트 추가/조작이 용이해짐
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />, // 공통헤더, 사이드바, 푸터(없음)를 렌더링하는 Base Layout Component를 배치
    children: [
      // 1. Index Route (index: true) — 기본 화면 리다이렉트
      { // '/' 경로로 접근 시 '/menu1'으로 리다이렉트
        index: true,
        element: <Navigate to="/menu1" replace />,
      },
      // 2. 메뉴 라우트 (path: "menu1" ~ "menu5") — 각 메뉴별 본문 화면을 매칭
      { 
        path: "menu1",
        element: <div>메뉴 1 페이지 본문</div>, // outlet에 렌더링됨.
      },
      {
        path: "menu2",
        element: <div>메뉴 2 페이지 본문</div>, // outlet에 렌더링됨.
      },
      {
        path: "menu3",
        element: <div>메뉴 3 페이지 본문</div>, // outlet에 렌더링됨.
      },
      {
        path: "menu4",
        element: <div>메뉴 4 페이지 본문</div>, // outlet에 렌더링됨.
      },
      {
        path: "menu5",
        element: <div>메뉴 5 페이지 본문</div>, // outlet에 렌더링됨.
      },
      // 3. Catch-all 라우트 (path: "*") — 404 예외 처리
      {
        path: "*",
        element: <div>페이지를 찾을 수 없습니다. (404)</div>, // outlet에 렌더링됨.
      },
    ],
  },
];
