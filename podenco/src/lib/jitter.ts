import React from "react";
import { createContext, useContext } from "react";
import { random, useCurrentFrame } from "remotion";
import { onTwos } from "./twos";

/**
 * Stop-Motion-Zittern: ausgeschnittene Figuren liegen bei jeder Aufnahme minimal anders.
 * Wechselt auf twos. Liefert ein SVG-transform-Fragment.
 */
/** Optionale Uhr, z.B. um im Standbild auch das Zittern anzuhalten. */
export const JitterClock = createContext<number | null>(null);

export const useJitter = (seed: string, amp = 1.6, rotAmp = 0.5) => {
  const frame = useCurrentFrame();
  const clock = useContext(JitterClock);
  const t = onTwos(clock ?? frame);
  const x = (random(`${seed}x${t}`) - 0.5) * 2 * amp;
  const y = (random(`${seed}y${t}`) - 0.5) * 2 * amp;
  const r = (random(`${seed}r${t}`) - 0.5) * 2 * rotAmp;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)})`;
};

export const Jitter: React.FC<{
  seed: string;
  amp?: number;
  children: React.ReactNode;
}> = ({ seed, amp, children }) =>
  React.createElement("g", { transform: useJitter(seed, amp) }, children);
