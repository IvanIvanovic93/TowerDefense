import React, { createContext, useContext, useId } from "react";
import { C } from "../lib/palette";

/** Linienstärke-Kontext: Figuren skalieren, die Tuschelinie soll aber 3-5 px bleiben. */
export const LineScale = createContext(1);

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** Skizzenhafte Kontur: Grundstrich plus unregelmäßig gestrichelter Druckstrich, beide "boilend". */
export const InkLine: React.FC<{ d: string; w?: number; filter?: string; color?: string }> = ({
  d,
  w = 4,
  filter = "boil",
  color = C.ink,
}) => {
  const k = useContext(LineScale);
  const base = w / k;
  const off = hash(d) % 97;
  return (
    <g filter={`url(#${filter})`}>
      <path d={d} fill="none" stroke={color} strokeWidth={base * 0.8} strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={base * 1.35}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={`${34 / k} ${20 / k} ${10 / k} ${28 / k} ${52 / k} ${16 / k}`}
        strokeDashoffset={off / k}
      />
    </g>
  );
};

/**
 * Xerografie-Teil: Farbfläche leicht versetzt zur Kontur, darüber die zitternde Tuschelinie.
 * children werden in die Farbfläche geclippt (Cel-Schatten, Sprenkel).
 */
export const Ink: React.FC<{
  d: string;
  fill: string;
  off?: [number, number];
  w?: number;
  noLine?: boolean;
  /** eigene (offene) Konturpfade statt des Flächenumrisses */
  line?: string[];
  children?: React.ReactNode;
}> = ({ d, fill, off = [4, 3], w = 4, noLine, line, children }) => {
  const id = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      <g transform={`translate(${off[0]} ${off[1]})`}>
        <path d={d} fill={fill} />
        {children ? (
          <>
            <clipPath id={id}>
              <path d={d} />
            </clipPath>
            <g clipPath={`url(#${id})`}>{children}</g>
          </>
        ) : null}
      </g>
      {noLine ? null : line ? line.map((l, i) => <InkLine key={i} d={l} w={w} />) : <InkLine d={d} w={w} />}
    </g>
  );
};
