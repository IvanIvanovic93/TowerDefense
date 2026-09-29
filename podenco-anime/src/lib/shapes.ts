// Hilfen für Konturformen: Gliedmaßen als eine geschlossene Umrisslinie.
export type Pt = [number, number];

const f = (n: number) => n.toFixed(1);

/**
 * Baut aus einer Mittellinie mit Breiten eine geschlossene, weich gerundete Umrissform.
 * So entstehen Beine, Hals und Schwanz ohne sichtbare Nähte an den Gelenken.
 */
export const limbPath = (pts: Pt[], widths: number[]): string => {
  const n = pts.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[Math.min(n - 1, i + 1)];
    let dx = p1[0] - p0[0];
    let dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const w = widths[i] / 2;
    left.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    right.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const outline = [...left, ...right.reverse()];
  return smoothClosed(outline, pts, widths);
};

// Catmull-Rom durch die Umrisspunkte, runde Kappen an beiden Enden
const smoothClosed = (outline: Pt[], pts: Pt[], widths: number[]) => {
  const n = pts.length;
  const L = outline.slice(0, n);
  const R = outline.slice(n);
  const seg = (arr: Pt[]) => {
    let d = "";
    for (let i = 0; i < arr.length - 1; i++) {
      const p0 = arr[Math.max(0, i - 1)];
      const p1 = arr[i];
      const p2 = arr[i + 1];
      const p3 = arr[Math.min(arr.length - 1, i + 2)];
      const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
    }
    return d;
  };
  const endR = widths[n - 1] / 2;
  const startR = widths[0] / 2;
  let d = `M${f(L[0][0])},${f(L[0][1])}`;
  d += seg(L);
  d += ` A${f(endR)},${f(endR)} 0 0 0 ${f(R[0][0])},${f(R[0][1])}`;
  d += seg(R);
  d += ` A${f(startR)},${f(startR)} 0 0 0 ${f(L[0][0])},${f(L[0][1])} Z`;
  return d;
};

/** Zwei-Segment-Gelenk: Start, Winkel oben/unten (Grad, 0 = senkrecht nach unten), Längen */
export const joint = (
  origin: Pt,
  a1: number,
  l1: number,
  a2: number,
  l2: number,
): [Pt, Pt, Pt] => {
  const r1 = (a1 * Math.PI) / 180;
  const r2 = (a2 * Math.PI) / 180;
  const k: Pt = [origin[0] + Math.sin(r1) * l1, origin[1] + Math.cos(r1) * l1];
  const e: Pt = [k[0] + Math.sin(r2) * l2, k[1] + Math.cos(r2) * l2];
  return [origin, k, e];
};

export const polar = (o: Pt, angleDeg: number, len: number): Pt => {
  const r = (angleDeg * Math.PI) / 180;
  return [o[0] + Math.sin(r) * len, o[1] + Math.cos(r) * len];
};
