const fs = require("fs"),
  path = require("path"),
  { spawnSync } = require("child_process");
// Preview writes only analysis artifacts; the public mix is replaced only on a normal run.
const preview = process.argv.includes("--preview");
const work = "out/orbita/audio-analysis-work";
fs.mkdirSync(work, { recursive: true });
const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-y", ...args], {
    encoding: "utf8",
  });
  if (r.error || r.status !== 0) throw r.error || Error(r.stderr);
  return r.stderr;
};
const read = (p) => {
  const b = fs.readFileSync(p);
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
};
const sr = 48000,
  duration = 22,
  rate = 110 / 148,
  drop = 3.9,
  preroll = 1,
  offset = 13.809 - drop * rate,
  fullPath = path.join(work, "full.f32"),
  lowPath = path.join(work, "low.f32");
ff([
  "-i",
  "raw/head-bang.mp3",
  "-af",
  `atrim=start=${offset - preroll * rate},asetpts=PTS-STARTPTS,atempo=${rate},atrim=duration=${duration + preroll}`,
  "-ac",
  "1",
  "-ar",
  String(sr),
  "-f",
  "f32le",
  fullPath,
]);
ff([
  "-f",
  "f32le",
  "-ar",
  String(sr),
  "-ac",
  "1",
  "-i",
  fullPath,
  "-af",
  "lowpass=f=850:p=2",
  "-f",
  "f32le",
  lowPath,
]);
const full = read(fullPath),
  low = read(lowPath),
  head = Math.round(preroll * sr),
  out = new Float32Array(sr * duration),
  smooth = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
if (full.length < head + out.length || low.length < head + out.length)
  throw Error("Music decode is shorter than the 22-second composition.");
for (let i = 0; i < out.length; i++) {
  const t = i / sr,
    open = smooth((t - drop + 0.07) / 0.14),
    close = smooth((t - 19.18) / 2.4),
    mix = (1 - close) * open;
  out[i] = (full[head + i] * mix + low[head + i] * 0.7 * (1 - mix)) * 0.65;
}
// Peaks coincide with exported visual landings. Trim long whoosh tails to keep moves distinct.
const cues = [
  ["search", 0.5, "click"],
  ["reveal", 1.15, "whoosh"],
  ["map", 3.9, "whoosh"],
  ["route", 5.0, "click"],
  ["ticket", 7.1, "whoosh"],
  ["ticket-confirm", 9.422, "click"],
  ["wallet", 10.44, "whoosh"],
  ["confirm", 14.33, "click"],
  ["compass", 14.805, "whoosh"],
  ["return", 19.18, "whoosh"],
];
const ledger = [];
for (const [name, time, type] of cues) {
  const data = read(`raw/${type}.f32`);
  let peak = 0;
  for (let i = 1; i < data.length; i++)
    if (Math.abs(data[i]) > Math.abs(data[peak])) peak = i;
  const cropStart =
      type === "whoosh" ? Math.max(0, peak - Math.round(sr * 0.38)) : 0,
    cropEnd =
      type === "whoosh"
        ? Math.min(data.length, peak + Math.round(sr * 0.64))
        : data.length,
    start = Math.round(time * sr) - peak;
  for (let i = cropStart; i < cropEnd; i++) {
    const j = start + i,
      fade =
        smooth((i - cropStart) / (sr * 0.025)) *
        smooth((cropEnd - 1 - i) / (sr * 0.11));
    if (j >= 0 && j < out.length)
      out[j] += data[i] * fade * (type === "click" ? 0.15 : 0.072);
  }
  ledger.push({
    name,
    time,
    source: type,
    peak: peak / sr,
    start: (start + cropStart) / sr,
    end: (start + cropEnd) / sr,
  });
}
// Fade into the real music BEFORE t=0, ending at the sample immediately before
// the opening sample. Copying the first .42s here previously jumped from +.42s to zero.
const seam = Math.round(sr * 0.42);
for (let j = 0; j < seam; j++) {
  const p = smooth(j / (seam - 1)),
    i = out.length - seam + j;
  out[i] = out[i] * (1 - p) + low[head - seam + j] * 0.7 * 0.65 * p;
}
const mixPath = path.join(work, "mix.f32");
fs.writeFileSync(mixPath, Buffer.from(out.buffer));
const input = ["-f", "f32le", "-ar", String(sr), "-ac", "1", "-i", mixPath];
const pass = ff([
  ...input,
  "-af",
  "pan=stereo|c0=c0|c1=c0,loudnorm=I=-14:TP=-1.3:LRA=12:print_format=json",
  "-f",
  "null",
  "-",
]);
const measured = JSON.parse(pass.match(/\{[\s\S]*\}/)[0]);
// Run loudness processing over repeated cycles, then keep the middle one.
// Its dynamics already have 22 seconds of context at the retained boundary.
const repeated = Buffer.concat([
  Buffer.from(out.buffer),
  Buffer.from(out.buffer),
  Buffer.from(out.buffer),
]);
const repeatedPath = path.join(work, "repeated.f32");
fs.writeFileSync(repeatedPath, repeated);
const normalizedPath = path.join(work, "normalized.f32");
ff([
  "-f",
  "f32le",
  "-ar",
  String(sr),
  "-ac",
  "1",
  "-i",
  repeatedPath,
  "-af",
  `pan=stereo|c0=c0|c1=c0,loudnorm=I=-14:TP=-1.3:LRA=12,atrim=start=${duration}:duration=${duration},asetpts=PTS-STARTPTS`,
  "-ar",
  String(sr),
  "-f",
  "f32le",
  normalizedPath,
]);
const normalized = read(normalizedPath);
const normalizedInput = [
  "-f",
  "f32le",
  "-ar",
  String(sr),
  "-ac",
  "2",
  "-i",
  normalizedPath,
];
const finalMeasurement = JSON.parse(
  ff([
    ...normalizedInput,
    "-af",
    "loudnorm=I=-14:TP=-1.3:LRA=12:print_format=json",
    "-f",
    "null",
    "-",
  ]).match(/\{[\s\S]*\}/)[0],
);
const output = preview
  ? "out/orbita/audio-analysis-preview.wav"
  : "public/assets/orbita-mix.wav";
