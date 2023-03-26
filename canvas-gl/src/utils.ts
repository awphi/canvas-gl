import parseCSSColor from "parse-css-color";
import type { Color, PrimitiveCommand } from ".";
import type REGL from "regl";

export function getCanvasAndContext(
  el: HTMLCanvasElement | string,
  options?: WebGLContextAttributes
) {
  const canvas = typeof el === "string" ? document.querySelector(el) : el;

  if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
    return null;
  }

  const context = canvas.getContext("webgl", options);

  if (context === null) {
    return null;
  }

  return {
    context,
    canvas,
  };
}

export function parseColor(color: Color): REGL.Vec4 {
  if (typeof color === "string") {
    const res = parseCSSColor(color);
    if (res === null) {
      throw new Error(`Failed to parse color ${color}!`);
    }
    return res.values.map((a) => a / 255).concat(res.alpha) as REGL.Vec4;
  } else {
    return color;
  }
}

export type ValidatorMap<Raw extends {}, Processed extends Raw> = {
  [RawKey in keyof Raw]?: (rawArg: Raw[RawKey]) => Processed[RawKey];
};

export function wrapCommand<Raw extends {}, Processed extends Raw>(
  command: REGL.DrawCommand<any, Processed>,
  validators: ValidatorMap<Raw, Processed>
): PrimitiveCommand<Raw> {
  return (rawProps: Raw | Raw[]) => {
    const calls = Array.isArray(rawProps) ? rawProps : [rawProps];
    const processedProps = new Array(calls.length);
    calls.forEach((rawPropsForCall, i) => {
      const processedPropsForCall = { ...rawPropsForCall };
      Object.keys(validators).forEach((key) => {
        const k = key as keyof Raw;
        if (k in validators) {
          processedPropsForCall[k] = validators[k]!(rawPropsForCall[k]);
        }
      });
      processedProps[i] = processedPropsForCall;
    });

    command(processedProps);
  };
}
