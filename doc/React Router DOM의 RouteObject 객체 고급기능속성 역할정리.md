# React Router `RouteObject` 고급 기능 속성 가이드 (초간단 예제 중심)

React Router의 `RouteObject`에서 제공하는 고급 기능 속성 **`loader`**, **`action`**, **`errorElement`**, **`lazy`**, **`handle`**을 누구나 바로 이해할 수 있도록 **가장 단순하고 직관적인 예시 코드**로 정리했습니다.

---

## 1. `loader` — 페이지가 뜨기 전에 데이터를 미리 준비하기

### 💡 한 줄 요약
컴포넌트가 화면에 나타나기 전에 **데이터를 미리 가져오거나(Pre-fetching), 로그인 여부 및 인가 권한을 사전에 검증(Route Guard)하는 관문 함수**입니다.

---

### 🔍 핵심 원리: `loader`는 최상위 부모 레이아웃(`AppLayout`) 라우트에 정의

> **"loader는 개별 특정 메뉴 path에만 붙이는 것 아닌가요?"**  
> ➡️ **아닙니다!** 실무에서는 개별 페이지 본문 데이터는 컴포넌트 내부에서 처리하고, **공통 레이아웃을 감싸는 "최상위 부모 라우트"에 `loader`를 붙여 앱 전체의 권한 확인 및 사이드바 메뉴를 일괄 사전 준비**합니다.

```tsx
// src/app/routes/routes.tsx
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,       // 헤더, 사이드바를 감싸는 공통 레이아웃
    loader: layoutLoader,         // 🌟 [부모 loader]: 사이드바 전체 메뉴, 사용자 세션 사전 준비!
    HydrateFallback: LoadingUI,   // ⏳ [하이드레이션 대기 UI]: loader 실행 중 첫 화면 깜빡임을 방지하는 스켈레톤/스피너
    children: [
      {
        path: "menu1",
        element: <Menu1Page />,   // 📄 자식 페이지: 본문 전용 화면 컴포넌트
      },
      {
        path: "menu2",
        element: <Menu2Page />,
      },
    ],
  },
];
```

---

#### 💡 실무 필수 팁: `loader`와 바늘과 실처럼 함께 쓰는 `HydrateFallback`

최상위 라우트에 비동기 `loader`를 지정하면, 앱이 처음 브라우저에 마운트(Hydration)될 때 loader가 완료될 때까지 잠시 대기하게 됩니다. 이때 `HydrateFallback`을 지정하지 않으면 브라우저 콘솔에 다음과 같은 경고가 발생합니다:

```text
No `HydrateFallback` element provided to render during initial hydration
```

##### 1. `HydrateFallback`의 역할
- 비동기 `loader`가 실행되는 동안 화면이 하얗게 멈추는(White-out) 현상을 방지하고, **초기 로딩 스플래시 화면이나 레이아웃 스켈레톤(Skeleton UI)**을 렌더링합니다.

##### 2. 실무에서는 왜 `fallbackElement`보다 `HydrateFallback`을 쓸까?
- **과거 방식 (`<RouterProvider fallbackElement={...} />`)**: 라우터 컴포넌트 레벨의 전역 설정으로, 라우트 정의와 로딩 UI가 분리되어 응집도가 떨어졌습니다.
- **최신 표준 (`RouteObject`의 `HydrateFallback`)**: React Router v6.24+ 및 v7의 공식 표준이며, 라우트 객체 내부에 `loader`, `element`, `errorElement`, `HydrateFallback`을 **한곳에 선언적으로 응집**시켜 라우트 계층별로 정교한 로딩 UI를 제공할 수 있어 실무에서 가장 권장됩니다.


#### 📁 `layoutLoader`의 실제 구현은 어느 Layer에 배치하는가? (FSD 아키텍처 기준)

> `layoutLoader`는 React Router의 내장 키워드가 아니라, **개발자가 토큰 검사, 백엔드 메뉴 API 호출 등의 비즈니스 로직을 직접 구현한 커스텀 비동기 함수**입니다.

FSD(Feature-Sliced Design) 아키텍처 관점에서 `layoutLoader`는 **`app` Layer**에 배치하는 것이 가장 정석입니다.

##### 1. 왜 `app` Layer인가?
- **AppLayout의 소속**: 헤더와 사이드바를 감싸는 전체 껍데기(Shell)인 `AppLayout` 컴포넌트 자체가 **`app` Layer (`src/app/layout`)**에 위치합니다.
- **최상위 글로벌 조립 책임**: 특정 업무 화면(`pages`)이나 개별 기능(`features`)의 데이터가 아니라, 애플리케이션 전체에 영향을 미치는 **최상위 글로벌 진입 관문**이기 때문입니다.

##### 2. 실무 추천 2가지 파일 배치 구조:
- **🥇 추천 1: Layout 폴더의 `model` 디렉토리로 분리 (가장 깔끔함)**
  ```text
  src/
  └── app/
      ├── layout/
      │   ├── model/
      │   │   └── layout-loader.ts   👈 [여기!] 권한 확인 및 메뉴 패칭 로직
      │   └── ui/
      │       ├── app-layout.container.tsx
      │       ├── app-header.tsx
      │       └── app-sidebar.tsx
      └── routes/
          └── routes.tsx             👈 layoutLoader를 import하여 라우트에 연결
  ```

