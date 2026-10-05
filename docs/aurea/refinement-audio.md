# AUREA refinement: audio and production review

Review date: 2026-10-05. The refinement changes layout and smartphone-hand choreography. The approved 22-second soundtrack is preserved. This document separates the current source review from the final encoded review, which will be performed against the newly rendered file.

## Preserved soundtrack

- [x] WAV SHA-256 remains `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`.
- [x] Existing WAV evidence: 48 kHz stereo, 24-bit PCM, 1,056,000 samples per channel, 22 seconds, -14.00 LUFS integrated and -1.72 dBTP.
- [x] Eight effects retain their measured isolated peak positions, with no audio rewrite.

| Time | Sound | Intended visual event | Current source review |
| --- | --- | --- | --- |
| 0.35 s | Very soft interface sound | Initial button contact/hover | New hand contact begins at 0.35 s; its later pressure peak at 0.46 s is distinct from the hover cue. |
| 3.30 s | Select click | First collection action | New swipe beat and first camera departure remain 3.30 s. |
| 5.80 s | Short whoosh | Dress change | New swipe beat and second camera departure remain 5.80 s. |
| 8.30 s | Select click | Selection opens detail | Hand pressure and shared-surface departure remain 8.30 s. |
| 9.30 s | Soft whoosh | Detail expansion | Second hand pressure is 9.30 s; final integrated detail reveal requires visual confirmation. |
| 12.30 s | Select click | WhatsApp CTA opens draft | Hand pressure and camera departure remain 12.30 s; no message-send sound is present. |
| 16.30 s | Restrained chime | AUREA brand signature | Camera/shared-surface departure remains 16.30 s; the cue does not imply order success. |
| 20.30 s | Short whoosh | Return to the opening layout | Return departure remains 20.30 s. |

The additional hand contact near 19.06 s can remain silent. Eight effects are sufficient; hand movement does not require a sound for every gesture. Principal musical attacks support gesture starts, while the 0.8-second visual transitions settle later. Existing measured music attacks are within 5 ms of the seven principal anchors.

The preserved mix remains compatible with this choreography: a restrained intro opens at 3.30 s, the filtered low end leaves room for editorial movement, and the return closes into real pre-roll. This is a timing and signal review, not a new subjective listening claim.

## Signature and stale-evidence gates

- [x] `scripts/aurea-produce.cjs` includes every root-level public file whose name begins with `aurea`, including `public/aurea-motion.js`.
- [x] It recursively hashes all files in `public/assets/aurea`, including `touch-hand.svg` and `touch-hand-long.svg`.
- [x] `src/Root.tsx` is included in the same source signature.
- [x] Render rejects stills with an old signature and rejects a missing, failed or outdated weighted-loop result.
- [x] Final check requires successful preflight, motion, production frame scan, Remotion parity and weighted-loop evidence with the current signature.
- [x] Final check separately matches the current WAV SHA-256 to the production frame scan.

At this review, the source signature was `a3e7eb8f2aa0df618055da4436d1092a08ee5a6051693b8622ab5dcdaf511a3f`. All six existing evidence files (stills, weighted loop, preflight, motion check, frame scan and Remotion parity) had a different source signature. Their earlier passing results therefore do not approve this refinement. The inspected gates correctly reject that stale evidence. The engine is still being revised; this snapshot is not the final render signature.

No producer, checker or engine code was modified during this review.

## Public reproduction

- [x] The committed `audio-sources.json` supplies five official Mixkit URLs and SHA-256 values; the script no longer depends on the ignored old output ledger.
- [x] Missing sources are downloaded into ignored `raw/lume`; cached files are preserved, hash checked and probed as MP3 audio.
- [x] HTTP failures, unexpected content types, oversized responses and hash mismatches are rejected.
- [x] `--sources-only` prepares the cache without rewriting the WAV. Earlier syntax, five-source cache and one-source download tests are recorded in `audio-sources.json`.
- [x] `raw/` and the final standalone WAV are ignored by Git. The film embeds the soundtrack; documentation carries provenance, not source recordings.

## Final refinement validation

