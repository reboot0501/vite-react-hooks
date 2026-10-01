// src/pages/use-state/set-state-callback.tsx

import { useState } from 'react';

const SetStateCallback = () => {
  const [names, setNames] = useState<string[]>(['홍길동', '이몽룡', '성춘향']);
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

export default SetStateCallback;
