import React from "react";
import { rand } from "../lib/anim";
import { P } from "../lib/palette";

const W_BASE = "#BFEAF5";
const W_SHADE = "#4C9BC0";
const W_DEEP = "#1E5E7E";

/** Einzelner Tropfen als flache Tropfenform */
export const Drop: React.FC<{
  x: number;
  y: number;
  size: number;
  rot?: number;
  color?: string;
}> = ({ x, y, size, rot = 0, color = W_BASE }) => (
  <path
    d={`M 0,${-size} C ${size * 0.6},${-size * 0.2} ${size * 0.6},${size * 0.6} 0,${size * 0.6} C ${-size * 0.6},${size * 0.6} ${-size * 0.6},${-size * 0.2} 0,${-size} Z`}
    transform={`translate(${x} ${y}) rotate(${rot})`}
    fill={color}
    stroke={P.ink}
    strokeWidth={3}
    vectorEffect="non-scaling-stroke"
  />
);

/**
 * Wasserspritzer: Krone aus Zacken plus fliegende Tropfen, flach und grafisch.
 * t: 0..1
 */
export const WaterSplash: React.FC<{
  x: number;
  y: number;
  t: number;
  size?: number;
  seed?: number;
}> = ({ x, y, t, size = 200, seed = 3 }) => {
  if (t <= 0 || t >= 1) return null;
  const rise = Math.sin(Math.min(1, t * 1.6) * Math.PI);
  const n = 9;
  let crown = `M ${-size},0`;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const px = -size + u * size * 2;
    const peak =
      size *
      (0.5 + rand(seed + i) * 0.7) *
      rise *
      (1 - Math.abs(u - 0.5) * 0.9);
    const vx = px + (u - 0.5) * size * 0.5 * t;
    crown += ` L ${vx - size * 0.06},${-peak * 0.3} L ${vx},${-peak} L ${vx + size * 0.06},${-peak * 0.3}`;
  }
  crown += ` L ${size},0 Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      {rise > 0.02 ? (
        <>
          <path
            d={crown}
            fill={W_SHADE}
            stroke={P.ink}
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
          <path
            d={crown}
            fill={W_BASE}
            transform={`translate(${-size * 0.04} ${size * 0.03}) scale(0.82 0.85)`}
          />
        </>
      ) : null}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = -Math.PI * (0.15 + rand(seed + i * 2.2) * 0.7);
        const v = size * (1.2 + rand(seed + i * 4.1) * 1.4);
        const px = Math.cos(a) * v * t;
        const py = Math.sin(a) * v * t + 1.6 * size * t * t;
        const s = size * 0.07 * (1 - t * 0.6);
        return (
          <Drop key={i} x={px} y={py} size={s} rot={(a * 180) / Math.PI + 90} />
        );
      })}
    </g>
  );
};

/** Riesige Wassersäule beim Eintauchen */
export const WaterColumn: React.FC<{
  x: number;
  y: number;
  t: number;
  height?: number;
  width?: number;
  seed?: number;
}> = ({ x, y, t, height = 900, width = 360, seed = 11 }) => {
  if (t <= 0 || t >= 1) return null;
  const h =
    height *
    Math.sin(Math.min(1, t * 1.3) * Math.PI * 0.5) *
    (1 - Math.max(0, t - 0.6) * 1.5);
  const w = width * (0.8 + t * 0.4);
  const n = 7;
  let d = `M ${-w * 0.7},0 C ${-w * 0.5},${-h * 0.3} ${-w * 0.45},${-h * 0.7} ${-w * 0.3},${-h * 0.9}`;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const px = -w * 0.3 + u * w * 0.6;
    const top = -h * (0.92 + rand(seed + i) * 0.16);
    d += ` L ${px},${top} L ${px + (w * 0.3) / n},${top + h * 0.06}`;
  }
  d += ` C ${w * 0.45},${-h * 0.7} ${w * 0.5},${-h * 0.3} ${w * 0.7},0 Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={d}
        fill={W_DEEP}
        stroke={P.ink}
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill={W_SHADE}
        transform={`translate(${-w * 0.06} 0) scale(0.8 0.96)`}
      />
      <path
        d={d}
        fill={W_BASE}
        transform={`translate(${-w * 0.12} 0) scale(0.45 0.9)`}
      />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = -Math.PI * (0.1 + rand(seed + i * 1.7) * 0.8);
        const v = w * (1.5 + rand(seed + i * 3.3) * 2.5);
        const px = Math.cos(a) * v * t;
        const py =
          -h * 0.7 * rand(seed + i * 8.8) +
          Math.sin(a) * v * t * 0.6 +
          900 * t * t;
        return (
          <Drop
            key={i}
            x={px}
            y={py}
            size={14 + rand(seed + i) * 20}
            rot={(a * 180) / Math.PI + 90}
          />
        );
      })}
    </g>
  );
};

export const WATER = { base: W_BASE, shade: W_SHADE, deep: W_DEEP };
