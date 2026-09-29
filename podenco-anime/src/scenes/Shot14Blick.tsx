import React from "react";
import { useCurrentFrame } from "remotion";
import { PodencoFace } from "../characters/PodencoFace";
import { onTwos, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Sparkle } from "../effects/Sparkles";
import { RadialSpeedlines } from "../effects/Speedlines";
import { PaintGrain } from "../sets/Sky";

/** 14: Close-up, Hund legt kurz den Kopf schief, dann verhärtet sich der Blick, Glanzpunkt blitzt */
export const Shot14Blick: React.FC = () => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  const tilt = g < 12 ? range(g, 0, 6, 0, 17) : range(g, 12, 16, 17, 0);
  // Running Gag: beim Schiefhalten kippt das rechte Ohr weg, beim Entschluss schnellt es hoch
  const earR = g < 14 ? range(g, 2, 6, 10, 88) : range(g, 14, 16, 88, 0);
  const hard = range(g, 14, 18, 0, 1);
  const pupil = g < 14 ? 1.1 : range(g, 14, 18, 1.1, 0.8);
  const glintFlash = f >= 21 ? Math.sin(range(f, 21, 29, 0, Math.PI)) : 0;
  const bg = mix(P.deepBlue, P.night, range(g, 12, 18, 0.2, 0.7));
  return (
    <Stage>
      <rect x={-100} y={-100} width={2120} height={1280} fill={bg} />
      {g >= 14 ? (
        <RadialSpeedlines
          frame={g}
          cx={960}
          cy={500}
          count={50}
          inner={460}
          color="#2E5584"
        />
      ) : null}
      <path
        d="M -100,1080 L 2020,1080 L 2020,900 C 1400,860 600,880 -100,920 Z"
        fill={mix(P.harborGreen, P.night, 0.5)}
      />
      <PodencoFace
        x={960}
        y={560}
        scale={2.05}
        tilt={tilt}
        earL={4}
        earR={earR}
        eye={{
          open: 1,
          pupil,
          glint: 1 + glintFlash * 0.4,
          hard,
          lookX: g < 12 ? 0.3 : 0,
        }}
        neck
      />
      {glintFlash > 0 ? (
        <>
          <Sparkle
            x={960 - 44 * 2.05 + 26}
            y={560 - 16 * 2.05 - 22}
            size={200 * glintFlash}
            rot={f * 8}
            color="#fff"
          />
          <Sparkle
            x={960 + 44 * 2.05 + 26}
            y={560 - 16 * 2.05 - 22}
            size={200 * glintFlash}
            rot={f * 8}
            color="#fff"
          />
        </>
      ) : null}
      <PaintGrain opacity={0.08} />
    </Stage>
  );
};
