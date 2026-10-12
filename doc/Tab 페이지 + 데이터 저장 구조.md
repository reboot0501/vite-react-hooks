# Tab 페이지 + 데이터 상태 보존(Keep-Alive) 구조 가이드

React Router 기반 SPA 환경에서 다중 탭(Multi-Tab)을 사용할 때, 탭 전환 시 컴포넌트가 언마운트(Unmount)되어 폼 데이터나 조회 결과가 초기화되는 문제를 해결하고 실무 표준 규격을 적용한 구조 정리 문서입니다.

---

## 1. 핵심 동작 원리 (Keep-Alive)

* **기존 문제점**: `<Outlet />`을 사용할 경우, 라우트(URL)가 변경되면 기존 화면 컴포넌트가 DOM에서 소멸(Unmount)되어 `useState`, 스크롤, 폼 입력값 등이 모두 날아감.
* **해결 원리**:
  1. React Router의 `useOutlet()` 훅으로 현재 경로에 해당하는 React 컴포넌트 엘리먼트를 추출.
  2. 탭 경로(`path`)별로 인스턴스를 캐시 객체(`outletCache`)에 보관.
  3. 모든 탭 화면을 DOM에 유지하면서, **현재 활성 탭만 `display: block`, 비활성 탭은 `display: none`** 처리.
  4. 탭을 닫을 때는 캐시에서 해당 인스턴스를 삭제하여 메모리를 완전 해제(Garbage Collection).

---

## 2. 수정 대상 파일 목록 (어디를 고쳐야 하는가?)

| 파일 경로 | 역할 및 수정 내용 |
| :--- | :--- |
| **`src/app/layout/ui/app-main.tsx`** | `<Outlet />` 대신 탭별 패널 컨테이너 렌더링 (`display: none/block` 제어) |
| **`src/app/layout/ui/app-layout.container.tsx`** | `useOutlet()` 캐싱 관리, 최대 탭 개수(10개) 제약, 탭 닫기 시 메모리 해제 |
| **`src/app/layout/ui/app-header.tsx`** | (기존 유지) 탭 클릭(`onSelectTab`) 및 닫기(`onCloseTab`) 이벤트 전달 |

---

## 3. 파일별 핵심 로직 수정 상세

### ① `src/app/layout/ui/app-main.tsx` (메인 화면 영역)

#### [수정 전]
단순 `<Outlet />`을 렌더링하여 라우트 전환 시 이전 컴포넌트가 언마운트됨.
```tsx
<section className="main-content">
  <Outlet />
</section>
```

#### [수정 후]
열려 있는 `tabs` 배열을 순회하며, 각 탭의 화면 인스턴스(`outletCache`)를 래핑 div에 렌더링하고 활성 탭만 노출.
```tsx
import type { ReactNode } from "react";
import type { TabItem } from "./app-header";

interface MainProps {
  title: string;
  isError?: boolean;
  tabs?: TabItem[];
  activePath?: string;
  outletCache?: Record<string, ReactNode>;
}

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
        <h3>{title}</h3>
      </section>
      <section className="main-content">
        {isError ? (
          <div className="main-error-fallback">...</div>
        ) : (
          /* Keep-Alive: 열린 탭을 모두 DOM에 유지하고 활성 탭만 display: block */
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
```

---

### ② `src/app/layout/ui/app-layout.container.tsx` (레이아웃 컨테이너)

#### [핵심 추가 로직]
1. **`useOutlet()` 및 캐시 State 생성**:
   ```tsx
   import { useOutlet } from 'react-router-dom';

   const currentOutlet = useOutlet();
   const [outletCache, setOutletCache] = useState<Record<string, ReactNode>>({});
   const prevActivePathRef = useRef<string>(location.pathname);
   ```

2. **현재 화면을 캐시에 자동 저장**:
   ```tsx
   useEffect(() => {
     if (currentOutlet && location.pathname) {
       setOutletCache((prev) => {
         if (prev[location.pathname] === currentOutlet) return prev;
         return {
           ...prev,
           [location.pathname]: currentOutlet,
         };
       });
     }
   }, [location.pathname, currentOutlet]);
   ```

3. **최대 탭 개수(10개) 제약 및 알림**:
   ```tsx
   const MAX_TABS = 10;

   useEffect(() => {
     const title = menuTitles[location.pathname];
     if (!title) return;

     setTabs((prev) => {
       // 이미 열려있는 탭이면 패스
       if (prev.some((tab) => tab.path === location.pathname)) {
         prevActivePathRef.current = location.pathname;
         return prev;
       }

       // 10개 초과 시 알림 후 직전 탭으로 롤백
       if (prev.length >= MAX_TABS) {
         alert(`탭은 최대 ${MAX_TABS}개까지만 열 수 있습니다.\n기존 탭을 먼저 닫은 후 다시 시도해 주세요.`);
         navigate(prevActivePathRef.current, { replace: true });
         return prev;
       }

       prevActivePathRef.current = location.pathname;
       return [...prev, { path: location.pathname, title }];
     });
   }, [location.pathname, menuTitles, navigate]);
   ```

4. **탭 닫기 시 메모리 해제 (GC 유도)**:
   ```tsx
   const handleCloseTab = (pathToRemove: string) => {
     // 1. 탭 목록에서 제거
     const targetIndex = tabs.findIndex((tab) => tab.path === pathToRemove);
     if (targetIndex === -1) return;

     const updatedTabs = [
       ...tabs.slice(0, targetIndex),
       ...tabs.slice(targetIndex + 1),
     ];
     setTabs(updatedTabs);

     // 2. 캐시에서 인스턴스 완전 제거 (메모리 누수 방지 핵심)
     setOutletCache((prev) => {
       const next = { ...prev };
       delete next[pathToRemove];
       return next;
     });

     // 3. 닫힌 탭이 활성 탭이었던 경우 인접 탭으로 라우팅
     if (location.pathname === pathToRemove) {
       if (updatedTabs.length > 0) {
         const nextActiveIndex = Math.max(0, targetIndex - 1);
         navigate(updatedTabs[nextActiveIndex].path);
       } else {
         navigate('/use-state/timer');
       }
     }
   };
   ```

5. **Main 컴포넌트에 Props 전달**:
   ```tsx
   <Main
     title={currentTitle}
     isError={isError}
     tabs={tabs}
     activePath={location.pathname}
     outletCache={outletCache}
   />
   ```

---

## 4. 실무 권장 정책(Best Practice) 요약

1. **상태 보존 방식**:
   * 외부 라이브러리 의존성 없이 React 19 / React Router 표준 API(`useOutlet`)와 `display: none` 구조로 안전하게 처리.
2. **탭 개수 제약**:
   * **최대 10개**로 제한하여 브라우저 JS Heap 메모리 과점유 방지.
   * 임의 자동 종료(LRU) 대신 **경고 팝업 안내 후 차단** 방식으로 업무 데이터 유실 방지.
3. **팝업/모달의 영향도**:
   * 화면 내에서 열리는 레이어 팝업이나 모달은 화면의 자식 요소이므로 탭 개수 및 캐시 제약에 영향을 받지 않음.
