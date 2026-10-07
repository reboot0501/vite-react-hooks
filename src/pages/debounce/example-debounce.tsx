// src/pages/debounce/example-debounce.tsx

import { useEffect, useState } from "react"
import "./example-debounce.css"
import useDebounce from "./hooks/use-debounce";

interface User {
  name: string;
  age: string;
}

const fetchDataFromServe = (value: string): User[] => {
  //
  if(!value) return [];
  console.log("서버로 부터 데이터를 가져온느 중......🛺🚗🚓");
  
  const users: User[] = [
    {name: "김철수", age: "16"},
    {name: "이영희", age: "26"},
    {name: "김민수", age: "15"},
    {name: "홍길동", age: "20"},
    {name: "홍민영", age: "45"},
    {name: "김민영", age: "32"},
  ];
  return users.filter((user) => user.name.startsWith(value));
}

const ExampleDebounce = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<User[]>([]);
  // 1초 동안 입력이 없으면 debouncedInput에 값을 저장
  const debouncedInput = useDebounce(input, 1000);

  // debouncedInput 값이 변경될 때 마다 실행
  useEffect(() => {
    const users = fetchDataFromServe(debouncedInput);
    setResult(users);
  }, [debouncedInput])

  return (
    <div className="container">
      <div className="search-container">
        <input placeholder="여기 다 입력 하세요" value={input} onChange={(e) => setInput(e.target.value)} />
        <ul>
          {result.map((user: User, idx: number) => (
            <li key={idx}>
              <span>{user.name}</span>
              <span>{user.age}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ExampleDebounce