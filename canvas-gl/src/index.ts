import { getCanvasAndContext, parseColor } from "./utils";
import { createTrianglePrimitiveCommand, type RawTriProps } from "./triangle";
import { createCirclePrimitiveCommand, type RawCircleProps } from "./circle";
import { createLinePrimitiveCommand, type RawLineProps } from "./line";

import REGL from "regl";

export type PrimitiveCommand<P> = (props: P | P[]) => void;

export type Color = REGL.Vec4 | string;

export class CanvasGL {
  readonly canvas: HTMLCanvasElement;
  private regl: REGL.Regl;
  readonly primitives: {
    triangle: PrimitiveCommand<RawTriProps>;
    circle: PrimitiveCommand<RawCircleProps>;
    line: PrimitiveCommand<RawLineProps>;
  };

  constructor(canvas: HTMLCanvasElement | string) {
    const canvasAndCtx = getCanvasAndContext(canvas);
    if (canvasAndCtx === null) {
      throw new Error("Failed to find canvas or obtain gl context!");
    }

    this.canvas = canvasAndCtx.canvas;
    this.regl = REGL(canvasAndCtx.context);

    this.primitives = {
      triangle: createTrianglePrimitiveCommand(this.regl),
      circle: createCirclePrimitiveCommand(this.regl),
      line: createLinePrimitiveCommand(this),
    };
  }

  clear(color: Color): void {
    this.regl.clear({
      color: parseColor(color),
      depth: 1,
    });
  }

  onFrame(callback: REGL.FrameCallback) {
    this.regl.frame(callback);
  }
}
