// 앱 전역에서 공유하는 Jotai store
// src/shared/model/store.ts
import { createStore } from 'jotai';

/**
 * 앱 전역 Jotai store (단일 인스턴스)
 *
 * - React 내부: app/providers/jotai-provider.tsx 의 <Provider store={appStore}> 로 주입
 * - React 외부: axios 인터셉터, 공통 에러 핸들러 등에서 appStore.get / appStore.set 으로 직접 접근
 *
 * Provider와 외부 코드가 반드시 "같은 store"를 바라봐야 상태 변경이 UI에 반영된다.
 * (createStore()를 Provider 안에서 따로 만들면 외부에서 set 한 값이 컴포넌트에 전달되지 않음)
 */
export const appStore = createStore();
