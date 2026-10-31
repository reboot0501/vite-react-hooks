// src/entities/menu/api/use-menus.query.ts

import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Menu } from '../model/menu.entity';
import { fetchMenus } from './menu.api';

export const menuQueryKeys = {
  all: ['menus'] as const,
  list: () => [...menuQueryKeys.all, 'list'] as const,
};

/**
 * TanStack Router loader(ensureQueryData)와 컴포넌트(useQuery) 양쪽에서
 * 동일하게 재사용할 수 있는 메뉴 목록 Query Options 팩토리
 */
export const menuListQueryOptions = () =>
  queryOptions<Menu[]>({
    queryKey: menuQueryKeys.list(),
    queryFn: fetchMenus,
    staleTime: Infinity,
    retry: 1,
    meta: { skipGlobalError: true },
  });

export const useMenusQuery = () => {
  return useQuery(menuListQueryOptions());
};