- **🥈 추천 2: `app-layout.container.tsx` 파일 내부에 직접 export (Colocation)**
  - React Router 공식 컨벤션으로, 컴포넌트와 그 컴포넌트가 필요로 하는 `layoutLoader`를 같은 파일에 함께 두고 export합니다.

##### 3. 레이어별 역할 분담 (FSD 단방향 흐름):
| 레이어 | 담당 파일 | 역할 |
| :--- | :--- | :--- |
| **`entities` Layer** | `entities/menu/api/menu-logic.ts` | 순수 백엔드 메뉴 API 통신 함수 (`apiClient.get`) |
| **`app` Layer** | `app/layout/model/layout-loader.ts` | 토큰 유무 확인 + `menuLogic` 호출 + 리다이렉트 통제 |
| **`app` Layer** | `app/routes/routes.tsx` | 라우터에 `loader: layoutLoader` 바인딩 |
| **`pages` Layer** | `pages/menu1/...` | 개별 업무 화면 UI 컴포넌트 (`Menu1Page`) |

---

#### 🔄 사용자가 `/menu1`에 접속했을 때의 내부 동작 흐름
```text
브라우저 /menu1 접근 시점
  ├── ① [부모 loader 사전 실행] ➡️ "사이드바 인가 메뉴 목록" 패칭 ➡️ <Sidebar />가 완성된 상태로 준비
  └── ② [레이아웃 & 자식 렌더링] ➡️ <AppLayout /> 렌더링 후 <Outlet /> 위치에 <Menu1Page /> 표출
```

---

### 🌟 [핵심] 부모 `loader`가 실무에서 주는 3대 결정적 이점

#### 1. 메뉴 API 중복 호출 원천 방지 (지능적 캐싱 및 레이아웃 유지) ⭐⭐⭐
- 만약 개별 페이지(`menu1`, `menu2`, `menu3`...)마다 메뉴 목록을 불러오면 **메뉴를 클릭해 이동할 때마다 똑같은 메뉴 API를 계속 중복 호출**하게 됩니다.
- 하지만 **부모 `AppLayout` 라우트에 `loader`를 등록**하면:
  - 사용자가 `/menu1` ➡️ `/menu2` ➡️ `/menu3`로 이동하더라도, 부모 컴포넌트(`AppLayout`)는 이미 렌더링된 상태로 유지되므로 **부모의 메뉴 API는 재실행되지 않고 그대로 유지**됩니다!
  - 오직 본문(`<Outlet />`) 영역의 자식 페이지 데이터만 새로 패칭하므로 **네트워크 트래픽과 렌더링 부하가 획기적으로 절감**됩니다.

#### 2. 비인가 사용자 원천 차단 (Ironclad Route Guard) ⭐⭐⭐
- 수십 개에 달하는 개별 하위 업무 화면마다 로그인 검증 코드를 일일이 작성할 필요가 없습니다.
- 최상위 부모 `loader` 한 곳에서 검증하면, 비인가 사용자가 URL 주소창에 `/menu1`이나 `/admin`을 직접 입력하고 들어와도 **화면 컴포넌트가 뜨기 전에 즉시 로그인 화면으로 튕겨냅니다(`throw redirect('/login')`)**.

#### 3. 화면 깜빡임(Flickering)과 불필요한 전역 상태(Store) 완전 제거 ⭐⭐⭐
- 마운트 후 `useEffect`로 API를 찌르는 구식 SPA 패턴의 빈 화면/스피너 깜빡임 현상이 완전히 사라집니다.
- 라우터 자체가 데이터 수명주기를 완벽히 보장하므로, 사이드바 메뉴 보관을 위한 별도의 전역 상태 라이브러리(Zustand, Jotai 등)를 만들 필요가 없습니다.

---

### 📌 실무 표준 구현 코드 (3단계)

#### [1단계: 백엔드 메뉴 서비스 호출 (`src/entities/menu/api/menu-logic.ts`)]
```ts
// 로그인한 사용자의 토큰을 기반으로 인가된 메뉴 목록만 반환하는 API
export const menuLogic = {
  getAuthorizedMenuList: async (): Promise<MenuItem[]> => {
    const res = await apiClient.get<MenuItem[]>("/api/v1/menus/my");
    return res.data;
  },
};
```

#### [2단계: routes.tsx 최상위 부모 라우트에 loader 등록]
```tsx
// src/app/routes/routes.tsx
import { redirect, type RouteObject } from "react-router-dom";
import AppLayout from "../layout/ui/app-layout.container";
import { menuLogic } from "@/entities/menu/api/menu-logic";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    // 🌟 부모 loader: 최상위 관문에서 인증 확인 및 사이드바 인가 메뉴 일괄 패칭
    loader: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // 비인가 사용자는 부모 라우트 단계에서 즉시 로그인 페이지로 리다이렉트
        throw redirect("/login");
      }

      // 인가된 메뉴 리스트 사전 조회 (하위 페이지 이동 시 재호출되지 않고 유지됨)
      const menus = await menuLogic.getAuthorizedMenuList();
      return { menus };
    },
    children: [
      {
        path: "menu1",
        element: <Menu1Page />,
      },
      {
        path: "menu2",
        element: <Menu2Page />,
      },
      // ... 다른 메뉴 라우트들
    ],
  },
];
```

