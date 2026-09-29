import React from "react";
import { AbsoluteFill } from "remotion";
import { Podenco } from "../characters/Podenco";
import { grounded } from "../characters/Podenco";
import {
  runPose,
  CROUCH,
  LEAP,
  SIT,
  STAND,
  swimPose,
} from "../characters/podencoPoses";
import { P } from "../lib/palette";

// Arbeitsblatt zum Prüfen der Figuren (nicht Teil des Clips)
export const CharacterSheet: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${P.deepBlue}, ${P.night})` }}
    >
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <line x1={0} x2={1920} y1={440} y2={440} stroke="#ffffff33" />
        <line x1={0} x2={1920} y1={900} y2={900} stroke="#ffffff33" />
        <Podenco pose={grounded(STAND)} x={240} y={440} scale={1.3} />
        <Podenco pose={grounded(CROUCH)} x={700} y={440} scale={1.3} />
        <Podenco pose={LEAP} x={1180} y={360} scale={1.3} />
        <Podenco pose={grounded(SIT)} x={1640} y={440} scale={1.3} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Podenco
            key={i}
            pose={runPose(i).pose}
            x={170 + i * 330}
            y={900}
            scale={0.8}
          />
        ))}
        <Podenco pose={swimPose(3)} x={1700} y={680} scale={0.6} hatInMouth />
      </svg>
    </AbsoluteFill>
  );
};
