import Init from "./pages/init/init.tsx";
import { TwoDem } from "./pages/two-dem/two-dem.tsx";

export const routes:{path: string, element: React.ReactNode,description?: string}[] = [
  {
    path: "/init",
    element: <Init />,
    description:"webGL과 canvas를 초기화한다."
  },
  {
    path: "/two-dem",
    element: <TwoDem />,
    description: "쉐이더, 객체 그리고 장면을 초기해 사각형이 있는 2D 그래픽을 그린다.",
  },
];
