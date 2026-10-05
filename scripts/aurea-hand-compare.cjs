// Compare the same contact pose before/after the generated hand replacement.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");
const root = path.resolve(__dirname, "..");
async function main() {
  const before = execFileSync(
    "git",
    ["show", "ced1779:docs/aurea/noir.png"],
    { cwd: root, maxBuffer: 20 * 1024 * 1024 },
  );
  const after = fs.readFileSync(path.join(root, "out/aurea/noir.png"));
  const region = { left: 755, top: 1445, width: 290, height: 370 };
  const images = await Promise.all(
    [before, after].map((data) =>
      sharp(data).extract(region).resize(464, 592).png().toBuffer(),
    ),
  );
  const labels = Buffer.from(`<svg width="980" height="56">
    <g fill="#F4DFBF" font-size="22" font-family="Arial">
      <text x="18" y="36">Mão vetorial anterior · 0,8s</text>
      <text x="508" y="36">Mão fotográfica gerada · 0,8s</text>
    </g></svg>`);
  await sharp({
    create: { width: 980, height: 668, channels: 3, background: "#291c30" },
  })
    .composite([
      { input: images[0], left: 18, top: 56 },
      { input: images[1], left: 508, top: 56 },
      { input: labels, left: 0, top: 0 },
    ])
    .png()
    .toFile(path.join(root, "docs/aurea/hand-comparison.png"));
  console.log("Saved hand comparison from the same contact pose");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
