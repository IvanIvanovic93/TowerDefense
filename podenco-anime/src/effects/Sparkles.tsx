import React from "react";
import { rand } from "../lib/anim";

/** Vierzackiger Stern */
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  rot?: number;
  color?: string;
  stroke?: string;
}> = ({ x, y, size, rot = 0, color = "#fff", stroke }) => {
  const s = size / 2;
  const w = s * 0.18;
  const d = `M 0,${-s} C ${w},${-w} ${w},${-w} ${s},0 C ${w},${w} ${w},${w} 0,${s} C ${-w},${w} ${-w},${w} ${-s},0 C ${-w},${-w} ${-w},${-w} 0,${-s} Z`;
  return (
    <path
      d={d}
      transform={`translate(${x} ${y}) rotate(${rot})`}
      fill={color}
      stroke={stroke}
      strokeWidth={stroke ? 2 : 0}
      vectorEffect="non-scaling-stroke"
    />
  );
};

/** Feld funkelnder Sterne: jeder Stern hat einen eigenen Lebenszyklus */
export const SparkleField: React.FC<{
  frame: number;
  count: number;
  x: number;
  y: number;
  w: number;
  h: number;
  seed?: number;
  size?: number;
  colors?: string[];
  period?: number;
}> = ({
  frame,
  count,
  x,
  y,
  w,
  h,
  seed = 1,
  size = 40,
  colors = ["#fff", "#FFD166"],
  period = 14,
}) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const off = rand(seed + i * 3.1) * period;
      const life = ((frame + off) % period) / period;
      const cycle = Math.floor((frame + off) / period);
      const px = x + rand(seed + i * 7.7 + cycle * 1.3) * w;
      const py = y + rand(seed + i * 5.3 + cycle * 2.9) * h;
      const sc = Math.sin(life * Math.PI);
      const sz = size * (0.5 + rand(seed + i) * 0.8) * sc;
      if (sz < 1) return null;
      return (
        <Sparkle
          key={i}
          x={px}
          y={py}
          size={sz}
          rot={life * 45}
          color={colors[i % colors.length]}
        />
      );
    })}
  </g>
);
