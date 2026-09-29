import { useCurrentFrame } from "remotion";

/** Frame auf "twos" gerastert: Figuren bewegen sich nur alle 2 Frames. */
export const onTwos = (f: number) => f - (((f % 2) + 2) % 2);

export const useTwos = () => onTwos(useCurrentFrame());
