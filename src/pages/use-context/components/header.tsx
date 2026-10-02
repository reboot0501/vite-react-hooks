// src/pages/use-context/components/header.tsx

import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';
import { UserContext } from '../context/user-context';

const Header = () => {
  // 부모 콤넌트로 부터 props 로 전달받지 않고 직접 useContext 로 값을 받아온다.
  const { isDark } = useContext(ThemeContext);
  const user = useContext(UserContext);

  return (
    <header
      className="header"
      style={{
        backgroundColor: isDark ? 'black' : 'lightgray',
        color: isDark ? 'white' : 'black',
      }}
    >
      <h1>Welcome!! {user} 님!</h1>
    </header>
  );
};

export default Header;
