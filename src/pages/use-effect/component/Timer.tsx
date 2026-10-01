// src/pages/use-effect/component/Timer.tsx
// ToggleTimer 컴포넌트에서 사용할 타이머 컴포넌트

import { useEffect } from "react";

const Timer = () => {
  // 콤포넌트 가 Rendering 될때 한번만 실행 
  useEffect( () => {
    // 1초 마다 콘솔로그 출력
    const timer = setInterval( () => {
      console.log('타이머가 실행 중...');
    }, 1000);

    // 콤포넌트가 소멸될때 실행 ( Cleanup )
    return () => {
      console.log('타이머를 중지 합니다.');
      clearInterval(timer);
    }
  }, []); 

  return (
    <div>
      <span>
        타이머를 시작 합니다. 콘솔을 보세요 !!!
      </span>
    </div>
  );
};

export default Timer;