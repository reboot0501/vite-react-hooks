// src/pages/throttling/none-throttling.tsx

import { useState } from "react"
import "./throttling.css"

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

const NoneThrottling = () => {
  const [lottoNumbers, setLottoNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0])

  const handleClick = () => {
    // 로또 번호를 생성하는 함수 호출
    const results = hackLottoNumbers();
    // 로또 번호 상태 업데이트
    setLottoNumbers(results)
  }

  return (
    <div className="container">
      <h1 className="title">로또 번호 맞춰줄게 🤨</h1>
      <button className="lotto-button" onClick={handleClick}>
        번호 맞추기
      </button>
      <div className="lotto-numbers">
        {lottoNumbers.map((number, index) => (
          <span key={index} className="lotto-number">
            {number}
          </span>
        ))}
      </div>
    </div>
  )
}

export default NoneThrottling