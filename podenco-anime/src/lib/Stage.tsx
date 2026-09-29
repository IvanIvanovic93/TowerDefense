import React from "react";
import { AbsoluteFill } from "remotion";

/** SVG-Bühne 1920x1080 */
export const Stage: React.FC<{
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ children, bg, style }) => (
  <AbsoluteFill style={{ background: bg, overflow: "visible", ...style }}>
    <svg
      viewBox="0 0 1920 1080"
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);
