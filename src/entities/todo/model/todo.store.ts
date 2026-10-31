// src/entities/todo/model/todo.store.ts
import { create } from 'zustand';
import type { Todo, TodoMap } from './todo.entity';

export interface TodoStore {
  /** Dictionary(id -> Todo) 형태의 로컬 편집 상태 */
  todoMap: TodoMap;
  /** TodoMap 전체 교체 */
  setTodoMap: (todoMap: TodoMap) => void;
  /** 서버에서 조회된 Todo 배열을 Dictionary(TodoMap)로 변환하여 동기화 */
  setTodos: (todos: Todo[]) => void;
  /** 특정 Todo 항목의 로컬 텍스트 편집 */
  updateTodoText: (id: string, text: string) => void;
}

/**
 * Todo 엔티티의 로컬 클라이언트 상태를 관리하는 Zustand Store
 */
export const useTodoStore = create<TodoStore>((set) => ({
  todoMap: {},
  setTodoMap: (todoMap) => set({ todoMap }),
  setTodos: (todos) =>
    set({
      todoMap: Object.fromEntries(todos.map((todo) => [todo.id, todo])),
    }),
  updateTodoText: (id, text) =>
    set((state) => {
      const target = state.todoMap[id];
      if (!target) return state;
      return {
        todoMap: {
          ...state.todoMap,
          [id]: { ...target, text },
        },
      };
    }),
}));

