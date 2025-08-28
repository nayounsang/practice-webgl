import vertexShaderCode from "./vertex-shader.glsl";
import fragmentShaderCode from "./fragment-shader.glsl";
import {
  getSafeAttribLocation,
  getSafeUniformLocation,
} from "../../utils/get-glsl-var";
import { mat4 } from "gl-matrix";

const mvMatrix = mat4.create();
const pMatrix = mat4.create();

const initWebGLShader = (
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Unable to create shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
  }
  return shader;
};

export const initShaderProgram = (gl: WebGLRenderingContext) => {
  // Create the shader program
  const shaderProgram = gl.createProgram();
  const vertexShader = initWebGLShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
  const fragmentShader = initWebGLShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderCode
  );
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  gl.useProgram(shaderProgram);
  return shaderProgram;
};
export const initShaders = (
  gl: WebGLRenderingContext,
  shaderProgram: WebGLProgram
) => {
  const vertexPositionAttribute = getSafeAttribLocation(
    gl,
    shaderProgram,
    "aVertexPosition"
  );
  const vertexColorAttribute = getSafeAttribLocation(
    gl,
    shaderProgram,
    "aVertexColor"
  );
  gl.enableVertexAttribArray(vertexPositionAttribute);
  gl.enableVertexAttribArray(vertexColorAttribute);
};

export const initBuffers = (gl: WebGLRenderingContext) => {
  const vertices = [
    1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0,
  ];
  // prettier-ignore
  const colors = [
    1.0, 1.0, 1.0, 1.0, // W
    1.0, 0.0, 0.0, 1.0, // R
    0.0, 1.0, 0.0, 1.0, // G
    0.0, 0.0, 1.0, 1.0, // B
  ];

  const squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const squareVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    squareVerticesColorBuffer,
    squareVerticesBuffer,
  };
};

export const loadIdentity = () => {
  mat4.identity(mvMatrix);
};

export const mvTranslate = (translation: number[]) => {
  const translationMatrix = mat4.create();
  mat4.translate(translationMatrix, translationMatrix, translation);
  mat4.multiply(mvMatrix, mvMatrix, translationMatrix);
};

export const setMatrixUniforms = (
  gl: WebGLRenderingContext,
  shaderProgram: WebGLProgram
) => {
  const pUniform = getSafeUniformLocation(gl, shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, pMatrix);

  const mvUniform = getSafeUniformLocation(gl, shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, mvMatrix);
};
export const drawScene = (
  gl: WebGLRenderingContext,
  shaderProgram: WebGLProgram,
  buffers: {
    squareVerticesBuffer: WebGLBuffer;
    squareVerticesColorBuffer: WebGLBuffer;
  }
) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspectRatio = 640.0 / 480.0;
  mat4.perspective(pMatrix, (45 * Math.PI) / 180, aspectRatio, 0.1, 100.0);

  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squareVerticesBuffer);
  const vertexPositionAttribute = getSafeAttribLocation(
    gl,
    shaderProgram,
    "aVertexPosition"
  );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.squareVerticesColorBuffer);
  const vertexColorAttribute = getSafeAttribLocation(
    gl,
    shaderProgram,
    "aVertexColor"
  );
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  setMatrixUniforms(gl, shaderProgram);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
