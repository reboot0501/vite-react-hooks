// src/pages/custom-hooks/hooks/use-input.tsx
import { useState } from "react";

const useInput = (initialValue: string, submitAction: (value: string) => void) => {

  const [inputValue, setInputValue] = useState<string>(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const handleResetInputValue = () => {
    setInputValue("");
    submitAction(inputValue);
  }

  /** typescript custom hook 에서 배열 리턴
   * 현상 : [string, function, function] 형태의 배열을 반환하는 경우 오류 발생
   * 원인 : (string | ((e: ChangeEvent<HTMLInputElement>) => void) | (() => void))[] 로 추론
   * 해결 : 배열에 as const 를 추가하여 `읽기전용 튜플`로 고정하여 오류 해결
   * 튜플 : 배열의 길이가 고정되고, 각 자리(인덱스)마다 들어올 타입이 엄격히 정해진 형태
   *    - [string, function, function] : string 타입과 function 타입, function 타입이 고정된 튜플
   */
  return [inputValue, handleInputChange, handleResetInputValue ] as const;
}

export default useInput