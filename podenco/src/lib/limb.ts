import { deg, } from "./math";
import { smoothPath } from "./rough";

type Pt = [number, number];

/** Gelenkkette aus absoluten Winkeln (Grad, 0 = senkrecht nach unten, + = nach vorn/rechts). */
export const chain = (start: Pt, lengths: number[], angles: number[]): Pt[] => {
  const pts: Pt[] = [start];
  let [x, y] = start;
  lengths.forEach((l, i) => {
    const a = deg(angles[i]);
    x += Math.sin(a) * l;
    y += Math.cos(a) * l;
    pts.push([x, y]);
  });
  return pts;
};

/** Gliedmaßen-Umriss: Kette mit Breiten je Gelenk → geschlossener, weicher Pfad. */
export const limbOutline = (pts: Pt[], widths: number[]): string => {
  const n = pts.length;
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const w = widths[i] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  // runde Kappe am Ende
  const e = pts[n - 1];
  const p = pts[n - 2];
  const el = Math.hypot(e[0] - p[0], e[1] - p[1]) || 1;
  const cap: Pt = [e[0] + ((e[0] - p[0]) / el) * widths[n - 1] * 0.45, e[1] + ((e[1] - p[1]) / el) * widths[n - 1] * 0.45];
  return smoothPath([...L, cap, ...R.reverse()], true);
};

/** Punkt entlang der Kette (t 0..1 über alle Segmente) mit seitlichem Versatz s (-1..1 der halben Breite). */
export const alongChain = (pts: Pt[], widths: number[], t: number, s: number): Pt => {
  const segs = pts.length - 1;
  const ft = Math.min(segs - 0.001, Math.max(0, t * segs));
  const i = Math.floor(ft);
  const u = ft - i;
  const a = pts[i];
  const b = pts[i + 1];
  const w = (widths[i] + (widths[i + 1] - widths[i]) * u) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [a[0] + dx * u - (dy / len) * w * s, a[1] + dy * u + (dx / len) * w * s];
};
