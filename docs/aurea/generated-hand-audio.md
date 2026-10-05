# AUREA generated-hand edition: independent audio audit

Prepared on 2026-10-05 for the edition using the generated PNG hand. This document will approve only the new completed file; earlier MP4 approvals are not substituted for current measurements.

## Source preparation

The source signature was independently recomputed as `bc439b849f28e66ec4a80bf2d6bf1aa522cffaa5e1fbecccaabf8bcb12ef2dbd`. It includes the motion module and `public/assets/aurea/touch-hand-photo.png`, whose SHA-256 is `128bdc46fa2f2589a46bcf2a7672d76ded1593aa5aaca171b612f056db726eff`.

The WAV is unchanged: SHA-256 `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`. The eight cue targets and isolated filtered peak positions remain exactly 0.35, 3.30, 5.80, 8.30, 9.30, 12.30, 16.30 and 20.30 seconds. No soundtrack rebuild is required for the hand-image replacement.

The existing producer and final checker were inspected. The production scan records the source and WAV hashes. Final encoded checks record the actual MP4 hash, reject missing or outdated source evidence, and measure loudnorm input values from the AAC stream. Those checks do not replace the independent measurements below.

## Completion checklist

- [x] Wait for export exit 0 and current final-check completion before opening the MP4.
- [x] Recompute the new completed MP4 SHA-256 and confirm it remains stable during review.
- [x] Verify the frozen source, unchanged WAV and new final-check source/video hashes.
- [x] Independently probe 1080 x 1920, 60/1 nominal and average fps, 1,320 frames, 22 seconds, H.264 and stereo AAC at 48 kHz.
- [x] Independently measure decoded AAC: -14 +/- 0.2 LUFS integrated and true peak <= -1 dBTP; reject non-finite values.
- [x] Decode the full 22-second comparison interval and confirm 1,056,000 stereo sample frames with finite samples.
- [x] Correlate AAC with WAV, searching offsets -48 to +48 samples; report the method and sampling interval explicitly.
- [x] Check all eight cue windows from 100 ms before to 150 ms after their anchors. These are mix comparisons, not isolated post-master effect extraction.
- [x] Compare the final delivered copy byte-for-byte with the audited render, recording both paths, sizes and hashes.
- [x] Append approval or rejection using this edition's actual MP4 hash and measured results.

The preparation pass did not read the partial MP4. Export exit 0 and the current final-check were confirmed before the completed-file measurements below. Only this document was edited; no code, media, asset or test file was changed.

## Final independent approval — 2026-10-05

**Approved: no encoded audio, timing or delivered-copy blocker found.** This verdict applies only to source `bc439b849f28e66ec4a80bf2d6bf1aa522cffaa5e1fbecccaabf8bcb12ef2dbd` and new MP4 SHA-256 `3250c232073761ef47196478ff0a2f391ef20cf2e58edcb4352b617823e0c5f0`. It does not substitute an earlier edition's measurements.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `out/aurea/aurea-1080x1920-60.mp4` | 5806241 | `3250c232073761ef47196478ff0a2f391ef20cf2e58edcb4352b617823e0c5f0` |
| `docs/aurea/aurea-photohand-1080x1920-60.mp4` | 5806241 | `3250c232073761ef47196478ff0a2f391ef20cf2e58edcb4352b617823e0c5f0` |

The delivered copy and audited render passed a full Buffer.equals byte comparison, as well as independent SHA-256 checks. Both hashes were stable before and after review.

Independent ffprobe confirms H.264, 1080 x 1920, nominal and average 60/1 fps, 1,320 frames and 22-second container/video/audio durations; AAC is stereo at 48 kHz. Independent loudnorm input measurements of decoded AAC are **-14.03 LUFS integrated** and **-1.53 dBTP**. Both meet the -14 +/- 0.2 LUFS and <= -1 dBTP targets.

The unchanged WAV and decoded AAC each contain 1,056,000 stereo sample frames in the 22-second comparison interval, and all AAC samples are finite. Correlation sampled every eight frames over 0.1–21.9 s, with an offset search from -48 to +48 samples, found **0 samples of offset** and **0.999801420** correlation.

| Cue | Time | AAC/WAV window correlation |
| --- | --- | --- |
| hover | 0.35 s | 0.999988382 |
| click | 3.30 s | 0.999920151 |
| look-change | 5.80 s | 0.999885399 |
| selection | 8.30 s | 0.999914183 |
| detail | 9.30 s | 0.999882831 |
| whatsapp | 12.30 s | 0.999972051 |
| signature | 16.30 s | 0.999989175 |
| return | 20.30 s | 0.999994186 |

Each window spans 100 ms before to 150 ms after its anchor. These compare the encoded mix with the source mix; they do not separately extract isolated post-master effects. The eight sample-exact isolated filtered SFX peaks remain verified in the cue ledger.

The current final-check is passed and matches this source and video hash. WAV SHA-256 remains `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`. No media was rewritten. This is measured technical approval; it does not claim subjective listening or replace the visual review.
