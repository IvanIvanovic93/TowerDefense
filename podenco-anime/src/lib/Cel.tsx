import React, { useId } from "react";
import { P, STROKE } from "./palette";

type CelProps = {
  d: string;
  base: string;
  shade: string;
  rim?: string;
  /** Lichtrichtung (zeigt ZUR Lichtquelle), Standard: Gegenlicht von links oben */
  light?: [number, number];
  shadeOffset?: number;
  rimOffset?: number;
  stroke?: string | null;
  strokeWidth?: number;
  /** Zusätzliche Inhalte, auf die Form zugeschnitten (Sprenkel, Flecken) */
  children?: React.ReactNode;
  silhouette?: string;
};

/**
 * Cel-Shading mit genau zwei Tonstufen: Grundfarbe + harter Schatten.
 * Der Schatten ist die Form minus eine zum Licht verschobene Kopie,
 * das Glanzlicht die Form minus eine vom Licht weg verschobene Kopie.
 */
export const Cel: React.FC<CelProps> = ({
  d,
  base,
  shade,
  rim,
  light = [-0.6, -0.8],
  shadeOffset = 14,
  rimOffset = 4,
  stroke = P.ink,
  strokeWidth = STROKE,
  children,
  silhouette,
}) => {
  const id = useId().replace(/:/g, "");
  if (silhouette) {
    return (
      <path
        d={d}
        fill={silhouette}
        stroke={silhouette}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  }
  const [lx, ly] = light;
  return (
    <g>
      <defs>
        <clipPath id={`c${id}`}>
          <path d={d} />
        </clipPath>
        <mask
          id={`s${id}`}
          maskUnits="userSpaceOnUse"
          x="-5000"
          y="-5000"
          width="10000"
          height="10000"
        >
          <path d={d} fill="#fff" />
          <path
            d={d}
            fill="#000"
            transform={`translate(${lx * shadeOffset} ${ly * shadeOffset})`}
          />
        </mask>
        {rim ? (
          <mask
            id={`r${id}`}
            maskUnits="userSpaceOnUse"
            x="-5000"
            y="-5000"
            width="10000"
            height="10000"
          >
            <path d={d} fill="#fff" />
            <path
              d={d}
              fill="#000"
              transform={`translate(${-lx * rimOffset} ${-ly * rimOffset})`}
            />
          </mask>
        ) : null}
      </defs>
      <path d={d} fill={base} />
      <path d={d} fill={shade} mask={`url(#s${id})`} />
      {children ? <g clipPath={`url(#c${id})`}>{children}</g> : null}
      {rim ? <path d={d} fill={rim} mask={`url(#r${id})`} /> : null}
      {stroke ? (
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </g>
  );
};
