// Lume+: deterministic, authored cover artwork in a 360 x 480 design space.
const C = {
  cream: "#f4f2ed",
  ink: "#17181c",
  blue: "#3259ff",
  lime: "#dbedbc",
  silver: "#c8ccd6",
};
const clamp = (p) => Math.max(0, Math.min(1, p));
const ease = (p) => 1 - (1 - clamp(p)) ** 3;
function shape(c, d, color, width = 0) {
  const path = new Path2D(d);
  if (width) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke(path);
  } else {
    c.fillStyle = color;
    c.fill(path);
  }
}
function rect(c, x, y, w, h, color) {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}
function disc(c, x, y, r, color) {
  c.beginPath();
  c.arc(x, y, r, 0, 2 * Math.PI);
  c.fillStyle = color;
  c.fill();
}
function type(c, text, x, y, size, color, weight = 800) {
  c.font = `${weight} ${size}px Geist, Arial, sans-serif`;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillStyle = color;
  c.fillText(text, x, y);
}
function topRule(c, number, color) {
  type(c, number, 25, 35, 13, color, 600);
  shape(c, "M58 30 L303 30", color, 1);
  c.save();
  c.translate(328, 29);
  c.scale(0.16, 0.16);
  emblem(c, color, 1);
  c.restore();
}

function design(c, p) {
  rect(c, 0, 0, 360, 480, C.cream);
  topRule(c, "01", C.ink);
  // Condensed display by geometric transform, not an external font dependency.
  c.save();
  c.translate(21, 112);
  c.scale(0.855, 1);
  type(c, "DESIGN", 0, 0, 80, C.ink, 900);
  c.restore();
  const q = ease(p);
  c.save();
  c.translate(24, 142 + (1 - q) * 16);
  const cell = 104;
  rect(c, 0, 0, 312, 284, C.blue);
  // The two large opposing arcs form a shared negative-space diagonal.
  c.save();
  c.beginPath();
  c.rect(0, 0, 208, 208);
  c.clip();
  disc(c, 0, 208, 208, C.cream);
  disc(c, 0, 208, 104, C.ink);
  c.restore();
  rect(c, 208, 0, cell, cell, C.ink);
  c.save();
  c.translate(260, 52);
  c.rotate((1 - q) * -0.28);
  // A cropped geometric bloom, with a square counter, avoids stock icon forms.
  for (let i = 0; i < 4; i++) {
    c.save();
    c.rotate((i * Math.PI) / 2);
    shape(c, "M0 0 C-35 -4 -44 -35 -22 -42 C-2 -47 6 -19 0 0 Z", C.lime);
    c.restore();
  }
  rect(c, -7, -7, 14, 14, C.ink);
  c.restore();
  rect(c, 208, 104, 104, 104, C.cream);
  // Architectural comb: weight is maintained even in small course cards.
  for (let i = 0; i < 4; i++) rect(c, 220 + i * 22, 104, 11, 104, C.ink);
  rect(c, 0, 208, 104, 76, C.ink);
  disc(c, 52, 246, 27, C.blue);
  rect(c, 104, 208, 208, 76, C.lime);
  shape(
    c,
    "M125 261 L182 225 L182 246 L209 229 L209 248 L270 220 L270 235 L288 226 L288 248 L125 275 Z",
    C.ink,
  );
  c.restore();
  shape(c, "M25 449 L275 449", C.ink, 1);
  shape(c, "M302 449 L332 449 M324 441 L332 449 L324 457", C.blue, 2.2);
}

