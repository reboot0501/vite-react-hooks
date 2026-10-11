// src/app/providers/jotai-provider.tsx

import type { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { appStore } from '@/shared/model';

export const JotaiProvider = ({ children }: PropsWithChildren) => {
  // 기본적으로 Jotai는 Provider 없이도 동작하지만, FSD 구조에서 명시적으로 전역 store를
  // 주입하여 상태를 관리하고 SSR 호환성/테스트 용이성을 확보할 수 있음.
  // React 외부(에러 핸들러 등)와 같은 store를 공유하기 위해 shared/model 의 appStore 를 주입한다.
  return <Provider store={appStore}>{children}</Provider>;
};