[React + TanStack Query + Jotai.md](file:///d:/project-workspace/vite-react-hooks/doc/react-tanstack-query-jotai/React%20+%20TanStack%20Query%20+%20Jotai.md)의 기능을 FSD(Feature-Sliced Design) 패턴에 맞춰 분해하고, MUI를 배제한 순수 CSS 적용 디렉토리 및 컴포넌트 배정안을 제안합니다.

---

### 1. FSD 계층별 디렉토리 구조 제안

`pages`는 요구사항에 맞춰 `tanstack-query-jotai` 슬라이스 아래에 구성합니다.

```text
src/
├── app/
│   └── providers/
│       ├── query-provider.tsx          # QueryClientProvider 설정
│       ├── jotai-provider.tsx          # Jotai Provider / Store 설정
│       ├── app-provider.tsx            # 전역 Provider 합성 컴포넌트
│       └── index.ts                    # Public API
│
├── pages/
│   └── tanstack-query-jotai/           # [Pages Slice]
│       ├── ui/
│       │   ├── tanstack-query-jotai-page.tsx
│       │   └── tanstack-query-jotai-page.module.css
│       └── index.ts
│
├── widgets/
│   └── todo-list/                      # [Widgets Slice] 복합 UI 블록
│       ├── model/
│       │   ├── use-todo-list.ts        # 상태 동기화 및 이벤트 핸들러 커스텀 훅
│       │   └── index.ts
│       ├── ui/
│       │   ├── todo-list-widget.tsx    # 뷰 컴포넌트
│       │   └── todo-list-widget.module.css
│       └── index.ts
│
├── features/
│   └── todo/                           # [Features Slice] 실무형 Todo 비즈니스 기능 슬라이스
│       ├── api/
│       │   ├── use-create-todo.ts      # 등록 useMutation
│       │   ├── use-update-todo.ts      # 수정 useMutation
│       │   └── use-delete-todo.ts      # 삭제 useMutation
│       ├── ui/
│       │   ├── add-todo-form.tsx       # 등록 폼 컴포넌트
│       │   └── add-todo-form.module.css
│       └── index.ts                    # Public API
│
├── entities/
│   └── todo/                           # [Entities Slice] Todo 도메인 엔티티
│       ├── model/
│       │   ├── todo.entity.ts          # Todo 인터페이스
│       │   └── todo.atom.ts            # Jotai atoms (todosByIdAtom)
│       ├── api/
│       │   ├── todo.api.ts             # axios API 호출 함수
│       │   └── use-todos.query.ts      # 조회 useQuery
│       ├── ui/
│       │   ├── todo-item.tsx           # 개별 항목 뷰
│       │   └── todo-item.module.css
│       └── index.ts
│
└── shared/
    ├── api/
    │   └── axios-instance.ts           # base API 클라이언트
    └── ui/                             # 순수 CSS 공통 컴포넌트
        ├── button/
        │   ├── button.tsx
        │   ├── button.module.css
        │   └── index.ts
        ├── input/
        │   ├── input.tsx
        │   ├── input.module.css
        │   └── index.ts
        └── divider/
            ├── divider.tsx
            ├── divider.module.css
            └── index.ts
```

---

### 2. 레이어별 역할 및 배정 내역

| Layer | Slice / Path | 포함 대상 및 역할 |
| :--- | :--- | :--- |
| **app** | `providers` | 애플리케이션 전역 Provider 설정 (`QueryClientProvider`, Jotai `Provider`) 및 Provider 합성 |
| **pages** | `tanstack-query-jotai` | 페이지 진입점. 위젯을 배치하고 페이지 타이틀 및 메인 컨테이너 레이아웃 구성 |
| **widgets** | `todo-list` | `AddTodoForm` (feature)과 `TodoItem` (entity) 목록, 수정/삭제 액션을 결합한 완성형 단위 |
| **features** | `todo` | Todo 관련 비즈니스 액션 응집 (등록 폼 `AddTodoForm`, CRUD 뮤테이션 훅 `useCreateTodo`, `useUpdateTodo`, `useDeleteTodo`) |
| **entities** | `todo` | Todo 데이터 모델(`Todo`), Jotai 상태(`todoMapAtom`), 조회 쿼리(`useTodosQuery`), 개별 항목 표시 UI |
| **shared** | `ui/*`, `api/*` | 도메인 무관 재사용 요소 (순수 CSS Input, Button, Divider, Axios 인스턴스) |

#### 💡 실무 가이드: Entities와 Features의 분리 기준 (Why Mutation in Features?)

실무에서 등록/수정/삭제 같은 `useMutation` 훅을 `entities`가 아닌 **`features` 레이어**에 구성하는 이유는 **「데이터 그 자체(조회/모델)」와 「사용자의 행동(인터랙션/상태 변경)」을 명확히 분리**하기 위함입니다.

| 구분 | `entities` (엔티티) | `features` (피처) |
| :--- | :--- | :--- |
| **핵심 질문** | *"Todo란 무엇인가?"* (What it is) | *"사용자가 Todo로 무엇을 하는가?"* (What it does) |
| **주요 역할** | 도메인 데이터 모델, 기본 조회(`useTodosQuery`), 개별 항목 뷰 | 사용자 비즈니스 액션 (등록, 수정, 삭제, 필터링 등) |
| **성격** | **수동적(Passive)**: 특정 UX 시나리오에 종속되지 않음 | **능동적(Active)**: 사용자 인터랙션 및 화면 흐름 처리 |
| **실무 예시** | `todo.entity.ts`, `todo.api.ts`, `useTodosQuery` | `useCreateTodo`, `useUpdateTodo`, `AddTodoForm` |

**왜 Mutation은 `features`에 두는가?**
1. **UX 흐름과 사이드 이펙트(Side Effect) 결합**: `useMutation`은 단순히 API 호출만 하는 것이 아니라, 성공/실패 피드백(Alert, Toast), 모달 닫기, 페이지 이동(Navigate), 캐시 무효화(`invalidateQueries`) 등 구체적인 사용자 시나리오를 처리합니다. 이러한 비즈니스 흐름은 엔티티가 아닌 피처의 책임입니다.
2. **엔티티의 순수성 유지 (오염 방지)**: `entities`가 특정 화면이나 폼의 UX 정책에 결합되는 것을 방지합니다. 엔티티는 순수 통신 함수(`createTodo`, `updateTodo`)만 제공하고, 구체적인 인터랙션(`useCreateTodo` 등)은 피처가 조합하여 담당합니다.
3. **기능 단위 On/Off 및 권한 제어**: 조회(엔티티)는 공통으로 쓰이더라도, 등록/삭제(피처)는 사용자 권한(Admin 여부)이나 기획 변경에 따라 독립적으로 수정, 제거, 대체하기 훨씬 수월해집니다.

---

### 3. 주요 모듈 구현 코드 제안

#### (1) `app/providers` — TanStack Query & Jotai 전역 Provider 설정

**[query-provider.tsx](file:///d:/project-workspace/vite-react-hooks/src/app/providers/query-provider.tsx)**
```tsx
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  // 리렌더링 시 QueryClient 인스턴스가 재생성되는 것을 방지하기 위해 lazy initializer(지연 초기화)
  // 사용. useState의 콜백으로 QueryClient 생성 로직을 전달하면, 초기 렌더링 시에만 실행됨.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

**[jotai-provider.tsx](file:///d:/project-workspace/vite-react-hooks/src/app/providers/jotai-provider.tsx)**
```tsx
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Provider, createStore } from 'jotai';

export const JotaiProvider = ({ children }: PropsWithChildren) => {
  // 기본적으로 Jotai는 Provider 없이도 동작하지만, FSD 구조에서 명시적으로 전역 store를
  // 주입하여 상태를 관리하고 SSR 호환성/테스트 용이성을 확보할 수 있음.
  const [store] = useState(() => createStore());

  return <Provider store={store}>{children}</Provider>;
};
```

**[app-provider.tsx](file:///d:/project-workspace/vite-react-hooks/src/app/providers/app-provider.tsx)**
```tsx
import { PropsWithChildren } from 'react';
import { QueryProvider } from './query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <JotaiProvider>
        {children}
      </JotaiProvider>
    </QueryProvider>
  );
};
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/app/providers/index.ts)**
```typescript
export { AppProvider } from './app-provider';
export { QueryProvider } from './query-provider';
export { JotaiProvider } from './jotai-provider';
```

