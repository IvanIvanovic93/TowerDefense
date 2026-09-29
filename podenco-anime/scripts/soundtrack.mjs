// Synthetisiert den Soundtrack (Anime-Opening im Metal-Stil) nach public/soundtrack.wav.
// Alles ist selbst erzeugt: keine Samples, keine fremde Musik.
// Tempo 150 BPM = 12 Frames pro Schlag bei 30 fps, damit Hits exakt auf Schnitten liegen.
// Aufruf: node scripts/soundtrack.mjs
import fs from "node:fs";
import path from "node:path";

const SR = 88200; // intern 2x Oversampling wegen der Verzerrung
const OUT_SR = 44100;
const DUR = 30;
const N = Math.ceil(SR * DUR);
const sec = (fr) => fr / 30;
const at = (fr) => Math.floor(sec(fr) * SR);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

let seed = 7;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;

class Biquad {
  constructor(type, f, q = 0.707, gain = 0) {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(type, f, q, gain);
  }
  set(type, f, q = 0.707, g = 0) {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const cs = Math.cos(w);
    const sn = Math.sin(w);
    const a = sn / (2 * q);
    const A = Math.pow(10, g / 40);
    let b0, b1, b2, a0, a1, a2;
    if (type === "lp")
      [b0, b1, b2, a0, a1, a2] = [
        (1 - cs) / 2,
        1 - cs,
        (1 - cs) / 2,
        1 + a,
        -2 * cs,
        1 - a,
      ];
    else if (type === "hp")
      [b0, b1, b2, a0, a1, a2] = [
        (1 + cs) / 2,
        -(1 + cs),
        (1 + cs) / 2,
        1 + a,
        -2 * cs,
        1 - a,
      ];
    else if (type === "bp")
      [b0, b1, b2, a0, a1, a2] = [a, 0, -a, 1 + a, -2 * cs, 1 - a];
    else
      [b0, b1, b2, a0, a1, a2] = [
        1 + a * A,
        -2 * cs,
        1 - a * A,
        1 + a / A,
        -2 * cs,
        1 - a / A,
      ];
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
  }
  p(x) {
    const y =
      this.b0 * x +
      this.b1 * this.x1 +
      this.b2 * this.x2 -
      this.a1 * this.y1 -
      this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

const buf = () => new Float32Array(N);
const gtrL = buf(),
  gtrR = buf(),
  lead = buf(),
  bass = buf();
const drL = buf(),
  drR = buf(),
  clL = buf(),
  clR = buf(),
  fxL = buf(),
  fxR = buf();
const revL = buf(),
  revR = buf();

const add = (b, i, v) => {
  if (i >= 0 && i < N) b[i] += v;
};

// ---------- Instrumente ----------

/** Verzerrte Rhythmusgitarre, doppelt eingespielt (links/rechts leicht verschieden) */
function gtr(
  fr,
  durFr,
  root,
  { palm = false, vel = 1, power = true, dive = 0 } = {},
) {
  const notes = power
    ? [
        [root, 1],
        [root + 7, 0.8],
        [root + 12, 0.55],
      ]
    : [[root, 1]];
  const len = at(durFr);
  const rel = Math.floor(0.04 * SR);
  [gtrL, gtrR].forEach((b, side) => {
    const off = side ? Math.floor(0.006 * SR) : 0;
    const det = side ? 1.0035 : 0.9965;
    const cutoff = palm ? 520 : 2600;
    const k = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
    for (const [m, amp] of notes) {
      const f = mtof(m) * det;
      let p1 = rnd(),
        p2 = rnd(),
        lp = 0;
      const s0 = at(fr) + off;
      for (let i = 0; i < len + rel; i++) {
        const t = i / SR;
        const pitch = dive
          ? Math.pow(0.5, Math.min(1, t / (dive * sec(durFr))) * 1.2)
          : 1;
        p1 += (f * pitch) / SR;
        p2 += (f * 1.004 * pitch) / SR;
        p1 -= Math.floor(p1);
        p2 -= Math.floor(p2);
        let env =
          Math.min(1, t / 0.002) *
          (palm ? Math.exp(-t / 0.075) : Math.exp(-t / 3));
        if (i > len) env *= 1 - (i - len) / rel;
        const raw = (p1 * 2 - 1 + (p2 * 2 - 1)) * 0.5;
        lp += (raw - lp) * k;
        add(b, s0 + i, lp * env * amp * vel);
      }
    }
  });
}

function bassNote(fr, durFr, m, vel = 1) {
  const f = mtof(m);
  const len = at(durFr);
  const rel = Math.floor(0.03 * SR);
  let p = 0;
  const s0 = at(fr);
  for (let i = 0; i < len + rel; i++) {
    const t = i / SR;
    p += f / SR;
    p -= Math.floor(p);
    let env = Math.min(1, t / 0.003) * Math.exp(-t / 1.5);
    if (i > len) env *= 1 - (i - len) / rel;
    add(
      bass,
      s0 + i,
      ((p * 2 - 1) * 0.6 + Math.sin(p * 2 * Math.PI) * 0.6) * env * vel,
    );
  }
}

function kick(fr, vel = 1) {
  let ph = 0;
  const s0 = at(fr);
  for (let i = 0; i < 0.35 * SR; i++) {
    const t = i / SR;
    ph += (48 + 140 * Math.exp(-t / 0.028)) / SR;
    const v =
      (Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.2) +
        noise() * Math.exp(-t / 0.002) * 0.6) *
      vel *
      0.9;
    add(drL, s0 + i, v);
    add(drR, s0 + i, v);
  }
}

function snare(fr, vel = 1) {
  const bp = new Biquad("bp", 1900, 0.7);
  const hp = new Biquad("hp", 500);
  const s0 = at(fr);
  for (let i = 0; i < 0.3 * SR; i++) {
    const t = i / SR;
    const n = hp.p(bp.p(noise())) * Math.exp(-t / 0.13) * 2.2;
    const tone =
      (Math.sin(2 * Math.PI * 185 * t) +
        0.5 * Math.sin(2 * Math.PI * 330 * t)) *
      Math.exp(-t / 0.05) *
      0.6;
    const v = (n + tone) * vel * 0.55;
    add(drL, s0 + i, v);
    add(drR, s0 + i, v);
    add(revL, s0 + i, v * 0.15);
    add(revR, s0 + i, v * 0.15);
  }
}

function hat(fr, vel = 1, open = false) {
  const hp = new Biquad("hp", 7500);
  const s0 = at(fr);
  const d = open ? 0.2 : 0.035;
  for (let i = 0; i < d * 5 * SR; i++) {
    const t = i / SR;
    const v = hp.p(noise()) * Math.exp(-t / d) * vel * 0.2;
    add(drL, s0 + i, v * 0.7);
    add(drR, s0 + i, v);
  }
}

function crash(fr, vel = 1, len = 1.6) {
  const s0 = at(fr);
  [drL, drR].forEach((b, side) => {
    const hp = new Biquad("hp", 3200);
    const pk = new Biquad("peak", 6500 + side * 700, 2, 6);
    for (let i = 0; i < len * 2.5 * SR; i++) {
      const t = i / SR;
      const v =
        pk.p(hp.p(noise())) *
        Math.exp(-t / len) *
        Math.min(1, t / 0.001) *
        vel *
        0.3;
      add(b, s0 + i, v);
      add(side ? revR : revL, s0 + i, v * 0.2);
    }
  });
}

function reverseCrash(endFr, durFr, vel = 1) {
  const len = at(durFr);
  const s1 = at(endFr);
  [fxL, fxR].forEach((b, side) => {
    const hp = new Biquad("hp", 2500 + side * 300);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      add(b, s1 - len + i, hp.p(noise()) * Math.pow(t, 3) * vel * 0.35);
    }
  });
}

