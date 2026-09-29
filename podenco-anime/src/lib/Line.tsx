import React from "react";
import { P, STROKE } from "./palette";

/** Konturlinie mit fester Bildschirmbreite (3px), unabhängig von der Skalierung */
export const Ink: React.FC<
  React.SVGProps<SVGPathElement> & { w?: number; color?: string }
> = ({ w = STROKE, color = P.ink, ...rest }) => (
  <path
    fill="none"
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    {...rest}
  />
);

/** Gefüllte Form mit Kontur */
export const Shape: React.FC<
  React.SVGProps<SVGPathElement> & {
    fill: string;
    w?: number;
    color?: string | null;
  }
> = ({ w = STROKE, color = P.ink, ...rest }) => (
  <path
    stroke={color ?? "none"}
    strokeWidth={w}
    strokeLinejoin="round"
    strokeLinecap="round"
    vectorEffect="non-scaling-stroke"
    {...rest}
  />
);
