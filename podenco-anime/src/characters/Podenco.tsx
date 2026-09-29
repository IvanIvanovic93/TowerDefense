import React, { useId } from "react";
import { Cel } from "../lib/Cel";
import { Ink } from "../lib/Line";
import { P } from "../lib/palette";
import { joint, limbPath, polar, Pt } from "../lib/shapes";
import { SideEye } from "./DogEye";
import { Hat } from "./Hat";
import { DogPose, Leg } from "./podencoPoses";

// Seitenansicht, Blick nach rechts. Boden bei y = 0, Stockmaß ca. 205 Einheiten.
const TORSO =
  "M -128,-196 C -90,-206 -20,-200 30,-208 C 62,-214 90,-198 100,-170 C 108,-140 94,-110 62,-102 C 30,-98 0,-116 -40,-130 C -70,-140 -92,-136 -114,-144 C -142,-154 -150,-184 -128,-196 Z";

const HEAD =
  "M -30,-4 C -30,-26 -12,-40 10,-40 C 32,-40 46,-32 56,-22 C 76,-14 100,-10 118,-6 C 127,-4 129,6 121,10 C 100,14 76,18 56,20 C 36,24 20,30 4,30 C -14,30 -30,18 -30,-4 Z";

const EAR_OUT =
  "M 18,4 C 16,-40 4,-92 -12,-132 C -24,-92 -34,-40 -28,2 C -14,8 4,8 18,4 Z";
const EAR_IN =
  "M 9,-4 C 7,-40 0,-82 -11,-112 C -19,-82 -24,-40 -20,-4 C -10,0 0,0 9,-4 Z";

// Rostbraune Sprenkel: unregelmäßig, klein, auf Rücken und Flanken
const FRECKLES: [number, number, number][] = [
  [-96, -186, 2.6],
  [-80, -178, 1.8],
  [-60, -190, 2.2],
  [-44, -176, 1.6],
  [-30, -192, 2.4],
  [-14, -182, 1.7],
  [2, -194, 2.1],
  [14, -178, 1.5],
  [28, -196, 2.3],
  [-110, -170, 1.9],
  [-70, -160, 1.4],
  [-52, -150, 2],
  [-20, -162, 1.6],
  [-4, -146, 1.3],
  [40, -184, 1.6],
  [-122, -182, 1.5],
  [-86, -196, 1.4],
  [58, -198, 1.3],
];

export type PodencoProps = {
  pose: DogPose;
  x?: number;
  y?: number;
  scale?: number;
  /** Für Silhouetten vor der Sonne: alle Flächen in dieser Farbe */
  silhouette?: string;
  light?: [number, number];
  hatInMouth?: boolean;
  wet?: boolean;
  /** Nur den Kopf zeichnen (Schwimmen) */
  headOnly?: boolean;
  flip?: boolean;
};

const legPoints = (o: Pt, a: Leg, len: [number, number, number]): Pt[] => {
  const [p0, p1, p2] = joint(o, a[0], len[0], a[1], len[1]);
  const p3 = polar(p2, a[2], len[2]);
  // Pfote: kurzes Stück nach vorn abgeknickt
  const toe = polar(p3, Math.min(a[2] + 75, 150), 12);
  return [p0, p1, p2, p3, toe];
};

const FRONT_LEN: [number, number, number] = [50, 72, 26];
const HIND_LEN: [number, number, number] = [56, 62, 48];
const FRONT_W = [34, 20, 13, 12, 11];
const HIND_W = [48, 26, 14, 12, 11];

export const dogLegs = (pose: DogPose) => {
  const st = pose.stretch;
  const frontO: Pt = [62 * st, -145];
  const hindO: Pt = [-108 * st, -146];
  return {
    fn: legPoints(frontO, pose.fn, FRONT_LEN),
    ff: legPoints([frontO[0] - 10, frontO[1] - 4], pose.ff, FRONT_LEN),
    hn: legPoints(hindO, pose.hn, HIND_LEN),
    hf: legPoints([hindO[0] + 10, hindO[1] - 4], pose.hf, HIND_LEN),
  };
};

const toWorld = (p: Pt, pose: DogPose): Pt => {
  const r = (pose.bodyRot * Math.PI) / 180;
  const dx = p[0] + 20;
  const dy = p[1] + 160;
  return [
    dx * Math.cos(r) - dy * Math.sin(r) - 20,
    dx * Math.sin(r) + dy * Math.cos(r) - 160 + pose.bodyY,
  ];
};