#### [3단계: Sidebar 컴포넌트에서 useLoaderData()로 꺼내서 렌더링]
```tsx
// src/app/layout/ui/app-sidebar.tsx
import { useLoaderData, NavLink } from "react-router-dom";
import type { MenuItem } from "@/entities/menu/model/types";

const Sidebar = () => {
  // 부모 loader가 준비해둔 menus 데이터를 즉시 추출 (깜빡임 없음)
  const { menus } = useLoaderData() as { menus: MenuItem[] };

  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-nav-list">
          {menus.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? "active" : ""}`.trim()
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
```

---

## 2. `action` — 실무에서는 action 보다 useMutation을 더 선호 

* 폼(Form) 제출 처리와 화면 자동 새로고침 기능을 중앙에서 정의 

### 💡 한 줄 요약
- **모달(Modal) 팝업 내 폼 제출:**
  - 실무에서는 새 페이지로 안 가고 모달 팝업 안에서 등록/수정을 많이 하는데, 라우터 action은 모달 처리에 어색합니다.
- **실시간 유효성 검사:**
  - 비밀번호 8자리 이상, 이메일 형식 등 타이핑할 때 바로 에러를 띄워주는 기능은 react-hook-form이 압도적으로 우수합니다.
- **토스트 알림 및 로딩 처리:**
  - useMutation의 isPending, onSuccess: () => alert('저장 완료')가 훨씬 직관적입니다.
- `<Form>`으로 입력값을 제출했을 때, **새로고침 없이 값을 받아 처리(저장/수정)하고 화면 데이터를 자동으로 최신화**합니다.

### 📌 가장 쉬운 코드 예시

#### [1단계: routes.tsx 에서 제출된 값 받기]
```tsx
// routes.tsx
{
  path: "menu2",
  element: <Menu2Page />,
  // Form이 제출되면 action 함수가 자동으로 호출됩니다.
  action: async ({ request }) => {
    const formData = await request.formData();
    const memo = formData.get("memo"); // input에 입력한 값을 꺼냄
    
    alert(`작성한 내용: ${memo}`);
    return { success: true };
  },
}
```

#### [2단계: Menu2Page.tsx 에서 <Form> 작성하기]
```tsx
// Menu2Page.tsx
import { Form, useActionData } from "react-router-dom";

export default function Menu2Page() {
  const result = useActionData() as { success?: boolean };

  return (
    <div>
      <h3>메뉴 2 - 메모 작성</h3>
      {/* onSubmit 함수 없이 순수 HTML Form처럼 post로 제출합니다 */}
      <Form method="post">
        <input name="memo" placeholder="메모를 입력하세요" />
        <button type="submit">저장</button>
      </Form>

      {result?.success && <p style={{ color: "green" }}>저장 완료되었습니다!</p>}
    </div>
  );
}
```

---

## 3. `errorElement` — 특정 페이지 에러 발생 시 전체 흰 화면(White Screen) 방지

### 💡 한 줄 요약
개별 업무 화면에서 오류(런타임 JS 에러, API 실패 등)가 발생해도, **전체 헤더/사이드바는 그대로 유지하고 본문 영역에만 대체 화면을 띄워주는 안전망**입니다.

---

### 🔍 핵심 원리: 에러 버블링(Error Bubbling)과 부모 라우트 배치

> **"errorElement를 모든 개별 path마다 일일이 정의해야 하나요?"**  
> ➡️ **아닙니다!** React Router는 자식 페이지에서 에러가 발생했을 때 `errorElement`가 없으면 **가장 가까운 부모 라우트의 `errorElement`를 찾아 자동으로 거슬러 올라갑니다(Error Bubbling).**  
> 따라서 개별 메뉴 path마다 일일이 작성할 필요가 전혀 없으며, **부모 레이아웃(`AppLayout`) 라우트에 딱 1개만 정의하는 것이 실무 표준**입니다.

```text
Menu1Page에서 런타임 에러 발생!
   ├── ① Menu1Page에 errorElement가 있는가? ➡️ 없음! (상위 부모로 전파)
   └── ② 부모 AppLayout에 errorElement가 있는가? ➡️ 있음!
         👉 부모의 errorElement가 실행되어 본문 영역에만 에러 대체 화면 표출!
