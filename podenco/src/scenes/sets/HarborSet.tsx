import React from "react";
import { XeroShape, BgLine, Wash } from "../../effects/Wash";
import { C } from "../../lib/palette";
import { Cobbles } from "./parts";

export const QUAY_Y = 760;
export const QUAY_EDGE = 1000;
export const WATER_Y = 870;

const Boat: React.FC<{ x: number; y: number; s?: number; hull?: string; seed: string }> = ({ x, y, s = 1, hull = C.rost, seed }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <XeroShape pts={[[-40, -150], [-36, -40], [60, -40], [56, -110]]} fill={C.ocker} seed={seed + "c"} />
    <XeroShape pts={[[-160, -50], [180, -54], [140, 20], [-130, 22]]} fill={hull} seed={seed + "h"} />
    <BgLine pts={[[-20, -150], [-20, -300]]} seed={seed + "m"} closed={false} w={4} />
  </g>
);

/** Hafen: Himmel, Horizont, Mole, Leuchtturm, Boote. */
export const HarborBack: React.FC = () => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill={C.ocker} />
    <Wash pts={[[100, 80], [600, 50], [800, 110], [300, 140]]} fill={C.senf} seed="hw1" opacity={0.8} />
    <Wash pts={[[1100, 150], [1700, 120], [1900, 170], [1300, 200]]} fill={C.senf} seed="hw2" opacity={0.8} />
    {/* Meer bis zum Horizont */}
    <XeroShape pts={[[-200, 470], [2400, 466], [2400, 1200], [-200, 1200]]} fill={C.graublau} seed="meer" off={[0, 0]} />
    {/* Mole + Leuchtturm */}
    <XeroShape pts={[[1200, 520], [2400, 500], [2400, 560], [1210, 560]]} fill={C.graublauDunkel} seed="mole" />
    <XeroShape pts={[[1640, 520], [1660, 300], [1720, 300], [1740, 520]]} fill={C.papier} seed="turm" />
    <XeroShape pts={[[1652, 440], [1732, 440], [1736, 480], [1648, 480]]} fill={C.rost} seed="ring1" off={[3, 2]} />
    <XeroShape pts={[[1658, 350], [1724, 350], [1728, 390], [1654, 390]]} fill={C.rost} seed="ring2" off={[3, 2]} />
    <XeroShape pts={[[1648, 300], [1690, 250], [1732, 300]]} fill={C.rostDunkel} seed="turmdach" />
    {/* Segel am Horizont */}
    <XeroShape pts={[[300, 470], [340, 380], [360, 470]]} fill={C.rost} seed="segel1" off={[3, 2]} />
    <XeroShape pts={[[700, 474], [730, 400], [750, 474]]} fill={C.senf} seed="segel2" off={[3, 2]} />
    <Boat x={1700} y={WATER_Y - 10} s={0.9} seed="b1" />
    <Boat x={2150} y={WATER_Y - 20} s={1} hull={C.gruen} seed="b2" />
  </g>
);

/** Kaimauer links: Oberfläche + Mauerkante. */
export const Quay: React.FC<{ edge?: number }> = ({ edge = QUAY_EDGE }) => (
  <g>
    <XeroShape pts={[[-300, QUAY_Y - 30], [edge, QUAY_Y - 30], [edge, 1200], [-300, 1200]]} fill={C.ockerDunkel} seed="kai" off={[0, 6]} />
    <Cobbles x={-300} y={QUAY_Y - 20} w={edge + 280} h={120} seed="kaipfl" rows={3} opacity={0.4} />
    {/* Mauerkante mit Quadersteinen */}
    <XeroShape pts={[[-300, QUAY_Y + 90], [edge + 10, QUAY_Y + 86], [edge + 10, 1200], [-300, 1200]]} fill={C.graublauDunkel} seed="mauer" />
    {Array.from({ length: 12 }, (_, i) => (
      <BgLine key={i} pts={[[-300 + i * 110, QUAY_Y + 90], [-300 + i * 110 + 4, 1200]]} seed={`fuge${i}`} closed={false} w={2.6} />
    ))}
    <BgLine pts={[[-300, QUAY_Y + 170], [edge, QUAY_Y + 166]]} seed="fugeq" closed={false} w={2.6} />
    {/* Poller */}
    <XeroShape pts={[[edge - 700, QUAY_Y - 30], [edge - 696, QUAY_Y - 110], [edge - 640, QUAY_Y - 110], [edge - 636, QUAY_Y - 30]]} fill={C.ink} seed="poller" off={[3, 2]} />
    <XeroShape pts={[[edge - 712, QUAY_Y - 110], [edge - 624, QUAY_Y - 112], [edge - 630, QUAY_Y - 130], [edge - 706, QUAY_Y - 128]]} fill={C.gruenDunkel} seed="pollerk" off={[3, 2]} />
  </g>
);
