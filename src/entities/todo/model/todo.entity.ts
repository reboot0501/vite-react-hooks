// src/entities/todo/model/todo.entity.ts

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
