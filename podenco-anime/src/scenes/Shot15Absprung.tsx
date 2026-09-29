import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco } from "../characters/Podenco";
import { LEAP, runPose } from "../characters/podencoPoses";
import { arc, clamp, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera } from "../effects/Camera";
import { HorizontalSpeedlines, RadialSpeedlines } from "../effects/Speedlines";
import { SparkleField } from "../effects/Sparkles";
import { Water } from "../sets/Harbor";
import { Cloud, SkyGradient } from "../sets/Sky";

const TAKEOFF = 6;
const RAMP = 44;
const time = (f: number) =>
  f < TAKEOFF
    ? f
    : f < RAMP
      ? TAKEOFF + (f - TAKEOFF) * 0.15
      : TAKEOFF + (RAMP - TAKEOFF) * 0.15 + (f - RAMP) * 1.8;

/** 15: Sprung von der Hafenkante, Zeitlupe als Silhouette vor der Sonne, dann Speed Ramp nach unten */
export const Shot15Absprung: React.FC = () => {
  const f = useCurrentFrame();
  const t = time(f);
  const SIL = P.night;
  const u = clamp((t - TAKEOFF) / 5.7);
  let x: number;
  let y: number;
  let rot = 0;
  if (f < TAKEOFF) {
    x = 120 + f * 75;
    y = 800;
  } else if (f < RAMP) {
    x = 570 + u * 560;
    y = 800 - arc(u * 0.8) * 250;
    rot = range(u, 0.4, 1, 0, 18);
  } else {
    const k = f - RAMP;
    x = 1130 + k * 40;
    y = 800 - arc(0.8) * 250 + k * 28 + k * k * 5.5;
    rot = 18 + k * 5;
  }
  const camY = f < RAMP ? 0 : -Math.min(700, (f - RAMP) ** 2 * 4.5);
  const { pose: run } = runPose(f);
  const pose =
    f < TAKEOFF
      ? run
      : {
          ...LEAP,
          bodyRot: -10 + rot,
          earN: -76 + Math.sin(t * 2) * 6,
          earF: -84,
        };
  const slow = f >= TAKEOFF && f < RAMP;
  return (
    <Camera y={camY}>
      <Stage>
        <SkyGradient
          sunX={1000}
          sunY={420}
          sunR={250}
          glow={1.8}
          y={-400}
          h={2600}
        />
        <Cloud x={260} y={200} scale={1.1} seed={31} sun={[1, 0.4]} />
        <Cloud x={1700} y={170} scale={1.3} seed={32} sun={[-1, 0.4]} />
        {slow ? (
          <RadialSpeedlines
            frame={f * 0.25}
            cx={1000}
            cy={420}
            count={50}
            inner={290}
            color="#FFF6D8"
            opacity={0.5}
          />
        ) : null}
        <Water
          y={780}
          h={1400}
          frame={f}
          glitterX={1000}
          top={mix(P.harborGreen, P.sunOrange, 0.15)}
        />
        {/* Hafenkante als Silhouette */}
        <path d="M -200,780 L 600,780 L 600,1500 L -200,1500 Z" fill={SIL} />
        <rect x={420} y={730} width={40} height={50} fill={SIL} />
        <path d="M 600,780 L 520,780" stroke={P.sunOrange} strokeWidth={5} />
        <Podenco
          pose={pose}
          x={x}
          y={y}
          scale={1.35}
          silhouette={SIL}
          hatInMouth={false}
        />
        {slow ? (
          <SparkleField
            frame={f}
            count={8}
            x={x - 300}
            y={y - 450}
            w={600}
            h={400}
            size={46}
            seed={9}
            period={18}
            colors={["#FFF6D8"]}
          />
        ) : null}
        {f >= RAMP ? (
          <g transform="rotate(90 960 540)">
            <HorizontalSpeedlines
              frame={f}
              count={40}
              y0={-400}
              y1={2400}
              colors={["#fff", "#FFD166"]}
              speed={320}
              dir={1}
              seed={15}
              thickness={10}
            />
          </g>
        ) : null}
        {/* der Hut treibt unten im Wasser */}
        <Hat x={1560} y={1200} scale={1.2} rot={Math.sin(f * 0.2) * 6} wet />
      </Stage>
    </Camera>
  );
};
