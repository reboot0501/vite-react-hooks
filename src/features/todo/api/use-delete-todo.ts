// src/features/todo/api/use-delete-todo.ts

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