function tom(fr, m, vel = 1) {
  const f = mtof(m);
  let ph = 0;
  const s0 = at(fr);
  for (let i = 0; i < 0.5 * SR; i++) {
    const t = i / SR;
    ph += (f * (1 + 0.6 * Math.exp(-t / 0.04))) / SR;
    const v =
      (Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.22) +
        noise() * Math.exp(-t / 0.01) * 0.2) *
      vel *
      0.65;
    add(drL, s0 + i, v * (0.6 + (m % 5) * 0.1));
    add(drR, s0 + i, v * (1.1 - (m % 5) * 0.1));
    add(revL, s0 + i, v * 0.12);
    add(revR, s0 + i, v * 0.12);
  }
}

/** Tiefer Einschlag für Impacts */
function boom(fr, vel = 1, len = 1.1) {
  const lp = new Biquad("lp", 500);
  let ph = 0;
  const s0 = at(fr);
  for (let i = 0; i < len * 2 * SR; i++) {
    const t = i / SR;
    ph += (26 + 60 * Math.exp(-t / 0.18)) / SR;
    const v =
      (Math.sin(2 * Math.PI * ph) * Math.exp(-t / len) +
        lp.p(noise()) * Math.exp(-t / 0.2) * 1.2) *
      vel *
      0.8;
    add(fxL, s0 + i, v);
    add(fxR, s0 + i, v);
  }
}

