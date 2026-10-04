const { chromium } = require("playwright"),
  fs = require("fs"),
  sharp = require("sharp"),
  crypto = require("crypto"),
  { spawn } = require("child_process");
const mode = process.argv[2] || "stills",
  folder = "out/orbita";
fs.mkdirSync(folder, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1440 },
  });
  page.on("pageerror", (e) => console.error(e));
  await page.goto("http://127.0.0.1:4187/orbita.html");
  await page.waitForFunction(() => window.ready);
  await page.evaluate(() => {
    window.acc = document.createElement("canvas");
    acc.width = acc.height = 1440;
    window.ac = acc.getContext("2d", { alpha: false });
    window.tiny = document.createElement("canvas");
    tiny.width = tiny.height = 96;
    window.tc = tiny.getContext("2d", { willReadFrequently: true });
    tc.imageSmoothingQuality = "high";
    tc.filter = "blur(1px)";
  });
  if (mode === "stills") {
    const shots = [
      ["destino", 3.25],
      ["rota", 6.45],
      ["passagem", 9.0],
      ["roteiro", 13.5],
      ["marca", 17.5],
      ["loop", 21.8],
    ];
    const tiles = [];
    for (let i = 0; i < shots.length; i++) {
      const [name, t] = shots[i];
      await page.evaluate((t) => window.seek(t), t);
      const data = await page.evaluate(() =>
        document.querySelector("canvas").toDataURL("image/png"),
      );
      const b = Buffer.from(data.split(",")[1], "base64");
      fs.writeFileSync(`${folder}/${name}.png`, b);
      tiles.push({
        input: await sharp(b).resize(480, 480).toBuffer(),
        left: (i % 3) * 500 + 20,
        top: Math.floor(i / 3) * 540 + 60,
      });
      console.log(name, t);
    }
    const labels = Buffer.from(
      `<svg width="1520" height="1140"><style>text{font:17px Arial;fill:#d9e5e9}</style>${shots.map(([name, t], i) => `<text x="${(i % 3) * 500 + 20}" y="${Math.floor(i / 3) * 540 + 40}">${String(i + 1).padStart(2, "0")}  ${name.toUpperCase()} / ${t.toFixed(1)}s</text>`).join("")}</svg>`,
    );
    await sharp({
      create: { width: 1520, height: 1140, channels: 3, background: "#08283e" },
    })
      .composite([...tiles, { input: labels, left: 0, top: 0 }])
      .png()
      .toFile(`${folder}/storyboard.png`);
    await browser.close();
    return;
  }
  if (mode === "audit") {
    const result = await page.evaluate(() => {
      const sample = (t) => {
        window.seek(t);
        tc.clearRect(0, 0, 96, 96);
        tc.drawImage(document.querySelector("canvas"), 0, 0, 96, 96);
        return Array.from(tc.getImageData(0, 0, 96, 96).data);
      };
      const first = sample(0),
        last = sample(1319 / 60),
        a = sample(9.5);
      sample(19);
      const b = sample(9.5);
      let prev = null;
      const rows = [];
      for (let f = 0; f < 1320; f++) {
        const now = sample(f / 60);
        if (prev) {
          let d = 0;
          for (let i = 0; i < now.length; i += 4)
            d +=
              (Math.abs(now[i] - prev[i]) +
                Math.abs(now[i + 1] - prev[i + 1]) +
                Math.abs(now[i + 2] - prev[i + 2])) /
              3;
          rows.push({ frame: f, time: f / 60, difference: d / 9216 });
        }
        prev = now;
      }
      const flags = rows.filter(
        (v, i) =>
          v.difference > 2 &&
          v.difference >
            3 *
              Math.max(
                0.1,
                ((rows[i - 1]?.difference || 0) +
                  (rows[i + 1]?.difference || 0)) /
                  2,
              ),
      );
      return {
        loopEqual: first.every((v, i) => v === last[i]),
        seekIndependent: a.every((v, i) => v === b[i]),
        flags,
        rows,
      };
    });
    fs.writeFileSync(
      `${folder}/preflight.json`,
      JSON.stringify(result, null, 2),
    );
    console.log(JSON.stringify({ ...result, rows: undefined }));
    await browser.close();
    return;
  }
  const output = `${folder}/orbita-dynamic-1440-60.mp4`,
    ff = spawn("ffmpeg", [
      "-hide_banner",
      "-y",
      "-f",
      "image2pipe",
      "-framerate",
      "60",
      "-vcodec",
      "mjpeg",
      "-i",
      "pipe:0",
      "-i",
      "public/assets/orbita-mix.wav",
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
      "22",
      "-movflags",
      "+faststart",
      output,
    ]);
  let log = "";
  ff.stderr.on("data", (d) => (log += d));
  const done = new Promise((resolve, reject) => {
    ff.on("close", (code) => (code === 0 ? resolve() : reject(Error(log))));
    ff.on("error", reject);
  });
  const rows = [];
  let previous = null,
    firstHash,
    lastHash;
  for (let f = 0; f < 1320; f++) {
    const r = await page.evaluate((f) => {
      const count = (f >= 234 && f < 285) || (f >= 639 && f < 687) ? 12 : 4;
      ac.clearRect(0, 0, 1440, 1440);
      for (let i = 0; i < count; i++) {
        const time =
          f === 0 || f === 1319
            ? f / 60
            : Math.max(0, (f + (i / (count - 1) - 0.5) * 0.42) / 60);
        window.seek(time, f / 60);
        ac.globalAlpha = 1 / (i + 1);
        ac.drawImage(document.querySelector("canvas"), 0, 0);
      }
      ac.globalAlpha = 1;
      tc.clearRect(0, 0, 96, 96);
      tc.drawImage(acc, 0, 0, 96, 96);
      return {
        data: acc.toDataURL("image/jpeg", 0.99).split(",")[1],
        pixels: Array.from(tc.getImageData(0, 0, 96, 96).data),
      };
    }, f);
    const data = Buffer.from(r.data, "base64");
    if (f === 0)
      firstHash = crypto.createHash("sha256").update(data).digest("hex");
    if (f === 1319)
      lastHash = crypto.createHash("sha256").update(data).digest("hex");
    if (previous) {
      let d = 0;
      for (let i = 0; i < r.pixels.length; i += 4)
        d +=
          (Math.abs(previous[i] - r.pixels[i]) +
            Math.abs(previous[i + 1] - r.pixels[i + 1]) +
            Math.abs(previous[i + 2] - r.pixels[i + 2])) /
          3;
      rows.push({ frame: f, time: f / 60, difference: d / 9216 });
    }
    previous = r.pixels;
    if (!ff.stdin.write(data))
      await new Promise((resolve) => ff.stdin.once("drain", resolve));
    if (f % 120 === 0) console.log(`${f}/1320 (${(f / 60).toFixed(1)}s)`);
  }
  ff.stdin.end();
  await done;
  const flags = rows.filter(
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
  fs.writeFileSync(
    `${folder}/frame-scan.json`,
    JSON.stringify(
      {
        frames: 1320,
        subframes: 4,
        travelSubframes: 12,
        firstHash,
        lastHash,
        loopEqual: firstHash === lastHash,
        flags,
        rows,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(`${folder}/render.log`, log);
  console.log(
    "Complete",
    output,
    "loop equal:",
    firstHash === lastHash,
    "jump candidates:",
    flags,
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
