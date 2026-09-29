import React, { useId } from "react";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { HouseRow } from "./Buildings";
import { Cloud, SkyGradient } from "./Sky";

/** Hafenwasser mit Sonnenglitzern und laufenden Wellenlinien */
export const Water: React.FC<{
  y: number;
  h?: number;
  frame: number;
  glitterX?: number;
  top?: string;
  bottom?: string;
  x?: number;
  w?: number;
  waveScale?: number;
}> = ({
  y,
  h = 600,
  frame,
  glitterX = 520,
  top = P.harborGreen,
  bottom = P.deepBlue,
  x = -400,
  w = 2720,
  waveScale = 1,
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <linearGradient id={`w${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={mix(top, P.warmYellow, 0.25)} />
          <stop offset="0.25" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#w${id})`} />
      {/* Wellenlinien */}
      {Array.from({ length: 16 }).map((_, i) => {
        const wy = y + 10 + Math.pow(i / 16, 1.6) * h;
        const amp = (3 + i * 0.8) * waveScale;
        const len = (80 + i * 16) * waveScale;
        const shift = (frame * (2 + i * 0.3)) % len;
        let d = `M ${x - len + shift},${wy}`;
        for (let px = x - len; px < x + w + len; px += len / 2) {
          d += ` q ${len / 4},${-amp} ${len / 2},0`;
        }
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={mix(top, "#BFEAF5", 0.35)}
            strokeWidth={2 + i * 0.25}
            opacity={0.5}
          />
        );
      })}
      {/* Sonnenglitzern: kurze Striche in einer Säule unter der Sonne */}
      {Array.from({ length: 46 }).map((_, i) => {
        const gy = y + 6 + rand(i * 3.3) * h * 0.8;
        const spread = 30 + (gy - y) * 0.35;
        const flick = rand(i * 7.1 + Math.floor(frame / 2) * 1.37);
        if (flick < 0.35) return null;
        const gx = glitterX + (rand(i * 5.7) - 0.5) * spread * 2;
        const len = 14 + rand(i) * 40;
        return (
          <rect
            key={i}
            x={gx - len / 2}
            y={gy}
            width={len}
            height={3 + rand(i * 2) * 3}
            fill={flick > 0.8 ? "#FFF6D8" : P.warmYellow}
          />
        );
      })}
    </g>
  );
};

export const Boat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  hull?: string;
  frame?: number;
  seed?: number;
  haze?: number;
}> = ({ x, y, scale = 1, hull = P.roofRed, frame = 0, seed = 1, haze = 0 }) => {
  const rock = Math.sin(frame * 0.12 + seed) * 2.5;
  const h = mix(hull, "#8FB6D9", haze);
  return (
    <g
      transform={`translate(${x} ${y + Math.sin(frame * 0.1 + seed) * 3}) rotate(${rock}) scale(${scale})`}
    >
      <rect
        x={-6}
        y={-160}
        width={6}
        height={150}
        fill={mix("#4A3B32", "#8FB6D9", haze)}
      />
      <path
        d="M 0,-150 L 70,-40 L 0,-40 Z"
        fill={mix("#EFE3C8", "#8FB6D9", haze * 0.6 + 0.2)}
      />
      <rect
        x={-50}
        y={-44}
        width={44}
        height={30}
        fill={mix("#E9DCC4", "#8FB6D9", haze + 0.2)}
      />
      <path d="M -90,-16 L 90,-16 L 70,16 L -70,16 Z" fill={h} />
      <rect
        x={-90}
        y={-18}
        width={180}
        height={6}
        fill={mix(P.warmYellow, "#8FB6D9", haze)}
      />
    </g>
  );
};

