import React from "react";
import { Jitter } from "../lib/jitter";
import { Ink, InkLine, LineScale } from "../effects/Ink";
import { C } from "../lib/palette";
import { chain, limbOutline } from "../lib/limb";
import { HatShape } from "./Hat";

type Pt = [number, number];
export type Miene = "neutral" | "staunen" | "ekel" | "freude";

export type PostbotePose = {
  /** Schrittphase in Schritten (1 = ein Schritt). Nur Ganzzahl-/Halbwerte bei twos */
  step: number;
  /** 0 = steht, 1 = geht */
  walk: number;
  lean: number;
  /** Arme: Winkel (Grad, + = nach vorn) */
  armNear: number;
  armFar: number;
  /** Hand zum Kopf (0..1), überschreibt armNear */
  grab: number;
  miene: Miene;
  hatOn: boolean;
  /** Tropfen im Gesicht */
  wet: number;
  blink?: boolean;
};

export const POSTBOTE_STAND: PostbotePose = {
  step: 0,
  walk: 0,
  lean: 0,
  armNear: 4,
  armFar: -4,
  grab: 0,
  miene: "neutral",
  hatOn: true,
  wet: 0,
};

const HIP_N: Pt = [10, -110];
const HIP_F: Pt = [-12, -112];
const SH_N: Pt = [4, -250];
const SH_F: Pt = [-30, -246];
const HEAD: Pt = [26, -318];

const Leg: React.FC<{ start: Pt; a: number; k: number; far?: boolean }> = ({
  start,
  a,
  k,
  far,
}) => {
  const pts = chain(start, [58, 56], [a, a - k]);
  const foot = pts[2];
  return (
    <g>
      <Ink
        d={limbOutline(pts, [46, 40, 36])}
        fill={far ? C.graublauDunkel : C.uniformSchatten}
        off={[3, 3]}
      />
      <Ink
        d={`M ${foot[0] - 20} ${foot[1] - 8} C ${foot[0] - 20} ${foot[1] - 18} ${foot[0] + 20} ${foot[1] - 18} ${foot[0] + 34} ${foot[1] - 4} C ${foot[0] + 36} ${foot[1] + 4} ${foot[0] - 18} ${foot[1] + 4} ${foot[0] - 20} ${foot[1] - 8} Z`}
        fill={C.ink}
        off={[2, 2]}
      />
    </g>
  );
};

const Arm: React.FC<{
  start: Pt;
  a: number;
  bend: number;
  far?: boolean;
  grab?: number;
}> = ({ start, a, bend, far }) => {
  const pts = chain(start, [56, 52], [a, a + bend]);
  const hand = pts[2];
  return (
    <g>
      <Ink
        d={limbOutline(pts, [36, 30, 26])}
        fill={far ? C.graublauDunkel : C.uniform}
        off={[3, 3]}
      />
      <Ink
        d={`M ${hand[0] - 13} ${hand[1]} C ${hand[0] - 14} ${hand[1] - 14} ${hand[0] + 14} ${hand[1] - 14} ${hand[0] + 14} ${hand[1]} C ${hand[0] + 14} ${hand[1] + 16} ${hand[0] - 12} ${hand[1] + 16} ${hand[0] - 13} ${hand[1]} Z`}
        fill={far ? C.hautSchatten : C.haut}
        off={[2, 2]}
      />
    </g>
  );
};