/** Rauschen mit wanderndem Bandpass: Riser (aufwärts) oder Whoosh (abwärts) */
function sweep(fr, durFr, f0, f1, vel = 1, shape = "rise") {
  const len = at(durFr);
  const s0 = at(fr);
  [fxL, fxR].forEach((b, side) => {
    const bp = new Biquad("bp", f0, 1.2);
    for (let i = 0; i < len; i++) {
      const u = i / len;
      if (i % 32 === 0)
        bp.set("bp", f0 * Math.pow(f1 / f0, u) * (1 + side * 0.05), 1.4);
      const env =
        shape === "rise"
          ? Math.pow(u, 2)
          : Math.sin(Math.PI * u) * (1 - u * 0.5);
      const v = bp.p(noise()) * env * vel * 0.9;
      add(b, s0 + i, v);
      add(side ? revR : revL, s0 + i, v * 0.3);
    }
  });
}

/** Glöckchen / Glanzpunkt-"Ting" */
function ting(fr, m, vel = 1, len = 1.2) {
  const f = mtof(m);
  const s0 = at(fr);
  for (let i = 0; i < len * 3 * SR; i++) {
    const t = i / SR;
    const v =
      (Math.sin(2 * Math.PI * f * t) +
        0.5 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.3) +
        0.25 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t / 0.12)) *
      Math.exp(-t / len) *
      Math.min(1, t / 0.001) *
      vel *
      0.16;
    add(fxL, s0 + i, v);
    add(fxR, s0 + i, v);
    add(revL, s0 + i, v * 0.8);
    add(revR, s0 + i, v * 0.8);
  }
}

/** Komik-"Boing" */
function boing(fr, f0 = 220, vel = 1) {
  let ph = 0;
  const s0 = at(fr);
  for (let i = 0; i < 0.5 * SR; i++) {
    const t = i / SR;
    ph +=
      (f0 *
        (1 + 0.35 * Math.sin(2 * Math.PI * 14 * t) * Math.exp(-t / 0.25)) *
        (1 + t)) /
      SR;
    const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.2) * vel * 0.35;
    add(fxL, s0 + i, v);
    add(fxR, s0 + i, v);
  }
}

function splash(fr, vel = 1, len = 0.7) {
  const s0 = at(fr);
  [fxL, fxR].forEach((b, side) => {
    const lp = new Biquad("lp", 8000);
    for (let i = 0; i < len * 2.5 * SR; i++) {
      const t = i / SR;
      if (i % 64 === 0)
        lp.set("lp", 700 + 8000 * Math.exp(-t / (len * 0.6)) + side * 200);
      const grain = rnd() > 0.7 ? 1.6 : 0.6;
      const v =
        lp.p(noise()) *
        grain *
        Math.exp(-t / len) *
        Math.min(1, t / 0.004) *
        vel *
        0.5;
      add(b, s0 + i, v);
      add(side ? revR : revL, s0 + i, v * 0.25);
    }
  });
}

function plop(fr, vel = 1) {
  let ph = 0;
  const s0 = at(fr);
  for (let i = 0; i < 0.15 * SR; i++) {
    const t = i / SR;
    ph += (1100 * Math.exp(-t / 0.05) + 250) / SR;
    const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.05) * vel * 0.4;
    add(fxL, s0 + i, v);
    add(fxR, s0 + i, v);
  }
}

/** Flügelschlag der Tauben: amplitudenmoduliertes Rauschen */
function flutter(fr, durFr, vel = 1) {
  const len = at(durFr);
  const s0 = at(fr);
  [fxL, fxR].forEach((b, side) => {
    const bp = new Biquad("bp", 1100 + side * 300, 0.8);
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const am = Math.pow(
        Math.max(0, Math.sin(2 * Math.PI * (13 + side * 3) * t)),
        3,
      );
      const v =
        bp.p(noise()) * am * Math.exp(-t / (sec(durFr) * 0.6)) * vel * 1.2;
      add(b, s0 + i, v);
    }
  });
}

