// src/pages/use-ref/variable-mng-use-ref.tsx

import { useRef, useState } from "react";


const VariableMngUseRef = () => {
  //
  const [render, setRender] = useState<number>(0);
  const countRef = useRef<number>(0);
  let countVariable = 0;

  console.log(`[render] count : ${render}, countRef : ${countRef.current}`);
  
  const doRendering = () => setRender(render + 1)

  const increaseCountRef = () => {
      countRef.current = countRef.current + 1;
      console.log(`Ref : `, countRef.current);
      
  };

  const increaseCountVariable = () => {
      countVariable = countVariable + 1;
      console.log(`Variable : `, countVariable);
  }

  const printResults = () => {
      console.log(`Ref : ${countRef.current} Variable : ${countVariable}`);
  }

  return (
    <div>
      <p>State: {render}</p>
      <p>Ref: {countRef.current}</p>
      <p>Var: {countVariable}</p>
      <button onClick={doRendering}>랜더(State 올려)!</button>
      <button onClick={increaseCountRef}>Ref 올려</button>
      <button onClick={increaseCountVariable}>Variable 올려</button>
      <button onClick={printResults}>Ref Variable 출력</button>
    </div>
  )
}

export default VariableMngUseRef