---

#### (2) `shared/api` — 환경 변수 및 공통 Axios 인스턴스

환경별 백엔드 호출 URL은 `.env` 환경 변수로 관리하며, 모든 API 통신은 `shared/api`의 `axiosInstance`를 통해 일관된 `baseURL`, 타임아웃, 인터셉터 설정을 적용받습니다.

**[.env.development](file:///d:/project-workspace/vite-react-hooks/.env.development)**
```env
# 로컬 개발용 Mock API 서버 URL (json-server: port 4000)
VITE_API_URL=http://localhost:4000
```

**[axios-instance.ts](file:///d:/project-workspace/vite-react-hooks/src/shared/api/axios-instance.ts)**
```typescript
import axios from 'axios';
import { setupAuthInterceptor } from './auth-interceptor';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupAuthInterceptor(axiosInstance);
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/shared/api/index.ts)**
```typescript
export * from './axios-instance';
export * from './http-client';
```

---

#### (3) `shared/ui` — 순수 CSS 공통 컴포넌트

**[input.module.css](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/input/input.module.css)**
```css
.input {
  min-width: 420px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #2563eb;
}
```

**[input.tsx](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/input/input.tsx)**
```tsx
import type { InputHTMLAttributes } from 'react';
import styles from './input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = '', ...props }: InputProps) => {
  const inputClass = `${styles.input} ${className}`.trim();

  return <input className={inputClass} {...props} />;
};
```

**[button.module.css](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/button/button.module.css)**
```css
.button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.primary {
  background-color: #2563eb;
  color: #ffffff;
}
.primary:hover {
  background-color: #1d4ed8;
}

.outlined {
  background-color: transparent;
  border-color: #2563eb;
  color: #2563eb;
}
.outlined:hover {
  background-color: #eff6ff;
}

.danger {
  background-color: transparent;
  border-color: #dc2626;
  color: #dc2626;
}
.danger:hover {
  background-color: #fef2f2;
}
```

**[button.tsx](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/button/button.tsx)**
```tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined' | 'danger';
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const variantClass = styles[variant] || '';
  const buttonClass = `${styles.button} ${variantClass} ${className}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
```

**[divider.module.css](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/divider/divider.module.css)**
```css
.divider {
  border: none;
  border-bottom: 2px solid #ccc;
  margin: 0;
  margin-bottom: 24px;
  width: 100%;
}
```

**[divider.tsx](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/divider/divider.tsx)**
```tsx
import type { HTMLAttributes } from 'react';
import styles from './divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {}

export const Divider = ({ className = '', ...props }: DividerProps) => {
  const dividerClass = `${styles.divider} ${className}`.trim();

  return <hr className={dividerClass} {...props} />;
};
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/shared/ui/index.ts)**
```typescript
export * from './button';
export * from './input';
export * from './divider';
```

---

#### (4) `entities/todo` — 도메인 모델, 상태, API 및 조회

**[todo.entity.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/model/todo.entity.ts)**
```typescript
// Domain Entity (조회 시 id 포함)
export interface Todo {
  id: string;
  text: string;
}

// Todo 등록 DTO (id 제외)
export interface CreateTodoDto {
  text: string;
}

// Todo 수정 DTO (대상 id + 수정할 내용)
export interface UpdateTodoDto {
  id: string;
  text: string;
}

// Dictionary 형태로 데이터를 다루기 위한 타입
export type TodoMap = Record<string, Todo>;

// List 형태로 데이터를 다루기 위한 타입
export type TodoList = Todo[];
```

**[todo.atom.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/model/todo.atom.ts)**
```typescript
import { atom } from 'jotai';
import type { TodoMap } from './todo.entity';

// dictionary 타입의 상태를 다루는 atom
export const todoMapAtom = atom<TodoMap>({});
// dictionary -> list 변환하는 derived atom
export const todoListAtom = atom((get) => Object.values(get(todoMapAtom)));
```

**[todo.api.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/api/todo.api.ts)**
```typescript
import { axiosInstance } from '@/shared/api';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../model/todo.entity';

export const getTodos = async (): Promise<Todo[]> => {
  const res = await axiosInstance.get<Todo[]>('/todos');
  return res.data;
};

export const createTodo = async (newTodo: CreateTodoDto): Promise<Todo> => {
  const res = await axiosInstance.post<Todo>('/todos', newTodo);
  return res.data;
};

export const updateTodo = async ({ id, text }: UpdateTodoDto): Promise<Todo> => {
  const res = await axiosInstance.put<Todo>(`/todos/${id}`, { text });
  return res.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/todos/${id}`);
};
```

**[use-todos.query.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/api/use-todos.query.ts)**
```typescript
import { useQuery } from '@tanstack/react-query';
import type { Todo } from '../model/todo.entity';
import { getTodos } from './todo.api';

export const todoQueryKeys = {
  all: ['todos'] as const,
  list: () => [...todoQueryKeys.all, 'list'] as const,
};

export const useTodosQuery = () => {
  return useQuery<Todo[]>({
    queryKey: todoQueryKeys.list(),
    queryFn: getTodos,
  });
};
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/api/index.ts)**

```typescript
// src/entities/todo/api/index.ts

export * from './todo.api';
export * from './use-todos.query';
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/entities/todo/index.ts)**
```typescript
// src/entities/todo/index.ts

export * from './model';
export * from './api';
```

---

#### (5) `features/todo` — 실무형 단일 기능 슬라이스 (CRUD 로직 및 폼 응집)

**[use-create-todo.ts](file:///d:/project-workspace/vite-react-hooks/src/features/todo/api/use-create-todo.ts)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoQueryKeys, createTodo } from '@/entities/todo';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      alert('등록 완료!');
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
    onError: () => alert('등록 실패!'),
  });
};
```

**[use-update-todo.ts](file:///d:/project-workspace/vite-react-hooks/src/features/todo/api/use-update-todo.ts)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoQueryKeys, updateTodo } from '@/entities/todo';

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      alert('수정 완료!');
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
    onError: () => alert('수정 실패!'),
  });
};
```

