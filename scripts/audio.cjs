const fs = require("fs"),
  { execFileSync } = require("child_process");
const ff = (args) =>
  execFileSync("ffmpeg", ["-hide_banner", "-y", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
const rate = 110 / 148,
  drop = 6.55,
  attack = 13.809,
  offset = attack - drop * rate;
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
  "raw/music-full.f32",
]);
ff([
  "-f",
  "f32le",
  "-ar",
  "48000",
  "-ac",
  "1",
  "-i",
  "raw/music-full.f32",
  "-af",
  "lowpass=f=650:p=2",
  "-f",
  "f32le",
  "raw/music-low.f32",
]);
const read = (p) => {
  const b = fs.readFileSync(p);
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
};
const full = read("raw/music-full.f32"),
  low = read("raw/music-low.f32"),
  out = new Float32Array(48000 * 22);
for (let i = 0; i < out.length; i++) {
  const t = i / 48000,
    open = Math.min(1, Math.max(0, (t - drop + 0.012) / 0.024));
  const tail = Math.min(1, Math.max(0, (22 - t) / 0.26));
  out[i] =
    ((low[i] || 0) * 0.58 * (1 - open) + (full[i] || 0) * open) * 0.7 * tail;
}
const eventList = [
  ["generate", 0.55, "click"],
  ["check", 1.35, "click"],
  ["goo", 2.15, "whoosh"],
  ["question", 2.95, "click"],
  ["reply", 3.75, "click"],
  ["merge", 4.8, "whoosh"],
  ["triangle", 5.6, "whoosh"],
  ["drop", 6.55, "click"],
  ["like", 7.6, "click"],
  ["swipe", 8.85, "whoosh"],
  ["volume", 10.8, "click"],
  ["stretch", 11.6, "whoosh"],
  ["pan", 12.4, "whoosh"],
  ["chart", 13.2, "whoosh"],
  ["dive", 15.6, "whoosh"],
  ["ask", 16.4, "click"],
  ["line", 17.4, "whoosh"],
  ["logo", 18.2, "whoosh"],
  ["fold", 19.6, "whoosh"],
  ["generate-return", 20.4, "whoosh"],
];
const effects = {};
for (const name of ["click", "whoosh"]) {
  const data = read("raw/" + name + ".f32");
  let peak = 0;
  for (let i = 1; i < data.length; i++)
    if (Math.abs(data[i]) > Math.abs(data[peak])) peak = i;
  effects[name] = { data, peak };
}
const ledger = [];
for (const [name, time, type] of eventList) {
  const { data, peak } = effects[type],
    start = Math.round(time * 48000) - peak;
  for (let i = 0; i < data.length; i++) {
    const pos = start + i;
    if (pos >= 0 && pos < out.length)
      out[pos] += data[i] * (type === "click" ? 0.2 : 0.12);
  }
  ledger.push({
    name,
    time,
    type,
    measuredPeakSeconds: peak / 48000,
    sourceStartOnTimeline: start / 48000,
  });
}
fs.writeFileSync("raw/mix.f32", Buffer.from(out.buffer));
const args = [
  "-f",
  "f32le",
  "-ar",
  "48000",
  "-ac",
  "1",
  "-i",
  "raw/mix.f32",
  "-af",
  "loudnorm=I=-14:TP=-1:LRA=9:print_format=json",
  "-f",
  "null",
  "-",
];
const { spawnSync } = require("child_process");
const first = spawnSync("ffmpeg", ["-hide_banner", ...args], {
  encoding: "utf8",
});
const measured = JSON.parse(first.stderr.match(/\{[\s\S]*\}/)[0]);
ff([
  "-f",
  "f32le",
  "-ar",
  "48000",
  "-ac",
  "1",
  "-i",
  "raw/mix.f32",
  "-af",
  `loudnorm=I=-14:TP=-1:LRA=9:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true`,
  "-ar",
  "48000",
  "-ac",
  "2",
  "public/assets/mix.wav",
]);
fs.writeFileSync(
  "out/audio-cues.json",
  JSON.stringify(
    {
      source: "Head Bang — Arulo / Mixkit 357",
      sourcePulseInterpretation:
        "148 BPM double-time (74 BPM half-time), edit retimed to 110 BPM",
      rate,
      offset,
      sourceAttack: attack,
      drop,
      measured,
      events: ledger,
    },
    null,
    2,
  ),
);
console.log("Audio mix ready", measured);
