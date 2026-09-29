import React from "react";
import { Cel } from "../lib/Cel";
import { P } from "../lib/palette";
import { limbPath } from "../lib/shapes";
import { EyeState, EYE_DEFAULT } from "./DogEye";
import { PodencoFace } from "./PodencoFace";

/** Chibi-Version für den Schlussgag: riesiger Kopf, kleiner runder Körper. Boden bei y = 0. */
export const PodencoChibi: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  /** Schüttel-Drehung des Körpers in Grad */
  twist?: number;
  headTwist?: number;
  earL?: number;
  earR?: number;
  eye?: EyeState;
  mouth?: number;
  wet?: boolean;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  twist = 0,
  headTwist = 0,
  earL = 0,
  earR = 0,
  eye = EYE_DEFAULT,
  mouth = 0,
  wet,
}) => {
  const leg = (lx: number, back: boolean) => (
    <Cel
      d={limbPath(
        [
          [lx, -60],
          [lx, -24],
          [lx + 4, -6],
        ],
        [26, 22, 26],
      )}
      base={back ? P.dogShade : P.dog}
      shade={P.dogShade}
      shadeOffset={6}
    />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`rotate(${twist} 0 -70)`}>
        <Cel
          d={limbPath(
            [
              [60, -80],
              [96, -110],
              [100, -150],
            ],
            [14, 10, 5],
          )}
          base={P.dog}
          shade={P.dogShade}
          shadeOffset={5}
        />
        {leg(-40, true)}
        {leg(44, true)}
        <Cel
          d="M -84,-70 C -84,-130 84,-130 84,-70 C 84,-30 -84,-30 -84,-70 Z"
          base={P.dog}
          shade={P.dogShade}
          rim={P.dogRim}
          shadeOffset={18}
        >
          <circle cx={-40} cy={-96} r={3} fill={P.freckle} />
          <circle cx={-10} cy={-104} r={2.4} fill={P.freckle} />
          <circle cx={30} cy={-98} r={3} fill={P.freckle} />
          <circle cx={54} cy={-84} r={2.2} fill={P.freckle} />
        </Cel>
        {leg(-56, false)}
        {leg(26, false)}
      </g>
      <PodencoFace
        y={-190}
        scale={0.78}
        tilt={headTwist}
        snout={0.55}
        eyeScale={1.45}
        earL={earL}
        earR={earR}
        eye={eye}
        mouth={mouth}
        wet={wet}
      />
    </g>
  );
};
