// src/app/providers/app-provider.tsx

import type { PropsWithChildren } from 'react';
import { QueryProvider } from './query-provider';
import { JotaiProvider } from './jotai-provider';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <JotaiProvider>{children}</JotaiProvider>
    </QueryProvider>
  );
};