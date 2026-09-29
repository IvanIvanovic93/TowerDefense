import React, { createContext, useContext, useId } from "react";
import { C } from "../lib/palette";

/** Linienstärke-Kontext: Figuren skalieren, Detailstreifen sollen trotzdem gleich breit wirken. */
export const LineScale = createContext(1);

/**
 * Papierstreifen für Details (Mund, Brauen, Wind). In der Kulisse (filter "boilBg")
 * nur als feine, halbtransparente Ritzlinie.
 */
export const InkLine: React.FC<{
  d: string;
  w?: number;
  filter?: string;
  color?: string;
}> = ({ d, w = 4, filter = "boil", color }) => {
  const k = useContext(LineScale);
  const bg = filter === "boilBg";
  const stroke = color ?? (bg ? "rgba(26,26,26,0.28)" : C.ink);
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={(bg ? w * 0.7 : w * 0.85) / k}
      strokeLinejoin="round"
      strokeLinecap="round"
      filter={bg ? undefined : `url(#${filter})`}
    />
  );
};

/**
 * Papierteil: ausgeschnittene Fläche mit Faser und Schlagschatten.
 * children (Schatten, Sprenkel) sind auf das Papier gedruckt und werden hineingeclippt.
 * off/w/line/noLine bleiben aus der Zeichentrick-Fassung als Schnittstelle erhalten, Konturen gibt es keine.
 */
export const Ink: React.FC<{
  d: string;
  fill: string;
  off?: [number, number];
  w?: number;
  noLine?: boolean;
  line?: string[];
  children?: React.ReactNode;
}> = ({ d, fill, children }) => {
  const id = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g filter="url(#paper)">
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
  );
};
