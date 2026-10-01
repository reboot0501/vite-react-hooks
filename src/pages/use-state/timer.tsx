// src/pages/use-state/timer.tsx
import { useState } from "react";


const Timer = () => {
  const [time, setTime] = useState(1);

  const handleUpdate = () => {
    let newTime;
    if (time >= 12) {
      newTime = 1;
    } else {
      newTime = time + 1;
    }
    setTime(newTime);
  }

  return (
    <div>
      <span>현재 시각: {time} 시</span>
      <button onClick={handleUpdate}> Update 시각 </button>
    </div>
  )
}

export default Timer
