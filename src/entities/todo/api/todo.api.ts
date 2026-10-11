// src/entities/todo/api/todo.api.ts

import { axiosInstance } from '@/shared/api';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../model/todo.entity';

/**
 * Todo 목록 조회 API
 */
export const getTodos = async (): Promise<Todo[]> => {
  const res = await axiosInstance.get<Todo[]>('/todos');
  return res.data;
};

/**
 * Todo 생성 API
 */
export const createTodo = async (newTodo: CreateTodoDto): Promise<Todo> => {
  const res = await axiosInstance.post<Todo>('/todos', newTodo);
  return res.data;
};

/**
 * Todo 수정 API
 */
export const updateTodo = async ({ id, text }: UpdateTodoDto): Promise<Todo> => {
  const res = await axiosInstance.put<Todo>(`/todos/${id}`, { text });
  return res.data;
};

/**
 * Todo 삭제 API
 */
export const deleteTodo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/todos/${id}`);
};
