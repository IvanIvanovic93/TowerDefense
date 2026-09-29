import React from "react";
import { useCurrentFrame } from "remotion";
import { PodencoChibi } from "../characters/PodencoChibi";
import { Postbote } from "../characters/Postbote";
import { rand, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Drop } from "../effects/Splash";

/** 20: Chibi-Stil: Hund schüttelt sich wie ein Wirbel, Postbote komplett nass, Schweißtropfen-Gag */
export const Shot20Chibi: React.FC = () => {
  const f = useCurrentFrame();
  const shaking = f >= 8 && f < 38;
  const done = f >= 38;
  const twist = shaking ? Math.sin(f * 2.4) * 34 : 0;
  const headTwist = shaking ? -Math.sin(f * 2.4 + 0.6) * 28 : done ? 8 : 0;
  const soaked = f >= 16;
  const dogX = 1250;
  return (
    <Stage>
      {/* flacher Chibi-Hintergrund: Diagonalstreifen in mittleren Tönen */}
      <rect
        x={-200}
        y={-200}
        width={2320}
        height={1480}
        fill={mix(P.sunOrange, P.roofRed, 0.45)}
      />
      <g transform={`translate(${(f * 4) % 160} 0)`}>
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={i}
            d={`M ${-400 + i * 160},-100 L ${-320 + i * 160},-100 L ${-720 + i * 160},1200 L ${-800 + i * 160},1200 Z`}
            fill={mix(P.roofRed, P.night, 0.1)}
            opacity={0.45}
          />
        ))}
      </g>
      <ellipse
        cx={960}
        cy={960}
        rx={900}
        ry={70}
        fill={mix(P.roofRed, P.night, 0.4)}
      />
      <Postbote
        x={640}
        y={960}
        scale={1.5}
        chibi
        wet={soaked}
        expression={soaked ? "soggy" : "happy"}
        frame={f}
        sweat={done ? range(f, 38, 52, 0.4, 1.6) : 0}
      />
      {/* Wirbel: Bogenlinien um den Hund */}
      {shaking
        ? Array.from({ length: 6 }).map((_, i) => {
            const a = f * 40 + i * 60;
            const r = 190 + (i % 2) * 50;
            return (
              <path
                key={i}
                d={`M ${dogX + Math.cos((a * Math.PI) / 180) * r},${760 + Math.sin((a * Math.PI) / 180) * r * 0.6} A ${r},${r * 0.6} 0 0 1 ${dogX + Math.cos(((a + 70) * Math.PI) / 180) * r},${760 + Math.sin(((a + 70) * Math.PI) / 180) * r * 0.6}`}
                fill="none"
                stroke="#fff"
                strokeWidth={10}
                strokeLinecap="round"
              />
            );
          })
        : null}
      <PodencoChibi
        x={dogX}
        y={960}
        scale={1.6}
        twist={twist}
        headTwist={headTwist}
        earL={shaking ? Math.sin(f * 2.4) * 80 : done ? 0 : 20}
        earR={shaking ? -Math.sin(f * 2.4) * 80 + 40 : done ? 80 : 60}
        eye={{ open: shaking || done ? 0 : 1, pupil: 1, glint: 1 }}
        mouth={done ? 0.7 : 0}
        wet={!done}
      />
      {/* Wasserfontäne vom Schütteln */}
      {shaking
        ? Array.from({ length: 26 }).map((_, i) => {
            const born = 8 + rand(i) * 26;
            const t = (f - born) / 10;
            if (t < 0 || t > 1) return null;
            const a = rand(i * 3.3) * Math.PI * 2;
            const toPost = rand(i * 1.1) > 0.4;
            const ang = toPost ? Math.PI + (rand(i * 5) - 0.5) * 0.9 : a;
            const d = 150 + t * 700;
            return (
              <Drop
                key={i}
                x={dogX + Math.cos(ang) * d}
                y={760 + Math.sin(ang) * d * 0.5 + t * t * 120}
                size={16}
                rot={(ang * 180) / Math.PI + 90}
              />
            );
          })
        : null}
    </Stage>
  );
};
