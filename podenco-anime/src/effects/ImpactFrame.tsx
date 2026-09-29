import React from "react";
import { AbsoluteFill } from "remotion";
import { P } from "../lib/palette";
import { RadialSpeedlines } from "./Speedlines";

/**
 * Impact-Frame: 2-3 Frames, nur Schwarz/Weiß/Rot, harte Silhouetten.
 * Der Szeneninhalt wird per Schwellwert in zwei Töne zerlegt:
 *  Phase 0: Figur schwarz auf Rot, weiße Speedlines
 *  Phase 1: invertiert, Figur weiß auf Schwarz, rote Speedlines
 * threshold verschiebt die Schwelle (höher = mehr wird hell).
 */
export const ImpactFrame: React.FC<{
  frame: number;
  at: number;
  frames?: number;
  threshold?: number;
  cx?: number;
  cy?: number;
  children: React.ReactNode;
}> = ({
  frame,
  at,
  frames = 3,
  threshold = 1,
  cx = 960,
  cy = 540,
  children,
}) => {
  const t = frame - at;
  if (t < 0 || t >= frames) return <>{children}</>;
  const phase = t % 2;
  const bw = `grayscale(1) brightness(${threshold}) contrast(60)`;
  return (
    <AbsoluteFill
      style={{
        isolation: "isolate",
        background: phase === 0 ? P.impactRed : "#000",
      }}
    >
      <AbsoluteFill style={{ filter: phase === 0 ? `${bw} invert(1)` : bw }}>
        {children}
      </AbsoluteFill>
      {phase === 0 ? (
        <AbsoluteFill
          style={{ background: P.impactRed, mixBlendMode: "multiply" }}
        />
      ) : null}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: phase === 0 ? "normal" : "multiply",
        }}
      >
        {phase === 0 ? (
          <RadialSpeedlines
            frame={frame}
            cx={cx}
            cy={cy}
            count={70}
            inner={420}
            color="#fff"
            width={1.6}
          />
        ) : null}
      </svg>
      {phase === 1 ? (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <RadialSpeedlines
            frame={frame + 5}
            cx={cx}
            cy={cy}
            count={60}
            inner={460}
            color={P.impactRed}
            width={1.4}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
