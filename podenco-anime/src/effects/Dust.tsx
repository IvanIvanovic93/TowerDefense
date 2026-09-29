import React from "react";
import { rand } from "../lib/anim";
import { P } from "../lib/palette";

/**
 * Staubwolke als flache, grafische Form: Bündel aus Kreisen mit harter Schattenseite.
 * t: 0..1 Lebenszeit. Wolke quillt auf, driftet und schrumpft am Ende (kein weiches Ausblenden).
 */
export const DustCloud: React.FC<{
  x: number;
  y: number;
  t: number;
  size?: number;
  seed?: number;
  drift?: number;
  base?: string;
  shade?: string;
}> = ({
  x,
  y,
  t,
  size = 120,
  seed = 1,
  drift = -120,
  base = "#B59A7C",
  shade = "#7E6751",
}) => {
  if (t <= 0 || t >= 1) return null;
  const grow = t < 0.3 ? t / 0.3 : 1 - Math.pow((t - 0.3) / 0.7, 2) * 0.95;
  const puffs = 7;
  return (
    <g transform={`translate(${x + drift * t} ${y - size * 0.35 * t})`}>
      {Array.from({ length: puffs }).map((_, i) => {
        const a = (i / puffs) * Math.PI + rand(seed + i) * 0.5;
        const d = size * 0.45 * (0.4 + rand(seed + i * 3) * 0.6) * (0.5 + t);
        const r = size * (0.22 + rand(seed + i * 5) * 0.18) * grow;
        const px = -Math.cos(a) * d;
        const py = -Math.sin(a) * d * 0.6;
        return (
          <g key={i}>
            <circle
              cx={px}
              cy={py}
              r={r}
              fill={shade}
              stroke={P.ink}
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={px - r * 0.18}
              cy={py - r * 0.2}
              r={r * 0.78}
              fill={base}
            />
          </g>
        );
      })}
    </g>
  );
};
