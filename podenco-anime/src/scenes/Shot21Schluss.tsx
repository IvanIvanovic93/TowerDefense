import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PodencoFront } from "../characters/PodencoFront";
import { onTwos, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { SparkleField } from "../effects/Sparkles";
import { HouseRow } from "../sets/Buildings";
import { Water } from "../sets/Harbor";
import { Cloud, PaintGrain, SkyGradient } from "../sets/Sky";

const FREEZE = 28;

/** 21: Normaler Stil: Kopf schief, ein Ohr kippt weg, Glitzer, Freeze Frame, Abblende auf Weiß */
export const Shot21Schluss: React.FC = () => {
  const real = useCurrentFrame();
  // Freeze Frame: ab FREEZE bleibt das Bild stehen
  const f = onTwos(Math.min(real, FREEZE));
  const tilt = range(f, 4, 12, 0, 16);
  const earR = f < 14 ? 0 : f < 16 ? 100 : f < 18 ? 78 : 88;
  const fade = range(real, 32, 58, 0, 1);
  const frozen = real >= FREEZE;
  return (
    <AbsoluteFill>
      <Stage>
        <SkyGradient sunX={1480} sunY={330} sunR={120} glow={1.4} />
        <Cloud x={380} y={260} scale={1.4} seed={41} sun={[1, 0.2]} />
        <HouseRow
          x0={-100}
          x1={2100}
          base={640}
          hMin={120}
          hMax={220}
          wMin={110}
          wMax={170}
          seed={111}
          backlit={0.6}
        />
        <rect
          x={-100}
          y={630}
          width={2120}
          height={30}
          fill={mix("#7A6F7E", P.night, 0.45)}
        />
        <Water y={660} h={600} frame={f} glitterX={1480} />
        <rect
          x={-100}
          y={880}
          width={2120}
          height={300}
          fill={mix("#6E6474", P.night, 0.5)}
        />
        <PodencoFront
          x={960}
          y={1010}
          scale={1.35}
          sit
          tilt={tilt}
          earL={0}
          earR={earR}
          mouth={0.45}
          blush={0.6}
          eye={{ open: 1, pupil: 1.05, glint: 1.3 }}
          tail={Math.sin(f * 0.6)}
        />
        <SparkleField
          frame={f}
          count={22}
          x={500}
          y={80}
          w={920}
          h={800}
          size={70}
          seed={23}
          period={14}
          colors={["#fff", "#FFD166", "#FFF6D8"]}
        />
        <PaintGrain opacity={0.08} />
      </Stage>
      {frozen ? (
        <AbsoluteFill
          style={{ boxShadow: "inset 0 0 180px rgba(255,209,102,0.45)" }}
        />
      ) : null}
      <AbsoluteFill style={{ background: "#fff", opacity: fade }} />
    </AbsoluteFill>
  );
};
