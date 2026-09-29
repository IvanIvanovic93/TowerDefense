import React from "react";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { HouseRow } from "./Buildings";
import { SkyGradient } from "./Sky";

/** Marktstand mit gestreifter Markise. Theke und Rückwand dunkel, damit der Hund davor lesbar bleibt. */
export const Stall: React.FC<{
  x: number;
  ground: number;
  w?: number;
  seed?: number;
  fish?: boolean;
  dark?: number;
}> = ({ x, ground, w = 420, seed = 1, fish, dark = 0.35 }) => {
  const top = ground - 560;
  const stripes = 7;
  const c1 = mix(P.roofRed, P.night, dark * 0.6);
  const c2 = mix(fish ? "#4FA3E0" : P.warmYellow, P.night, dark * 0.7);
  const counterTop = ground - 190;
  return (
    <g>
      <rect
        x={x + 14}
        y={top + 80}
        width={w - 28}
        height={counterTop - top - 80}
        fill={mix("#4A3548", P.night, dark)}
      />
      <rect
        x={x}
        y={top + 60}
        width={16}
        height={ground - top - 60}
        fill={mix("#5A4030", P.night, dark)}
      />
      <rect
        x={x + w - 16}
        y={top + 60}
        width={16}
        height={ground - top - 60}
        fill={mix("#5A4030", P.night, dark)}
      />
      {/* Markise mit Wellenkante */}
      {Array.from({ length: stripes }).map((_, i) => {
        const sx = x - 20 + ((w + 40) / stripes) * i;
        const sw = (w + 40) / stripes;
        return (
          <path
            key={i}
            d={`M ${sx},${top} L ${sx + sw},${top} L ${sx + sw},${top + 90} Q ${sx + sw / 2},${top + 130} ${sx},${top + 90} Z`}
            fill={i % 2 ? c1 : c2}
          />
        );
      })}
      <rect
        x={x - 26}
        y={top - 16}
        width={w + 52}
        height={20}
        fill={mix(c1, P.night, 0.3)}
      />
      {/* Theke */}
      <rect
        x={x - 10}
        y={counterTop}
        width={w + 20}
        height={190}
        fill={mix("#7A5238", P.night, dark + 0.1)}
      />
      <rect
        x={x - 10}
        y={counterTop}
        width={w + 20}
        height={12}
        fill={P.warmYellow}
        opacity={0.6}
      />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={i}
          x={x + i * (w / 4) + 8}
          y={counterTop + 30}
          width={w / 4 - 16}
          height={140}
          fill={mix("#5E3F2C", P.night, dark + 0.1)}
        />
      ))}
      {/* Ware */}
      {Array.from({ length: 9 }).map((_, i) => {
        const gx = x + 30 + (i / 8) * (w - 60);
        const col = fish
          ? ["#C3D1DF", "#F28C38", "#E0C35A"][i % 3]
          : ["#F28C38", "#D1495B", "#9BC53D", "#FFD166"][
              Math.floor(rand(seed + i) * 4)
            ];
        return fish ? (
          <ellipse
            key={i}
            cx={gx}
            cy={counterTop - 12}
            rx={34}
            ry={12}
            fill={mix(col, P.night, dark * 0.5)}
            transform={`rotate(${(rand(seed + i) - 0.5) * 30} ${gx} ${counterTop - 12})`}
          />
        ) : (
          <circle
            key={i}
            cx={gx}
            cy={counterTop - 16}
            r={18}
            fill={mix(col, P.night, dark * 0.5)}
          />
        );
      })}
    </g>
  );
};

/**
 * Marktplatz seitlich für die Verfolgung. scroll = Weltverschiebung in px,
 * blur = horizontale Bewegungsunschärfe (Hintergrund verwischt zu Streifen).
 */
export const MarketSet: React.FC<{
  scroll: number;
  ground?: number;
  blur?: number;
}> = ({ scroll, ground = 960, blur = 0 }) => {
  const far = scroll * 0.35;
  const mid = scroll;
  const stallW = 520;
  const first = Math.floor(mid / stallW) - 1;
  return (
    <g>
      <defs>
        <filter id="mblur" x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </defs>
      <g filter={blur > 0 ? "url(#mblur)" : undefined}>
        <SkyGradient sunX={260} sunY={80} sunR={60} glow={0.9} />
        <g transform={`translate(${-(far % 2400)} 0)`}>
          <HouseRow
            x0={-300}
            x1={4900}
            base={ground - 240}
            hMin={380}
            hMax={560}
            wMin={240}
            wMax={360}
            seed={61}
            backlit={0.5}
          />
        </g>
        <rect
          x={-200}
          y={ground - 250}
          width={2320}
          height={600}
          fill={mix("#8C7A6B", P.night, 0.45)}
        />
        <g transform={`translate(${-mid} 0)`}>
          {Array.from({ length: 6 }).map((_, i) => {
            const k = first + i;
            return (
              <Stall
                key={k}
                x={k * stallW + 40}
                ground={ground - 120}
                w={stallW - 90}
                seed={k * 3.3}
                dark={0.45}
              />
            );
          })}
        </g>
        <g transform={`translate(${-(mid % 140)} 0)`}>
          {Array.from({ length: 34 }).map((_, i) => (
            <rect
              key={i}
              x={-140 + (i % 17) * 140 + (Math.floor(i / 17) % 2) * 70}
              y={ground + 10 + Math.floor(i / 17) * 50}
              width={116}
              height={30 + Math.floor(i / 17) * 12}
              rx={12}
              fill={mix("#A38E7A", P.night, 0.45)}
            />
          ))}
        </g>
      </g>
    </g>
  );
};
