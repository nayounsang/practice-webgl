import { Link } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header style={{ display: "flex", borderBottom: "1px solid black", gap: "2rem", padding: "10px" }}>
        <Link to="/">홈으로</Link>
        WebGL 연습
      </header>
      {children}
    </div>
  );
};
