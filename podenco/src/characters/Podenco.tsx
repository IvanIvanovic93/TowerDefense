import React from "react";
import { random } from "remotion";
import { Ink, InkLine, LineScale } from "../effects/Ink";
import { C } from "../lib/palette";
import { alongChain, chain, limbOutline } from "../lib/limb";
import { rotPt } from "../lib/math";
import { smoothPath } from "../lib/rough";

type Pt = [number, number];
export type Leg3 = [number, number, number];
/** rot: Drehung an der Ohrbasis, fold: Knick der oberen Ohrhälfte (das "kaputte" Ohr) */
export type EarPose = { rot: number; sx: number; sy: number; fold?: number };

export type PodencoPose = {
  /** Absenkung des Körpers (+ = tiefer), in Figureneinheiten */
  bodyY: number;
  /** Körperneigung um die Hüfte (Grad, + = Nase runter) */
  pitch: number;
  /** Atmung 0..1 (Brustkorb hebt sich) */
  breath: number;
  neck: number;
  head: number;
  /** Kopf schief legen (Grad) */
  tilt: number;
  earNear: EarPose;
  earFar: EarPose;
  frontNear: Leg3;
  frontFar: Leg3;
  hindNear: Leg3;
  hindFar: Leg3;
  /** Schwanzwinkel (Grad, 0 = waagerecht nach hinten, + = nach oben) */
  tail: number;
  tailCurl: number;
  /** 1 = Augen offen, 0 = zu */
  eye: number;
  /** Blickrichtung der Pupille (-1..1) */
  look: number;
  /** Maul 0..1 */
  mouth: number;
};

// Skelett in Körperkoordinaten (Blick nach rechts, Boden bei y = 0)
const SHOULDER: Pt = [60, -147];
const HIP: Pt = [-80, -150];
const NECK: Pt = [86, -186];
const TAIL: Pt = [-124, -186];
const HEAD_ON_NECK: Pt = [40, -86];
const FRONT_LEN = [58, 62, 24];
const HIND_LEN = [60, 62, 38];
const FRONT_W = [26, 14, 11, 10];
const HIND_W = [40, 17, 11, 10];

const BODY: Pt[] = [
  [72, -210],
  [20, -204],
  [-30, -202],
  [-80, -206],
  [-112, -198],
  [-132, -174],
  [-126, -142],
  [-96, -134],
  [-60, -148],
  [-20, -150],
  [18, -134],
  [52, -116],
  [88, -126],
  [106, -154],
  [104, -186],
];
const BODY_LINE = smoothPath(BODY, false).replace(/ C[^C]*$/, "");
const BELLY_SHADE: Pt[] = [
  [-100, -130],
  [-60, -146],
  [-20, -148],
  [18, -132],
  [52, -112],
  [95, -120],
  [96, -134],
  [60, -132],
  [20, -150],
  [-20, -164],
  [-60, -162],
  [-100, -150],
];

// Hals: Fläche reicht tief in den Körper, Kontur nur Nacken und Kehle
const NECK_FILL =
  "M -34 -22 C -14 -40 4 -70 24 -96 C 36 -104 56 -100 64 -80 C 56 -56 40 -20 20 18 C 0 30 -30 26 -44 6 Z";
const NECK_BACK = "M -34 -22 C -14 -40 4 -70 24 -96";
const NECK_FRONT = "M 64 -80 C 56 -56 40 -20 21 17";

const HEAD: Pt[] = [
  [-22, 0],
  [-12, -18],
  [10, -26],
  [36, -21],
  [52, -13],
  [80, -5],
  [104, 0],
  [111, 7],
  [102, 14],
  [72, 16],
  [42, 21],
  [12, 25],
  [-12, 17],
];
const HEAD_SHADE: Pt[] = [
  [-20, 6],
  [10, 14],
  [44, 12],
  [80, 10],
  [112, 12],
  [100, 20],
  [40, 28],
  [-10, 24],
];

