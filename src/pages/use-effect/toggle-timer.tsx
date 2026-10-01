import { useState } from "react"
import Timer from "./component/Timer"

const ToggleTimer = () => {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div>
      { showTimer ? <Timer /> : <span>타이머가 보이지 않습니다.</span> }      
      <button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</button>
    </div>
  )
}

export default ToggleTimer
