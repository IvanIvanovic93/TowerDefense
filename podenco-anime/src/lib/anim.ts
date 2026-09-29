import { Easing, interpolate } from "remotion";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ruhige Momente auf "twos": Bild wechselt nur jeden zweiten Frame. */
export const onTwos = (f: number) => Math.floor(f / 2) * 2;

/** Deterministischer Zufall 0..1 */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const range = (
  f: number,
  a: number,
  b: number,
  from: number,
  to: number,
  ease?: (t: number) => number,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
export const backOut = Easing.out(Easing.back(2.2));

/** Sprung-Parabel: 0 an den Enden, 1 in der Mitte */
export const arc = (t: number) => 4 * t * (1 - t);

export const deg = (d: number) => (d * Math.PI) / 180;
