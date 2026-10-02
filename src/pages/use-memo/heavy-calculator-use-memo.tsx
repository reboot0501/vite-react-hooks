// src/pages/use-memo/heavy-calculator-use-memo.tsx

import { useMemo, useState } from "react";

const hardCalculate = (number: number): number => {
  console.log(`😒 어려운 계산중...`);
  for (let i = 0; i < 999999999; i++) {} // 생각하는 시간
  return number + 10000;
}

const easyCalculate = (number: number): number => {
  console.log(`😊 쉬운 계산중...`);
  return number + 1;
}

const HeavyCalculatorUseMemo = () => {
  const [hardNumber, setHardNumber] = useState<number>(1);
  const [easyNumber, setEasyNumber] = useState<number>(0);  

  const hardSum = useMemo(() => hardCalculate(hardNumber), [hardNumber]);
  const easySum = useMemo(() => easyCalculate(easyNumber), [easyNumber]);

  return (
    <div>
      <h3>무거운 계산작업</h3>
      <input 
        type="number" 
        value={hardNumber} 
        onChange={(e) => setHardNumber(parseInt(e.target.value))} />
      <span> + 10000 = {hardSum}</span>
      <hr />
      <h3>가벼운 계산작업</h3>
      <input 
        type="number" 
        value={easyNumber} 
        onChange={(e) => setEasyNumber(parseInt(e.target.value))} />
      <span> + 1 = {easySum}</span>
    </div>
  )
}

export default HeavyCalculatorUseMemo