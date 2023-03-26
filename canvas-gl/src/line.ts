import type REGL from "regl";
import type { CanvasGL } from ".";

export interface RawLineProps {
  color: string;
  p1: REGL.Vec2;
  p2: REGL.Vec2;
  width: number;
}

export function createLinePrimitiveCommand(gl: CanvasGL) {
  // See maths here: https://www.desmos.com/calculator/ibtawfvnmr
  return (props: RawLineProps) => {
    const { p1, p2, color, width } = props;
    const angle = Math.atan2(p2[0] - p1[0], p2[1] - p1[1]);
    const c = width * Math.cos(angle);
    const s = Math.sin(angle + Math.PI) * width;

    const p1_1: [number, number] = [p1[0] + c, p1[1] + s];
    const p1_2: [number, number] = [p1[0] - c, p1[1] - s];

    const p2_1: [number, number] = [p2[0] + c, p2[1] + s];
    const p2_2: [number, number] = [p2[0] - c, p2[1] - s];

    gl.primitives.triangle([
      {
        color,
        vertices: [p1_2, p1_1, p2_1],
      },
      {
        color,
        vertices: [p2_1, p2_2, p1_2],
      },
    ]);
  };
}
