# Lume+ — subscription product film

Lume+ is a fictional online subscription for short courses in design, business and technology. This 22-second product film follows a subscription button into a course library, a lesson player, learning progress and a membership card, then returns to the opening screen.

1440 × 1440 · 60 fps · 1,320 frames · original 2D vector artwork · Remotion composition `Lume`.

[Watch or download the film](docs/lume/lume-1440-60.mp4).

The R$39 monthly price, course catalog, member name and learning metrics are illustrative. They are not a real offer or evidence of learning outcomes.

## Visual system

Cream, near-black and vivid blue carry the interface, with lime details in the course artwork. The covers are original vector compositions authored in [public/lume-art.js](public/lume-art.js), including a distinct illustration that develops inside the lesson player.

[Geist](https://vercel.com/font) supplies the typography. [Lucide](https://lucide.dev/) supplies interface icons drawn through Canvas Path2D. [Flubber](https://github.com/veltman/flubber) interpolates the plus, L+ emblem and returning button. The engine is [public/lume.js](public/lume.js); the browser preview is [public/lume.html](public/lume.html). Shared font, pointer and vector dependencies remain in `public/assets/`; their existing attribution is recorded in [ASSETS.md](ASSETS.md).

The camera, masks, cursor and shapes are functions of time, so the same moment can be rendered independently of playback history. Text and illustration details settle between the main movements.

## Edit and beat map

| Time    | Product action                                       |
| ------- | ---------------------------------------------------- |
| 0.00 s  | Subscription page and monthly plan                   |
| 3.00 s  | Pointer presses the subscription button              |
| 3.30 s  | Music opens and the course library arrives           |
| 6.80 s  | Selected course expands into the player              |
| 8.30 s  | Pointer presses play                                 |
| 9.30 s  | Player timeline becomes the progress view            |
| 12.30 s | Progress carries into the membership card            |
| 16.30 s | Card leads into the brand scene                      |
| 17.30 s | Plus transforms into the L+ emblem                   |
| 18.30 s | Brand tagline arrives                                |
| 20.30 s | Emblem returns to the opening subscription interface |

The measured music attacks are within 8 ms of the seven main musical anchors: 3.30, 6.80, 9.30, 12.30, 16.30, 18.30 and 20.30 seconds. Short selection sounds, two quiet confirmation chimes and brief transition effects support the interface actions.

## Audio and sources

The score is **Deep Urban by Eugenio Mininni**, selected from [Mixkit's house catalog](https://mixkit.co/free-stock-music/house/). It is retimed from a nominal 124 BPM to 120 BPM; the 22-second duration contains 44 beats. The final source WAV measures **−14.01 LUFS integrated and −2.07 dBTP**, at 48 kHz, stereo, 24-bit PCM. These are measurements of the WAV, not of a later AAC encode.

| Source                    | Official media URL                                                               | Use                               |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------- |
| Deep Urban                | [Mixkit 623](https://assets.mixkit.co/music/623/623.mp3)                         | Music bed                         |
| Select click              | [Mixkit 1109](https://assets.mixkit.co/active_storage/sfx/1109/1109-preview.mp3) | Subscription and course selection |
| Interface option select   | [Mixkit 2573](https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3) | Play button                       |
| Page forward single chime | [Mixkit 1107](https://assets.mixkit.co/active_storage/sfx/1107/1107-preview.mp3) | Activation and earned card        |
| Quick air woosh           | [Mixkit 2605](https://assets.mixkit.co/active_storage/sfx/2605/2605-preview.mp3) | Short transitions                 |

The effects were found on Mixkit's [interface](https://mixkit.co/free-sound-effects/interface/) and [woosh](https://mixkit.co/free-sound-effects/woosh/) pages. Music and effects have separate [Mixkit licenses](https://mixkit.co/license/). Mixkit's [music FAQ](https://mixkit.co/free-stock-music/?page=1) permits online advertisements, websites, social media and YouTube, with attribution appreciated but not required. Music is not licensed for TV/radio broadcasts, video games, CDs or DVDs. The [SFX page](https://mixkit.co/free-sound-effects/) permits commercial and personal projects.

Whooshes are cropped to 0.44 seconds and faded. The ending crossfades into the real musical pre-roll before the opening sample. Loudness processing runs over three repetitions and retains the middle cycle, followed by a measured constant gain correction. Downloads, source PCM and the standalone mixed WAV are excluded from Git.

## Reproduce

Run from the repository root. Requirements: Node.js, FFmpeg and ffprobe on PATH, plus Microsoft Edge for the Playwright export.

```sh
npm ci
node scripts/lume-audio.cjs
node scripts/server.cjs 4187
```

The audio command downloads any missing source MP3s from the five verified URLs above, prepares the mono SFX files and builds `public/assets/lume-mix.wav`. Existing source downloads and decoded SFX are reused. `--prepare-only` prepares sources without changing the final soundtrack; `--preview` writes `out/lume/audio-preview.wav` instead of the public mix.

Open [the local preview](http://127.0.0.1:4187/lume.html). Leave the server running, then use another terminal:

```sh
node scripts/lume-produce.cjs stills
node scripts/lume-produce.cjs transitions
node scripts/lume-produce.cjs audit
node scripts/lume-produce.cjs render
node scripts/lume-final-check.cjs
```

`stills` creates six scene images and `out/lume/storyboard.png`. `transitions` creates 24 images plus `out/lume/transitions.png`, covering the frame before, entrance, midpoint and settled frame of each main movement. `boundaries` is an alias for that mode.

The export is `out/lume/lume-1440-60.mp4`, using H.264 video and AAC audio. The renderer averages four temporal samples per frame, increasing to twelve during 3.30–4.10, 6.80–7.50, 9.30–10.05, 12.30–13.15, 16.30–16.95 and 20.30–21.75 seconds. Exposure is 0.42 frame. Endpoint samples use the actual time function; the renderer does not copy the first frame over the last.

For Remotion Studio, run `npx remotion studio --no-open` and select **Lume**. Studio uses the same scene engine and WAV; the production script adds the temporal sampling described above.

## Validation evidence

The latest source preflight scanned all 1,320 frames with no isolated jump candidates. Opening and closing frames matched exactly across all 1440 × 1440 RGBA pixels. All 48 full-resolution seek comparisons passed: 16 times replayed in forward, reverse and deterministic random order.

Matching endpoint SHA-256: `625e01c6f3f6d1984559ba9d71fabd648ff9b36a8c13daf27d396f5ff3c1c5ce`.

The finished MP4 was decoded and checked separately: 1440 × 1440, 60 fps, 1,320 frames, 22.000 seconds, H.264/AAC stereo at 48 kHz. All 1,320 decoded frames were scanned without isolated jump candidates. The encoded soundtrack measures **−14.03 LUFS / −1.71 dBTP**. Encoded endpoint thumbnails differ by a mean 0.0674 and a maximum 3 channel levels, consistent with the lossy encode. Remotion frame 510 also matched the browser canvas pixel for pixel.

Local evidence files:

- `out/lume/preflight.json`: full-resolution loop comparison, seek replay and source frame scan.
- `out/lume/audit-first.png` and `out/lume/audit-last.png`: source endpoint images.
- `out/lume/frame-scan.json`: production frame scan and media metadata, written by `render`.
- `out/lume/render.log`: encoder output, written by `render`.
- `out/lume/audio-cues.json`: source timing, cue positions, measured attacks and final WAV loudness.
- `out/lume/audio-sources.json`: research record, candidate comparison, source URLs, licenses and file hashes.

Published evidence: [source audit](docs/lume/preflight.json), [production frame scan](docs/lume/frame-scan.json), [decoded frame scan](docs/lume/encoded-scan.json), [audio cues](docs/lume/audio-cues.json), [media provenance](docs/lume/audio-sources.json), [encoded loudness](docs/lume/loudness.json), [transition contact sheet](docs/lume/transitions.png), and [encoded contact sheet](docs/lume/encoded-contact.png).

Source-pixel equality does not imply identical pixels after lossy H.264 compression. AAC encoding can also change measured loudness and peaks slightly; verify the delivered MP4 separately. The source audit is not a claim that every future render or later edit passes.
