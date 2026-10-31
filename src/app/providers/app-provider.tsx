// src/app/providers/app-provider.tsx

import type { PropsWithChildren } from 'react';
import { QueryProvider } from './query-provider';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>;
};
