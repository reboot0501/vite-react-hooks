// src/entities/todo/model/todo.atom.ts
import { atom } from 'jotai';
import type { TodoMap } from './todo.entity';

// dictionary 타입의 상태를 다루는 atom
export const todoMapAtom = atom<TodoMap>({});
// dictionary -> list 변환하는 derived atom
export const todoListAtom = atom((get) => Object.values(get(todoMapAtom)));