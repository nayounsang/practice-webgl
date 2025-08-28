import type { GLSLAttribute,GLSLUniform } from "../generated/types/glsl-attr-types";


export const getSafeAttribLocation = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  attribute: GLSLAttribute
) => {
  const location = gl.getAttribLocation(program, attribute);
  if (location === -1) {
    throw new Error(`Attribute ${attribute} not found in shader program`);
  }
  return location;
};

export const getSafeUniformLocation = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  uniform: GLSLUniform
) => {
  const location = gl.getUniformLocation(program, uniform);
  if (location === null) {
    throw new Error(`Uniform ${uniform} not found in shader program`);
  }
  return location;
};
