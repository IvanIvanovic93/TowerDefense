import React from "react";
import { useCurrentFrame } from "remotion";
import { Pigeon } from "../characters/Critters";
import { Podenco } from "../characters/Podenco";
import { runPose } from "../characters/podencoPoses";
import { rand, range } from "../lib/anim";
import { Stage } from "../lib/Stage";
import { Camera, shake } from "../effects/Camera";
import { DustCloud } from "../effects/Dust";
import { HorizontalSpeedlines } from "../effects/Speedlines";
import { LowAngleSet } from "../sets/LowAngle";

/** 11: Tauben explodieren nach oben auf, Froschperspektive, Hund rast durch */
export const Shot11Tauben: React.FC = () => {
  const f = useCurrentFrame();
  const ground = 1000;
  const dogX = range(f, 6, 24, -700, 2700);
  const burst = Math.max(0, f - 10);
  const s = shake(f, 14, 10, 6);
  const { pose } = runPose(f);
  return (
    <Camera rot={6} scale={1.1} x={s.x} y={s.y}>
      <Stage>
        <LowAngleSet ground={ground} sunX={400} />
        {Array.from({ length: 16 }).map((_, i) => {
          const px = 300 + rand(i * 3.3) * 1400;
          const flying = burst > rand(i) * 3;
          const bt = Math.max(0, burst - rand(i) * 3);
          const vx = (rand(i * 7.1) - 0.5) * 70;
          const vy = -40 - rand(i * 2.2) * 40;
          const x = px + vx * bt;
          const y = ground - 30 + vy * bt - bt * bt * 0.6;
          const flap = flying ? Math.sin((f + i) * 1.6) : -0.2;
          const sc = 0.9 + rand(i * 5) * 0.8 + (flying ? bt * 0.08 : 0);
          return (
            <Pigeon
              key={i}
              x={x}
              y={y}
              scale={sc}
              flap={flap}
              rot={flying ? -30 + vx * 0.3 : 0}
              flip={vx < 0}
            />
          );
        })}
        {f > 6 ? (
          <HorizontalSpeedlines
            frame={f}
            count={24}
            y0={500}
            y1={1060}
            colors={["#fff", "#FFD166"]}
            speed={320}
            dir={-1}
            seed={12}
            thickness={10}
            opacity={range(f, 6, 10, 0, 1)}
          />
        ) : null}
        <Podenco
          pose={pose}
          x={dogX}
          y={ground + 10}
          scale={3.2}
          light={[-0.3, -0.95]}
        />
        {[0, 1, 2].map((i) => (
          <DustCloud
            key={i}
            x={dogX - 500 - i * 250}
            y={ground + 20}
            t={range(f, 8 + i * 3, 30 + i * 3, 0.01, 0.99)}
            size={300}
            seed={i + 40}
            drift={-200}
          />
        ))}
        {/* Federn */}
        {burst > 0
          ? Array.from({ length: 14 }).map((_, i) => {
              const fx =
                400 + rand(i * 9.9) * 1200 + Math.sin(burst * 0.3 + i) * 40;
              const fy =
                ground -
                60 -
                rand(i * 4.4) * 200 -
                burst * (10 + rand(i) * 12) +
                burst * burst * 0.3;
              return (
                <ellipse
                  key={i}
                  cx={fx}
                  cy={fy}
                  rx={16}
                  ry={5}
                  fill="#E6EEF7"
                  stroke="#1A1A1A"
                  strokeWidth={2}
                  transform={`rotate(${burst * 20 + i * 40} ${fx} ${fy})`}
                />
              );
            })
          : null}
      </Stage>
    </Camera>
  );
};
