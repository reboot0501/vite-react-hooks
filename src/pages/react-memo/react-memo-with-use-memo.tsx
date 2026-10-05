// src/pages/react-memo/simple-react-memo

import { useMemo, useState } from "react";
import ChildName from "./component/child-name";

const ReactMemoWithUseMemo = () => {
  const [parentAge, setParentAge] = useState<number>(0);

  
  const handleParentAgeIncrease = () => {
    setParentAge((prevAge) => prevAge + 1);
  }
  
  console.log(`👪 부모 콤포넌트가 랜더링 되었습니다.!!!`);
  
  // const name = { firstName: "홍", lastName: "길동" };
  // useMemo 를 사용하여 name 객체를 메모이제이션하여 자식 컴포넌트에 전달하면
  // 자식 컴포넌트는 부모 컴포넌트가 랜더링 되어도 재랜더링 되지 않는다.
  const name = useMemo(() => {
    return { firstName: "홍", lastName: "길동" };
  }, []);

  return (
    <div style={{ border: "1px solid red", padding: "10px" }}>
      <h3>👪 부모 </h3>
      <br />
      <p>age: {parentAge}</p>
      <br />
      <button onClick={handleParentAgeIncrease}>부모 나이 증가</button>
      <ChildName name={name} />
    </div>
  )
}

export default ReactMemoWithUseMemo