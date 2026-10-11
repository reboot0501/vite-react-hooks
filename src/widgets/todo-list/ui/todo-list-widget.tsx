// src/widgets/todo-list/ui/todo-list-widget.tsx

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
