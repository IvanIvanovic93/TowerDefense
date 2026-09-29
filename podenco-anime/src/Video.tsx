import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Shot01Totale } from "./scenes/Shot01Totale";
import { Shot02Schlaf } from "./scenes/Shot02Schlaf";
import { Shot03Postbote } from "./scenes/Shot03Postbote";
import { Shot04Hut } from "./scenes/Shot04Hut";
import { Shot05Auge } from "./scenes/Shot05Auge";
import { Shot06Ohren } from "./scenes/Shot06Ohren";
import { Shot07Start } from "./scenes/Shot07Start";
import { Shot08Los } from "./scenes/Shot08Los";
import { Shot09Verfolgung } from "./scenes/Shot09Verfolgung";
import { Shot10Fischstand } from "./scenes/Shot10Fischstand";
import { Shot11Tauben } from "./scenes/Shot11Tauben";
import { Shot12Daecher } from "./scenes/Shot12Daecher";
import { Shot13Hafenbecken } from "./scenes/Shot13Hafenbecken";
import { Shot14Blick } from "./scenes/Shot14Blick";
import { Shot15Absprung } from "./scenes/Shot15Absprung";
import { Shot16Eintauchen } from "./scenes/Shot16Eintauchen";
import { Shot17Schwimmen } from "./scenes/Shot17Schwimmen";
import { Shot18Heldenlauf } from "./scenes/Shot18Heldenlauf";
import { Shot19Uebergabe } from "./scenes/Shot19Uebergabe";
import { Shot20Chibi } from "./scenes/Shot20Chibi";
import { Shot21Schluss } from "./scenes/Shot21Schluss";

/** Shotliste: [Start, Ende, Komponente]. Harte Schnitte, Timings hier anpassen. */
export const SHOTS: [number, number, React.FC][] = [
  [0, 45, Shot01Totale],
  [45, 75, Shot02Schlaf],
  [75, 105, Shot03Postbote],
  [105, 120, Shot04Hut],
  [120, 132, Shot05Auge],
  [132, 150, Shot06Ohren],
  [150, 180, Shot07Start],
  [180, 192, Shot08Los],
  [192, 270, Shot09Verfolgung],
  [270, 315, Shot10Fischstand],
  [315, 360, Shot11Tauben],
  [360, 420, Shot12Daecher],
  [420, 450, Shot13Hafenbecken],
  [450, 480, Shot14Blick],
  [480, 540, Shot15Absprung],
  [540, 555, Shot16Eintauchen],
  [555, 660, Shot17Schwimmen],
  [660, 720, Shot18Heldenlauf],
  [720, 780, Shot19Uebergabe],
  [780, 840, Shot20Chibi],
  [840, 900, Shot21Schluss],
];

export const PodencoAnime: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* Selbst synthetisierter Metal-Soundtrack, erzeugt mit scripts/soundtrack.mjs */}
    <Audio src={staticFile("soundtrack.wav")} />
    {SHOTS.map(([from, to, Comp], i) => (
      <Sequence
        key={i}
        from={from}
        durationInFrames={to - from}
        name={`Shot ${i + 1}`}
      >
        <Comp />
      </Sequence>
    ))}
  </AbsoluteFill>
);
