const { chromium } = require("playwright");
const fs = require("fs"),
  path = require("path"),
  sharp = require("sharp"),
  crypto = require("crypto");
const { spawn, spawnSync } = require("child_process");
process.chdir(path.resolve(__dirname, ".."));
const mode = process.argv[2] || "stills";
const folder = "out/lume",
  width = 1440,
  height = 1440,
  fps = 60,
  duration = 22,
  frameCount = fps * duration;
const travel = [
  [3.3, 4.1],
  [6.8, 7.5],
  [9.3, 10.05],
  [12.3, 13.15],
  [16.3, 16.95],
  [20.3, 21.75],
];
const stills = [
  ["assinatura", 1.7],
  ["biblioteca", 5.5],
  ["player", 8.5],
  ["progresso", 11.7],
  ["assinante", 15.8],
  ["marca", 18.8],
];
if (!["stills", "audit", "render", "transitions", "boundaries"].includes(mode))
  throw Error(`Unknown mode: ${mode}`);
fs.mkdirSync(folder, { recursive: true });
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");
const saveJson = (name, data) =>
  fs.writeFileSync(path.join(folder, name), JSON.stringify(data, null, 2));
const difference = (a, b) => {
  if (a.length !== b.length) throw Error("Pixel buffers differ in size");
  if (a.equals(b))
    return {
      equal: true,
      changedPixels: 0,
      maximumChannelDelta: 0,
      meanAbsoluteChannelDelta: 0,
    };
  let changedPixels = 0,
    maximumChannelDelta = 0,
    sum = 0;
  for (let i = 0; i < a.length; i += 4) {
    let changed = false;
    for (let c = 0; c < 4; c++) {
      const d = Math.abs(a[i + c] - b[i + c]);
      changed ||= d !== 0;
      maximumChannelDelta = Math.max(maximumChannelDelta, d);
      sum += d;
    }
    if (changed) changedPixels++;
  }
  return {
    equal: false,
    changedPixels,
    maximumChannelDelta,
    meanAbsoluteChannelDelta: sum / a.length,
  };
};
const flagJumps = (rows) =>
  rows.filter(
    (v, i) =>
      v.difference > 2 &&
      v.difference >
        3 *
          Math.max(
            0.1,
            ((rows[i - 1]?.difference || 0) + (rows[i + 1]?.difference || 0)) /
              2,
          ),
  );
