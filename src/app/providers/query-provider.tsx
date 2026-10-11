// src/app/providers/query-provider.tsx

import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { handleApiError } from '@/shared/api';

// useQuery / useMutation 의 meta 옵션 타입 확장
// meta: { skipGlobalError: true } 지정 시 전역 에러 팝업을 건너뛴다.
declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { skipGlobalError?: boolean };
    mutationMeta: { skipGlobalError?: boolean };
  }
}

export const QueryProvider = ({ children }: PropsWithChildren) => {
  // 리렌더링 시 QueryClient 인스턴스가 재생성되는 것을 방지하기 위해 lazy initializer(지연 초기화)
  // 사용. useState의 콜백으로 QueryClient 생성 로직을 전달하면, 초기 렌더링 시에만 실행됨.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 모든 Query 에러를 한 곳에서 처리 (훅마다 onError 를 붙일 필요 없음)
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.skipGlobalError) return;
            handleApiError(error);
          },
        }),
        // 모든 Mutation 에러를 한 곳에서 처리
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // 훅에서 자체 onError 를 지정했다면 그쪽 처리를 우선하고 전역 팝업은 생략
            if (mutation.options.onError || mutation.meta?.skipGlobalError) return;
            handleApiError(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};