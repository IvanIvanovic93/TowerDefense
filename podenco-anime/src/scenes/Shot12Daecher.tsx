import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco } from "../characters/Podenco";
import { LEAP, runPose } from "../characters/podencoPoses";
import { arc } from "../lib/anim";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { RadialSpeedlines } from "../effects/Speedlines";
import { Cloud, SkyGradient } from "../sets/Sky";

const SPEED = 40;
const PERIOD = 20;
const DOG_X = 860;
const SIL = P.night;

/** 12: Sprünge über Dächer, Silhouette vor der Sonne, radiale Speedlines */
export const Shot12Daecher: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = f * SPEED;
  const phase = f % PERIOD;
  const air = phase >= 8;
  const jt = (phase - 8) / (PERIOD - 8);
  const { pose } = runPose(f);
  const dogY = 820 - (air ? arc(jt) * 230 : 0);
  // Dachsegmente so gelegt, dass die Lücken genau unter den Sprüngen liegen
  const seg = SPEED * PERIOD;
  const roofs = Array.from({ length: 6 }).map((_, i) => {
    const k = Math.floor(scroll / seg) - 1 + i;
    const x0 = DOG_X + k * seg - 150 - scroll;
    const w = 600;
    return { x0, w, k };
  });
  return (
    <Stage>
      <SkyGradient sunX={980} sunY={520} sunR={200} glow={1.6} />
      <Cloud x={300} y={300} scale={1.3} seed={21} sun={[1, 0.3]} />
      <Cloud x={1650} y={260} scale={1.5} seed={22} sun={[-1, 0.4]} />
      <RadialSpeedlines
        frame={f}
        cx={980}
        cy={520}
        count={60}
        inner={300}
        color="#FFF6D8"
        opacity={0.55}
      />
      {/* Hintere Dachlandschaft */}
      <path
        d={`M -100,900 ${Array.from({ length: 14 })
          .map(
            (_, i) =>
              `L ${i * 160 - ((scroll * 0.4) % 160)},${880 - (i % 3) * 40} L ${i * 160 + 80 - ((scroll * 0.4) % 160)},${840 - (i % 2) * 60}`,
          )
          .join(" ")} L 2100,900 L 2100,1100 L -100,1100 Z`}
        fill="#4A3050"
      />
      {roofs.map(({ x0, w, k }) => (
        <g key={k} fill={SIL}>
          <path
            d={`M ${x0},830 L ${x0 + w * 0.5},770 L ${x0 + w},830 L ${x0 + w},1100 L ${x0},1100 Z`}
          />
          <rect x={x0 + w * 0.7} y={740} width={36} height={70} />
          <path
            d={`M ${x0},830 L ${x0 + w * 0.5},770`}
            stroke={P.sunOrange}
            strokeWidth={5}
          />
        </g>
      ))}
      <Hat
        x={DOG_X + 420 + Math.sin(f * 0.2) * 40}
        y={560 + Math.sin(f * 0.3) * 60}
        scale={1.3}
        rot={f * 20}
        spin={f * 25}
        silhouette={SIL}
      />
      <Podenco
        pose={air ? { ...LEAP, earN: -70 + Math.sin(f) * 8 } : pose}
        x={DOG_X}
        y={air ? dogY : 780}
        scale={1.25}
        silhouette={SIL}
      />
    </Stage>
  );
};
