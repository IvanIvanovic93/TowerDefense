import React from "react";
import { Cel } from "../lib/Cel";
import { Ink, Shape } from "../lib/Line";
import { P } from "../lib/palette";
import { limbPath, polar, Pt } from "../lib/shapes";
import { Drop } from "../effects/Splash";
import { Hat } from "./Hat";

export type Expression = "normal" | "shock" | "cry" | "soggy" | "happy";

/**
 * Rundlicher Postbote in Dreiviertelansicht. Boden bei y = 0.
 * Hut ist ein eigenes Objekt (hat = false: Glatze sichtbar, Hut wird separat animiert).
 */
export const Postbote: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  /** Laufphase in Zyklen, null = stehen */
  run?: number | null;
  hat?: boolean;
  expression?: Expression;
  /** Tränen-Animation (Frame) */
  frame?: number;
  sweat?: number;
  wet?: boolean;
  armsUp?: number;
  lean?: number;
  light?: [number, number];
  /** Chibi-Proportionen: großer Kopf, kleiner Körper */
  chibi?: boolean;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  flip,
  run = null,
  hat = true,
  expression = "normal",
  frame = 0,
  sweat = 0,
  wet,
  armsUp = 0,
  lean = 0,
  light = [-0.6, -0.8],
  chibi,
}) => {
  const bodyT = chibi ? "scale(0.78)" : "";
  const headT = chibi ? "translate(0 -226) scale(1.5) translate(0 290)" : "";
  const ph = run === null ? 0 : run * Math.PI * 2;
  const swing = run === null ? 0 : Math.sin(ph);
  const bob = run === null ? 0 : -Math.abs(Math.sin(ph)) * 16;
  const uni = wet ? "#5C7893" : P.uniform;
  const uniS = wet ? "#425B75" : P.uniformShade;

  const leg = (side: -1 | 1, s: number) => {
    const hip: Pt = [side * 34, -112];
    const k = polar(hip, s * 38, 50);
    const f = polar(k, s * 38 - Math.max(0, s) * 50 - 6, 52);
    return { d: limbPath([hip, k, f], [46, 34, 30]), foot: f };
  };
  const arm = (side: -1 | 1, s: number) => {
    const sh: Pt = [side * 84, -236];
    const up = armsUp * 150;
    const e = polar(sh, side * (18 + up) + s * 40, 58);
    const h = polar(e, side * (8 + up * 1.1) + s * 50, 52);
    return { d: limbPath([sh, e, h], [38, 30, 28]), hand: h };
  };
  const L = leg(-1, swing);
  const R = leg(1, -swing);
  const AL = arm(-1, -swing);
  const AR = arm(1, swing);

  const eyes = () => {
    switch (expression) {
      case "shock":
        return (
          <>
            <Shape d="M -34,-356 a 15,19 0 1 0 0.1,0 Z" fill="#fff" />
            <Shape d="M 18,-356 a 15,19 0 1 0 0.1,0 Z" fill="#fff" />
            <circle cx={-34} cy={-337} r={3.5} fill={P.ink} />
            <circle cx={18} cy={-337} r={3.5} fill={P.ink} />
          </>
        );
      case "cry":
      case "happy":
        return (
          <>
            <Ink d="M -48,-336 Q -34,-352 -20,-336" w={4} />
            <Ink d="M 4,-336 Q 18,-352 32,-336" w={4} />
          </>
        );
      case "soggy":
        return (
          <>
            <Ink d="M -48,-340 L -22,-336" w={4} />
            <Ink d="M 6,-336 L 32,-340" w={4} />
            <circle cx={-34} cy={-332} r={4} fill={P.ink} />
            <circle cx={19} cy={-332} r={4} fill={P.ink} />
          </>
        );
      default:
        return (
          <>
            <ellipse cx={-33} cy={-338} rx={5} ry={8} fill={P.ink} />
            <ellipse cx={19} cy={-338} rx={5} ry={8} fill={P.ink} />
            <circle cx={-31} cy={-341} r={2} fill="#fff" />
            <circle cx={21} cy={-341} r={2} fill="#fff" />
          </>
        );
    }
  };

  // Anime-Tränen: zwei Sturzbäche aus den Augen, die wabbeln
  const tears =
    expression === "cry" ? (
      <g>
        {[-34, 18].map((ex, i) => {
          const w = Math.sin(frame * 0.9 + i * 2) * 6;
          const side = i === 0 ? -1 : 1;
          const d = `M ${ex - 10},-334 C ${ex - 14 + side * 10},-300 ${ex + side * 40 + w},-260 ${ex + side * 56 + w},-190 L ${ex + side * 56 + 30 * side + w},-190 C ${ex + side * 50 + w},-260 ${ex + 16},-300 ${ex + 10},-334 Z`;
          return (
            <g key={i}>
              <Shape d={d} fill={P.tear} />
              <Ink
                d={`M ${ex + side * 6},-316 C ${ex + side * 24},-280 ${ex + side * 44 + w},-240 ${ex + side * 62 + w},-200`}
                color="#fff"
                w={4}
              />
              <Drop
                x={ex + side * (70 + ((frame * 7 + i * 20) % 40))}
                y={-190 + ((frame * 13 + i * 30) % 60)}
                size={10}
              />
            </g>
          );
        })}
      </g>
    ) : null;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <g transform={`translate(0 ${bob}) rotate(${lean} 0 -100)`}>
        <g transform={bodyT}>
          {/* hinteres Bein und Arm */}
          <Cel d={L.d} base={uniS} shade={uniS} light={light} />
          <Shape
            d={`M ${L.foot[0] - 26},${L.foot[1] + 10} C ${L.foot[0] - 26},${L.foot[1] - 14} ${L.foot[0] + 34},${L.foot[1] - 16} ${L.foot[0] + 36},${L.foot[1] + 8} Z`}
            fill="#2A2A2E"
          />
          <Cel d={AL.d} base={uniS} shade={uniS} light={light} />
          <Shape
            d={`M ${AL.hand[0]},${AL.hand[1] - 16} a 16,16 0 1 0 0.1,0 Z`}
            fill={P.skinShade}
          />
          {/* Tasche mit Riemen */}
          <Cel
            d="M -112,-150 C -118,-120 -110,-90 -84,-86 L -40,-92 C -34,-120 -40,-146 -52,-156 Z"
            base="#8B5A2B"
            shade="#5E3B1B"
            light={light}
          />
          {/* Körper */}
          <Cel
            d="M -92,-160 C -104,-266 -44,-300 0,-300 C 58,-300 104,-256 98,-160 C 94,-96 54,-84 2,-84 C -52,-84 -88,-102 -92,-160 Z"
            base={uni}
            shade={uniS}
            rim="#B9CCE0"
            light={light}
            shadeOffset={30}
          >
            <path
              d="M -120,-132 L 120,-132 L 120,-110 L -120,-110 Z"
              fill="#3A4B5E"
            />
            <path
              d="M 70,-300 L -110,-120 L -96,-106 L 86,-290 Z"
              fill="#6A4220"
            />
            {[-250, -210, -170].map((by) => (
              <circle
                key={by}
                cx={16}
                cy={by}
                r={6}
                fill={P.warmYellow}
                stroke={P.ink}
                strokeWidth={2}
              />
            ))}
            <path
              d="M -40,-296 L 0,-262 L 44,-296 Z"
              fill="#DDE6EE"
              stroke={P.ink}
              strokeWidth={2}
            />
          </Cel>
          <Cel d={R.d} base={uni} shade={uniS} light={light} shadeOffset={10} />
          <Shape
            d={`M ${R.foot[0] - 26},${R.foot[1] + 10} C ${R.foot[0] - 26},${R.foot[1] - 14} ${R.foot[0] + 34},${R.foot[1] - 16} ${R.foot[0] + 36},${R.foot[1] + 8} Z`}
            fill="#2A2A2E"
          />
        </g>
        <g transform={headT}>
          {/* Kopf */}
          <Cel
            d="M -70,-340 C -72,-392 -30,-412 0,-412 C 40,-412 72,-390 70,-340 C 68,-296 36,-282 0,-282 C -36,-282 -68,-296 -70,-340 Z"
            base={P.skin}
            shade={P.skinShade}
            rim="#FFE3C2"
            light={light}
            shadeOffset={14}
          />
          <Shape d="M 64,-350 C 84,-354 86,-322 66,-322 Z" fill={P.skin} />
          {!hat ? (
            <>
              <path
                d="M -50,-392 C -30,-406 20,-406 44,-392"
                fill="none"
                stroke="#fff"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.9}
              />
              <Ink d="M -6,-412 C -12,-432 6,-436 2,-448" w={2.5} />
              <Ink d="M 6,-411 C 4,-428 18,-430 16,-442" w={2.5} />
            </>
          ) : null}
          <path
            d="M -70,-356 C -80,-350 -80,-326 -70,-316 L -62,-330 Z"
            fill="#9A9186"
            stroke={P.ink}
            strokeWidth={2}
          />
          {eyes()}
          {expression === "shock" || expression === "soggy" ? (
            <>
              <Ink d="M -48,-370 L -20,-376" w={4} />
              <Ink d="M 4,-376 L 32,-370" w={4} />
            </>
          ) : null}
          {/* Nase und Schnurrbart */}
          <Shape
            d="M -18,-320 C -20,-340 16,-342 14,-318 C 12,-304 -16,-304 -18,-320 Z"
            fill="#E9A07E"
          />
          <Shape
            d={
              wet
                ? "M -2,-306 C -20,-314 -54,-306 -58,-270 C -44,-290 -20,-294 -2,-296 C 16,-294 40,-290 54,-270 C 50,-306 16,-314 -2,-306 Z"
                : "M -2,-306 C -24,-318 -66,-310 -72,-284 C -52,-296 -26,-290 -2,-292 C 22,-290 48,-296 68,-284 C 62,-310 20,-318 -2,-306 Z"
            }
            fill={P.mustache}
          />
          {expression === "happy" || expression === "cry" ? (
            <Shape d="M -18,-286 C -12,-270 12,-270 18,-286 Z" fill="#7A2B34" />
          ) : expression === "shock" ? (
            <Shape d="M -8,-284 a 8,10 0 1 0 0.1,0 Z" fill="#7A2B34" />
          ) : (
            <Ink d="M -12,-286 Q 0,-282 12,-286" />
          )}
          {tears}
        </g>
        <g transform={bodyT}>
          <Cel
            d={AR.d}
            base={uni}
            shade={uniS}
            rim="#B9CCE0"
            light={light}
            shadeOffset={10}
          />
          <Shape
            d={`M ${AR.hand[0]},${AR.hand[1] - 17} a 17,17 0 1 0 0.1,0 Z`}
            fill={P.skin}
          />
        </g>
        <g transform={headT}>
          {hat ? (
            <Hat x={0} y={-396} scale={1.2} rot={-4} wet={wet} light={light} />
          ) : null}
          {sweat > 0 ? (
            <g
              transform={`translate(${84} ${-392 + sweat * 20}) scale(${0.6 + sweat * 0.8})`}
            >
              <Shape
                d="M 0,-40 C 20,-10 26,10 14,24 C 4,32 -10,30 -16,18 C -22,4 -12,-16 0,-40 Z"
                fill={P.tear}
              />
              <path
                d="M -6,4 C -8,12 -4,18 2,20"
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                strokeLinecap="round"
              />
            </g>
          ) : null}
        </g>
        {wet ? (
          <g>
            {[-80, -30, 30, 76].map((dx, i) => (
              <Drop
                key={i}
                x={dx}
                y={-200 + ((frame * 9 + i * 37) % 200)}
                size={9}
              />
            ))}
          </g>
        ) : null}
      </g>
    </g>
  );
};
