import React from "react";
import { useCurrentFrame } from "remotion";
import { grounded, Podenco } from "../characters/Podenco";
import { CROUCH, runPose } from "../characters/podencoPoses";
import { Stage } from "../lib/Stage";
import { Camera, shake, zoomPunch } from "../effects/Camera";
import { DustCloud } from "../effects/Dust";
import { HorizontalSpeedlines, RadialSpeedlines } from "../effects/Speedlines";
import { WhiteFlash } from "../effects/WhiteFlash";
import { LowAngleSet } from "../sets/LowAngle";

/** 8: Weißblitz, Hund schießt los, Zoom Punch */
export const Shot08Los: React.FC = () => {
  const f = useCurrentFrame();
  const go = f >= 2;
  const { pose } = runPose(go ? f - 2 : 0);
  const x = go ? 960 + Math.pow(f - 2, 1.4) * 105 : 960;
  const z = zoomPunch(f, 2, 1.15, 3);
  const s = shake(f, 2, 9, 5);
  return (
    <>
      <Camera rot={-9} scale={1.12 * z} originY={760} x={s.x} y={s.y}>
        <Stage>
          <LowAngleSet ground={930} scroll={go ? (f - 2) * 40 : 0} />
          {go ? (
            <RadialSpeedlines
              frame={f}
              cx={900}
              cy={760}
              count={70}
              inner={300}
              color="#FFF6D8"
              opacity={0.85}
            />
          ) : null}
          {go ? (
            <HorizontalSpeedlines
              frame={f}
              count={20}
              y0={500}
              y1={1000}
              speed={260}
              dir={-1}
              seed={2}
              thickness={10}
              colors={["#fff"]}
            />
          ) : null}
          {go ? (
            <DustCloud
              x={820}
              y={935}
              t={Math.min(0.95, (f - 2) / 12 + 0.1)}
              size={380}
              seed={7}
              drift={-320}
            />
          ) : null}
          <Podenco
            pose={go ? pose : grounded(CROUCH)}
            x={x}
            y={935}
            scale={2.4}
            light={[-0.4, -0.9]}
          />
          {go ? (
            <DustCloud
              x={1100}
              y={960}
              t={Math.min(0.95, (f - 2) / 10 + 0.05)}
              size={260}
              seed={3}
              drift={-420}
            />
          ) : null}
        </Stage>
      </Camera>
      <WhiteFlash frame={f} at={0} frames={2} />
    </>
  );
};
