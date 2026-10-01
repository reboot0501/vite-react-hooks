`react-router-dom`의 이 네 가지는 **React Router v6.4+의 Data Router 방식**을 이해하는 핵심입니다.

먼저 관계를 한눈에 보면 다음과 같습니다.

```text
RouteObject
    │
    │ 여러 개를 배열로 정의
    ▼
createBrowserRouter()
    │
    │ Router 생성
    ▼
RouterProvider
    │
    │ Router를 React 앱에 연결
    ▼
브라우저 URL
    │
    ├── /          → Home
    ├── /users     → Users
    └── /login     → Login
                      │
                      └── Navigate → 다른 경로로 이동
```

---

# 1. 전체 예제부터 보기

가장 기본적인 구조부터 보겠습니다.

```tsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

function Home() {
  return <h1>Home</h1>;
}

function Users() {
  return <h1>Users</h1>;
}

function Login() {
  return <h1>Login</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

여기에서 역할은 아주 단순합니다.

| 구성                      | 역할                           |
| ----------------------- | ---------------------------- |
| `RouteObject`           | URL과 컴포넌트의 연결 정보를 표현         |
| `createBrowserRouter()` | RouteObject들을 이용해서 Router 생성 |
| `RouterProvider`        | 생성한 Router를 React 앱에 공급      |
| `Navigate`              | 현재 URL을 다른 URL로 이동           |

---

# 2. RouteObject

## 2-1. RouteObject란?

`RouteObject`는 쉽게 말하면

> **"이 URL로 들어오면 어떤 컴포넌트를 보여줄 것인가?"**

를 JavaScript 객체로 표현한 것입니다.

예를 들어:

```tsx
const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
];
```

각 객체가 하나의 Route입니다.

```text
path          element
────────────────────────
"/"       →   <Home />
"/users"  →   <Users />
```

TypeScript에서는 다음과 같이 타입을 명시할 수도 있습니다.

```tsx
import type { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
];
```

보통은 `RouteObject[]`를 직접 쓰지 않아도 TypeScript가 추론하기 때문에 다음처럼 작성해도 됩니다.

```tsx
const routes = [
  {
    path: "/",
    element: <Home />,
  },
];
```

---

# 3. RouteObject의 기본 구조

가장 기본적인 형태는 이것입니다.

```tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
];
```

여기서:

```tsx
{
  path: "/",
  element: <Home />,
}
```

가 하나의 RouteObject입니다.

---

## 3-1. path

```tsx
{
  path: "/users",
  element: <Users />,
}
```

브라우저 URL이:

```text
http://localhost:5173/users
```

이면

```tsx
<Users />
```

를 렌더링합니다.

---

## 3-2. element

```tsx
{
  path: "/users",
  element: <Users />,
}
```

여기서 `element`에는 **JSX**가 들어갑니다.

즉:

```tsx
element: <Users />
```

입니다.

다음과 혼동하면 안 됩니다.

```tsx
// ❌
element: Users

// ✅
element: <Users />
```

---

# 4. children을 이용한 중첩 라우팅

`RouteObject`에서 상당히 중요한 기능입니다.

예를 들어 다음과 같은 화면을 만든다고 하겠습니다.

```text
/
├── dashboard
├── users
│   ├── list
│   └── detail
└── settings
```

라우터를 다음처럼 구성할 수 있습니다.

```tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];
```

중요한 부분이 있습니다.

부모가:

```tsx
path: "/"
```

이고 자식이:

```tsx
path: "users"
```

이면 결과 URL은:

```text
/users
```

입니다.

자식에는 보통 `/`를 붙이지 않습니다.

```tsx
// 일반적인 중첩 Route
{
  path: "users",
  element: <Users />,
}
```

---

# 5. Outlet과 children의 관계

그런데 여기서 하나 더 알아야 합니다.

부모 컴포넌트인 `Layout`에는:

```tsx
<Outlet />
```

이 필요합니다.

```tsx
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>Header</header>

      <div className="page-body">
        <aside>LNB</aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

