import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HatShape } from "../characters/Hat";
import { Podenco } from "../characters/Podenco";
import { EAR_FLOP, EAR_UP, swim } from "../characters/podencoPoses";
import { InkLine } from "../effects/Ink";
import { XeroShape, BgLine } from "../effects/Wash";
import { WaterBody, WaveLine } from "../effects/Waves";
import { C } from "../lib/palette";
import { lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";

const WATER = 640;
const SCALE = 1.35;

/** Szene 5 (660-780): Hund paddelt zurück, nur Kopf und Ohren über Wasser, Hut im Maul. */
export const Scene5Schwimmen: React.FC = () => {
  const f = useCurrentFrame();
  const t = onTwos(f);
  const x = lerpC(t, [0, 120], [1650, 700]);
  const bob = Math.sin(t / 4) * 8;
  const pose = {
    ...swim(Math.floor(t / 3)),
    earNear: { ...EAR_UP, rot: EAR_UP.rot - 10 + Math.sin(t / 4) * 4 },
    earFar: { ...EAR_FLOP, rot: EAR_FLOP.rot + Math.sin(t / 4 + 1) * 8 },
    look: 1,
  };
  // Hut quer im Maul: Schirm zwischen den Zähnen, Krone hängt nach unten
  const held = (
    <g transform="translate(4 -2) rotate(-102) scale(0.72) translate(-70 2)">
      <HatShape wet />
    </g>
  );
  const dogY = WATER + 330 + bob;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        {/* Hintergrund: gegenüberliegende Kaimauer, dunkel */}
        <rect x={0} y={0} width={1920} height={1080} fill={C.ocker} />
        <XeroShape pts={[[-40, 120], [1960, 110], [1960, 700], [-40, 700]]} fill={C.graublauDunkel} seed="kai5" />
        {Array.from({ length: 9 }, (_, i) => (
          <BgLine key={i} pts={[[i * 230 + 40, 120], [i * 230 + 44, 640]]} seed={`f5${i}`} closed={false} w={2.6} />
        ))}
        <BgLine pts={[[-40, 300], [1960, 294]]} seed="f5q1" closed={false} w={2.6} />
        <BgLine pts={[[-40, 470], [1960, 466]]} seed="f5q2" closed={false} w={2.6} />
        {/* Leiter */}
        <BgLine pts={[[300, 110], [304, 660]]} seed="lei1" closed={false} w={4} />
        <BgLine pts={[[380, 110], [384, 660]]} seed="lei2" closed={false} w={4} />
        {[180, 260, 340, 420, 500, 580].map((y, i) => (
          <BgLine key={i} pts={[[302, y], [382, y + 2]]} seed={`spr${i}`} closed={false} w={3} />
        ))}
        {/* Tang-Streifen an der Wasserlinie */}
        <XeroShape pts={[[-40, 600], [1960, 596], [1960, 660], [-40, 660]]} fill={C.gruenDunkel} seed="tang" />
        <Podenco pose={pose} x={x} y={dogY} scale={SCALE} flip holding={held} />
        <WaterBody x0={-100} x1={2020} y={WATER} bottom={1100} t={t} rows={4} opacity={0.92} fill={C.gruenDunkel} />
        {/* Bugwelle hinter dem Kopf */}
        <InkLine d={`M ${x - 150} ${WATER + 4} q 50 -20 110 -8 M ${x + 60} ${WATER - 4} q 80 -10 170 4 M ${x + 90} ${WATER + 10} q 90 -6 200 12`} w={3.6} />
        <WaveLine x0={-100} x1={2020} y={WATER + 14} t={t} amp={9} len={130} speed={4} />
      </svg>
    </AbsoluteFill>
  );
};
