# Órbita — seu próximo destino

Second motion study: a fictional travel-planning product, inspired by Madeira's Atlantic coast. This refined edition adds original vector illustrations, stronger object continuity and musical timing measured from the soundtrack, with art, illustration and audio contributions from GPT-6 Astra. The original Forma film remains available.

22 seconds · 1440 × 1440 · 60 fps · 2D canvas · composition `Orbita`.

[Download the refined video](docs/orbita/orbita-refined-1440-60.mp4). The [previous dynamic edition](docs/orbita/orbita-dynamic-1440-60.mp4) remains available for comparison.

Export verified: 22.000 seconds, 1320 frames, H.264/AAC, −14.4 LUFS integrated and −1.1 dBFS true peak after AAC encoding (−14 LUFS normalization target). The source frame scan found no isolated jump candidates; opening and closing frame hashes match. Out-of-order seeking reproduced the same pixels. Remotion composition rendering and TypeScript/ESLint checks passed.

Reports: [frame scan](docs/orbita/frame-scan.json), [seek audit](docs/orbita/preflight.json), [loudness](docs/orbita/loudness.txt), [exported frame contact sheet](docs/orbita/final-contact.png).

## Continuity and fluidity

- Primary transitions last 0.48–0.9 seconds, alternating with short reading pauses and staggered content entrances. The longer route movement lasts 1.72 seconds.
- Quintic easing gives zero velocity and acceleration at settled handoffs, without spring overshoot.
- The search field grows into a photographic destination card. The route endpoint grows into a detailed boarding pass, which travels into an itinerary. Its confirmation launches the compass mark.
- Camera position and logarithmic zoom are deterministic functions of time. The cursor releases the airplane so the flight remains unobstructed, then returns to confirm the boarding pass.
- The photo-to-map handoff uses an opaque circular mask on aligned surfaces, preventing ghost text from overlapping layouts.
- Boarding information reveals in sequence, with ticket notches, a masked barcode and a drawn confirmation check.
- Three custom vector miniatures depict a mountain, volcanic pools and a ceramic plate. The compass physically becomes the search surface at the end.
- Export-time anchors align the itinerary, brand arrival and return with measured musical attacks at 10.440, 14.805 and 19.180 seconds.
- Lucide SVG paths are drawn directly in canvas using Path2D, retaining sharp vector edges at output resolution.
- Four temporal samples per frame, twelve through the three fastest traveling transitions; 0.42-frame exposure.
- All 1320 adjacent frames are scanned. A lightly filtered analysis thumbnail avoids false spikes from downsampling thin edges; the delivered frames are not blurred by that analysis filter.
- Deterministic seeking is checked out of order. The opening and closing source frames are compared.

## Edit map

| Time | Motion |
|---|---|
| 0–1.15 s | Search field; pointer selects Madeira |
| 1.15–3.9 s | Field expands into a photographic destination card |
| 3.9–5.0 s | Music opens; circular reveal and fast travel to the map |
| 5.0–7.1 s | Airplane follows Lisboa to Madeira |
| 7.1–10.44 s | Endpoint becomes a boarding pass; details reveal and confirmation draws |
| 10.44–14.33 s | Pass becomes an itinerary; three illustrated activity cards enter |
| 14.33–14.805 s | Confirmation carries the camera into the brand scene |
| 14.805–19.18 s | Disc becomes compass; enlarged wordmark and editorial verbs enter |
| 19.18–22 s | Compass becomes the search surface and its aperture becomes the lens |

Coastlines use Natural Earth 1:50m data through world-atlas and D3 Geo. The route curve, boarding pass, date and itinerary are illustrative product content.

## SVG libraries

- [Lucide](https://lucide.dev/): 18 consistent SVG icons, preserved as source SVGs and parsed into canvas paths.
- [D3 Geo](https://d3js.org/d3-geo) + [world-atlas](https://github.com/topojson/world-atlas): projected coastlines, country borders, geographic endpoints and grid.
- [Flubber](https://github.com/veltman/flubber): continuous circle-to-compass shape interpolation. The bundled UMD global reference is adapted to globalThis for ES module loading.

Rebuild the committed vector assets with `node scripts/orbita-vectors.mjs`. License files are included in `public/assets/orbita-vectors/`.

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

Output: `out/orbita/orbita-refined-1440-60.mp4`.

For Remotion Studio: `npx remotion studio --no-open`, then select **Orbita**.

## Artwork and audio

The Madeira-inspired photograph was generated with the built-in image tool and copied into `public/assets/orbita-madeira.png`. No model version was exposed. Prompt:

> Create a square fine-art travel editorial photograph for a premium fictional travel app called ORBITA, but no text or logos. A dramatic Madeira-inspired Atlantic island coastline seen from a high coastal lookout: immense lush green ridges descend diagonally from upper left into a deep cobalt ocean, pale surf traces a beautifully sinuous coastline from lower left toward distant upper right. Soft early morning apricot light on the cliffs, delicate atmospheric mist in the distant ridges, natural muted greens, rich blue sea. Restrained cinematic analog medium-format photography, elegant spacious composition with the right third mostly uninterrupted blue ocean, fine natural texture and realistic geology. No people, no hotels, no boats, no roads in foreground, no watermark, no borders, no typography. High photographic detail, no fantasy landscape, no glow effects.

Head Bang by Arulo and Mixkit effects are retimed to measured musical attacks. The soundtrack opens at 3.9 seconds. Whoosh tails are trimmed and faded so consecutive gestures remain distinct. The ending blends into the actual pre-roll immediately preceding the first sample; loudness processing runs over three repeated cycles and exports the middle one to preserve continuity. The isolated audio mix is excluded from Git; licenses and cursor/font attribution are in `ASSETS.md`.
