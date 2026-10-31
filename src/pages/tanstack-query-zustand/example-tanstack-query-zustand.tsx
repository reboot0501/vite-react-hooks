// src/pages/tanstack-query-zustand/example-tanstack-query-zustand.tsx

import { TodoListWidget } from '@/widgets/todo-list';
import styles from './tanstack-query-zustand-page.module.css';

export const ExampleTanstackQueryZustand = () => {
  return (
    <main className={styles.page}>
      <h2 className={styles.title}>📋 Todo List (TanStack Query + Zustand)</h2>
      <TodoListWidget />
    </main>
  );
};

export default ExampleTanstackQueryZustand;

