import { lerp } from "../lib/anim";
import { EyeState, EYE_DEFAULT } from "./DogEye";
import { grounded } from "./Podenco";

export type Leg = [number, number, number];

/**
 * Winkel in Grad. Beine: 0 = senkrecht nach unten, positiv = nach vorn (Blickrichtung).
 * Ohren: 0 = senkrecht, negativ = nach hinten/seitlich weggekippt.
 */
export type DogPose = {
  bodyRot: number;
  bodyY: number;
  stretch: number;
  fn: Leg;
  ff: Leg;
  hn: Leg;
  hf: Leg;
  neck: number;
  head: number;
  earN: number;
  earF: number;
  tail: Leg;
  eye: EyeState;
  mouth: number;
};

export const STAND: DogPose = {
  bodyRot: 0,
  bodyY: 0,
  stretch: 1,
  fn: [-8, 4, 14],
  ff: [2, -2, 12],
  hn: [28, -38, 4],
  hf: [20, -30, 8],
  neck: 32,
  head: 6,
  earN: 0,
  earF: -4,
  tail: [-40, -20, 10],
  eye: EYE_DEFAULT,
  mouth: 0,
};

/** Tief geduckte Startpose: Brust knapp über dem Boden, Hinterbeine gespannt */
export const CROUCH: DogPose = {
  ...STAND,
  bodyRot: 6,
  bodyY: 90,
  fn: [-40, 92, 96],
  ff: [-30, 88, 94],
  hn: [75, -95, 30],
  hf: [68, -100, 26],
  neck: 70,
  head: 4,
  earN: -8,
  earF: -16,
  tail: [-70, -80, -90],
  eye: { ...EYE_DEFAULT, hard: 0.8 },
};

/** Sprung: voll gestreckt in der Luft */
export const LEAP: DogPose = {
  ...STAND,
  bodyRot: -10,
  bodyY: 10,
  stretch: 1.08,
  fn: [78, 80, 84],
  ff: [68, 72, 78],
  hn: [-50, -75, -90],
  hf: [-60, -82, -96],
  neck: 70,
  head: 4,
  earN: -62,
  earF: -70,
  tail: [-95, -100, -110],
  eye: { ...EYE_DEFAULT, hard: 0.6 },
};

/** Sitzen, stolz aufgerichtet */
export const SIT: DogPose = {
  ...STAND,
  bodyRot: -30,
  bodyY: 56,
  fn: [-30, -32, -10],
  ff: [-24, -28, -6],
  hn: [45, -110, 58],
  hf: [40, -112, 62],
  neck: 10,
  head: -6,
  tail: [30, 70, 90],
};

/** Schwimmen: Kopf hoch, Beine paddeln unter Wasser */
export const swimPose = (t: number): DogPose => {
  const s = Math.sin(t * 0.55);
  const c = Math.cos(t * 0.55);
  return {
    ...STAND,
    bodyRot: 14,
    bodyY: 0,
    fn: [60 + s * 30, 20 - s * 40, 30],
    ff: [60 - s * 30, 20 + s * 40, 30],
    hn: [-10 + c * 25, -30, -40],
    hf: [-10 - c * 25, -30, -40],
    neck: 28,
    head: -8,
    earN: -6,
    earF: -40,
    tail: [-80, -90, -90],
    eye: { ...EYE_DEFAULT, hard: 0.7 },
    mouth: 0,
  };
};

/**
 * Laufzyklus in 6 Frames, gestreckter Doppel-Schwebe-Galopp wie beim Windhund.
 * 0: volle Streckung, 1: Vorderpfote setzt auf, 2: zweite Vorderpfote,
 * 3: gesammelt (Beine gekreuzt unter dem Körper), 4: Hinterpfoten landen, 5: Abstoß.
 */
const RUN_BASE: DogPose = {
  ...STAND,
  neck: 72,
  head: 10,
  earN: -62,
  earF: -72,
  tail: [-100, -104, -96],
  eye: { ...EYE_DEFAULT, hard: 0.6 },
};

export const RUN: DogPose[] = [
  // 0 volle Streckung (Schwebe)
  {
    ...RUN_BASE,
    stretch: 1.1,
    bodyRot: 0,
    fn: [76, 74, 70],
    ff: [64, 62, 60],
    hn: [-50, -75, -90],
    hf: [-40, -66, -80],
  },
  // 1 führende Vorderpfote setzt auf
  {
    ...RUN_BASE,
    stretch: 1.05,
    bodyRot: 4,
    fn: [52, 44, 50],
    ff: [28, 20, 22],
    hn: [-12, -60, -44],
    hf: [-26, -70, -60],
    earN: -58,
  },
  // 2 Vorderbeine unter dem Körper, Hinterbeine schwingen vor
  {
    ...RUN_BASE,
    stretch: 1.0,
    bodyRot: 2,
    fn: [4, -6, 6],
    ff: [-30, -40, -20],
    hn: [38, -22, 0],
    hf: [28, -36, -10],
    earN: -54,
  },
  // 3 gesammelt: Beine gekreuzt unter dem Körper (zweite Schwebe)
  {
    ...RUN_BASE,
    stretch: 0.9,
    bodyRot: -2,
    fn: [-46, 20, 60],
    ff: [-60, -8, 40],
    hn: [76, 12, 22],
    hf: [66, 2, 12],
    earN: -50,
    tail: [-90, -110, -120],
  },
  // 4 Hinterpfoten landen weit vorn
  {
    ...RUN_BASE,
    stretch: 0.95,
    bodyRot: -6,
    fn: [12, 50, 80],
    ff: [-8, 30, 60],
    hn: [52, -20, 6],
    hf: [66, 2, 16],
    earN: -56,
  },
  // 5 Abstoß
  {
    ...RUN_BASE,
    stretch: 1.04,
    bodyRot: -3,
    fn: [60, 60, 70],
    ff: [44, 40, 56],
    hn: [-20, -50, -40],
    hf: [10, -40, -20],
    earN: -60,
  },
];

/** Bodenlinie des Laufzyklus pro Phase (Sprunghöhe im Doppel-Schweben) */
export const RUN_LIFT = [30, 0, 0, 22, 0, 4];

export const runPose = (frame: number): { pose: DogPose; lift: number } => {
  const i = ((Math.floor(frame) % 6) + 6) % 6;
  return { pose: grounded(RUN[i], RUN_LIFT[i]), lift: RUN_LIFT[i] };
};

const mixLeg = (a: Leg, b: Leg, t: number): Leg => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export const mixPose = (a: DogPose, b: DogPose, t: number): DogPose => ({
  bodyRot: lerp(a.bodyRot, b.bodyRot, t),
  bodyY: lerp(a.bodyY, b.bodyY, t),
  stretch: lerp(a.stretch, b.stretch, t),
  fn: mixLeg(a.fn, b.fn, t),
  ff: mixLeg(a.ff, b.ff, t),
  hn: mixLeg(a.hn, b.hn, t),
  hf: mixLeg(a.hf, b.hf, t),
  neck: lerp(a.neck, b.neck, t),
  head: lerp(a.head, b.head, t),
  earN: lerp(a.earN, b.earN, t),
  earF: lerp(a.earF, b.earF, t),
  tail: mixLeg(a.tail, b.tail, t),
  eye: {
    open: lerp(a.eye.open, b.eye.open, t),
    pupil: lerp(a.eye.pupil, b.eye.pupil, t),
    glint: lerp(a.eye.glint, b.eye.glint, t),
    hard: lerp(a.eye.hard ?? 0, b.eye.hard ?? 0, t),
  },
  mouth: lerp(a.mouth, b.mouth, t),
});
