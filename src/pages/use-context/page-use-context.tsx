// src/pages/use-context/page-use-context.tsx
import { useState } from 'react';
import './css/index.css';
import Page from './components/page';
import { ThemeContext } from './context/theme-context';
import { UserContext } from './context/user-context';

const PageUseContext = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  return (
    <UserContext.Provider value={"로그인사용자"}>
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        <Page />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default PageUseContext;
