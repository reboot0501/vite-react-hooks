// src/entities/todo/api/use-todos.query.ts

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