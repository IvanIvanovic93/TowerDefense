import React, { useId } from "react";
import { Ink, Shape } from "../lib/Line";
import { P } from "../lib/palette";
import { Sparkle } from "../effects/Sparkles";

/**
 * Extreme Nahaufnahme eines Auges. open: 0..1 Lidöffnung, pupil: Pupillengröße,
 * glint: Glanzpunktgröße, flash: 0..1 aufblitzender Stern am Glanzpunkt.
 */
export const BigEye: React.FC<{
  open: number;
  pupil: number;
  glint: number;
  flash?: number;
  hard?: number;
}> = ({ open, pupil, glint, flash = 0, hard = 0 }) => {
  const id = useId().replace(/:/g, "");
  const almond =
    "M -560,60 C -400,-250 260,-330 600,-60 C 380,200 -220,280 -560,60 Z";
  // Lid: obere Kante wandert von unten (zu) nach oben (offen)
  const lidY = 140 - open * 520;
  const lidTilt = hard * 90;
  return (
    <g>
      <defs>
        <clipPath id={`be${id}`}>
          <path d={almond} />
        </clipPath>
      </defs>
      {/* Fellstruktur um das Auge */}
      <rect x={-1100} y={-700} width={2200} height={1400} fill={P.dog} />
      <path
        d="M -1100,300 C -500,420 300,380 1100,160 L 1100,700 L -1100,700 Z"
        fill={P.dogShade}
      />
      <path
        d="M -900,-420 C -700,-500 -500,-520 -360,-500"
        fill="none"
        stroke={P.freckle}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray="4 60"
      />
      {[
        [-820, -300, 9],
        [-760, 360, 7],
        [720, -380, 8],
        [860, 280, 10],
        [640, 420, 6],
        [-620, 480, 8],
      ].map(([fx, fy, r], i) => (
        <circle key={i} cx={fx} cy={fy} r={r} fill={P.freckle} />
      ))}
      <path d={almond} fill="#fff" />
      <g clipPath={`url(#be${id})`}>
        <circle cx={40} cy={-20} r={300} fill={P.iris} />
        <path d="M -260,-20 a 300,300 0 0 1 600,0 Z" fill={P.irisShade} />
        {/* Irisstruktur */}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={40 + Math.cos(a) * 150 * pupil}
              y1={-20 + Math.sin(a) * 150 * pupil}
              x2={40 + Math.cos(a) * 270}
              y2={-20 + Math.sin(a) * 270}
              stroke="#6B3D1F"
              strokeWidth={5}
            />
          );
        })}
        <circle cx={40} cy={-20} r={150 * pupil} fill="#0B0604" />
        {/* Oberlid */}
        <path
          d={`M -700,${lidY - 900} L 700,${lidY - 900} L 700,${lidY + lidTilt * 0.3} C 200,${lidY - 80 + lidTilt} -200,${lidY - 60} -700,${lidY + lidTilt} Z`}
          fill={P.dog}
        />
        <Ink
          d={`M -700,${lidY + lidTilt} C -200,${lidY - 60} 200,${lidY - 80 + lidTilt} 700,${lidY + lidTilt * 0.3}`}
          w={8}
        />
      </g>
      <Shape d={almond} fill="none" w={6} />
      <Ink d="M -560,60 C -400,-250 260,-330 600,-60" w={14} />
      {open > 0.3 ? (
        <g opacity={Math.min(1, (open - 0.3) * 3)}>
          <circle cx={170} cy={-130} r={70 * glint} fill="#fff" />
          <circle cx={-60} cy={90} r={30 * glint} fill="#fff" />
        </g>
      ) : null}
      {flash > 0 ? (
        <Sparkle
          x={170}
          y={-130}
          size={420 * flash}
          rot={flash * 40}
          color="#fff"
        />
      ) : null}
    </g>
  );
};
