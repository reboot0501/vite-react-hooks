// src/entities/menu/api/menu.api.ts
import { get } from "@/shared/api";
import { DEFAULT_MENUS, type Menu } from "../model/menu.entity";

/**
 * 메뉴 목록 조회 API
 * - 백엔드/Mock 서버(json-server)의 /menus 엔드포인트에서 메뉴 데이터를 조회합니다.
 * - 서버 미구동 시 db.json 기반의 DEFAULT_MENUS로 안전하게 폴백(Fallback)합니다.
 */
export async function fetchMenus(): Promise<Menu[]> {
  try {
    const data = await get<Menu[]>("/menus");
    return data && data.length > 0 ? data : DEFAULT_MENUS;
  } catch (error) {
    console.warn("[Menu API] 서버로부터 메뉴를 가져오지 못하여 db.json 기본 데이터를 사용합니다.", error);
    return DEFAULT_MENUS;
  }
}