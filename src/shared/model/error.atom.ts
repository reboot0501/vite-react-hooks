// 전역 에러 상태를 관리하는 Atom
// src/shared/model/error.atom.ts
import { atom } from 'jotai';

export interface ErrorState {
    errorCode?: string;
    errorType?: string;
    message?: string;
    onConfirm?: () => void;
}

/**
 * 전역 에러 상태를 관리하는 Atom입니다.
 * null일 경우 에러가 없는 상태이며, 값이 있을 경우 알림 팝업이 표시됩니다.
 * onConfirm 함수가 있을 경우 팝업의 '확인' 버튼 클릭 시 실행됩니다.
 */
export const errorAtom = atom<ErrorState | null>(null);
