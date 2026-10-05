const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out/aurea");
const DOCS = path.join(ROOT, "docs/aurea");
const W = 1080,
  H = 1920,
  FPS = 60,
  DURATION = 22,
  FRAMES = 1320;
const SW = 90,
  SH = 160;
const TRAVEL = [
  [3.3, 4.1],
  [5.8, 6.6],
  [8.3, 9.1],
  [9.3, 10.1],
  [12.3, 13.1],
  [16.3, 17.1],
  [20.3, 21.1],
];
const STILLS = [
  ["noir", 0.8],
  ["lumiere", 4.7],
  ["prune", 7.2],
  ["detalhe", 10.7],
  ["whatsapp", 14.5],
  ["marca", 18.5],
];
const FFMPEG = process.env.AUREA_FFMPEG || "ffmpeg";
const FFPROBE = process.env.AUREA_FFPROBE || "ffprobe";
const VIDEO = path.join(OUT, "aurea-1080x1920-60.mp4");
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");

function sourceSignature() {
  const publicRoot = path.join(ROOT, "public");
  const files = [
    "src/Root.tsx",
    ...fs
      .readdirSync(publicRoot)
      .filter(
        (name) =>
          name.startsWith("aurea") &&
          fs.statSync(path.join(publicRoot, name)).isFile(),
      )
      .map((name) => `public/${name}`),
  ];
  const visit = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else files.push(path.relative(ROOT, file).replaceAll(path.sep, "/"));
    }
  };
  visit(path.join(publicRoot, "assets/aurea"));
  const sources = Object.fromEntries(
    files
      .sort()
      .map((file) => [file, hash(fs.readFileSync(path.join(ROOT, file)))]),
  );
  return { sha256: hash(JSON.stringify(sources)), sources };
}
function saveJson(name, value, publishEvidence = true) {
  fs.mkdirSync(OUT, { recursive: true });
  const bytes = JSON.stringify(value, null, 2) + "\n";
  fs.writeFileSync(path.join(OUT, name), bytes);
  if (publishEvidence) {
    fs.mkdirSync(DOCS, { recursive: true });
    fs.writeFileSync(path.join(DOCS, name), bytes);
  }
}
function difference(a, b) {
  if (a.length !== b.length) throw new Error("Pixel buffer sizes differ");
  let changedPixels = 0,
    maximumChannelDelta = 0,
    sum = 0;
  for (let i = 0; i < a.length; i += 4) {
    let changed = false;
    for (let k = 0; k < 4; k++) {
      const d = Math.abs(a[i + k] - b[i + k]);
      changed ||= d !== 0;
      sum += d;
      maximumChannelDelta = Math.max(maximumChannelDelta, d);
    }
    changedPixels += Number(changed);
  }
  return {
    equal: changedPixels === 0,
    changedPixels,
    maximumChannelDelta,
    meanAbsoluteChannelDelta: sum / a.length,
  };
}
function smallDifference(a, b, channels = 4) {
  let sum = 0;
  for (let i = 0; i < a.length; i += channels)
    for (let k = 0; k < 3; k++) sum += Math.abs(a[i + k] - b[i + k]);
  return sum / ((a.length / channels) * 3);
}
function flagJumps(rows) {
  return rows.filter(
    (row, i) =>
      row.difference > 2 &&
      row.difference >
        3 *
          Math.max(
            0.1,
            ((rows[i - 1]?.difference || 0) + (rows[i + 1]?.difference || 0)) /
              2,
          ),
  );
}
async function contactSheet(shots, name, columns = 3, tileWidth = 270) {
  const tileHeight = Math.round((tileWidth * H) / W),
    gap = 20,
    label = 36;
  const width = columns * (tileWidth + gap) + gap;
  const height =
    Math.ceil(shots.length / columns) * (tileHeight + label + gap) + gap;
  const escape = (s) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const tiles = [];
  for (let i = 0; i < shots.length; i++)
    tiles.push({
      input: await sharp(shots[i].png)
        .resize(tileWidth, tileHeight, { fit: "contain" })
        .toBuffer(),
      left: gap + (i % columns) * (tileWidth + gap),
      top: gap + label + Math.floor(i / columns) * (tileHeight + label + gap),
    });
  const labels = Buffer.from(
    `<svg width="${width}" height="${height}"><style>text{font:14px Arial;fill:#F4DFBF}</style>${shots
      .map(
        (shot, i) =>
          `<text x="${gap + (i % columns) * (tileWidth + gap)}" y="${gap + 24 + Math.floor(i / columns) * (tileHeight + label + gap)}">${escape(shot.label)} / ${shot.time.toFixed(3)}s</text>`,
      )
      .join("")}</svg>`,
  );
  await sharp({ create: { width, height, channels: 3, background: "#291C30" } })
    .composite([...tiles, { input: labels, left: 0, top: 0 }])
    .png()
    .toFile(path.join(OUT, name));
}

