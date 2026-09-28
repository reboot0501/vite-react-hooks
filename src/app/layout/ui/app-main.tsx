import type { CSSProperties, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import "./app-main.css";

interface MainProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const Main = ({ children, className, style, title = "메인 콘텐츠" }: MainProps) => {
  return (
    <main className={`main ${className ?? ""}`.trim()} style={style}>
      <section className="main-header">
        <h3>{title}</h3>
      </section>
      <section className="main-content">
        {children ?? <Outlet />}
      </section>
    </main>
  );
};

export default Main;
