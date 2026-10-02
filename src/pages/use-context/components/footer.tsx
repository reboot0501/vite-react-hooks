// src/pages/use-context/components/footer.tsx

import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';

const Footer = () => {
  // 부모 콤넌트로 부터 props 로 전달받지 않고 직접 useContext 로 값을 받아온다.
  const { isDark, setIsDark } = useContext(ThemeContext);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: isDark ? 'black' : 'lightgray',
      }}
    >
      <button className="button" onClick={toggleTheme}>
        다크모드 전환
      </button>
    </footer>
  );
};

export default Footer;
