import { Link } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header style={{ display: "flex", borderBottom: "1px solid black", gap: "2rem", padding: "10px", alignItems: "center" }}>
        <Link to="/">홈으로</Link>
        <p>현재 페이지: {location.pathname}</p>
      </header>
      {children}
    </div>
  );
};