그러면 구조가:

```text
Layout
│
├── Header
│
├── LNB
│
└── Outlet
      │
      ├── Dashboard
      ├── Users
      └── Settings
```

가 됩니다.

예를 들어 URL이:

```text
/users
```

이면:

```text
Layout
 ├── Header
 ├── LNB
 └── Outlet
       └── Users
```

가 됩니다.

---

# 6. createBrowserRouter

이제 `RouteObject`를 실제 Router로 만들어야 합니다.

```tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
];

const router = createBrowserRouter(routes);
```

즉:

```text
RouteObject[]
       │
       ▼
createBrowserRouter()
       │
       ▼
Router
```

입니다.

---

# 7. createBrowserRouter는 무엇을 하는가?

쉽게 표현하면:

> **라우팅 규칙을 받아서 브라우저 URL을 관리하는 Router를 생성합니다.**

예를 들어:

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
]);
```

Router는 다음과 같은 관계를 알고 있습니다.

```text
URL                  Component

/                    Home
/users               Users
```

그리고 브라우저의 History API를 이용해서 URL 변경과 라우팅을 관리합니다.

---

# 8. RouterProvider

`createBrowserRouter()`로 Router를 만들었다고 끝이 아닙니다.

React 애플리케이션에 Router를 공급해야 합니다.

그 역할을 하는 것이:

```tsx
<RouterProvider />
```

입니다.

```tsx
const router = createBrowserRouter(routes);

function App() {
  return (
    <RouterProvider router={router} />
  );
}
```

관계를 보면:

```text
RouteObject[]
     │
     ▼
createBrowserRouter()
     │
     ▼
router
     │
     ▼
<RouterProvider router={router} />
     │
     ▼
React Application
```

---

# 9. main.tsx에서 사용하는 경우

실제 프로젝트에서는 보통 `App.tsx`보다 `main.tsx`에서 처리하기도 합니다.

예:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

이 경우:

```text
main.tsx
   │
   └── RouterProvider
          │
          └── Router
                 │
                 ├── /
                 └── /users
```

---

# 10. Navigate

`Navigate`는 성격이 조금 다릅니다.

`RouteObject`가 **라우팅 설정**이라면,

`Navigate`는 **다른 URL로 이동시키는 컴포넌트**입니다.

예:

```tsx
<Navigate to="/login" />
```

현재 페이지에서 `/login`으로 이동합니다.

---

# 11. Navigate 기본 예제

예를 들어 인증되지 않은 사용자가 `/admin`에 접근했다고 해보겠습니다.

```tsx
function Admin() {
  const authenticated = false;

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <h1>Admin</h1>;
}
```

그러면:

```text
/admin
   │
   │ 인증 안 됨
   ▼
<Navigate to="/login" />
   │
   ▼
/login
```

으로 이동합니다.

---

# 12. Navigate의 to

```tsx
<Navigate to="/login" />
```

여기서:

```tsx
to="/login"
```

이동할 URL입니다.

예:

```tsx
<Navigate to="/" />
```

```tsx
<Navigate to="/dashboard" />
```

```tsx
<Navigate to="/users" />
```

---

# 13. Navigate의 replace

여기서 매우 중요한 옵션이:

```tsx
replace
```

입니다.

예:

```tsx
<Navigate
  to="/login"
  replace
/>
```

`replace`는 브라우저 History에서 현재 URL을 새로운 URL로 **교체**하는 의미입니다.

예를 들어:

```text
/admin
  ↓
/login
```

단순 이동:

```tsx
<Navigate to="/login" />
```

이면 History가:

```text
/admin → /login
```

처럼 남을 수 있습니다.

반면:

```tsx
<Navigate to="/login" replace />
```

이면 현재 `/admin` 기록을 `/login`으로 교체하는 형태가 됩니다.

그래서 인증되지 않은 페이지를 로그인 페이지로 보내는 경우 흔히:

```tsx
<Navigate
  to="/login"
  replace
