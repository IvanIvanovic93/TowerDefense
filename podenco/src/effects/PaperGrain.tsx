import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { onTwos } from "../lib/twos";

/** Papierkorn über dem ganzen Bild: feines Rauschen (wechselt auf twos) + ruhige Fasertextur. */
export const PaperGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = (onTwos(frame) / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} viewBox="0 0 960 540" preserveAspectRatio="none" style={{ position: "absolute", mixBlendMode: "multiply" }}>
        <defs>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.32  0 0 0 0 0.27  0 0 0 0 0.2  2.6 0 0 0 -1.15" />
          </filter>
          <filter id="fiber" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={3} seed={7} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  1.6 0 0 0 -0.75" />
          </filter>
        </defs>
        <rect width={960} height={540} filter="url(#fiber)" opacity={0.18} />
        <rect width={960} height={540} filter="url(#grain)" opacity={0.3} />
      </svg>
    </AbsoluteFill>
  );
};