// Ohr in zwei Teilen, damit die obere Hälfte wegknicken kann
const EAR_LO = "M -17 2 C -20 -18 -17 -36 -12 -52 L 13 -52 C 17 -36 21 -18 18 2 Q 0 9 -17 2 Z";
const EAR_LO_LINES = ["M -12 -52 C -17 -36 -20 -18 -17 2 Q 0 9 18 2 C 21 -18 17 -36 13 -52"];
const EAR_LO_IN = "M -9 -3 C -11 -20 -9 -36 -6 -52 L 8 -52 C 10 -36 12 -20 10 -3 Q 0 1 -9 -3 Z";
const EAR_HI = "M -13 0 C -9 -18 -5 -32 1 -48 C 7 -32 11 -16 14 0 Z";
const EAR_HI_LINES = ["M -13 0 C -9 -18 -5 -32 1 -48 C 7 -32 11 -16 14 0"];
const EAR_HI_IN = "M -7 2 C -5 -12 -2 -22 1 -30 C 4 -22 6 -12 8 2 Z";

// Sprenkel: fest verteilt auf Rücken und Flanken
const SPECKLES: { p: Pt; r: number }[] = Array.from({ length: 70 }, (_, i) => {
  const x = -125 + random(`sx${i}`) * 215;
  const top = -205 + Math.abs(x + 20) * 0.02;
  const y = top + random(`sy${i}`) * (x > 20 ? 60 : 48);
  return { p: [x, y] as Pt, r: 0.8 + random(`sr${i}`) * random(`sq${i}`) * 2.2 };
});
const LEG_SPECKLES = Array.from({ length: 9 }, (_, i) => ({
  t: 0.15 + random(`lt${i}`) * 0.7,
  s: (random(`ls${i}`) - 0.5) * 1.3,
  r: 0.8 + random(`lr${i}`) * 1.2,
}));

const tf = (p: Pt, pitch: number, bodyY: number): Pt => {
  const r = rotPt(p, HIP, pitch);
  return [r[0], r[1] + bodyY];
};

const Leg: React.FC<{ start: Pt; lens: number[]; widths: number[]; angles: Leg3; far?: boolean; seed: string }> = ({
  start,
  lens,
  widths,
  angles,
  far,
  seed,
}) => {
  const pts = chain(start, lens, angles);
  const d = limbOutline(pts, widths);
  const paw = pts[pts.length - 1];
  const pa = angles[2];
  return (
    <g>
      <Ink d={d} fill={far ? C.schatten : C.fell} off={[3, 2]}>
        {!far
          ? LEG_SPECKLES.map((s, i) => {
              const p = alongChain(pts, widths, s.t, s.s);
              return <circle key={i} cx={p[0] - 3} cy={p[1] - 2} r={s.r} fill={C.sprenkel} data-seed={seed} />;
            })
          : null}
      </Ink>
      <g transform={`translate(${paw[0]} ${paw[1]}) rotate(${-pa * 0.35})`}>
        <Ink d="M -9 -4 C -8 -12 12 -12 16 -3 C 18 3 10 6 0 5 C -8 5 -10 1 -9 -4 Z" fill={far ? C.schatten : C.fell} off={[2, 1]} w={3.5} />
      </g>
    </g>
  );
};

