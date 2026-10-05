// src/pages/react-memo/react-memo-with-use-callback.tsx
import { useCallback, useState } from "react";
import ChildTellMe from "./component/child-tell-me";

const ReactMemoWithUseMemo = () => {
  const [parentAge, setParentAge] = useState<number>(0);

  const handleParentAgeIncrease = () => {
    setParentAge((prevAge) => prevAge + 1);
  }

  console.log(`👪 부모 콤포넌트가 랜더링 되었습니다.!!!`);
  
  const tellMe = useCallback(  () => {
    console.log(`길동아 사랑해~~~`);
  }, []);
  
  return (
    <div style={{ border: "1px solid red", padding: "10px" }}>
      <h3>👪 부모 </h3>
      <br />
      <p>age: {parentAge}</p>
      <br />
      <button onClick={handleParentAgeIncrease}>부모 나이 증가</button>
      <ChildTellMe name="홍길동" tellMe={tellMe} />
    </div>
  )
}

export default ReactMemoWithUseMemo