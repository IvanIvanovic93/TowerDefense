import React from "react";
import { random } from "remotion";
import { Ink } from "./Ink";
import { C } from "../lib/palette";

const drop = (x: number, y: number, r: number, rot: number) =>
  `M ${x} ${y - r * 1.8} C ${x + r} ${y - r * 0.4} ${x + r} ${y + r} ${x} ${y + r} C ${x - r} ${y + r} ${x - r} ${y - r * 0.4} ${x} ${y - r * 1.8} Z`;

/**
 * Wasserspritzer als flache Formen: Krone aus Zacken + fliegende Tropfen + Ringe.
 * t = Frames seit dem Aufprall.
 */
export const Splash: React.FC<{ t: number; x: number; y: number; size?: number; seed?: string }> = ({ t, x, y, size = 1, seed = "s" }) => {
  if (t < 0 || t > 40) return null;
  const grow = Math.min(1, t / 6);
  const fall = Math.max(0, (t - 8) / 14);
  const crownH = 160 * size * grow * Math.max(0, 1 - fall);
  const n = 7;
  const crown: string[] = [];
  for (let i = 0; i <= n; i++) {
    const px = x - 130 * size + (i / n) * 260 * size;
    const h = crownH * (0.55 + random(`${seed}h${i}`) * 0.6) * (1 - Math.abs(i / n - 0.5));
    crown.push(`${px.toFixed(1)} ${(y - h * 2).toFixed(1)}`);
    if (i < n) crown.push(`${(px + (130 * size) / n).toFixed(1)} ${(y - h * 0.8).toFixed(1)}`);
  }
  const crownD = `M ${x - 150 * size} ${y + 10} L ${crown.join(" L ")} L ${x + 150 * size} ${y + 10} Z`;
  const drops = Array.from({ length: 12 }, (_, i) => {
    const a = -Math.PI / 2 + (random(`${seed}a${i}`) - 0.5) * 2.4;
    const v = (10 + random(`${seed}v${i}`) * 12) * size;
    const px = x + Math.cos(a) * v * t;
    const py = y + Math.sin(a) * v * t + 0.9 * t * t * size;
    return { px, py, r: (6 + random(`${seed}r${i}`) * 8) * size };
  });
  const ring = Math.min(1, t / 30);
  return (
    <g>
      <ellipse cx={x} cy={y + 8} rx={(160 + ring * 220) * size} ry={(20 + ring * 26) * size} fill="none" stroke={C.papier} strokeWidth={6} opacity={1 - ring} filter="url(#boil)" />
      {crownH > 4 ? <Ink d={crownD} fill={C.papier} off={[6, 4]} /> : null}
      {drops.map((d, i) =>
        d.py < y + 20 ? <Ink key={i} d={drop(d.px, d.py, d.r, 0)} fill={i % 3 === 0 ? C.papier : "#A9C3D2"} off={[3, 2]} w={3} /> : null
      )}
    </g>
  );
};

/** Tropfen beim Schütteln: fliegen von (x,y) aus in Richtung dir (-1 = links). */
export const ShakeDrops: React.FC<{ t: number; x: number; y: number; dir?: number; seed?: string; count?: number }> = ({
  t,
  x,
  y,
  dir = -1,
  seed = "d",
  count = 26,
}) => {
  if (t < 0) return null;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const born = Math.floor(random(`${seed}b${i}`) * 18);
        const lt = t - born;
        if (lt < 0 || lt > 22) return null;
        const a = (random(`${seed}a${i}`) - 0.5) * 2.2;
        const v = 18 + random(`${seed}v${i}`) * 22;
        const sx = x + (random(`${seed}x${i}`) - 0.5) * 220;
        const sy = y + (random(`${seed}y${i}`) - 0.5) * 120;
        const toLeft = random(`${seed}d${i}`) < 0.7 ? dir : -dir;
        const px = sx + Math.cos(a) * v * lt * toLeft;
        const py = sy + Math.sin(a) * v * lt * 0.6 + 0.7 * lt * lt;
        const r = 5 + random(`${seed}r${i}`) * 6;
        return <Ink key={i} d={drop(px, py, r, 0)} fill="#A9C3D2" off={[2, 2]} w={3} />;
      })}
    </g>
  );
};
