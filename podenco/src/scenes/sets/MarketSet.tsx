import React from "react";
import { Wash, XeroShape, BgLine } from "../../effects/Wash";
import { C } from "../../lib/palette";
import { skewRect } from "../../lib/rough";
import { Cobbles, Facade, Window } from "./parts";

export const MARKET_GROUND = 900;

/** Ebene 1 (weit weg, langsam): Himmel, Dächer, Kuppel. Breite ca. 2600. */
export const MarketFar: React.FC = () => (
  <g>
    <rect x={-100} y={-100} width={2900} height={900} fill={C.senf} />
    <Wash pts={[[200, 90], [700, 60], [900, 120], [400, 150]]} fill={C.ocker} seed="mw1" opacity={0.5} />
    <Wash pts={[[1500, 70], [2100, 50], [2300, 110], [1700, 130]]} fill={C.ocker} seed="mw2" opacity={0.5} />
    {/* Kuppelkirche */}
    <XeroShape pts={[[900, 330], [960, 200], [1060, 160], [1160, 200], [1220, 330]]} fill={C.graublau} seed="kuppel" />
    <XeroShape pts={[[1040, 170], [1060, 110], [1080, 170]]} fill={C.rost} seed="spitze" />
    {[
      [-80, 300, 380, C.ocker],
      [300, 260, 300, C.graublau],
      [600, 320, 330, C.rost],
      [920, 330, 300, C.ockerDunkel],
      [1220, 280, 360, C.graublau],
      [1580, 320, 320, C.ocker],
      [1900, 250, 380, C.rost],
      [2280, 300, 400, C.graublau],
    ].map(([x, y, w, f], i) => (
      <Facade key={i} x={Number(x)} y={Number(y)} w={Number(w)} h={600} fill={String(f)} seed={`mf${i}`} skew={(i % 3) * 6 - 6} lean={(i % 2) * 6 - 3} roof={C.rostDunkel} />
    ))}
    {[40, 380, 700, 1000, 1300, 1660, 1980, 2360].map((x, i) => (
      <Window key={i} x={x + 40} y={380 + (i % 2) * 20} w={50} h={70} seed={`mfw${i}`} shutter={C.gruen} pane={C.gruenDunkel} />
    ))}
  </g>
);

const Stall: React.FC<{ x: number; stripe: string; base: string; seed: string }> = ({ x, stripe, base, seed }) => {
  const stripes = [];
  for (let i = 0; i < 6; i++) {
    stripes.push(
      <XeroShape
        key={i}
        pts={[
          [x + i * 60, 470],
          [x + i * 60 + 30, 470],
          [x + i * 60 + 34, 540],
          [x + i * 60 + 4, 540],
        ]}
        fill={i % 2 ? base : stripe}
        seed={`${seed}s${i}`}
        off={[3, 3]}
        w={2.5}
      />
    );
  }
  return (
    <g>
      <BgLine pts={[[x + 10, 520], [x + 14, 820]]} seed={seed + "p1"} closed={false} w={4} />
      <BgLine pts={[[x + 350, 520], [x + 346, 820]]} seed={seed + "p2"} closed={false} w={4} />
      <XeroShape pts={[[x - 20, 440], [x + 380, 436], [x + 390, 474], [x - 26, 478]]} fill={stripe} seed={seed + "t"} />
      {stripes}
      {/* Tresen */}
      <XeroShape pts={skewRect(x - 10, 690, 380, 150, 4, 2)} fill={C.gruenDunkel} seed={seed + "c"} />
      {/* Ware: Orangen / Kohlköpfe */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <XeroShape
          key={i}
          pts={[
            [x + 20 + i * 48, 690],
            [x + 30 + i * 48, 664],
            [x + 54 + i * 48, 662],
            [x + 64 + i * 48, 690],
          ]}
          fill={i % 2 ? C.senf : C.rost}
          seed={`${seed}w${i}`}
          off={[3, 2]}
          w={2.5}
        />
      ))}
    </g>
  );
};

/** Ebene 2 (mittel): Arkaden + Marktstände. Breite ca. 3600. */
export const MarketMid: React.FC = () => (
  <g>
    {/* Arkadenwand dunkel, damit der Hund davor steht */}
    <XeroShape pts={[[-100, 420], [3700, 410], [3700, 860], [-100, 860]]} fill={C.graublauDunkel} seed="arkade" off={[0, 6]} />
    {Array.from({ length: 16 }, (_, i) => (
      <XeroShape
        key={i}
        pts={[
          [i * 240 - 40, 860],
          [i * 240 - 40, 560],
          [i * 240 + 20, 500],
          [i * 240 + 100, 500],
          [i * 240 + 160, 560],
          [i * 240 + 160, 860],
        ]}
        fill={C.gruenDunkel}
        seed={`bogen${i}`}
        off={[5, 4]}
      />
    ))}
    <Stall x={200} stripe={C.rost} base={C.senf} seed="st1" />
    <Stall x={1500} stripe={C.gruen} base={C.ocker} seed="st2" />
    <Stall x={2700} stripe={C.rost} base={C.ocker} seed="st3" />
  </g>
);

/** Boden (Ebene der Figuren). */
export const MarketGround: React.FC<{ width: number }> = ({ width }) => (
  <g>
    <XeroShape pts={[[-200, MARKET_GROUND - 70], [width, MARKET_GROUND - 74], [width, 1200], [-200, 1200]]} fill={C.ocker} seed="platz" off={[0, 5]} />
    <Cobbles x={-200} y={MARKET_GROUND - 60} w={width + 200} h={260} seed="mpfl" rows={5} opacity={0.4} />
  </g>
);
