// src/shared/api/axios-instance.ts
import axios from "axios";
import { setupAuthInterceptor } from "./auth-interceptor";

export const axiosInstance = axios.create({
  // API 요청 기본 URL pnpm run dev )  
  // >pnpm run local -> package.json scripts `"local: "vite --mode localhost"`이면 
  //                    env.localhost 의 VITE_API_URL 설정을 가져옴
  // >pnpm run dev -> package.json scripts `"dev: "vite`이면 
  //                  default .env.development 의 VITE_API_URL 설정을 가져옴
  baseURL: import.meta.env.VITE_API_URL,
  // 요청 타임아웃 설정
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * [수정 이유] 순환 참조(Circular Dependency) 문제 해결
 *
 * 기존 방식의 문제:
 *   - `import "./auth-interceptor"` (side-effect import) 를 파일 최상단에 배치했음.
 *   - ES Module 은 import 구문을 파일 실행보다 먼저 처리하므로,
 *     `axiosInstance` 변수가 선언(const axiosInstance = axios.create(...))되기 전에
 *     auth-interceptor.ts 가 실행되어 axiosInstance 를 참조하려 했음.
 *   - 결과: "Cannot access 'axiosInstance' before initialization" ReferenceError 발생.
 *
 * 해결 방법:
 *   - side-effect import 방식을 제거하고,
 *   - axiosInstance 가 완전히 초기화된 이후에 setupAuthInterceptor(axiosInstance) 를 호출.
 *   - 이렇게 하면 인터셉터 등록 시점에 axiosInstance 가 반드시 존재함이 보장됨.
 *   - 초기화 순서: 
 *     axiosInstance 생성 → setupAuthInterceptor 호출 → 인터셉터 등록 완료
 */
setupAuthInterceptor(axiosInstance);