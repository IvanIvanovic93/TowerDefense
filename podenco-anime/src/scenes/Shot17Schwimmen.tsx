import React from "react";
import { useCurrentFrame } from "remotion";
import { Podenco } from "../characters/Podenco";
import { STAND } from "../characters/podencoPoses";
import { onTwos, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera } from "../effects/Camera";
import { Drop, WATER } from "../effects/Splash";
import { HouseRow } from "../sets/Buildings";
import { Water } from "../sets/Harbor";
import { PaintGrain, SkyGradient } from "../sets/Sky";

/** Welle als Pfad: obere Kante sinusförmig */
const wavePath = (
  y: number,
  amp: number,
  len: number,
  phase: number,
  x0 = -300,
  x1 = 2300,
) => {
  let d = `M ${x0},${y + 900}`;
  for (let x = x0; x <= x1; x += 20) {
    d += ` L ${x},${y + Math.sin((x / len) * Math.PI * 2 + phase) * amp + Math.sin((x / (len * 0.43)) * Math.PI * 2 - phase * 1.3) * amp * 0.35}`;
  }
  return d + ` L ${x1},${y + 900} Z`;
};

/** 17: Hund paddelt entschlossen zurück, nur Kopf und Ohren über Wasser, Hut im Maul */
export const Shot17Schwimmen: React.FC = () => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  const surface = 700;
  const headX = 1080 - f * 2.2;
  const bob = Math.sin(g * 0.45) * 9;
  const zoom = range(f, 30, 100, 1, 1.28);
  const scroll = f * 6;
  const pose = {
    ...STAND,
    head: -4 + Math.sin(g * 0.45) * 3,
    earN: -6 + Math.sin(g * 0.9) * 4,
    earF: -58 + Math.sin(g * 0.6) * 10,
    eye: { open: 1, pupil: 0.85, glint: 1, hard: 0.85 },
  };
  return (
    <Camera scale={zoom} originX={headX} originY={surface - 100}>
      <Stage>
        <SkyGradient sunX={1500} sunY={200} sunR={80} glow={1} />
        <g transform={`translate(${scroll * 0.2} 0)`}>
          <HouseRow
            x0={-400}
            x1={2400}
            base={380}
            hMin={110}
            hMax={190}
            wMin={100}
            wMax={160}
            seed={91}
            backlit={0.45}
          />
        </g>
        <rect
          x={-300}
          y={370}
          width={2520}
          height={30}
          fill={mix("#7A6F7E", P.night, 0.4)}
        />
        <Water y={400} h={900} frame={f} glitterX={1500} waveScale={1.8} />
        {/* Kielwasser hinter dem Kopf */}
        {[0, 1, 2, 3].map((i) => {
          const tx = headX + 120 + i * 140 + ((f * 3) % 140);
          return (
            <path
              key={i}
              d={`M ${tx},${surface - 10 + i * 12} q 60,-14 120,${-4 + i * 6}`}
              stroke="#BFEAF5"
              strokeWidth={6 - i}
              fill="none"
              strokeLinecap="round"
              opacity={0.8 - i * 0.15}
            />
          );
        })}
        <path
          d={wavePath(surface - 30, 10, 380, f * 0.22)}
          fill={mix(P.harborGreen, P.deepBlue, 0.2)}
        />
        {/* paddelnde Beine unter Wasser als dunkle Schemen */}
        <g opacity={0.35}>
          {[0, 1].map((i) => (
            <ellipse
              key={i}
              cx={headX + 40 + i * 90 + Math.sin(f * 0.5 + i * 3) * 30}
              cy={surface + 140 + Math.cos(f * 0.5 + i * 3) * 20}
              rx={70}
              ry={22}
              fill={P.night}
            />
          ))}
        </g>
        <g transform={`translate(0 ${bob})`}>
          <Podenco
            pose={pose}
            x={headX}
            y={surface - 52}
            scale={2.2}
            headOnly
            flip
            hatInMouth
            wet
          />
        </g>
        {/* Bugwelle vor dem Kopf */}
        <path
          d={`M ${headX - 330},${surface + 26 + bob} q 60,-${40 + Math.sin(g) * 8} 130,-10 q 50,20 110,4 q 40,-10 80,6 L ${headX + 60},${surface + 60 + bob} L ${headX - 330},${surface + 60 + bob} Z`}
          fill={WATER.base}
          stroke={P.ink}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d={wavePath(surface + 30, 14, 300, -f * 0.3)}
          fill={mix(P.harborGreen, P.deepBlue, 0.35)}
        />
        <path
          d={wavePath(surface + 30, 14, 300, -f * 0.3)}
          fill="none"
          stroke="#BFEAF5"
          strokeWidth={4}
          opacity={0.7}
          transform="translate(0 2)"
        />
        {[0, 1, 2, 3, 4].map((i) => {
          const t = ((f + i * 6) % 18) / 18;
          return (
            <Drop
              key={i}
              x={headX - 320 - t * 90 + i * 30}
              y={surface - 10 - Math.sin(t * Math.PI) * 60 + bob}
              size={9 + (i % 3) * 3}
              rot={-60}
            />
          );
        })}
        <PaintGrain opacity={0.08} />
      </Stage>
    </Camera>
  );
};
