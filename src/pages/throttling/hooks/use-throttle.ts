// src/pages/throttling/hook/use-throttling.ts

import { useRef } from "react";


const useThrottle = (callback: () => void, delay: number) => {
  // 1970년 1월 1일 00시 00분 00초를 기준으로 현재 시간까지의 시간을 밀리초 단위로 Ref에 저장
  const lastRun = useRef<number>(Date.now());
  return () => {
    const elapedTime = Date.now() - lastRun.current;
    // 지정된 시간(delay)이 지나지 않았으면 callback 함수를 호출하지 않음
    if ( elapedTime >= delay ) {
      // callback 함수 실행
      callback();
      // 현재 시간을 마지막으로 callback 함수가 호출된 시간으로 업데이트
      lastRun.current = Date.now();
    }
  };
}

export default useThrottle