import React from "react";
import { useCurrentFrame } from "remotion";
import { BigEye } from "../characters/BigEye";
import { range } from "../lib/anim";
import { Stage } from "../lib/Stage";
import { Camera } from "../effects/Camera";
import { WhiteFlash } from "../effects/WhiteFlash";

/** 5: Smash Cut mit Weißblitz: Extreme Close-up, Auge öffnet sich, Pupille verengt sich, Glanzpunkt blitzt */
export const Shot05Auge: React.FC = () => {
  const f = useCurrentFrame();
  const open = range(f, 2, 4, 0, 1);
  const pupil = range(f, 5, 7, 1, 0.34);
  const flash = f >= 8 ? Math.sin(range(f, 8, 12, 0, Math.PI)) : 0;
  const zoom = range(f, 2, 12, 1.0, 1.08);
  return (
    <>
      <Camera scale={zoom}>
        <Stage>
          <g transform="translate(960 560) scale(1.5)">
            <BigEye
              open={open}
              pupil={pupil}
              glint={f >= 8 ? 1.25 : 1}
              flash={flash}
            />
          </g>
        </Stage>
      </Camera>
      <WhiteFlash frame={f} at={0} frames={2} />
    </>
  );
};
