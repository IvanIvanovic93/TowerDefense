import React from "react";
import { XeroShape, BgLine } from "../../effects/Wash";
import { C } from "../../lib/palette";

/** Fischstand, hinterer Teil (hinter dem Hund). Ursprung: Boden, Mitte. */
export const FishStandBack: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <BgLine pts={[[-190, -200], [-188, -440]]} seed="fsp1" closed={false} w={4} />
    <BgLine pts={[[190, -200], [186, -440]]} seed="fsp2" closed={false} w={4} />
    {Array.from({ length: 7 }, (_, i) => (
      <XeroShape
        key={i}
        pts={[
          [-220 + i * 64, -470],
          [-220 + i * 64 + 64, -472],
          [-220 + i * 64 + 70, -400],
          [-220 + i * 64 + 6, -398],
        ]}
        fill={i % 2 ? C.graublau : C.rost}
        seed={`fsa${i}`}
        off={[4, 3]}
        w={3}
      />
    ))}
    {/* Schild */}
    <XeroShape pts={[[-80, -390], [80, -392], [76, -340], [-76, -338]]} fill={C.gruenDunkel} seed="fschild" />
    <g transform="translate(-40 -352)">
      <path d="M 0 0 C 20 -20 50 -20 64 0 C 50 20 20 20 0 0 Z M 64 0 L 80 -12 L 80 12 Z" fill={C.senf} />
    </g>
    {/* Tischplatte mit Eis */}
    <XeroShape pts={[[-210, -196], [210, -198], [216, -176], [-214, -174]]} fill={C.graublauDunkel} seed="ftisch" />
  </g>
);

/** Fischstand, vorderer Teil (vor dem Hund): Tischfront + Kisten. tip = Kiste kippt (Grad). */
export const FishStandFront: React.FC<{ x: number; y: number; tip?: number }> = ({ x, y, tip = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <XeroShape pts={[[-214, -176], [216, -178], [210, -110], [-206, -108]]} fill={C.rostDunkel} seed="ffront" />
    <BgLine pts={[[-196, -108], [-192, 0]]} seed="fbein1" closed={false} w={5} />
    <BgLine pts={[[196, -108], [192, 0]]} seed="fbein2" closed={false} w={5} />
    <g transform={`rotate(${tip} 150 0)`}>
      <XeroShape pts={[[40, -70], [150, -72], [148, 0], [42, 0]]} fill={C.ocker} seed="fkiste" />
      <BgLine pts={[[44, -36], [146, -38]]} seed="fkl" closed={false} w={3} />
    </g>
  </g>
);
