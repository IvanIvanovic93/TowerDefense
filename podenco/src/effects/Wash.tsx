import React from "react";
import { InkLine } from "./Ink";
import { roughPoly } from "../lib/rough";

type Pt = [number, number];

/** Flache Aquarellfläche: eine Farbe, ausgefranste Kante, keine Verläufe. */
export const Wash: React.FC<{ pts: Pt[]; fill: string; seed: string; jitter?: number; opacity?: number }> = ({
  pts,
  fill,
  seed,
  jitter = 8,
  opacity = 1,
}) => <path d={roughPoly(pts, seed, jitter)} fill={fill} opacity={opacity} filter="url(#wash)" />;

/** Tuschelinie für Hintergründe (schwächer boilend). */
export const BgLine: React.FC<{ pts: Pt[]; seed: string; w?: number; closed?: boolean; jitter?: number }> = ({
  pts,
  seed,
  w = 3.5,
  closed = true,
  jitter = 4,
}) => <InkLine d={roughPoly(pts, seed, jitter, closed)} w={w} filter="boilBg" />;

/**
 * Xerografie-Fläche für Hintergründe: Aquarellfläche leicht versetzt, Kontur darüber.
 */
export const XeroShape: React.FC<{ pts: Pt[]; fill: string; seed: string; off?: Pt; w?: number; line?: boolean }> = ({
  pts,
  fill,
  seed,
  off = [7, 5],
  w = 3.5,
  line = true,
}) => (
  <g>
    <g transform={`translate(${off[0]} ${off[1]})`}>
      <Wash pts={pts} fill={fill} seed={seed} />
    </g>
    {line ? <BgLine pts={pts} seed={seed + "l"} w={w} /> : null}
  </g>
);
