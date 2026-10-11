// src/widgets/todo-list/model/use-todo-list.ts

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