/>
```

를 사용합니다.

---

# 14. Navigate의 대표적인 사용처

## ① 로그인하지 않은 사용자를 로그인 페이지로

```tsx
function ProtectedPage() {
  const isLogin = false;

  if (!isLogin) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <div>Protected Page</div>;
}
```

---

## ② 기본 URL을 Dashboard로

```tsx
{
  path: "/",
  element: <Navigate to="/dashboard" replace />,
}
```

그러면:

```text
/
 ↓
/dashboard
```

---

## ③ 존재하지 않는 URL을 처리

```tsx
{
  path: "*",
  element: <Navigate to="/" replace />,
}
```

예:

```text
/abc
/hello
/test123
```

등 존재하지 않는 URL을 `/`로 보낼 수 있습니다.

---

# 15. 네 가지를 하나의 프로젝트에서 사용하기

이제 실제 구조로 만들어 보겠습니다.

현재 질문하신 프론트엔드 구조처럼:

```text
Header
LNB
Main
```

형태라면 다음과 같이 구성할 수 있습니다.

```text
src/
├── main.tsx                         # 앱 진입점 (DOM 렌더링)
│
├── app/                             # 앱 레벨 설정, 라우팅, 공통 레이아웃
│   ├── App.tsx                      # RouterProvider 공급 최상위 컴포넌트
│   ├── routes/                      # 라우팅 정의
│   │   ├── app-router.tsx           # createBrowserRouter() 생성
│   │   └── routes.tsx               # RouteObject[] 배열 및 loader(appLayoutLoader) 정의
│   ├── layout/                      # 베이스 레이아웃 (LNB, Header, Main, Outlet)
│   │   ├── index.ts
│   │   └── ui/
│   │       ├── app-layout.container.tsx # 공통 레이아웃 컨테이너 (useLoaderData, 로딩바)
│   │       ├── app-layout.container.css
│   │       ├── app-header.tsx           # 상단 헤더 & 열린 탭(Tabs) 바
│   │       ├── app-header.css
│   │       ├── app-sidebar.tsx          # 사이드바 LNB 메뉴
│   │       ├── app-sidebar.css
│   │       ├── app-main.tsx             # <Outlet /> 렌더링 메인 컨테이너
│   │       └── app-main.css
│   └── styles/
│       └── global.css               # 전역 스타일
│
├── entities/                        # 비즈니스 도메인 모델 & API
│   ├── index.ts                     # 엔티티 통합 export
│   ├── model/
│   │   └── menu.entity.ts           # Menu 타입, DEFAULT_MENUS, MENU_TITLES
│   └── api/
│       └── menu.api.ts              # fetchMenus() 비동기 조회 함수
│
├── pages/                           # 각 라우트별 업무 화면 컴포넌트
│   └── use-state/
│       ├── timer.tsx                # /use-state/timer 화면
│       ├── set-state-callback.tsx   # /use-state/set-state-callback 화면
│       └── initial-value-callback.tsx # /use-state/initial-value-callback 화면
│
└── shared/                          # 공통 모듈 (HTTP 클라이언트, 정적 에셋)
    ├── api/                         # Axios 인스턴스 & HTTP 메서드 래퍼
    │   ├── axios-instance.ts
    │   ├── auth-interceptor.ts
    │   ├── http-client.ts           # get(), post(), del() 등
    │   └── index.ts
    └── assets/                      # 로고 및 정적 이미지
        └── index.ts
