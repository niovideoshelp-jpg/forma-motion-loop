const fs = require("fs"),
  path = require("path"),
  sharp = require("sharp"),
  { chromium } = require("playwright");
process.chdir(path.resolve(__dirname, ".."));
const directory = "out/lume-refined/cta";
const shots = [
  ["OUTLINE", 0],
  ["APPROACH", 0.55],
  ["CONTACT", 0.79079984],
  ["LIQUID", 0.97],
  ["LIQUID", 1.1],
  ["FILLED", 1.6],
  ["RETURN", 21.1],
  ["OUTLINE RETURN", 21.9833333333],
];
(async () => {
  fs.mkdirSync(directory, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1440 },
    });
    await page.goto("http://127.0.0.1:4187/lume-refined.html");
    await page.waitForFunction(() => window.ready);
    const composites = [];
    for (let i = 0; i < shots.length; i++) {
      const [label, t] = shots[i];
      const b64 = await page.evaluate((t) => {
        window.seek(t);
        return document.querySelector("canvas").toDataURL().split(",")[1];
      }, t);
      const png = Buffer.from(b64, "base64");
      fs.writeFileSync(
        path.join(directory, `point-${String(i + 1).padStart(2, "0")}.png`),
        png,
      );
      composites.push({
        input: await sharp(png).resize(480, 480).toBuffer(),
        left: 20 + (i % 2) * 500,
        top: 58 + Math.floor(i / 2) * 538,
      });
    }
    const svg = Buffer.from(
      `<svg width="1020" height="2172"><style>text{fill:#f4f2ed;font:15px Arial}</style>${shots.map(([label, t], i) => `<text x="${20 + (i % 2) * 500}" y="${45 + Math.floor(i / 2) * 538}">${label} / ${t.toFixed(3)}s</text>`).join("")}</svg>`,
    );
    await sharp({
      create: { width: 1020, height: 2172, channels: 3, background: "#17181c" },
    })
      .composite([...composites, { input: svg, left: 0, top: 0 }])
      .png()
      .toFile("out/lume-refined/cta-hover.png");
    console.log("Saved CTA hover contact sheet");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
