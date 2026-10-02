// src/pages/use-ref/render-count-use-ref.tsx

import { useEffect, useRef, useState } from "react";

const RenderCountUseRef = () => {
  //
  const [count, setCount] = useState<number>(0);
  const renderCount = useRef<number>(0);
  useEffect(() => {
    // 👌 useState 의 setState 를 호출하면 무한루프가 발생한다.
    renderCount.current = renderCount.current + 1;
    console.log(`😒렌더링 카운트 : ${renderCount.current} `);
  });
  return (
    <div>
      <p>렌더링 카운트(useRef) : {renderCount.current}</p>
      <p>count(useState): {count}</p>
      <button onClick={() => setCount(count + 1)}>count 올려!</button>
    </div>
  )
}

export default RenderCountUseRef