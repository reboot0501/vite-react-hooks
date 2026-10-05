// src/pages/use-reducer/simple-use-reducer

import { useReducer, useState } from "react";

const ACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw"
};
// reducer - state 를 업데이트 하는 역할 (은행)
// action - state 를 업데이트 하기 위한 정보 (고객이 은행에 요청하는 정보)
const reducer = (state: number, action: { type: string; payload: number }) => {
  // reducer 내부 로직은 dispatch(...) 가 직접 호출될 때(예: 입금 버튼 클릭 시)에만 실행됨
  console.log(`reducer 가 일을 합니다.!!!`, state, action);
  switch (action.type) {
    case "deposit":
      return state + action.payload;
    case "withdraw":
      if (state - action.payload < 0) {
        alert("잔고가 부족합니다.");
        return state;
      }
      return state - action.payload;
    default:
      throw new Error("알 수 없는 액션입니다.");
  }
};

const SimpleUseReducer = () => {
  const [number, setNumber] = useState<number>(0);
  // money : state, dispatch(useReducer가 생성한 함수) : action 을 발생시키는 함수
  const [money, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <h4>useReducer 은행에 오신 것을 환영 합니다</h4>
      <p>잔고 : {money} 원</p>
      <input 
        type="number" 
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
        step="1000"
      />
      <button onClick={() => {
        dispatch({ type: ACTION_TYPES.DEPOSIT, payload: number });
        setNumber(0);
      }}>입금</button>
      <button onClick={() => {
        dispatch({ type: ACTION_TYPES.WITHDRAW, payload: number });
        setNumber(0);
      }}>출금</button>
    </div>
  )
}

export default SimpleUseReducer