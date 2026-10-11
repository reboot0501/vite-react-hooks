// src/app/routes/default-menus.ts
import db from '../../../db.json';
import type { Menu } from '@/entities/menu';

/**
 * [1차 단계: 로컬 정적 라우트 생성용 기본 메뉴 목록]
 * - React Router의 createBrowserRouter 초기화 시점에 전체 라우트 트리를
 *   선언적으로 자동 구성하기 위한 Single Source of Truth입니다.
 * 
 * ----------------------------------------------------------------------------
 * [추후 고도화 아키텍처 로드맵]
 * 1. 백엔드 권한 기반 LNB 메뉴 로딩:
 *    - 사용자가 로그인하면 백엔드 인증 API(예: GET /api/users/me/menus)로부터
 *      권한(roles)에 필터링된 메뉴 목록만 가져와 사이드바에 렌더링합니다.
 * 2. 제로-컨피그 완전 자동 라우팅 전환:
 *    - 본 파일(default-menus.ts)을 완전히 제거하고,
 *      routes.tsx의 PAGE_MODULES(import.meta.glob) 목록을 기반으로
 *      src/pages 하위의 모든 페이지 컴포넌트를 라우터에 자동 등록하도록 고도화할 수 있습니다.
 * 3. 권한 가드(Protected Route):
 *    - URL 직접 입력 시 권한 없는 페이지 접근은 ProtectedRoute 또는 loader의
 *      Role 체크 로직을 통해 403 Forbidden 화면으로 안전하게 통제합니다.
 * ----------------------------------------------------------------------------
 */
export const DEFAULT_MENUS: Menu[] = db.menus;
