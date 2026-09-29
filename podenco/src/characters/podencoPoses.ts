import type { EarPose, Leg3, PodencoPose } from "./Podenco";

export const EAR_UP: EarPose = { rot: -6, sx: 1, sy: 1, fold: 0 };
export const EAR_UP_FAR: EarPose = { rot: -26, sx: 0.95, sy: 1, fold: 0 };
/** das "kaputte" Ohr: kippt seitlich weg, die Spitze knickt ab */
export const EAR_FLOP: EarPose = { rot: -48, sx: 0.95, sy: 0.95, fold: -70 };
export const EAR_HANG: EarPose = { rot: -112, sx: 0.9, sy: 0.95, fold: -20 };
export const EAR_BACK: EarPose = { rot: -70, sx: 0.9, sy: 1, fold: 0 };

export const STAND: PodencoPose = {
  bodyY: 0,
  pitch: 0,
  breath: 0,
  neck: 0,
  head: 0,
  tilt: 0,
  earNear: EAR_UP,
  earFar: EAR_FLOP,
  frontNear: [2, 0, 14],
  frontFar: [-5, -3, 10],
  hindNear: [24, -26, 6],
  hindFar: [16, -32, 0],
  tail: -35,
  tailCurl: -12,
  eye: 1,
  look: 0.3,
  mouth: 0,
};

export const LIE: PodencoPose = {
  ...STAND,
  bodyY: 104,
  pitch: 0,
  neck: 72,
  head: -30,
  earNear: EAR_HANG,
  earFar: { ...EAR_HANG, rot: -128 },
  frontNear: [72, 88, 92],
  frontFar: [66, 86, 90],
  hindNear: [78, -96, 90],
  hindFar: [72, -100, 88],
  tail: -12,
  tailCurl: 8,
  eye: 0,
  mouth: 0,
};

export const SIT: PodencoPose = {
  ...STAND,
  bodyY: 96,
  pitch: -38,
  neck: -8,
  head: 14,
  frontNear: [6, 2, 16],
  frontFar: [0, -2, 12],
  hindNear: [58, -96, 92],
  hindFar: [52, -100, 90],
  tail: -10,
  tailCurl: 6,
};

// Galopp-Zyklus, 8 Zeichnungen: [vorne, hinten] je Phase
const FRONT_CYCLE: Leg3[] = [
  [58, 72, 84],
  [34, 32, 40],
  [10, 4, 12],
  [-22, -26, -18],
  [-42, -52, -44],
  [-18, -74, -110],
  [22, -44, -96],
  [48, 24, 30],
];
const HIND_CYCLE: Leg3[] = [
  [-34, -72, -62],
  [-8, -88, -44],
  [30, -66, 8],
  [62, -4, 40],
  [52, 8, 22],
  [30, -22, 0],
  [2, -46, -24],
  [-22, -62, -44],
];
const BOB = [-16, -6, 0, -2, -12, -4, 0, -8];
const PITCH = [-4, -1, 2, 4, 2, 0, -2, -4];

export const run = (i: number, earBounce = 0): PodencoPose => {
  const k = ((i % 8) + 8) % 8;
  const k2 = (k + 1) % 8;
  return {
    ...STAND,
    bodyY: BOB[k] + 6,
    pitch: PITCH[k],
    neck: 22 + PITCH[k] * 0.5,
    head: 4,
    frontNear: FRONT_CYCLE[k],
    frontFar: FRONT_CYCLE[k2],
    hindNear: HIND_CYCLE[k],
    hindFar: HIND_CYCLE[k2],
    tail: 6 + BOB[k] * 0.4,
    tailCurl: -4,
    earNear: { rot: -28 + (k % 2) * 8 + earBounce, sx: 1, sy: 0.96, fold: 0 },
    earFar: { rot: -52 - (k % 4) * 5, sx: 0.9, sy: 0.95, fold: -40 - (k % 2) * 30 },
    look: 1,
  };
};

export const JUMP: PodencoPose = {
  ...STAND,
  bodyY: -10,
  pitch: -14,
  neck: 24,
  head: 6,
  frontNear: [78, 88, 96],
  frontFar: [70, 84, 92],
  hindNear: [-50, -88, -96],
  hindFar: [-56, -92, -100],
  tail: 10,
  tailCurl: 0,
  earNear: { rot: -80, sx: 1, sy: 1.05 },
  earFar: { rot: -96, sx: 0.9, sy: 1 },
  look: 0.6,
};

export const CROUCH: PodencoPose = {
  ...STAND,
  bodyY: 34,
  pitch: 8,
  neck: 6,
  head: 10,
  frontNear: [38, -20, 30],
  frontFar: [32, -24, 26],
  hindNear: [58, -80, 10],
  hindFar: [52, -84, 6],
  tail: -10,
};

