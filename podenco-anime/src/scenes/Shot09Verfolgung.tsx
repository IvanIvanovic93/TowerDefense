import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco } from "../characters/Podenco";
import { runPose } from "../characters/podencoPoses";
import { range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera, shake, zoomPunch } from "../effects/Camera";
import { DustCloud } from "../effects/Dust";
import { HorizontalSpeedlines } from "../effects/Speedlines";
import { MarketSet } from "../sets/Market";

/** 9: Seitliche Verfolgung über den Marktplatz, Hintergrund verwischt zu Speedlines, Hut tanzt knapp vor ihm */
export const Shot09Verfolgung: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = f * 75;
  const blur = range(f, 0, 30, 6, 40);
  const lines = range(f, 6, 36, 0, 1);
  const { pose } = runPose(f);
  const dogX = 700 + Math.sin(f * 0.11) * 60 + range(f, 40, 60, 0, 80);
  const hatX = dogX + 470 + Math.sin(f * 0.23) * 70;
  const hatY =
    560 + Math.sin(f * 0.37) * 110 - Math.abs(Math.sin(f * 0.19)) * 60;
  // Kurzes Zuschnappen: der Hund schnappt nach dem Hut, verfehlt knapp
  const snap = f >= 44 && f < 50;
  const z = zoomPunch(f, 44, 1.12, 3) * range(f, 50, 60, 1, 1 / 1.12);
  const s = shake(f, 44, 8, 5);
  return (
    <Camera scale={z} x={s.x} y={s.y} originX={dogX + 200} originY={640}>
      <Stage>
        <MarketSet scroll={scroll} ground={960} blur={blur} />
        {/* Hintergrund geht in farbige Speedlines über */}
        <rect
          x={-200}
          y={-200}
          width={2320}
          height={1480}
          fill={mix(P.deepBlue, P.night, 0.3)}
          opacity={lines * 0.75}
        />
        <HorizontalSpeedlines
          frame={f}
          count={60}
          y0={-40}
          y1={1100}
          colors={["#4FA3E0", "#FFD166", "#ffffff", "#FF9A3C"]}
          speed={240}
          dir={-1}
          seed={21}
          thickness={10}
          opacity={lines}
        />
        {Array.from({ length: 4 }).map((_, i) => {
          const t = ((f + i * 5) % 20) / 20;
          return (
            <DustCloud
              key={i}
              x={dogX - 180 - t * 200}
              y={968}
              t={t}
              size={90}
              seed={i + 30}
              drift={-260}
            />
          );
        })}
        <Hat x={hatX} y={hatY} scale={1.5} rot={f * 23} spin={f * 31} />
        <Podenco
          pose={{ ...pose, mouth: snap ? 0.8 : 0, earF: -80 + (f % 3) * 6 }}
          x={dogX}
          y={968}
          scale={1.55}
        />
        <HorizontalSpeedlines
          frame={f}
          count={10}
          y0={700}
          y1={1080}
          colors={["#ffffff"]}
          speed={340}
          dir={-1}
          seed={33}
          thickness={14}
          opacity={0.9}
        />
      </Stage>
    </Camera>
  );
};
