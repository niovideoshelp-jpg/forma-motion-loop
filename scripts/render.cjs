const { chromium } = require("playwright"),
  fs = require("fs"),
  { spawn } = require("child_process"),
  crypto = require("crypto");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:4173/preview.html");
  await page.waitForFunction(() => window.ready);
  await page.evaluate(() => {
    window.acc = document.createElement("canvas");
    acc.width = acc.height = 1440;
    window.ac = acc.getContext("2d");
    window.tiny = document.createElement("canvas");
    tiny.width = tiny.height = 96;
    window.tc = tiny.getContext("2d", { willReadFrequently: true });
  });
  const ff = spawn("ffmpeg", [
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
    "public/assets/mix.wav",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
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
    "out/forma-loop-1440-60.mp4",
  ]);
  let log = "";
  ff.stderr.on("data", (d) => (log += d.toString()));
  const done = new Promise((resolve, reject) => {
    ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(log))));
    ff.on("error", reject);
  });
  let previous = null,
    first = null,
    last = null;
  const diffs = [];
  for (let f = 0; f < 1320; f++) {
    const r = await page.evaluate((f) => {
      const count = f >= 744 && f < 792 ? 12 : 4;
      ac.clearRect(0, 0, 1440, 1440);
      for (let i = 0; i < count; i++) {
        const time =
          f === 0 || f === 1319
            ? 0
            : Math.max(0, (f + (i / (count - 1) - 0.5) * 0.5) / 60);
        window.seek(time);
        ac.globalAlpha = 1 / (i + 1);
        ac.drawImage(document.querySelector("canvas"), 0, 0);
      }
      ac.globalAlpha = 1;
      tc.drawImage(acc, 0, 0, 96, 96);
      return {
        jpg: acc.toDataURL("image/jpeg", 0.99).split(",")[1],
        pixels: Array.from(tc.getImageData(0, 0, 96, 96).data),
      };
    }, f);
    const b = Buffer.from(r.jpg, "base64");
    if (f === 0) first = crypto.createHash("sha256").update(b).digest("hex");
    if (f === 1319) last = crypto.createHash("sha256").update(b).digest("hex");
    if (previous) {
      let d = 0;
      for (let i = 0; i < r.pixels.length; i += 4)
        d +=
          (Math.abs(previous[i] - r.pixels[i]) +
            Math.abs(previous[i + 1] - r.pixels[i + 1]) +
            Math.abs(previous[i + 2] - r.pixels[i + 2])) /
          3;
      diffs.push({ frame: f, time: f / 60, difference: d / (96 * 96) });
    }
    previous = r.pixels;
    if (!ff.stdin.write(b))
      await new Promise((resolve) => ff.stdin.once("drain", resolve));
    if (f % 120 === 0) console.log(`${f}/1320 (${(f / 60).toFixed(1)}s)`);
  }
  ff.stdin.end();
  await done;
  const flags = diffs.filter(
    (v, i) =>
      v.difference > 3 &&
      v.difference >
        3 *
          Math.max(
            0.1,
            ((diffs[i - 1]?.difference || 0) +
              (diffs[i + 1]?.difference || 0)) /
              2,
          ),
  );
  fs.writeFileSync(
    "out/frame-scan.json",
    JSON.stringify(
      {
        frames: 1320,
        subframes: 4,
        fastPanSubframes: 12,
        firstFrameHash: first,
        lastFrameHash: last,
        loopPixelsEqual: first === last,
        isolatedJumpCandidates: flags,
        diffs,
      },
      null,
      2,
    ),
  );
  fs.writeFileSync("out/render.log", log);
  console.log(
    "Rendered. Loop equality:",
    first === last,
    "Jump candidates:",
    flags,
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
