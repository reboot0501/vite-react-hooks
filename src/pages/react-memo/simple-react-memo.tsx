// src/pages/react-memo/simple-react-memo

import { useState } from "react";
import Child from "./component/child";


const SimpleReactMemo = () => {
  const [parentAge, setParentAge] = useState<number>(0);
  const [childAge, setChildAge] = useState<number>(0);

  const handleParentAgeIncrease = () => {
    setParentAge((prevAge) => prevAge + 1);
  }

  const handleChildAgeIncrease = () => {
    setChildAge((prevAge) => prevAge + 1);
  }

  console.log(`👪 부모 콤포넌트가 랜더링 되었습니다.!!!`);
  

  return (
    <div style={{ border: "1px solid red", padding: "10px" }}>
      <h3>👪 부모 </h3>
      <br />
      <p>age: {parentAge}</p>
      <br />
      <button onClick={handleParentAgeIncrease}>부모 나이 증가</button>
      <button onClick={handleChildAgeIncrease}>자녀 나이 증가</button>
      <Child name="홍길동" age={childAge} />
    </div>
  )
}

export default SimpleReactMemo