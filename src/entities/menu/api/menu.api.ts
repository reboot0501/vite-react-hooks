// src/entities/menu/api/menu.api.ts
import { get } from "@/shared/api";
import { type Menu } from "../model/menu.entity";

/**
 * 메뉴 목록 조회 API
 * - 백엔드/Mock 서버(json-server)의 /menus 엔드포인트에서 메뉴 데이터를 조회합니다.
 */
export async function fetchMenus(): Promise<Menu[]> {
  const data = await get<Menu[]>("/menus");
  return data;
}