export const swim = (i: number): PodencoPose => {
  const k = ((i % 4) + 4) % 4;
  const f: Leg3[] = [
    [60, 40, 60],
    [30, -10, 10],
    [0, -40, -30],
    [40, -60, -20],
  ];
  return {
    ...STAND,
    pitch: -26,
    neck: -30,
    head: 30,
    frontNear: f[k],
    frontFar: f[(k + 2) % 4],
    hindNear: [-20, -60, -40],
    hindFar: [-30, -70, -50],
    tail: 0,
    mouth: 0.35,
    look: 1,
  };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpArr = <T extends number[]>(a: T, b: T, t: number) => a.map((v, i) => lerp(v, b[i], t)) as T;
const lerpEar = (a: EarPose, b: EarPose, t: number): EarPose => ({
  rot: lerp(a.rot, b.rot, t),
  fold: lerp(a.fold ?? 0, b.fold ?? 0, t),
  sx: lerp(a.sx, b.sx, t),
  sy: lerp(a.sy, b.sy, t),
});

export const blend = (a: PodencoPose, b: PodencoPose, t: number): PodencoPose => ({
  bodyY: lerp(a.bodyY, b.bodyY, t),
  pitch: lerp(a.pitch, b.pitch, t),
  breath: lerp(a.breath, b.breath, t),
  neck: lerp(a.neck, b.neck, t),
  head: lerp(a.head, b.head, t),
  tilt: lerp(a.tilt, b.tilt, t),
  earNear: lerpEar(a.earNear, b.earNear, t),
  earFar: lerpEar(a.earFar, b.earFar, t),
  frontNear: lerpArr(a.frontNear, b.frontNear, t),
  frontFar: lerpArr(a.frontFar, b.frontFar, t),
  hindNear: lerpArr(a.hindNear, b.hindNear, t),
  hindFar: lerpArr(a.hindFar, b.hindFar, t),
  tail: lerp(a.tail, b.tail, t),
  tailCurl: lerp(a.tailCurl, b.tailCurl, t),
  eye: lerp(a.eye, b.eye, t),
  look: lerp(a.look, b.look, t),
  mouth: lerp(a.mouth, b.mouth, t),
});

/** Liegend, aber hellwach: Kopf hoch, Augen offen. */
export const LIE_ALERT: PodencoPose = {
  ...LIE,
  neck: 6,
  head: -4,
  eye: 1,
  look: 1,
  earNear: EAR_UP,
  earFar: EAR_UP_FAR,
  tail: 4,
};

/**
 * Squash & Stretch beim Hochschnellen der Ohren. t = Frames seit dem Schreck.
 * Gibt Faktor (sx, sy) und Überschwinger für die Drehung zurück.
 */
export const earPop = (base: EarPose, t: number, from: EarPose): EarPose => {
  if (t < 0) return from;
  const keys: [number, number, number, number][] = [
    // t, sx, sy, anteil hin zu base
    [0, 1.25, 0.55, 0.3],
    [2, 0.78, 1.4, 1.08],
    [4, 0.88, 1.2, 1.0],
    [6, 1.08, 0.88, 0.98],
    [8, 0.97, 1.06, 1.0],
    [10, 1, 1, 1],
  ];
  let k = keys[keys.length - 1];
  for (const kk of keys) if (t >= kk[0]) k = kk;
  const m = k[3];
  return {
    rot: from.rot + (base.rot - from.rot) * m,
    fold: (from.fold ?? 0) + ((base.fold ?? 0) - (from.fold ?? 0)) * m,
    sx: base.sx * k[1],
    sy: base.sy * k[2],
  };
};

/** Ohr kippt weg, mit kleinem Nachwippen. t = Frames seit Beginn. */
export const earFlopAnim = (from: EarPose, to: EarPose, t: number): EarPose => {
  if (t <= 0) return from;
  const keys: [number, number][] = [
    [0, 0],
    [2, 0.35],
    [4, 0.8],
    [6, 1.15],
    [8, 0.92],
    [10, 1.05],
    [12, 1],
  ];
  let m = 1;
  for (const [kt, km] of keys) if (t >= kt) m = km;
  return {
    rot: from.rot + (to.rot - from.rot) * m,
    fold: (from.fold ?? 0) + ((to.fold ?? 0) - (from.fold ?? 0)) * m,
    sx: from.sx + (to.sx - from.sx) * Math.min(1, m),
    sy: from.sy + (to.sy - from.sy) * Math.min(1, m),
  };
};
