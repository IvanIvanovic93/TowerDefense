import React from "react";
import { InkLine } from "./Ink";

/** Schlaf-"Z", steigen langsam auf. t auf twos. */
export const Zzz: React.FC<{ t: number; x: number; y: number; opacity?: number }> = ({ t, x, y, opacity = 1 }) => (
  <g opacity={opacity}>
    {[0, 1, 2].map((i) => {
      const lt = (t + i * 26) % 78;
      const s = 0.6 + lt / 78;
      const px = x + lt * 1.1 + Math.sin(lt / 8) * 10;
      const py = y - lt * 2.2;
      const o = lt < 10 ? lt / 10 : lt > 64 ? (78 - lt) / 14 : 1;
      return (
        <g key={i} transform={`translate(${px} ${py}) scale(${s})`} opacity={o}>
          <InkLine d="M -12 -12 L 12 -13 L -12 12 L 13 11" w={4} />
        </g>
      );
    })}
  </g>
);
