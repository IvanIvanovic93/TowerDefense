import React from "react";
import { useCurrentFrame } from "remotion";
import { PodencoFront } from "../characters/PodencoFront";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { Drop, WaterSplash } from "../effects/Splash";
import { Sparkle, SparkleField } from "../effects/Sparkles";
import { HouseRow } from "../sets/Buildings";
import { Water } from "../sets/Harbor";
import { SkyGradient } from "../sets/Sky";

/** 18: Heroischer Lauf aus dem Wasser Richtung Kamera, Tropfen glitzern im Gegenlicht */
export const Shot18Heldenlauf: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / 60;
  const scale = 0.55 * Math.pow(4.2, p);
  const ground = 640 + p * p * 520;
  const x = 960 + Math.sin(f * 0.1) * 20;
  const inWater = f < 26;
  return (
    <Stage>
      <SkyGradient sunX={360} sunY={180} sunR={110} glow={1.5} />
      <HouseRow
        x0={-100}
        x1={2100}
        base={520}
        hMin={100}
        hMax={180}
        wMin={90}
        wMax={150}
        seed={101}
        backlit={0.6}
      />
      <rect
        x={-100}
        y={510}
        width={2120}
        height={24}
        fill={mix("#7A6F7E", P.night, 0.5)}
      />
      <Water y={534} h={700} frame={f} glitterX={360} />
      {/* Slipanlage aus Stein, auf die der Hund zuläuft */}
      <path
        d={`M ${960 - 200},560 L ${960 + 200},560 L 2200,1200 L -280,1200 Z`}
        fill={mix("#6E6474", P.night, 0.45)}
      />
      <path
        d={`M ${960 - 200},560 L -280,1200`}
        stroke={P.warmYellow}
        strokeWidth={4}
        opacity={0.6}
      />
      {inWater ? (
        <path
          d={`M -100,${560 + f * 12} L 2100,${560 + f * 12} L 2100,1300 L -100,1300 Z`}
          fill={mix(P.harborGreen, P.deepBlue, 0.3)}
          opacity={0.85}
        />
      ) : null}
      <PodencoFront
        x={x}
        y={ground}
        scale={scale}
        run={f / 9}
        hatInMouth
        wet
        earL={0}
        earR={-4 + Math.sin(f * 0.7) * 8}
        eye={{ open: 1, pupil: 0.9, glint: 1.2, hard: 0.7 }}
        light={[-0.7, -0.7]}
      />
      {inWater
        ? [0, 1, 2].map((i) => (
            <WaterSplash
              key={i}
              x={x + (i - 1) * 90 * scale}
              y={ground}
              t={((f + i * 4) % 12) / 12}
              size={110 * scale}
              seed={i + 5}
            />
          ))
        : null}
      {/* abfallende, glitzernde Tropfen */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = ((f * 1.4 + i * 7) % 20) / 20;
        const dx = x + (rand(i * 3.3) - 0.5) * 360 * scale;
        const dy = ground - (120 + rand(i) * 260) * scale + t * 200 * scale;
        return (
          <g key={i}>
            <Drop x={dx} y={dy} size={6 * scale + 4} />
            {rand(i * 7 + Math.floor(f / 2)) > 0.6 ? (
              <Sparkle
                x={dx + 8}
                y={dy - 10}
                size={28 * scale + 10}
                rot={f * 10}
                color="#FFF6D8"
              />
            ) : null}
          </g>
        );
      })}
      <SparkleField
        frame={f}
        count={12}
        x={x - 300 * scale}
        y={ground - 420 * scale}
        w={600 * scale}
        h={380 * scale}
        size={40 * scale + 16}
        seed={17}
        period={12}
      />
    </Stage>
  );
};
