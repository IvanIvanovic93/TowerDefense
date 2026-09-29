import React, { useId } from "react";
import { rand } from "../lib/anim";
import { P } from "../lib/palette";

/**
 * Leuchtender Morgenhimmel: Verlauf Tiefblau -> Himmelblau -> Warmgelb/Orange am Horizont,
 * Sonne mit großem Glühen. Kein Konturstrich: Hintergründe sind gemalt, Figuren gezeichnet.
 */
export const SkyGradient: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  sunX: number;
  sunY: number;
  sunR?: number;
  glow?: number;
  /** 0 = normaler Morgen, 1 = dunklerer Himmel (Froschperspektive, Figur davor) */
  deep?: number;
}> = ({
  x = -400,
  y = -400,
  w = 2720,
  h = 1880,
  sunX,
  sunY,
  sunR = 90,
  glow = 1,
  deep = 0,
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <linearGradient id={`sk${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={deep > 0.5 ? P.night : P.deepBlue} />
          <stop
            offset={0.42 + deep * 0.2}
            stopColor={deep > 0.5 ? P.deepBlue : P.sky}
          />
          <stop
            offset={0.78 + deep * 0.1}
            stopColor={deep > 0.5 ? "#3C78B0" : "#9CCBEA"}
          />
          <stop offset="0.9" stopColor={P.warmYellow} />
          <stop offset="1" stopColor={P.sunOrange} />
        </linearGradient>
        <radialGradient
          id={`sg${id}`}
          cx={sunX}
          cy={sunY}
          r={900 * glow}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFF6D8" stopOpacity={1} />
          <stop offset="0.12" stopColor={P.warmYellow} stopOpacity={0.95} />
          <stop offset="0.4" stopColor={P.sunOrange} stopOpacity={0.45} />
          <stop offset="1" stopColor={P.sunOrange} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#sk${id})`} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#sg${id})`} />
      <circle cx={sunX} cy={sunY} r={sunR * 1.5} fill="#FFE9A8" opacity={0.6} />
      <circle cx={sunX} cy={sunY} r={sunR} fill="#FFF8E6" />
    </g>
  );
};

/** Pinselartige Kanten für gemalte Formen */
export const PaintDefs: React.FC<{
  id: string;
  scale?: number;
  freq?: number;
}> = ({ id, scale = 14, freq = 0.012 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence
      type="fractalNoise"
      baseFrequency={freq}
      numOctaves={2}
      seed={4}
    />
    <feDisplacementMap in="SourceGraphic" scale={scale} />
  </filter>
);

/**
 * Große Kumuluswolke: Schattenseite kühl, Lichtseite warm, orange Randglühen zur Sonne hin.
 * sun: Richtung zur Sonne (normiert).
 */
export const Cloud: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  sun?: [number, number];
  shade?: string;
  lit?: string;
  rim?: string;
}> = ({
  x,
  y,
  scale = 1,
  seed = 1,
  sun = [0.6, 0.5],
  shade = "#7F93C4",
  lit = "#FFF1D9",
  rim = "#FFB45E",
}) => {
  const id = useId().replace(/:/g, "");
  const blobs: [number, number, number][] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const cx = (u - 0.5) * 520 + (rand(seed + i) - 0.5) * 60;
    const hump = Math.sin(u * Math.PI);
    const r = 70 + hump * 110 * (0.7 + rand(seed + i * 3) * 0.5);
    const cy = -r * 0.55 - hump * 60;
    blobs.push([cx, cy, r]);
  }
  // Obere Türmchen
  blobs.push(
    [-40 + rand(seed) * 60, -250, 110],
    [80 + rand(seed + 2) * 40, -220, 90],
  );
  const circles = (dx: number, dy: number, k: number, fill: string) =>
    blobs.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx + dx * r} cy={cy + dy * r} r={r * k} fill={fill} />
    ));
  // Licht kommt überwiegend von oben, mit einem Zug zur Sonne; Randglühen auf der Sonnenseite
  const lx = sun[0] * 0.35;
  const ly = -0.55 + sun[1] * 0.2;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      filter={`url(#cf${id})`}
    >
      <defs>
        <PaintDefs id={`cf${id}`} scale={7} freq={0.03} />
        <clipPath id={`cc${id}`}>
          <rect x={-800} y={-800} width={1600} height={800} />
        </clipPath>
        <linearGradient id={`cl${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={lit} />
          <stop offset="1" stopColor="#F7CFA6" />
        </linearGradient>
        <linearGradient id={`cs${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade} />
          <stop offset="1" stopColor="#5E6FA3" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#cc${id})`}>
        {circles(sun[0] * 0.06, sun[1] * 0.06, 1.03, rim)}
        {circles(0, 0, 1, `url(#cs${id})`)}
        {circles(lx * 0.4, ly * 0.4, 0.86, "#B9B8D6")}
        {circles(lx, ly, 0.66, `url(#cl${id})`)}
      </g>
    </g>
  );
};

/** Feines Papier-/Pinselkorn über dem Hintergrund */
export const PaintGrain: React.FC<{ opacity?: number; seed?: number }> = ({
  opacity = 0.18,
  seed = 2,
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <g style={{ mixBlendMode: "multiply" }} opacity={opacity}>
      <defs>
        <filter id={`g${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.35"
            numOctaves={2}
            seed={seed}
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 1.1 -0.3"
          />
        </filter>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} filter={`url(#g${id})`} />
    </g>
  );
};
