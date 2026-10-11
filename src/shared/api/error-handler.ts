// src/shared/api/error-handler.ts
import { isAxiosError } from 'axios';
import { appStore, errorAtom } from '@/shared/model';

/** 백엔드 에러 응답 바디 형태 */
interface ApiErrorResponse {
    message?: string;
    error?: string;
    errorCode?: string;
    errorType?: string;
}

/**
 * handleApiError
 *
 * ─ 활용 시점 ──────────────────────────────────────────────────────────────────
 * API 호출 후 에러가 발생했을 때 공통 처리가 필요한 모든 곳에서 사용한다.
 *
 * 1) TanStack Query 전역 핸들러 (기본, 권장)
 *    - app/providers/query-provider.tsx 의 QueryCache / MutationCache onError 에 등록되어 있음
 *    - 개별 훅에서 따로 호출할 필요 없음
 *
 * 2) 전역 처리를 건너뛰고 싶은 경우
 *    - useMutation 에 자체 onError 를 지정하면 전역 팝업은 표시되지 않음
 *    - 또는 meta: { skipGlobalError: true } 지정 (useQuery / useMutation 공통)
 *
 * 3) TanStack Query 밖 (직접 호출한 axios, try/catch 블록 등)
 *    - catch (e) { handleApiError(e); }
 *
 * ─ 현재 처리 내용 ─────────────────────────────────────────────────────────────
 * - 401 Unauthorized → 팝업 표시, 확인 시 로그인 페이지(/login)로 이동
 * - 나머지 에러      → 전역 에러 팝업용 atom(errorAtom)에 메시지 설정
 *
 * 상태만 변경하고 다시 throw 하지 않는다.
 * (onError 콜백 안에서 throw 하면 처리되지 않은 예외만 추가로 발생하기 때문)
 */
export function handleApiError(error: unknown) {
    console.error("API Error 상세:", error);

    // axios 에러인 경우에만 response 정보를 안전하게 추출
    const axiosError = isAxiosError<ApiErrorResponse>(error) ? error : undefined;
    const status = axiosError?.response?.status;

    // 1. 401 Unauthorized: 인증 만료 또는 미인증 → 팝업 표시 후 확인 시 로그인 페이지로 이동
    if (status === 401) {
        appStore.set(errorAtom, {
            message: "인증이 만료되었거나 권한이 없습니다.\n다시 로그인해주세요.",
            onConfirm: () => {
                window.location.href = "/login";
            }
        });
        return;
    }

    // 2. 백엔드 에러 메시지 추출
    // response.data.message (표준), response.data.error, 또는 일반 Error 객체의 message 참조
    const responseData = axiosError?.response?.data;
    const message =
        responseData?.message ||
        responseData?.error ||
        (error instanceof Error ? error.message : undefined) ||
        "알 수 없는 서버 오류가 발생했습니다.";
    const errorCode = responseData?.errorCode;
    const errorType = responseData?.errorType;

    // 3. 전역 에러 상태(Atom)에 메시지 설정 → Alert 팝업 표시 유도
    // Provider와 동일한 appStore 를 사용하므로 컴포넌트 외부에서 set 해도 UI에 반영된다.
    appStore.set(errorAtom, { errorCode, errorType, message });
}