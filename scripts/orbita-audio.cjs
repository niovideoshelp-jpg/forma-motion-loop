const fs = require("fs"),
  { spawnSync } = require("child_process");
fs.mkdirSync("out/orbita", { recursive: true });
const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-y", ...args], {
    encoding: "utf8",
  });
  if (r.status) throw Error(r.stderr);
  return r.stderr;
};
const sr = 48000,
  rate = 110 / 148,
  drop = 3.9,
  offset = 13.809 - drop * rate;
ff([
  "-i",
  "raw/head-bang.mp3",
  "-af",
  `atrim=start=${offset},asetpts=PTS-STARTPTS,atempo=${rate},atrim=duration=22`,
  "-ac",
  "1",
  "-ar",
  "48000",
  "-f",
  "f32le",
  "raw/orbita-full.f32",
]);
ff([
  "-f",
  "f32le",
  "-ar",
  "48000",
  "-ac",
  "1",
  "-i",
  "raw/orbita-full.f32",
  "-af",
  "lowpass=f=850:p=2",
  "-f",
  "f32le",
  "raw/orbita-low.f32",
]);
const read = (p) => {
  const b = fs.readFileSync(p);
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
};
const full = read("raw/orbita-full.f32"),
  low = read("raw/orbita-low.f32"),
  out = new Float32Array(sr * 22),
  smooth = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
for (let i = 0; i < out.length; i++) {
  const t = i / sr,
    open = smooth((t - drop + 0.07) / 0.14),
    close = smooth((t - 19.3) / 2.4),
    mix = (1 - close) * open;
  out[i] = ((full[i] || 0) * mix + (low[i] || 0) * 0.7 * (1 - mix)) * 0.65;
}
const cues = [
  ["search", 0.5, "click"],
  ["reveal", 1.15, "whoosh"],
  ["map", 3.9, "whoosh"],
  ["route", 5.05, "click"],
  ["ticket", 7.05, "whoosh"],
  ["wallet", 10.65, "whoosh"],
  ["confirm", 14.15, "click"],
  ["compass", 15.05, "whoosh"],
  ["return", 19.45, "whoosh"],
];
const ledger = [];
for (const [name, time, type] of cues) {
  const data = read(`raw/${type}.f32`);
  let peak = 0;
  for (let i = 1; i < data.length; i++)
    if (Math.abs(data[i]) > Math.abs(data[peak])) peak = i;
  const start = Math.round(time * sr) - peak;
  for (let i = 0; i < data.length; i++) {
    const j = start + i;
    if (j >= 0 && j < out.length)
      out[j] += data[i] * (type === "click" ? 0.13 : 0.065);
  }
  ledger.push({ name, time, source: type, peak: peak / sr, start: start / sr });
}
// Blend the final half second into the beginning so the soundtrack also loops gently.
const seam = Math.round(sr * 0.42);
for (let j = 0; j < seam; j++) {
  const p = smooth(j / (seam - 1)),
    i = out.length - seam + j;
  out[i] = out[i] * (1 - p) + out[j] * p;
}
fs.writeFileSync("raw/orbita-mix.f32", Buffer.from(out.buffer));
ff([
  "-f",
  "f32le",
  "-ar",
  "48000",
  "-ac",
  "1",
  "-i",
  "raw/orbita-mix.f32",
  "-ac",
  "2",
  "raw/orbita-stereo.wav",
]);
const pass = ff([
  "-i",
  "raw/orbita-stereo.wav",
  "-af",
  "loudnorm=I=-14:TP=-1:LRA=12:print_format=json",
  "-f",
  "null",
  "-",
]);
const m = JSON.parse(pass.match(/\{[\s\S]*\}/)[0]);
ff([
  "-i",
  "raw/orbita-stereo.wav",
  "-af",
  `loudnorm=I=-14:TP=-1:LRA=12:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,volume=-0.3dB`,
  "-ar",
  "48000",
  "public/assets/orbita-mix.wav",
]);
fs.writeFileSync(
  "out/orbita/audio-cues.json",
  JSON.stringify(
    {
      source: "Head Bang — Arulo / Mixkit",
      drop,
      rate,
      offset,
      normalization: m,
      events: ledger,
    },
    null,
    2,
  ),
);
console.log("Audio ready", m);