```

---

### 🌟 부모 라우트에 `errorElement`를 1개만 둘 때의 결정적 장점 (실무 필수)

#### 1. 전체 흰 화면(White Screen of Death) 방지 ⭐⭐⭐
- 특정 페이지 본문에서 치명적인 에러가 터져도, **헤더와 사이드바는 정상적으로 살아있습니다.**
- 사용자는 사이드바의 다른 메뉴(`menu2`, `menu3`)를 클릭해서 정상적으로 다른 업무를 계속 진행할 수 있습니다.

#### 2. 코드 중복 99% 제거 ⭐⭐⭐
- 업무 페이지가 50개, 100개로 늘어나도 에러 대체 컴포넌트는 부모 라우트의 `<ContentErrorFallback />` 단 하나만 작성하면 끝납니다.

#### 3. 에러 원인 자동 추적 및 모니터링 (`useRouteError`) ⭐⭐⭐
- 공통 에러 컴포넌트 내부에서 `useRouteError()` 훅을 호출하면 **어떤 페이지에서, 무슨 에러가 났는지**를 자동으로 수집하여 Sentry나 백엔드 로깅 서버로 전송할 수 있습니다.

---

### 📌 실무 표준 구현 코드 (2단계 에러 격리 아키텍처)

#### [1단계: routes.tsx 최상위 AppLayout 에 errorElement 등록]
```tsx
// src/app/routes/routes.tsx
import { ContentErrorFallback } from "@/shared/ui/content-error-fallback";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    // ⭐ [핵심 실무 표준] 부모 레이아웃 에러 바운더리:
    // 어떤 자식 페이지가 터져도 헤더/사이드바는 살리고 본문 영역에만 대체 화면 표출!
    errorElement: <ContentErrorFallback />,
    children: [
      { path: "menu1", element: <Menu1Page /> }, // errorElement 작성 안 함!
      { path: "menu2", element: <Menu2Page /> }, // errorElement 작성 안 함!
      { path: "menu3", element: <Menu3Page /> }, // errorElement 작성 안 함!
    ],
  },
  // 앱 전체 404 및 초기 구동 실패 대비용 전역 루트 에러 바운더리
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
```

#### [2단계: ContentErrorFallback.tsx 공통 에러 컴포넌트 작성]
```tsx
// src/shared/ui/content-error-fallback.tsx
import { useRouteError, useNavigate } from "react-router-dom";

export function ContentErrorFallback() {
  const error = useRouteError() as any; // 발생한 에러 객체 자동 추출
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h3 style={{ color: "#e53e3e" }}>⚠️ 화면을 불러오는 중 오류가 발생했습니다.</h3>
      <p style={{ color: "#718096" }}>
        {error?.statusText || error?.message || "일시적인 오류가 발생했습니다."}
      </p>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => window.location.reload()}>새로고침</button>
        <button onClick={() => navigate("/menu1")}>홈으로 이동</button>
      </div>
    </div>
  );
}
```

---

## 4. `lazy` — 페이지를 처음 클릭할 때만 파일 불러오기 (코드 스플리팅)

### 💡 한 줄 요약
메뉴 목록(1 depth / 2 depth 사이드바 트리)을 화면에 그릴 때는 가벼운 텍스트 데이터만 먼저 뿌려주고, **실제 사용자가 특정 메뉴를 클릭해 이동하는 그 순간에 해당 화면 컴포넌트 파일(`.js` 번들 청크)을 비로소 네트워크로 다운로드**하여 첫 화면 로딩을 0.1초 만에 띄우는 성능 최적화(코드 스플리팅) 기능입니다.

---

### 🔍 핵심 논리: "메뉴 목록 출력"과 "화면 컴포넌트 로딩"의 완전한 분리

많은 개발자들이 흔히 오해하는 지점과 실제 동작 원리는 다음과 같습니다.

> ❓ **"사이드바에 1 depth, 2 depth 메뉴가 100개 있으면, 100개 화면 컴포넌트도 첫 접속 때 전부 다 가져와야 하나요?"**  
> ➡️ **전혀 아닙니다! (완벽하게 분리되어 동작합니다)**  
> 
> 1. **메뉴 목록을 화면에 그릴 때**: 메뉴명, 경로, 아이콘 같은 **가벼운 텍스트/JSON 데이터만** 가져와서 사이드바를 즉시 렌더링합니다.
> 2. **실제 화면 컴포넌트를 가져올 때**: 사용자가 수많은 메뉴 중 **원하는 특정 메뉴 하나를 "클릭"하는 바로 그 순간**에만 해당 컴포넌트 파일(`.js`)을 온디맨드로 다운로드합니다.

---

### 📊 흐름 다이어그램 (2단계 온디맨드 다운로드 원리)

```text
[1단계] 첫 페이지 접속 시 (사이드바 메뉴 목록 렌더링)
   ├── 브라우저가 받는 것: 수십 개의 1 depth / 2 depth 메뉴 텍스트 데이터 (JSON 몇 KB 수준)
   │     - 대메뉴A > 소메뉴1 (/menu1)
   │     - 대메뉴A > 소메뉴2 (/menu2)
   │     - 대메뉴B > 소메뉴3 (/menu3) ...
   └── 화면 컴포넌트: ❌ 단 하나도 다운로드하지 않음!
         (초기 진입 시 사용자의 브라우저 번들 용량이 극도로 가벼워져 0.1초 만에 화면이 뜸)

                     ▼ 사용자가 사이드바에서 [소메뉴 2]를 마우스로 클릭!

[2단계] URL이 "/menu2"로 변경되는 순간 (React Router의 lazy 발동)
   ├── 라우터 동작: lazy: () => import("./pages/Menu2Page") 비동기 함수 실행
   └── 브라우저 동작: 👉 네트워크로 "Menu2Page.[hash].js" 파일만 그 순간 쏙 다운로드!
   └── 렌더링: 다운로드 완료 즉시 메인 본문(<Outlet />)에 컴포넌트 마운트
