/// <reference types="vite/client" />
declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.glsl" {
  const glsl: string;
  export default glsl;
}