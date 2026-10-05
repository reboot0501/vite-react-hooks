// src/pages/use-id/example-use-id.tsx

import { useId } from "react"
import MyInput from "./component/my-input";


const ExampleUseId = () => {
  const id = useId();


  return (
    <div>
      <MyInput id={`${id}-name`} label={"이름"} />
      <MyInput id={`${id}-email`} label={"이메일"} />
    </div>
  )
}

export default ExampleUseId