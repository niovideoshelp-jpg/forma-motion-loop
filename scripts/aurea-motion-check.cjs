// Default: cold/readback, seek order, 1320 source frames, diagnostics and loop.
// --parity additionally compares six raw frames through the Aurea Remotion composition.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const {
  ROOT,
  OUT,
  W,
  H,
  FPS,
  FRAMES,
  SW,
  SH,
  sourceSignature,
  hash,
  saveJson,
  difference,
  flagJumps,
  openPreview,
  renderFrame,
} = require("./aurea-produce.cjs");

async function parity(session) {
  const { bundle } = require("@remotion/bundler");
  const {
    openBrowser,
    selectComposition,
    renderStill,
  } = require("@remotion/renderer");
  const executable = [
    process.env.AUREA_BROWSER_EXECUTABLE,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  ].find((file) => file && fs.existsSync(file));
  if (!executable)
    throw new Error(
      "Set AUREA_BROWSER_EXECUTABLE to the same installed Chromium/Edge used for preview",
    );
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/index.ts"),
    rootDir: ROOT,
    publicDir: path.join(ROOT, "public"),
    outDir: path.join(OUT, "remotion-bundle"),
    rspack: true,
  });
  const browser = await openBrowser("chrome", {
    browserExecutable: executable,
    forceDeviceScaleFactor: 1,
  });
  try {
    const composition = await selectComposition({
      serveUrl,
      id: "Aurea",
      puppeteerInstance: browser,
    });
    if (
      composition.width !== W ||
      composition.height !== H ||
      composition.fps !== FPS ||
      composition.durationInFrames !== FRAMES
    )
      throw new Error(
        "Aurea composition configuration differs from 1080×1920 / 60fps / 1320 frames",
      );
    const frames = [0, 282, 642, 870, 1110, 1319],
      comparisons = [];
    for (const frame of frames) {
      const output = path.join(
        OUT,
        `remotion-${String(frame).padStart(4, "0")}.png`,
      );
      await renderStill({
        serveUrl,
        composition,
        frame,
        output,
        imageFormat: "png",
        puppeteerInstance: browser,
        overwrite: true,
      });
      const direct = await session.rawAt(frame / FPS),
        metadata = await sharp(output).metadata();
      const raw = await sharp(output).ensureAlpha().raw().toBuffer();
      comparisons.push({
        frame,
        time: frame / FPS,
        dimensions: [metadata.width, metadata.height],
        ...difference(direct.raw, raw),
      });
      console.log(
        `Remotion parity frame ${frame}: ${comparisons.at(-1).equal}`,
      );
    }
    return {
      passed: comparisons.every((r) => r.equal),
      source: sourceSignature(),
      composition: "Aurea",
      comparisons,
      note: "Direct source frames, not temporally averaged production frames",
    };
  } finally {
    await browser.close({ silent: true });
  }
}

