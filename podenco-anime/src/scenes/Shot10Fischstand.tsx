import React from "react";
import { useCurrentFrame } from "remotion";
import { Fish } from "../characters/Critters";
import { Podenco } from "../characters/Podenco";
import { LEAP, mixPose, runPose } from "../characters/podencoPoses";
import { arc, clamp, rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera, shake, zoomPunch } from "../effects/Camera";
import { HorizontalSpeedlines } from "../effects/Speedlines";
import { SparkleField } from "../effects/Sparkles";
import { Drop } from "../effects/Splash";
import { Stall } from "../sets/Market";

/** Zeitverlauf: 8 Frames normal, dann Zeitlupe, bei Frame 33 schlagartig volle Geschwindigkeit */
const RAMP_IN = 8;
const RAMP_OUT = 33;
const sceneTime = (f: number) => {
  if (f < RAMP_IN) return f;
  if (f < RAMP_OUT) return RAMP_IN + (f - RAMP_IN) * 0.12;
  return RAMP_IN + (RAMP_OUT - RAMP_IN) * 0.12 + (f - RAMP_OUT) * 1.6;
};

/** 10: Hund springt durch den Fischstand, Speed Ramp mit schwebenden Fischen */
export const Shot10Fischstand: React.FC = () => {
  const f = useCurrentFrame();
  const t = sceneTime(f);
  const slow = f >= RAMP_IN && f < RAMP_OUT;
  const ground = 980;
  const dogX = 160 + t * 100;
  const jump = clamp((t - 5.5) / 7);
  const inAir = jump > 0 && jump < 1;
  const { pose: run } = runPose(Math.floor(t));
  const pose = inAir ? mixPose(LEAP, { ...LEAP, bodyRot: 10 }, jump) : run;
  const dogY = ground - (inAir ? arc(jump) * 110 : 0);
  const z = zoomPunch(f, RAMP_OUT, 1.14, 3);
  const s = shake(f, RAMP_OUT, 11, 6);
  // Fische fliegen ab t = 8 aus der Kiste
  const ft = Math.max(0, t - 8);
  return (
    <Camera
      scale={z * (slow ? 1 + (f - RAMP_IN) * 0.004 : 1)}
      x={s.x}
      y={s.y}
      originX={dogX}
      originY={600}
    >
      <Stage>
        <rect
          x={-200}
          y={-200}
          width={2320}
          height={1480}
          fill={mix(P.night, P.deepBlue, 0.5)}
        />
        <rect
          x={-200}
          y={ground}
          width={2320}
          height={400}
          fill={mix("#8C7A6B", P.night, 0.5)}
        />
        <Stall x={620} ground={ground} w={760} fish seed={4} dark={0.3} />
        {slow ? (
          <HorizontalSpeedlines
            frame={f * 0.15}
            count={30}
            colors={["#2E5584", "#3C6A9A"]}
            speed={60}
            dir={-1}
            seed={4}
            thickness={8}
          />
        ) : null}
        {!slow && f >= RAMP_OUT ? (
          <HorizontalSpeedlines
            frame={f}
            count={50}
            colors={["#fff", "#FFD166"]}
            speed={300}
            dir={-1}
            seed={8}
            thickness={12}
          />
        ) : null}
        {/* Fische und Eiswürfel */}
        {ft > 0
          ? Array.from({ length: 9 }).map((_, i) => {
              const vx = (rand(i * 3.1) - 0.3) * 60;
              const vy = -60 - rand(i * 5.3) * 70;
              const fx = 700 + rand(i * 7.7) * 600 + vx * ft;
              const fy = ground - 230 + vy * ft + 22 * ft * ft;
              return (
                <Fish
                  key={i}
                  x={fx}
                  y={fy}
                  scale={1.2 + rand(i) * 0.6}
                  rot={(rand(i * 2) - 0.5) * 80 + ft * (rand(i * 9) - 0.5) * 90}
                  bend={Math.sin(ft * 3 + i)}
                  kind={(i % 3) as 0 | 1 | 2}
                />
              );
            })
          : null}
        {ft > 0
          ? Array.from({ length: 12 }).map((_, i) => {
              const fx = 760 + rand(i * 4.4) * 500 + (rand(i) - 0.5) * 80 * ft;
              const fy =
                ground - 220 - (50 + rand(i * 6.6) * 60) * ft + 20 * ft * ft;
              return (
                <Drop
                  key={i}
                  x={fx}
                  y={fy}
                  size={10 + rand(i) * 8}
                  rot={rand(i) * 360}
                  color="#DDF4FA"
                />
              );
            })
          : null}
        <Podenco pose={pose} x={dogX} y={dogY} scale={1.7} />
        {/* Thekenfront vor dem Hund: er fliegt durch den Stand hindurch */}
        <rect
          x={610}
          y={ground - 150}
          width={780}
          height={150}
          fill={mix("#7A5238", P.night, 0.4)}
        />
        <rect
          x={610}
          y={ground - 150}
          width={780}
          height={10}
          fill={P.warmYellow}
          opacity={0.6}
        />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={630 + i * 190}
            y={ground - 125}
            width={170}
            height={110}
            fill={mix("#5E3F2C", P.night, 0.4)}
          />
        ))}
        {slow ? (
          <SparkleField
            frame={f}
            count={10}
            x={dogX - 300}
            y={dogY - 500}
            w={700}
            h={500}
            size={50}
            seed={5}
            period={16}
          />
        ) : null}
      </Stage>
    </Camera>
  );
};
