Jotai와 Zustand는 기본적으로 전역 모듈 방식으로 동작하므로 Provider 없이도 동작하지만, **상태 격리(서브트리 단위), SSR 호환성, Props 기반 초기화**를 위해 Provider 형태로 함께 구성할 수 있습니다.

FSD 아키텍처의 `app/providers` 레이어에서 이를 통합하는 방법입니다.

---

### 1. 두 라이브러리의 Provider 개념 차이

* **Jotai (`Provider`)**:
  * 기본적으로 공급자 없이도 전역 Store가 자동 생성됩니다.
  * 하위 트리별로 Atom 상태를 격리하거나(독립 인스턴스), 커스텀 Store를 주입할 때 `Provider`를 감쌉니다.
* **Zustand (Context 기반 Provider)**:
  * 일반적인 `create()` 훅은 싱글톤이라 Provider가 필요 없습니다.
  * 컴포넌트 생명주기/Props에 종속된 Store를 만들거나 재사용 가능한 독립 서브트리를 만들 때 `createStore`(`zustand/vanilla`)와 React Context를 결합하여 Provider 형태로 사용합니다.

---

### 2. Provider 통합 구성 (`app/providers`)

#### (1) Zustand Context Provider 생성 (예: 전역 유저/앱 세션 스토어)

**`src/app/providers/auth-store-provider.tsx`** (또는 `entities/auth/model/auth-store-provider.tsx`)
```tsx
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { createStore, useStore } from 'zustand';

// 1. Store 타입 및 상태 정의
interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

const createAuthStore = () =>
  createStore<AuthState>((set) => ({
    token: null,
    setToken: (token) => set({ token }),
  }));

type AuthStore = ReturnType<typeof createAuthStore>;

// 2. React Context 생성
const AuthStoreContext = createContext<AuthStore | null>(null);

// 3. Provider 컴포넌트
export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AuthStore>();
  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

// 4. Custom Hook
export const useAuthStore = <T,>(selector: (state: AuthState) => T): T => {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error('AuthStoreProvider 내에서 호출해야 합니다.');
  return useStore(store, selector);
};
```

---

#### (2) 통합 App Provider 구성

FSD의 `app/providers`에서 TanStack Query, Jotai, Zustand Provider를 하나의 합성 컴포넌트로 묶습니다.

**`src/app/providers/app-provider.tsx`**
```tsx
import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider, createStore as createJotaiStore } from 'jotai';
import { AuthStoreProvider } from './auth-store-provider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // TanStack Query 클라이언트 인스턴스
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Jotai 커스텀 store 인스턴스 (필요 시 격리된 상태 관리)
  const [jotaiStore] = useState(() => createJotaiStore());

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={jotaiStore}>
        <AuthStoreProvider>
          {children}
        </AuthStoreProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
};
```

**`src/app/index.tsx` (또는 `src/main.tsx`) 적용:**
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './providers/app-provider';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
```

---

### 3. (추가 팁) Jotai 안에서 Zustand Store를 직접 연동하는 방법

만약 Zustand의 상태를 Jotai Atom으로 변환하여 동일한 컴포넌트에서 읽고 싶다면, `jotai-zustand` 패키지를 활용할 수 있습니다.

```bash
pnpm add jotai-zustand
```

```typescript
// entities/auth/model/auth.atoms.ts
import { atomWithStore } from 'jotai-zustand';
import { useAuthVanillaStore } from './auth-store'; // zustand vanilla store

// Zustand store를 Jotai atom으로 변환
export const authAtom = atomWithStore(useAuthVanillaStore);
```

이 방식을 사용하면 Zustand의 스토어 업데이트가 Jotai Atom 구독 컴포넌트에도 자동으로 전파됩니다.

---

### 4. 권장 역할 분담

| 라이브러리 | 권장 담당 영역 | 예시 |
| :--- | :--- | :--- |
| **TanStack Query** | 서버 비동기 캐시 상태 | `posts`, `userInfo` API 조회/뮤테이션 |
| **Zustand** | 전역 비즈니스 로직 및 앱 공통 Store | 세션/인증 토큰, 레이아웃/사이드바 토글, 알림 큐 |
| **Jotai** | 컴포넌트/UI 단위의 세밀한 로컬 버퍼 상태 | 수정 중인 Form 버퍼(`postsByIdAtom`), 실시간 필터 입력값 |