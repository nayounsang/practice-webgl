import { useMarkdown } from "../../hooks/useMarkdown";
import ReactMarkdown from "react-markdown";

function Init() {
  const { markdown, loading } = useMarkdown(async () => {
    const mod = await import("./init.md");
    return mod.default;
  });

  const initWebGL = (canvas: HTMLCanvasElement) => {

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    gl.clearColor(0.5, 0.5, 0.5, 1); // Set clear color to gray, fully opaque
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LESS); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  return (
    <article>
      {loading ? <p>Loading...</p> : <ReactMarkdown>{markdown}</ReactMarkdown>}
      <canvas
        width={900}
        height={600}
        ref={(canvas) => {
          if (!canvas) return;
          initWebGL(canvas);
        }}
        style={{ border: "1px solid black" }}
      />

    </article>
  );
}

export default Init;
