const { chromium } = require("playwright"),
  fs = require("fs");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:4173/preview.html");
  await page.waitForFunction(() => window.ready);
  const rows = await page.evaluate(() => {
    const tiny = document.createElement("canvas");
    tiny.width = tiny.height = 96;
    const ctx = tiny.getContext("2d", { willReadFrequently: true });
    let prev = null;
    const rows = [];
    for (let f = 0; f < 1320; f++) {
      window.seek(f / 60);
      ctx.drawImage(document.querySelector("canvas"), 0, 0, 96, 96);
      const p = ctx.getImageData(0, 0, 96, 96).data;
      if (prev) {
        let diff = 0;
        for (let i = 0; i < p.length; i += 4)
          diff +=
            (Math.abs(p[i] - prev[i]) +
              Math.abs(p[i + 1] - prev[i + 1]) +
              Math.abs(p[i + 2] - prev[i + 2])) /
            3;
        rows.push({ frame: f, t: f / 60, d: diff / 9216 });
      }
      prev = p;
    }
    return rows;
  });
  const flags = rows.filter(
    (v, i) =>
      v.d > 2 &&
      v.d >
        3 * Math.max(0.1, ((rows[i - 1]?.d || 0) + (rows[i + 1]?.d || 0)) / 2),
  );
  fs.writeFileSync(
    "out/preflight.json",
    JSON.stringify({ flags, rows }, null, 2),
  );
  console.log("Preflight isolated jumps:", flags);
  await browser.close();
})();
