# AUREA centered edition: audio review

Source review completed on 2026-10-05. This edition centers the main composition on x=540 and uses the hand without an arm. Timing and soundtrack are preserved.

The source signature was independently recomputed as `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e`. Preflight, motion-check, weighted-loop and Remotion-parity evidence each report passed and match this signature. The signature covers the motion module and hand assets, so approvals for earlier layouts do not certify this edition.

The WAV remains byte-identical: SHA-256 `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`. Its existing measurements are 22 seconds, 48 kHz stereo, 24-bit PCM, -14.00 LUFS integrated and -1.72 dBTP. No audio was rewritten.

## Eight preserved anchors

| Time | Cue | Current source behavior |
| --- | --- | --- |
| 0.35 s | Soft interface hover | First hand contact and CTA fill begin at 0.35 s. The intro CTA is centered at (540,1535), width 590; the fingertip contacts its right edge at (835,1535). Pressure peaks separately at 0.46 s. |
| 3.30 s | Select click | First swipe beat and camera departure. |
| 5.80 s | Short whoosh | Second swipe beat and dress-change departure. |
| 8.30 s | Select click | Hand pressure and shared-picture transition open the detail scene. |
| 9.30 s | Soft whoosh | Second pressure peak, detail expansion tween and detail reveal. |
| 12.30 s | Select click | Hand pressure and transition into the WhatsApp draft. Sending remains disabled. |
| 16.30 s | Brand chime | Signature transition begins; brand content settles afterward. |
| 20.30 s | Return whoosh | Return motion begins toward the opening layout. |

All eight targets and isolated filtered SFX peak measurements in audio-cues.json exactly match these times. The principal music attacks remain within 5 ms of the seven transition anchors. Sounds identify action or transition starts, not the later settled poses. The visual recentering requires no soundtrack change.

## Reproduction and final encoded validation

The public reproduction path remains `node scripts/aurea-audio.cjs`, using the committed source ledger and ignored download cache. `--sources-only` validates or prepares sources without rewriting the final mix. Earlier source/download tests remain recorded in audio-sources.json; no raw audio is published in documentation.

Source and cue review: complete. The new MP4 is still being exported; it has not been opened or read during this review. Its final approval will be appended after completion and will include its own SHA-256, independent ffprobe/loudnorm results and decoded AAC/WAV timing comparison. Earlier MP4 measurements are not reused as approval for this file.

No media, engine, asset or test file was altered. Only this document was created. This is a source timing review, without a new subjective listening claim.

## Final centered-edition AAC approval — 2026-10-05

**Approved: no encoded audio or timing blocker found.** This approval applies to completed MP4 SHA-256 `67ae42a12ccee00130531fd047acab65dc191223e5403cdab267398656f62113`, source signature `147735630fe5b98d71a55f01069afa617b6401b60c8457b518a0e06e6860631e` and preserved WAV SHA-256 `156f5bcbdf53e419e4ac01a39d6855e20e0d079c5bbf2ac52b0bd834a100772c`. Both media hashes were checked before and after this independent review.

Independent ffprobe confirms 1080 x 1920, 60/1 average and nominal fps, 1,320 video frames, 22-second video/container/audio durations, and stereo AAC at 48 kHz. Independent loudnorm input measurements confirm **-14.03 LUFS integrated** and **-1.53 dBTP**, within the -14 +/- 0.2 LUFS and <= -1 dBTP targets.

WAV and AAC each decode to 1,056,000 stereo sample frames over the 22-second comparison interval; all decoded AAC samples are finite. Waveform correlation sampled every eight frames, with offsets searched from -48 to +48 samples, gives a best offset of **0 samples** and correlation **0.999801420**.

| Cue | Time | AAC/WAV correlation |
| --- | --- | --- |
| hover | 0.35 s | 0.999988382 |
| click | 3.30 s | 0.999920151 |
| look-change | 5.80 s | 0.999885399 |
| selection | 8.30 s | 0.999914183 |
| detail | 9.30 s | 0.999882831 |
| whatsapp | 12.30 s | 0.999972051 |
| signature | 16.30 s | 0.999989175 |
| return | 20.30 s | 0.999994186 |

Each cue comparison covers 100 ms before and 150 ms after the anchor. These measurements confirm encoded mix timing in the eight windows, not isolated SFX extraction after mastering. The sample-exact pre-master effect peak positions remain recorded in audio-cues.json.

Current final-check evidence reports passed and matches this MP4 and source. The earlier section describing export in progress is superseded by this completed-file approval. No soundtrack, media, engine, asset or test file was modified; only this document was appended. This is measured technical approval without a subjective listening claim.
