// src/features/todo/ui/add-todo-form.tsx

import { useState, type SubmitEvent } from 'react';
import { useCreateTodo } from '../api/use-create-todo';
import { Input, Button } from '@/shared/ui';
import styles from './add-todo-form.module.css';

export const AddTodoForm = () => {
  const [text, setText] = useState('');
  const createMutation = useCreateTodo();
  //  React 19의 FormEvent 대신, 표준 브라우저 DOM 스펙에 맞춰 이벤트 타입 정의
  //  - 폼 제출(onSubmit): SubmitEvent 권장
  //  - 값 변경(onChange): ChangeEvent 권장
  //  - 입력(onInput): InputEvent 권장
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('할일을 입력하세요!');
      return;
    }

    createMutation.mutate(
      { text },
      {
        onSuccess: () => setText(''),
      }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        value={text}
        placeholder="새로운 할 일을 입력하세요"
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" variant="primary" disabled={createMutation.isPending}>
        등록
      </Button>
    </form>
  );
};