/** Verschiebt die Pose so, dass die tiefste Pfote genau auf dem Boden (bzw. air Einheiten darüber) steht */
export const grounded = (pose: DogPose, air = 0): DogPose => {
  const legs = dogLegs({ ...pose, bodyY: 0 });
  let maxY = -Infinity;
  for (const l of [legs.fn, legs.ff, legs.hn, legs.hf]) {
    for (const p of l.slice(3))
      maxY = Math.max(maxY, toWorld(p, { ...pose, bodyY: 0 })[1]);
  }
  return { ...pose, bodyY: -maxY - air - 5 };
};

export const Podenco: React.FC<PodencoProps> = ({
  pose,
  x = 0,
  y = 0,
  scale = 1,
  silhouette,
  light = [-0.6, -0.8],
  hatInMouth,
  wet,
  headOnly,
  flip,
}) => {
  const id = useId().replace(/:/g, "");
  const st = pose.stretch;
  const sil = silhouette;
  const farBase = P.dogShade;

  const { fn, ff, hn, hf } = dogLegs(pose);

  const neckBase: Pt = [44 * st, -176];
  const headJoint = polar(neckBase, 180 - pose.neck, 92);
  const neckMid: Pt = [
    (neckBase[0] + headJoint[0]) / 2,
    (neckBase[1] + headJoint[1]) / 2,
  ];
  const neckD = limbPath(
    [[neckBase[0] - 14, neckBase[1] + 16], neckMid, headJoint],
    [78, 50, 44],
  );

  const tailO: Pt = [-132 * st, -184];
  const t1 = polar(tailO, pose.tail[0], 34);
  const t2 = polar(t1, pose.tail[1], 32);
  const t3 = polar(t2, pose.tail[2], 26);
  const tailD = limbPath([tailO, t1, t2, t3], [12, 9, 6, 3]);

  const torsoT = `translate(${-20 * (st - 1)} 0) scale(${st} 1)`;

  const legFreckles = (pts: Pt[], seed: number) =>
    sil
      ? null
      : [0.35, 0.62, 1.4, 1.75].map((f, i) => {
          const seg = Math.floor(f);
          const t = f - seg;
          const a = pts[seg];
          const b = pts[seg + 1];
          return (
            <circle
              key={i}
              cx={a[0] + (b[0] - a[0]) * t + ((seed * 7 + i * 5) % 7) - 3}
              cy={a[1] + (b[1] - a[1]) * t}
              r={1.3 + ((seed + i) % 3) * 0.4}
              fill={P.freckle}
            />
          );
        });

  const ear = (near: boolean) => {
    const angle = near ? pose.earN : pose.earF;
    const piv: Pt = near ? [-2, -32] : [-16, -30];
    // Beim Wegkippen wird das Ohr perspektivisch etwas breiter und kürzer
    const flop = Math.min(1, Math.abs(angle) / 90);
    return (
      <g
        transform={`translate(${piv[0]} ${piv[1]}) rotate(${angle}) scale(${1 + flop * 0.1} ${1 - flop * 0.12})`}
      >
        <Cel
          d={EAR_OUT}
          base={near ? P.dog : farBase}
          shade={P.dogShade}
          rim={near ? P.dogRim : undefined}
          light={light}
          silhouette={sil}
          shadeOffset={10}
        />
        {near && !sil ? (
          <Cel
            d={EAR_IN}
            base={P.earPink}
            shade={P.earPinkShade}
            light={[0.8, 0.6]}
            shadeOffset={8}
            stroke={null}
          >
            <circle cx={-8} cy={-58} r={4} fill={P.earSpot} />
            <circle cx={-5} cy={-84} r={3} fill={P.earSpot} />
            <circle cx={-13} cy={-36} r={3.4} fill={P.earSpot} />
            <circle cx={-2} cy={-26} r={2.2} fill={P.earSpot} />
          </Cel>
        ) : null}
      </g>
    );
  };

  const head = (
    <g
      transform={`translate(${headJoint[0]} ${headJoint[1]}) rotate(${pose.head})`}
    >
      {ear(false)}
      <Cel
        d={HEAD}
        base={P.dog}
        shade={P.dogShade}
        rim={P.dogRim}
        light={light}
        silhouette={sil}
        shadeOffset={12}
      >
        {/* cremefarbener Fleck zwischen den Ohren */}
        <path
          d="M -24,-30 C -14,-46 18,-46 30,-34 C 18,-24 -6,-20 -24,-30 Z"
          fill={P.cream}
        />
        <circle cx={60} cy={-20} r={1.6} fill={P.freckle} />
        <circle cx={70} cy={-16} r={1.2} fill={P.freckle} />
      </Cel>
      {!sil ? (
        <>
          {/* Nase schwarz mit rosa Fleck auf dem Nasenrücken */}
          <path
            d="M 112,-8 C 124,-9 131,0 124,8 C 118,10 110,6 108,0 C 107,-4 108,-7 112,-8 Z"
            fill={P.nose}
          />
          <ellipse cx={107} cy={-8} rx={5} ry={2.4} fill={P.nosePink} />
          <circle cx={122} cy={-3} r={1.6} fill="#fff" />
          <Ink
            d={
              pose.mouth > 0.1
                ? `M 118,10 C 100,${16 + pose.mouth * 10} 76,${20 + pose.mouth * 14} 60,20`
                : "M 118,10 C 100,14 78,17 62,17"
            }
          />
          <Ink d="M 62,17 q -6,1 -8,-4" />
          <g transform="translate(36 -16) scale(1.25)">
            <SideEye s={pose.eye} />
          </g>
        </>
      ) : null}
      {hatInMouth ? (
        <Hat
          x={96}
          y={4}
          rot={18}
          scale={0.72}
          wet={wet}
          silhouette={sil}
          light={light}
        />
      ) : null}
      {ear(true)}
      {wet && !sil ? (
        <g
          fill={P.tear}
          stroke={P.ink}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        >
          <path d="M 20,30 q 5,10 0,15 q -5,-5 0,-15 Z" />
          <path d="M 70,22 q 4,8 0,12 q -4,-4 0,-12 Z" />
        </g>
      ) : null}
    </g>
  );

  if (headOnly) {
    return (
      <g
        transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale}) translate(${-headJoint[0]} ${-headJoint[1]})`}
      >
        {head}
      </g>
    );
  }

  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <defs>
        <mask
          id={`nb${id}`}
          maskUnits="userSpaceOnUse"
          x="-2000"
          y="-2000"
          width="4000"
          height="4000"
        >
          <rect x={-2000} y={-2000} width={4000} height={4000} fill="#fff" />
          <path d={TORSO} fill="#000" transform={torsoT} />
        </mask>
      </defs>
      <g
        transform={`translate(0 ${pose.bodyY}) rotate(${pose.bodyRot} -20 -160)`}
      >
        <Cel
          d={tailD}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={5}
          rimOffset={2}
        />
        <Cel
          d={limbPath(hf, HIND_W)}
          base={farBase}
          shade={farBase}
          light={light}
          silhouette={sil}
        />
        <Cel
          d={limbPath(ff, FRONT_W)}
          base={farBase}
          shade={farBase}
          light={light}
          silhouette={sil}
        />
        <g transform={torsoT}>
          <Cel
            d={TORSO}
            base={P.dog}
            shade={P.dogShade}
            rim={P.dogRim}
            light={light}
            silhouette={sil}
            shadeOffset={22}
            rimOffset={5}
          >
            {FRECKLES.map(([fx, fy, r], i) => (
              <circle key={i} cx={fx} cy={fy} r={r} fill={P.freckle} />
            ))}
            {wet ? (
              <path
                d="M -130,-150 L 100,-150 L 100,-90 L -130,-90 Z"
                fill="#AEBFCC"
                opacity={0.5}
              />
            ) : null}
          </Cel>
        </g>
        {/* Hals: Füllung deckt die Körperkontur, eigene Kontur nur außerhalb des Körpers */}
        <Cel
          d={neckD}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={14}
          stroke={null}
        />
        {!sil ? (
          <path
            d={neckD}
            fill="none"
            stroke={P.ink}
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            mask={`url(#nb${id})`}
          />
        ) : null}
        <Cel
          d={limbPath(hn, HIND_W)}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={10}
        >
          {legFreckles(hn, 3)}
        </Cel>
        <Cel
          d={limbPath(fn, FRONT_W)}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={9}
        >
          {legFreckles(fn, 5)}
        </Cel>
        {head}
      </g>
    </g>
  );
};
