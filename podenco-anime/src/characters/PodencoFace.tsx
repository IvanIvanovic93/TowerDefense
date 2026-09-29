import React from "react";
import { Cel } from "../lib/Cel";
import { Ink, Shape } from "../lib/Line";
import { P } from "../lib/palette";
import { EyeState, EYE_DEFAULT, FrontEye } from "./DogEye";
import { Hat } from "./Hat";

export type FaceProps = {
  x?: number;
  y?: number;
  scale?: number;
  /** Kopfneigung in Grad (positiv = nach rechts gekippt) */
  tilt?: number;
  /** Ohrwinkel: 0 = senkrecht, positiv = nach außen weggekippt */
  earL?: number;
  earR?: number;
  eye?: EyeState;
  eyeScale?: number;
  /** 0 = geschlossen, 1 = offen mit Zunge */
  mouth?: number;
  /** Schnauzenlänge, 1 = normal, kleiner für Chibi */
  snout?: number;
  hatInMouth?: boolean;
  wet?: boolean;
  blush?: number;
  /** Hals und Brust unter dem Kopf mitzeichnen */
  neck?: boolean;
  silhouette?: string;
  light?: [number, number];
};

const headPath = (k: number) => {
  const y = (v: number) => 40 + (v - 40) * k;
  return `M -72,-58 C -84,-20 -74,18 -56,${y(48)} C -40,${y(82)} -24,${y(122)} -20,${y(152)} C -17,${y(170)} 17,${y(170)} 20,${y(152)} C 24,${y(122)} 40,${y(82)} 56,${y(48)} C 74,18 84,-20 72,-58 C 52,-94 -52,-94 -72,-58 Z`;
};

const EAR_OUT =
  "M 42,8 C 34,-50 14,-130 2,-186 C -12,-130 -36,-50 -42,8 C -16,18 18,18 42,8 Z";
const EAR_IN =
  "M 30,0 C 22,-50 10,-118 2,-160 C -8,-118 -26,-50 -30,0 C -12,6 12,6 30,0 Z";

