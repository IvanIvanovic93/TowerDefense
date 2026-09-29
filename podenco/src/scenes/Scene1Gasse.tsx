import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Podenco } from "../characters/Podenco";
import { EAR_HANG, LIE } from "../characters/podencoPoses";
import { Zzz } from "../effects/Zzz";
import { ease, lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";
import { ALLEY_LANDING, AlleyBack } from "./sets/AlleySet";

/** Szene 1 (0-120): Hund döst auf der Treppe, Kamera schwenkt von links herein. */
export const Scene1Gasse: React.FC = () => {
  const f = useCurrentFrame();
  const t = onTwos(f);
  // Kamera läuft auf ones, die Figur auf twos
  const cam = lerpC(f, [0, 115], [0, -300], ease);
  const breath = (Math.sin(t / 9) + 1) / 2;
  const pose = {
    ...LIE,
    breath,
    earNear: { ...EAR_HANG, rot: EAR_HANG.rot + breath * 3 },
    earFar: { ...EAR_HANG, rot: -128 - breath * 2 },
    tail: LIE.tail + (t > 70 && t < 84 ? Math.sin((t - 70) / 2) * 6 : 0),
  };
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <g transform={`translate(${cam} 0)`}>
          <AlleyBack />
          <Podenco pose={pose} x={ALLEY_LANDING.x} y={ALLEY_LANDING.y + 2} scale={1.08} />
          <Zzz t={t} x={ALLEY_LANDING.x + 180} y={ALLEY_LANDING.y - 110} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