/** Clean-Gitarre per Karplus-Strong */
function pluck(fr, m, vel = 1, pan = 0, len = 2.2) {
  const f = mtof(m);
  const P = Math.max(2, Math.round(SR / f));
  const line = new Float32Array(P);
  let lpv = 0;
  for (let i = 0; i < P; i++) {
    lpv += (noise() - lpv) * 0.5;
    line[i] = lpv;
  }
  const s0 = at(fr);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((pan + 1) * Math.PI) / 4);
  let idx = 0;
  for (let i = 0; i < len * SR; i++) {
    const y = line[idx];
    const nxt = line[(idx + 1) % P];
    line[idx] = (y + nxt) * 0.5 * 0.9985;
    idx = (idx + 1) % P;
    const t = i / SR;
    const v =
      y *
      vel *
      0.5 *
      Math.min(1, (len * SR - i) / (0.05 * SR)) *
      Math.exp(-t / 1.6);
    add(clL, s0 + i, v * gl);
    add(clR, s0 + i, v * gr);
    add(revL, s0 + i, v * gl * 0.35);
    add(revR, s0 + i, v * gr * 0.35);
  }
}

/** Leadgitarre: Sägezahn mit Einschleifen, Vibrato, später verzerrt */
function leadNote(fr, durFr, m, vel = 1) {
  const f = mtof(m);
  const len = at(durFr);
  const rel = Math.floor(0.06 * SR);
  let p1 = 0,
    p2 = 0.3;
  const s0 = at(fr);
  for (let i = 0; i < len + rel; i++) {
    const t = i / SR;
    const scoop = Math.pow(2, (-1 * Math.exp(-t / 0.025)) / 12);
    const vib = Math.pow(
      2,
      (0.35 *
        Math.sin(2 * Math.PI * 5.6 * t) *
        Math.min(1, Math.max(0, (t - 0.15) / 0.2))) /
        12,
    );
    p1 += (f * scoop * vib) / SR;
    p2 += (f * scoop * vib * 1.006) / SR;
    p1 -= Math.floor(p1);
    p2 -= Math.floor(p2);
    let env = Math.min(1, t / 0.006);
    if (i > len) env *= 1 - (i - len) / rel;
    add(lead, s0 + i, (p1 * 2 - 1 + (p2 * 2 - 1)) * 0.5 * env * vel);
  }
}

// ---------- Bausteine ----------

const BEAT = 12;
const CL = {
  Em: [52, 59, 64, 66, 67, 71],
  C: [48, 55, 60, 62, 64, 67],
  D: [50, 57, 62, 64, 66, 69],
  G: [43, 50, 55, 59, 62, 67],
  B: [47, 54, 59, 61, 63, 66],
};
const ARP = [0, 2, 4, 5, 3, 4, 2, 1];

function arp(from, to, chord, step = 6, vel = 0.8) {
  let k = 0;
  for (let fr = from; fr < to; fr += step, k++)
    pluck(fr, CL[chord][ARP[k % 8]], vel, k % 2 ? 0.4 : -0.4);
}

/** Großer Treffer: Kick, Crash, Boom, offener Akkord */
function hit(fr, root = 40, { chordLen = 10, vel = 1, boomVel = 1 } = {}) {
  kick(fr, 1.1 * vel);
  crash(fr, vel);
  boom(fr, boomVel);
  gtr(fr, chordLen, root, { vel });
  bassNote(fr, chordLen, root - 12, vel);
}

/** Galopp-Riff: pro Schlag 8tel + zwei 16tel, palm muted */
function gallop(fr, root, vel = 1) {
  gtr(fr, 5, root, { palm: true, vel });
  gtr(fr + 6, 2.5, root, { palm: true, vel: vel * 0.85 });
  gtr(fr + 9, 2.5, root, { palm: true, vel: vel * 0.9 });
  bassNote(fr, 5, root - 12, 0.9);
  bassNote(fr + 6, 2.5, root - 12, 0.8);
  bassNote(fr + 9, 2.5, root - 12, 0.8);
}

/** Zwei offene Achtel-Akkorde */
function opens(fr, r1, r2) {
  gtr(fr, 5.5, r1);
  gtr(fr + 6, 5.5, r2);
  bassNote(fr, 5.5, r1 - 12);
  bassNote(fr + 6, 5.5, r2 - 12);
}

