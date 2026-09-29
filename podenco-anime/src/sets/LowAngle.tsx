import React from "react";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { SkyGradient } from "./Sky";

/**
 * Froschperspektive: Häuser stürzen nach oben zusammen, dunkler Himmel oben,
 * damit der weiße Hund immer vor mittleren bis dunklen Tönen steht.
 */
export const LowAngleSet: React.FC<{
  ground?: number;
  scroll?: number;
  sunX?: number;
}> = ({ ground = 930, scroll = 0, sunX = 1500 }) => {
  const tower = (
    x: number,
    w: number,
    lean: number,
    col: string,
    seed: number,
  ) => {
    const top = -200;
    const d = `M ${x},${ground} L ${x + w},${ground} L ${x + w + lean},${top} L ${x + lean * 1.1},${top} Z`;
    return (
      <g key={seed}>
        <path d={d} fill={mix(col, P.night, 0.5)} />
        <path
          d={`M ${x + w * 0.8},${ground} L ${x + w},${ground} L ${x + w + lean},${top} L ${x + w * 0.8 + lean},${top} Z`}
          fill={mix(col, P.night, 0.68)}
        />
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = ground - 120 - i * 190;
          const k = (ground - yy) / (ground - top);
          const xx = x + lean * k + w * 0.25;
          const ww = w * 0.4 * (1 - k * 0.25);
          return (
            <g key={i}>
              <rect
                x={xx}
                y={yy - 90 * (1 - k * 0.4)}
                width={ww}
                height={90 * (1 - k * 0.4)}
                fill={mix("#2B2F4A", P.night, 0.3)}
              />
              {rand(seed + i) > 0.6 ? (
                <rect
                  x={xx + 6}
                  y={yy - 80 * (1 - k * 0.4)}
                  width={ww * 0.35}
                  height={40 * (1 - k * 0.4)}
                  fill={P.warmYellow}
                  opacity={0.7}
                />
              ) : null}
              <rect
                x={xx - 18}
                y={yy - 90 * (1 - k * 0.4)}
                width={14}
                height={90 * (1 - k * 0.4)}
                fill={mix(P.harborGreen, P.night, 0.45)}
              />
            </g>
          );
        })}
        {/* Gegenlichtkante */}
        <path
          d={`M ${x},${ground} L ${x + lean * 1.1},${top}`}
          stroke={P.warmYellow}
          strokeWidth={6}
          opacity={0.8}
        />
      </g>
    );
  };
  return (
    <g>
      <SkyGradient sunX={sunX} sunY={120} sunR={70} glow={0.9} deep={1} />
      <g transform={`translate(${-scroll} 0)`}>
        {tower(-260, 520, 180, "#C7856B", 1)}
        {tower(360, 380, 90, "#B8736E", 2)}
        {tower(1120, 420, -80, "#D49A6A", 3)}
        {tower(1640, 560, -200, "#A9848F", 4)}
      </g>
      <rect
        x={-200}
        y={ground}
        width={2320}
        height={400}
        fill={mix("#8C7A6B", P.night, 0.45)}
      />
      <g transform={`translate(${-(scroll % 160)} 0)`}>
        {Array.from({ length: 30 }).map((_, i) => (
          <rect
            key={i}
            x={-160 + (i % 15) * 160 + (Math.floor(i / 15) % 2) * 80}
            y={ground + 14 + Math.floor(i / 15) * 60}
            width={130}
            height={30 + Math.floor(i / 15) * 30}
            rx={12}
            fill={mix("#A38E7A", P.night, 0.4)}
          />
        ))}
      </g>
      <rect
        x={-200}
        y={ground}
        width={2320}
        height={6}
        fill={P.warmYellow}
        opacity={0.5}
      />
    </g>
  );
};
