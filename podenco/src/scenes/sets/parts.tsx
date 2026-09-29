import React from "react";
import { random } from "remotion";
import { BgLine, Wash, XeroShape } from "../../effects/Wash";
import { InkLine } from "../../effects/Ink";
import { C } from "../../lib/palette";
import { skewRect } from "../../lib/rough";

type Pt = [number, number];

/** Schiefes Fenster mit Läden. */
export const Window: React.FC<{ x: number; y: number; w: number; h: number; seed: string; shutter?: string; pane?: string; skew?: number }> = ({
  x,
  y,
  w,
  h,
  seed,
  shutter = C.gruen,
  pane = C.gruenDunkel,
  skew = (random(seed) - 0.5) * 10,
}) => {
  const lean = (random(seed + "l") - 0.5) * 6;
  return (
    <g>
      <XeroShape pts={skewRect(x - w * 0.42, y, w * 0.4, h, skew, lean)} fill={shutter} seed={seed + "a"} off={[4, 3]} w={3} />
      <XeroShape pts={skewRect(x + w + w * 0.02, y, w * 0.4, h, skew, lean)} fill={shutter} seed={seed + "b"} off={[4, 3]} w={3} />
      <XeroShape pts={skewRect(x, y, w, h, skew, lean)} fill={pane} seed={seed + "p"} off={[5, 4]} />
      <BgLine pts={[[x + w / 2 + skew * 0.5, y + 4], [x + w / 2, y + h - 4]]} seed={seed + "k"} closed={false} w={2.5} />
      <BgLine pts={[[x + 4 + skew * 0.5, y + h * 0.45], [x + w - 4 + skew * 0.5, y + h * 0.45 - lean]]} seed={seed + "q"} closed={false} w={2.5} />
    </g>
  );
};

/** Hauswand, leicht verzogen, mit Dachkante. */
export const Facade: React.FC<{ x: number; y: number; w: number; h: number; fill: string; seed: string; skew?: number; lean?: number; roof?: string }> = ({
  x,
  y,
  w,
  h,
  fill,
  seed,
  skew = 0,
  lean = 0,
  roof,
}) => (
  <g>
    <XeroShape pts={skewRect(x, y, w, h, skew, lean)} fill={fill} seed={seed} off={[8, 6]} />
    {roof ? (
      <XeroShape
        pts={[
          [x + skew - 16, y + lean + 6],
          [x + skew - 6, y + lean - 26],
          [x + w + skew + 6, y - lean - 26],
          [x + w + skew + 16, y - lean + 6],
        ]}
        fill={roof}
        seed={seed + "r"}
        off={[5, 4]}
      />
    ) : null}
  </g>
);

/** Kopfsteinpflaster: eine einzige Linie mit vielen Bögen (ein Filter, günstig). */
export const Cobbles: React.FC<{ x: number; y: number; w: number; h: number; seed: string; rows?: number; opacity?: number }> = ({
  x,
  y,
  w,
  h,
  seed,
  rows = 5,
  opacity = 0.55,
}) => {
  let d = "";
  for (let r = 0; r < rows; r++) {
    const ry = y + (r + 0.5) * (h / rows);
    const size = 34 + r * 12;
    for (let cx = x + (r % 2) * size * 0.6; cx < x + w; cx += size * 1.25) {
      const px = cx + (random(`${seed}${r}-${cx}`) - 0.5) * 14;
      const rx = size * 0.5;
      const ry2 = size * 0.22;
      // Stein als fast geschlossener Bogen
      d += `M ${(px - rx).toFixed(0)} ${ry.toFixed(0)} a ${rx.toFixed(0)} ${ry2.toFixed(0)} 0 1 1 ${(rx * 1.7).toFixed(0)} ${(ry2 * 0.9).toFixed(0)} `;
    }
  }
  return (
    <g opacity={opacity}>
      <InkLine d={d} w={2.6} filter="boilBg" />
    </g>
  );
};

/** Flacher Schattenkeil (Morgenlicht), eine Farbe, halbtransparent. */
export const FlatShadow: React.FC<{ pts: Pt[]; seed: string; opacity?: number; fill?: string }> = ({ pts, seed, opacity = 0.28, fill = C.gruenDunkel }) => (
  <Wash pts={pts} fill={fill} seed={seed} opacity={opacity} jitter={10} />
);
