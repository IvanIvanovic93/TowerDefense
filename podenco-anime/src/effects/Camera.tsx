import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, rand } from "../lib/anim";

/**
 * Screen Shake: 5-12px, 4-6 Frames, abklingend. Richtung wechselt jeden Frame hart.
 */
export const shake = (frame: number, start: number, amp = 10, dur = 5) => {
  const t = frame - start;
  if (t < 0 || t >= dur) return { x: 0, y: 0 };
  const decay = 1 - t / dur;
  const a = amp * decay;
  return {
    x: (rand(start * 3.1 + t * 17.3) * 2 - 1) * a,
    y: (rand(start * 7.7 + t * 11.9) * 2 - 1) * a,
  };
};

/** Summe mehrerer Shakes */
export const shakes = (frame: number, list: [number, number?, number?][]) =>
  list.reduce(
    (acc, [s, amp, dur]) => {
      const o = shake(frame, s, amp, dur);
      return { x: acc.x + o.x, y: acc.y + o.y };
    },
    { x: 0, y: 0 },
  );

/** Zoom Punch: schneller Scale 1.0 auf 1.15 in 3 Frames, Ease-Out, dann gehalten */
export const zoomPunch = (frame: number, start: number, to = 1.15, dur = 3) => {
  const t = clamp((frame - start) / dur);
  const e = 1 - Math.pow(1 - t, 3);
  return 1 + (to - 1) * e;
};

/** Kamera: Verschiebung, Zoom, Dutch Angle, Shake in einem Wrapper */
export const Camera: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rot?: number;
  originX?: number;
  originY?: number;
  children: React.ReactNode;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rot = 0,
  originX = 960,
  originY = 540,
  children,
}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
      transformOrigin: `${originX}px ${originY}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);
