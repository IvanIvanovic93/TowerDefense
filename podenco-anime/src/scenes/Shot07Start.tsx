import React from "react";
import { useCurrentFrame } from "remotion";
import { grounded, Podenco } from "../characters/Podenco";
import { CROUCH } from "../characters/podencoPoses";
import { onTwos, range } from "../lib/anim";
import { Stage } from "../lib/Stage";
import { Camera } from "../effects/Camera";
import { DustCloud } from "../effects/Dust";
import { PaintGrain } from "../sets/Sky";
import { LowAngleSet } from "../sets/LowAngle";

/** 7: Froschperspektive, Hund in geduckter Startpose, Staub wirbelt, Dutch Angle */
export const Shot07Start: React.FC = () => {
  const f = useCurrentFrame();
  const f2 = onTwos(f);
  const rot = range(f, 0, 30, -2, -9);
  const zoom = range(f, 0, 30, 1.02, 1.12);
  const tremble = (f2 % 4 === 0 ? 1 : -1) * 1.5;
  const pose = grounded({
    ...CROUCH,
    earN: -4 + (f2 % 6 === 0 ? -3 : 0),
    earF: -38,
    tail: [-70 + Math.sin(f2 * 0.8) * 6, -80, -90],
    eye: { open: 1, pupil: 0.55, glint: 1.1, hard: range(f, 0, 20, 0.5, 1) },
  });
  const dust = [
    { x: 640, s: 150, off: 0, dr: -140 },
    { x: 1260, s: 130, off: 7, dr: 120 },
    { x: 820, s: 110, off: 13, dr: -90 },
    { x: 1440, s: 120, off: 4, dr: 160 },
    { x: 520, s: 170, off: 18, dr: -60 },
  ];
  return (
    <Camera rot={rot} scale={zoom} originY={760}>
      <Stage>
        <LowAngleSet ground={930} />
        {dust.map((d, i) => (
          <DustCloud
            key={`b${i}`}
            x={d.x}
            y={935}
            t={((f + d.off) % 20) / 20}
            size={d.s}
            seed={i * 3 + 1}
            drift={d.dr}
          />
        ))}
        <Podenco
          pose={pose}
          x={960 + tremble}
          y={935}
          scale={2.4}
          light={[-0.4, -0.9]}
        />
        {dust.slice(0, 3).map((d, i) => (
          <DustCloud
            key={`f${i}`}
            x={d.x + 200}
            y={975}
            t={((f + d.off + 10) % 22) / 22}
            size={d.s * 1.2}
            seed={i * 5 + 2}
            drift={d.dr * 1.4}
          />
        ))}
        <PaintGrain opacity={0.1} />
      </Stage>
    </Camera>
  );
};
