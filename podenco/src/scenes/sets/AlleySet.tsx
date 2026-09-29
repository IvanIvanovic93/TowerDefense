import React from "react";
import { BgLine, Wash, XeroShape } from "../../effects/Wash";
import { InkLine } from "../../effects/Ink";
import { C } from "../../lib/palette";
import { skewRect } from "../../lib/rough";
import { Cobbles, Facade, FlatShadow, Window } from "./parts";

/** Altstadtgasse am Morgen. Weltbreite 2220 px (Kamera schwenkt von x=0 nach x=-300). */
export const ALLEY_LANDING = { x: 1100, y: 640 };
export const ALLEY_STREET_Y = 1010;

export const AlleyBack: React.FC = () => (
  <g>
    {/* Himmel */}
    <rect x={-50} y={-50} width={2350} height={900} fill={C.senf} />
    <Wash pts={[[700, 60], [1100, 40], [1500, 90], [1300, 140], [800, 130]]} fill={C.ocker} seed="wolke" opacity={0.6} />
    {/* Blick ans Gassenende: ferne Fassade + Glockenturm */}
    <XeroShape pts={[[1180, 60], [1260, 58], [1262, 360], [1178, 362]]} fill={C.graublau} seed="turm" />
    <XeroShape pts={[[1160, 64], [1220, 0], [1282, 62]]} fill={C.rost} seed="turmdach" />
    <XeroShape pts={skewRect(900, 300, 560, 520, 8, 4)} fill={C.graublau} seed="fern" />
    <Window x={960} y={380} w={50} h={80} seed="fw1" shutter={C.graublauDunkel} pane={C.gruenDunkel} />
    <Window x={1330} y={390} w={50} h={80} seed="fw2" shutter={C.graublauDunkel} pane={C.gruenDunkel} />

    {/* linkes Haus, Ocker */}
    <Facade x={-40} y={40} w={560} h={900} fill={C.ocker} seed="hausA" skew={-14} lean={6} roof={C.rost} />
    <Window x={70} y={170} w={90} h={130} seed="aw1" shutter={C.gruen} />
    <Window x={300} y={160} w={90} h={130} seed="aw2" shutter={C.gruen} />
    <Window x={80} y={440} w={90} h={130} seed="aw3" shutter={C.gruen} />
    <Window x={310} y={430} w={90} h={130} seed="aw4" shutter={C.gruen} />
    {/* Blumentöpfe */}
    <XeroShape pts={[[300, 562], [400, 560], [392, 600], [308, 602]]} fill={C.rost} seed="topf" />
    <Wash pts={[[300, 562], [320, 520], [350, 540], [380, 515], [400, 560]]} fill={C.gruen} seed="grün" />

    {/* zweites Haus, Rostrot */}
    <Facade x={520} y={110} w={330} h={830} fill={C.rost} seed="hausB" skew={10} lean={-8} roof={C.rostDunkel} />
    <Window x={600} y={220} w={80} h={120} seed="bw1" shutter={C.ocker} pane={C.rostDunkel} />
    <Window x={610} y={470} w={80} h={120} seed="bw2" shutter={C.ocker} pane={C.rostDunkel} />

    {/* Haus mit Treppe: dunkles Ocker, damit der weiße Hund absteht */}
    <Facade x={830} y={200} w={620} h={740} fill={C.ockerDunkel} seed="hausC" skew={-8} lean={5} />
    <XeroShape pts={[[992, 640], [990, 420], [1030, 372], [1120, 368], [1162, 416], [1168, 640]]} fill={C.gruenDunkel} seed="tür" />
    <BgLine pts={[[1080, 380], [1080, 636]]} seed="türmitte" closed={false} w={3} />
    <Window x={880} y={260} w={70} h={100} seed="cw1" shutter={C.graublau} pane={C.gruenDunkel} />
    <Window x={1250} y={250} w={70} h={100} seed="cw2" shutter={C.graublau} pane={C.gruenDunkel} />
    {/* Laterne */}
    <InkLine d="M 1300 420 C 1330 400 1350 400 1370 410" w={4} filter="boilBg" />
    <XeroShape pts={[[1350, 412], [1392, 412], [1400, 470], [1344, 470]]} fill={C.senf} seed="lampe" />

    {/* rechtes Haus, Graublau, mit Bogen */}
    <Facade x={1450} y={30} w={800} h={910} fill={C.graublau} seed="hausD" skew={16} lean={-6} roof={C.rostDunkel} />
    <XeroShape pts={[[1560, 940], [1560, 700], [1620, 620], [1720, 610], [1790, 690], [1792, 940]]} fill={C.graublauDunkel} seed="bogen" />
    <Window x={1560} y={160} w={90} h={130} seed="dw1" shutter={C.rost} pane={C.graublauDunkel} />
    <Window x={1860} y={150} w={90} h={130} seed="dw2" shutter={C.rost} pane={C.graublauDunkel} />
    <Window x={1880} y={430} w={90} h={130} seed="dw3" shutter={C.rost} pane={C.graublauDunkel} />
    <Window x={2100} y={420} w={70} h={130} seed="dw4" shutter={C.rost} pane={C.graublauDunkel} />

    {/* Wäscheleine */}
    <InkLine d="M 470 250 C 800 330 1200 330 1520 240" w={2.6} filter="boilBg" />
    {[
      [640, 292, C.papier],
      [760, 308, C.rost],
      [900, 318, C.senf],
      [1240, 310, C.papier],
      [1360, 290, C.gruen],
    ].map(([x, y, f], i) => (
      <XeroShape
        key={i}
        pts={[
          [Number(x) - 30, Number(y)],
          [Number(x) + 30, Number(y) - 2],
          [Number(x) + 26, Number(y) + 60],
          [Number(x) - 28, Number(y) + 62],
        ]}
        fill={String(f)}
        seed={`wäsche${i}`}
        off={[4, 3]}
        w={3}
      />
    ))}

    {/* Straße */}
    <XeroShape pts={[[-60, 820], [2290, 810], [2290, 1100], [-60, 1100]]} fill={C.ocker} seed="straße" off={[0, 6]} />
    <Cobbles x={-40} y={830} w={2300} h={260} seed="pflaster" opacity={0.45} />

    {/* Treppe aus Stein */}
    <XeroShape pts={[[790, 820], [1410, 818], [1402, 775], [798, 776]]} fill={C.graublau} seed="st1" />
    <XeroShape pts={[[820, 776], [1380, 774], [1372, 730], [828, 732]]} fill={C.graublau} seed="st2" />
    <XeroShape pts={[[850, 732], [1350, 730], [1342, 686], [858, 688]]} fill={C.graublau} seed="st3" />
    <XeroShape pts={[[880, 688], [1320, 686], [1314, 640], [886, 642]]} fill={C.graublau} seed="st4" />

    {/* Morgenschatten */}
    <FlatShadow pts={[[-60, 40], [520, 40], [520, 600], [-60, 900]]} seed="schatten1" opacity={0.22} />
    <FlatShadow pts={[[-60, 820], [700, 820], [420, 1100], [-60, 1100]]} seed="schatten2" opacity={0.25} />
  </g>
);
