const fs = require("fs");
const b = fs.readFileSync("raw/head-bang.f32");
const a = new Float32Array(b.buffer, b.byteOffset, b.length / 4),
  sr = 22050,
  hop = 220;
const rms = [];
for (let i = 0; i < a.length; i += hop) {
  let s = 0;
  for (let j = i; j < Math.min(i + hop, a.length); j++) s += a[j] * a[j];
  rms.push(Math.sqrt(s / hop));
}
const flux = rms.map((v, i) => Math.max(0, v - (rms[i - 2] || 0)));
const scores = [];
for (let bpm = 85; bpm < 145; bpm += 0.1) {
  const lag = ((60 / bpm) * sr) / hop;
  let sum = 0;
  for (let i = 200; i < Math.min(flux.length, 6500) - lag; i++)
    sum += flux[i] * flux[Math.round(i + lag)];
  scores.push({ bpm: +bpm.toFixed(1), score: sum });
}
scores.sort((a, b) => b.score - a.score);
const peaks = [];
for (let i = 2; i < rms.length - 2; i++)
  if (flux[i] > 0.025 && flux[i] >= flux[i - 1] && flux[i] > flux[i + 1])
    peaks.push({ t: +((i * hop) / sr).toFixed(3), power: +flux[i].toFixed(4) });
const seconds = [];
for (let i = 0; i < 35; i++) {
  const s = rms.slice(
    Math.floor((i * sr) / hop),
    Math.floor(((i + 1) * sr) / hop),
  );
  seconds.push({
    t: i,
    rms: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(3),
  });
}
fs.writeFileSync(
  "raw/audio-analysis.json",
  JSON.stringify({ scores: scores.slice(0, 10), seconds, peaks }, null, 2),
);
console.log(
  JSON.stringify(
    {
      scores: scores.slice(0, 5),
      seconds,
      peaks: peaks.filter((p) => p.t < 16),
    },
    null,
    2,
  ),
);
