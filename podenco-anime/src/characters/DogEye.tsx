import React, { useId } from "react";
import { P } from "../lib/palette";
import { Ink, Shape } from "../lib/Line";

export type EyeState = {
  /** 0 = geschlossen, 1 = offen */
  open: number;
  /** Pupillengröße, 1 = normal, 0.35 = Schreck */
  pupil: number;
  /** Glanzpunkte: 1 = normal, >1 = Blitz */
  glint: number;
  /** 0..1 verhärteter, entschlossener Blick */
  hard?: number;
  lookX?: number;
  lookY?: number;
};

export const EYE_DEFAULT: EyeState = { open: 1, pupil: 1, glint: 1, hard: 0 };

/** Auge in Seitenansicht (Blick nach rechts) */
export const SideEye: React.FC<{ s: EyeState; silhouette?: string }> = ({
  s,
  silhouette,
}) => {
  const id = useId().replace(/:/g, "");
  const almond = "M -13,2 C -8,-10 7,-12 15,-3 C 9,7 -4,9 -13,2 Z";
  if (silhouette) return null;
  if (s.open < 0.15) {
    return <Ink d="M -13,0 Q 1,8 15,-2" />;
  }
  const hard = s.hard ?? 0;
  const lx = (s.lookX ?? 0) * 3;
  const ly = (s.lookY ?? 0) * 2;
  return (
    <g transform={`scale(1 ${s.open})`}>
      <defs>
        <clipPath id={`e${id}`}>
          <path d={almond} />
        </clipPath>
      </defs>
      <path d={almond} fill="#fff" />
      <g clipPath={`url(#e${id})`}>
        <circle cx={4 + lx} cy={-1 + ly} r={8} fill={P.iris} />
        <path
          d={`M ${-4 + lx},${-1 + ly} a 8,8 0 0 1 16,0 Z`}
          fill={P.irisShade}
        />
        <circle cx={4 + lx} cy={-1 + ly} r={4 * s.pupil} fill="#0B0604" />
        {/* verhärteter Blick: Oberlid senkt sich zum Nasenrücken */}
        {hard > 0 ? (
          <path
            d={`M -16,-14 L 18,-14 L 18,${-10 + hard * 9} L -16,${-10 + hard * 2} Z`}
            fill={P.dog}
          />
        ) : null}
      </g>
      <Shape d={almond} fill="none" />
      {hard > 0 ? (
        <Ink d={`M -14,${-10 + hard * 2} L 17,${-10 + hard * 9}`} />
      ) : null}
      <Ink d="M -13,2 C -8,-10 7,-12 15,-3" w={4.5} />
      <circle cx={7 + lx} cy={-4 + ly} r={2.6 * s.glint} fill="#fff" />
      <circle cx={1.5 + lx} cy={2.5 + ly} r={1.3 * s.glint} fill="#fff" />
    </g>
  );
};

/**
 * Anime-Auge frontal. side = 1: rechtes Bildauge (Innenwinkel links), -1: linkes.
 * Glanzpunkte liegen bei beiden Augen auf derselben Seite (einheitliches Licht).
 */
export const FrontEye: React.FC<{ s: EyeState; side: 1 | -1 }> = ({
  s,
  side,
}) => {
  const id = useId().replace(/:/g, "");
  const m = (x: number) => x * side;
  const almond = `M ${m(-24)},4 C ${m(-18)},-17 ${m(12)},-21 ${m(25)},-6 C ${m(16)},12 ${m(-10)},16 ${m(-24)},4 Z`;
  const upper = `M ${m(-24)},4 C ${m(-18)},-17 ${m(12)},-21 ${m(25)},-6`;
  if (s.open < 0.15) {
    return <Ink d={`M ${m(-24)},0 Q ${m(0)},14 ${m(25)},-4`} w={4} />;
  }
  const hard = s.hard ?? 0;
  const lx = (s.lookX ?? 0) * 6;
  const ly = (s.lookY ?? 0) * 4;
  // Lidkante: Innenwinkel (Richtung Nase) sinkt bei hartem Blick
  const lidIn = -22 + hard * 16;
  const lidOut = -22 + hard * 6;
  return (
    <g transform={`scale(1 ${s.open})`}>
      <defs>
        <clipPath id={`f${id}`}>
          <path d={almond} />
        </clipPath>
      </defs>
      <path d={almond} fill="#fff" />
      <g clipPath={`url(#f${id})`}>
        <circle cx={m(2) + lx} cy={-2 + ly} r={15} fill={P.iris} />
        <path
          d={`M ${m(2) - 15 + lx},${-2 + ly} a 15,15 0 0 1 30,0 Z`}
          fill={P.irisShade}
        />
        <circle cx={m(2) + lx} cy={-2 + ly} r={7.5 * s.pupil} fill="#0B0604" />
        {hard > 0 ? (
          <path
            d={`M ${m(-30)},-30 L ${m(30)},-30 L ${m(30)},${lidOut} L ${m(-30)},${lidIn} Z`}
            fill={P.dog}
          />
        ) : null}
      </g>
      <Shape d={almond} fill="none" />
      <Ink d={upper} w={5} />
      {hard > 0 ? (
        <Ink d={`M ${m(-26)},${lidIn} L ${m(27)},${lidOut}`} w={4} />
      ) : null}
      <circle cx={m(2) + 7 + lx} cy={-8 + ly} r={4.8 * s.glint} fill="#fff" />
      <circle cx={m(2) - 5 + lx} cy={4 + ly} r={2.2 * s.glint} fill="#fff" />
    </g>
  );
};
