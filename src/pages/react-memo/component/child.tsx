// src/pages/react-memo/component/child.tsx

import { memo } from 'react';

// props 타입 인라인으로 선언
const Child = ({ name, age }: { name: string; age: number }) => {
  console.log(`👶 자녀 콤포넌트가 랜더링 되었습니다.!!!`);

  return (
    <div style={{ border: '1px solid blue', padding: '10px' }}>
      <h4>👶 자녀 </h4>
      <p>name: {name}</p>
      <p>age: {age}</p>
    </div>
  );
};
// React.memo 를 사용하여 Child 컴포넌트를 메모이제이션
export default memo(Child);