async function openPreview() {
  fs.mkdirSync(OUT, { recursive: true });
  const publicRoot = path.join(ROOT, "public");
  const mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".woff2": "font/woff2",
    ".wav": "audio/wav",
  };
  const server = http.createServer((request, response) => {
    let file;
    try {
      file = path.resolve(
        publicRoot,
        "." + decodeURIComponent(request.url.split("?")[0]),
      );
    } catch {
      response.writeHead(400).end();
      return;
    }
    if (!file.startsWith(publicRoot + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, bytes) => {
      if (error) response.writeHead(404).end();
      else {
        response.setHeader(
          "Content-Type",
          mime[path.extname(file)] || "application/octet-stream",
        );
        response.end(bytes);
      }
    });
  });
  let browser;
  const errors = [];
  const close = async () => {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  };
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    browser = await chromium.launch(
      process.env.AUREA_BROWSER_EXECUTABLE
        ? {
            headless: true,
            executablePath: process.env.AUREA_BROWSER_EXECUTABLE,
          }
        : { headless: true, channel: "msedge" },
    );
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (error) => errors.push(String(error)));
    const response = await page.goto(
      `http://127.0.0.1:${server.address().port}/aurea.html`,
    );
    if (!response?.ok())
      throw new Error(`AURÉA preview HTTP ${response?.status()}`);
    await page.waitForFunction(
      () =>
        window.ready &&
        typeof window.seek === "function" &&
        typeof window.inspect === "function",
      null,
      { timeout: 60000 },
    );
    await page.evaluate(
      ({ W, H, SW, SH }) => {
        const source = document.querySelector("canvas");
        if (source.width !== W || source.height !== H)
          throw new Error(
            `Expected ${W}×${H}, got ${source.width}×${source.height}`,
          );
        const sourceContext = source.getContext("2d");
        const attrs = sourceContext.getContextAttributes();
        if (attrs.alpha !== false || attrs.willReadFrequently !== true)
          throw new Error(
            "Source canvas must use alpha:false, willReadFrequently:true from creation",
          );
        const accumulator = document.createElement("canvas"),
          tiny = document.createElement("canvas");
        accumulator.width = W;
        accumulator.height = H;
        tiny.width = SW;
        tiny.height = SH;
        const ctx = accumulator.getContext("2d", {
          alpha: false,
          willReadFrequently: true,
        });
        const small = tiny.getContext("2d", {
          alpha: false,
          willReadFrequently: true,
        });
        small.imageSmoothingQuality = "high";
        small.filter = "blur(1px)";
        window.__aureaProduction = {
          source,
          sourceContext,
          accumulator,
          ctx,
          tiny,
          small,
          previous: null,
        };
      },
      { W, H, SW, SH },
    );
    const pngAt = async (time, displayTime = time) =>
      Buffer.from(
        await page.evaluate(
          ({ time, displayTime }) => {
            window.seek(time, displayTime);
            return window.__aureaProduction.source
              .toDataURL("image/png")
              .split(",")[1];
          },
          { time, displayTime },
        ),
        "base64",
      );
    const rawAt = async (time) => {
      const png = await pngAt(time),
        raw = await sharp(png).ensureAlpha().raw().toBuffer();
      return { png, raw, hash: hash(raw) };
    };
    return { browser, page, errors, pngAt, rawAt, close };
  } catch (error) {
    await close();
    throw error;
  }
}

