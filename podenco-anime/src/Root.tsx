import React from "react";
import { Composition } from "remotion";
import { CastSheet } from "./dev/CastSheet";
import { CharacterSheet } from "./dev/CharacterSheet";
import { PodencoAnime } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PodencoAnime"
        component={PodencoAnime}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CharacterSheet"
        component={CharacterSheet}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CastSheet"
        component={CastSheet}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