ff([
  ...normalizedInput,
  "-ac",
  "2",
  "-ar",
  String(sr),
  "-c:a",
  "pcm_s24le",
  output,
]);
// Positive energy flux locates attacks independently of effects (<=20ms window latency).
const attacks = [],
  windows = [];
for (let i = 960; i < out.length; i += 240) {
  let a = 0,
    b = 0;
  for (let j = 0; j < 960; j++) {
    a += full[head + i - j] ** 2;
    b += full[head + i - 960 - j] ** 2;
  }
  windows.push({
    time: i / sr,
    strength: Math.max(0, Math.sqrt(a / 960) - Math.sqrt(b / 960)),
  });
}
for (let i = 1; i < windows.length - 1; i++) {
  const v = windows[i];
  if (
    v.strength > windows[i - 1].strength &&
    v.strength >= windows[i + 1].strength &&
    v.strength > 0.12
  )
    attacks.push(v);
}
const strongAttacks = [];
for (const v of attacks.sort((a, b) => b.strength - a.strength))
  if (!strongAttacks.some((p) => Math.abs(p.time - v.time) < 0.15))
    strongAttacks.push(v);
strongAttacks.sort((a, b) => a.time - b.time);
let peak = 0;
for (const sample of out) peak = Math.max(peak, Math.abs(sample));
const report = {
  source: "Head Bang — Arulo / Mixkit",
  duration,
  sampleRate: sr,
  samples: out.length,
  drop,
  rate,
  offset,
  preroll,
  normalization: {
    measured,
    method: "Middle cycle of three repeated loops",
    final: finalMeasurement,
  },
  seam: {
    method: "True pre-roll continuation",
    crossfadeSeconds: seam / sr,
    boundaryStep: Math.abs(out[0] - out[out.length - 1]),
    sourceAdjacentStep: Math.abs(low[head] - low[head - 1]) * 0.7 * 0.65,
    normalizedBoundaryStep: Math.abs(
      normalized[0] - normalized[normalized.length - 1],
    ),
    rawPeak: peak,
  },
  strongAttacks,
  events: ledger,
  output,
};
fs.writeFileSync(
  "out/orbita/audio-analysis-astra.json",
  JSON.stringify(report, null, 2),
);
if (!preview)
  fs.writeFileSync(
    "out/orbita/audio-cues.json",
    JSON.stringify(report, null, 2),
  );
console.log(JSON.stringify(report, null, 2));