```

---

### 🌟 실무에서 얻는 엄청난 성능 이점 (메뉴 100개 기준)

| 비교 항목 | 기존 일반 방식 (`lazy` 미사용) | 실무 표준 (`lazy` 코드 스플리팅 적용) ⭐⭐⭐ |
| :--- | :--- | :--- |
| **초기 다운로드 대상** | 100개 화면의 모든 무거운 JS 컴포넌트 코드를 첫 접속 때 몽땅 다운로드 | 사이드바 메뉴 텍스트(몇 KB)만 다운로드, 화면 컴포넌트는 0개 |
| **초기 번들 크기** | 수십 MB (거대 단일 번들) | 수백 KB (초경량 메인 번들) |
| **첫 화면 로딩 속도** | 3~5초 이상 소요 (흰 화면 멈춤 발생) | **0.1초 만에 즉시 로딩 완료** |
| **미방문 화면 처리** | 사용자가 하루 종일 2개 화면만 봐도 나머지 98개 화면 코드를 낭비 다운로드 | **방문하지 않은 98개 화면 컴포넌트는 브라우저가 평생 다운로드조차 하지 않음** |

---

### 📌 1 depth / 2 depth 메뉴 트리와 연동한 실무 완성형 예시 코드

사이드바에서 메뉴 트리를 화면에 그리는 코드와, 실제 클릭 시 해당 컴포넌트를 온디맨드로 가져오는 라우터 코드가 어떻게 상호작용하는지 보여주는 실무 표준 코드입니다.

#### ① [사이드바 메뉴 컴포넌트] `AppSidebar.tsx`
> 💡 **핵심**: 사이드바는 무거운 페이지 컴포넌트를 **단 하나도 `import`하지 않습니다.** 오직 가벼운 메뉴 트리 데이터(JSON)와 `<NavLink>`만 화면에 그립니다.

```tsx
// src/app/layout/ui/AppSidebar.tsx
import { NavLink } from "react-router-dom";

// 1 depth, 2 depth 계층형 메뉴 데이터 (가벼운 텍스트 메타데이터)
interface MenuItem {
  id: string;
  name: string;
  path?: string;
  children?: MenuItem[];
}

