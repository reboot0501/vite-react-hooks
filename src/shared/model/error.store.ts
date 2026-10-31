// 전역 에러 상태를 관리하는 Zustand Store
// src/shared/model/error.store.ts
import { create } from 'zustand';

export interface ErrorState {
  errorCode?: string;
  errorType?: string;
  message?: string;
  onConfirm?: () => void;
}

export interface ErrorStore {
  /** 현재 전역 에러 상태 (null이면 에러 없음) */
  error: ErrorState | null;
  /** 전역 에러 설정 (알림 팝업 표시 유도) */
  setError: (error: ErrorState | null) => void;
  /** 전역 에러 초기화 (알림 팝업 닫기) */
  clearError: () => void;
}

/**
 * 전역 에러 상태를 관리하는 Zustand Store입니다.
 * - React 컴포넌트 내부: `useErrorStore((state) => state.error)`로 구독
 * - React 컴포넌트 외부(axios 인터셉터, handleApiError 등): `useErrorStore.getState().setError(...)`로 직접 호출
 * - 별도의 Provider 래퍼 없이 앱 전역에서 동일한 싱글톤 스토어를 공유합니다.
 */
export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