/** Metal-Schlagzeug: Doublebass in 16teln, Snare auf 2 und 4, Hi-Hat in 8teln */
function metalDrums(from, to, { blast = false, vel = 1 } = {}) {
  for (let fr = from; fr < to; fr += 3) kick(fr, (blast ? 0.75 : 0.7) * vel);
  if (blast) {
    for (let fr = from + 3; fr < to; fr += 6) snare(fr, 0.7 * vel);
    for (let fr = from; fr < to; fr += BEAT) crash(fr, 0.45 * vel, 0.8);
  } else {
    for (let fr = from + BEAT; fr < to; fr += BEAT * 2) snare(fr, vel);
    for (let fr = from; fr < to; fr += 6) hat(fr, 0.8 * vel);
  }
}

// ---------- Arrangement (Frames) ----------

// 1-4: Intro mit Clean-Gitarre, Hafen am Morgen, Schlaf, Postbote
arp(0, 24, "Em", 6, 1.3);
arp(24, 48, "Em", 6, 1.3);
arp(48, 72, "C", 6, 1.35);
arp(72, 96, "D", 6, 1.4);
bassNote(0, 46, 28, 0.6);
bassNote(48, 22, 36, 0.6);
bassNote(72, 22, 38, 0.65);
reverseCrash(45, 20, 0.4);
for (const fr of [72, 90, 96]) kick(fr, 0.7);
for (const fr of [84, 102]) snare(fr, 0.6);
for (let fr = 72; fr < 105; fr += 6) hat(fr, 0.7);
sweep(75, 20, 2000, 400, 0.5, "whoosh"); // Wind
sweep(105, 12, 3000, 600, 0.6, "whoosh"); // Hut reißt ab
sweep(98, 22, 300, 6000, 0.55, "rise");
reverseCrash(120, 15, 0.8);
ting(108, 88, 0.5, 0.8);

// 5-6: Smash Cut, Auge, Ohren
hit(120, 40, { chordLen: 11 });
ting(128, 88, 1, 1.4);
hit(134, 40, { chordLen: 4, boomVel: 0.8 });
for (let fr = 138, k = 0; fr < 150; fr += 3, k++)
  gtr(fr, 2.5, 40, { palm: true, vel: 0.6 + k * 0.08 });
snare(144, 0.8);
snare(147, 0.9);

// 7: Startpose, Aufbau
for (let fr = 150, k = 0; fr < 174; fr += 3, k++) {
  gtr(fr, 2.5, 40, { palm: true, vel: 0.6 + k * 0.03 });
  bassNote(fr, 2.5, 28, 0.7);
}
for (let fr = 150; fr < 162; fr += 6) snare(fr, 0.5);
for (let fr = 162; fr < 168; fr += 3) snare(fr, 0.65);
for (let fr = 168; fr < 174; fr += 1.5) snare(fr, 0.8);
for (let fr = 150; fr < 174; fr += 12) kick(fr, 0.8);
sweep(150, 26, 250, 7000, 0.6, "rise");

// 8: Weißblitz, Hund schießt los
hit(180, 40, { chordLen: 5 });
gtr(186, 2.5, 43);
gtr(189, 2.5, 45);
kick(186);
snare(186);
kick(189);
snare(189);
sweep(182, 10, 5000, 500, 0.6, "whoosh");

// 9: Verfolgung, Hauptriff
{
  const beats = [
    ["g", 40],
    ["g", 40],
    ["g", 40],
    ["o", 43, 45],
    ["g", 40],
    ["g", 40],
    ["o", 46, 45],
  ];
  beats.forEach((b, k) => {
    const fr = 192 + k * BEAT;
    if (b[0] === "g") gallop(fr, b[1]);
    else opens(fr, b[1], b[2]);
  });
  metalDrums(192, 278);
  crash(192, 0.8);
  crash(240, 0.6);
  gallop(276, 40);
}

// 10: Fischstand mit Speed Ramp
sweep(274, 6, 4000, 800, 0.5, "whoosh");
gtr(278, 25, 40, { dive: 0.35, vel: 0.9 }); // Bandstopp-Effekt beim Übergang in die Zeitlupe
bassNote(278, 25, 28, 0.6);
boom(278, 0.5, 1.6);
tom(284, 40, 0.9);
tom(296, 36, 0.9);
for (const [fr, m] of [
  [282, 91],
  [287, 88],
  [291, 95],
  [295, 90],
  [299, 93],
])
  ting(fr, m, 0.45, 0.6);
reverseCrash(303, 18, 0.9);

