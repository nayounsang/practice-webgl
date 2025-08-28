import ReactMarkdown from "react-markdown";
import { useMarkdown } from "../../hooks/useMarkdown";
import {
  drawScene,
  initBuffers,
  initShaderProgram,
  initShaders,
} from "./utils";

export const TwoDem = () => {
  const { markdown, loading } = useMarkdown(async () => {
    const response = await import("./two-dem.md");
    return response.default;
  });

  return (
    <article>
      {loading ? <p>Loading...</p> : <ReactMarkdown>{markdown}</ReactMarkdown>}
      <canvas
        width={900}
        height={600}
        ref={(canvas) => {
          if (!canvas) return;
          const gl = canvas.getContext("webgl");
          if (!gl) return;
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);
          gl.viewport(0, 0, 900, 600);
          const shaderProgram = initShaderProgram(gl);
          const buffers = initBuffers(gl);
          initShaders(gl, shaderProgram);
          drawScene(gl, shaderProgram, buffers);
        }}
        style={{ border: "1px solid black" }}
      />
    </article>
  );
};
