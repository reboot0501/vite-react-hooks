// src/pages/custom-hooks/simple-custom-hook.tsx

import useInput from "./hooks/use-input";


function displayMessage(value: string) {
  alert(`제출된 값: ${value}`);
}

const SimpleCustomHook = () => {
  // custom hook 반복 사용
  // useInput("", displayMessage); 와 같이 displayMessage 함수를 인자로 전달하는 경우, 
  // 자바스크립트/타입스크립트에서는 함수도 값(1급 객체)으로 취급되므로, 함수를 실행하지 않고 
  // **함수 자체(참조)**를 인자로 전달
  const [inputValue, handleInputChange, handleResetInputValue] = useInput("", displayMessage);
  const [inputValue2, handleInputChange2, handleResetInputValue2] = useInput("", displayMessage);
  const [inputValue3, handleInputChange3, handleResetInputValue3] = useInput("", displayMessage);

  return (
    <div>
      <h2>useInput</h2>
      <input value={inputValue} onChange={handleInputChange} />
      <button onClick={handleResetInputValue}>초기화</button>
      <br />
      <input value={inputValue2} onChange={handleInputChange2} />
      <button onClick={handleResetInputValue2}>초기화</button>
      <br />
      <input value={inputValue3} onChange={handleInputChange3} />
      <button onClick={handleResetInputValue3}>초기화</button>
    </div>
  )
}

export default SimpleCustomHook
