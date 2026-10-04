const fs = require("fs"),
  path = require("path"),
  sharp = require("sharp"),
  { spawnSync } = require("child_process");

process.chdir(path.resolve(__dirname, ".."));
const folder = "out/lume-refined",
  input = path.join(folder, "lume-refined-1440-60.mp4"),
  expected = { width: 1440, height: 1440, fps: 60, frames: 1320, duration: 22 },
  maximumBuffer = 64 * 1024 * 1024;

function run(command, args) {
  const result = spawnSync(command, args, { maxBuffer: maximumBuffer });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw Error(
      `${command} exited ${result.status}: ${result.stderr?.toString("utf8")}`,
    );
  return result;
}
function finite(value, label) {
  if (value === undefined || value === null || value === "")
    throw Error(`Missing ${label}`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw Error(`Invalid ${label}: ${value}`);
  return number;
}
function rate(value) {
  if (typeof value !== "string" || !/^\d+\/\d+$/.test(value))
    throw Error(`Invalid frame-rate ratio: ${value}`);
  const [numerator, denominator] = value.split("/").map(Number);
  if (!denominator) throw Error(`Invalid frame-rate denominator: ${value}`);
  return finite(numerator / denominator, "frame rate");
}
function requireValue(condition, message) {
  if (!condition) throw Error(`Metadata validation failed: ${message}`);
}
function writeJson(name, value) {
  fs.writeFileSync(path.join(folder, name), JSON.stringify(value, null, 2));
}
function delta(a, b) {
  if (a.length !== b.length) throw Error("Decoded frame sizes differ");
  let sum = 0,
    maximum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    sum += d;
    maximum = Math.max(maximum, d);
  }
  return { mean: finite(sum / a.length, "frame difference"), maximum };
}