```

---

# 16. router/index.tsx

```tsx
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import UserDetail from "../pages/UserDetail";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <UserDetail />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default createBrowserRouter(routes);
```

여기서 사실상 네 가지가 모두 등장합니다.

```tsx
createBrowserRouter(...)
```

↓

Router 생성

```tsx
const routes = [...]
```

↓

RouteObject들의 배열

```tsx
<Navigate ... />
```

↓

URL 이동

그리고 이 Router를:

```tsx
<RouterProvider router={router} />
```

에 전달합니다.

---

# 17. MainLayout.tsx

```tsx
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="page-body flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 min-w-0 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
```

이 구조는 최근 질문하셨던 Header + LNB + Main 구조와 잘 맞습니다.

```text
┌──────────────────────────────────────┐
│ Header                               │
├──────────────┬───────────────────────┤
│              │                       │
│     LNB      │       <Outlet />      │
│              │                       │
│              │                       │
└──────────────┴───────────────────────┘
```

URL에 따라서 `<Outlet />` 부분이 바뀝니다.

---

# 18. 실제 URL 변화

예를 들어:

```text
/dashboard
```

이면:

```text
MainLayout
├── Header
├── Sidebar
└── Outlet
      └── Dashboard
```

---

```text
/users
```

이면:

```text
MainLayout
├── Header
├── Sidebar
└── Outlet
      └── Users
```

---

```text
/users/100
```

이면:

```text
MainLayout
├── Header
├── Sidebar
└── Outlet
      └── UserDetail
```

---

# 19. main.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";

import {
  RouterProvider,
} from "react-router-dom";

import router from "./router";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

여기서는 `createBrowserRouter()`를 직접 호출하지 않습니다.

이미:

```tsx
// router/index.tsx

const router = createBrowserRouter(routes);

export default router;
```

에서 Router를 만들었기 때문입니다.

---

# 20. index: true

위 예제에서 이것도 중요합니다.

```tsx
{
  index: true,
  element: <Navigate to="/dashboard" replace />,
}
```

`index` route는 쉽게 말하면:

> **부모 경로의 기본 페이지**

입니다.

예를 들어:

```tsx
{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
  ],
}
```

이면:

```text
/
```

로 접근했을 때:

```text
Dashboard
```

가 표시됩니다.

---

# 21. path와 index 비교

### path

```tsx
{
  path: "dashboard",
  element: <Dashboard />,
}
```

URL:

```text
/dashboard
```

---

### index

```tsx
{
  index: true,
  element: <Dashboard />,
}
```

부모가:

```tsx
path: "/"
```

라면 URL:

```text
/
```

입니다.

즉:

```text
path route

/          → Home
/dashboard → Dashboard


index route

/          → Dashboard
```

---

# 22. 동적 URL

RouteObject에서는 URL parameter도 정의할 수 있습니다.

```tsx
{
  path: "users/:userId",
  element: <UserDetail />,
}
```

URL:

```text
/users/100
```

이면:

```text
userId = 100
```

입니다.

컴포넌트에서는:

```tsx
import { useParams } from "react-router-dom";

const UserDetail = () => {
  const { userId } = useParams();

  return (
    <div>
      User ID: {userId}
    </div>
  );
};

export default UserDetail;
```

결과:

```text
User ID: 100
```

---

# 23. RouteObject에서 자주 사용하는 속성

실무에서는 다음 정도를 우선 이해하면 좋습니다.

| 속성             | 의미                   |
| -------------- | -------------------- |
| `path`         | URL 경로               |
| `element`      | 렌더링할 React element   |
| `children`     | 중첩 Route             |
| `index`        | 부모 Route의 기본 Route   |
| `loader`       | Route 진입 전 데이터 로딩    |
| `action`       | form 등의 mutation 처리  |
| `errorElement` | Route 오류 화면          |
| `lazy`         | Route lazy loading   |
| `handle`       | Route에 사용자 정의 데이터 저장 |

예를 들어:

```tsx
const routes: RouteObject[] = [
  {
    path: "/users",
    element: <Users />,
    errorElement: <ErrorPage />,
  },
];
```

---

# 24. errorElement

Data Router 방식에서 상당히 유용합니다.

```tsx
{
  path: "/users",
  element: <Users />,
  errorElement: <ErrorPage />,
}
```

해당 Route에서 오류가 발생했을 때:

```text
Users
  ↓