const MENU_TREE_DATA: MenuItem[] = [
  {
    id: "group-order",
    name: "주문 관리 (1 depth)",
    children: [
      { id: "order-list", name: "주문 내역 목록 (2 depth)", path: "/orders" },
      { id: "delivery-status", name: "배송 현황 추적 (2 depth)", path: "/deliveries" },
    ],
  },
  {
    id: "group-product",
    name: "상품 관리 (1 depth)",
    children: [
      { id: "product-list", name: "전체 상품 목록 (2 depth)", path: "/products" },
      { id: "product-new", name: "신규 상품 등록 (2 depth)", path: "/products/new" },
    ],
  },
];

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      {MENU_TREE_DATA.map((depth1) => (
        <div key={depth1.id} className="menu-group">
          {/* 1 depth 대메뉴명 표시 */}
          <div className="depth1-title">📁 {depth1.name}</div>

          {/* 2 depth 소메뉴 목록 링크 표시 */}
          <ul className="depth2-list">
            {depth1.children?.map((depth2) => (
              <li key={depth2.id}>
                {/* ⭐️ 사용자가 이 링크를 클릭하는 순간 URL이 변경됩니다! */}
                <NavLink
                  to={depth2.path!}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  └ 📄 {depth2.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
```

---

#### ② [라우트 설정] `routes.tsx`
> 💡 **핵심**: 첫 페이지 접속 시에는 페이지 번들을 다운로드하지 않으며, 사용자가 사이드바에서 `to="/orders"` 링크를 **클릭하는 순간에만** `OrdersPage.js` 파일을 네트워크에서 쏙 다운로드합니다.

```tsx
// src/app/routes/routes.tsx
import { RouteObject } from "react-router-dom";
import { AppLayout } from "@/app/layout/ui/app-layout.container";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />, // Header, Sidebar, Main(<Outlet />) 공통 레이아웃
    children: [
      {
        path: "orders",
        // 🚀 사용자가 사이드바의 "주문 내역 목록"을 클릭하는 순간 비로소 다운로드!
        lazy: async () => {
          const { OrdersPage } = await import("@/pages/orders/ui/OrdersPage");
          return { Component: OrdersPage };
        },
      },
      {
        path: "deliveries",
        // 🚀 사용자가 "배송 현황 추적"을 클릭하는 순간 비로소 다운로드!
        lazy: async () => {
          const { DeliveriesPage } = await import("@/pages/deliveries/ui/DeliveriesPage");
          return { Component: DeliveriesPage };
        },
      },
      {
        path: "products",
        // 🚀 사용자가 "전체 상품 목록"을 클릭하는 순간 비로소 다운로드!
        lazy: async () => {
          const { ProductsPage } = await import("@/pages/products/ui/ProductsPage");
          return { Component: ProductsPage };
        },
      },
    ],
  },
];
```

---

#### ③ [개별 페이지 화면 컴포넌트] `OrdersPage.tsx`
> 💡 **핵심**: 이 화면의 코드는 첫 접속 시에는 사용자의 컴퓨터 브라우저 메모리에 **존재조차 하지 않습니다.** 오직 클릭 시점에만 네트워크를 타고 날아와 `<Outlet />` 본문에 마운트됩니다.

```tsx
// src/pages/orders/ui/OrdersPage.tsx
export function OrdersPage() {
  return (
    <div className="orders-page">
      <h2>📦 주문 내역 목록 화면</h2>
      <p>이 화면의 자바스크립트 코드는 사이드바 메뉴를 클릭했을 때 비로소 다운로드되었습니다.</p>
    </div>
  );
}
```

---

### 💡 참고: 기존 방식 vs `RouteObject.lazy` 차이점

| 비교 항목 | 기존 정적 import 방식 | `RouteObject.lazy` 실무 표준 방식 |
| :--- | :--- | :--- |
| **코드 선언** | `import OrdersPage from "...";`<br/>`{ path: "orders", element: <OrdersPage /> }` | `{ path: "orders", lazy: () => import(...) }` |
| **JS 다운로드 시점** | **웹사이트 첫 접속 시점** (안 쓰는 메뉴까지 몽땅 다운로드) | **사이드바 메뉴 클릭 시점** (클릭한 화면만 온디맨드 다운로드) |
| **React.lazy 대비 장점** | - | `<Suspense>` 수동 래핑 없이 라우터가 컴포넌트/로더를 일괄 지연 로딩 |


---

## 5. `handle` — 메뉴 위치 네비게이션(Breadcrumbs) 및 커스텀 정보 관리

### 💡 한 줄 요약
각 라우트에 **메뉴명, 아이콘, Breadcrumbs(현재 위치 메뉴 경로)** 같은 부가 정보를 적어두고, 상단 헤더나 네비게이션 바에서 읽어와 화면에 표시할 때 사용하는 속성입니다.

---

### 🖥️ Breadcrumbs(브레드크럼, 위치 네비게이션)란?

동화 '헨젤과 그레텔'에서 빵 부스러기를 떨어뜨려 길을 표시했던 것에서 유래한 용어로, **"사용자가 현재 어떤 메뉴 깊이에 와 있는지"**를 알려주는 **위치 네비게이션 표시줄**입니다.

```
┌─────────────────────────────────────────────────────────────┐
│ [공통 상단 헤더]                                             │
├─────────────────────────────────────────────────────────────┤
│ 📍 홈 > 상품 관리 > 전자기기 > 노트북 상세 (Breadcrumbs 표시줄)  │ <── 바로 이 부분!
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [메인 본문 영역 (Outlet)]                                  │
│  노트북 상품 상세 정보 화면...                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 📌 가장 쉬운 코드 예시

#### [1단계: routes.tsx 에서 부모와 자식 라우트에 각각 이름표(handle) 달아두기]
```tsx
// routes.tsx
export const routes: RouteObject[] = [
  {
    path: "shop",
    handle: { crumbName: "상품 관리" },
    children: [
      {
        path: "electronics",
        handle: { crumbName: "전자기기" },
        children: [
          {
            path: "laptops",
            element: <LaptopPage />,
            handle: { crumbName: "노트북" }, // 현재 보고 있는 페이지
          },
        ],
      },
    ],
  },
];
```

#### [2단계: 상단 네비게이션 바에서 useMatches()로 경로를 자동 완성하기]
```tsx
// Breadcrumbs.tsx
import { useMatches, Link } from "react-router-dom";

export default function Breadcrumbs() {
  // 현재 접속 경로의 모든 상위 라우트 정보를 배열로 가져옴
  const matches = useMatches();

  return (
    <nav style={{ padding: "8px 16px", background: "#f5f5f5" }}>
      {matches
        .filter((m) => m.handle?.crumbName)
        .map((m, index) => (
          <span key={m.pathname}>
            {index > 0 && " > "}
            <Link to={m.pathname}>{m.handle.crumbName}</Link>
          </span>
        ))}
    </nav>
  );
}

// ➡️ 화면 결과: [상품 관리] > [전자기기] > [노트북] (자동 연결 완성!)
```

---

## 6. 실전 응용: 2 Depth 트리 구조 메뉴 구성하기

실제 기업용 포털이나 어드민 시스템에서 가장 흔하게 사용하는 **"1차 대메뉴 ➡️ 2차 하위 메뉴"** 형태의 2 Depth 중첩 라우팅 구성 방법입니다.

---

### 🖥️ 화면 레이아웃 및 URL 구조 모형

```
[URL: /system/users 접속 시]

┌─────────────────────────────────────────────────────────────┐
│ [상단 헤더] 로고 | 📍 시스템 관리 > 사용자 관리 (Breadcrumb)    │
├───────────────┬─────────────────────────────────────────────┤
│ [좌측 LNB]    │ [메인 본문 영역 (Outlet)]                   │
│               │                                             │
│ ▼ 시스템 관리 │ <h2>사용자 관리</h2>                        │
│   • 사용자 관리│ 사용자 목록 테이블, 검색 필터, 페이징...     │
│   • 권한 관리 │                                             │
│               │                                             │
│ ▶ 통계 분석   │                                             │
│   • 매출 현황 │                                             │
│   • 접속 통계 │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

---

### 📌 2 Depth 라우트 정의 코드 (`routes.tsx`)

`children` 속성을 2단계로 중첩하여 트리(Tree) 구조를 형성합니다:

```tsx
// routes.tsx
import { Navigate, type RouteObject } from "react-router-dom";
import AppLayout from "../layout/ui/app-layout.container";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />, // [최상위 레이아웃] 헤더 + LNB + 본문 프레임
    children: [
      // 1. 첫 접속 시 기본 메뉴로 자동 이동
      { index: true, element: <Navigate to="/system/users" replace /> },

      // ==========================================
      // [1 Depth 대메뉴 1]: 시스템 관리 (/system)
      // ==========================================
      {
        path: "system",
        handle: { title: "시스템 관리", icon: "⚙️" },
        children: [
          // /system 접속 시 첫 번째 소메뉴(/system/users)로 리다이렉트
          { index: true, element: <Navigate to="users" replace /> },
          
          // [2 Depth 소메뉴 1-1]: /system/users
          {
            path: "users",
            element: <UsersPage />,
            handle: { title: "사용자 관리" },
          },
          // [2 Depth 소메뉴 1-2]: /system/roles
          {
            path: "roles",
            element: <RolesPage />,
            handle: { title: "권한 관리" },
          },
        ],
      },

      // ==========================================
      // [1 Depth 대메뉴 2]: 통계 분석 (/analytics)
      // ==========================================
      {
        path: "analytics",
        handle: { title: "통계 분석", icon: "📊" },
        children: [
          { index: true, element: <Navigate to="sales" replace /> },
          
          // [2 Depth 소메뉴 2-1]: /analytics/sales
          {
            path: "sales",
            element: <SalesPage />,
            handle: { title: "매출 현황" },
          },
          // [2 Depth 소메뉴 2-2]: /analytics/traffic
          {
            path: "traffic",
            element: <TrafficPage />,
            handle: { title: "접속 통계" },
          },
        ],
      },

      // 404 예외 처리
      { path: "*", element: <div>페이지를 찾을 수 없습니다. (404)</div> },
    ],
  },
];
```

---

### 💡 2 Depth 트리 구성의 3가지 핵심 포인트

1. **URL 자동 결합 (상대 경로)**:
   * 1 Depth의 `system`과 2 Depth의 `users`가 결합되어 실제 브라우저 주소는 **`/system/users`**가 됩니다.
2. **`index: true` 자동 포커싱**:
   * 대메뉴(`/system`)를 클릭했을 때 빈 화면이 뜨지 않고, 하위의 첫 번째 메뉴인 `/system/users`로 **즉시 자동 이동**합니다.
3. **LNB(좌측 사이드바) 메뉴 자동 렌더링에 활용**:
   * 라우트 배열(`routes`)을 그대로 읽어서 좌측 사이드바의 아코디언 메뉴(접기/펼치기)를 동적으로 손쉽게 그릴 수 있습니다.


---

### 6-2. 실전 심화: 백엔드 API 메뉴 데이터로 동적 라우트(`children`) 생성하기

기업용 시스템에서는 로그인한 사용자의 권한(Role)에 따라 **백엔드 DB에서 접근 가능한 메뉴 목록을 API로 내려주는 경우(RBAC, 역할 기반 접근 제어)**가 많습니다. 이때 백엔드 JSON 데이터를 React Router의 `children: RouteObject[]` 배열로 동적 변환하는 실무 표준 패턴입니다.

### 수록된 4단계 실무 패턴
---
**[1단계] 백엔드 2 Depth 메뉴 JSON 구조**:
   * 대메뉴(`id`, `name`, `path`, `icon`)와 소메뉴 배열(`subMenus: [{ path, componentKey, ... }]`) 규격 정의

**[2단계] 컴포넌트 매핑 테이블 (`COMPONENT_MAP`)**:
   * 백엔드가 넘겨준 문자열(`"UsersPage"`)을 실제 React 컴포넌트(`<UsersPage />`)로 연결하는 안전한 레지스트리 객체

**[3단계] 동적 변환 함수 (`buildRouteChildren`)**:
   * 백엔드 배열을 순회하며 `RouteObject[]` 형태로 조립
   * 대메뉴 클릭 시 첫 번째 소메뉴로 자동 이동하는 `{ index: true, element: <Navigate ... /> }` 자동 주입

**[4단계] 라우터 동적 주입 (`AppRouter.tsx`)**:
   * API 통신 후 생성된 동적 `children`을 `AppLayout` 아래에 결합하여 `createBrowserRouter(routes)`로 최종 렌더링하는 전체 사이클 완성
---
#### [1단계: 백엔드에서 전달받는 2 Depth 메뉴 JSON 데이터 구조]
```json
// GET /api/my-menus 응답 예시
[
  {
    "id": "system",
    "name": "시스템 관리",
    "path": "system",
    "icon": "⚙️",
    "subMenus": [
      { "id": "users", "name": "사용자 관리", "path": "users", "componentKey": "UsersPage" },
      { "id": "roles", "name": "권한 관리", "path": "roles", "componentKey": "RolesPage" }
    ]
  },
  {
    "id": "analytics",
    "name": "통계 분석",
    "path": "analytics",
    "icon": "📊",
    "subMenus": [
      { "id": "sales", "name": "매출 현황", "path": "sales", "componentKey": "SalesPage" }
    ]
  }
]
```

#### [2단계: 컴포넌트 매핑 테이블 (Component Map)]
백엔드는 JSX 컴포넌트 함수를 직접 보낼 수 없으므로, 문자열(`componentKey`)을 실제 React 컴포넌트로 연결하는 매핑 객체를 프론트엔드에 미리 정의합니다:

```tsx
// src/app/routes/component-map.tsx
import UsersPage from "@/pages/UsersPage";
import RolesPage from "@/pages/RolesPage";
import SalesPage from "@/pages/SalesPage";

export const COMPONENT_MAP: Record<string, React.ReactNode> = {
  UsersPage: <UsersPage />,
  RolesPage: <RolesPage />,
  SalesPage: <SalesPage />,
};
```

**자바스크립트/타입스크립트 문법상 객체의 Key는 따옴표("")를 생략해도 자동으로 문자열(string)로 취급**

```tsx
// 따옴표를 생략한 일반적인 표기법
export const COMPONENT_MAP = {
  UsersPage: <UsersPage />,
  RolesPage: <RolesPage />,
};

// 따옴표를 명시적으로 붙인 표기법 (완전히 같은 의미!)
export const COMPONENT_MAP: Record<string, React.ReactNode> = {
  "UsersPage": <UsersPage />,  // Key: string ("UsersPage") ➡️ Value: JSX (<UsersPage />)
  "RolesPage": <RolesPage />,  // Key: string ("RolesPage") ➡️ Value: JSX (<RolesPage />)
};
```
**백엔드에서 JSON 데이터로 **문자열 "UsersPage"**를 보냅니다**
```tsx
const backendKey = "UsersPage"; // string 타입

```
**프론트엔드가 가진 COMPONENT_MAP 사전의 Key(string)로 조회합니다**
```tsx
const page = COMPONENT_MAP[backendKey];
// ➡️ COMPONENT_MAP["UsersPage"] 를 찾아서 실제 <UsersPage /> 컴포넌트를 꺼냄!

```

#### [3단계: 백엔드 메뉴를 RouteObject[] children 배열로 변환하는 함수]
```tsx
// src/app/routes/route-builder.ts
import { Navigate, type RouteObject } from "react-router-dom";
import { COMPONENT_MAP } from "./component-map";

interface BackendSubMenu {
  id: string;
  name: string;
  path: string;
  componentKey: string;
}

interface BackendMenu {
  id: string;
  name: string;
  path: string;
  icon?: string;
  subMenus: BackendSubMenu[];
}

export function buildRouteChildren(backendMenus: BackendMenu[]): RouteObject[] {
  // 1. 대메뉴들을 순회하며 각각의 1 Depth RouteObject 생성
  const dynamicRoutes: RouteObject[] = backendMenus.map((menu) => {
    // 2. 소메뉴들을 2 Depth RouteObject 배열로 변환
    const subRouteChildren: RouteObject[] = menu.subMenus.map((sub) => ({
      path: sub.path,
      element: COMPONENT_MAP[sub.componentKey] ?? <div>존재하지 않는 페이지입니다.</div>,
      handle: { title: sub.name },
    }));

    // 3. 대메뉴 클릭 시 첫 번째 소메뉴로 자동 이동하는 index 라우트 추가
    if (menu.subMenus.length > 0) {
      subRouteChildren.unshift({
        index: true,
        element: <Navigate to={menu.subMenus[0].path} replace />,
      });
    }

    return {
      path: menu.path,
      handle: { title: menu.name, icon: menu.icon },
      children: subRouteChildren, // 하위 2 depth 메뉴 연결!
    };
  });

  return dynamicRoutes;
}
```

#### [4단계: 라우터에 동적 주입하기 (`AppRouter.tsx`)]
```tsx
// src/app/routes/app-router.tsx
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import AppLayout from "../layout/ui/app-layout.container";
import { buildRouteChildren } from "./route-builder";

export default function AppRouter() {
  const [router, setRouter] = useState<any>(null);

  useEffect(() => {
    // 백엔드 API에서 권한별 메뉴 목록 조회
    fetch("/api/my-menus")
      .then((res) => res.json())
      .then((backendMenus) => {
        // 백엔드 데이터로 children 배열 동적 생성!
        const dynamicChildren = buildRouteChildren(backendMenus);

        // 최상위 AppLayout 아래에 동적 children 배치
        const routes: RouteObject[] = [
          {
            path: "/",
            element: <AppLayout />,
            children: [
              ...dynamicChildren,
              { path: "*", element: <div>페이지를 찾을 수 없습니다. (404)</div> },
            ],
          },
        ];

        // 동적으로 완성된 routes로 라우터 생성
        setRouter(createBrowserRouter(routes));
      });
  }, []);

  if (!router) {
    return <div>권한 메뉴 정보를 불러오는 중입니다...</div>;
  }

  return <RouterProvider router={router} />;
}
```

---

## 7. 한눈에 보는 속성 요약표

| 속성 | 비유 | 언제 쓰는가? |
| :--- | :--- | :--- |
| **`loader`** | **식전 준비** | 화면이 뜨기 전에 API 데이터를 먼저 가져오거나, 로그인 여부를 체크할 때 |
| **`action`** | **우체통/접수처** | 폼(Form)에서 입력한 내용을 서버에 보내 저장하고 화면을 새로고침할 때 |
| **`errorElement`**| **비상 안전망** | 해당 화면에서 오류가 났을 때 전체 앱이 먹통되지 않게 안내창을 띄울 때 |
| **`lazy`** | **필요할 때 주문** | 처음 접속할 때 안 쓰는 화면 파일은 나중에 클릭할 때 다운로드할 때 |
| **`handle`** | **이름표 스티커** | 각 라우트에 메뉴명/아이콘을 적어두고, 상단 헤더나 탭에서 그 값을 조회하여 표시할 때 |
| **`children (중첩)`** | **트리 가지치기** | 1차 대메뉴 ➡️ 2차 소메뉴 형태로 계층형 메뉴와 레이아웃을 구성할 때 |
