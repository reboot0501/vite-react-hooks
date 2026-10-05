// src/pages/use-reducer/complex-use-reducer

import { useReducer, useState } from "react";
import StudentItem from "./component/student";

export const ACTION_TYPES = {
  ADD_STUDENT: "add-student",
  DELETE_STUDENT: "delete-student",
  MARK_STUDENT: "mark-student",
}

interface StudentItem {
  id: number;
  name: string;
  isHere: boolean;
}

interface State {
  count: number;
  // id를 key로 사용하는 맵 구조
  students: Record<number, StudentItem>; 
}

const reducer = (state: State, action: { type: string; payload: any }): State => {
  switch(action.type) {
    case ACTION_TYPES.ADD_STUDENT: {
      const newStudent: StudentItem = {
        id: Date.now(),
        name: action.payload.name,
        isHere: false,
      };
      return {
        count: state.count + 1,
        students: {
          // state 의 전체 students 배열을 그대로 가져오는 spread  연산자
          ...state.students,
          // 변수나 표현식을 넣어 키(key) 이름에 동적으로 할당하여 value 에 객체 Set
          [newStudent.id]: newStudent,
        },
      };
    }
    case ACTION_TYPES.DELETE_STUDENT: {
      // 객체에서 [action.payload.id]에 해당하는 값은 _ 에 담고
      // 나머지 값들은 remainingStudents 에 담는다.
      const { [action.payload.id]: _, ...remainingStudents } = state.students;
      return {
        count: state.count - 1,
        students: remainingStudents,
      };
    }
    case ACTION_TYPES.MARK_STUDENT: {
      // action.payload.id 와 일치하는 키를 가진 객체를 target 변수에 할당.
      const target = state.students[action.payload.id];
      // target 객체가 존재하지 않으면 state 반환
      if (!target) return state;
      // target 객체가 존재하면 state 를 spread 한 후
      return {
        ...state,
        students: {
          ...state.students,
          [action.payload.id]: {
            // 추출한 target 객체를 spread 한 후 isHere 값을 반전
            ...target,
            isHere: !target.isHere,
          },
        },
      };
    }
    default:
      return state;
  }
}

const initialState: State = {
  count: 0,
  students: {},
}

const ComplexUseReducer = () => {
  //
  const [name, setName] = useState("");
  const [studentsInfo, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h3>출석부</h3>
      <p>총 학생수 : {studentsInfo.count}</p>
      <input 
        type="text" 
        placeholder="학생 이름"
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={() => {
        if(!name) return;
        dispatch({ type: ACTION_TYPES.ADD_STUDENT, payload: {name} });
        setName("");
      }}>학생 추가</button>
      {Object.values(studentsInfo.students).map((student: StudentItem) => {
        return (
          <StudentItem 
            key={student.id} 
            name={student.name}
            dispatch={dispatch} 
            id={student.id}
            isHere={student.isHere}
            actionTypes={ACTION_TYPES}
          />
        )
      })}
      </div>
  )
}

export default ComplexUseReducer