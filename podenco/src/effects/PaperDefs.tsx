import React from "react";

const paperFilter = (
  id: string,
  shadow: number,
  blur: number,
  opacity: number,
  edge: number,
) => (
  <filter
    id={id}
    x="-8%"
    y="-8%"
    width="120%"
    height="125%"
    colorInterpolationFilters="sRGB"
  >
    {/* Schnittkante: leicht unregelmäßig, wie mit der Schere geschnitten (statisch) */}
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.04"
      numOctaves={2}
      seed={3}
      result="edge"
    />
    <feDisplacementMap
      in="SourceGraphic"
      in2="edge"
      scale={edge}
      xChannelSelector="R"
      yChannelSelector="G"
      result="cut"
    />
    {/* Papierfaser auf der Fläche */}
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.75"
      numOctaves={3}
      seed={8}
      result="fib"
    />
    <feColorMatrix
      in="fib"
      type="matrix"
      values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0.3 0 0 0 -0.1"
      result="fibA"
    />
    <feComposite in="fibA" in2="cut" operator="in" result="tex" />
    {/* Schlagschatten auf die Ebene darunter */}
    <feGaussianBlur in="cut" stdDeviation={blur} result="blur" />
    <feOffset in="blur" dx={shadow * 0.8} dy={shadow} result="off" />
    <feFlood floodColor="#1A1A1A" floodOpacity={opacity} />
    <feComposite in2="off" operator="in" result="shadow" />
    <feMerge>
      <feMergeNode in="shadow" />
      <feMergeNode in="cut" />
      <feMergeNode in="tex" />
    </feMerge>
  </filter>
);

/**
 * Globale Papierfilter. Einmal pro Bild rendern, alle SVGs verweisen per url(#…) darauf.
 * - paper: Figuren und Requisiten (deutlicher Schatten)
 * - wash: Kulissenteile (flacherer Schatten)
 * - boil: dünne Papierstreifen für Details (Augenbrauen, Mund, Wind)
 * - boilBg: eingeritzte Linien in der Kulisse, ohne Schatten
 */
export const PaperDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      {paperFilter("paper", 6, 3, 0.42, 4)}
      {paperFilter("wash", 4, 3, 0.32, 6)}
      <filter id="boil" x="-20%" y="-20%" width="140%" height="150%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={1.2} />
        <feOffset dx={1.5} dy={2} result="off" />
        <feFlood floodColor="#1A1A1A" floodOpacity={0.35} />
        <feComposite in2="off" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="boilBg" x="-5%" y="-5%" width="110%" height="110%">
        <feOffset dx={0} dy={0} />
      </filter>
    </defs>
  </svg>
);
