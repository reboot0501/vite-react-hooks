// src/pages/use-memo/object-type-use-memo.tsx

import { useEffect, useMemo, useState } from "react";


const ObjectTypeUseMemo = () => {
  
  const [number, setNumber] = useState<number>(0);
  const [isKorea, setIsKorea] = useState<boolean>(true);
  
  // memoization 하지 않은 경우: 매번 컴포넌트가 랜더링 될때 마다 
  // 메모리번지를 비교함로 다르다고 인시하기 때문에 useEffect의 작업이 실행됨
  // const location = {number: number, country: isKorea ? "한국" : "미국"};
  
  // 객체를 useMemo 로 memoization 을 해야하는 경우: 
  // isKorea 의 값이 변경되었을때만 useMemo가 실행되어 메모리번지가 변경됨으로 useEffect의 작업이 실행됨
  const location = useMemo(() => {
      return {country: isKorea ? "한국" : "미국"};
  }, [isKorea]);

  useEffect(() => {
    console.log(`😒 location is chaged`);
  }, [location]);

  return (
    <div>
      <h2>하루에 몇끼 먹어요?</h2>
      <input type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} />
      <hr />
      <h2>어느 나라에 있어요?</h2>
      <p>location: {location.country}</p>
      <button onClick={() => setIsKorea(!isKorea)}>비행기 타자</button>
    </div>
  )
}

export default ObjectTypeUseMemo