// 10-11: Zurück auf volle Geschwindigkeit, Tauben
hit(303, 40, { chordLen: 2, boomVel: 0.6 });
{
  const beats = [
    ["g", 40],
    ["g", 40],
    ["o", 43, 45],
    ["g", 40],
    ["g", 40],
  ];
  beats.forEach((b, k) => {
    const fr = 303 + k * BEAT;
    if (fr >= 360) return;
    if (b[0] === "g") gallop(fr + (k === 0 ? 3 : 0), b[1]);
    else opens(fr, b[1], b[2]);
  });
  metalDrums(306, 360);
  crash(327, 0.9);
  flutter(325, 30, 0.9);
}

// 12: Dächer, Refrain mit Lead
{
  const chords = [
    [360, 36],
    [372, 36],
    [384, 38],
    [396, 38],
    [408, 40],
  ];
  for (const [fr, r] of chords) {
    gtr(fr, 5.5, r, { vel: 0.95 });
    gtr(fr + 6, 5.5, r, { vel: 0.85 });
    bassNote(fr, 11, r - 12);
  }
  metalDrums(360, 420, { blast: true });
  for (const [fr, d, m] of [
    [360, 6, 76],
    [366, 6, 79],
    [372, 12, 83],
    [384, 6, 81],
    [390, 6, 79],
    [396, 12, 78],
    [408, 12, 76],
  ])
    leadNote(fr, d, m);
}

// 13: Hut landet, alles stoppt
plop(432, 0.9);
splash(434, 0.35, 0.4);
ting(438, 88, 0.35, 1.5);
pluck(438, 76, 0.5, 0.3, 2);

// 14: Kopf schief, Blick verhärtet sich
arp(450, 474, "Em", 6, 0.6);
boing(456, 240, 0.9);
for (let fr = 462, k = 0; fr < 474; fr += 1.5, k++) snare(fr, 0.3 + k * 0.05);
ting(471, 95, 1, 1.2);
boing(474, 520, 0.3);

// 15: Sprung von der Hafenkante, Zeitlupe
hit(480, 40, { chordLen: 44, boomVel: 0.7 });
leadNote(480, 44, 88, 0.55);
for (const fr of [492, 504, 516]) kick(fr, 0.7);
sweep(488, 36, 200, 5000, 0.5, "rise");
reverseCrash(524, 30, 0.8);
sweep(524, 16, 6000, 250, 0.9, "whoosh");
gtr(524, 14, 40, { dive: 0.9, vel: 0.9 });
for (const [fr, m] of [
  [528, 45],
  [531, 43],
  [534, 40],
  [537, 36],
])
  tom(fr, m, 1);

// 16: Eintauchen
hit(540, 40, { chordLen: 10, boomVel: 1.4 });
crash(540, 1, 2.2);
splash(540, 1.2, 1.1);
boom(546, 0.6);
tom(546, 36, 1);

// 17: Schwimmen, Clean-Einlage
{
  const prog = [
    [555, "Em", 28],
    [579, "C", 24],
    [603, "G", 31],
    [627, "D", 26],
  ];
  for (const [fr, ch, b] of prog) {
    arp(fr, fr + 24, ch, 6, 0.85);
    bassNote(fr, 22, b + 12, 0.55);
  }
  arp(651, 660, "D", 3, 0.7);
  for (let fr = 555; fr < 648; fr += 24) {
    kick(fr, 0.55);
    kick(fr + 9, 0.4);
    snare(fr + 12, 0.4);
  }
  for (let fr = 555; fr < 648; fr += 6) hat(fr, 0.45);
  gtr(627, 20, 38, { vel: 0.5 });
  for (const [fr, m] of [
    [648, 45],
    [651, 43],
    [654, 40],
    [657, 36],
  ])
    tom(fr, m, 0.9);
  sweep(636, 24, 300, 5000, 0.45, "rise");
}

// 18: Heldenlauf
{
  const beats = [
    ["g", 40],
    ["o", 40, 40],
    ["g", 36],
    ["o", 38, 38],
    ["g", 40],
  ];
  beats.forEach((b, k) => {
    const fr = 660 + k * BEAT;
    if (b[0] === "g") gallop(fr, b[1]);
    else opens(fr, b[1], b[2]);
  });
  metalDrums(660, 720);
  crash(660, 1);
  crash(684, 0.7);
  splash(660, 0.5, 0.5);
  for (const [fr, d, m] of [
    [660, 12, 71],
    [672, 12, 76],
    [684, 6, 78],
    [690, 6, 79],
    [696, 12, 78],
    [708, 12, 83],
  ])
    leadNote(fr, d, m);
}