**[use-delete-todo.ts](file:///d:/project-workspace/vite-react-hooks/src/features/todo/api/use-delete-todo.ts)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoQueryKeys, deleteTodo } from '@/entities/todo';

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
    onError: () => alert('삭제 실패!'),
  });
};
```

**[add-todo-form.module.css](file:///d:/project-workspace/vite-react-hooks/src/features/todo/ui/add-todo-form.module.css)**
```css
.form {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 24px;
}
```

**[add-todo-form.tsx](file:///d:/project-workspace/vite-react-hooks/src/features/todo/ui/add-todo-form.tsx)**
```tsx
import { useState, type SubmitEvent } from 'react';
import { useCreateTodo } from '../api/use-create-todo';
import { Input, Button } from '@/shared/ui';
import styles from './add-todo-form.module.css';

export const AddTodoForm = () => {
  const [text, setText] = useState('');
  const createMutation = useCreateTodo();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('할일을 입력하세요!');
      return;
    }

    createMutation.mutate(
      { text },
      {
        onSuccess: () => setText(''),
      }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        value={text}
        placeholder="새로운 할 일을 입력하세요"
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" variant="primary" disabled={createMutation.isPending}>
        등록
      </Button>
    </form>
  );
};
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/features/todo/index.ts)**
```typescript
export * from './api';
export * from './ui';
```

