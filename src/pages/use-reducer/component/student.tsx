// src/pages/use-reducer/component/student.tsx
import type { ACTION_TYPES } from "../complex-use-reducer";

interface StudentProps {
  name: string;
  dispatch: React.Dispatch<any>;
  id: number;
  isHere: boolean;
  actionTypes: typeof ACTION_TYPES;
};

const Student = ({ name, dispatch, id, isHere, actionTypes }: StudentProps) => {
  return (
    <div>
      <span 
        style={{
          textDecoration: isHere ? 'line-through' : 'none',
          color: isHere ? 'gray' : 'black',
          }}
        onClick={() => dispatch({ type: actionTypes.MARK_STUDENT, payload: { id } })}
      >
        {name}
      </span>
      <button onClick={() => dispatch({ type: actionTypes.DELETE_STUDENT, payload: { id } })}>
        삭제
      </button>
    </div>
  );
};

export default Student;