import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { easeOut, range } from "../lib/anim";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { HorizontalSpeedlines } from "../effects/Speedlines";
import { Sparkle } from "../effects/Sparkles";
import { Cloud, PaintGrain, SkyGradient } from "../sets/Sky";

/** 4: Hut reißt ab, Zeitlupe, dreht sich in der Luft */
export const Shot04Hut: React.FC = () => {
  const f = useCurrentFrame();
  // die ersten 2 Frames reißen in Echtzeit, dann Zeitlupe
  const t = f < 2 ? f : 2 + (f - 2) * 0.28;
  const hx = range(t, 0, 6, 760, 1060, easeOut);
  const hy = range(t, 0, 6, 820, 470, easeOut);
  return (
    <Stage>
      <SkyGradient sunX={260} sunY={880} sunR={60} glow={1.1} />
      <Cloud x={1500} y={900} scale={1.8} seed={8} sun={[-1, 0]} />
      <Cloud x={300} y={380} scale={1.2} seed={9} sun={[-0.3, 1]} />
      <HorizontalSpeedlines
        frame={t * 3}
        count={24}
        colors={["#ffffff", "#FFE7A8"]}
        speed={90}
        dir={-1}
        seed={5}
        thickness={5}
        opacity={0.7}
      />
      {/* Glatzkopf des Postboten unten links, der Hut hebt ab */}
      <g
        transform={`translate(${range(t, 0, 6, 0, -80)} ${range(t, 0, 6, 0, 60)})`}
      >
        <path
          d="M 360,1180 C 340,920 520,820 700,840 C 880,860 960,1000 940,1180 Z"
          fill={P.skin}
          stroke={P.ink}
          strokeWidth={3}
        />
        <path
          d="M 520,880 C 600,850 700,850 760,880"
          fill="none"
          stroke="#fff"
          strokeWidth={14}
          strokeLinecap="round"
          opacity={0.8}
        />
        <path
          d="M 640,846 C 630,800 660,790 650,760"
          fill="none"
          stroke={P.ink}
          strokeWidth={3}
        />
      </g>
      <Hat
        x={hx}
        y={hy}
        scale={4.2}
        rot={-20 + t * 38}
        spin={t * 70}
        light={[-0.8, 0.6]}
      />
      {f >= 2 ? (
        <Sparkle
          x={hx + 120}
          y={hy - 140}
          size={range(f, 2, 14, 120, 20)}
          rot={f * 6}
          color="#FFF6D8"
        />
      ) : null}
      <PaintGrain opacity={0.1} />
    </Stage>
  );
};
