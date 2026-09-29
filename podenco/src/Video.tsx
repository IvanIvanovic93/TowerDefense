import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PaperDefs } from "./effects/PaperDefs";
import { PaperGrain } from "./effects/PaperGrain";
import { C } from "./lib/palette";
import { Scene1Gasse } from "./scenes/Scene1Gasse";
import { Scene2Hut } from "./scenes/Scene2Hut";
import { Scene3Markt } from "./scenes/Scene3Markt";
import { Scene4Hafen } from "./scenes/Scene4Hafen";
import { Scene5Schwimmen } from "./scenes/Scene5Schwimmen";
import { Scene6Finale } from "./scenes/Scene6Finale";

export const PodencoAbenteuer: React.FC = () => (
  <AbsoluteFill style={{ background: C.papier }}>
    <PaperDefs />
    <Sequence from={0} durationInFrames={120} name="1 Gasse">
      <Scene1Gasse />
    </Sequence>
    <Sequence from={120} durationInFrames={150} name="2 Hut">
      <Scene2Hut />
    </Sequence>
    <Sequence from={270} durationInFrames={210} name="3 Markt">
      <Scene3Markt />
    </Sequence>
    <Sequence from={480} durationInFrames={180} name="4 Hafen">
      <Scene4Hafen />
    </Sequence>
    <Sequence from={660} durationInFrames={120} name="5 Schwimmen">
      <Scene5Schwimmen />
    </Sequence>
    <Sequence from={780} durationInFrames={120} name="6 Finale">
      <Scene6Finale />
    </Sequence>
    <PaperGrain />
  </AbsoluteFill>
);
