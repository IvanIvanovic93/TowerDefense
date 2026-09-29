import React from "react";
import { Jitter } from "../lib/jitter";
import { Ink, LineScale } from "../effects/Ink";
import { C } from "../lib/palette";

/** Fisch vom Marktstand. Ursprung Körpermitte, Kopf rechts. */
export const Fisch: React.FC<{
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  tone?: number;
}> = ({ x, y, rot = 0, scale = 1, tone = 0 }) => (
  <LineScale.Provider value={scale}>
    <Jitter seed="fisch">
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
        <Ink
          d="M -40 0 L -62 -18 L -58 0 L -62 18 Z"
          fill={tone ? C.ocker : C.graublauDunkel}
          off={[2, 2]}
          w={3}
        />
        <Ink
          d="M -44 0 C -30 -18 10 -22 34 -10 C 44 -4 44 4 34 10 C 10 22 -30 18 -44 0 Z"
          fill={tone ? C.senf : "#A9BCC8"}
          off={[3, 2]}
        >
          <path
            d="M -44 2 C -20 16 10 18 40 6 L 40 20 L -44 20 Z"
            fill={tone ? C.ocker : C.graublau}
          />
        </Ink>
        <circle
          cx={26}
          cy={-4}
          r={3.4}
          fill={C.papier}
          stroke={C.ink}
          strokeWidth={2}
        />
        <circle cx={27} cy={-4} r={1.4} fill={C.ink} />
      </g>
    </Jitter>
  </LineScale.Provider>
);
