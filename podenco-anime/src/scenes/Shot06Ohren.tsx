import React from "react";
import { useCurrentFrame } from "remotion";
import { PodencoFace } from "../characters/PodencoFace";
import { range } from "../lib/anim";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera, shake } from "../effects/Camera";
import { ImpactFrame } from "../effects/ImpactFrame";
import { RadialSpeedlines } from "../effects/Speedlines";

/** 6: Beide Ohren schnellen hoch, Impact-Frame, Screen Shake */
export const Shot06Ohren: React.FC = () => {
  const f = useCurrentFrame();
  // Ohren: entspannt (asymmetrisch weggekippt) -> in 2 Frames senkrecht mit Überschwingen
  const earL = f < 2 ? 38 : f === 2 ? -10 : f === 3 ? 4 : 0;
  const earR = f < 2 ? 84 : f === 2 ? -14 : f === 3 ? 6 : 0;
  const s = shake(f, 2, 12, 6);
  const scale = f < 2 ? 1.9 : range(f, 2, 5, 2.05, 1.95);
  return (
    <ImpactFrame frame={f} at={2} frames={3} threshold={1.05} cy={380}>
      <Camera x={s.x} y={s.y}>
        <Stage bg={P.night}>
          <rect
            x={-100}
            y={-100}
            width={2120}
            height={1280}
            fill={P.deepBlue}
          />
          <RadialSpeedlines
            frame={f}
            cx={960}
            cy={420}
            count={80}
            inner={380}
            color={f < 2 ? "#2E5584" : "#DCE9F5"}
          />
          <PodencoFace
            x={960}
            y={640}
            scale={scale}
            earL={earL}
            earR={earR}
            eye={{ open: 1, pupil: 0.4, glint: 1.1, hard: 0.3 }}
          />
        </Stage>
      </Camera>
    </ImpactFrame>
  );
};