(async () => {
  if (!fs.existsSync(input) || fs.statSync(input).size === 0)
    throw Error(`Missing finished export: ${input}`);
  fs.mkdirSync(folder, { recursive: true });
  const probe = JSON.parse(
    run("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,r_frame_rate,nb_frames,duration,sample_rate,channels",
      "-of",
      "json",
      input,
    ]).stdout.toString("utf8"),
  );
  const video = probe.streams?.find((stream) => stream.codec_type === "video"),
    audio = probe.streams?.find((stream) => stream.codec_type === "audio");
  requireValue(Boolean(video), "video stream is missing");
  requireValue(Boolean(audio), "audio stream is missing");
  const metadata = {
    width: finite(video.width, "width"),
    height: finite(video.height, "height"),
    fps: rate(video.avg_frame_rate),
    nominalFps: rate(video.r_frame_rate),
    frames: finite(video.nb_frames, "frame count"),
    duration: finite(probe.format?.duration, "container duration"),
    videoDuration: finite(video.duration, "video duration"),
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
    sampleRate: finite(audio.sample_rate, "audio sample rate"),
    channels: finite(audio.channels, "audio channels"),
  };
  requireValue(
    metadata.width === expected.width && metadata.height === expected.height,
    "expected 1440 x 1440 video",
  );
  requireValue(
    metadata.fps === expected.fps && metadata.nominalFps === expected.fps,
    "expected 60 fps",
  );
  requireValue(metadata.frames === expected.frames, "expected 1320 frames");
  requireValue(
    Math.abs(metadata.duration - expected.duration) <= 0.001 &&
      Math.abs(metadata.videoDuration - expected.duration) <= 0.001,
    "expected 22.000 seconds",
  );
  requireValue(metadata.audioCodec === "aac", "expected AAC audio");
  requireValue(
    metadata.sampleRate === 48000 && metadata.channels === 2,
    "expected 48 kHz stereo audio",
  );
  console.log(
    `Metadata OK: ${metadata.width}x${metadata.height}, ${metadata.fps} fps, ${metadata.frames} frames, ${metadata.duration.toFixed(3)}s; AAC 48 kHz stereo`,
  );

  const loudnessLog = run("ffmpeg", [
    "-hide_banner",
    "-nostdin",
    "-i",
    input,
    "-map",
    "0:a:0",
    "-vn",
    "-af",
    "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
    "-f",
    "null",
    "-",
  ]).stderr.toString("utf8");
  fs.writeFileSync(path.join(folder, "loudness.txt"), loudnessLog);
  const loudnessMatch = loudnessLog.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!loudnessMatch)
    throw Error("FFmpeg did not return loudness measurements");
  const measured = JSON.parse(loudnessMatch[0]);
  const loudness = {
    input,
    integratedLUFS: finite(measured.input_i, "integrated loudness"),
    truePeakDbtp: finite(measured.input_tp, "true peak"),
    loudnessRangeLU: finite(measured.input_lra, "loudness range"),
    thresholdLUFS: finite(measured.input_thresh, "loudness threshold"),
    measurement:
      "AAC audio decoded from the finished MP4; loudnorm input measurements",
    raw: measured,
  };
  writeJson("loudness.json", loudness);
  console.log(
    `Encoded audio: ${loudness.integratedLUFS.toFixed(2)} LUFS, ${loudness.truePeakDbtp.toFixed(2)} dBTP, LRA ${loudness.loudnessRangeLU.toFixed(2)} LU`,
  );

  const thumbnailWidth = 96,
    thumbnailHeight = 96,
    frameBytes = thumbnailWidth * thumbnailHeight * 3;
  const decoded = run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-i",
    input,
    "-map",
    "0:v:0",
    "-an",
    "-sn",
    "-dn",
    "-vf",
    "scale=96:96:flags=lanczos,gblur=sigma=1,format=rgb24",
    "-fps_mode",
    "passthrough",
    "-pix_fmt",
    "rgb24",
    "-f",
    "rawvideo",
    "pipe:1",
  ]).stdout;
  if (decoded.length % frameBytes !== 0)
    throw Error("Incomplete decoded RGB frame in FFmpeg output");
  const decodedFrames = decoded.length / frameBytes;
  requireValue(
    decodedFrames === expected.frames,
    `decoder returned ${decodedFrames} frames instead of 1320`,
  );
  const rows = [];
  for (let frame = 1; frame < decodedFrames; frame++) {
    const previous = decoded.subarray(
        (frame - 1) * frameBytes,
        frame * frameBytes,
      ),
      current = decoded.subarray(frame * frameBytes, (frame + 1) * frameBytes);
    rows.push({
      frame,
      time: frame / expected.fps,
      difference: delta(previous, current).mean,
    });
  }
  // Match the production scan's isolated-jump rule exactly.
  const flags = rows.filter(
    (value, index) =>
      value.difference > 2 &&
      value.difference >
        3 *
          Math.max(
            0.1,
            ((rows[index - 1]?.difference || 0) +
              (rows[index + 1]?.difference || 0)) /
              2,
          ),
  );
  const endpoints = delta(
    decoded.subarray(0, frameBytes),
    decoded.subarray(decoded.length - frameBytes),
  );
  const scan = {
    input,
    metadata,
    decodedFrames,
    analysis: {
      resolution: [thumbnailWidth, thumbnailHeight],
      format: "rgb24",
      scale: "lanczos",
      gaussianSigma: 1,
      maxBufferBytes: maximumBuffer,
    },
    endpoints: {
      firstTime: 0,
      lastTime: (decodedFrames - 1) / expected.fps,
      meanAbsoluteChannelDelta: endpoints.mean,
      maximumChannelDelta: endpoints.maximum,
      note: "Lossy encoded endpoints are measured, not required to be pixel-identical.",
    },
    flags,
    rows,
  };
  writeJson("encoded-scan.json", scan);
  console.log(
    `Encoded scan: ${decodedFrames} frames, ${flags.length} isolated jump candidates; endpoint mean ${endpoints.mean.toFixed(6)}, max ${endpoints.maximum}`,
  );
  if (flags.length) console.log("Jump candidates:", JSON.stringify(flags));

  const shots = [
      ["PLAYER", 8.5],
      ["BRAND TRANSITION", 16.45],
      ["RETURN", 20.3],
      ["RETURN DETAIL", 21.35],
    ],
    tile = 480,
    gap = 20,
    labelHeight = 38,
    sheetWidth = 2 * (tile + gap) + gap,
    sheetHeight = 2 * (tile + labelHeight + gap) + gap,
    composites = [];
  for (let i = 0; i < shots.length; i++) {
    const [, time] = shots[i],
      frame = Math.round(time * expected.fps);
    const png = run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-i",
      input,
      "-map",
      "0:v:0",
      "-an",
      "-vf",
      `select=eq(n\\,${frame})`,
      "-frames:v",
      "1",
      "-fps_mode",
      "passthrough",
      "-f",
      "image2pipe",
      "-c:v",
      "png",
      "pipe:1",
    ]).stdout;
    if (!png.length) throw Error(`No encoded contact frame at ${time}s`);
    composites.push({
      input: await sharp(png).resize(tile, tile).toBuffer(),
      left: gap + (i % 2) * (tile + gap),
      top: gap + labelHeight + Math.floor(i / 2) * (tile + labelHeight + gap),
    });
  }
  const labels = Buffer.from(
    `<svg width="${sheetWidth}" height="${sheetHeight}"><style>text{font:15px Arial;fill:#f4f2ed}</style>${shots.map(([label, time], i) => `<text x="${gap + (i % 2) * (tile + gap)}" y="${gap + 25 + Math.floor(i / 2) * (tile + labelHeight + gap)}">${label} / ${time.toFixed(2)}s</text>`).join("")}</svg>`,
  );
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 3,
      background: "#17181c",
    },
  })
    .composite([...composites, { input: labels, left: 0, top: 0 }])
    .png()
    .toFile(path.join(folder, "encoded-contact.png"));
  console.log(
    "Saved out/lume-refined/loudness.json, loudness.txt, encoded-scan.json and encoded-contact.png",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
