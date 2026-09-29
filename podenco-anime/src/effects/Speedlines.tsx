import React from "react";
import { rand } from "../lib/anim";

/**
 * Radiale Speedlines: spitz zulaufende Keile vom Bildrand zur Mitte.
 * Jeder Frame würfelt die Linien neu (typisches Flackern).
 */
export const RadialSpeedlines: React.FC<{
  frame: number;
  cx?: number;
  cy?: number;
  count?: number;
  inner?: number;
  color?: string;
  opacity?: number;
  seed?: number;
  width?: number;
}> = ({
  frame,
  cx = 960,
  cy = 540,
  count = 90,
  inner = 320,
  color = "#fff",
  opacity = 1,
  seed = 0,
  width = 1,
}) => {
  const R = 2400;
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }).map((_, i) => {
        const r = rand(seed + i * 13.37 + frame * 71.3);
        const a =
          ((i + rand(i * 3.3 + frame * 9.1) * 0.8) / count) * Math.PI * 2;
        const spread = (0.004 + r * 0.012) * width;
        const start = inner * (0.75 + rand(i * 5.1 + frame * 3.7) * 0.7);
        const x0 = cx + Math.cos(a) * start;
        const y0 = cy + Math.sin(a) * start;
        const x1 = cx + Math.cos(a - spread) * R;
        const y1 = cy + Math.sin(a - spread) * R;
        const x2 = cx + Math.cos(a + spread) * R;
        const y2 = cy + Math.sin(a + spread) * R;
        return (
          <path
            key={i}
            d={`M ${x0},${y0} L ${x1},${y1} L ${x2},${y2} Z`}
            fill={color}
          />
        );
      })}
    </g>
  );
};

/**
 * Horizontale Speedlines: lange, dünne Streifen, die mit hoher Geschwindigkeit durchziehen.
 * dir = -1: Linien ziehen nach links (Figur läuft nach rechts).
 */
export const HorizontalSpeedlines: React.FC<{
  frame: number;
  count?: number;
  y0?: number;
  y1?: number;
  colors?: string[];
  speed?: number;
  dir?: 1 | -1;
  seed?: number;
  thickness?: number;
  opacity?: number;
}> = ({
  frame,
  count = 40,
  y0 = 0,
  y1 = 1080,
  colors = ["#fff"],
  speed = 180,
  dir = -1,
  seed = 0,
  thickness = 8,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {Array.from({ length: count }).map((_, i) => {
      const y = y0 + rand(seed + i * 2.71) * (y1 - y0);
      const len = 300 + rand(seed + i * 9.1) * 900;
      const v = speed * (0.6 + rand(seed + i * 4.4) * 0.9);
      const span = 1920 + len * 2;
      const pos = (rand(seed + i * 1.9) * span + frame * v) % span;
      const x = dir < 0 ? 1920 + len - pos : pos - len;
      const th = thickness * (0.3 + rand(seed + i * 6.6) * 1.2);
      return (
        <path
          key={i}
          d={`M ${x},${y} L ${x + len},${y - th / 2} L ${x + len},${y + th / 2} Z`}
          transform={dir < 0 ? `rotate(180 ${x + len / 2} ${y})` : undefined}
          fill={colors[i % colors.length]}
        />
      );
    })}
  </g>
);