const Face: React.FC<{
  miene: Miene;
  wet: number;
  hatOn: boolean;
  blink?: boolean;
}> = ({ miene, wet, hatOn, blink }) => {
  const eyeY = -8;
  return (
    <g>
      {/* Kopf */}
      <Ink
        d="M -52 0 C -54 -44 -26 -66 6 -66 C 42 -66 60 -40 58 -2 C 56 34 30 52 2 52 C -30 52 -50 34 -52 0 Z"
        fill={C.haut}
        off={[4, 3]}
      >
        <path
          d="M -56 -4 C -52 30 -30 50 2 52 L -10 60 L -60 40 Z"
          fill={C.hautSchatten}
        />
        {!hatOn ? (
          <ellipse cx={0} cy={-58} rx={30} ry={8} fill="#F4D2B8" />
        ) : null}
      </Ink>
      {/* Haarkranz */}
      <Ink
        d="M -52 -8 C -58 -24 -50 -40 -38 -44 C -34 -30 -34 -16 -40 0 Z"
        fill="#8C8C84"
        off={[2, 2]}
        w={3}
      />
      {/* Ohr */}
      <Ink
        d="M -24 -6 C -34 -18 -40 4 -26 12 C -20 14 -18 2 -24 -6 Z"
        fill={C.hautSchatten}
        off={[2, 1]}
        w={3}
      />
      {/* Augen */}
      {miene === "ekel" || blink ? (
        <>
          <InkLine
            d={`M 14 ${eyeY - 2} L 24 ${eyeY + 2} L 14 ${eyeY + 5}`}
            w={3}
          />
          <InkLine
            d={`M 40 ${eyeY - 2} L 32 ${eyeY + 2} L 42 ${eyeY + 5}`}
            w={3}
          />
        </>
      ) : (
        <>
          <ellipse
            cx={20}
            cy={eyeY}
            rx={miene === "staunen" ? 6 : 4}
            ry={miene === "staunen" ? 8 : 5}
            fill={C.ink}
          />
          <ellipse
            cx={40}
            cy={eyeY}
            rx={miene === "staunen" ? 5.5 : 3.6}
            ry={miene === "staunen" ? 7.5 : 4.6}
            fill={C.ink}
          />
        </>
      )}
      {/* Brauen */}
      {miene === "staunen" ? (
        <>
          <InkLine d="M 10 -30 Q 20 -38 28 -30" w={3.5} />
          <InkLine d="M 34 -30 Q 42 -36 50 -28" w={3.5} />
        </>
      ) : miene === "ekel" ? (
        <>
          <InkLine d="M 10 -20 Q 18 -16 28 -18" w={3.5} />
          <InkLine d="M 34 -18 Q 42 -14 50 -22" w={3.5} />
        </>
      ) : (
        <>
          <InkLine d="M 12 -22 Q 20 -26 28 -22" w={3.2} />
          <InkLine d="M 34 -22 Q 42 -26 50 -21" w={3.2} />
        </>
      )}
      {/* Mund */}
      {miene === "staunen" ? (
        <Ink
          d="M 30 30 C 26 22 42 20 42 30 C 42 40 32 42 30 30 Z"
          fill="#6B2E2A"
          off={[1, 1]}
          w={3}
        />
      ) : miene === "ekel" ? (
        <InkLine d="M 18 34 L 26 30 L 32 36 L 40 30 L 48 34" w={3.2} />
      ) : miene === "freude" ? (
        <InkLine d="M 20 28 Q 34 40 48 28" w={3.2} />
      ) : null}
      {/* Knollennase */}
      <Ink
        d="M 40 -4 C 58 -10 74 2 70 14 C 66 24 46 22 40 14 C 36 8 36 0 40 -4 Z"
        fill="#E09A86"
        off={[3, 2]}
      />
      {/* Schnurrbart */}
      <Ink
        d={
          miene === "ekel"
            ? "M 8 24 C 14 12 36 10 52 16 C 66 10 78 14 84 30 C 72 26 60 28 50 24 C 36 30 20 30 8 24 Z"
            : "M 6 30 C 10 16 34 10 50 16 C 66 10 82 16 86 32 C 74 26 62 30 50 26 C 36 32 18 34 6 30 Z"
        }
        fill={C.bart}
        off={[3, 2]}
      />
      {/* Tropfen */}
      {wet > 0 ? (
        <g opacity={Math.min(1, wet)}>
          {[
            [-10, -30],
            [48, -40],
            [20, 44],
            [-30, 20],
            [56, 0],
          ].map(([x, y], i) => (
            <Ink
              key={i}
              d={`M ${x} ${y - 10} C ${x + 6} ${y - 2} ${x + 6} ${y + 6} ${x} ${y + 6} C ${x - 6} ${y + 6} ${x - 6} ${y - 2} ${x} ${y - 10} Z`}
              fill="#A9C3D2"
              off={[1, 1]}
              w={2.5}
            />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Rundlicher Postbote, Blick nach rechts. Ursprung: Boden unter der Mitte. Höhe ca. 420. */
export const Postbote: React.FC<{
  pose: PostbotePose;
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
}> = ({ pose, x = 0, y = 0, scale = 1, flip }) => {
  const ph = pose.step * Math.PI;
  const sw = Math.sin(ph) * 26 * pose.walk;
  const bob = Math.abs(Math.cos(ph)) * -8 * pose.walk;
  const kneeN = Math.max(0, Math.sin(ph)) * 30 * pose.walk;
  const kneeF = Math.max(0, -Math.sin(ph)) * 30 * pose.walk;
  const armNear = pose.armNear - sw * 0.9;
  const armFar = pose.armFar + sw * 0.9;
  const grabA = -150 * pose.grab;
  return (
    <LineScale.Provider value={scale}>
      <Jitter seed="post">
        <g
          transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
        >
          <g transform={`translate(0 ${bob}) rotate(${pose.lean} 0 -110)`}>
            <Leg start={HIP_F} a={-sw} k={kneeF} far />
            <Arm start={SH_F} a={armFar} bend={24} far />
            {/* Posttasche hinten */}
            <Ink
              d="M -96 -150 C -100 -110 -92 -84 -80 -80 L -30 -84 C -26 -110 -28 -140 -34 -156 Z"
              fill={C.ockerDunkel}
              off={[3, 3]}
            />
            <Leg start={HIP_N} a={sw} k={kneeN} />
            {/* Rumpf */}
            <Ink
              d="M -40 -262 C -80 -250 -96 -190 -92 -140 C -88 -100 -60 -86 -10 -86 C 40 -86 70 -104 76 -150 C 82 -200 66 -250 30 -264 C 10 -272 -20 -270 -40 -262 Z"
              fill={C.uniform}
              off={[5, 4]}
            >
              <path
                d="M -96 -200 C -80 -120 -40 -96 20 -92 L 40 -80 L -100 -80 Z"
                fill={C.uniformSchatten}
              />
              {/* Gürtel */}
              <path
                d="M -100 -126 C -40 -112 30 -112 90 -130 L 90 -116 C 30 -98 -40 -98 -100 -112 Z"
                fill={C.graublauDunkel}
              />
            </Ink>
            {/* Knöpfe + Tragriemen */}
            <InkLine d="M -40 -262 C -10 -210 30 -160 70 -118" w={3} />
            <path
              d="M -38 -258 C -8 -208 32 -158 68 -116 L 60 -112 C 24 -154 -16 -204 -46 -254 Z"
              fill={C.rost}
            />
            {[-218, -186, -154].map((by, i) => (
              <circle
                key={i}
                cx={48 - i * 2}
                cy={by}
                r={4.5}
                fill={C.senf}
                stroke={C.ink}
                strokeWidth={2}
              />
            ))}
            {/* Kopf */}
            <g transform={`translate(${HEAD[0]} ${HEAD[1]})`}>
              <Face
                miene={pose.miene}
                wet={pose.wet}
                hatOn={pose.hatOn}
                blink={pose.blink}
              />
              {pose.hatOn ? (
                <g transform="translate(2 -52) rotate(-4)">
                  <HatShape />
                </g>
              ) : null}
            </g>
            {/* vorderer Arm */}
            {pose.grab > 0 ? (
              <Arm
                start={SH_N}
                a={grabA + armNear * (1 - pose.grab)}
                bend={-40 * pose.grab + 20}
              />
            ) : (
              <Arm start={SH_N} a={armNear} bend={20} />
            )}
          </g>
        </g>
      </Jitter>
    </LineScale.Provider>
  );
};
