const { chromium } = require("playwright");
const fs = require("fs");
const sharp = require("sharp");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({
    viewport: { width: 1480, height: 1560 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.error(e));
  await page.goto("http://127.0.0.1:4173/preview.html");
  await page.waitForFunction(() => window.ready);
  fs.mkdirSync("out/stills", { recursive: true });
  const shots = [
    ["chat", 4.72],
    ["play", 6.46],
    ["app", 8.45],
    ["drag", 12.18],
    ["chart", 15.05],
    ["logo", 19.1],
  ];
  const tiles = [];
  for (let i = 0; i < shots.length; i++) {
    const [name, t] = shots[i];
    await page.evaluate((t) => window.seek(t), t);
    const data = await page.evaluate(() =>
      document.querySelector("canvas").toDataURL("image/png"),
    );
    const b = Buffer.from(data.split(",")[1], "base64");
    fs.writeFileSync(`out/stills/${name}.png`, b);
    tiles.push({
      input: await sharp(b).resize(480, 480).toBuffer(),
      left: (i % 3) * 500 + 20,
      top: Math.floor(i / 3) * 540 + 60,
    });
    console.log(name, t);
  }
  const labels = Buffer.from(
    `<svg width="1520" height="1140"><style>text{font:17px Arial;fill:#e0e0db}</style>${shots.map(([name, t], i) => `<text x="${(i % 3) * 500 + 20}" y="${Math.floor(i / 3) * 540 + 40}">${String(i + 1).padStart(2, "0")}  ${name.toUpperCase()}   /   ${t.toFixed(2)}s</text>`).join("")}</svg>`,
  );
  await sharp({
    create: { width: 1520, height: 1140, channels: 3, background: "#20211f" },
  })
    .composite([...tiles, { input: labels, left: 0, top: 0 }])
    .png()
    .toFile("out/storyboard.png");
  await browser.close();
})();
