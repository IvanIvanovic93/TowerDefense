import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Globale SVG-Filter. Einmal pro Bild rendern, alle anderen SVGs verweisen per url(#…) darauf.
 * - boil: "Boiling Lines", Seed wechselt alle 3 Frames
 * - boilBg: dasselbe schwächer für Hintergrundlinien
 * - wash: statisch ausgefranste Aquarellkanten
 */
export const BoilDefs: React.FC<{ freezeAt?: number }> = ({ freezeAt = Infinity }) => {
  const frame = Math.min(useCurrentFrame(), freezeAt);
  const seed = Math.floor(frame / 3) % 97;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="boil" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="boilBg" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={seed + 11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wash" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
};
