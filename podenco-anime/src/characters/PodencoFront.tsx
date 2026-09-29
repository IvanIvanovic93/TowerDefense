import React from "react";
import { Cel } from "../lib/Cel";
import { P } from "../lib/palette";
import { limbPath, Pt } from "../lib/shapes";
import { EyeState, EYE_DEFAULT } from "./DogEye";
import { PodencoFace } from "./PodencoFace";

/**
 * Podenco frontal mit Körper: Lauf auf die Kamera zu und stolzes Sitzen.
 * Boden bei y = 0.
 */
export const PodencoFront: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  /** Laufphase 0..1 (ein Schritt pro Zyklus) oder null für Stehen/Sitzen */
  run?: number | null;
  sit?: boolean;
  tilt?: number;
  earL?: number;
  earR?: number;
  eye?: EyeState;
  mouth?: number;
  hatInMouth?: boolean;
  wet?: boolean;
  blush?: number;
  tail?: number;
  chestUp?: number;
  light?: [number, number];
  silhouette?: string;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  run = null,
  sit,
  tilt = 0,
  earL = 0,
  earR = 0,
  eye = EYE_DEFAULT,
  mouth = 0,
  hatInMouth,
  wet,
  blush = 0,
  tail = 0,
  chestUp = 0,
  light = [-0.6, -0.8],
  silhouette,
}) => {
  const sil = silhouette;
  const ph = run === null ? 0 : run * Math.PI * 2;
  const liftL = run === null ? 0 : Math.max(0, Math.sin(ph));
  const liftR = run === null ? 0 : Math.max(0, -Math.sin(ph));
  const bob = run === null ? 0 : -Math.abs(Math.cos(ph)) * 14;
  const lean = run === null ? 0 : Math.sin(ph) * 3;

  const frontLeg = (side: -1 | 1, lift: number) => {
    const hx = side * 28;
    const pts: Pt[] = [
      [hx, -176],
      [hx + side * 2, -100 + lift * 10],
      [hx + side * 1, -34 - lift * 50],
      [hx + side * 4, -8 - lift * 66],
    ];
    return limbPath(pts, [36, 22, 16 + lift * 4, 22 + lift * 10]);
  };
  const hindLeg = (side: -1 | 1, lift: number) => {
    const hx = side * 50;
    const pts: Pt[] = [
      [hx, -120],
      [hx + side * 6, -60 + lift * 8],
      [hx + side * 6, -8 - lift * 30],
    ];
    return limbPath(pts, [30, 16, 20]);
  };

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale}) rotate(${lean} 0 -100)`}
    >
      <g transform={`translate(0 ${bob})`}>
        {/* Schwanz seitlich hinter dem Körper */}
        <Cel
          d={limbPath(
            [
              [40, -150],
              [90 + tail * 10, -180 - tail * 20],
              [120 + tail * 20, -230 - tail * 10],
              [110 + tail * 30, -270],
            ],
            [12, 8, 6, 3],
          )}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={5}
        />
        {sit ? (
          <>
            <Cel
              d="M -120,-10 C -136,-70 -104,-130 -62,-124 C -36,-108 -36,-40 -52,-4 C -80,6 -112,6 -120,-10 Z"
              base={P.dog}
              shade={P.dogShade}
              rim={P.dogRim}
              light={light}
              silhouette={sil}
              shadeOffset={20}
            />
            <Cel
              d="M 120,-10 C 136,-70 104,-130 62,-124 C 36,-108 36,-40 52,-4 C 80,6 112,6 120,-10 Z"
              base={P.dog}
              shade={P.dogShade}
              rim={P.dogRim}
              light={light}
              silhouette={sil}
              shadeOffset={20}
            >
              <circle cx={90} cy={-90} r={2.4} fill={P.freckle} />
              <circle cx={104} cy={-60} r={2} fill={P.freckle} />
              <circle cx={76} cy={-50} r={1.8} fill={P.freckle} />
            </Cel>
            <Cel
              d="M -116,-2 C -116,-20 -76,-20 -72,-4 C -72,6 -116,8 -116,-2 Z"
              base={P.dog}
              shade={P.dogShade}
              light={light}
              silhouette={sil}
              shadeOffset={6}
            />
            <Cel
              d="M 116,-2 C 116,-20 76,-20 72,-4 C 72,6 116,8 116,-2 Z"
              base={P.dog}
              shade={P.dogShade}
              light={light}
              silhouette={sil}
              shadeOffset={6}
            />
          </>
        ) : (
          <>
            <Cel
              d={hindLeg(-1, liftR)}
              base={P.dogShade}
              shade={P.dogShade}
              light={light}
              silhouette={sil}
            />
            <Cel
              d={hindLeg(1, liftL)}
              base={P.dogShade}
              shade={P.dogShade}
              light={light}
              silhouette={sil}
            />
            <Cel
              d="M -70,-190 C -74,-250 74,-250 70,-190 C 66,-140 -66,-140 -70,-190 Z"
              base={P.dogShade}
              shade={P.dogShade}
              light={light}
              silhouette={sil}
            />
          </>
        )}
        {/* Hals und Brust in einer Form, der Kopf sitzt darauf */}
        <Cel
          d={`M -42,${-400 - chestUp} C -48,-330 -80,-262 -66,-192 C -58,-156 -30,-136 0,-134 C 30,-136 58,-156 66,-192 C 80,-262 48,-330 42,${-400 - chestUp} Z`}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={22}
        >
          <circle cx={-40} cy={-200} r={2.2} fill={P.freckle} />
          <circle cx={44} cy={-230} r={2} fill={P.freckle} />
          <circle cx={30} cy={-176} r={1.6} fill={P.freckle} />
          <circle cx={-30} cy={-270} r={1.8} fill={P.freckle} />
        </Cel>
        <Cel
          d={frontLeg(-1, liftL)}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={9}
        >
          <circle cx={-32} cy={-120} r={2} fill={P.freckle} />
          <circle cx={-26} cy={-80} r={1.6} fill={P.freckle} />
        </Cel>
        <Cel
          d={frontLeg(1, liftR)}
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          light={light}
          silhouette={sil}
          shadeOffset={9}
        >
          <circle cx={30} cy={-110} r={1.8} fill={P.freckle} />
          <circle cx={26} cy={-60} r={2} fill={P.freckle} />
        </Cel>
        <PodencoFace
          y={-370 - chestUp}
          scale={0.62}
          tilt={tilt}
          earL={earL}
          earR={earR}
          eye={eye}
          mouth={mouth}
          hatInMouth={hatInMouth}
          wet={wet}
          blush={blush}
          light={light}
          silhouette={sil}
        />
      </g>
    </g>
  );
};
