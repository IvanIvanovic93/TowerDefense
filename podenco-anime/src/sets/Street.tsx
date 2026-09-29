import React from "react";
import { rand } from "../lib/anim";
import { mix } from "../lib/color";
import { P } from "../lib/palette";
import { HouseRow } from "./Buildings";
import { SkyGradient } from "./Sky";

/** Gasse mit Häuserfront und Kopfsteinpflaster, seitliche Ansicht. scroll verschiebt die Welt. */
export const StreetSet: React.FC<{
  scroll?: number;
  ground?: number;
  backlit?: number;
}> = ({ scroll = 0, ground = 900, backlit = 0.45 }) => (
  <g>
    <SkyGradient sunX={300} sunY={120} sunR={70} glow={1} />
    <g transform={`translate(${-scroll * 0.5} 0)`}>
      <HouseRow
        x0={-600}
        x1={4200}
        base={ground - 60}
        hMin={420}
        hMax={640}
        wMin={220}
        wMax={340}
        seed={41}
        backlit={backlit}
      />
    </g>
    <rect
      x={-100}
      y={ground - 70}
      width={2120}
      height={400}
      fill={mix("#8C7A6B", P.night, 0.35)}
    />
    <g transform={`translate(${-(scroll % 120)} 0)`}>
      {Array.from({ length: 70 }).map((_, i) => {
        const row = Math.floor(i / 20);
        const col = i % 20;
        return (
          <rect
            key={i}
            x={col * 120 + (row % 2) * 60 - 60}
            y={ground - 60 + row * 36 + row * row * 6}
            width={100}
            height={24 + row * 8}
            rx={10}
            fill={mix("#A38E7A", P.night, 0.3 + rand(i) * 0.15)}
          />
        );
      })}
    </g>
  </g>
);
