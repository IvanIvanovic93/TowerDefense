import React from "react";
import { useCurrentFrame } from "remotion";
import { Postbote } from "../characters/Postbote";
import { range } from "../lib/anim";
import { Stage } from "../lib/Stage";
import { HorizontalSpeedlines } from "../effects/Speedlines";
import { StreetSet } from "../sets/Street";
import { PaintGrain } from "../sets/Sky";

/** 3: Postbote läuft durchs Bild, Windlinien kommen von rechts */
export const Shot03Postbote: React.FC = () => {
  const f = useCurrentFrame();
  const x = range(f, 0, 30, -180, 2150);
  return (
    <Stage>
      <StreetSet scroll={0} />
      <HorizontalSpeedlines
        frame={f}
        count={26}
        y0={80}
        y1={860}
        colors={["#ffffff", "#FFE7A8"]}
        speed={110}
        dir={-1}
        seed={3}
        thickness={6}
        opacity={0.75}
      />
      <Postbote
        x={x}
        y={930}
        scale={1.25}
        run={f / 8}
        lean={8}
        expression="normal"
      />
      <HorizontalSpeedlines
        frame={f}
        count={10}
        y0={300}
        y1={1060}
        colors={["#ffffff"]}
        speed={160}
        dir={-1}
        seed={9}
        thickness={9}
        opacity={0.9}
      />
      <PaintGrain opacity={0.1} />
    </Stage>
  );
};
