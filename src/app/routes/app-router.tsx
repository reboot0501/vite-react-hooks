// src/app/routes/app-router.tsx

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useMenusQuery } from '@/entities/menu';
import { createAppRouter } from './routes';
import { HydrateFallback } from './ui/route-fallbacks';

/**
 * [DB(API) 기반 TanStack Router 공급자 컴포넌트]
 * 1. 백엔드 API(GET /menus)를 통해 db.json의 메뉴 데이터를 비동기로 조회합니다.
 * 2. 조회된 메뉴 데이터와 QueryClient 컨텍스트를 결합하여 TanStack Router 트리를 동적으로 생성합니다.
 * 3. API 서버(json-server) 미기동 등 에러 발생 시에도 isError 상태를 라우터에 전달하여
 *    사이드바 및 본문의 에러 안내 화면이 안전하게 렌더링되도록 보장합니다.
 */
const AppRouter = () => {
  const queryClient = useQueryClient();
  const { data: menus, isPending, isError } = useMenusQuery();

  const router = useMemo(() => {
    if (isPending) return null;
    return createAppRouter({
      menus: menus ?? [],
      queryClient,
      isError,
    });
  }, [menus, isPending, isError, queryClient]);

  if (isPending || !router) {
    return <HydrateFallback />;
  }

  return <RouterProvider router={router} />;
};

export default AppRouter;
