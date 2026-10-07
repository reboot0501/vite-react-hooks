import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // 파라미터로 전달된 value 의 값이 변할때 까지 delay 만큼 기다렸다가 
  // 마지막 value 값을 debouncedValue state에 저장
  useEffect(() => {
    // 생성한 delay 초마다 실행되는 timmer id 를 반환
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // 클린업 함수: 값이 변경될 때 다음 의 effect 가 실행되기 전에 이전 effect 에서 생성된 타이머를 취소하여,
    // 즉, 연속 입력 중에는 실행을 막고 마지막 입력 후 delay가 지나야만 업데이트되도록 함
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
