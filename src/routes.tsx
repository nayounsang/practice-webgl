import Init from "./pages/init/init.tsx";

export const routes:{path: string, element: React.ReactNode,description?: string}[] = [
  {
    path: "/init",
    element: <Init />,
    description:"webGL과 canvas를 초기화한다."
  },
];
