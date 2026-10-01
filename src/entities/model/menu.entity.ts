import db from '../../../db.json';

/**
 * 메뉴(Menu) 엔티티 인터페이스
 * - LNB 사이드바 메뉴, 상단 탭, 헤더 타이틀, 라우팅 처리에 사용되는 핵심 메뉴 데이터 모델
 */
export interface Menu {
  /** 메뉴 고유 식별자 (선택 사항) */
  id?: string;
  /** 메뉴 표시 명칭 (예: 'useState') */
  name: string;
  /** 메뉴 라우트 경로 (예: '/use-state') */
  path: string;
  /** 메뉴 아이콘 식별자 또는 이미지 경로 (선택 사항) */
  icon?: string;
  /** 접근 허용 역할 목록 (Role-based Access Control 지원용, 선택 사항) */
  roles?: string[];
  /** 메뉴 정렬 순서 (선택 사항) */
  sortOrder?: number;
  /** 계층형 2-depth 서브 메뉴 목록 (선택 사항) */
  children?: Menu[];
}

/**
 * 하위 호환 및 네이밍 편의를 위한 타입 별칭
 */
export type MenuItem = Menu;

/**
 * 기본 메뉴 목록 데이터
 * - db.json 의 menus 데이터를 기반으로 단일 진실 공급원(Single Source of Truth) 생성
 */
export const DEFAULT_MENUS: Menu[] = db.menus;

/**
 * 계층형 메뉴 배열을 재귀 순회하여 경로(path) -> 메뉴명(name) 맵을 평탄화 생성하는 함수
 */
export const flattenMenuTitles = (menus: Menu[]): Record<string, string> => {
  const result: Record<string, string> = {};
  const traverse = (items: Menu[]) => {
    for (const item of items) {
      result[item.path] = item.name;
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  };
  traverse(menus);
  return result;
};

/**
 * 경로(path)를 키로 하고 메뉴명(name)을 값으로 매핑한 룩업 테이블
 * - 1depth 및 children 2depth 메뉴의 모든 경로를 포함
 */
export const MENU_TITLES: Record<string, string> = flattenMenuTitles(DEFAULT_MENUS);
