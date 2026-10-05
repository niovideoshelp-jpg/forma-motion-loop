// Review artifact: the preceding published AURÉA against the current six-frame board.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");
const root = path.resolve(__dirname, "..");
async function main() {
  const before = execFileSync("git", [
    "show", "a8b8536:docs/aurea/storyboard.png",
  ], { cwd: root, maxBuffer: 20 * 1024 * 1024 });
  const current = fs.readFileSync(path.join(root, "out/aurea/storyboard.png"));
  const a = await sharp(before).resize({ width: 630 }).png().toBuffer();
  const b = await sharp(current).resize({ width: 630 }).png().toBuffer();
  const metadata = await sharp(a).metadata();
  const labels = Buffer.from(`<svg width="1290" height="52">
    <g fill="#F4DFBF" font-size="22" font-family="Arial">
      <text x="16" y="32">Edição anterior</text>
      <text x="676" y="32">Nova edição · conteúdo centralizado</text>
    </g></svg>`);
  await sharp({ create: {
    width: 1290, height: metadata.height + 52, channels: 3, background: "#291c30",
  } }).composite([
    { input: a, left: 0, top: 52 }, { input: b, left: 660, top: 52 },
    { input: labels, left: 0, top: 0 },
  ]).png().toFile(path.join(root, "docs/aurea/refinement-comparison.png"));
  console.log("Saved before/after comparison");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
