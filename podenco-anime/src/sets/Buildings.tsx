import React from "react";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";

const WALLS = [
  "#D49A6A",
  "#C7856B",
  "#B8736E",
  "#D8B26E",
  "#A9848F",
  "#C99A7A",
  "#B5876A",
];
const HAZE = "#8FB6D9";

export type HouseProps = {
  x: number;
  base: number;
  w: number;
  h: number;
  seed: number;
  /** 0 = nah, 1 = im Dunst verschwunden */
  haze?: number;
  /** Gegenlicht: Fassaden abgedunkelt */
  backlit?: number;
  roofRim?: boolean;
  silhouette?: string;
};

/** Stadthaus mit rotem Dach, Fensterläden in Hafengrün. Gemalt, ohne Kontur. */
export const House: React.FC<HouseProps> = ({
  x,
  base,
  w,
  h,
  seed,
  haze = 0,
  backlit = 0.35,
  roofRim = true,
  silhouette,
}) => {
  const wallRaw = WALLS[Math.floor(rand(seed) * WALLS.length)];
  const dark = (c: string, k = backlit) => mix(mix(c, P.night, k), HAZE, haze);
  if (silhouette) {
    const rh = h * 0.28;
    return (
      <g fill={silhouette}>
        <rect x={x} y={base - h} width={w} height={h} />
        <path
          d={`M ${x - 10},${base - h} L ${x + w / 2},${base - h - rh} L ${x + w + 10},${base - h} Z`}
        />
        {rand(seed * 3) > 0.5 ? (
          <rect
            x={x + w * 0.7}
            y={base - h - rh * 0.9}
            width={w * 0.1}
            height={rh * 0.8}
          />
        ) : null}
      </g>
    );
  }
  const wall = dark(wallRaw);
  const wallShade = dark(wallRaw, backlit + 0.25);
  const roof = dark(P.roofRed, backlit * 0.8);
  const roofShade = dark(P.roofRed, backlit * 0.8 + 0.25);
  const rh = h * (0.22 + rand(seed * 2) * 0.12);
  const windowCol = dark("#2B2F4A", 0.1);
  const shutter = dark(P.harborGreen, backlit * 0.7);
  const floors = Math.max(1, Math.floor(h / 110));
  const cols = Math.max(1, Math.floor(w / 90));
  const flat = rand(seed * 5) > 0.7;
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={wall} />
      {/* Schattenseite rechts (Licht von links hinten) */}
      <rect
        x={x + w * 0.82}
        y={base - h}
        width={w * 0.18}
        height={h}
        fill={wallShade}
      />
      {Array.from({ length: floors }).map((_, f) =>
        Array.from({ length: cols }).map((__, c) => {
          const wx = x + (w / cols) * (c + 0.5) - 16;
          const wy = base - h + 30 + (f * (h - 40)) / floors;
          if (rand(seed + f * 7 + c * 13) < 0.15) return null;
          return (
            <g key={`${f}-${c}`}>
              <rect x={wx - 12} y={wy} width={10} height={46} fill={shutter} />
              <rect x={wx + 34} y={wy} width={10} height={46} fill={shutter} />
              <rect x={wx} y={wy} width={32} height={46} fill={windowCol} />
              <rect
                x={wx + 2}
                y={wy + 2}
                width={10}
                height={20}
                fill={mix(P.warmYellow, HAZE, haze)}
                opacity={rand(seed + f + c) > 0.7 ? 0.8 : 0}
              />
            </g>
          );
        }),
      )}
      {flat ? (
        <>
          <rect
            x={x - 6}
            y={base - h - 16}
            width={w + 12}
            height={18}
            fill={roofShade}
          />
          <rect
            x={x - 6}
            y={base - h - 16}
            width={w + 12}
            height={5}
            fill={roofRim ? mix(P.warmYellow, HAZE, haze) : roof}
          />
        </>
      ) : (
        <>
          <path
            d={`M ${x - 14},${base - h} L ${x + w * 0.45},${base - h - rh} L ${x + w + 14},${base - h} Z`}
            fill={roof}
          />
          <path
            d={`M ${x + w * 0.45},${base - h - rh} L ${x + w + 14},${base - h} L ${x + w * 0.5},${base - h} Z`}
            fill={roofShade}
          />
          {roofRim ? (
            <path
              d={`M ${x - 14},${base - h} L ${x + w * 0.45},${base - h - rh}`}
              stroke={mix(P.warmYellow, HAZE, haze)}
              strokeWidth={5}
              strokeLinecap="round"
            />
          ) : null}
          {rand(seed * 11) > 0.55 ? (
            <rect
              x={x + w * 0.68}
              y={base - h - rh * 0.75}
              width={w * 0.09}
              height={rh * 0.6}
              fill={roofShade}
            />
          ) : null}
        </>
      )}
    </g>
  );
};

/** Häuserzeile von x0 bis x1 */
export const HouseRow: React.FC<{
  x0: number;
  x1: number;
  base: number;
  hMin: number;
  hMax: number;
  wMin: number;
  wMax: number;
  seed: number;
  haze?: number;
  backlit?: number;
  silhouette?: string;
}> = ({
  x0,
  x1,
  base,
  hMin,
  hMax,
  wMin,
  wMax,
  seed,
  haze,
  backlit,
  silhouette,
}) => {
  const items: React.ReactNode[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = wMin + rand(seed + i * 1.7) * (wMax - wMin);
    const h = hMin + rand(seed + i * 2.3) * (hMax - hMin);
    items.push(
      <House
        key={i}
        x={x}
        base={base}
        w={w}
        h={h}
        seed={seed + i * 5.1}
        haze={haze}
        backlit={backlit}
        silhouette={silhouette}
      />,
    );
    x += w + 4;
    i++;
  }
  return <g>{items}</g>;
};
