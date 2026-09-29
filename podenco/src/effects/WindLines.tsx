import React from "react";
import { InkLine } from "./Ink";

/**
 * Sichtbare Windböe: geschwungene Linien mit Kringel, die von links durchs Bild ziehen.
 * t = lokaler Frame der Böe (auf twos gerastert übergeben).
 */
export const WindLines: React.FC<{ t: number; y: number; dur?: number; width?: number }> = ({ t, y, dur = 40, width = 1920 }) => {
  if (t < 0 || t > dur + 20) return null;
  const lines = [
    { dy: -60, delay: 0, len: 520, curl: true },
    { dy: 10, delay: 4, len: 700, curl: false },
    { dy: 70, delay: 8, len: 460, curl: true },
    { dy: -130, delay: 12, len: 380, curl: false },
    { dy: 130, delay: 6, len: 540, curl: false },
  ];
  return (
    <g>
      {lines.map((l, i) => {
        const lt = t - l.delay;
        if (lt < 0 || lt > dur) return null;
        const p = lt / dur;
        const head = -300 + p * (width + 900);
        const tail = head - l.len;
        const yy = y + l.dy;
        const wob = Math.sin(p * 6 + i) * 18;
        const d = l.curl
          ? `M ${tail} ${yy + 10} C ${tail + l.len * 0.3} ${yy - 30 + wob} ${tail + l.len * 0.6} ${yy + 30} ${head - 60} ${yy} C ${head} ${yy - 20} ${head + 10} ${yy - 70} ${head - 40} ${yy - 70} C ${head - 80} ${yy - 70} ${head - 70} ${yy - 30} ${head - 40} ${yy - 32}`
          : `M ${tail} ${yy} C ${tail + l.len * 0.35} ${yy - 24 + wob} ${tail + l.len * 0.7} ${yy + 24} ${head} ${yy - 6}`;
        return <InkLine key={i} d={d} w={3.5} />;
      })}
    </g>
  );
};
