// src/pages/use-layout-effect/use-layout-effect-vs-use-effect.tsx

import { useEffect, useLayoutEffect, useState } from "react"


const CompareUseEffect = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`useEffect 실행 : ${count}`);
  }, )

  useLayoutEffect(() => {
    console.log(`useLayoutEffect 실행: ${count}`);
  },)

  const handleCountUpdate = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <h2>콘솔을 보세요</h2>
      <br />
      <p>Count : {count}</p>
      <button onClick={handleCountUpdate}>Update</button>
    </div>
  )
}

export default CompareUseEffect