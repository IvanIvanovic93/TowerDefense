import { interpolate, Easing } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Lineare Interpolation mit Clamping. */
export const lerpC = (f: number, input: number[], output: number[], ease?: (t: number) => number) =>
  interpolate(f, input, output, { ...clamp, easing: ease });

export const ease = Easing.inOut(Easing.quad);
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.quad);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const deg = (d: number) => (d * Math.PI) / 180;

/** Punkt p um Pivot c drehen (Grad, SVG-Richtung). */
export const rotPt = (p: [number, number], c: [number, number], a: number): [number, number] => {
  const r = deg(a);
  const dx = p[0] - c[0];
  const dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};
