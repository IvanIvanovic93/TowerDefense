import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco, PodencoPose } from "../characters/Podenco";
import { blend, CROUCH, EAR_FLOP, EAR_HANG, EAR_UP, EAR_UP_FAR, earFlopAnim, earPop, LIE, LIE_ALERT, run } from "../characters/podencoPoses";
import { Postbote, POSTBOTE_STAND } from "../characters/Postbote";
import { WindLines } from "../effects/WindLines";
import { ease, easeOut, lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";
import { ALLEY_LANDING, ALLEY_STREET_Y, AlleyBack } from "./sets/AlleySet";

const CAM = -300;
const GUST = 44; // Böe setzt ein
const HAT_OFF = 52; // Hut hebt ab
const POP = 56; // Ohren schnellen hoch
const FLOP = 92; // ein Ohr kippt wieder weg
const UP = 104; // Hund steht auf
const GO = 116; // Hund rennt los

/** Szene 2 (120-270): Postbote, Windböe, Hut fliegt, Ohren-Gag, Hund startet. */
export const Scene2Hut: React.FC = () => {
  const f = useCurrentFrame();
  const t = onTwos(f);

  // Postbote läuft von rechts herein (Blick nach links), bleibt nach dem Hutverlust stehen
  const walking = t < 62;
  const pbX = 2350 - Math.min(t, 62) * 8 - (t > 62 ? 0 : 0);
  const pbPose = {
    ...POSTBOTE_STAND,
    walk: walking ? 1 : lerpC(t, [62, 68], [1, 0]),
    step: t / 8,
    hatOn: t < HAT_OFF,
    miene: t >= HAT_OFF + 2 ? ("staunen" as const) : ("neutral" as const),
    grab: lerpC(t, [HAT_OFF + 2, HAT_OFF + 10], [0, 1], easeOut),
    lean: t >= HAT_OFF ? lerpC(t, [HAT_OFF, HAT_OFF + 8], [0, -6]) : 0,
  };
  const pbScale = 1.05;

  // Hut: Start auf dem Kopf, dann Flug nach rechts oben
  const hx0 = pbX - (26 + 2) * pbScale;
  const hy0 = ALLEY_STREET_Y - (318 + 52) * pbScale;
  const ht = Math.max(0, t - HAT_OFF);
  const hatX = hx0 + ht * 7 + ht * ht * 0.1;
  const hatY = hy0 - Math.sin(Math.min(ht, 60) / 20) * 260 + ht * 0.8;
  const hatRot = ht * 13;

  // Hund
  let pose: PodencoPose;
  let dx = ALLEY_LANDING.x;
  let dy = ALLEY_LANDING.y + 2;
  if (t < POP) {
    const breath = (Math.sin(t / 9) + 1) / 2;
    pose = { ...LIE, breath, earNear: EAR_HANG, earFar: { ...EAR_HANG, rot: -128 } };
  } else if (t < UP) {
    const k = lerpC(t, [POP, POP + 4], [0, 1], easeOut);
    const look = lerpC(t, [POP + 4, POP + 20], [0, 1], ease);
    pose = blend(LIE, LIE_ALERT, k);
    pose.head = pose.head - 34 * look; // Kopf dreht sich hoch zum Hut
    pose.neck = pose.neck - 10 * look;
    pose.tilt = t > 76 ? lerpC(t, [76, 86], [0, -14], ease) : 0;
    pose.earNear = earPop(EAR_UP, t - POP, EAR_HANG);
    pose.earFar = t < FLOP ? earPop(EAR_UP_FAR, t - POP, { ...EAR_HANG, rot: -128 }) : earFlopAnim(EAR_UP_FAR, EAR_FLOP, t - FLOP);
    pose.eye = t === POP ? 1.3 : 1;
  } else if (t < GO) {
    const k = lerpC(t, [UP, GO], [0, 1], ease);
    pose = blend({ ...LIE_ALERT, head: -38, earFar: EAR_FLOP }, { ...CROUCH, earFar: EAR_FLOP, earNear: EAR_UP }, k);
    pose.tilt = -14 * (1 - k);
  } else {
    const rt = t - GO;
    pose = run(Math.floor(rt / 2));
    dx = ALLEY_LANDING.x + rt * 14 + rt * rt * 0.35;
    dy = lerpC(rt, [0, 6, 12], [ALLEY_LANDING.y, ALLEY_LANDING.y - 50, ALLEY_STREET_Y - 30], ease);
  }

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <g transform={`translate(${CAM} 0)`}>
          <AlleyBack />
          <Podenco pose={pose} x={dx} y={dy} scale={1.08} />
          <Postbote pose={pbPose} x={pbX} y={ALLEY_STREET_Y} scale={pbScale} flip />
          {t >= HAT_OFF ? <Hat x={hatX} y={hatY} rot={hatRot} scale={pbScale} flip /> : null}
        </g>
        <WindLines t={t - GUST} y={520} dur={34} />
      </svg>
    </AbsoluteFill>
  );
};

