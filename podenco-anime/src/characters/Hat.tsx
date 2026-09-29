import React from "react";
import { Cel } from "../lib/Cel";
import { Shape } from "../lib/Line";
import { P } from "../lib/palette";

const CROWN =
  "M -54,-14 C -60,-44 50,-50 62,-20 C 60,-12 50,-4 44,0 L -46,0 C -52,-4 -54,-8 -54,-14 Z";
const BAND = "M -46,0 L 44,0 C 46,4 45,9 42,12 L -44,12 C -47,8 -47,4 -46,0 Z";
const VISOR = "M 30,8 C 56,4 82,10 90,20 C 72,26 44,22 26,14 Z";

/**
 * Flacher Schirmhut in Senfgelb. Eigenes Objekt, damit er abreißen und fliegen kann.
 * spin: Drehung um die Hochachse in Grad (Taumeln in der Luft).
 */
export const Hat: React.FC<{
  x?: number;
  y?: number;
  rot?: number;
  spin?: number;
  scale?: number;
  wet?: boolean;
  silhouette?: string;
  light?: [number, number];
}> = ({
  x = 0,
  y = 0,
  rot = 0,
  spin = 0,
  scale = 1,
  wet = false,
  silhouette,
  light,
}) => {
  const sx = Math.cos((spin * Math.PI) / 180);
  const showUnder = sx < 0;
  const hatBase = wet ? "#C99A34" : P.hat;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale * (Math.abs(sx) < 0.12 ? 0.12 * Math.sign(sx || 1) : sx)} ${scale})`}
    >
      {showUnder ? (
        // Unterseite: dunkles Innenfutter sichtbar
        <Cel
          d="M -50,0 C -50,20 44,20 44,0 C 44,-8 -50,-8 -50,0 Z"
          base="#5A4320"
          shade="#3E2E16"
          light={light}
          silhouette={silhouette}
        />
      ) : null}
      <Cel
        d={VISOR}
        base="#3B2F20"
        shade="#241C12"
        light={light}
        silhouette={silhouette}
        shadeOffset={6}
      />
      <Cel
        d={CROWN}
        base={hatBase}
        shade={P.hatShade}
        rim="#FFE9A8"
        light={light}
        shadeOffset={16}
        rimOffset={5}
        silhouette={silhouette}
      />
      <Cel
        d={BAND}
        base="#7A5A22"
        shade="#5A4118"
        light={light}
        shadeOffset={6}
        silhouette={silhouette}
      />
      {!silhouette ? (
        <Shape d="M 34,2 a 6,6 0 1 0 0.1,0 Z" fill={P.warmYellow} />
      ) : null}
      {wet && !silhouette ? (
        <g
          fill={P.tear}
          stroke={P.ink}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        >
          <path d="M -30,14 q 4,10 0,14 q -4,-4 0,-14 Z" />
          <path d="M 10,14 q 4,12 0,16 q -4,-4 0,-16 Z" />
        </g>
      ) : null}
    </g>
  );
};
