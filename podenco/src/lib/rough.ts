import { random } from "remotion";

type Pt = [number, number];

/**
 * Wackeliges Polygon für Aquarellflächen und Architektur:
 * Ecken leicht verschoben, Kanten mit Zwischenpunkten leicht gebogen.
 */
export const roughPoly = (pts: Pt[], seed: string, jitter = 6, closed = true): string => {
  const out: Pt[] = [];
  const n = pts.length;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const ja: Pt = [a[0] + (random(`${seed}-x${i}`) - 0.5) * jitter, a[1] + (random(`${seed}-y${i}`) - 0.5) * jitter];
    out.push(ja);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const steps = Math.max(1, Math.floor(len / 120));
    for (let s = 1; s < steps + 1; s++) {
      const t = s / (steps + 1);
      out.push([
        a[0] + (b[0] - a[0]) * t + (random(`${seed}-m${i}-${s}x`) - 0.5) * jitter * 0.8,
        a[1] + (b[1] - a[1]) * t + (random(`${seed}-m${i}-${s}y`) - 0.5) * jitter * 0.8,
      ]);
    }
  }
  if (!closed) {
    const last = pts[n - 1];
    out.push([last[0] + (random(`${seed}-lx`) - 0.5) * jitter, last[1] + (random(`${seed}-ly`) - 0.5) * jitter]);
  }
  return "M" + out.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + (closed ? " Z" : "");
};

/** Rechteck, leicht verzogen (schiefe Architektur). skew = horizontale Verschiebung oben. */
export const skewRect = (x: number, y: number, w: number, h: number, skew = 0, lean = 0): Pt[] => [
  [x + skew, y + lean],
  [x + w + skew, y - lean],
  [x + w, y + h],
  [x, y + h],
];

/** Glatte Kurve durch Punkte (Catmull-Rom → Bezier). */
export const smoothPath = (pts: Pt[], closed = true): string => {
  const n = pts.length;
  const get = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + (closed ? " Z" : "");
};