/** Leuchtturm auf der Mole */
export const Lighthouse: React.FC<{
  x: number;
  y: number;
  scale?: number;
  haze?: number;
}> = ({ x, y, scale = 1, haze = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M -34,0 L -22,-240 L 22,-240 L 34,0 Z"
      fill={mix("#E8DCC8", P.night, 0.35 + haze * 0.2)}
    />
    <path
      d="M -30,-60 L -27,-110 L 27,-110 L 30,-60 Z M -25,-150 L -23,-190 L 23,-190 L 25,-150 Z"
      fill={mix(P.roofRed, P.night, 0.3)}
    />
    <path
      d="M 8,0 L 16,-240 L 22,-240 L 34,0 Z"
      fill={mix("#E8DCC8", P.night, 0.55)}
    />
    <rect x={-26} y={-274} width={52} height={34} fill={P.warmYellow} />
    <path
      d="M -32,-274 L 0,-306 L 32,-274 Z"
      fill={mix(P.roofRed, P.night, 0.3)}
    />
  </g>
);

/**
 * Totale der Hafenstadt am Morgen. Weltkoordinaten: Himmel reicht nach oben bis y = -1500,
 * damit die Kamera von oben herabfahren kann.
 */
export const HarborPanorama: React.FC<{
  frame: number;
  cloudSpeed?: number;
}> = ({ frame, cloudSpeed = 9 }) => {
  const sunX = 560;
  const sunY = 520;
  const drift = frame * cloudSpeed;
  const clouds: [number, number, number, number][] = [
    [200, 330, 1.3, 1],
    [1250, 260, 1.7, 2],
    [1850, 420, 1.1, 3],
    [700, -200, 1.9, 4],
    [1600, -420, 1.5, 5],
    [150, -700, 1.6, 6],
    [1100, -950, 2.0, 7],
  ];
  return (
    <g>
      <SkyGradient
        x={-400}
        y={-1600}
        w={2720}
        h={2400}
        sunX={sunX}
        sunY={sunY}
        sunR={80}
        glow={1.3}
      />
      {clouds.map(([cx, cy, s, seed], i) => {
        const dx = ((cx - drift * (0.6 + i * 0.12) + 3000) % 3000) - 600;
        const dirX = sunX - dx;
        const dirY = sunY - cy;
        const l = Math.hypot(dirX, dirY) || 1;
        return (
          <Cloud
            key={i}
            x={dx}
            y={cy}
            scale={s}
            seed={seed}
            sun={[dirX / l, dirY / l]}
          />
        );
      })}
      {/* ferne Hügel */}
      <path
        d="M -100,640 C 200,560 420,600 640,580 C 900,556 1100,520 1400,560 C 1650,590 1850,540 2020,570 L 2020,760 L -100,760 Z"
        fill={mix(P.deepBlue, "#8FB6D9", 0.45)}
      />
      <path
        d="M -100,690 C 300,640 600,660 900,640 C 1200,620 1500,650 2020,620 L 2020,780 L -100,780 Z"
        fill={mix(P.harborGreen, P.deepBlue, 0.55)}
        opacity={0.9}
      />
      <HouseRow
        x0={760}
        x1={2000}
        base={700}
        hMin={50}
        hMax={100}
        wMin={46}
        wMax={80}
        seed={11}
        haze={0.55}
        backlit={0.2}
      />
      <HouseRow
        x0={-40}
        x1={420}
        base={720}
        hMin={50}
        hMax={90}
        wMin={46}
        wMax={80}
        seed={17}
        haze={0.55}
        backlit={0.2}
      />
      {/* Kirchturm */}
      <g fill={mix("#C99A7A", "#8FB6D9", 0.35)}>
        <rect x={1320} y={520} width={60} height={240} />
        <path
          d="M 1310,520 L 1350,420 L 1390,520 Z"
          fill={mix(P.roofRed, "#8FB6D9", 0.35)}
        />
        <circle
          cx={1350}
          cy={560}
          r={14}
          fill={mix(P.warmYellow, "#8FB6D9", 0.3)}
        />
      </g>
      <HouseRow
        x0={640}
        x1={2000}
        base={790}
        hMin={90}
        hMax={150}
        wMin={70}
        wMax={120}
        seed={23}
        haze={0.25}
        backlit={0.3}
      />
      <HouseRow
        x0={-60}
        x1={380}
        base={800}
        hMin={80}
        hMax={140}
        wMin={70}
        wMax={110}
        seed={29}
        haze={0.25}
        backlit={0.3}
      />
      <HouseRow
        x0={560}
        x1={2000}
        base={880}
        hMin={120}
        hMax={200}
        wMin={100}
        wMax={160}
        seed={31}
        haze={0}
        backlit={0.42}
      />
      {/* Kai */}
      <rect
        x={-100}
        y={876}
        width={2120}
        height={26}
        fill={mix("#7A6F7E", P.night, 0.3)}
      />
      <rect
        x={-100}
        y={876}
        width={2120}
        height={5}
        fill={P.warmYellow}
        opacity={0.8}
      />
      <Water y={902} h={200} frame={frame} glitterX={sunX} />
      {/* Mole mit Leuchtturm */}
      <path
        d="M -100,860 L 420,860 L 440,900 L -100,900 Z"
        fill={mix("#6E6474", P.night, 0.35)}
      />
      <Lighthouse x={300} y={862} scale={0.9} />
      <Boat x={760} y={960} scale={0.8} frame={frame} seed={1} />
      <Boat
        x={1220}
        y={1000}
        scale={1}
        frame={frame}
        seed={2}
        hull={P.harborGreen}
      />
      <Boat
        x={1640}
        y={950}
        scale={0.7}
        frame={frame}
        seed={3}
        hull={P.deepBlue}
      />
    </g>
  );
};
