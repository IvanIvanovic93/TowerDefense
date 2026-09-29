import React from "react";
import { Composition } from "remotion";
import { DogSheet, PostSheet } from "./dev/CharacterSheet";
import { PodencoAbenteuer } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PodencoAbenteuer"
        component={PodencoAbenteuer}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DogSheet"
        component={DogSheet}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PostSheet"
        component={PostSheet}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