async function renderFrame(session, frame) {
  return session.page.evaluate(
    ({ frame, W, H, FPS, DURATION, SW, SH, TRAVEL }) => {
      const s = window.__aureaProduction,
        center = frame / FPS;
      const count = TRAVEL.some(([a, b]) => center >= a && center < b) ? 12 : 4;
      s.ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < count; i++) {
        const sample = (frame + (i / (count - 1) - 0.5) * 0.42) / FPS;
        window.seek((sample + DURATION) % DURATION, center);
        s.ctx.globalAlpha = 1 / (i + 1);
        s.ctx.drawImage(s.source, 0, 0);
      }
      s.ctx.globalAlpha = 1;
      s.small.clearRect(0, 0, SW, SH);
      s.small.drawImage(s.accumulator, 0, 0, SW, SH);
      return {
        png: s.accumulator.toDataURL("image/png").split(",")[1],
        pixels: Array.from(s.small.getImageData(0, 0, SW, SH).data),
        samples: count,
      };
    },
    { frame, W, H, FPS, DURATION, SW, SH, TRAVEL },
  );
}

async function render(session) {
  const stillsFile = path.join(OUT, "stills.json");
  const signature = sourceSignature();
  if (!fs.existsSync(stillsFile))
    throw new Error("Run --stills and review the six frames before --render");
  const stills = JSON.parse(fs.readFileSync(stillsFile, "utf8"));
  if (stills.source.sha256 !== signature.sha256)
    throw new Error(
      "The source changed since --stills; refresh the six review frames before --render",
    );
  const weightedFile = path.join(OUT, "weighted-loop.json");
  const weightedLoop = fs.existsSync(weightedFile)
    ? JSON.parse(fs.readFileSync(weightedFile, "utf8"))
    : null;
  if (!weightedLoop?.passed || weightedLoop.source?.sha256 !== signature.sha256)
    throw new Error(
      "Run aurea-motion-check.cjs to validate the current integrated shutter loop before --render",
    );
  const audio = path.join(ROOT, "public/assets/aurea-mix.wav");
  if (!fs.existsSync(audio))
    throw new Error("Missing public/assets/aurea-mix.wav");
  const encoder = spawn(
    FFMPEG,
    [
      "-hide_banner",
      "-y",
      "-f",
      "image2pipe",
      "-framerate",
      String(FPS),
      "-vcodec",
      "png",
      "-i",
      "pipe:0",
      "-i",
      audio,
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
      "-ar",
      "48000",
      "-ac",
      "2",
      "-t",
      String(DURATION),
      "-movflags",
      "+faststart",
      VIDEO,
    ],
    { stdio: ["pipe", "ignore", "pipe"] },
  );
  let log = "",
    encoderError;
  encoder.stderr.on("data", (bytes) => {
    log += bytes;
  });
  encoder.stdin.on("error", (error) => {
    encoderError = error;
  });
  const done = new Promise((resolve) => {
    encoder.once("error", (error) => {
      encoderError = error;
      resolve();
    });
    encoder.once("close", (code) => {
      if (code !== 0)
        encoderError ||= new Error(`FFmpeg exited ${code}: ${log}`);
      resolve();
    });
  });
  const rows = [];
  let previous, firstHash, lastHash;
  try {
    for (let frame = 0; frame < FRAMES; frame++) {
      if (encoderError) throw encoderError;
      const result = await renderFrame(session, frame);
      const bytes = Buffer.from(result.png, "base64");
      if (frame === 0) firstHash = hash(bytes);
      if (frame === FRAMES - 1) lastHash = hash(bytes);
      if (previous)
        rows.push({
          frame,
          time: frame / FPS,
          difference: smallDifference(previous, result.pixels),
          subframes: result.samples,
        });
      previous = result.pixels;
      if (encoderError) throw encoderError;
      if (encoder.exitCode !== null)
        throw new Error("Encoder exited before receiving all source frames");
      if (!encoder.stdin.write(bytes))
        await new Promise((resolve, reject) => {
          const clear = () => {
            encoder.stdin.off("drain", drain);
            encoder.stdin.off("error", fail);
            encoder.off("close", closed);
          };
          const drain = () => {
              clear();
              resolve();
            },
            fail = (error) => {
              clear();
              reject(error);
            },
            closed = () =>
              fail(new Error("Encoder closed before all frames arrived"));
          encoder.stdin.once("drain", drain);
          encoder.stdin.once("error", fail);
          encoder.once("close", closed);
        });
      if (frame % 60 === 0)
        console.log(`AURÉA ${frame}/${FRAMES} (${(frame / FPS).toFixed(1)}s)`);
    }
    encoder.stdin.end();
    await done;
    if (encoderError) throw encoderError;
    const flags = flagJumps(rows);
    const report = {
      passed:
        firstHash === lastHash &&
        flags.length === 0 &&
        session.errors.length === 0,
      source: signature,
      frames: FRAMES,
      resolution: [W, H],
      fps: FPS,
      subframes: 4,
      travelSubframes: 12,
      travelIntervals: TRAVEL,
      shutterInFrames: 0.42,
      intermediateFormat: "lossless PNG",
      displayTimePolicy: "fixed frame center for all temporal samples",
      endpointPolicy: "actual wrapped samples; no copied frame",
      firstHash,
      lastHash,
      loopEqual: firstHash === lastHash,
      flags,
      rows,
      pageErrors: session.errors,
      output: path.relative(ROOT, VIDEO).replaceAll(path.sep, "/"),
      audioSha256: hash(fs.readFileSync(audio)),
    };
    saveJson("frame-scan.json", report);
    console.log(
      `Saved ${VIDEO}; loop=${report.loopEqual}; jump candidates=${flags.length}`,
    );
    if (!report.passed)
      throw new Error("Production frame audit failed; inspect frame-scan.json");
  } finally {
    fs.writeFileSync(path.join(OUT, "render.log"), log);
    if (encoder.exitCode === null) encoder.kill();
  }
}
async function main() {
  const mode = (process.argv[2] || "--stills").replace(/^--/, "");
  if (mode === "audit") {
    await require("./aurea-motion-check.cjs").main();
    return;
  }
  if (!["stills", "transitions", "render"].includes(mode))
    throw new Error("Use --stills, --transitions, --audit or --render");
  const session = await openPreview();
  try {
    if (mode === "render") await render(session);
    else {
      const shots = [];
      if (mode === "stills") {
        for (const [label, time] of STILLS) {
          const png = await session.pngAt(time);
          fs.writeFileSync(path.join(OUT, `${label}.png`), png);
          shots.push({ label: label.toUpperCase(), time, png });
          console.log(label, time);
        }
      } else {
        for (let i = 0; i < TRAVEL.length; i++) {
          const [start, end] = TRAVEL[i];
          for (const [phase, time] of [
            ["before", start - 1 / FPS],
            ["start", start],
            ["middle", (start + end) / 2],
            ["after", end + 1 / FPS],
          ]) {
            const png = await session.pngAt(time),
              label = `${i + 1}-${phase}`;
            fs.writeFileSync(path.join(OUT, `transition-${label}.png`), png);
            shots.push({ label, time, png });
          }
        }
      }
      const name = mode === "stills" ? "storyboard.png" : "transitions.png";
      await contactSheet(shots, name, mode === "stills" ? 3 : 4);
      saveJson(`${mode}.json`, {
        source: sourceSignature(),
        resolution: [W, H],
        fps: FPS,
        reviewStatus: "captured; visual review required",
        shots: shots.map(({ label, time }) => ({ label, time })),
        pageErrors: session.errors,
      });
      if (session.errors.length) throw new Error(session.errors.join("\n"));
      console.log(`Saved ${path.join(OUT, name)}`);
    }
  } finally {
    await session.close();
  }
}

module.exports = {
  ROOT,
  OUT,
  DOCS,
  W,
  H,
  FPS,
  DURATION,
  FRAMES,
  SW,
  SH,
  TRAVEL,
  STILLS,
  FFMPEG,
  FFPROBE,
  VIDEO,
  hash,
  sourceSignature,
  saveJson,
  difference,
  smallDifference,
  flagJumps,
  contactSheet,
  openPreview,
  renderFrame,
};
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
