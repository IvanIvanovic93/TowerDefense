import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { onTwos, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { WaterSplash } from "../effects/Splash";
import { Boat, Water } from "../sets/Harbor";
import { HouseRow } from "../sets/Buildings";
import { PaintGrain, SkyGradient } from "../sets/Sky";

/** 13: Hut landet im Hafenbecken */
export const Shot13Hafenbecken: React.FC = () => {
  const f = useCurrentFrame();
  const land = 14;
  const hatY =
    f < land
      ? range(f, 0, land, -80, 700)
      : 706 + Math.sin(onTwos(f) * 0.3) * 6;
  const hatX = f < land ? range(f, 0, land, 1300, 1000) : 1000;
  return (
    <Stage>
      <SkyGradient sunX={420} sunY={260} sunR={70} glow={1} />
      <HouseRow
        x0={-100}
        x1={2100}
        base={440}
        hMin={120}
        hMax={200}
        wMin={110}
        wMax={170}
        seed={71}
        backlit={0.4}
      />
      <rect
        x={-100}
        y={430}
        width={2120}
        height={40}
        fill={mix("#7A6F7E", P.night, 0.35)}
      />
      <rect
        x={-100}
        y={430}
        width={2120}
        height={5}
        fill={P.warmYellow}
        opacity={0.7}
      />
      <Water y={470} h={700} frame={f} glitterX={420} waveScale={1.6} />
      <Boat x={300} y={560} scale={1.3} frame={f} seed={4} hull={P.roofRed} />
      <Boat x={1700} y={590} scale={1.5} frame={f} seed={5} hull={P.deepBlue} />
      {/* Ringe auf dem Wasser */}
      {f >= land
        ? [0, 1, 2].map((i) => {
            const t = (f - land - i * 4) / 16;
            if (t <= 0) return null;
            return (
              <ellipse
                key={i}
                cx={1000}
                cy={720}
                rx={80 + t * 320}
                ry={20 + t * 70}
                fill="none"
                stroke="#BFEAF5"
                strokeWidth={5}
                opacity={Math.max(0, 1 - t)}
              />
            );
          })
        : null}
      <Hat
        x={hatX}
        y={hatY}
        scale={2}
        rot={f < land ? f * 30 : Math.sin(f * 0.2) * 6}
        spin={f < land ? f * 40 : 0}
        wet={f >= land}
      />
      <WaterSplash x={1000} y={720} t={(f - land) / 14} size={170} seed={4} />
      <PaintGrain opacity={0.1} />
    </Stage>
  );
};
