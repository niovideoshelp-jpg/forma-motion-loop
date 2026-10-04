const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
process.chdir(path.resolve(__dirname, ".."));
const source = "out/lume-refined",
  destination = "docs/lume-refined";
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(source, name), "utf8"));
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const preflight = read("preflight.json"),
  production = read("frame-scan.json"),
  encoded = read("encoded-scan.json"),
  transition = read("transition-review.json"),
  remotion = read("remotion-check.json");
if (
  !preflight.loopEqual ||
  !preflight.seekIndependent ||
  preflight.flags.length ||
  preflight.pageErrors.length
)
  throw Error("Source validation failed");
if (
  production.flags.length ||
  production.pageErrors.length ||
  encoded.flags.length
)
  throw Error("Video validation failed");
if (!transition.exportApproved || !remotion.equal || remotion.changedPixels)
  throw Error("Review or Remotion parity failed");
if (remotion.sourceSha256 !== hash("public/lume-refined.js"))
  throw Error("Remotion evidence belongs to a different engine revision");
const coverage = read("critical-coverage.json"),
  motion = read("motion-check.json");
if (!motion.passed) throw Error("Independent motion check failed");
if (
  coverage.reviewStatus !== "approved" ||
  coverage.sourceSHA256 !== hash("public/lume-refined.js")
)
  throw Error(
    "Final visual coverage has not been reviewed for this engine revision",
  );
fs.mkdirSync(destination, { recursive: true });
const copy = (name, target = name) => {
  const output = path.join(destination, target);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(path.join(source, name), output);
};
const files = [
  "lume-refined-1440-60.mp4",
  "storyboard.png",
  "critical.png",
  "compare-01.png",
  "compare-02.png",
  "encoded-contact.png",
  "preflight.json",
  "frame-scan.json",
  "encoded-scan.json",
  "loudness.json",
  "motion-audit.json",
  "motion-check.json",
  "transition-review.json",
  "rhythm-review.json",
  "remotion-check.json",
  "critical-coverage.json",
  "critical-review.md",
  "art-check.json",
  "engine-player-current.png",
  "remotion-player.png",
];
files.forEach((name) => copy(name));
copy("transition-review/window-555-590.png", "player-progress-review.png");
coverage.windows.forEach((window) => {
  copy(window.contactSheet);
  copy(window.exactPointFile);
});
const manifest = {
  film: "Lume+ GSAP refinement",
  width: 1440,
  height: 1440,
  fps: 60,
  frames: 1320,
  duration: 22,
  engineSha256: hash("public/lume-refined.js"),
  motionSha256: hash("public/lume-motion.js"),
  artSha256: hash("public/lume-refined-art.js"),
  videoSha256: hash(path.join(destination, "lume-refined-1440-60.mp4")),
  audioSha256: hash("public/assets/lume-mix.wav"),
  gsap: JSON.parse(
    fs.readFileSync("public/assets/gsap/provenance.json", "utf8"),
  ),
  reviewers: [
    "astra_motion",
    "astra_art_review",
    "astra_illustrations",
    "astra_audio",
  ],
  sourceLoopEqual: preflight.loopEqual,
  seekComparisons: preflight.replayComparisons,
  sourceJumpCandidates: preflight.flags.length,
  renderedJumpCandidates: production.flags.length,
  decodedJumpCandidates: encoded.flags.length,
  note: "Audio source downloads and isolated mixed WAV are excluded from Git. Validation applies to this frozen engine and export.",
};
fs.writeFileSync(
  path.join(destination, "release.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Published validated artifacts to", destination);
