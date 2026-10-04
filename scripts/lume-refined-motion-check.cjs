// Standalone check: node scripts/lume-refined-motion-check.cjs
// Requires installed dependencies and Microsoft Edge; starts its own local server.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const publicRoot = path.join(root, "public");
const output = path.join(root, "out/lume-refined/motion-check.json");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".wav": "audio/wav",
};

async function main() {
  const server = http.createServer((req, res) => {
    let file;
    try {
      file = path.resolve(
        publicRoot,
        "." + decodeURIComponent(req.url.split("?")[0]),
      );
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!file.startsWith(publicRoot + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, bytes) => {
      if (error) res.writeHead(404).end();
      else {
        res.setHeader(
          "Content-Type",
          mime[path.extname(file)] || "application/octet-stream",
        );
        res.end(bytes);
      }
    });
  });
  let browser;
  const report = { passed: false, errors: [] };
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage();
    page.on("pageerror", (error) => report.errors.push(error.message));
    const url = `http://127.0.0.1:${server.address().port}/lume-refined.html`;
    const response = await page.goto(url);
    if (!response.ok())
      throw new Error(`Preview returned ${response.status()}`);
    await page.waitForFunction(() => window.ready);

    // Read the live canvas immediately, before warming any drawing/readback path.
    // This catches the GPU -> CPU switch that otherwise hid behind warmed audits.
    report.canvas = await page.evaluate(async () => {
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      const attributes = ctx.getContextAttributes();
      const read = (time) => {
        const geometry = window.seek(time);
        return {
          geometry,
          pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
        };
      };
      const difference = (a, b) => {
        let changedPixels = 0,
          maxChannelDelta = 0;
        const bounds = [canvas.width, canvas.height, -1, -1];
        for (let i = 0; i < a.length; i += 4) {
          let changed = false;
          for (let k = 0; k < 4; k++) {
            const delta = Math.abs(a[i + k] - b[i + k]);
            maxChannelDelta = Math.max(maxChannelDelta, delta);
            changed ||= delta > 0;
          }
          if (changed) {
            changedPixels++;
            const x = (i / 4) % canvas.width,
              y = Math.floor(i / 4 / canvas.width);
            bounds[0] = Math.min(bounds[0], x);
            bounds[1] = Math.min(bounds[1], y);
            bounds[2] = Math.max(bounds[2], x);
            bounds[3] = Math.max(bounds[3], y);
          }
        }
        return {
          changedPixels,
          maxChannelDelta,
          bounds: changedPixels ? bounds : null,
        };
      };
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      const hash = async (pixels) =>
        Array.from(
          new Uint8Array(await crypto.subtle.digest("SHA-256", pixels)),
        )
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("");

      window.seek(0);
      const cold = read(9.7),
        coldReplays = [];
      for (const previousTime of [0, 8.3, 9.7, 22, 3.3, 0, 8.3]) {
        window.seek(previousTime);
        const sample = read(9.7);
        coldReplays.push({
          previousTime,
          geometryEqual: same(cold.geometry, sample.geometry),
          ...difference(cold.pixels, sample.pixels),
        });
      }
      const times = [
        0.1, 0.7, 3.05, 3.55, 6.95, 8.3, 9.7, 11.7, 12.75, 14.5, 16.6, 18.3,
        20.65, 21.05, 21.55, 21.95,
      ];
      const baseline = [];
      for (const time of times) {
        const sample = read(time);
        baseline.push({
          geometry: sample.geometry,
          hash: await hash(sample.pixels),
        });
      }
      const replays = [];
      const orders = {
        forward: times.map((_, i) => i),
        reverse: times.map((_, i) => times.length - 1 - i),
        random: times.map((_, i) => (i * 7 + 3) % times.length),
      };
      for (const [order, indices] of Object.entries(orders))
        for (const i of indices) {
          const sample = read(times[i]),
            actualHash = await hash(sample.pixels);
          replays.push({
            order,
            time: times[i],
            geometryEqual: same(baseline[i].geometry, sample.geometry),
            pixelEqual: baseline[i].hash === actualHash,
            baselineHash: baseline[i].hash,
            actualHash,
          });
        }
      const first = read(0),
        last = read(1319 / 60);
      const loop = difference(first.pixels, last.pixels);
      return {
        passed:
          attributes.willReadFrequently === true &&
          coldReplays.every((r) => r.geometryEqual && r.changedPixels === 0) &&
          replays.every((r) => r.geometryEqual && r.pixelEqual) &&
          loop.changedPixels === 0,
        contextAttributes: attributes,
        coldReadTime: 9.7,
        coldReplays,
        replays,
        loop,
        loopHashes: {
          first: await hash(first.pixels),
          last: await hash(last.pixels),
        },
      };
    });

    report.motion = await page.evaluate(async () => {
      const { createMotion } = await import("./lume-motion.js");
      const motion = createMotion();
      const times = [
        0, 0.42, 3, 3.3, 3.68, 4.1, 6.8, 7.13, 7.5, 9.3, 9.62, 9.7, 10.05,
        12.73, 16.61, 20.91, 21.42, 21.75, 22,
      ];
      const baseline = times.map((t) => motion.evaluate(t));
      const orders = [
        times.map((_, i) => i),
        times.map((_, i) => times.length - 1 - i),
        times.map((_, i) => (i * 7 + 3) % times.length),
      ];
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      let comparisons = 0,
        finitePoses = true,
        maxScreenDelta = 0,
        previous;
      const failures = [];
      for (let cycle = 0; cycle < 5; cycle++)
        for (const order of orders)
          for (const i of order) {
            if (!same(motion.evaluate(times[i]), baseline[i]))
              failures.push({ cycle, time: times[i] });
            comparisons++;
          }
      for (let frame = 0; frame <= 1320; frame++) {
        const pose = motion.evaluate(frame / 60);
        for (const object of [pose.camera, pose.surface, pose.cursor]) {
          finitePoses &&= Object.values(object).every(Number.isFinite);
        }
        finitePoses &&=
          pose.surface.w > 0 && pose.surface.h > 0 && pose.surface.rad >= 0;
        const point = {
          x: (pose.surface.x - pose.camera.x) * pose.camera.z,
          y: (pose.surface.y - pose.camera.y) * pose.camera.z,
        };
        if (previous)
          maxScreenDelta = Math.max(
            maxScreenDelta,
            Math.hypot(point.x - previous.x, point.y - previous.y),
          );
        previous = point;
      }
      const first = motion.evaluate(0),
        last = motion.evaluate(22);
      const endpointsEqual =
        same(first.camera, last.camera) && same(first.cursor, last.cursor);
      const finalSurfaceCorrect =
        last.surface.x === 315 &&
        last.surface.y === -10 &&
        last.surface.w === 510 &&
        last.surface.h === 760 &&
        last.surface.rad === 34;
      motion.dispose();
      globalThis.gsap.ticker.sleep();
      return {
        passed:
          failures.length === 0 &&
          finitePoses &&
          endpointsEqual &&
          finalSurfaceCorrect,
        comparisons,
        times,
        sampledPoses: 1321,
        failures,
        finitePoses,
        maxScreenDelta,
        endpointsEqual,
        finalSurfaceCorrect,
        first,
        last,
      };
    });
    report.passed =
      report.canvas.passed &&
      report.motion.passed &&
      report.errors.length === 0;
  } catch (error) {
    report.errors.push(error.stack || String(error));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
  console.log(
    JSON.stringify({
      passed: report.passed,
      numericComparisons: report.motion?.comparisons,
      sampledPoses: report.motion?.sampledPoses,
      coldCanvasReplays: report.canvas?.coldReplays.length,
      fullCanvasReplays: report.canvas?.replays.length,
      loopEqual: report.canvas?.loop.changedPixels === 0,
      report: path.relative(root, output),
      errors: report.errors,
    }),
  );
  if (!report.passed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
