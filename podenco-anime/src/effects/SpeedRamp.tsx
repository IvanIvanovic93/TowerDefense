import React from "react";
import { Freeze } from "remotion";

/**
 * Speed Ramp: Zeitlupe bis rampAt, danach schlagartig volle (oder höhere) Geschwindigkeit.
 * Liefert die Szenenzeit zu einem Frame.
 */
export const speedRamp = (
  frame: number,
  rampAt: number,
  slow = 0.2,
  fast = 1,
) => {
  if (frame < rampAt) return frame * slow;
  return rampAt * slow + (frame - rampAt) * fast;
};

/** Variante als Komponente: Kinder sehen die umgerechnete Zeit über useCurrentFrame() */
export const SpeedRamp: React.FC<{
  frame: number;
  rampAt: number;
  slow?: number;
  fast?: number;
  children: React.ReactNode;
}> = ({ frame, rampAt, slow = 0.2, fast = 1, children }) => (
  <Freeze frame={speedRamp(frame, rampAt, slow, fast)}>{children}</Freeze>
);
