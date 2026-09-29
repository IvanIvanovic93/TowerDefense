import React from "react";
import { Jitter } from "../lib/jitter";
import { Ink, InkLine, LineScale } from "../effects/Ink";
import { C } from "../lib/palette";

/** Taube, Blick nach rechts. flap: 0 = Flügel oben, 1 = Flügel unten; sitting = am Boden pickend. */
export const Taube: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flap?: number;
  sitting?: boolean;
  peck?: boolean;
  flip?: boolean;
  rot?: number;
}> = ({ x, y, scale = 1, flap = 0, sitting, peck, flip, rot = 0 }) => (
  <LineScale.Provider value={scale}>
    <Jitter seed="taube">
      <g
        transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`}
      >
        {!sitting ? (
          <Ink
            d={
              flap === 0
                ? "M -10 -30 C -30 -80 -60 -96 -70 -92 C -50 -60 -34 -40 -24 -24 Z"
                : "M -10 -24 C -40 -10 -64 10 -70 20 C -44 16 -26 4 -18 -12 Z"
            }
            fill={C.graublauDunkel}
            off={[3, 2]}
            w={3}
          />
        ) : null}
        {/* Körper */}
        <Ink
          d="M -46 -30 C -40 -46 -10 -52 10 -44 C 22 -40 30 -30 26 -20 C 16 -8 -20 -8 -40 -18 L -58 -16 Z"
          fill={C.graublau}
          off={[3, 2]}
          w={3}
        >
          <path
            d="M -40 -20 C -20 -12 10 -12 26 -22 L 30 -6 L -40 -6 Z"
            fill={C.graublauDunkel}
          />
        </Ink>
        {/* Kopf */}
        <g transform={peck ? "translate(18 10) rotate(50)" : undefined}>
          <Ink
            d="M 10 -44 C 10 -64 34 -66 36 -50 C 38 -42 30 -36 20 -38 Z"
            fill={C.graublau}
            off={[2, 2]}
            w={3}
          />
          <path d="M 35 -52 L 46 -48 L 35 -45 Z" fill={C.ocker} />
          <circle cx={26} cy={-53} r={2.4} fill={C.ink} />
          <path
            d="M 12 -42 C 18 -38 26 -38 30 -40 L 26 -34 C 20 -32 14 -34 12 -38 Z"
            fill={C.gruen}
            opacity={0.8}
          />
        </g>
        {sitting ? (
          <>
            <InkLine d="M -6 -12 L -8 0 M 6 -12 L 8 0" w={2.6} />
            <Ink
              d="M -20 -34 C -10 -44 10 -42 16 -30 C 0 -24 -14 -26 -20 -34 Z"
              fill={C.graublauDunkel}
              off={[2, 1]}
              w={2.5}
            />
          </>
        ) : (
          <Ink
            d={
              flap === 0
                ? "M 0 -32 C -10 -80 -30 -110 -44 -112 C -30 -70 -18 -44 -12 -26 Z"
                : "M 0 -26 C -20 -4 -40 20 -48 34 C -24 26 -10 6 -4 -14 Z"
            }
            fill={C.graublau}
            off={[3, 2]}
            w={3}
          />
        )}
      </g>
    </Jitter>
  </LineScale.Provider>
);
