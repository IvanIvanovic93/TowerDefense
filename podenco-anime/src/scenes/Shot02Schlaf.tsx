import React from "react";
import { useCurrentFrame } from "remotion";
import { PodencoFace } from "../characters/PodencoFace";
import { Cel } from "../lib/Cel";
import { onTwos } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { limbPath } from "../lib/shapes";
import { Stage } from "../lib/Stage";
import { PaintGrain } from "../sets/Sky";

/** 2: Close-up schlafender Hund in der Türnische, ein Ohr zuckt */
export const Shot02Schlaf: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  // Ohrzucken: zwei schnelle Zuckungen des weggekippten Ohrs
  const twitch =
    f >= 12 && f < 14
      ? -30
      : f >= 16 && f < 18
        ? -18
        : f >= 18 && f < 20
          ? 6
          : 0;
  const breathe = Math.sin(f * 0.18) * 0.012;
  const door = mix("#6B4431", P.night, 0.45);
  return (
    <Stage bg={P.night}>
      {/* dunkle Türnische, warmes Streiflicht vom Morgen */}
      <rect
        x={0}
        y={0}
        width={1920}
        height={1080}
        fill={mix(P.deepBlue, P.night, 0.4)}
      />
      <rect x={420} y={-40} width={1080} height={1000} fill={door} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={440 + i * 150}
          y={-40}
          width={8}
          height={1000}
          fill={mix(door, P.night, 0.4)}
        />
      ))}
      <path
        d="M 1500,-40 L 1920,-40 L 1920,1080 L 1500,1080 Z"
        fill={mix("#C7856B", P.night, 0.55)}
      />
      <path
        d="M 0,-40 L 420,-40 L 420,1080 L 0,1080 Z"
        fill={mix("#C7856B", P.night, 0.62)}
      />
      <path
        d="M 1500,-40 L 1920,-40 L 1920,300 L 1500,560 Z"
        fill={P.sunOrange}
        opacity={0.35}
      />
      <rect
        x={0}
        y={900}
        width={1920}
        height={200}
        fill={mix("#8C7A6B", P.night, 0.5)}
      />
      <path
        d="M 1100,900 L 1920,900 L 1920,1080 L 1300,1080 Z"
        fill={P.warmYellow}
        opacity={0.25}
      />
      <g
        transform={`translate(960 640) scale(${1 + breathe} ${1 - breathe}) translate(-960 -640)`}
      >
        {/* Rücken hinter dem Kopf */}
        <Cel
          d="M 300,1100 C 260,860 520,760 760,800 C 1000,840 1500,820 1700,900 C 1800,960 1800,1100 1800,1100 Z"
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          shadeOffset={40}
        >
          {[
            [520, 860, 5],
            [640, 840, 4],
            [1300, 870, 5],
            [1450, 890, 4],
            [1600, 930, 5],
            [840, 850, 3.5],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={P.freckle} />
          ))}
        </Cel>
        <PodencoFace
          x={960}
          y={560}
          scale={1.9}
          tilt={-10}
          earL={52}
          earR={86 + twitch}
          eye={{ open: 0, pupil: 1, glint: 1 }}
        />
        {/* Vorderpfoten vor der Schnauze */}
        <Cel
          d={limbPath(
            [
              [560, 1010],
              [800, 990],
              [960, 1000],
              [1010, 1010],
            ],
            [70, 60, 58, 62],
          )}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          shadeOffset={16}
        />
        <Cel
          d={limbPath(
            [
              [1420, 1040],
              [1180, 1020],
              [1030, 1030],
              [990, 1040],
            ],
            [70, 60, 58, 62],
          )}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          shadeOffset={16}
        />
      </g>
      {/* Zzz */}
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 10) % 30) / 30;
        return (
          <text
            key={i}
            x={1260 + t * 120 + i * 20}
            y={360 - t * 200}
            fontFamily="Arial Black, sans-serif"
            fontSize={50 + i * 18}
            fill={P.warmYellow}
            stroke={P.ink}
            strokeWidth={3}
            opacity={Math.sin(t * Math.PI)}
          >
            Z
          </text>
        );
      })}
      <PaintGrain opacity={0.12} />
    </Stage>
  );
};
