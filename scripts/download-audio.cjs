const fs = require("fs"),
  { execFileSync } = require("child_process");
(async () => {
  fs.mkdirSync("raw", { recursive: true });
  for (const [name, url] of [
    ["head-bang", "https://assets.mixkit.co/music/357/357.mp3"],
    [
      "click",
      "https://assets.mixkit.co/active_storage/sfx/1133/1133-preview.mp3",
    ],
    [
      "whoosh",
      "https://assets.mixkit.co/active_storage/sfx/1489/1489-preview.mp3",
    ],
  ]) {
    const r = await fetch(url);
    if (!r.ok) throw Error(`${name}: ${r.status}`);
    fs.writeFileSync(`raw/${name}.mp3`, Buffer.from(await r.arrayBuffer()));
    if (name !== "head-bang")
      execFileSync("ffmpeg", [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        `raw/${name}.mp3`,
        "-ac",
        "1",
        "-ar",
        "48000",
        "-f",
        "f32le",
        `raw/${name}.f32`,
      ]);
    console.log(name);
  }
  fs.mkdirSync("out", { recursive: true });
})();
