// src/pages/use-state/initial-value-callback.tsx

import { useState } from 'react';

const heavyWork = () => {
  console.log('엄청엄청 무거운 작업 실행!!!!');
  return ['홍길동', '김민수', '이영희', '김 철수'];
};

const InitialValueCallback = () => {
  // useState 초기값으로 무거운 작업을 하는 함수를 그대로 호출하면 핸더링때마다 그 무거운 작업 호출
  // const [names, setNames] = useState<string[]>(heavyWork());

  // lazy init: 초기값 계산이 복잡할 때, 함수명을 인자로 전달하면 딱 첫 렌더링 때만 실행
  // const [names, setNames] = useState<string[]>(() => heavyWork());
  // lazy init: 초기값 계산이 복잡할 때, callback 함수로 무거운 작업 함수를 전달하면 딱 첫 렌더링 때만 실행
  const [names, setNames] = useState<string[]>(heavyWork);

  const [name, setName] = useState<string>('');

  const handleAddName = () => {
    if (name.trim() !== '') {
      // 현재 값을 업데이하는 것은 이전 State 와 밀접한 관계가 있다면
      // 이전 값을 매개변수로 받아서 처리하는 Callback을 전달
      setNames((prevState: string[]) => {
        console.log('이전 State : ', prevState);
        return [...prevState, name];
      });
      setName('');
    } else {
      alert('이름을 입력해주세요');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddName}>ADD</button>
      {names.map((name, index) => {
        return <p key={index}>{name}</p>;
      })}
    </div>
  );
};

export default InitialValueCallback;
