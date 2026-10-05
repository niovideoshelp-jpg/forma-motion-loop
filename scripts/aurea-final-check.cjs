const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  ROOT,
  OUT,
  W,
  H,
  FPS,
  FRAMES,
  DURATION,
  SW,
  SH,
  VIDEO,
  FFMPEG,
  FFPROBE,
  hash,
  sourceSignature,
  saveJson,
  smallDifference,
  flagJumps,
  contactSheet,
} = require("./aurea-produce.cjs");
const MAX_BUFFER = 128 * 1024 * 1024;

function run(command, args) {
  const result = spawnSync(command, args, { maxBuffer: MAX_BUFFER });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command} exited ${result.status}: ${result.stderr?.toString("utf8")}`,
    );
  return result;
}
function number(value, label) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isFinite(Number(value))
  )
    throw new Error(`Invalid ${label}: ${value}`);
  return Number(value);
}
function rate(value) {
  if (!/^\d+\/\d+$/.test(value))
    throw new Error(`Invalid frame rate: ${value}`);
  const [a, b] = value.split("/").map(Number);
  if (b === 0) throw new Error("Zero frame-rate denominator");
  return a / b;
}
function readEvidence(name, source) {
  const file = path.join(OUT, name);
  if (!fs.existsSync(file)) return { valid: false, reason: `Missing ${name}` };
  const evidence = JSON.parse(fs.readFileSync(file, "utf8"));
  return {
    valid:
      evidence.passed === true && evidence.source?.sha256 === source.sha256,
    passed: evidence.passed,
    sourceMatches: evidence.source?.sha256 === source.sha256,
    sha256: hash(fs.readFileSync(file)),
  };
}
async function main() {
  if (!fs.existsSync(VIDEO))
    throw new Error(`Missing ${VIDEO}; render after reviewing --stills`);
  const source = sourceSignature(),
    videoSha256 = hash(fs.readFileSync(VIDEO));
  const probe = JSON.parse(
    run(FFPROBE, [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,r_frame_rate,nb_frames,duration,sample_rate,channels",
      "-of",
      "json",
      VIDEO,
    ]).stdout.toString("utf8"),
  );
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const audio = probe.streams.find((stream) => stream.codec_type === "audio");
  if (!video || !audio)
    throw new Error("Both video and audio streams are required");
  const metadata = {
    width: number(video.width, "width"),
    height: number(video.height, "height"),
    fps: rate(video.avg_frame_rate),
    nominalFps: rate(video.r_frame_rate),
    frames: number(video.nb_frames, "frame count"),
    duration: number(probe.format.duration, "duration"),
    videoDuration: number(video.duration, "video duration"),
    videoCodec: video.codec_name,
    audioCodec: audio.codec_name,
    sampleRate: number(audio.sample_rate, "sample rate"),
    channels: number(audio.channels, "channels"),
  };
  const metadataPass =
    metadata.width === W &&
    metadata.height === H &&
    metadata.fps === FPS &&
    metadata.nominalFps === FPS &&
    metadata.frames === FRAMES &&
    Math.abs(metadata.duration - DURATION) <= 0.001 &&
    Math.abs(metadata.videoDuration - DURATION) <= 0.001 &&
    metadata.videoCodec === "h264" &&
    metadata.audioCodec === "aac" &&
    metadata.sampleRate === 48000 &&
    metadata.channels === 2;
  saveJson("media-metadata.json", {
    passed: metadataPass,
    videoSha256,
    expected: {
      width: W,
      height: H,
      fps: FPS,
      frames: FRAMES,
      duration: DURATION,
    },
    actual: metadata,
  });
  console.log(
    `Media: ${metadata.width}×${metadata.height} / ${metadata.fps}fps / ${metadata.frames} frames / ${metadata.duration}s`,
  );

  const loudnessLog = run(FFMPEG, [
    "-hide_banner",
    "-nostdin",
    "-i",
    VIDEO,
    "-map",
    "0:a:0",
    "-vn",
    "-af",
    "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
    "-f",
    "null",
    "-",
  ]).stderr.toString("utf8");
  fs.writeFileSync(path.join(OUT, "loudness.txt"), loudnessLog);
  const match = loudnessLog.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match)
    throw new Error("No loudnorm measurements returned for encoded AAC");
  const raw = JSON.parse(match[0]);
  const loudness = {
    videoSha256,
    integratedLUFS: number(raw.input_i, "LUFS"),
    truePeakDbtp: number(raw.input_tp, "true peak"),
    loudnessRangeLU: number(raw.input_lra, "LRA"),
    thresholdLUFS: number(raw.input_thresh, "threshold"),
    target: { integratedLUFS: -14, toleranceLU: 0.2, maximumTruePeakDbtp: -1 },
    measurement: "Decoded final AAC; loudnorm input measurements",
    raw,
  };
  loudness.passed =
    Math.abs(loudness.integratedLUFS + 14) <= 0.200001 &&
    loudness.truePeakDbtp <= -1;
  saveJson("loudness.json", loudness);
  console.log(
    `Encoded loudness: ${loudness.integratedLUFS} LUFS / ${loudness.truePeakDbtp} dBTP`,
  );

  const decoded = run(FFMPEG, [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-i",
    VIDEO,
    "-map",
    "0:v:0",
    "-an",
    "-sn",
    "-dn",
    "-vf",
    `scale=${SW}:${SH}:flags=lanczos,gblur=sigma=1,format=rgb24`,
    "-fps_mode",
    "passthrough",
    "-pix_fmt",
    "rgb24",
    "-f",
    "rawvideo",
    "pipe:1",
  ]).stdout;
  const bytesPerFrame = SW * SH * 3;
  if (decoded.length % bytesPerFrame)
    throw new Error("Decoder returned a partial RGB frame");
  const decodedFrames = decoded.length / bytesPerFrame,
    rows = [];
  for (let frame = 1; frame < decodedFrames; frame++)
    rows.push({
      frame,
      time: frame / FPS,
      difference: smallDifference(
        decoded.subarray((frame - 1) * bytesPerFrame, frame * bytesPerFrame),
        decoded.subarray(frame * bytesPerFrame, (frame + 1) * bytesPerFrame),
        3,
      ),
    });
  const flags = flagJumps(rows),
    first = decoded.subarray(0, bytesPerFrame),
    last = decoded.subarray(decoded.length - bytesPerFrame);
  let endpointMax = 0;
  for (let i = 0; i < bytesPerFrame; i++)
    endpointMax = Math.max(endpointMax, Math.abs(first[i] - last[i]));
  const endpointMean = smallDifference(first, last, 3);
  const scan = {
    passed: decodedFrames === FRAMES && flags.length === 0 && endpointMean <= 1,
    videoSha256,
    decodedFrames,
    analysis: {
      resolution: [SW, SH],
      format: "rgb24",
      filter: "lanczos + Gaussian sigma1",
    },
    endpoints: {
      meanAbsoluteChannelDelta: endpointMean,
      maximumChannelDelta: endpointMax,
      toleranceMean: 1,
      note: "Source endpoints must be exact; H.264 endpoints are measured with a one-level mean tolerance",
    },
    flags,
    rows,
  };
  saveJson("encoded-scan.json", scan);
  console.log(
    `Decoded scan: ${decodedFrames} frames; ${flags.length} jump candidates; endpoint mean=${endpointMean.toFixed(6)}`,
  );

  const shots = [];
  for (const [label, time] of [
    ["NOIR", 0.8],
    ["LUMIÈRE", 4.7],
    ["PRUNE", 7.2],
    ["DETAIL", 10.7],
    ["DRAFT", 14.5],
    ["RETURN", 21.35],
  ]) {
    const frame = Math.round(time * FPS);
    const png = run(FFMPEG, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-i",
      VIDEO,
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
    shots.push({ label, time, png });
  }
  await contactSheet(shots, "encoded-contact.png");
  const evidence = Object.fromEntries(
    [
      "preflight.json",
      "motion-check.json",
      "frame-scan.json",
      "remotion-parity.json",
      "weighted-loop.json",
    ].map((name) => [name, readEvidence(name, source)]),
  );
  const frameScan = fs.existsSync(path.join(OUT, "frame-scan.json"))
    ? JSON.parse(fs.readFileSync(path.join(OUT, "frame-scan.json"), "utf8"))
    : null;
  const motionFile = path.join(OUT, "motion-check.json");
  const motionAudit = fs.existsSync(motionFile)
    ? JSON.parse(fs.readFileSync(motionFile, "utf8"))
    : null;
  const cursorAudit = motionAudit?.cursorContinuity;
  const touchAudit = motionAudit?.touchAttachment;
  const audioFile = path.join(ROOT, "public/assets/aurea-mix.wav");
  const audioMatches =
    fs.existsSync(audioFile) &&
    frameScan?.audioSha256 === hash(fs.readFileSync(audioFile));
  const summary = {
    passed:
      metadataPass &&
      loudness.passed &&
      scan.passed &&
      audioMatches &&
      cursorAudit?.passed === true &&
      touchAudit?.passed === true &&
      Object.values(evidence).every((item) => item.valid),
    source,
    videoSha256,
    metadataPass,
    loudnessPass: loudness.passed,
    decodedScanPass: scan.passed,
    sourceAudioMatches: audioMatches,
    cursorContinuity: {
      passed: cursorAudit?.passed === true,
      junctions: cursorAudit?.samples?.length ?? 0,
      maximumVisibleDeltaPixels: cursorAudit
        ? Math.max(
            0,
            ...cursorAudit.samples.filter((s) => s.visible).map((s) => s.delta),
          )
        : null,
      tolerancePixels: cursorAudit?.tolerancePixels ?? null,
    },
    touchAttachment: {
      passed: touchAudit?.passed === true,
      comparisons: touchAudit?.samples?.length ?? 0,
      maximumAnchorDeltaPixels: touchAudit
        ? Math.max(0, ...touchAudit.samples.map((s) => s.delta))
        : null,
      tolerancePixels: touchAudit?.tolerancePixels ?? null,
    },
    evidence,
    output: path.relative(ROOT, VIDEO).replaceAll(path.sep, "/"),
    visualReview:
      "Inspect storyboard, transitions and encoded-contact; automated checks do not approve composition quality",
  };
  saveJson("final-check.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.passed)
    throw new Error(
      "AURÉA final validation failed; inspect out/aurea/final-check.json",
    );
}
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
