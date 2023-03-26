/**
 * Test project for debugging canvas-gl. We rempa the canvas-gl import to use src/ instead of dist/ for live reloads without
 * doing a build everytime - just relying on Vite's ability to load TS.
 */

import { CanvasGL } from "canvas-gl";

const gl = new CanvasGL("#canvas");
gl.onFrame(() => {
  gl.canvas.width = gl.canvas.parentElement!.offsetWidth * devicePixelRatio;
  gl.canvas.height = gl.canvas.parentElement!.offsetHeight * devicePixelRatio;

  gl.clear("white");
  /*   gl.primitives.circle({
    color: "red",
    radius: 100,
    position: [100, 100],
  }); */
  gl.primitives.line({
    p1: [10, 10],
    p2: [100, 100],
    color: "red",
    width: 4,
  });
});