const Ear: React.FC<{ base: Pt; pose: EarPose; far?: boolean }> = ({ base, pose, far }) => {
  const fill = far ? C.schatten : C.fell;
  const fold = pose.fold ?? 0;
  return (
    <g transform={`translate(${base[0]} ${base[1]}) rotate(${pose.rot}) scale(${pose.sx} ${pose.sy})`}>
      <g transform={`translate(0 -50) rotate(${fold}) scale(1 ${1 - Math.min(Math.abs(fold), 120) / 400})`}>
        <Ink d={EAR_HI} fill={fill} off={[3, 2]} line={EAR_HI_LINES}>
          <path d={EAR_HI_IN} fill={C.ohrInnen} />
          <ellipse cx={3} cy={-6} rx={2.4} ry={3.4} fill={C.ohrFleck} />
          <ellipse cx={0} cy={-18} rx={1.8} ry={2.6} fill={C.ohrFleck} />
          {!far ? <path d="M -13 0 C -9 -18 -5 -32 1 -48 L -3 -20 C -5 -12 -6 -6 -6 0 Z" fill={C.schatten} /> : null}
        </Ink>
        {Math.abs(fold) > 15 ? <InkLine d="M -12 1 Q 1 4 13 1" w={3} /> : null}
      </g>
      <Ink d={EAR_LO} fill={fill} off={[3, 2]} line={EAR_LO_LINES}>
        <path d={EAR_LO_IN} fill={C.ohrInnen} />
        <ellipse cx={-3} cy={-30} rx={3.2} ry={4.5} fill={C.ohrFleck} />
        <ellipse cx={5} cy={-16} rx={2} ry={2.4} fill={C.ohrFleck} />
        <ellipse cx={3} cy={-44} rx={2.2} ry={3} fill={C.ohrFleck} />
        {!far ? <path d="M -17 2 C -20 -18 -17 -36 -12 -52 L -7 -52 C -10 -30 -10 -12 -8 3 Z" fill={C.schatten} /> : null}
      </Ink>
    </g>
  );
};

const Eye: React.FC<{ open: number; look: number }> = ({ open, look }) => {
  if (open < 0.2) {
    return (
      <g transform="translate(40 -9)">
        <InkLine d="M -10 -1 Q 0 5 10 -2" w={3.5} />
        <InkLine d="M -8 1 Q -10 5 -13 6" w={2.5} />
      </g>
    );
  }
  return (
    <g transform={`translate(40 -9) rotate(-8) scale(1 ${open})`}>
      <path d="M -11 1 Q 0 -8 11 -1 Q 1 7 -11 1 Z" fill={C.ohrInnen} />
      <path d="M -9 1 Q 0 -6 9 -1 Q 1 5 -9 1 Z" fill={C.auge} />
      <circle cx={1 + look * 3} cy={-1} r={1.8} fill={C.fell} />
      <InkLine d="M -11 1 Q 0 -8 11 -1" w={3.2} />
      <InkLine d="M -9 2 Q 1 7 10 0" w={2} />
    </g>
  );
};

const Head: React.FC<{ pose: PodencoPose; holding?: React.ReactNode }> = ({ pose, holding }) => {
  const d = smoothPath(HEAD);
  return (
    <g transform={`rotate(${pose.head + pose.tilt}) scale(1.14)`}>
      <Ear base={[-6, -18]} pose={pose.earFar} far />
      <Ink d={d} fill={C.fell} off={[4, 3]}>
        <path d={smoothPath(HEAD_SHADE)} fill={C.schatten} />
        <ellipse cx={8} cy={-22} rx={17} ry={8} fill={C.kopffleck} />
        <circle cx={-6} cy={-6} r={1.6} fill={C.sprenkel} />
        <circle cx={2} cy={4} r={1.3} fill={C.sprenkel} />
      </Ink>
      {/* Maul */}
      {pose.mouth > 0.05 ? (
        <g>
          <path d={`M 104 11 Q 80 ${14 + pose.mouth * 14} 58 14 Q 80 14 104 11 Z`} fill="#6B2E2A" />
          <InkLine d={`M 104 11 Q 80 ${14 + pose.mouth * 14} 58 14`} w={3} />
        </g>
      ) : (
        <InkLine d="M 106 12 Q 88 15 64 13" w={2.8} />
      )}
      {/* Nase mit rosa Fleck auf dem Nasenrücken */}
      <path d="M 99 -1 C 104 -5 114 -2 113 6 C 112 11 104 12 100 8 C 97 5 97 1 99 -1 Z" fill={C.ink} />
      <ellipse cx={92} cy={-3} rx={4.5} ry={2} fill={C.ohrInnen} />
      <Eye open={pose.eye} look={pose.look} />
      {holding ? <g transform="translate(80 18)">{holding}</g> : null}
      <Ear base={[10, -21]} pose={pose.earNear} />
    </g>
  );
};

