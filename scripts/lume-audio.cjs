const fs = require("fs"),
  path = require("path"),
  { spawnSync } = require("child_process");

// Public Mixkit URLs were verified against the official source pages.
// Keep existing downloads and decoded files unchanged on repeat runs.
async function ensureSources() {
  const sources = [
    ["deep-urban", "https://assets.mixkit.co/music/623/623.mp3"],
    [
      "select-click",
      "https://assets.mixkit.co/active_storage/sfx/1109/1109-preview.mp3",
    ],
    [
      "option-select",
      "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3",
    ],
    [
      "page-chime",
      "https://assets.mixkit.co/active_storage/sfx/1107/1107-preview.mp3",
    ],
    [
      "air-whoosh",
      "https://assets.mixkit.co/active_storage/sfx/2605/2605-preview.mp3",
    ],
  ];
  fs.mkdirSync("raw/lume", { recursive: true });
  for (const [name, url] of sources) {
    const mp3 = path.join("raw/lume", `${name}.mp3`);
    if (!fs.existsSync(mp3) || fs.statSync(mp3).size === 0) {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok)
        throw Error(`${name}: download returned HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (
        bytes.length < 1024 ||
        response.headers.get("content-type")?.includes("text/")
      )
        throw Error(`${name}: expected a nonempty audio download`);
      const temporary = mp3 + ".download";
      fs.writeFileSync(temporary, bytes);
      fs.renameSync(temporary, mp3);
      console.log(`Downloaded ${name}`);
    }
    if (name === "deep-urban") continue;
    const pcm = path.join("raw/lume", `${name}.f32`);
    if (fs.existsSync(pcm) && fs.statSync(pcm).size > 0) continue;
    const decoded = spawnSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        mp3,
        "-ac",
        "1",
        "-ar",
        "48000",
        "-f",
        "f32le",
        pcm,
      ],
      { encoding: "utf8" },
    );
    if (decoded.error || decoded.status !== 0)
      throw decoded.error || Error(decoded.stderr);
    console.log(`Decoded ${name}`);
  }
}

async function main() {
  await ensureSources();
  if (process.argv.includes("--prepare-only")) {
    console.log("Lume sources ready; the final soundtrack was not changed.");
    return;
  }
  const sr = 48000,
    duration = 22,
    channels = 2,
    preroll = 1,
    bpm = 120,
    rate = 120 / 124,
    drop = 3.3,
    attack = 15.478,
    offset = attack - drop * rate,
    work = "raw/lume";
  const preview = process.argv.includes("--preview");
  fs.mkdirSync("out/lume", { recursive: true });
  const ff = (args) => {
    const r = spawnSync(
      "ffmpeg",
      ["-hide_banner", "-loglevel", "info", "-y", ...args],
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
    if (r.error || r.status !== 0) throw r.error || Error(r.stderr);
    return r.stderr;
  };
  const read = (p) => {
    const b = fs.readFileSync(p);
    return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
  };
  const write = (p, x) => fs.writeFileSync(p, Buffer.from(x.buffer));
  const smooth = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
  const floatInput = (file, n = 2) => [
    "-f",
    "f32le",
    "-ar",
    String(sr),
    "-ac",
    String(n),
    "-i",
    file,
  ];
  const fullPath = path.join(work, "music-full.f32"),
    lowPath = path.join(work, "music-low.f32");
  ff([
    "-i",
    path.join(work, "deep-urban.mp3"),
    "-af",
    `atrim=start=${offset - preroll * rate},asetpts=PTS-STARTPTS,atempo=${rate},atrim=duration=${duration + preroll}`,
    "-ac",
    "2",
    "-ar",
    String(sr),
    "-f",
    "f32le",
    fullPath,
  ]);
  ff([
    ...floatInput(fullPath),
    "-af",
    "lowpass=f=1100:p=2",
    "-f",
    "f32le",
    lowPath,
  ]);
  const full = read(fullPath),
    low = read(lowPath),
    head = sr * preroll,
    count = sr * duration,
    out = new Float32Array(count * channels);
  if (full.length < (head + count) * 2) throw Error("Music source too short");
  for (let i = 0; i < count; i++) {
    const t = i / sr,
      open = smooth((t - drop + 0.075) / 0.15),
      close = smooth((t - 20.3) / 1.15),
      air = 0.16 + 0.84 * open * (1 - close);
    for (let c = 0; c < 2; c++)
      out[i * 2 + c] =
        0.43 *
        (full[(head + i) * 2 + c] * air +
          low[(head + i) * 2 + c] * (1 - air) * 0.85);
  }
  const events = [
    ["subscribe", 3.0, "select-click", 0.075],
    ["library", 3.3, "air-whoosh", 0.065],
    ["activated", 3.9, "page-chime", 0.028],
    ["select-course", 6.8, "select-click", 0.07],
    ["press-play", 8.3, "option-select", 0.055],
    ["progress", 9.3, "air-whoosh", 0.042],
    ["membership", 12.3, "air-whoosh", 0.06],
    ["earned-card", 14.3, "page-chime", 0.035],
    ["brand", 16.3, "air-whoosh", 0.06],
    ["return", 20.3, "air-whoosh", 0.038],
  ];
  const ledger = [];
  for (const [name, time, source, gain] of events) {
    const data = read(path.join(work, `${source}.f32`));
    let peak = 0;
    for (let i = 1; i < data.length; i++)
      if (Math.abs(data[i]) > Math.abs(data[peak])) peak = i;
    const isWhoosh = source === "air-whoosh",
      before = isWhoosh ? 0.16 : 0.12,
      after = isWhoosh ? 0.28 : source === "page-chime" ? 0.55 : 0.18,
      from = Math.max(0, peak - Math.round(before * sr)),
      to = Math.min(data.length, peak + Math.round(after * sr)),
      start = Math.round(time * sr) - peak;
    for (let i = from; i < to; i++) {
      const j = i + start;
      if (j < 0 || j >= count) continue;
      const envelope =
        smooth((i - from) / (sr * 0.012)) *
        smooth((to - 1 - i) / (sr * (isWhoosh ? 0.055 : 0.04)));
      for (let c = 0; c < 2; c++) out[j * 2 + c] += data[i] * gain * envelope;
    }
    ledger.push({
      name,
      time,
      source,
      gain,
      sourcePeak: peak / sr,
      start: (start + from) / sr,
      end: (start + to) / sr,
    });
  }
  // Continue into the pre-roll rather than replaying the start ahead of its time.
  // 22 seconds is exactly 44 beats at 120BPM, so the loop preserves beat phase.
  const seam = Math.round(sr * 0.5);
  for (let j = 0; j < seam; j++) {
    const p = smooth(j / (seam - 1)),
      i = count - seam + j;
    for (let c = 0; c < 2; c++) {
      const k = (head - seam + j) * 2 + c,
        pre = 0.43 * (full[k] * 0.16 + low[k] * 0.84 * 0.85);
      out[i * 2 + c] = out[i * 2 + c] * (1 - p) + pre * p;
    }
  }
  const mixPath = path.join(work, "mix.f32"),
    repeatedPath = path.join(work, "repeated.f32"),
    normalizedPath = path.join(work, "normalized.f32");
  write(mixPath, out);
  fs.writeFileSync(
    repeatedPath,
    Buffer.concat([
      Buffer.from(out.buffer),
      Buffer.from(out.buffer),
      Buffer.from(out.buffer),
    ]),
  );
  const measure = (file) =>
    JSON.parse(
      ff([
        ...floatInput(file),
        "-af",
        "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
        "-f",
        "null",
        "-",
      ]).match(/\{[\s\S]*\}/)[0],
    );
  const original = measure(mixPath);
  // Retain a center cycle with warmed-up dynamics instead of resetting the limiter at the seam.
  ff([
    ...floatInput(repeatedPath),
    "-af",
    `loudnorm=I=-14:TP=-2:LRA=11,atrim=start=${duration}:duration=${duration},asetpts=PTS-STARTPTS`,
    "-ar",
    String(sr),
    "-f",
    "f32le",
    normalizedPath,
  ]);
  const pass = measure(normalizedPath),
    correctionDb = Math.min(
      -14 - Number(pass.input_i),
      -1.1 - Number(pass.input_tp),
    );
  const output = preview
    ? "out/lume/audio-preview.wav"
    : "public/assets/lume-mix.wav";
  ff([
    ...floatInput(normalizedPath),
    "-af",
    `volume=${correctionDb}dB`,
    "-ac",
    "2",
    "-ar",
    String(sr),
    "-c:a",
    "pcm_s24le",
    output,
  ]);
  const final = JSON.parse(
    ff([
      "-i",
      output,
      "-af",
      "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
      "-f",
      "null",
      "-",
    ]).match(/\{[\s\S]*\}/)[0],
  );
  const normalized = read(normalizedPath),
    scale = 10 ** (correctionDb / 20),
    peaks = [],
    rows = [];
  for (let i = 480; i < count; i += 120) {
    let a = 0,
      b = 0;
    for (let j = 0; j < 240; j++)
      for (let c = 0; c < 2; c++) {
        a += full[(head + i - j) * 2 + c] ** 2 / 2;
        b += full[(head + i - 240 - j) * 2 + c] ** 2 / 2;
      }
    rows.push({
      time: i / sr,
      strength: Math.max(0, Math.sqrt(a / 240) - Math.sqrt(b / 240)),
    });
  }
  for (let i = 1; i < rows.length - 1; i++)
    if (
      rows[i].strength > rows[i - 1].strength &&
      rows[i].strength >= rows[i + 1].strength
    )
      peaks.push(rows[i]);
  const beatMap = [3.3, 6.8, 9.3, 12.3, 16.3, 18.3, 20.3].map((time) => {
    const nearby = peaks
      .filter((p) => Math.abs(p.time - time) < 0.04)
      .sort((a, b) => b.strength - a.strength)[0];
    return {
      time,
      measuredAttack: nearby?.time,
      deltaMs: nearby ? Math.round((nearby.time - time) * 1000) : null,
    };
  });
  const report = {
    source: "Deep Urban — Eugenio Mininni / Mixkit",
    sourceUrl: "https://assets.mixkit.co/music/623/623.mp3",
    sourcePage: "https://mixkit.co/free-stock-music/house/",
    license: "https://mixkit.co/license/#musicFree",
    bpm,
    sourceBpm: 124,
    rate,
    offset,
    preroll,
    drop,
    duration,
    sampleRate: sr,
    channels,
    samples: count,
    events: ledger,
    beatMap,
    normalization: { original, centerCycle: pass, correctionDb, final },
    seam: {
      method: "True pre-roll + middle of three normalized cycles",
      crossfadeSeconds: seam / sr,
      boundaryStep: [0, 1].map(
        (c) =>
          Math.abs(normalized[c] - normalized[normalized.length - 2 + c]) *
          scale,
      ),
    },
    output,
  };
  fs.writeFileSync("out/lume/audio-cues.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (Number(final.input_tp) > -1)
    throw Error("Final true peak exceeds -1dBTP");
  if (Math.abs(Number(final.input_i) + 14) > 0.2)
    throw Error("Final integrated loudness is outside -14 +/- 0.2 LUFS");
  if (beatMap.some((b) => b.deltaMs === null || Math.abs(b.deltaMs) > 25))
    throw Error("Music attacks missed frozen visual beats");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