async function main() {
  const session = await openPreview();
  const report = {
    passed: false,
    source: sourceSignature(),
    resolution: [W, H],
    fps: FPS,
    frames: FRAMES,
  };
  try {
    report.canvas = await session.page.evaluate(
      async ({ W, H, FPS }) => {
        const c = window.__aureaProduction.sourceContext;
        const read = (t) => {
          window.seek(t, t);
          return {
            state: window.inspect(t),
            bytes: c.getImageData(0, 0, W, H).data,
          };
        };
        const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        const digest = async (bytes) =>
          Array.from(
            new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
          )
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("");
        function diff(a, b) {
          let changedPixels = 0,
            maximumChannelDelta = 0;
          for (let i = 0; i < a.length; i += 4) {
            let changed = false;
            for (let k = 0; k < 4; k++) {
              const d = Math.abs(a[i + k] - b[i + k]);
              changed ||= d !== 0;
              maximumChannelDelta = Math.max(maximumChannelDelta, d);
            }
            changedPixels += Number(changed);
          }
          return {
            equal: changedPixels === 0,
            changedPixels,
            maximumChannelDelta,
          };
        }
        window.seek(0, 0);
        const cold = read(9.7),
          coldReplays = [];
        for (const previousTime of [0, 8.3, 9.7, 22, 3.3, 0, 8.3]) {
          window.seek(previousTime, previousTime);
          const actual = read(9.7);
          coldReplays.push({
            previousTime,
            stateEqual: same(cold.state, actual.state),
            ...diff(cold.bytes, actual.bytes),
          });
        }
        const times = [
          0.1,
          0.7,
          3.3,
          3.7,
          4.7,
          5.8,
          6.2,
          8.3,
          8.7,
          9.7,
          10.7,
          12.7,
          14.5,
          16.7,
          20.7,
          1319 / FPS,
        ];
        const baseline = [];
        for (const t of times) {
          const sample = read(t);
          baseline.push({
            state: sample.state,
            hash: await digest(sample.bytes),
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
              actualHash = await digest(sample.bytes);
            replays.push({
              order,
              time: times[i],
              stateEqual: same(baseline[i].state, sample.state),
              equal: baseline[i].hash === actualHash,
              baselineHash: baseline[i].hash,
              actualHash,
            });
          }
        const first = read(0),
          last = read(1319 / FPS),
          exactEnd = read(22);
        return {
          passed:
            coldReplays.every((r) => r.equal && r.stateEqual) &&
            replays.every((r) => r.equal && r.stateEqual) &&
            diff(first.bytes, last.bytes).equal &&
            diff(first.bytes, exactEnd.bytes).equal,
          contextAttributes: c.getContextAttributes(),
          coldReplays,
          replays,
          loop: {
            ...diff(first.bytes, last.bytes),
            firstHash: await digest(first.bytes),
            lastHash: await digest(last.bytes),
          },
          exactEnd: diff(first.bytes, exactEnd.bytes),
        };
      },
      { W, H, FPS },
    );
    const weightedFrames = [];
    for (const frame of [0, FRAMES - 1, FRAMES - 1, 0]) {
      const rendered = await renderFrame(session, frame);
      const png = Buffer.from(rendered.png, "base64");
      weightedFrames.push({
        frame,
        samples: rendered.samples,
        pngHash: hash(png),
        raw: await sharp(png).ensureAlpha().raw().toBuffer(),
      });
    }
    const weightedComparisons = weightedFrames
      .slice(1)
      .map((sample) => ({
        frame: sample.frame,
        ...difference(weightedFrames[0].raw, sample.raw),
      }));
    report.weightedLoop = {
      passed: weightedComparisons.every((sample) => sample.equal),
      renderer:
        "Shared production renderFrame; CPU accumulator, wrapped temporal samples, fixed displayTime",
      exposureFrames: 0.42,
      samples: weightedFrames.map(({ raw, ...metadata }) => metadata),
      comparisons: weightedComparisons,
    };
    saveJson("weighted-loop.json", {
      source: report.source,
      ...report.weightedLoop,
    });
    report.diagnostics = await session.page.evaluate(() => {
      const times = [
        0, 0.35, 0.7, 3, 3.3, 3.7, 5.8, 6.2, 8.3, 8.7, 9.7, 10.7, 12.3, 12.7,
        14.5, 16.7, 20.7, 21.75, 22,
      ];
      const baseline = times.map((t) => window.inspect(t));
      const orders = [
        times.map((_, i) => i),
        times.map((_, i) => times.length - 1 - i),
        times.map((_, i) => (i * 7 + 3) % times.length),
      ];
      const failures = [];
      let comparisons = 0;
      for (let cycle = 0; cycle < 5; cycle++)
        for (const order of orders)
          for (const i of order) {
            if (
              JSON.stringify(window.inspect(times[i])) !==
              JSON.stringify(baseline[i])
            )
              failures.push({
                cycle,
                time: times[i],
                kind: "history-dependent inspector",
              });
            comparisons++;
          }
      return { comparisons, failures, times, baseline };
    });
    report.hover = await session.page.evaluate(
      ({ FPS }) => {
        const firstTime = (predicate) => {
          if (predicate(window.inspect(0))) return 0;
          let low = 0,
            high = 1.2;
          if (!predicate(window.inspect(high))) return null;
          for (let i = 0; i < 48; i++) {
            const middle = (low + high) / 2;
            if (predicate(window.inspect(middle))) high = middle;
            else low = middle;
          }
          return high;
        };
        const contains = ({ cursor, cta }) => {
          const rect = cta.rect,
            radius = rect.r ?? rect.h / 2;
          const dx = Math.abs(cursor.x - rect.x),
            dy = Math.abs(cursor.y - rect.y);
          return (
            dx <= rect.w / 2 &&
            dy <= rect.h / 2 &&
            Math.hypot(
              Math.max(0, dx - (rect.w / 2 - radius)),
              Math.max(0, dy - (rect.h / 2 - radius)),
            ) <= radius
          );
        };
        const contact = firstTime(contains);
        const hover = firstTime((d) => d.cta.hover === true);
        const fill = firstTime((d) => d.cta.fill > 1e-12);
        const valid = contact !== null && hover !== null && fill !== null;
        return {
          passed:
            valid &&
            Math.abs(hover - contact) <= 1 / FPS &&
            fill >= contact - 0.000001 &&
            fill - contact <= 1 / FPS,
          roundedContactTime: contact,
          hoverStartTime: hover,
          firstPositiveFillTime: fill,
          latencySeconds: valid ? hover - contact : null,
          toleranceSeconds: 1 / FPS,
          contactPoint:
            contact === null ? null : window.inspect(contact).cursor,
          radiusPolicy: "CTA rect.r or capsule radius rect.h/2",
        };
      },
      { FPS },
    );
    report.cursorContinuity = await session.page.evaluate(() => {
      const epsilon = 1e-7;
      const boundaries = [
        0.35, 3.3, 5.5, 5.8, 6.6, 7, 8.3, 10.1, 10.85, 11.25, 12, 12.3, 13.1,
        16.3, 20.3, 20.7, 21.3,
      ];
      const samples = boundaries.map((time) => {
        const before = window.inspect(time - epsilon).cursor;
        const at = window.inspect(time).cursor;
        const after = window.inspect(time + epsilon).cursor;
        const visible =
          Math.max(before.opacity ?? 1, at.opacity ?? 1, after.opacity ?? 1) >
          0.01;
        const delta = Math.max(
          Math.hypot(at.x - before.x, at.y - before.y),
          Math.hypot(after.x - at.x, after.y - at.y),
        );
        return { time, before, at, after, visible, delta };
      });
      return {
        passed: samples.every((s) => !s.visible || s.delta < 0.1),
        tolerancePixels: 0.1,
        epsilonSeconds: epsilon,
        samples,
      };
    });
    const rows = [],
      diagnosticFailures = [];
    for (let from = 0; from <= FRAMES; from += 60) {
      const batch = await session.page.evaluate(
        ({ from, to, FPS, FRAMES, SW, SH }) => {
          const s = window.__aureaProduction,
            rows = [],
            failures = [];
          const finite = (value) =>
            typeof value === "number"
              ? Number.isFinite(value)
              : !value || typeof value !== "object"
                ? true
                : Object.values(value).every(finite);
          for (let frame = from; frame < to; frame++) {
            const time = frame / FPS,
              d = window.inspect(time);
            if (!finite(d))
              failures.push({ frame, kind: "nonfinite diagnostic" });
            for (const name of [
              "camera",
              "cursor",
              "cta",
              "composer",
              "safeArea",
            ])
              if (!d[name]) failures.push({ frame, kind: `missing ${name}` });
            if (d.composer?.sendEnabled !== false)
              failures.push({ frame, kind: "draft must never send" });
            if (
              d.cta &&
              !(
                Number.isFinite(d.cta.fill) &&
                d.cta.fill >= 0 &&
                d.cta.fill <= 1
              )
            )
              failures.push({ frame, kind: "invalid fill" });
            if (d.cta?.rect && !(d.cta.rect.w > 0 && d.cta.rect.h > 0))
              failures.push({ frame, kind: "invalid CTA rectangle" });
            if (
              time >= 13.1 &&
              time < 16.3 &&
              d.composer?.draftComplete !== true
            )
              failures.push({
                frame,
                kind: "draft not readable for required interval",
              });
            if (
              time < 3.3 &&
              d.cta?.fill > 0.000001 &&
              d.cursor &&
              d.cta.rect
            ) {
              const { x, y, w, h } = d.cta.rect;
              if (
                Math.abs(d.cursor.x - x) > w / 2 + 0.001 ||
                Math.abs(d.cursor.y - y) > h / 2 + 0.001
              )
                failures.push({
                  frame,
                  kind: "intro liquid precedes cursor contact",
                });
            }
            if (frame < FRAMES) {
              window.seek(time, time);
              s.small.clearRect(0, 0, SW, SH);
              s.small.drawImage(s.source, 0, 0, SW, SH);
              const pixels = s.small.getImageData(0, 0, SW, SH).data;
              if (s.previous) {
                let sum = 0;
                for (let i = 0; i < pixels.length; i += 4)
                  for (let k = 0; k < 3; k++)
                    sum += Math.abs(pixels[i + k] - s.previous[i + k]);
                rows.push({ frame, time, difference: sum / (SW * SH * 3) });
              }
              s.previous = new Uint8ClampedArray(pixels);
            }
          }
          return { rows, failures };
        },
        { from, to: Math.min(from + 60, FRAMES + 1), FPS, FRAMES, SW, SH },
      );
      rows.push(...batch.rows);
      diagnosticFailures.push(...batch.failures);
      console.log(
        `AURÉA source audit ${Math.min(from + 60, FRAMES + 1)}/${FRAMES + 1}`,
      );
    }
    const flags = flagJumps(rows);
    let currentStillRun = 0,
      longestStillRun = 0,
      stillStart = null;
    const stillRuns = [];
    for (const row of rows) {
      currentStillRun = row.difference === 0 ? currentStillRun + 1 : 0;
      longestStillRun = Math.max(longestStillRun, currentStillRun);
      if (row.difference === 0 && stillStart === null)
        stillStart = row.frame - 1;
      if (row.difference !== 0 && stillStart !== null) {
        if ((row.frame - 1 - stillStart) / FPS > 1)
          stillRuns.push({ from: stillStart / FPS, to: (row.frame - 1) / FPS });
        stillStart = null;
      }
    }
    if (stillStart !== null && (FRAMES - 1 - stillStart) / FPS > 1)
      stillRuns.push({ from: stillStart / FPS, to: (FRAMES - 1) / FPS });
    for (const run of stillRuns) {
      const hashes = [];
      for (const t of [run.from, (run.from + run.to) / 2, run.to])
        hashes.push((await session.rawAt(t)).hash);
      run.fullResolutionIdentical = hashes.every((h) => h === hashes[0]);
      run.duration = run.to - run.from;
    }
    report.diagnostics.failures.push(...diagnosticFailures);
    report.diagnostics.sampledPoses = FRAMES + 1;
    report.sourceScan = {
      frames: FRAMES,
      resolution: [SW, SH],
      flags,
      rows,
      longestIdenticalThumbnailRunSeconds: longestStillRun / FPS,
      stillRuns,
    };
    const first = await session.rawAt(0),
      last = await session.rawAt((FRAMES - 1) / FPS);
    fs.writeFileSync(path.join(OUT, "audit-first.png"), first.png);
    fs.writeFileSync(path.join(OUT, "audit-last.png"), last.png);
    report.pageErrors = session.errors;
    report.passed =
      report.canvas.passed &&
      report.weightedLoop.passed &&
      report.hover.passed &&
      report.cursorContinuity.passed &&
      report.diagnostics.failures.length === 0 &&
      flags.length === 0 &&
      !stillRuns.some((r) => r.fullResolutionIdentical) &&
      session.errors.length === 0;
    saveJson("motion-check.json", report);
    saveJson("preflight.json", {
      passed: report.passed,
      source: report.source,
      frames: FRAMES,
      resolution: [W, H],
      loopEqual: report.canvas.loop.equal,
      weightedLoop: report.weightedLoop,
      seekIndependent: report.canvas.passed,
      flags,
      rows,
      diagnosticFailures: report.diagnostics.failures,
      hover: report.hover,
      cursorContinuity: report.cursorContinuity,
      stillRuns,
      pageErrors: session.errors,
    });
    if (process.argv.includes("--parity")) {
      const result = await parity(session);
      saveJson("remotion-parity.json", result);
      report.passed &&= result.passed;
    }
    console.log(
      JSON.stringify({
        passed: report.passed,
        numericComparisons: report.diagnostics.comparisons,
        coldReplays: report.canvas.coldReplays.length,
        canvasReplays: report.canvas.replays.length,
        loopEqual: report.canvas.loop.equal,
        weightedLoopEqual: report.weightedLoop.passed,
        jumpCandidates: flags.length,
        diagnosticFailures: report.diagnostics.failures.length,
      }),
    );
    if (!report.passed)
      throw new Error(
        "AURÉA motion audit failed; inspect out/aurea/motion-check.json",
      );
  } finally {
    await session.close();
  }
}
module.exports = { main };
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