const Tail: React.FC<{ base: Pt; angle: number; curl: number }> = ({ base, angle, curl }) => {
  const lens = [20, 20, 20, 18, 14];
  // Winkel: 0 = waagerecht nach hinten → in chain-Konvention (0 = unten) umrechnen: nach hinten = -90
  const angs: number[] = [];
  let a = -90 - angle;
  for (let i = 0; i < lens.length; i++) {
    angs.push(a);
    a -= curl;
  }
  const pts = chain(base, lens, angs);
  return <Ink d={limbOutline(pts, [11, 9, 7, 5.5, 4, 2.5])} fill={C.fell} off={[3, 2]} w={3.5} />;
};

/**
 * Podenco, Blick nach rechts. Ursprung: Boden unter der Körpermitte. Höhe bis Ohrspitze ca. 360.
 */
export const Podenco: React.FC<{
  pose: PodencoPose;
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  holding?: React.ReactNode;
  /** zusätzliche Körperverformung (Schütteln): skewX in Grad */
  shake?: number;
}> = ({ pose, x = 0, y = 0, scale = 1, flip, holding, shake = 0 }) => {
  const { pitch, bodyY } = pose;
  const sh = tf(SHOULDER, pitch, bodyY);
  const hp = tf(HIP, pitch, bodyY);
  const nk = tf(NECK, pitch, bodyY);
  const tl = tf(TAIL, pitch, bodyY);
  const breath = 1 + pose.breath * 0.035;
  const bodyD = smoothPath(BODY);

  const bodyTf = `translate(0 ${bodyY}) rotate(${pitch} ${HIP[0]} ${HIP[1]}) translate(0 -150) scale(1 ${breath}) translate(0 150)`;

  return (
    <LineScale.Provider value={scale}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
        <g transform={shake ? `skewX(${shake})` : undefined}>
          {/* hinteres Beinpaar in Schattenfarbe */}
          <Leg start={[hp[0] + 6, hp[1] + 4]} lens={HIND_LEN} widths={HIND_W} angles={pose.hindFar} far seed="hf" />
          <Leg start={[sh[0] + 8, sh[1] + 2]} lens={FRONT_LEN} widths={FRONT_W} angles={pose.frontFar} far seed="ff" />
          <Tail base={tl} angle={pose.tail + pitch} curl={pose.tailCurl} />
          <Leg start={hp} lens={HIND_LEN} widths={HIND_W} angles={pose.hindNear} seed="hn" />
          <Leg start={sh} lens={FRONT_LEN} widths={FRONT_W} angles={pose.frontNear} seed="fn" />
          <g transform={bodyTf}>
            <Ink d={bodyD} fill={C.fell} off={[5, 4]} line={[BODY_LINE]}>
              <path d={smoothPath(BELLY_SHADE)} fill={C.schatten} />
              {SPECKLES.map((s, i) => (
                <circle key={i} cx={s.p[0]} cy={s.p[1]} r={s.r} fill={C.sprenkel} />
              ))}
            </Ink>
            {/* Rippen-/Brustlinie, sparsam */}
            <InkLine d="M 20 -150 Q 30 -140 42 -128" w={2.4} />
          </g>
          {/* Hals + Kopf */}
          <g transform={`translate(${nk[0]} ${nk[1]}) rotate(${pitch + pose.neck})`}>
            <Ink d={NECK_FILL} fill={C.fell} off={[5, 4]} line={[NECK_BACK, NECK_FRONT]}>
              <path d="M 44 -50 L 66 -84 L 70 -10 L 30 30 Z" fill={C.schatten} />
              <circle cx={0} cy={-44} r={1.4} fill={C.sprenkel} />
              <circle cx={12} cy={-66} r={1.1} fill={C.sprenkel} />
              <circle cx={-12} cy={-24} r={1.2} fill={C.sprenkel} />
            </Ink>
            <g transform={`translate(${HEAD_ON_NECK[0]} ${HEAD_ON_NECK[1]}) rotate(${-pose.neck * 0.4})`}>
              <Head pose={pose} holding={holding} />
            </g>
          </g>
        </g>
      </g>
    </LineScale.Provider>
  );
};