const smallDifference = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i += 4)
    d +=
      (Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2])) /
      3;
  return d / (a.length / 4);
};
const escapeXml = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
async function contactSheet(shots, columns, tile, name) {
  const gap = 20,
    label = 38,
    rows = Math.ceil(shots.length / columns),
    w = columns * (tile + gap) + gap,
    h = rows * (tile + label + gap) + gap,
    tiles = [];
  for (let i = 0; i < shots.length; i++)
    tiles.push({
      input: await sharp(shots[i].png).resize(tile, tile).toBuffer(),
      left: gap + (i % columns) * (tile + gap),
      top: gap + label + Math.floor(i / columns) * (tile + label + gap),
    });
  const labels = Buffer.from(
    `<svg width="${w}" height="${h}"><style>text{font:15px Arial;fill:#f4f1e9}</style>${shots.map((s, i) => `<text x="${gap + (i % columns) * (tile + gap)}" y="${gap + 25 + Math.floor(i / columns) * (tile + label + gap)}">${escapeXml(s.label)} / ${s.time.toFixed(3)}s</text>`).join("")}</svg>`,
  );
  await sharp({
    create: { width: w, height: h, channels: 3, background: "#151515" },
  })
    .composite([...tiles, { input: labels, left: 0, top: 0 }])
    .png()
    .toFile(path.join(folder, name));
}
(async () => {
  let browser, encoder;
  const pageErrors = [];
  try {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => {
      pageErrors.push(String(e));
      console.error("Page error:", e.message);
    });
    const response = await page.goto("http://127.0.0.1:4187/lume.html", {
      waitUntil: "load",
    });
    if (!response?.ok())
      throw Error(`Lume preview returned HTTP ${response?.status()}`);
    await page.waitForFunction(
      () => window.ready && typeof window.seek === "function",
      null,
      { timeout: 60000 },
    );
    await page.evaluate(
      ({ width, height }) => {
        const source = document.querySelector("canvas");
        if (!source || source.width !== width || source.height !== height)
          throw Error("Expected a 1440x1440 source canvas");
        const accumulator = document.createElement("canvas");
        accumulator.width = width;
        accumulator.height = height;
        const tiny = document.createElement("canvas");
        tiny.width = tiny.height = 96;
        const ctx = accumulator.getContext("2d", { alpha: false }),
          small = tiny.getContext("2d", { willReadFrequently: true });
        small.imageSmoothingQuality = "high";
        small.filter = "blur(1px)";
        window.__lumeProduction = {
          source,
          accumulator,
          ctx,
          tiny,
          small,
          previous: null,
        };
      },
      { width, height },
    );
    const pngAt = async (time) =>
      Buffer.from(
        await page.evaluate((time) => {
          window.seek(time, time);
          return window.__lumeProduction.source
            .toDataURL("image/png")
            .split(",")[1];
        }, time),
        "base64",
      );
    const rawAt = async (time) => {
      const png = await pngAt(time),
        raw = await sharp(png).ensureAlpha().raw().toBuffer();
      if (raw.length !== width * height * 4)
        throw Error("Unexpected full-resolution pixel count");
      return { png, raw, hash: hash(raw) };
    };
    if (mode === "stills") {
      const shots = [];
      for (const [name, time] of stills) {
        const png = await pngAt(time);
        fs.writeFileSync(path.join(folder, `${name}.png`), png);
        shots.push({ label: name.toUpperCase(), time, png });
        console.log(name, time);
      }
      await contactSheet(shots, 3, 480, "storyboard.png");
      console.log("Saved", path.join(folder, "storyboard.png"));
    } else if (mode === "transitions" || mode === "boundaries") {
      const shots = [];
      for (let i = 0; i < travel.length; i++) {
        const [start, end] = travel[i],
          times = [
            ["ANTES", start - 1 / fps],
            ["ENTRADA", start],
            ["MEIO", (start + end) / 2],
            ["DEPOIS", end + 1 / fps],
          ];
        for (const [label, time] of times) {
          const png = await pngAt(time);
          shots.push({
            label: `${String(i + 1).padStart(2, "0")} ${label}`,
            time,
            png,
          });
          fs.writeFileSync(
            path.join(folder, `transition-${i + 1}-${label.toLowerCase()}.png`),
            png,
          );
        }
      }
      await contactSheet(shots, 4, 360, "transitions.png");
      saveJson(
        "transitions.json",
        shots.map(({ label, time }) => ({ label, time })),
      );
      console.log("Saved", path.join(folder, "transitions.png"));
    } else if (mode === "audit") {
      const first = await rawAt(0),
        last = await rawAt((frameCount - 1) / fps),
        loop = difference(first.raw, last.raw);
      fs.writeFileSync(path.join(folder, "audit-first.png"), first.png);
      fs.writeFileSync(path.join(folder, "audit-last.png"), last.png);
      const rows = [];
      for (let from = 0; from < frameCount; from += 120) {
        rows.push(
          ...(await page.evaluate(
            ({ from, to, fps }) => {
              const s = window.__lumeProduction,
                result = [];
              for (let f = from; f < to; f++) {
                window.seek(f / fps, f / fps);
                s.small.clearRect(0, 0, 96, 96);
                s.small.drawImage(s.source, 0, 0, 96, 96);
                const now = s.small.getImageData(0, 0, 96, 96).data;
                if (s.previous) {
                  let d = 0;
                  for (let i = 0; i < now.length; i += 4)
                    d +=
                      (Math.abs(now[i] - s.previous[i]) +
                        Math.abs(now[i + 1] - s.previous[i + 1]) +
                        Math.abs(now[i + 2] - s.previous[i + 2])) /
                      3;
                  result.push({
                    frame: f,
                    time: f / fps,
                    difference: d / 9216,
                  });
                }
                s.previous = new Uint8ClampedArray(now);
              }
              return result;
            },
            { from, to: Math.min(from + 120, frameCount), fps },
          )),
        );
        console.log(
          `Audit scan ${Math.min(from + 120, frameCount)}/${frameCount}`,
        );
      }
      // Full RGBA baselines are compared pixel by pixel; the 96px scan above is only a cut detector.
      const times = [
          0.1,
          0.7,
          3.05,
          3.55,
          5.5,
          6.95,
          8.3,
          9.7,
          11.7,
          12.75,
          14.5,
          16.6,
          18.3,
          20.65,
          21.75,
          (frameCount - 1) / fps,
        ],
        baseline = new Map();
      for (const time of times) {
        await pngAt(0);
        baseline.set(time, await rawAt(time));
      }
      const shuffled = [...times];
      let seed = 0x4c554d45;
      for (let i = shuffled.length - 1; i > 0; i--) {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        const j = (seed >>> 0) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const replays = [];
      for (const [order, sequence] of [
        ["forward", times],
        ["reverse", [...times].reverse()],
        ["random", shuffled],
      ]) {
        await pngAt(order === "forward" ? 21.25 : 0.35);
        for (const time of sequence) {
          const actual = await rawAt(time),
            reference = baseline.get(time),
            comparison = difference(reference.raw, actual.raw);
          replays.push({
            order,
            time,
            ...comparison,
            baselineHash: reference.hash,
            actualHash: actual.hash,
          });
        }
        console.log(
          `Full-resolution seek replay: ${order}, ${sequence.length} points`,
        );
      }
      const flags = flagJumps(rows),
        result = {
          frames: frameCount,
          resolution: [width, height],
          scanResolution: [96, 96],
          loopEqual: loop.equal,
          loop: {
            ...loop,
            firstTime: 0,
            lastTime: (frameCount - 1) / fps,
            firstHash: first.hash,
            lastHash: last.hash,
          },
          seekIndependent: replays.every((r) => r.equal),
          replayTimepoints: times.length,
          replayComparisons: replays.length,
          replays,
          flags,
          rows,
          pageErrors,
        };
      saveJson("preflight.json", result);
      console.log(
        JSON.stringify(
          { ...result, rows: undefined, replays: undefined },
          null,
          2,
        ),
      );
      if (!result.seekIndependent || pageErrors.length)
        throw Error(
          "Deterministic seek audit failed; see out/lume/preflight.json",
        );
    } else {
      const output = path.join(folder, "lume-1440-60.mp4");
      if (!fs.existsSync("public/assets/lume-mix.wav"))
        throw Error("Missing Lume soundtrack");
      encoder = spawn(
        "ffmpeg",
        [
          "-hide_banner",
          "-y",
          "-f",
          "image2pipe",
          "-framerate",
          String(fps),
          "-vcodec",
          "mjpeg",
          "-i",
          "pipe:0",
          "-i",
          "public/assets/lume-mix.wav",
          "-map",
          "0:v:0",
          "-map",
          "1:a:0",
          "-c:v",
          "libx264",
          "-threads",
          "4",
          "-preset",
          "fast",
          "-crf",
          "16",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "320k",
          "-t",
          String(duration),
          "-movflags",
          "+faststart",
          output,
        ],
        { stdio: ["pipe", "ignore", "pipe"] },
      );
      let log = "",
        encoderError = null;
      encoder.stderr.on("data", (d) => {
        log += d;
      });
      encoder.stdin.on("error", (e) => {
        encoderError = e;
      });
      const done = new Promise((resolve) => {
        encoder.once("close", (code) => {
          if (code !== 0) encoderError = Error(`ffmpeg exited ${code}: ${log}`);
          resolve();
        });
        encoder.once("error", (e) => {
          encoderError = e;
          resolve();
        });
      });
      const rows = [];
      let previous = null,
        firstHash,
        lastHash;
      for (let frame = 0; frame < frameCount; frame++) {
        if (encoderError) throw encoderError;
        const r = await page.evaluate(
          ({ frame, fps, duration, travel }) => {
            const s = window.__lumeProduction,
              center = frame / fps,
              count = travel.some(([a, b]) => center >= a && center < b)
                ? 12
                : 4;
            s.ctx.clearRect(0, 0, 1440, 1440);
            for (let i = 0; i < count; i++) {
              const sample = (frame + (i / (count - 1) - 0.5) * 0.42) / fps,
                time = (sample + duration) % duration;
              window.seek(time, center);
              s.ctx.globalAlpha = 1 / (i + 1);
              s.ctx.drawImage(s.source, 0, 0);
            }
            s.ctx.globalAlpha = 1;
            s.small.clearRect(0, 0, 96, 96);
            s.small.drawImage(s.accumulator, 0, 0, 96, 96);
            return {
              data: s.accumulator.toDataURL("image/jpeg", 0.99).split(",")[1],
              pixels: Array.from(s.small.getImageData(0, 0, 96, 96).data),
              samples: count,
            };
          },
          { frame, fps, duration, travel },
        );
        const data = Buffer.from(r.data, "base64");
        if (frame === 0) firstHash = hash(data);
        if (frame === frameCount - 1) lastHash = hash(data);
        if (previous)
          rows.push({
            frame,
            time: frame / fps,
            difference: smallDifference(previous, r.pixels),
            subframes: r.samples,
          });
        previous = r.pixels;
        if (!encoder.stdin.write(data))
          await new Promise((resolve, reject) => {
            const clean = () => {
              encoder.stdin.off("drain", drained);
              encoder.stdin.off("error", failed);
              encoder.off("close", closed);
            };
            const drained = () => {
                clean();
                resolve();
              },
              failed = (e) => {
                clean();
                reject(e);
              },
              closed = () => {
                clean();
                reject(Error("Encoder closed before receiving all frames"));
              };
            encoder.stdin.once("drain", drained);
            encoder.stdin.once("error", failed);
            encoder.once("close", closed);
          });
        if (frame % 120 === 0)
          console.log(`${frame}/${frameCount} (${(frame / fps).toFixed(1)}s)`);
      }
      encoder.stdin.end();
      await done;
      if (encoderError) throw encoderError;
      const flags = flagJumps(rows);
      const probe = spawnSync(
        "ffprobe",
        [
          "-v",
          "error",
          "-show_entries",
          "format=duration:stream=codec_name,width,height,avg_frame_rate,nb_frames,sample_rate,channels",
          "-of",
          "json",
          output,
        ],
        { encoding: "utf8" },
      );
      if (probe.error || probe.status !== 0)
        throw probe.error || Error(probe.stderr);
      saveJson("frame-scan.json", {
        frames: frameCount,
        subframes: 4,
        travelSubframes: 12,
        travelIntervals: travel,
        shutterInFrames: 0.42,
        endpointPolicy:
          "Actual rendered subframes with time wrapping; no copied endpoint",
        firstHash,
        lastHash,
        loopEqual: firstHash === lastHash,
        flags,
        rows,
        pageErrors,
        media: JSON.parse(probe.stdout),
      });
      fs.writeFileSync(path.join(folder, "render.log"), log);
      console.log(
        "Complete",
        output,
        "loop equal:",
        firstHash === lastHash,
        "jump candidates:",
        flags,
      );
      if (pageErrors.length)
        throw Error(
          "Page errors occurred during render; inspect frame-scan.json",
        );
    }
  } finally {
    if (encoder && encoder.exitCode === null) encoder.kill();
    if (browser) await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
