import { Link } from "react-router-dom";
import { routes } from "../routes";

export default function Home() {
  return (
    <main>
      <h1>WebGL 연습</h1>
      <p>canvas와 webGL 예제를 공부합니다.</p>
      <p>현재 구현된 예제 목록:</p>
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path}>{route.path}</Link>
            <p>{route.description ?? "설명이 없습니다."}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
