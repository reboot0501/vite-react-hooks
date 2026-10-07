// src/pages/throttling/example-use-throttling.tsx
import { useRef, useState } from "react"
import useThrottle from "./hooks/use-throttle";

/** throttling 적용
 * 사용자가 `로또 번호 받기` 버튼을 클릭 할때 
 * hackLottoNumbers 함수가 호출되는 시간을 기록하고
 * 사용자가 다시 `로또 번호 받기` 버튼을 클릭하는 시간과 이전 시간의 차이를 계산하여
 * 1초 시간이 지나지 않았으면 hackLottoNumbers 함수가 다시 호출되는것을 방지한다.
 */
// 함수 외부로 hackLottoNumbers() 배치함으로서 전체가 다시 렌더링되면서 
// 무거운 작업의 함수가 다시 실행되는것을 방지함
const hackLottoNumbers = () => {
  console.log("로또 번호를 생성 하는 중(무거운 작업)...🛺🚊🚗");
  const numbers: number[] = [];
  for (let i = 0; i < 6; i++) {
    const number = Math.floor(Math.random() * 45) + 1;
    if (numbers.includes(number)) {
      i--;
    } else {
      numbers.push(number);
    }
  }
  numbers.sort((a, b) => a - b);
  return numbers;
}

const ExampleUseThrottling = () => {
  const [lottoNumbers, setLottoNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0])
  
  // useThrottle custom hook 사용
  // delay 를 1000로 설정하면 
  // 1초 동안 버튼을 여러번 클릭 해도 
  // hackLottoNumbers 함수는 1초에 한 번만 호출됨
  const handleClick = useThrottle(() => {
    const result = hackLottoNumbers();
    setLottoNumbers(result);
  }, 1000)

  return (
    <div className="container">
      <h1 className="title">로또 번호 맞춰줄게 🤨</h1>
      <button className="lotto-button" onClick={handleClick}>로또 번호 받기</button>
      <div className="lotto-numbers">
        {lottoNumbers.map((number, index) => {
          return (
            <span className="lotto-number" key={index}>
              {number}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default ExampleUseThrottling