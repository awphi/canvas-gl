import type REGL from "regl";
import type { Color } from ".";
import { parseColor, wrapCommand } from "./utils";

export type TriVertices = [number, number, number, number, number, number];

export interface RawTriProps {
  color: Color;
  vertices: [REGL.Vec2, REGL.Vec2, REGL.Vec2] | TriVertices;
}

export interface TriProps extends RawTriProps {
  color: REGL.Vec4;
  vertices: TriVertices;
}

export function createTrianglePrimitiveCommand(regl: REGL.Regl) {
  const command = regl<{}, {}, TriProps>({
    // Shaders in regl are just strings.  You can use glslify or whatever you want
    // to define them.  No need to manually create shader objects.
    frag: `
      precision mediump float;
      uniform vec4 color;

      void main() {
        gl_FragColor = color;
      }`,

    vert: `
      precision mediump float;

      attribute float vertexIndex;

      uniform float width;
      uniform float height;
      uniform vec2 vertices[3];

      vec2 toClipSpace(vec2 v) {
        vec2 resolution = vec2(width, height);
        vec2 clip = ((v / resolution) - 0.5) * 2.0;
        // flip the y coord to match canvas
        clip[1] = -clip[1];
        return clip;
      }

      void main() {
        vec2 vert = vertices[int(vertexIndex)];
        gl_Position = vec4(toClipSpace(vert), 0, 1);
      }`,
    // Here we define the vertex attributes for the above shader
    attributes: {
      // regl.buffer creates a new array buffer object
      vertexIndex: regl.buffer([0, 1, 2]),
      // regl automatically infers sane defaults for the vertex attribute pointers
    },
    uniforms: {
      width: regl.context("viewportWidth"),
      height: regl.context("viewportHeight"),
      // This defines the color of the triangle to be a dynamic variable
      color: regl.prop<TriProps, "color">("color"),
      vertices: regl.prop<TriProps, "vertices">("vertices"),
    },
    // This tells regl the number of vertices to draw in this command
    count: 3,
  });

  return wrapCommand<RawTriProps, TriProps>(command, {
    color: parseColor,
    vertices: (a) => (a.length === 6 ? a : (a.flat() as TriVertices)),
  });
}