// 19: Rührung, Halbtempo
{
  for (const [fr, r, ch] of [
    [720, 36, "C"],
    [744, 43, "G"],
    [768, 38, "D"],
  ]) {
    gtr(fr, 22, r, { vel: 0.8 });
    bassNote(fr, 22, r - 12, 0.9);
    arp(fr, fr + 24, ch, 3, 0.35);
  }
  crash(720, 0.9, 2);
  for (let fr = 720; fr < 780; fr += 24) {
    kick(fr, 0.8);
    kick(fr + 18, 0.5);
    snare(fr + 12, 0.8);
  }
  for (let fr = 720; fr < 780; fr += 6) hat(fr, 0.4, fr % 12 === 6);
  for (const [fr, d, m] of [
    [720, 18, 76],
    [738, 6, 78],
    [744, 12, 79],
    [756, 12, 83],
    [768, 12, 81],
  ])
    leadNote(fr, d, m, 0.9);
}

// 20: Chibi-Schütteln
ting(780, 96, 0.6, 0.5);
boing(784, 300, 0.7);
for (let fr = 788, k = 0; fr < 818; fr += 1.5, k++) {
  gtr(fr, 1.2, k % 2 ? 41 : 40, { palm: true, vel: 0.75 });
  if (k % 2 === 0) tom(fr, 40 + (k % 8), 0.45);
}
sweep(788, 30, 800, 4000, 0.35, "whoosh");
splash(792, 0.4, 0.8);
ting(820, 91, 0.7, 0.8);
boing(821, 420, 0.5);
for (const [fr, m] of [
  [824, 67],
  [828, 66],
  [832, 65],
])
  leadNote(fr, 3.5, m, 0.45);
leadNote(836, 4, 64, 0.45);
for (const [fr, m] of [
  [834, 45],
  [836, 43],
  [838, 40],
])
  tom(fr, m, 0.9);

// 21: Schluss, Freeze Frame, Abblende
{
  for (const [fr, r] of [
    [840, 36],
    [852, 38],
  ]) {
    gtr(fr, 5.5, r);
    gtr(fr + 6, 5.5, r);
    bassNote(fr, 11, r - 12);
  }
  metalDrums(840, 864);
  crash(840, 0.8);
  leadNote(840, 12, 79);
  leadNote(852, 8, 78);
  leadNote(860, 8, 81);
  snare(864, 0.9);
  snare(866, 1);
  hit(868, 40, { chordLen: 32, boomVel: 0.9 });
  crash(868, 0.8, 2.5);
  leadNote(868, 32, 88, 0.9);
  arp(868, 900, "Em", 3, 0.4);
  ting(868, 100, 0.8, 1.5);
}

// ---------- Mischung ----------

function distort(src, { gain, lp, level, bias = 0.08 }) {
  const hp = new Biquad("hp", 110);
  const out = new Float32Array(N);
  const l1 = new Biquad("lp", lp, 0.7);
  const l2 = new Biquad("lp", lp * 1.1, 0.7);
  const pk = new Biquad("peak", 1700, 1, 3);
  const mid = new Biquad("peak", 600, 1, -3);
  const hp2 = new Biquad("hp", 75);
  const norm = Math.tanh(gain * 0.2 + bias);
  for (let i = 0; i < N; i++) {
    const x = hp.p(src[i]) * gain;
    const y = (Math.tanh(x + bias) - Math.tanh(bias)) / norm;
    out[i] = hp2.p(mid.p(pk.p(l2.p(l1.p(y))))) * level;
  }
  return out;
}

function reverb(inp, spread) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => {
    const len = (d + spread) * 2;
    return { b: new Float32Array(len), i: 0, s: 0 };
  });
  const aps = [556, 441, 341, 225].map((d) => ({
    b: new Float32Array((d + spread) * 2),
    i: 0,
  }));
  const out = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const x = inp[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.b[c.i];
      c.s = o * 0.8 + c.s * 0.2;
      c.b[c.i] = x + c.s * 0.86;
      c.i = (c.i + 1) % c.b.length;
      y += o;
    }
    for (const a of aps) {
      const o = a.b[a.i];
      const v = y + o * 0.5;
      a.b[a.i] = v;
      a.i = (a.i + 1) % a.b.length;
      y = o - v * 0.5;
    }
    out[n] = y;
  }
  return out;
}

