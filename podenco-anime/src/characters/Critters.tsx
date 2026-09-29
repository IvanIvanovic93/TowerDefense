import React from "react";
import { Cel } from "../lib/Cel";
import { Shape } from "../lib/Line";
import { P } from "../lib/palette";

/** Taube in Seitenansicht (Blick nach rechts). flap: -1 (Flügel unten) .. 1 (oben) */
export const Pigeon: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flap?: number;
  rot?: number;
  flip?: boolean;
}> = ({ x, y, scale = 1, flap = 0, rot = 0, flip }) => {
  const wingRot = -flap * 70;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <g transform={`rotate(${wingRot + 20} -6 -10)`}>
        <Cel
          d="M -6,-10 C -30,-60 -80,-70 -110,-60 C -80,-40 -50,-20 -14,4 Z"
          base="#7E8EA6"
          shade="#5C6B82"
          shadeOffset={8}
        />
      </g>
      <Cel d="M -58,6 L -84,20 L -80,-4 Z" base="#5C6B82" shade="#46546A" />
      <Cel
        d="M -60,4 C -50,-24 0,-34 30,-20 C 50,-10 46,16 20,22 C -10,28 -44,22 -60,4 Z"
        base="#9AA9BE"
        shade="#6F7F97"
        rim="#E6EEF7"
        shadeOffset={10}
      />
      <Cel
        d="M 18,-10 C 20,-36 34,-46 48,-40 C 60,-34 58,-14 44,-6 C 34,0 24,-2 18,-10 Z"
        base="#6BA89A"
        shade="#8A6BA8"
        shadeOffset={8}
      />
      <Shape d="M 56,-32 L 70,-28 L 56,-24 Z" fill="#F2A65A" />
      <circle
        cx={48}
        cy={-32}
        r={3.4}
        fill="#F28C38"
        stroke={P.ink}
        strokeWidth={1.5}
      />
      <g transform={`rotate(${wingRot} -4 -6)`}>
        <Cel
          d="M -4,-6 C -24,-50 -72,-64 -104,-50 C -76,-30 -44,-10 -10,10 Z"
          base="#B2C0D3"
          shade="#7E8EA6"
          rim="#EEF3F9"
          shadeOffset={8}
        />
      </g>
    </g>
  );
};

/** Fisch. bend: Schwanzschlag -1..1 */
export const Fish: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  bend?: number;
  kind?: 0 | 1 | 2;
}> = ({ x, y, scale = 1, rot = 0, bend = 0, kind = 0 }) => {
  const col = [
    ["#C3D1DF", "#7F95AD", "#EAF1F8"],
    ["#F28C38", "#C0601D", "#FFD2A6"],
    ["#E0C35A", "#A98B2A", "#FFF0B0"],
  ][kind];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <g transform={`rotate(${bend * 25} -60 0)`}>
        <Cel
          d="M -58,0 L -96,-26 C -90,-8 -90,8 -96,26 Z"
          base={col[1]}
          shade={col[1]}
        />
      </g>
      <Cel
        d="M -64,0 C -40,-30 30,-38 70,-6 C 74,0 74,6 70,8 C 30,36 -40,30 -64,0 Z"
        base={col[0]}
        shade={col[1]}
        rim={col[2]}
        shadeOffset={12}
        light={[0, -1]}
      >
        <path
          d="M -40,-4 C 0,-10 40,-8 70,0"
          stroke={col[1]}
          strokeWidth={4}
          fill="none"
        />
      </Cel>
      <Shape d="M -10,-26 L 10,-44 L 22,-24 Z" fill={col[1]} />
      <circle
        cx={48}
        cy={-6}
        r={7}
        fill="#fff"
        stroke={P.ink}
        strokeWidth={2}
      />
      <circle cx={50} cy={-6} r={3.5} fill={P.ink} />
    </g>
  );
};