function ideas(c, p) {
  rect(c, 0, 0, 360, 480, C.ink);
  topRule(c, "02", C.cream);
  type(c, "IDEIAS", 22, 115, 81, C.cream, 850);
  // A frontal, planar architecture: three stacked ambitions, no perspective.
  const q = ease(p);
  const tiers = [
    { x: 25, y: 306, w: 103, h: 118, color: C.cream, opening: C.ink },
    { x: 126, y: 230, w: 103, h: 194, color: C.blue, opening: C.ink },
    { x: 227, y: 153, w: 107, h: 271, color: C.lime, opening: C.ink },
  ];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    c.save();
    c.translate(0, (1 - ease((p - i * 0.06) / (1 - i * 0.06))) * 22);
    rect(c, t.x, t.y, t.w, t.h, t.color);
    // A pair of large arched counters reads as structural, even at thumbnail size.
    const archTop = t.y + 31;
    for (let j = 0; j < 2; j++) {
      const ax = t.x + 18 + j * 39;
      shape(
        c,
        `M${ax} ${t.y + t.h} L${ax} ${archTop + 14} A14 14 0 0 1 ${ax + 28} ${archTop + 14} L${ax + 28} ${t.y + t.h} Z`,
        t.opening,
      );
    }
    // Solid horizontal beams create one coherent shared construction.
    for (let by = t.y + 87; by < 410; by += 66)
      rect(c, t.x, by, t.w, 16, t.color);
    c.restore();
  }
  // Offset blue lintels and a floating cream slab suggest expansion.
  rect(c, 15, 293 + (1 - q) * 10, 113, 13, C.blue);
  rect(c, 117, 217 + (1 - q) * 10, 112, 13, C.cream);
  rect(c, 217, 140 + (1 - q) * 10, 117, 13, C.blue);
  rect(c, 25, 424, 309, 9, C.silver);
  // Three isolated steps lead the eye upward through the negative space.
  rect(c, 31, 223, 38, 15, C.lime);
  rect(c, 75, 190, 38, 15, C.lime);
  rect(c, 119, 157, 38, 15, C.lime);
  shape(c, "M25 456 L275 456", C.cream, 1);
  shape(c, "M302 456 L332 456 M324 448 L332 456 L324 464", C.lime, 2.2);
}
function technology(c, p) {
  rect(c, 0, 0, 360, 480, C.blue);
  topRule(c, "03", C.cream);
  c.save();
  c.translate(22, 100);
  c.scale(0.92, 1);
  type(c, "TECNOLOGIA", 0, 0, 43, C.cream, 850);
  c.restore();
  const q = ease(p);
  c.save();
  c.translate((1 - q) * 12, 0);
  // Three nested quarter-turn bands: a physical circuit with an open central core.
  shape(c, "M-25 163 L159 163 C249 163 321 235 321 325 L321 449", C.ink, 65);
  shape(c, "M-25 163 L159 163 C249 163 321 235 321 325 L321 449", C.cream, 43);
  shape(c, "M-25 239 L129 239 C194 239 247 292 247 357 L247 449", C.ink, 65);
  shape(c, "M-25 239 L129 239 C194 239 247 292 247 357 L247 449", C.lime, 43);
  shape(c, "M-25 315 L99 315 C139 315 172 348 172 388 L172 449", C.ink, 65);
  shape(c, "M-25 315 L99 315 C139 315 172 348 172 388 L172 449", C.silver, 43);
  // Broad terminals, with perpendicular dark breaks, read as circuitry, not ornament.
  rect(c, 52, 141, 14, 44, C.blue);
  rect(c, 104, 217, 14, 44, C.blue);
  rect(c, 22, 293, 14, 44, C.blue);
  rect(c, 299, 370, 44, 13, C.blue);
  rect(c, 225, 403, 44, 13, C.blue);
  // A sculpted square processor counterbalances the open lower-left area.
  rect(c, 27, 370, 73, 61, C.ink);
  rect(c, 44, 386, 39, 29, C.blue);
  for (let i = 0; i < 3; i++) {
    rect(c, 37 + i * 21, 360, 8, 10, C.cream);
    rect(c, 37 + i * 21, 431, 8, 10, C.cream);
  }
  c.restore();
  rect(c, 0, 451, 360, 29, C.blue);
  shape(c, "M25 466 L335 466", C.cream, 1);
}

function emblem(c, color, p) {
  const q = ease(p);
  // Bespoke L has a softened inside turn and a forward-cut baseline.
  shape(
    c,
    "M-42 -42 L-18 -42 L-18 13 Q-18 18 -13 18 L18 18 L6 42 L-42 42 Z",
    color,
  );
  c.save();
  c.translate(22, -20);
  c.scale(0.8 + 0.2 * q, 0.8 + 0.2 * q);
  shape(
    c,
    "M-10 -23 L10 -23 L10 -10 L23 -10 L23 10 L10 10 L10 23 L-10 23 L-10 10 L-23 10 L-23 -10 L-10 -10 Z",
    color,
  );
  c.restore();
}

/** Centered L+ mark. No background or external shadow. */
export function drawEmblem(c, x, y, size, p = 1) {
  c.save();
  c.translate(x, y);
  c.scale(size / 100, size / 100);
  emblem(c, C.blue, clamp(p));
  c.restore();
}

/** Centered cover, naturally clipped to a 22px corner radius. */
export function drawCover(c, index, x, y, w, h, p = 1) {
  if (!(w > 0 && h > 0)) return;
  c.save();
  c.translate(x - w / 2, y - h / 2);
  c.beginPath();
  c.roundRect(0, 0, w, h, Math.min(22, w / 2, h / 2));
  c.clip();
  c.scale(w / 360, h / 480);
  c.lineCap = "butt";
  c.lineJoin = "round";
  [design, ideas, technology][((index % 3) + 3) % 3](c, clamp(p));
  c.restore();
}

/**
 * Reframe the DESIGN cover into its lesson artwork. x/y are the full player
 * centre, not the body centre. At zero this delegates to drawCover exactly.
 * At one the 312 x 284 mosaic is fitted uniformly between player chrome:
 * header 148/850 of h, footer 155/850 of h, and a small internal breathing gap.
 */
export function drawLesson(c, x, y, w, h, morph = 1) {
  if (!(w > 0 && h > 0)) return;
  const m = clamp(morph);
  if (m === 0) {
    drawCover(c, 0, x, y, w, h, 1);
    return;
  }
  const header = h * (148 / 850);
  const footer = h * (155 / 850);
  const gutter = Math.min(w, h) * 0.022;
  const bodyW = w - gutter * 2;
  const bodyH = h - header - footer - gutter * 2;
  const fittedScale = Math.min(bodyW / 312, bodyH / 284);
  const destinationX = (w - 312 * fittedScale) / 2 - 24 * fittedScale;
  const destinationY =
    header + gutter + (bodyH - 284 * fittedScale) / 2 - 142 * fittedScale;
  c.save();
  c.translate(x - w / 2, y - h / 2);
  c.beginPath();
  c.roundRect(0, 0, w, h, Math.min(22, w / 2, h / 2));
  c.clip();
  rect(c, 0, 0, w, h, C.cream);
  c.translate(destinationX * m, destinationY * m);
  c.scale(
    w / 360 + (fittedScale - w / 360) * m,
    h / 480 + (fittedScale - h / 480) * m,
  );
  // Animate the source viewport as well as the mapping. At the endpoint no
  // typography from the outer cover can leak into the cream letterboxing.
  c.beginPath();
  c.rect(24 * m, 142 * m, 360 - 48 * m, 480 - 196 * m);
  c.clip();
  c.lineCap = "butt";
  c.lineJoin = "round";
  design(c, 1);
  c.restore();
}