Error
  ↓
ErrorPage
```

형태로 처리할 수 있습니다.

---

# 25. loader까지 사용하면

`createBrowserRouter` 방식의 중요한 특징 중 하나가 `loader`입니다.

예:

```tsx
{
  path: "/users",
  element: <Users />,
  loader: async () => {
    const response = await fetch("/api/users");

    return response.json();
  },
}
```

그리고 컴포넌트에서는:

```tsx
import { useLoaderData } from "react-router-dom";

const Users = () => {
  const users = useLoaderData();

  return (
    <div>
      {JSON.stringify(users)}
    </div>
  );
};

export default Users;
```

즉:

```text
/users
   │
   ▼
loader()
   │
   ▼
API 호출
   │
   ▼
데이터 준비
   │
   ▼
Users
```

라는 구조를 만들 수 있습니다.

---

# 26. 네 가지의 역할을 정확히 구분하기

이 부분이 가장 중요합니다.

### `RouteObject`

**라우팅 설계도**

```tsx
{
  path: "/users",
  element: <Users />,
}
```

---

### `createBrowserRouter`

**설계도를 이용해서 Router를 생성**

```tsx
const router = createBrowserRouter(routes);
```

---

### `RouterProvider`

**생성한 Router를 React 애플리케이션에 연결**

```tsx
<RouterProvider router={router} />
```

---

### `Navigate`

**렌더링되는 과정에서 다른 URL로 이동**

```tsx
<Navigate to="/login" replace />
```

---

# 27. 전체 관계

최종적으로 이렇게 기억하면 됩니다.

```text
             RouteObject
                  │
                  │
                  ▼
          ┌─────────────────┐
          │ routes 배열      │
          │                 │
          │ /               │
          │ /dashboard      │
          │ /users          │
          │ /settings       │
          └────────┬────────┘
                   │
                   ▼
       createBrowserRouter()
                   │
                   ▼
              router
                   │
                   ▼
          RouterProvider
                   │
                   ▼
            React Application
                   │
                   ▼
             Browser URL
```

그리고 `Navigate`는 이 흐름 안에서 **URL을 변경시키는 역할**을 합니다.

```text
Browser URL
    │
    │ /admin
    ▼
Route
    │
    │ 인증 안 됨
    ▼
<Navigate to="/login" replace />
    │
    ▼
Browser URL
    │
    │ /login
    ▼
Login
```

---

# 28. 실무에서 추천하는 파일 구성

현재처럼 React + TypeScript 프로젝트라면 저는 다음 정도로 분리하는 것을 권합니다.

```text
src/
├── main.tsx
│
├── router/
│   └── index.tsx
│
├── layouts/
│   └── MainLayout.tsx
│
├── pages/
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── Users/
│   │   ├── UserList.tsx
│   │   └── UserDetail.tsx
│   ├── Settings/
│   │   └── Settings.tsx
│   └── Login/
│       └── Login.tsx
│
└── components/
    ├── Header/
    └── Sidebar/
```

그리고 라우터는:

```tsx
// router/index.tsx

import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import UserList from "../pages/Users/UserList";
import UserDetail from "../pages/Users/UserDetail";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "users/:userId",
        element: <UserDetail />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
```

`main.tsx`는 매우 단순해집니다.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

**핵심은 `RouteObject → createBrowserRouter → RouterProvider`가 하나의 흐름**이고, **`Navigate`는 그 라우팅 과정에서 다른 경로로 보내는 컴포넌트**라고 이해하시면 됩니다.

특히 지금 구성하시는 **Header + LNB + Main 구조**에서는 `MainLayout + Outlet + children` 조합을 이해하는 것이 가장 중요합니다.
