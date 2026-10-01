// src/shared/api/auth-interceptor.ts
import type { AxiosInstance } from "axios";
/**
 * [수정 이유] 순환 참조(Circular Dependency) 문제 해결
 *
 * 기존 방식의 문제:
 *   - 이 파일에서 `import { axiosInstance } from "./axios-instance"` 를 직접 참조하고,
 *   - axios-instance.ts 에서 `import "./auth-interceptor"` (side-effect import) 를 통해 이 파일을 로드했음.
 *   - 결과적으로 두 파일이 서로를 참조하는 순환 구조가 발생:
 *       axios-instance.ts → auth-interceptor.ts → axios-instance.ts (미완성 상태)
 *
 * 실행 시 오류:
 *   - Vite(ES Module) 번들러는 순환 참조가 있을 때 한쪽 모듈을 먼저 평가함.
 *   - axios-instance.ts 가 로드되는 도중 auth-interceptor.ts 가 실행되면,
 *     axiosInstance 변수가 아직 초기화되지 않은 상태(TDZ: Temporal Dead Zone)이므로
 *     "Cannot access 'axiosInstance' before initialization" ReferenceError 발생.
 *
 * 해결 방법:
 *   - 이 파일에서 axiosInstance 를 직접 import 하지 않고,
 *   - 외부에서 인스턴스를 인자로 받는 함수(setupAuthInterceptor)로 변경.
 *   - axios-instance.ts 에서 인스턴스 생성 완료 후 이 함수를 호출하여
 *     초기화 순서를 명확하게 보장함.
 */
export function setupAuthInterceptor(instance: AxiosInstance): void {
	// 요청 인터셉터 설정
  instance.interceptors.request.use((config) => {
	  // 로컬 스토리지에서 accessToken을 가져와서 요청 헤더에 추가
    const token = localStorage.getItem("accessToken");
		// 
    if (token) { // accessToken이 있으면 요청 헤더에 Authorization 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
		// 요청 설정 반환
    return config;
  });
}