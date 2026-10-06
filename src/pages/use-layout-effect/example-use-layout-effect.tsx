// src/pages/use-layout-effect/example-use-layout-effect

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const getNumbers = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
};

const ExampleUseLayoutEffect = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nums: number[] = getNumbers();
    setNumbers(nums);
  }, []);
  // 화면이 그려지고 난 후 스크롤이 내려감
  // useEffect(() => {
  //   if (numbers.length === 0) return;
  //   for (let i = 0; i < 3000000000; i++) {}
  //   ref.current.scrollTop = ref.current.scrollHeight
  // });
  // 화면이 그려지기 전에 스크롤을 내림 ( effect 오직이 실해 되는 동안 화면 그려지는 것을 블록킹하고 있음)
  useLayoutEffect(() => {
    if (numbers.length === 0) return;
    for (let i = 0; i < 3000000000; i++) {}
    ref.current.scrollTop = ref.current.scrollHeight
  })

  const handleRet = () => {
    setNumbers([]);
  };
  return (
    <>
      <button onClick={handleRet}>Reset</button>
      <div
        ref={ref}
        style={{
          height: '300px',
          border: '1px solid blue',
          overflowX: 'hidden', // 가로 스크롤 없음
          overflowY: 'scroll', // 세로 스크롤
        }}
      >
        {numbers &&
          numbers.map((num: number, idx: number) => {
            return <p key={idx}>{num}</p>;
          })}
      </div>
    </>
  );
};

export default ExampleUseLayoutEffect;
