import React from "react";
import { InkLine } from "./Ink";
import { C } from "../lib/palette";

/** Eine animierte Wellenlinie (Zeichentrick-Bögen), Phase läuft mit t (twos). */
export const WaveLine: React.FC<{ x0: number; x1: number; y: number; t: number; amp?: number; len?: number; speed?: number; w?: number; seg?: [number, number] }> = ({
  x0,
  x1,
  y,
  t,
  amp = 8,
  len = 90,
  speed = 3,
  w = 3.2,
}) => {
  const shift = (t * speed) % len;
  let d = "";
  for (let x = x0 - len + shift; x < x1; x += len) {
    // nur jeder Bogen einzeln, mit Lücke: wirkt handgezeichnet
    d += `M ${x.toFixed(1)} ${y} q ${(len * 0.25).toFixed(1)} ${-amp} ${(len * 0.5).toFixed(1)} 0 `;
  }
  return <InkLine d={d} w={w} filter="boilBg" />;
};

/** Wasserfläche mit gewellter Oberkante (flach, eine Farbe) + Wellenreihen. */
export const WaterBody: React.FC<{ x0: number; x1: number; y: number; bottom: number; t: number; fill?: string; opacity?: number; rows?: number }> = ({
  x0,
  x1,
  y,
  bottom,
  t,
  fill = C.wasser,
  opacity = 1,
  rows = 4,
}) => {
  const len = 80;
  const shift = ((t * 2) % len) - len;
  let top = `M ${x0 + shift - len} ${bottom} L ${x0 + shift - len} ${y}`;
  for (let x = x0 + shift - len; x < x1 + len; x += len) top += ` q ${len / 4} -10 ${len / 2} 0 q ${len / 4} 8 ${len / 2} 0`;
  top += ` L ${x1 + len} ${bottom} Z`;
  return (
    <g>
      <path d={top} fill={fill} opacity={opacity} />
      <InkLine d={top.replace(/ L [^ ]+ [^ ]+ Z$/, "")} w={3.4} filter="boilBg" />
      {Array.from({ length: rows }, (_, i) => (
        <WaveLine key={i} x0={x0} x1={x1} y={y + 40 + i * ((bottom - y - 40) / rows)} t={t + i * 7} speed={i % 2 ? -3 : 3} amp={6 + i * 2} len={100 + i * 30} />
      ))}
    </g>
  );
};
