import React from "react";
import { Jitter } from "../lib/jitter";
import { Ink, InkLine, LineScale } from "../effects/Ink";
import { C } from "../lib/palette";

/**
 * Flacher Schirmhut des Postboten, eigenständiges Objekt.
 * Ursprung: Mitte der Hutunterkante, Schirm zeigt nach rechts.
 */
export const HatShape: React.FC<{ wet?: boolean }> = ({ wet }) => (
  <g>
    {/* Schirm */}
    <Ink
      d="M 18 -8 C 50 -12 78 -6 86 2 C 70 8 40 8 16 4 Z"
      fill={C.ockerDunkel}
      off={[3, 2]}
      w={3.5}
    />
    {/* Krone: flach und breit */}
    <Ink
      d="M -52 -2 C -56 -18 -58 -34 -48 -44 C -20 -56 30 -56 58 -44 C 66 -34 62 -18 56 -2 C 20 4 -20 4 -52 -2 Z"
      fill={wet ? "#C9A043" : C.senf}
      off={[4, 3]}
    >
      <path
        d="M -60 -12 C -20 -6 20 -6 64 -12 L 64 6 L -60 6 Z"
        fill={C.rost}
      />
      <path
        d="M -52 -44 C -60 -30 -58 -14 -52 0 L -40 0 C -44 -16 -46 -30 -40 -46 Z"
        fill={C.ocker}
      />
    </Ink>
    <InkLine d="M -55 -12 C -20 -6 20 -6 60 -12" w={3} />
    {/* Posthorn-Abzeichen */}
    <circle cx={8} cy={-30} r={6} fill={C.ockerDunkel} />
    <InkLine d="M 2 -30 C 2 -38 14 -38 14 -30 C 14 -24 6 -24 6 -29" w={2.2} />
  </g>
);

export const Hat: React.FC<{
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  wet?: boolean;
  flip?: boolean;
}> = ({ x, y, rot = 0, scale = 1, wet, flip }) => (
  <LineScale.Provider value={scale}>
    <Jitter seed="hut">
      <g
        transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`}
      >
        <HatShape wet={wet} />
      </g>
    </Jitter>
  </LineScale.Provider>
);
