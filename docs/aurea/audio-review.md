# AUREA audio review

The 22-second mix measures -14.00 LUFS integrated and -1.72 dBTP. It contains exactly 1056000 stereo sample frames at 48 kHz in 24-bit PCM.

Deep Urban by Eugenio Mininni is reused from the verified local Mixkit source. Bass is reduced by 4 dB around 150 Hz, sub-bass below 45 Hz is removed, and upper frequencies are softened. The introduction opens from 3.14 to 3.30 seconds. These are intentional editorial changes, not a diagnosis of a defective source.

Eight filtered effects are placed by their measured transient peaks. The hover is quieter than all primary clicks; fabric and return sweeps are short. The brand chime is an editorial accent and does not imply a received WhatsApp message or completed order. Cue gains and measured peak positions are in audio-cues.json.

Mastering: loudnorm on three repeated cycles, retained middle cycle, then constant gain; final constant gain 0.240 dB. Loop closure uses actual pre-roll and preserves beat phase. Its boundary sample steps remain within adjacent changes measured near the seam.

Checks completed: source SHA-256, exact duration/sample count, sample rate/channels, integrated loudness, true peak, eight isolated cue peak positions and seam sample continuity. This is measured QA; no subjective listening claim is made. The final AAC/MP4 must be measured separately.

[Music source](https://mixkit.co/free-stock-music/house/) · [Interface effects](https://mixkit.co/free-sound-effects/interface/) · [Whoosh effects](https://mixkit.co/free-sound-effects/woosh/) · [Music license](https://mixkit.co/license/modal/musicFree/) · [SFX license](https://mixkit.co/license/modal/sfxFree/)

Reproduce with `node scripts/aurea-audio.cjs`. Requires Node.js 18+, ffmpeg and ffprobe. The script downloads only missing sources from the official URLs recorded in audio-sources.json into the ignored raw/lume cache, rejects HTTP errors, non-audio data and SHA-256 mismatches, and preserves existing sources. Run `node scripts/aurea-audio.cjs --sources-only` to prepare/verify the cache without rewriting the final WAV. No raw sources are copied into public assets or documentation.

Reproduction check: JavaScript syntax passed; `--sources-only` verified all five cached sources. A separate temporary download of official Mixkit effect 1109 matched the recorded SHA-256 and passed MP3 stream validation. Temporary test data was removed. Final WAV hash and modification time were unchanged; no mix was re-encoded during video export.

## Final encoded audio and technical approval

Approved for the measured technical audio criteria. The delivered MP4 SHA-256 is `6af92781a033615a523dff3b3686d14beab2ea662def588e621048d308555aa3`. Independent ffprobe confirms 1080 x 1920, 60 fps, 1,320 frames, 22 seconds, H.264 video and 48 kHz stereo AAC. Independent decoded-AAC loudness measurement confirms -14.03 LUFS integrated and -1.53 dBTP; both meet the -14 +/- 0.2 LUFS and <= -1 dBTP targets.

Both tracks decode to 1,056,000 stereo sample frames over 22 seconds. Waveform correlation was sampled every eight frames across the tracks, with offsets searched from -48 to +48 samples. Best correlation occurs at zero sample offset (0.999801 correlation); all eight cue windows exceed 0.99988 correlation. This confirms track timing through encoding; the cue peak measurements in audio-cues.json refer to the isolated filtered effects before dynamic mastering.

The WAV hash matches both cue and source ledgers; all five local source hashes match their official Mixkit records. The public reproduction script uses the committed ledger, fetches only missing official sources, validates MP3/SHA-256 and preserves cached files. No tracked raw source audio was found in raw/, public/assets/aurea/audio/ or docs/aurea/. Earlier sources-only and isolated download tests remain the reproduction evidence.

No audio or technical blocker was found. This approval covers encoded measurements, source provenance and timing; it does not claim a subjective listening test or replace the separate visual review. The WAV, MP4, engine and assets were not modified.
