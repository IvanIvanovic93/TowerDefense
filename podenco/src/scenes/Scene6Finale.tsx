import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Hat, HatShape } from "../characters/Hat";
import { Podenco, PodencoPose } from "../characters/Podenco";
import { blend, EAR_FLOP, EAR_UP, EAR_UP_FAR, earFlopAnim, earPop, run, SIT, STAND } from "../characters/podencoPoses";
import { Postbote, POSTBOTE_STAND } from "../characters/Postbote";
import { Ink } from "../effects/Ink";
import { ShakeDrops } from "../effects/Splash";
import { XeroShape, BgLine } from "../effects/Wash";
import { C } from "../lib/palette";
import { ease, easeOut, lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";
import { Cobbles, Window } from "./sets/parts";

const GROUND = 900;
const ARRIVE = 22;
const DROP = 30;
const SIT_T = 36;
const POP = 48;
const FLOP = 58;
const SHAKE = 66;
const SHAKE_END = 88;
export const FREEZE = 92;
const DOG_X = 1180;
const HAT_X = 840;

/** Szene 6 (780-900): Hut abgeben, stolz sitzen, schütteln, Postbote nass, Standbild. */
export const Scene6Finale: React.FC = () => {
  const f = useCurrentFrame();
  // Standbild: ab FREEZE bleibt alles stehen
  const t = onTwos(Math.min(f, FREEZE));

  let pose: PodencoPose;
  let x = DOG_X;
  let shake = 0;
  if (t < ARRIVE) {
    pose = run(Math.floor(t / 2));
    x = lerpC(t, [0, ARRIVE], [2150, DOG_X], (v) => 1 - (1 - v) * (1 - v));
  } else if (t < SIT_T) {
    // Kopf runter, Hut ablegen, Kopf wieder hoch
    const down = t < DROP ? lerpC(t, [ARRIVE, DROP], [0, 1], ease) : lerpC(t, [DROP, SIT_T], [1, 0], ease);
    pose = { ...STAND, neck: 48 * down, head: 24 * down, mouth: t < DROP ? 0.3 : 0 };
  } else {
    const k = lerpC(t, [SIT_T, SIT_T + 8], [0, 1], easeOut);
    pose = blend(STAND, SIT, k);
    pose.tilt = lerpC(t, [SIT_T + 6, SIT_T + 14], [0, -16], ease);
    pose.eye = t > 40 && t < 44 ? 0.1 : 1;
    pose.earNear = t < POP ? EAR_UP : earPop(EAR_UP, t - POP, EAR_UP);
    pose.earFar = t < POP ? EAR_FLOP : t < FLOP ? earPop(EAR_UP_FAR, t - POP, EAR_FLOP) : earFlopAnim(EAR_UP_FAR, EAR_FLOP, t - FLOP);
    if (t >= SHAKE && t < SHAKE_END) {
      const s = ((t - SHAKE) / 2) % 2 === 0 ? 1 : -1;
      shake = 14 * s;
      pose.tilt = 0;
      pose.head = pose.head + 22 * s;
      pose.eye = 0;
      pose.earNear = { rot: -40 + 70 * s, sx: 1, sy: 0.9, fold: -30 * s };
      pose.earFar = { rot: -30 - 70 * s, sx: 0.9, sy: 0.9, fold: 40 * s };
      pose.tail = 10 + 30 * s;
    } else if (t >= SHAKE_END) {
      pose.tilt = -12;
      pose.earNear = EAR_UP;
      pose.earFar = EAR_FLOP;
      pose.mouth = 0.3;
    }
  }

  const pb = {
    ...POSTBOTE_STAND,
    hatOn: false,
    miene: t >= SHAKE + 4 ? ("ekel" as const) : t >= DROP ? ("freude" as const) : ("neutral" as const),
    wet: lerpC(t, [SHAKE + 6, SHAKE + 12], [0, 1]),
    lean: t >= SHAKE + 4 ? -7 : 0,
    armNear: t >= SHAKE + 4 ? 60 : 4,
    blink: t > 12 && t < 16,
  };

  const holding =
    t < DROP ? (
      <g transform="translate(4 -2) rotate(-102) scale(0.72) translate(-70 2)">
        <HatShape wet />
      </g>
    ) : undefined;

  // Tropfen, die vor dem Schütteln vom nassen Fell fallen
  const drips = t < SHAKE
    ? [0, 1, 2].map((i) => {
        const lt = (t + i * 7) % 20;
        const dx = x + (random(`dr${i}`) - 0.5) * 160;
        return <Ink key={i} d={`M ${dx} ${GROUND - 120 + lt * 6 - 10} c 5 8 5 14 0 14 c -5 0 -5 -6 0 -14 Z`} fill="#A9C3D2" off={[1, 1]} w={2.5} />;
      })
    : null;

  const fade = interpolate(f, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <rect x={0} y={0} width={1920} height={1080} fill={C.senf} />
        {/* Speicherhaus: links Ocker hinter dem Postboten, rechts dunkel hinter dem Hund */}
        <XeroShape pts={[[-40, 120], [900, 110], [906, 860], [-40, 860]]} fill={C.ocker} seed="lager1" />
        <XeroShape pts={[[880, 90], [1960, 100], [1960, 860], [874, 860]]} fill={C.graublauDunkel} seed="lager2" />
        <XeroShape pts={[[1000, 860], [1004, 380], [1080, 300], [1520, 296], [1600, 376], [1604, 860]]} fill={C.gruenDunkel} seed="tor" />
        <BgLine pts={[[1300, 310], [1302, 856]]} seed="tormitte" closed={false} w={3} />
        <Window x={180} y={260} w={100} h={140} seed="lw1" shutter={C.rost} pane={C.gruenDunkel} />
        <Window x={560} y={250} w={100} h={140} seed="lw2" shutter={C.rost} pane={C.gruenDunkel} />
        <Window x={1720} y={220} w={90} h={130} seed="lw3" shutter={C.ocker} pane={C.gruenDunkel} />
        <XeroShape pts={[[-40, 830], [1960, 826], [1960, 1100], [-40, 1100]]} fill={C.ockerDunkel} seed="boden6" off={[0, 6]} />
        <Cobbles x={-40} y={840} w={2000} h={240} seed="pfl6" opacity={0.4} />
        <Postbote pose={pb} x={470} y={GROUND + 60} scale={1.25} />
        {t >= DROP ? <Hat x={HAT_X} y={GROUND + 40} rot={-6} scale={0.95} wet flip /> : null}
        <Podenco pose={pose} x={x} y={GROUND + 40} scale={1.2} flip holding={holding} shake={shake} />
        {drips}
        <ShakeDrops t={t - SHAKE} x={x} y={GROUND - 160} dir={-1} />
      </svg>
      <AbsoluteFill style={{ background: C.papier, opacity: fade }} />
    </AbsoluteFill>
  );
};