---

#### (6) `widgets/todo-list` — 위젯 조립

**[use-todo-list.ts: (로직 캡슐화-서버 데이터 조회, Jotai 동기화, 수정/삭제 핸들러 로직을 훅으로 분리)](file:///d:/project-workspace/vite-react-hooks/src/widgets/todo-list/model/use-todo-list.ts)**
```typescript
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useTodosQuery, todoMapAtom } from '@/entities/todo';
import { useUpdateTodo, useDeleteTodo } from '@/features/todo';

export const useTodoList = () => {
  const { data: todos, isLoading } = useTodosQuery();
  const [todoMap, setTodoMap] = useAtom(todoMapAtom);

  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  // 서버에서 조회된 데이터를 로컬 Jotai 상태(dictionary)로 동기화
  useEffect(() => {
    if (todos) {
      const mapped = Object.fromEntries(todos.map((t) => [t.id, t]));
      setTodoMap(mapped);
    }
  }, [todos, setTodoMap]);

  // 로컬 상태 편집 핸들러
  const handleEditChange = (id: string, text: string) => {
    setTodoMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], text },
    }));
  };

  // 서버 수정 요청 핸들러
  const handleUpdate = (id: string) => {
    const target = todoMap[id];
    if (target) {
      updateMutation.mutate(target);
    }
  };

  // 서버 삭제 요청 핸들러
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    todoList: Object.values(todoMap),
    isLoading,
    handleEditChange,
    handleUpdate,
    handleDelete,
  };
};
```

**[todo-list-widget.module.css](file:///d:/project-workspace/vite-react-hooks/src/widgets/todo-list/ui/todo-list-widget.module.css)**
```css
.container {
  padding: 16px;
}

.loading {
  font-size: 14px;
  color: #6b7280;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**[todo-list-widget.tsx: (순수 뷰-컴포넌트 본문이 매우 간결해지고 오직 화면 렌더링에만 집중)](file:///d:/project-workspace/vite-react-hooks/src/widgets/todo-list/ui/todo-list-widget.tsx)**
```tsx
import { useTodoList } from '../model';
import { AddTodoForm } from '@/features/todo';
import { Input, Button, Divider } from '@/shared/ui';
import styles from './todo-list-widget.module.css';

export const TodoListWidget = () => {
  const { todoList, isLoading, handleEditChange, handleUpdate, handleDelete } = useTodoList();

  if (isLoading) return <p className={styles.loading}>로딩 중...</p>;

  return (
    <div className={styles.container}>
      <AddTodoForm />
      <Divider />
      <ul className={styles.list}>
        {todoList.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <Input
              value={todo.text}
              onChange={(e) => handleEditChange(todo.id, e.target.value)}
            />
            <Button variant="outlined" onClick={() => handleUpdate(todo.id)}>
              수정
            </Button>
            <Button variant="danger" onClick={() => handleDelete(todo.id)}>
              삭제
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**[index.ts](file:///d:/project-workspace/vite-react-hooks/src/widgets/todo-list/index.ts)**
```typescript
export * from './ui';
export * from './model';
```

---

#### (7) `pages/tanstack-query-jotai` — 페이지 슬라이스

**[tanstack-query-jotai-page.tsx](file:///d:/project-workspace/vite-react-hooks/src/pages/tanstack-query-jotai/ui/tanstack-query-jotai-page.tsx)**
```tsx
import { TodoListWidget } from '@/widgets/todo-list';
import styles from './tanstack-query-jotai-page.module.css';

export const TanstackQueryJotaiPage = () => {
  return (
    <main className={styles.page}>
      <h2 className={styles.title}>📋 Todo List (React Query + Jotai)</h2>
      <TodoListWidget />
    </main>
  );
};
```

**[tanstack-query-jotai-page.module.css](file:///d:/project-workspace/vite-react-hooks/src/pages/tanstack-query-jotai/ui/tanstack-query-jotai-page.module.css)**
```css
.page {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}
```

이 구조를 적용하면 MUI 의존성 없이 스타일이 독립적으로 관리되며, 서버 상태(`useQuery`/`useMutation`)와 클라이언트 편집 버퍼 상태(`todosByIdAtom`)가 `entities` 및 `features` 레이어로 명확히 격리됩니다.