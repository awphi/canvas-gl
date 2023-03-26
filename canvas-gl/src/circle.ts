import type REGL from "regl";
import type { Color } from ".";
import { parseColor, wrapCommand } from "./utils";

export type TriVertices = [number, number, number, number, number, number];

export interface RawCircleProps {
  color: Color;
  radius: number;
  position: [number, number];
}

export interface CircleProps extends RawCircleProps {
  color: REGL.Vec4;
}

export function createCirclePrimitiveCommand(regl: REGL.Regl) {
  // Pre-compute the vertices of a circle radius 1 at the origin
  const vertices: [number, number][] = [];
  for (let i = 0; i <= 360; i++) {
    const j = (i * Math.PI) / 180;
    vertices.push([Math.sin(j), Math.cos(j)], [0, 0]);
  }

  const command = regl<{}, {}, CircleProps>({
    frag: `
      precision mediump float;
      uniform vec4 color;

      void main() {
        gl_FragColor = color;
      }`,

    vert: `
      precision mediump float;

      attribute vec2 vertexPosition;

      uniform float radius;
      uniform float width;
      uniform float height;
      uniform vec2 position;

      vec2 toClipSpace(vec2 v) {
        vec2 resolution = vec2(width, height);
        vec2 clip = ((v / resolution) - 0.5) * 2.0;
        // flip the y coord to match canvas
        clip[1] = -clip[1];
        return clip;
      }

      void main() {
        gl_Position = vec4(toClipSpace(vertexPosition * radius + position), 0, 1);
      }`,
    uniforms: {
      width: regl.context("viewportWidth"),
      height: regl.context("viewportHeight"),
      color: regl.prop<CircleProps, "color">("color"),
      position: regl.prop<CircleProps, "position">("position"),
      radius: regl.prop<CircleProps, "radius">("radius"),
    },
    attributes: {
      vertexPosition: regl.buffer(vertices),
    },
    count: (360 + 1) * 2,
    primitive: "triangle strip",
  });

  return wrapCommand<RawCircleProps, CircleProps>(command, {
    color: parseColor,
  });
}
