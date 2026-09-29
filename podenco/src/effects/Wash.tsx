import React from "react";
import { InkLine } from "./Ink";
import { roughPoly } from "../lib/rough";

type Pt = [number, number];

/** Papierfläche der Kulisse: eine Farbe, geschnittene Kante, flacher Schatten. Halbtransparent = Seidenpapier ohne Schatten. */
export const Wash: React.FC<{
  pts: Pt[];
  fill: string;
  seed: string;
  jitter?: number;
  opacity?: number;
}> = ({ pts, fill, seed, jitter = 8, opacity = 1 }) => (
  <path
    d={roughPoly(pts, seed, jitter)}
    fill={fill}
    opacity={opacity}
    filter={opacity < 1 ? undefined : "url(#wash)"}
  />
);

/** Feine Ritzlinie in der Kulisse. */
export const BgLine: React.FC<{
  pts: Pt[];
  seed: string;
  w?: number;
  closed?: boolean;
  jitter?: number;
}> = ({ pts, seed, w = 3.5, closed = true, jitter = 4 }) => (
  <InkLine d={roughPoly(pts, seed, jitter, closed)} w={w} filter="boilBg" />
);

/** Kulissenteil aus Papier (off/w/line aus der Zeichentrick-Fassung werden ignoriert). */
export const XeroShape: React.FC<{
  pts: Pt[];
  fill: string;
  seed: string;
  off?: Pt;
  w?: number;
  line?: boolean;
}> = ({ pts, fill, seed }) => (
  <Wash pts={pts} fill={fill} seed={seed} jitter={5} />
);
