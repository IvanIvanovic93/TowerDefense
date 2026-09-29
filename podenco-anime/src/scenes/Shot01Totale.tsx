import React from "react";
import { useCurrentFrame } from "remotion";
import { easeInOut, range } from "../lib/anim";
import { Stage } from "../lib/Stage";
import { HarborPanorama } from "../sets/Harbor";
import { PaintGrain } from "../sets/Sky";

/** 1: Totale Hafenstadt am Morgen, Wolken ziehen schnell, Kamera fährt von oben herab */
export const Shot01Totale: React.FC = () => {
  const f = useCurrentFrame();
  const camY = range(f, 0, 42, 1350, 0, easeInOut);
  const zoom = range(f, 0, 45, 1.12, 1);
  return (
    <Stage bg="#1E3F66">
      <g
        transform={`translate(960 540) scale(${zoom}) translate(-960 -540) translate(0 ${camY})`}
      >
        <HarborPanorama frame={f} cloudSpeed={14} />
      </g>
      <PaintGrain />
    </Stage>
  );
};