export const PodencoFace: React.FC<FaceProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  tilt = 0,
  earL = 0,
  earR = 0,
  eye = EYE_DEFAULT,
  eyeScale = 1,
  mouth = 0,
  snout = 1,
  hatInMouth,
  wet,
  blush = 0,
  neck,
  silhouette,
  light = [-0.6, -0.8],
}) => {
  const sil = silhouette;
  const k = snout;
  const noseY = 40 + (152 - 40) * k;

  const ear = (side: -1 | 1, angle: number) => {
    const flop = Math.min(1, Math.abs(angle) / 90);
    return (
      <g
        transform={`translate(${side * 50} -66) rotate(${side * (12 + angle)}) scale(${side} ${1 - flop * 0.1})`}
      >
        <Cel
          d={EAR_OUT}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={[light[0] * side, light[1]]}
          silhouette={sil}
          shadeOffset={12}
        />
        {!sil ? (
          <Cel
            d={EAR_IN}
            base={P.earPink}
            shade={P.earPinkShade}
            light={[-0.8, -0.3]}
            shadeOffset={9}
            stroke={null}
          >
            <circle cx={-6} cy={-60} r={5} fill={P.earSpot} />
            <circle cx={4} cy={-92} r={3.6} fill={P.earSpot} />
            <circle cx={-12} cy={-30} r={4} fill={P.earSpot} />
            <circle cx={8} cy={-40} r={2.6} fill={P.earSpot} />
            <circle cx={-2} cy={-122} r={2.4} fill={P.earSpot} />
          </Cel>
        ) : null}
      </g>
    );
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {neck ? (
        <Cel
          d="M -58,30 C -70,120 -104,230 -118,320 L 118,320 C 104,230 70,120 58,30 Z"
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={26}
        >
          {[
            [-60, 200, 2.4],
            [-40, 250, 2],
            [70, 220, 2.2],
            [50, 270, 1.8],
            [-80, 280, 2],
            [86, 290, 2.3],
          ].map(([fx, fy, r], i) => (
            <circle key={i} cx={fx} cy={fy} r={r} fill={P.freckle} />
          ))}
        </Cel>
      ) : null}
      <g transform={`rotate(${tilt} 0 90)`}>
        {ear(-1, earL)}
        {ear(1, earR)}
        <Cel
          d={headPath(k)}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={18}
          rimOffset={5}
        >
          {/* cremefarbener Fleck oben zwischen den Ohren */}
          <ellipse cx={0} cy={-74} rx={40} ry={18} fill={P.cream} />
          <circle cx={-52} cy={30} r={2} fill={P.freckle} />
          <circle cx={-44} cy={44} r={1.5} fill={P.freckle} />
          <circle cx={50} cy={36} r={1.8} fill={P.freckle} />
          <circle cx={-26} cy={-50} r={1.5} fill={P.freckle} />
        </Cel>
        {!sil ? (
          <>
            {blush > 0 ? (
              <g opacity={blush}>
                <ellipse cx={-50} cy={24} rx={16} ry={7} fill="#F29C9C" />
                <ellipse cx={50} cy={24} rx={16} ry={7} fill="#F29C9C" />
              </g>
            ) : null}
            {/* Nasenrücken, rosa Fleck, schwarze Nase */}
            <Ink
              d={`M -14,${noseY - 70 * k} C -12,${noseY - 40 * k} -14,${noseY - 20} -16,${noseY - 6}`}
              w={2}
            />
            <Ink
              d={`M 14,${noseY - 70 * k} C 12,${noseY - 40 * k} 14,${noseY - 20} 16,${noseY - 6}`}
              w={2}
            />
            <ellipse cx={0} cy={noseY - 22} rx={9} ry={5} fill={P.nosePink} />
            <Shape
              d={`M -20,${noseY - 6} C -20,${noseY - 18} 20,${noseY - 18} 20,${noseY - 6} C 20,${noseY + 8} 8,${noseY + 14} 0,${noseY + 14} C -8,${noseY + 14} -20,${noseY + 8} -20,${noseY - 6} Z`}
              fill={P.nose}
            />
            <ellipse
              cx={-8}
              cy={noseY - 8}
              rx={5}
              ry={3}
              fill="#fff"
              opacity={0.85}
            />
            {mouth > 0.1 ? (
              <>
                <Shape
                  d={`M -18,${noseY + 18} C -10,${noseY + 18 + mouth * 30} 10,${noseY + 18 + mouth * 30} 18,${noseY + 18} Z`}
                  fill="#7A2B34"
                />
                <Shape
                  d={`M -9,${noseY + 22} C -10,${noseY + 26 + mouth * 34} 10,${noseY + 26 + mouth * 34} 9,${noseY + 22} Z`}
                  fill="#F08A95"
                />
              </>
            ) : (
              <Ink
                d={`M -16,${noseY + 20} Q 0,${noseY + 26} 16,${noseY + 20}`}
              />
            )}
            <g transform={`translate(-44 -16) scale(${eyeScale})`}>
              <FrontEye s={eye} side={-1} />
            </g>
            <g transform={`translate(44 -16) scale(${eyeScale})`}>
              <FrontEye s={eye} side={1} />
            </g>
          </>
        ) : null}
        {hatInMouth ? (
          <Hat
            x={-4}
            y={noseY + 22}
            rot={-6}
            scale={1.05}
            wet={wet}
            silhouette={sil}
            light={light}
          />
        ) : null}
        {wet && !sil ? (
          <g
            fill={P.tear}
            stroke={P.ink}
            strokeWidth={2.5}
            vectorEffect="non-scaling-stroke"
          >
            <path d="M -70,40 q 7,14 0,20 q -7,-6 0,-20 Z" />
            <path d="M 64,56 q 6,12 0,17 q -6,-5 0,-17 Z" />
            <path d="M -24,-60 q 5,10 0,14 q -5,-4 0,-14 Z" />
          </g>
        ) : null}
      </g>
    </g>
  );
};
