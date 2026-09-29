import React from "react";
import { AbsoluteFill } from "remotion";
import { BigEye } from "../characters/BigEye";
import { Fish, Pigeon } from "../characters/Critters";
import { Hat } from "../characters/Hat";
import { PodencoChibi } from "../characters/PodencoChibi";
import { PodencoFace } from "../characters/PodencoFace";
import { PodencoFront } from "../characters/PodencoFront";
import { Postbote } from "../characters/Postbote";
import { P } from "../lib/palette";

export const CastSheet: React.FC = () => (
  <AbsoluteFill
    style={{ background: `linear-gradient(${P.deepBlue}, ${P.night})` }}
  >
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <PodencoFace x={160} y={260} scale={0.8} earR={70} />
      <PodencoFace
        x={400}
        y={260}
        scale={0.8}
        eye={{ open: 0, pupil: 1, glint: 1 }}
        earL={40}
        earR={85}
      />
      <PodencoFace
        x={640}
        y={260}
        scale={0.8}
        tilt={16}
        earR={80}
        eye={{ open: 1, pupil: 0.45, glint: 1.3 }}
      />
      <PodencoFace
        x={880}
        y={260}
        scale={0.8}
        eye={{ open: 1, pupil: 0.9, glint: 1, hard: 1 }}
        hatInMouth
        wet
      />
      <PodencoFront x={1120} y={520} scale={0.8} run={0.25} />
      <PodencoFront
        x={1360}
        y={520}
        scale={0.8}
        sit
        mouth={0.5}
        blush={0.8}
        hatInMouth={false}
        earR={60}
      />
      <PodencoChibi
        x={1640}
        y={520}
        scale={0.9}
        earR={60}
        eye={{ open: 0, pupil: 1, glint: 1 }}
        mouth={0.6}
      />
      <Postbote x={160} y={1040} scale={0.8} run={0.25} />
      <Postbote
        x={420}
        y={1040}
        scale={0.8}
        hat={false}
        expression="shock"
        sweat={0.8}
      />
      <Postbote x={680} y={1040} scale={0.8} expression="cry" frame={10} />
      <Postbote
        x={940}
        y={1040}
        scale={0.8}
        expression="soggy"
        wet
        frame={5}
        sweat={1}
      />
      <Hat x={1120} y={700} scale={1.2} />
      <Hat x={1280} y={700} scale={1.2} spin={140} rot={30} />
      <Pigeon x={1150} y={880} flap={0.8} />
      <Pigeon x={1330} y={900} flap={-0.6} />
      <Fish x={1150} y={1000} kind={0} />
      <Fish x={1330} y={1000} kind={1} bend={0.8} />
      <g transform="translate(1680 860) scale(0.22)">
        <BigEye open={1} pupil={0.4} glint={1} flash={0.6} />
      </g>
    </svg>
  </AbsoluteFill>
);
