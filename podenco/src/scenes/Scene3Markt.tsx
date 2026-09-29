import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Fisch } from "../characters/Fisch";
import { Hat } from "../characters/Hat";
import { Podenco } from "../characters/Podenco";
import { blend, JUMP, run } from "../characters/podencoPoses";
import { Taube } from "../characters/Taube";
import { XeroShape, BgLine } from "../effects/Wash";
import { C } from "../lib/palette";
import { lerpC } from "../lib/math";
import { onTwos } from "../lib/twos";
import { FishStandBack, FishStandFront } from "./sets/FishStand";
import { MARKET_GROUND, MarketFar, MarketGround, MarketMid } from "./sets/MarketSet";

const SPEED = 14;
const STAND_X = 2150;
const J0 = 88;
const J1 = 112;
const HIT = 100;
const DOG_SCALE = 0.95;

const dogScreenX = (t: number) => lerpC(t, [0, 40, 210], [420, 640, 760]);
const dogWorldX = (t: number) => dogScreenX(t) + SPEED * t;

const FISH = Array.from({ length: 8 }, (_, i) => ({
  x0: STAND_X - 170 + i * 46,
  y0: MARKET_GROUND - 206,
  vx: 3 + random(`fvx${i}`) * 16,
  vy: -20 - random(`fvy${i}`) * 16,
  spin: (random(`fsp${i}`) - 0.5) * 50,
  tone: i % 3 === 0 ? 1 : 0,
}));

const PIGEONS = Array.from({ length: 6 }, (_, i) => {
  const x = 2980 + i * 70 + random(`px${i}`) * 40;
  let tk = 0;
  while (dogWorldX(tk) < x - 320 && tk < 400) tk++;
  tk += Math.floor(random(`pd${i}`) * 4);
  return { x, tk, vx: 4 + random(`pvx${i}`) * 10, vy: 14 + random(`pvy${i}`) * 8, flip: i % 3 === 0 };
});

/** Szene 3 (270-480): Jagd über den Marktplatz, Parallax in 3 Ebenen. */
export const Scene3Markt: React.FC = () => {
  const f = useCurrentFrame();
  const t = onTwos(f);
  const cam = SPEED * f; // Kamera auf ones

  // Hund
  const inJump = t >= J0 && t <= J1;
  const jp = (t - J0) / (J1 - J0);
  let pose = run(Math.floor(t / 2));
  if (inJump) pose = blend(run(0), JUMP, Math.sin(Math.PI * Math.min(1, jp * 1.3)) * 0.9 + 0.1);
  const dogY = MARKET_GROUND + 6 - (inJump ? Math.sin(Math.PI * jp) * 190 : 0);
  const dogX = dogWorldX(t);

  // Hut tanzt knapp vor der Nase
  const hatX = dogX + 330 + Math.sin(t / 9) * 40;
  const hatY = 560 + Math.sin(t / 6) * 60 - (inJump ? Math.sin(Math.PI * jp) * 120 : 0);
  const hatRot = Math.sin(t / 5) * 32;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <g transform={`translate(${-cam * 0.15} 0)`}>
          <MarketFar />
        </g>
        <g transform={`translate(${-cam * 0.5} 0)`}>
          <MarketMid />
        </g>
        <g transform={`translate(${-cam} 0)`}>
          <MarketGround width={4800} />
          <FishStandBack x={STAND_X} y={MARKET_GROUND} />
          {PIGEONS.map((p, i) => {
            const dt = t - p.tk;
            if (dt < 0) return <Taube key={i} x={p.x} y={MARKET_GROUND - 20} scale={0.8} sitting peck={(t / 2 + i) % 6 < 2} flip={p.flip} />;
            return (
              <Taube
                key={i}
                x={p.x + dt * p.vx}
                y={MARKET_GROUND - 20 - dt * p.vy + dt * dt * 0.05}
                scale={0.8}
                flap={(t / 2 + i) % 2}
                rot={-18}
              />
            );
          })}
          <Podenco pose={pose} x={dogX} y={dogY} scale={DOG_SCALE} />
          <FishStandFront x={STAND_X} y={MARKET_GROUND} tip={lerpC(t, [HIT, HIT + 8], [0, 28])} />
          {FISH.map((fi, i) => {
            const dt = Math.max(0, t - HIT);
            let x = fi.x0 + fi.vx * dt;
            let y = fi.y0 + fi.vy * dt + 1.1 * dt * dt;
            let rot = fi.spin * dt;
            if (dt > 0 && y > MARKET_GROUND - 12) {
              // gelandet: liegen bleiben
              let land = 0;
              while (fi.y0 + fi.vy * land + 1.1 * land * land < MARKET_GROUND - 12) land += 1;
              x = fi.x0 + fi.vx * land;
              y = MARKET_GROUND - 12 + (i % 3) * 14;
              rot = i % 2 ? 180 : 0;
            }
            if (dt === 0) rot = (i % 2) * 180 + (i - 4) * 3;
            return <Fisch key={i} x={x} y={y} rot={rot} scale={0.8} tone={fi.tone} />;
          })}
          <Hat x={hatX} y={hatY} rot={hatRot} scale={1.05} />
        </g>
        {/* Ebene 3: Vordergrund, schneller als der Boden */}
        <g transform={`translate(${-cam * 1.5} 0)`}>
          {[1500, 3400, 5200].map((x, i) => (
            <g key={i}>
              <XeroShape pts={[[x, 1100], [x + 6, 520], [x + 40, 520], [x + 46, 1100]]} fill={C.gruenDunkel} seed={`pfahl${i}`} />
              <XeroShape pts={[[x - 30, 520], [x + 76, 520], [x + 60, 460], [x - 14, 460]]} fill={C.senf} seed={`lampe${i}`} />
            </g>
          ))}
          {[900, 2500, 4300].map((x, i) => (
            <g key={i}>
              <XeroShape pts={[[x, 1100], [x + 10, 980], [x + 220, 976], [x + 230, 1100]]} fill={C.ockerDunkel} seed={`korb${i}`} />
              <BgLine pts={[[x + 14, 1020], [x + 220, 1016]]} seed={`korbl${i}`} closed={false} w={3} />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
