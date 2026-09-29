import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco, PodencoPose } from "../characters/Podenco";
import {
  blend,
  CROUCH,
  EAR_FLOP,
  EAR_UP,
  EAR_UP_FAR,
  earFlopAnim,
  earPop,
  JUMP,
  run,
  STAND,
} from "../characters/podencoPoses";
import { Splash } from "../effects/Splash";
import { WaterBody } from "../effects/Waves";
import { ease, easeOut, lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";
import { HarborBack, Quay, QUAY_EDGE, QUAY_Y, WATER_Y } from "./sets/HarborSet";

const STOP = 36;
const TILT = 50;
const POP2 = 70;
const FLOP2 = 84;
const CROUCH_T = 96;
const JUMP_T = 110;
const DIVE = 146;
const HAT_LAND = 34;
const DOG_SCALE = 0.95;
const STOP_X = 800;
const LAND_X = 1450;

/** Szene 4 (480-660): Hafenkante, Hut landet im Wasser, Kopfschief, Sprung. */
export const Scene4Hafen: React.FC = () => {
  const f = useCurrentFrame();
  const t = onTwos(f);
  const cam = lerpC(f, [96, 150], [0, -140], ease);

  // Hut: fällt von oben links ins Wasser, schaukelt dann
  const hatX = lerpC(t, [0, HAT_LAND], [900, LAND_X + 40], easeOut);
  const hatY =
    t < HAT_LAND
      ? lerpC(t, [0, HAT_LAND], [120, WATER_Y - 4]) + Math.sin(t / 3) * 20
      : WATER_Y - 2 + Math.sin(t / 5) * 6;
  const hatRot = t < HAT_LAND ? Math.sin(t / 3) * 40 : Math.sin(t / 6) * 8;

  let pose: PodencoPose;
  let x = STOP_X;
  let y = QUAY_Y;
  if (t < STOP) {
    pose = run(Math.floor(t / 2));
    x = lerpC(t, [0, STOP], [-260, STOP_X], (v) => 1 - (1 - v) * (1 - v));
  } else if (t < TILT) {
    // abbremsen: nach hinten lehnen, Vorderbeine stemmen
    const k = lerpC(t, [STOP, STOP + 8], [0, 1], easeOut);
    pose = blend(
      { ...STAND, pitch: -10, frontNear: [40, 36, 40], frontFar: [34, 30, 36] },
      STAND,
      k,
    );
    x = STOP_X + (1 - k) * 30;
  } else if (t < CROUCH_T) {
    pose = { ...STAND, look: 1 };
    // Kopf schief legen, einmal hin und her
    pose.tilt =
      t < 66
        ? lerpC(t, [TILT, TILT + 6], [0, -20], ease)
        : lerpC(t, [66, 74], [-20, 14], ease);
    pose.head = 16;
    pose.earNear = EAR_UP;
    pose.earFar =
      t < POP2
        ? EAR_FLOP
        : t < FLOP2
          ? earPop(EAR_UP_FAR, t - POP2, EAR_FLOP)
          : earFlopAnim(EAR_UP_FAR, EAR_FLOP, t - FLOP2);
    pose.tail = STAND.tail + Math.sin(t / 2) * 10;
  } else if (t < JUMP_T) {
    const k = lerpC(t, [CROUCH_T, CROUCH_T + 8], [0, 1], ease);
    pose = blend(STAND, CROUCH, k);
    pose.earFar = EAR_FLOP;
  } else {
    const k = (t - JUMP_T) / (DIVE - JUMP_T);
    pose = blend(
      JUMP,
      { ...JUMP, pitch: 40, neck: 40 },
      Math.max(0, Math.min(1, (k - 0.3) / 0.7)),
    );
    x = STOP_X + (LAND_X - STOP_X) * k;
    y =
      QUAY_Y +
      (WATER_Y + 60 - QUAY_Y) * k -
      Math.sin(Math.PI * Math.min(k, 1)) * 420;
  }
  const showDog = t < DIVE;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <g transform={`translate(${cam} 0)`}>
          <HarborBack />
          {showDog ? (
            <Podenco pose={pose} x={x} y={y} scale={DOG_SCALE} />
          ) : null}
          <Hat x={hatX} y={hatY} rot={hatRot} scale={1} />
          <WaterBody
            x0={QUAY_EDGE}
            x1={2300}
            y={WATER_Y}
            bottom={1200}
            t={t}
            rows={3}
          />
          <Quay />
          <Splash
            t={t - HAT_LAND}
            x={LAND_X + 40}
            y={WATER_Y}
            size={0.35}
            seed="hut"
          />
          <Splash
            t={t - DIVE + 2}
            x={LAND_X + 20}
            y={WATER_Y}
            size={1.1}
            seed="hund"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
