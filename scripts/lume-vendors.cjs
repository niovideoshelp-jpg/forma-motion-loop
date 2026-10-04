const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
process.chdir(path.resolve(__dirname, ".."));
const folder = "public/assets/gsap",
  version = require("../node_modules/gsap/package.json").version;
const revision = "13e2b790546426a1a2e0e9b409f3f8dc6d6611f2";
if (version !== "3.15.0") throw Error("Expected pinned GSAP 3.15.0");
fs.mkdirSync(folder, { recursive: true });
const files = [
  "gsap.min.js",
  "CustomEase.min.js",
  "MotionPathPlugin.min.js",
  "MorphSVGPlugin.min.js",
];
const records = files.map((name) => {
  const bytes = fs.readFileSync(path.join("node_modules/gsap/dist", name));
  fs.writeFileSync(path.join(folder, name), bytes);
  return {
    name,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    source: `https://github.com/greensock/GSAP/blob/${revision}/dist/${name}`,
  };
});
fs.writeFileSync(
  path.join(folder, "provenance.json"),
  JSON.stringify(
    {
      package: "gsap",
      version,
      revision,
      archive: `https://github.com/greensock/GSAP/archive/${revision}.tar.gz`,
      license: "https://gsap.com/standard-license/",
      files: records,
    },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  path.join(folder, "LICENSE-INFO.txt"),
  "GSAP 3.15.0\nCopyright 2008-2026 GreenSock. All rights reserved.\nDistributed under the GSAP Standard License: https://gsap.com/standard-license/\nOfficial source: https://github.com/greensock/GSAP\nCopyright and license headers are retained in every vendor file.\n",
);
console.log(
  "Prepared local GSAP core, CustomEase, MotionPath and MorphSVG",
  version,
);
