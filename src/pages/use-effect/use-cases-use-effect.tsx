import { useEffect, useState } from "react"

const UseCasesUseEffect = () => {
  const [count, setCount] = useState(1)
  const [name, setName] = useState("")

  useEffect(() => {
    console.log('콤포넌트가 Rendering 될때 마다 실행 !!!')
  })

  useEffect(() => {
    console.log('component가 Mount 되었을 때만 실행 !!!')
  }, [])

  useEffect(() => {
    console.log('count 가 변경될때 마다 실행 !!!')
  }, [count])

  useEffect(() => {
    console.log('name 이 변경될때 마다 실행 !!!')
  }, [name])

  return (
    <div>
      <p>카운트 : {count}</p>
      <button onClick={() => setCount(count + 1)}>카운트 증가</button>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> 
      <span>입력한 이름 : {name}</span>
    </div>
  )
}

export default UseCasesUseEffect