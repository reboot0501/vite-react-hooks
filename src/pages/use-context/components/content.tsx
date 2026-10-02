// src/pages/use-context/components/content.tsx

import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';
import { UserContext } from '../context/user-context';

const Content = () => {
  // 부모 콤넌트로 부터 props 로 전달받지 않고 직접 useContext 로 값을 받아온다.
  const { isDark } = useContext(ThemeContext);
  const user = useContext(UserContext);
  return (
    <main
      className="content"
      style={{
        backgroundColor: isDark ? 'black' : 'white',
        color: isDark ? 'white' : 'black',
      }}
    >
      <h2>{user}님, 좋은 하루 되세요</h2>
    </main>
  );
};

export default Content;
