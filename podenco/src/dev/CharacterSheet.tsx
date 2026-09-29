import React from "react";
import { AbsoluteFill } from "remotion";
import { BoilDefs } from "../effects/BoilDefs";
import { PaperGrain } from "../effects/PaperGrain";
import { Podenco } from "../characters/Podenco";
import { LIE, SIT, STAND, JUMP, CROUCH, run } from "../characters/podencoPoses";
import { C } from "../lib/palette";
import { Postbote, POSTBOTE_STAND } from "../characters/Postbote";
import { Hat, HatShape } from "../characters/Hat";

/** Figurenblatt zum Prüfen der Proportionen (nicht Teil des Films). */
export const DogSheet: React.FC = () => (
  <AbsoluteFill style={{ background: C.graublau }}>
    <BoilDefs />
    <svg width={1920} height={1080}>
      <rect x={0} y={520} width={1920} height={560} fill={C.gruen} />
      <Podenco pose={STAND} x={300} y={480} scale={1.15} />
      <Podenco pose={{ ...STAND, tilt: -16, earNear: { rot: -4, sx: 1, sy: 1, fold: 0 }, earFar: { rot: 2, sx: 1, sy: 1, fold: 0 } }} x={780} y={480} scale={1.15} />
      <Podenco pose={SIT} x={1250} y={480} scale={1.15} />
      <Podenco pose={JUMP} x={1680} y={440} scale={1.0} />
      <Podenco pose={LIE} x={300} y={1000} scale={1.15} />
      <Podenco pose={run(0)} x={760} y={1000} scale={1.0} />
      <Podenco pose={run(4)} x={1180} y={1000} scale={1.0} />
      <Podenco pose={CROUCH} x={1620} y={1000} scale={1.0} />
    </svg>
    <PaperGrain />
  </AbsoluteFill>
);

export const PostSheet: React.FC = () => (
  <AbsoluteFill style={{ background: C.ocker }}>
    <BoilDefs />
    <svg width={1920} height={1080}>
      <rect x={0} y={640} width={1920} height={440} fill={C.gruen} />
      <Postbote pose={POSTBOTE_STAND} x={250} y={640} scale={1.2} />
      <Postbote pose={{ ...POSTBOTE_STAND, walk: 1, step: 0.5 }} x={650} y={640} scale={1.2} />
      <Postbote pose={{ ...POSTBOTE_STAND, hatOn: false, miene: "staunen", grab: 1 }} x={1050} y={640} scale={1.2} />
      <Postbote pose={{ ...POSTBOTE_STAND, hatOn: false, miene: "ekel", wet: 1 }} x={1450} y={640} scale={1.2} />
      <Hat x={1780} y={400} rot={-20} scale={1.3} />
      <Podenco pose={SIT} x={300} y={1040} scale={0.9} />
      <Podenco pose={{ ...SIT, tilt: -18 }} x={700} y={1040} scale={0.9} holding={<HatShape />} />
      <Podenco pose={LIE} x={1150} y={1040} scale={0.9} />
      <Podenco pose={STAND} x={1600} y={1040} scale={0.9} />
    </svg>
    <PaperGrain />
  </AbsoluteFill>
);