The earlier MP4 approval in `audio-review.md` applies only to its recorded hash. The new encoded file will receive a separate measured approval here.

- [ ] Freeze the final source signature and regenerate all required source evidence.
- [ ] Confirm all eight integrated visual events against their existing cue times.
- [ ] Verify the new MP4 SHA-256, 1080 x 1920 dimensions, 60 fps, 1,320 frames and 22-second duration.
- [ ] Measure decoded AAC independently: 48 kHz stereo, -14 +/- 0.2 LUFS, true peak <= -1 dBTP.
- [ ] Compare decoded AAC with the preserved WAV for timing and the eight cue windows.
- [ ] Confirm the WAV remains unchanged and append the final technical audio verdict with the new MP4 hash.

No final encoded claim is made for the refinement yet.

## Final frozen-source anchor review — 2026-10-05

The final source signature was independently recomputed as `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`. The signature includes aurea-motion.js and both hand SVGs. The preserved WAV still hashes to `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`.

All eight cue targets and isolated filtered SFX peak measurements remain unchanged: 0.35, 3.30, 5.80, 8.30, 9.30, 12.30, 16.30 and 20.30 seconds. Current integrated source inspection confirms:

| Time | Final source behavior |
| --- | --- |
| 0.35 s | Hand contact, hover state and button fill begin together. The later pressure peak remains distinct from this soft hover sound. |
| 3.30 s | First hand swipe beat and camera departure coincide with the selection cue. |
| 5.80 s | Second swipe and camera departure coincide with the dress-change sweep. |
| 8.30 s | Hand pressure and shared-picture transition open the detail scene. |
| 9.30 s | The second pressure peak, detail expansion tween and detail reveal start at the existing soft sweep. |
| 12.30 s | Hand pressure and camera/shared-picture departure open the WhatsApp draft. Sending remains disabled. |
| 16.30 s | Camera/shared-picture departure and plum transition begin at the signature chime; brand content settles after the transition. |
| 20.30 s | Return motion and return treatment begin at the existing final sweep. |

The sound cues identify action or transition starts, not the later settled camera poses. This distinction is preserved in the final choreography. No soundtrack revision is required by the inspected timing.

Current preflight, motion-check, weighted-loop and Remotion-parity evidence all report passed and match this frozen signature. Production frame-scan and encoded-file validation are intentionally excluded while export is in progress. The partial MP4 was not opened or read.

Source/anchor review: complete. Encoded audio approval will be appended only after export completion. No audio, engine, asset or test file was modified.

## Final refinement AAC approval — 2026-10-05

**Approved: no encoded audio or technical timing blocker found.** This approval applies to the completed refined MP4 with SHA-256 `10c52785dd83de589fde5bef0253549d30df8c4027efef9a0717f145587f1e53`, rendered from source signature `536e12db47abaac2461b75bfd6ae7759c2c76068da7e292a5f596988b38c6661`. The preserved WAV SHA-256 remains `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`.

Independent ffprobe confirms H.264 video at 1080 x 1920, 60/1 nominal and average fps, 1,320 frames and exactly 22 seconds; the AAC stream is stereo at 48 kHz with a 22-second declared duration. Independent loudnorm input measurements of the decoded AAC are **-14.03 LUFS integrated** and **-1.53 dBTP**, satisfying -14 +/- 0.2 LUFS and <= -1 dBTP.

Both tracks decode to 1,056,000 stereo sample frames over the 22-second comparison interval. All decoded AAC samples are finite. Waveform correlation is sampled every eight frames; the offset search spans -48 to +48 samples. Best alignment is **0 samples**, with correlation **0.999801420**. This preserves the soundtrack timing through encoding.

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

Each cue window covers 100 ms before and 150 ms after its anchor. Correlation validates the encoded mix in those windows; it is not a claim that isolated post-master SFX peaks were separately extracted. The original isolated filtered cue peaks remain the reference in audio-cues.json.

The MP4 hash was stable before and after independent measurements. No source, audio, test, engine or asset file was modified. Only this review was appended. Final visual/frame-scan approval remains a separate responsibility; this is an encoded audio and technical timing approval, without a subjective listening claim.
