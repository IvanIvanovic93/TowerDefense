import React from "react";
import { useCurrentFrame } from "remotion";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Camera, shakes } from "../effects/Camera";
import { ImpactFrame } from "../effects/ImpactFrame";
import { WaterColumn } from "../effects/Splash";
import { HouseRow } from "../sets/Buildings";
import { Water } from "../sets/Harbor";
import { SkyGradient } from "../sets/Sky";

/** 16: Impact-Frame beim Eintauchen, riesige Wassersäule, Screen Shake */
export const Shot16Eintauchen: React.FC = () => {
  const f = useCurrentFrame();
  const s = shakes(f, [
    [0, 12, 6],
    [6, 7, 5],
  ]);
  return (
    <ImpactFrame frame={f} at={0} frames={3} threshold={1.25} cy={600}>
      <Camera x={s.x} y={s.y} scale={1.04}>
        <Stage>
          <SkyGradient sunX={1500} sunY={380} sunR={120} glow={1.3} />
          <HouseRow
            x0={-100}
            x1={2100}
            base={700}
            hMin={90}
            hMax={170}
            wMin={90}
            wMax={150}
            seed={81}
            backlit={0.5}
            haze={0.1}
          />
          <rect
            x={-100}
            y={690}
            width={2120}
            height={30}
            fill={mix("#7A6F7E", P.night, 0.4)}
          />
          <Water y={720} h={500} frame={f} glitterX={1500} />
          <WaterColumn
            x={960}
            y={900}
            t={0.08 + f / 16}
            height={1000}
            width={420}
          />
        </Stage>
      </Camera>
    </ImpactFrame>
  );
};