const gl = distort(gtrL, { gain: 26, lp: 5200, level: 0.3 });
const gr = distort(gtrR, { gain: 26, lp: 5000, level: 0.3 });
const ld = distort(lead, { gain: 9, lp: 6500, level: 0.26, bias: 0.12 });
const bassLp = new Biquad("lp", 1100);
const bassHp = new Biquad("hp", 35);
const delayL = Math.floor(sec(9) * SR);
const delayR = Math.floor(sec(6) * SR);
for (let i = 0; i < N; i++) {
  bass[i] = Math.tanh(bassHp.p(bassLp.p(bass[i])) * 1.8) * 0.32;
  revL[i] += ld[i] * 0.5 + clL[i] * 0.2;
  revR[i] += ld[i] * 0.5 + clR[i] * 0.2;
}
const rvL = reverb(revL, 0);
const rvR = reverb(revR, 23);

const L = new Float32Array(N);
const R = new Float32Array(N);
const hpL = new Biquad("hp", 28);
const hpR = new Biquad("hp", 28);
for (let i = 0; i < N; i++) {
  const dl = i >= delayL ? ld[i - delayL] * 0.28 : 0;
  const dr = i >= delayR ? ld[i - delayR] * 0.28 : 0;
  L[i] = hpL.p(
    gl[i] +
      gr[i] * 0.25 +
      ld[i] +
      dl +
      bass[i] +
      drL[i] * 0.55 +
      clL[i] * 0.55 +
      fxL[i] * 0.6 +
      rvL[i] * 0.9,
  );
  R[i] = hpR.p(
    gr[i] +
      gl[i] * 0.25 +
      ld[i] +
      dr +
      bass[i] +
      drR[i] * 0.55 +
      clR[i] * 0.55 +
      fxR[i] * 0.6 +
      rvR[i] * 0.9,
  );
}

// Bus-Kompressor und weicher Limiter
let env = 0;
const att = Math.exp(-1 / (0.004 * SR));
const relc = Math.exp(-1 / (0.15 * SR));
for (let i = 0; i < N; i++) {
  const lvl = Math.max(Math.abs(L[i]), Math.abs(R[i]));
  env = lvl > env ? att * env + (1 - att) * lvl : relc * env + (1 - relc) * lvl;
  const thr = 0.5;
  const g = env > thr ? Math.pow(env / thr, 1 / 3 - 1) : 1;
  L[i] = Math.tanh(L[i] * g * 1.3);
  R[i] = Math.tanh(R[i] * g * 1.3);
}

// Ausklingen zum Schluss (letzte 0,35 s)
const fadeStart = N - Math.floor(0.35 * SR);
for (let i = fadeStart; i < N; i++) {
  const k = 1 - (i - fadeStart) / (N - fadeStart);
  L[i] *= k;
  R[i] *= k;
}

// Heruntertakten auf 44,1 kHz mit Tiefpass
const aa = [new Biquad("lp", 19000, 0.54), new Biquad("lp", 19000, 1.31)];
const ab = [new Biquad("lp", 19000, 0.54), new Biquad("lp", 19000, 1.31)];
const M = Math.floor(N / 2);
const outL = new Float32Array(M);
const outR = new Float32Array(M);
for (let i = 0; i < N; i++) {
  const l = aa[1].p(aa[0].p(L[i]));
  const r = ab[1].p(ab[0].p(R[i]));
  if (i % 2 === 0 && i / 2 < M) {
    outL[i / 2] = l;
    outR[i / 2] = r;
  }
}
let peak = 0;
for (let i = 0; i < M; i++)
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
const norm = 0.95 / peak;

const data = Buffer.alloc(M * 4);
for (let i = 0; i < M; i++) {
  data.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, outL[i] * norm)) * 32767),
    i * 4,
  );
  data.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, outR[i] * norm)) * 32767),
    i * 4 + 2,
  );
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(OUT_SR, 24);
header.writeUInt32LE(OUT_SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
const out = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "public",
  "soundtrack.wav",
);
fs.writeFileSync(out, Buffer.concat([header, data]));

// Kurzer Pegelbericht je Sekunde (RMS in dBFS), zum Abgleich der Abschnitte
const rows = [];
for (let s = 0; s < DUR; s++) {
  let sum = 0;
  for (let i = s * OUT_SR; i < (s + 1) * OUT_SR && i < M; i++)
    sum += (outL[i] * norm) ** 2;
  rows.push(`${s}s:${(10 * Math.log10(sum / OUT_SR + 1e-12)).toFixed(0)}`);
}
console.log(`geschrieben: ${out}`);
console.log(rows.join(" "));
