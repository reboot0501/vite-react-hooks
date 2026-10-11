// src/features/todo/api/use-update-todo.ts

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