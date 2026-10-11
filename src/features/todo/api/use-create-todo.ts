// src/features/todo/use-create-todo.ts

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