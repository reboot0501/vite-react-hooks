// src/pages/use-callback/basic-examole-use-callback.tsx

import { useCallback, useEffect, useState } from "react";


const BasicExampleUseCallback = () => {
  //
  const [number, setNumber] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(true);

  const someFunction = useCallback(() => {
    console.log(`someFunction is called : number - ${number}`);
  }, [number]);

  useEffect(() => {
    console.log('someFunction 이 변경 되었습니다.');
  }, [someFunction]);
  
  return (
    <div>
      <input 
        type="number" 
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      {/* toggle state 를 변경시켜서 콤포넌트가 재 랜더링 되더라도 
          number 가 변경되지 않았기 때문에 memoized된 someFunction 이 재 실행 되지 않는다.!!! */}
      <button onClick={() => setToggle(!toggle)}>{toggle.toString()}</button>
      <br/>
      <button onClick={someFunction}>someFunction 호출</button>
    </div>
  )
}

export default BasicExampleUseCallback