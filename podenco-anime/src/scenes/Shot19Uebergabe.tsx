import React from "react";
import { useCurrentFrame } from "remotion";
import { Hat } from "../characters/Hat";
import { Podenco, grounded } from "../characters/Podenco";
import { STAND } from "../characters/podencoPoses";
import { PodencoFront } from "../characters/PodencoFront";
import { Postbote } from "../characters/Postbote";
import { onTwos, range } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { Stage } from "../lib/Stage";
import { SparkleField, Sparkle } from "../effects/Sparkles";
import { StreetSet } from "../sets/Street";
import { PaintGrain } from "../sets/Sky";

/** 19: Hund legt Hut vor dem Postboten ab, sitzt stolz. Postbote bekommt Anime-Tränen der Rührung */
export const Shot19Uebergabe: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  const ground = 930;
  const placed = f >= 12;
  const sitting = f >= 20;
  const lower = range(f, 0, 10, 0, 1);
  const bending = {
    ...STAND,
    neck: 32 + lower * 50,
    head: 6 + lower * 36,
    earN: 0,
    earF: -50,
    eye: { open: 1, pupil: 1, glint: 1 },
  };
  const expression = f < 16 ? "shock" : "cry";
  return (
    <Stage>
      <StreetSet ground={ground + 40} backlit={0.55} />
      <rect
        x={-100}
        y={-100}
        width={2120}
        height={1280}
        fill={P.night}
        opacity={0.25}
      />
      {sitting ? (
        <>
          <rect
            x={-100}
            y={-100}
            width={2120}
            height={1280}
            fill={mix(P.roofRed, P.night, 0.55)}
            opacity={0.35}
          />
          <SparkleField
            frame={f}
            count={18}
            x={0}
            y={60}
            w={1920}
            h={700}
            size={50}
            seed={3}
            period={16}
            colors={["#FFD166", "#fff", "#E8B4A8"]}
          />
        </>
      ) : null}
      <Postbote
        x={560}
        y={ground}
        scale={1.55}
        hat={false}
        expression={expression}
        frame={f}
        sweat={f < 16 ? 0.6 : 0}
        armsUp={sitting ? 0.35 : 0}
      />
      {placed ? <Hat x={1000} y={ground - 22} scale={1.5} wet /> : null}
      {!sitting ? (
        <Podenco
          pose={grounded(bending)}
          x={1340}
          y={ground}
          scale={1.45}
          flip
          hatInMouth={!placed}
          wet
        />
      ) : (
        <>
          <PodencoFront
            x={1400}
            y={ground}
            scale={1.25}
            sit
            chestUp={10}
            eye={{ open: 0, pupil: 1, glint: 1 }}
            blush={0.9}
            mouth={0.35}
            earL={0}
            earR={f >= 34 ? 70 : 0}
            tail={Math.sin(f * 0.8)}
          />
          {f < 24 ? (
            <Sparkle
              x={1400}
              y={ground - 300}
              size={range(f, 20, 24, 500, 60)}
              rot={f * 10}
              color="#fff"
            />
          ) : null}
        </>
      )}
      <PaintGrain opacity={0.08} />
    </Stage>
  );
};
