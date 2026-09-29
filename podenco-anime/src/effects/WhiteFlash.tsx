import React from "react";
import { AbsoluteFill } from "remotion";

/** Weißblitz für Smash Cuts: 1-2 Frames reines Weiß */
export const WhiteFlash: React.FC<{
  frame: number;
  at: number;
  frames?: number;
  color?: string;
}> = ({ frame, at, frames = 2, color = "#fff" }) => {
  if (frame < at || frame >= at + frames) return null;
  return <AbsoluteFill style={{ background: color }} />;
};
