# Órbita — seu próximo destino

Second motion study: a fictional travel-planning product, inspired by Madeira's Atlantic coast. The original Forma film remains available.

22 seconds · 1440 × 1440 · 60 fps · 2D canvas · composition `Orbita`.

[Download the finished video](docs/orbita/orbita-1440-60.mp4).

Export verified: 22.000 seconds, 1320 frames, H.264/AAC, −14.0 LUFS integrated and −1.1 dBFS true peak. The source frame scan found no isolated jump candidates; opening and closing frame hashes match. Out-of-order seeking reproduced the same pixels. Remotion composition rendering and TypeScript/ESLint checks passed.

Reports: [frame scan](docs/orbita/frame-scan.json), [seek audit](docs/orbita/preflight.json), [loudness](docs/orbita/loudness.txt), [exported frame contact sheet](docs/orbita/final-contact.png).

## Continuity and fluidity

- Six principal visual stages instead of the original's more densely packed interactions.
- Morphs last 1.3–2.7 seconds. Quintic easing gives zero velocity and acceleration at settled handoffs, without spring overshoot.
- The search field grows into the destination card. The route endpoint grows into the boarding pass. The pass becomes the orbital mark.
- Camera position and logarithmic zoom are deterministic functions of time. The cursor uses the same curve as the route endpoint while dragging.
- Ticket typography scales with its parent shape before dissolving, keeping letters inside the card during the fold.
- Eight temporal samples per frame, twelve through the traveling transition; 0.42-frame exposure.
- All 1320 adjacent frames are scanned. A lightly filtered analysis thumbnail avoids false spikes from downsampling thin edges; the delivered frames are not blurred by that analysis filter.
- Deterministic seeking is checked out of order. The opening and closing source frames are compared.

## Edit map

| Time | Motion |
|---|---|
| 0–2.3 s | Search field; pointer selects Madeira |
| 2.3–6.15 s | Field expands into coastal destination card |
| 6.15–7.8 s | Dark circular reveal; card becomes route panel |
| 7.8–10.8 s | Pointer follows the curved route from Lisboa to Madeira |
| 10.8–14 s | Endpoint expands into a boarding pass |
| 14–15.7 s | Pass contracts continuously into an orange disc |
| 15.7–18.5 s | Disc opens into an orbit; Órbita wordmark appears |
| 18.5–22 s | Light returns; orbital symbol becomes the search field |

The map is a schematic graphic, not a geographic map or a real ticket.

## Run and render

```sh
npm ci
node scripts/download-audio.cjs
node scripts/orbita-audio.cjs
node scripts/server.cjs 4187
```

Open `http://127.0.0.1:4187/orbita.html`. In another terminal:

```sh
node scripts/orbita-produce.cjs stills
node scripts/orbita-produce.cjs audit
node scripts/orbita-produce.cjs render
```

Output: `out/orbita/orbita-1440-60.mp4`.

For Remotion Studio: `npx remotion studio --no-open`, then select **Orbita**.

## Artwork and audio

The Madeira-inspired photograph was generated with the built-in image tool and copied into `public/assets/orbita-madeira.png`. No model version was exposed. Prompt:

> Create a square fine-art travel editorial photograph for a premium fictional travel app called ORBITA, but no text or logos. A dramatic Madeira-inspired Atlantic island coastline seen from a high coastal lookout: immense lush green ridges descend diagonally from upper left into a deep cobalt ocean, pale surf traces a beautifully sinuous coastline from lower left toward distant upper right. Soft early morning apricot light on the cliffs, delicate atmospheric mist in the distant ridges, natural muted greens, rich blue sea. Restrained cinematic analog medium-format photography, elegant spacious composition with the right third mostly uninterrupted blue ocean, fine natural texture and realistic geology. No people, no hotels, no boats, no roads in foreground, no watermark, no borders, no typography. High photographic detail, no fantasy landscape, no glow effects.

Head Bang by Arulo and Mixkit effects are remixed with fewer accents, gentler filtering transitions and a short tail blend. The soundtrack opens at 6.15 seconds. The isolated audio mix is excluded from Git; licenses and cursor/font attribution are in `ASSETS.md`.
