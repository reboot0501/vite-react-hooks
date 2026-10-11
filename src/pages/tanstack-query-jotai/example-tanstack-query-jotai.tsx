// src/pages/tanstack-query-jotai/example-tanstack-query-jotai.tsx

import { TodoListWidget } from '@/widgets/todo-list';
import styles from './tanstack-query-jotai-page.module.css';

export const ExampleTanstackQueryJotai = () => {
  return (
    <main className={styles.page}>
      <h2 className={styles.title}>📋 Todo List (React Query + Jotai)</h2>
      <TodoListWidget />
    </main>
  );
};

export default ExampleTanstackQueryJotai;