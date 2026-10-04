import "./assets/orbita-vectors/flubber.min.js";
import { drawMiniature } from "./orbita-illustrations.js";
export const W = 1440,
  H = 1440,
  FPS = 60,
  DURATION = 22;
const C = {
  paper: "#f3f1e9",
  white: "#fffef9",
  ink: "#102b39",
  navy: "#092532",
  sea: "#173b4c",
  orange: "#ff8953",
  muted: "#8ca6af",
};
const clamp = (x) => Math.max(0, Math.min(1, x)),
  mix = (a, b, p) => a + (b - a) * p;
// Fast acceleration, a short settling tail, no overshoot.
export const smooth = (x) => {
  x = clamp(x);
  return x * x * x * (x * (6 * x - 15) + 10);
};
const E = (t, a, d) => smooth((t - a) / d),
  fade = (t, a, d) => E(t, a + d * 0.4, d * 0.6);
// Export-time anchors follow measured musical transients; design time remains editable.
const beatAnchors = [
  [0, 0],
  [3.9, 3.9],
  [5, 5.05],
  [7.1, 7.05],
  [10.44, 10.65],
  [14.33, 14.15],
  [14.805, 15.05],
  [19.18, 19.45],
  [21.25, 21.25],
  [22, 22],
];
function designTime(time) {
  for (let i = 1; i < beatAnchors.length; i++) {
    const [a, x] = beatAnchors[i - 1],
      [b, y] = beatAnchors[i];
    if (time <= b) return mix(x, y, clamp((time - a) / (b - a)));
  }
  return 22;
}
function lerpColor(a, b, p) {
  const v = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = v(a),
    y = v(b);
  return `rgb(${x.map((n, i) => Math.round(mix(n, y[i], p))).join(",")})`;
}
function rr(c, x, y, w, h, r, col) {
  if (w < 0.01 || h < 0.01) return;
  c.beginPath();
  c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
  c.fillStyle = col;
  c.fill();
}
function disk(c, x, y, r, col) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col;
  c.fill();
}
function ring(c, x, y, r, col, width = 2) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.strokeStyle = col;
  c.lineWidth = width;
  c.stroke();
}
function line(c, points, col, width = 2) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = col;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke();
}
function text(
  c,
  str,
  x,
  y,
  size = 30,
  col = C.ink,
  weight = 500,
  align = "left",
) {
  c.fillStyle = col;
  c.font = `${weight} ${size}px Geist`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(str, x, y);
}
function alpha(c, v, fn) {
  if (v <= 0.00001) return;
  c.save();
  c.globalAlpha *= clamp(v);
  fn();
  c.restore();
}
function iconPaths(svg) {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  return [...doc.documentElement.children].map((el) => {
    const p = new Path2D(),
      n = (k) => +el.getAttribute(k);
    if (el.tagName === "path") return new Path2D(el.getAttribute("d"));
    if (el.tagName === "circle")
      p.arc(n("cx"), n("cy"), n("r"), 0, Math.PI * 2);
    if (el.tagName === "rect")
      p.roundRect(n("x"), n("y"), n("width"), n("height"), n("rx"));
    if (el.tagName === "line") {
      p.moveTo(n("x1"), n("y1"));
      p.lineTo(n("x2"), n("y2"));
    }
    if (["polyline", "polygon"].includes(el.tagName)) {
      el.getAttribute("points")
        .trim()
        .split(/[ ,]+/)
        .map(Number)
        .reduce((a, v, i, arr) => {
          if (i % 2 === 0) {
            if (i) p.lineTo(v, arr[i + 1]);
            else p.moveTo(v, arr[i + 1]);
          }
          return a;
        }, 0);
      if (el.tagName === "polygon") p.closePath();
    }
    return p;
  });
}
export async function loadAssets(base = "./assets/") {
  const vectors = await (
    await fetch(base + "orbita-vectors/vectors.json")
  ).json();
  const images = await Promise.all(
    ["orbita-madeira.png", "macos-pointer.png"].map(
      (name) =>
        new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = reject;
          im.src = base + name;
        }),
    ),
  );
  const font = new FontFace(
    "Geist",
    `url(${base}geist-latin-wght-normal.woff2)`,
  );
  await font.load();
  document.fonts.add(font);
  return {
    photo: images[0],
    pointer: images[1],
    vectors,
    icons: Object.fromEntries(
      Object.entries(vectors.icons).map(([n, s]) => [n, iconPaths(s)]),
    ),
  };
}
export function createRenderer(canvas, assets) {
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d", { alpha: false }),
    v = assets.vectors;
  const land = new Path2D(v.land),
    borders = new Path2D(v.borders),
    grid = new Path2D(v.grid);
  const compass =
    "M0,-100 L27,-27 L100,0 L27,27 L0,100 L-27,27 L-100,0 L-27,-27 Z";
  const morph = globalThis.flubber.fromCircle(0, 0, 88, compass, {
    maxSegmentLength: 5,
  });
  function icon(name, x, y, size = 36, col = C.ink, width = 1.7, rotation = 0) {
    c.save();
    c.translate(x, y);
    c.rotate(rotation);
    c.scale(size / 24, size / 24);
    c.translate(-12, -12);
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = col;
    for (const p of assets.icons[name] || []) c.stroke(p);
    c.restore();
  }
  function plate(x, y, w, h, r, col, shadow = 1) {
    c.save();
    c.shadowColor = `rgba(0,16,24,${0.16 * shadow})`;
    c.shadowBlur = 36 * shadow;
    c.shadowOffsetY = 16 * shadow;
    rr(c, x, y, w, h, r, col);
    c.restore();
  }
  function clipped(x, y, w, h, r, fn) {
    c.save();
    c.beginPath();
    c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
    c.clip();
    fn();
    c.restore();
  }
  function pill(label, x, y, w, iconName, col = C.white, bg = "#ffffff20") {
    rr(c, x, y, w, 55, 27, bg);
    if (iconName) icon(iconName, x - w / 2 + 30, y, 25, col);
    text(c, label, x + (iconName ? 12 : 0), y, 23, col, 500, "center");
  }
  function route(p) {
    const [sx, sy] = v.lis,
      [ex, ey] = v.fnc,
      q = 1 - p;
    return {
      x: q * q * sx + 2 * q * p * (sx - 320) + p * p * ex,
      y: q * q * sy + 2 * q * p * (sy + 30) + p * p * ey,
    };
  }
  const end = route(1),
    ticketOrigin = { x: 1600 + end.x, y: end.y };
  function camera(t) {
    const map = E(t, 3.9, 0.85),
      pass = E(t, 7.05, 0.9),
      wallet = E(t, 10.65, 0.8),
      brand = E(t, 14.15, 0.9),
      ret = E(t, 19.45, 1.8);
    let x =
        1600 * map +
        (ticketOrigin.x - 1600) * pass +
        (3750 - ticketOrigin.x) * wallet +
        1150 * brand,
      y = (end.y + 65) * pass - (end.y + 65) * wallet;
    let log =
      Math.log(1.02) * E(t, 1.15, 0.6) +
      Math.log(0.95 / 1.02) * map +
      Math.log(1.06 / 0.95) * pass +
      Math.log(0.97 / 1.06) * wallet +
      Math.log(1 / 0.97) * brand;
    return { x: x * (1 - ret), y: y * (1 - ret), z: Math.exp(log * (1 - ret)) };
  }
  function search(t, closing = false) {
    const p = closing ? 0 : E(t, 1.15, 0.62),
      ret = E(t, 19.45, 1.8),
      x = closing ? 4900 * (1 - ret) : 1600 * E(t, 3.9, 0.85),
      y = 0;
    const s = closing ? E(t, 19.55, 0.75) : 1,
      w = closing
        ? mix(180, 1050, s)
        : mix(mix(1050, 1150, p), 1220, E(t, 3.9, 0.85)),
      h = closing ? mix(180, 144, s) : mix(144, 1120, p),
      r = mix(72, 38, p);
    plate(x, y, w, h, r, C.white);
    if (closing) {
      alpha(c, E(t, 20.2, 0.5), () => fieldContents(x, y, false));
      return;
    }
    alpha(c, 1 - E(t, 1.15, 0.32), () => fieldContents(x, y, t > 0.5, t));
    if (p > 0)
      clipped(x, y, w, h, r, () => {
        alpha(c, fade(t, 1.15, 0.62), () => {
          c.save();
          c.translate(x, 0);
          const zoom = 1.04 + 0.065 * E(t, 1.8, 2.05);
          c.save();
          c.translate(0, -75);
          c.scale(zoom, zoom);
          c.drawImage(assets.photo, -575, -575, 1150, 1150);
          c.restore();
          const shade = c.createLinearGradient(0, -220, 0, 560);
          shade.addColorStop(0, "#05192300");
          shade.addColorStop(1, "#051923f2");
          c.fillStyle = shade;
          c.fillRect(-575, -560, 1150, 1120);
          pill("PORTUGAL", -369, -458, 230, "map-pin");
          pill("24°", 413, -458, 154, "sun");
          alpha(c, E(t, 1.65, 0.4), () => {
            text(c, "O mundo", -474, 173, 55, C.white, 450);
            text(c, "te espera.", -480, 270, 126, C.white, 650);
          });
          alpha(c, E(t, 2.2, 0.42), () => {
            text(c, "MADEIRA", -470, 400, 26, "#e7e6df", 600);
            text(c, "32° 39′ N / 16° 55′ W", -470, 449, 22, "#b6c8ca", 450);
            rr(c, 408, 402, 124, 124, 31, C.orange);
            icon("arrow-up-right", 408, 402, 55, C.ink, 1.5);
          });
          c.restore();
        });
      });
  }
  function fieldContents(x, y, typed, t = 0) {
    icon("search", x - 444, y, 36, C.ink);
    const n = Math.floor(clamp((Math.floor(t * 18) / 18 - 0.5) / 0.5) * 7);
    text(
      c,
      typed ? "Madeira".slice(0, n) : "Para onde vamos?",
      x - 369,
      y,
      42,
      C.ink,
      500,
    );
    rr(c, x + 433, y, 104, 104, 31, C.orange);
    icon("arrow-up-right", x + 433, y, 42, C.ink);
  }
  function mapScene(t) {
    const arrive = E(t, 3.9, 0.85),
      gone = E(t, 7.05, 0.85),
      x = 1600 * arrive;
    alpha(c, 1 - gone, () => {
      c.save();
      const mask = E(t, 3.98, 0.57);
      if (mask < 1) {
        c.beginPath();
        c.arc(x + 408, 402, mask * 1550, 0, Math.PI * 2);
        c.clip();
      }
      plate(x, 0, mix(1150, 1220, arrive), 1120, 40, C.sea);
      clipped(x, 0, mix(1150, 1220, arrive), 1120, 40, () => {
        c.save();
        c.translate(x, 65);
        c.strokeStyle = "#244959";
        c.lineWidth = 1;
        c.stroke(grid);
        c.fillStyle = "#355766";
        c.fill(land);
        c.strokeStyle = "#557481";
        c.lineWidth = 1.5;
        c.stroke(land);
        c.strokeStyle = "#52717e";
        c.lineWidth = 1;
        c.stroke(borders);
        text(c, "ATLANTIC", -495, -135, 22, "#72939e", 500);
        text(c, "OCEAN", -495, -102, 22, "#72939e", 500);
        const pts = [];
        for (let i = 0; i <= 80; i++) {
          const q = route(i / 80);
          pts.push([q.x, q.y]);
        }
        c.setLineDash([4, 13]);
        line(c, pts, "#bad0d64a", 3);
        c.setLineDash([]);
        const prog = E(t, 5.05, 1.72),
          path = [];
        for (let i = 0; i <= 80; i++) {
          const q = route((prog * i) / 80);
          path.push([q.x, q.y]);
        }
        if (prog > 0) line(c, path, C.orange, 8);
        ring(c, v.lis[0], v.lis[1], 13, C.white, 4);
        disk(c, v.lis[0], v.lis[1], 4, C.white);
        text(c, "LISBOA", v.lis[0] + 30, v.lis[1] - 16, 27, C.white, 600);
        text(c, "LIS", v.lis[0] + 30, v.lis[1] + 23, 19, C.muted, 450);
        const q = route(prog);
        alpha(c, 1 - E(t, 6.6, 0.4), () => {
          rr(c, q.x, q.y, 68, 68, 34, C.orange);
          const next = route(Math.min(1, prog + 0.01)),
            angle = Math.atan2(next.y - q.y, next.x - q.x) + Math.PI / 4;
          icon("plane", q.x, q.y, 39, C.ink, 1.6, angle);
        });
        alpha(c, E(t, 5.5, 0.4), () => {
          ring(c, end.x, end.y, 27, C.orange, 3);
          text(c, "MADEIRA", end.x + 45, end.y - 12, 29, C.white, 600);
          text(
            c,
            t < 6.77 ? "FNC · ILHA DA MADEIRA" : "Você chegou.",
            end.x + 45,
            end.y + 27,
            22,
            C.muted,
            450,
          );
        });
        c.restore();
        rr(c, x, -437, 1130, 163, 23, C.navy);
        icon("navigation", x - 496, -437, 44, C.orange);
        text(c, "Seu próximo destino.", x - 435, -454, 44, C.white, 600);
        text(c, "LISBOA  →  MADEIRA", x - 435, -400, 22, C.muted, 500);
        pill("01h 45", x + 401, -437, 183, "clock-3");
      });
      c.restore();
    });
  }
  function ticketState(t) {
    const expand = E(t, 7.05, 0.78),
      move = E(t, 10.65, 0.8);
    return {
      x: mix(ticketOrigin.x, 3750, move),
      y: mix(end.y + 65, 0, move),
      w: mix(mix(54, 1120, expand), 1030, move),
      h: mix(mix(54, 666, expand), 1130, move),
      r: mix(27, 38, expand),
      expand,
      move,
    };
  }
  function ticket(t) {
    const s = ticketState(t),
      scale = s.w / 1120;
    plate(s.x, s.y, s.w, s.h, s.r, lerpColor(C.orange, C.white, s.expand));
    clipped(s.x, s.y, s.w, s.h, s.r, () => {
      alpha(c, fade(t, 7.05, 0.78) * (1 - E(t, 10.65, 0.36)), () => {
        c.save();
        c.translate(s.x, s.y);
        c.scale(scale, scale);
        rr(c, 0, -259, 1120, 148, 0, C.ink);
        icon("compass", -463, -259, 42, C.orange);
        text(c, "órbita", -425, -259, 43, C.white, 600);
        text(c, "CARTÃO DE EMBARQUE", 459, -259, 22, C.muted, 500, "right");
        const reveal = (at, fn) => {
          const p = E(t, at, 0.32);
          alpha(c, p, () => {
            c.save();
            c.translate(0, 18 * (1 - p));
            fn();
            c.restore();
          });
        };
        reveal(7.72, () => {
          text(c, "LIS", -470, -84, 140, C.ink, 650);
          text(c, "Lisboa", -462, 25, 29, "#66818a", 450);
        });
        reveal(7.89, () => {
          icon("plane", 0, -80, 65, C.orange, 1.3);
          line(
            c,
            [
              [-150, -80],
              [-65, -80],
            ],
            "#d0d9d9",
            2,
          );
          line(
            c,
            [
              [65, -80],
              [150, -80],
            ],
            "#d0d9d9",
            2,
          );
        });
        reveal(8.04, () => {
          text(c, "FNC", 210, -84, 140, C.ink, 650);
          text(c, "Madeira", 218, 25, 29, "#66818a", 450);
        });
        c.setLineDash([5, 10]);
        line(
          c,
          [
            [-540, 92],
            [540, 92],
          ],
          "#cad6d7",
          2,
        );
        c.setLineDash([]);
        for (const [label, value, xx, ic, at] of [
          ["DATA", "24 JUN", -460, "calendar-days", 8.22],
          ["PORTÃO", "A12", -185, "navigation", 8.36],
          ["ASSENTO", "12F", 90, "luggage", 8.5],
        ]) {
          reveal(at, () => {
            icon(ic, xx + 15, 147, 27, "#82949a");
            text(c, label, xx + 45, 148, 18, "#82949a", 500);
            text(c, value, xx, 205, 39, C.ink, 650);
          });
        }
        const press = 1 - clamp(Math.abs(t - 9.55) / 0.17),
          check = E(t, 9.55, 0.23);
        alpha(c, E(t, 8.55, 0.3), () => {
          c.save();
          c.translate(413, 183);
          c.scale(1 - 0.04 * press, 1 - 0.04 * press);
          rr(c, 0, 0, 130, 130, 30, C.orange);
          alpha(c, 1 - check, () => icon("arrow-right", 0, 0, 49, C.ink, 1.6));
          if (check > 0) {
            const p = [
                [-21, 0],
                [-5, 16],
                [24, -18],
              ],
              a = check < 0.36 ? check / 0.36 : 1,
              b = clamp((check - 0.36) / 0.64);
            const points = [
              p[0],
              [mix(p[0][0], p[1][0], a), mix(p[0][1], p[1][1], a)],
            ];
            if (b > 0)
              points.push([mix(p[1][0], p[2][0], b), mix(p[1][1], p[2][1], b)]);
            line(c, points, C.ink, 5);
          }
          c.restore();
        });
        c.save();
        c.beginPath();
        c.rect(-460, 272, 570 * E(t, 8.65, 0.4), 44);
        c.clip();
        for (let i = 0; i < 48; i++) {
          c.fillStyle = C.ink;
          c.fillRect(
            -460 + i * 11,
            281,
            2 + ((i * 7) % 4),
            25 + (i % 4 === 0 ? 8 : 0),
          );
        }
        c.restore();
        alpha(c, E(t, 9.62, 0.3), () => {
          text(c, "VIAGEM PRONTA", 451, 275, 21, C.ink, 650, "right");
          text(c, "ORB 024 · DEMO", 451, 307, 16, "#70868d", 500, "right");
        });
        c.restore();
      });
      if (s.move > 0) wallet(t, s);
    });
    alpha(c, E(t, 7.91, 0.25) * (1 - E(t, 10.65, 0.22)), () => {
      disk(c, s.x - s.w / 2, s.y + 92 * scale, 18 * scale, C.navy);
      disk(c, s.x + s.w / 2, s.y + 92 * scale, 18 * scale, C.navy);
    });
  }
  function wallet(t, s) {
    alpha(c, fade(t, 10.65, 0.8), () => {
      c.save();
      c.translate(s.x, s.y);
      rr(c, 0, -401, 1030, 328, 0, C.ink);
      icon("compass", -410, -465, 39, C.orange);
      text(c, "Sua viagem,", -355, -464, 50, C.white, 550);
      text(c, "do seu jeito.", -425, -370, 75, C.white, 650);
      pill("3 DIAS", 338, -436, 163, "calendar-days");
      const items = [
        ["mountain", "Pico do Arieiro", "Acima das nuvens.", "01", 11.4],
        ["waves", "Porto Moniz", "Um mergulho no Atlântico.", "02", 11.83],
        ["utensils", "Sabores da ilha", "Sem pressa de voltar.", "03", 12.26],
      ];
      for (let i = 0; i < items.length; i++) {
        const [ic, title, sub, num, at] = items[i],
          p = E(t, at, 0.38),
          yy = -143 + i * 183;
        alpha(c, p, () => {
          c.save();
          c.translate(70 * (1 - p), 0);
          rr(c, 0, yy, 866, 151, 24, "#eeeee6");
          drawMiniature(c, ic, -327, yy, 170, 124, p);
          text(c, title, -220, yy - 22, 33, C.ink, 600);
          text(c, sub, -220, yy + 27, 23, "#70858a", 400);
          text(c, num, 367, yy, 31, "#94a6a9", 500, "right");
          c.restore();
        });
      }
      alpha(c, E(t, 12.75, 0.4), () => {
        rr(c, 0, 441, 866, 106, 28, C.orange);
        text(c, "Tudo pronto. Vamos?", -338, 441, 32, C.ink, 600);
        icon("arrow-up-right", 350, 441, 43, C.ink);
      });
      c.restore();
    });
  }
  // Paste inside createRenderer(), replacing mark() and adding closingBrand().
  // Every state is derived from t; no accumulated transforms or live animation.
  function mark(t) {
    const m = E(t, 15.05, 0.65),
      lock = E(t, 15.55, 0.55),
      center = 4900,
      scale = mix(1, 1.18, m),
      sx = center - 336.3 * lock;

    c.save();
    c.translate(sx, 0);
    c.rotate((-Math.PI / 4) * (1 - m));
    c.scale(scale, scale);
    c.fillStyle = C.orange;
    c.fill(new Path2D(morph(m)));
    alpha(c, m, () => disk(c, 0, 0, 12, C.navy));
    c.restore();

    // The word emerges from a fixed baseline, keeping the symbol as the anchor.
    c.save();
    c.beginPath();
    c.rect(center - 162, -122, 680, 244);
    c.clip();
    alpha(c, lock, () =>
      text(c, "órbita", center - 147.5, 94 * (1 - lock), 181.72, C.white, 600),
    );
    c.restore();
    const sub = E(t, 15.85, 0.48);
    alpha(c, sub, () =>
      text(
        c,
        "MENOS PLANOS. MAIS MUNDO.",
        center,
        159 + 22 * (1 - sub),
        28,
        "#b6cbd1",
        500,
        "center",
      ),
    );

    // A single editorial line: the emphasis passes from exploration to living.
    const words = [
      ["Explore", -285, 16.2],
      ["Descubra", 0, 17.0],
      ["Viva", 285, 17.8],
    ];
    words.forEach(([label, dx, at], i) => {
      const p = E(t, at, 0.42),
        next = i < 2 ? E(t, words[i + 1][2], 0.35) : 0,
        active = p * (1 - next),
        draw = E(t, i === 2 ? 18.35 : at + 0.22, i === 2 ? 0.8 : 0.45);
      c.save();
      c.beginPath();
      c.rect(center + dx - 140, 276, 280, 67);
      c.clip();
      alpha(c, p, () =>
        text(
          c,
          label,
          center + dx,
          308 + 52 * (1 - p),
          46,
          lerpColor("#718f99", C.white, active),
          500,
          "center",
        ),
      );
      c.restore();
      if (draw > 0)
        alpha(c, active, () =>
          line(
            c,
            [
              [center + dx - 48, 366],
              [center + dx - 48 + 96 * draw, 366],
            ],
            C.orange,
            3,
          ),
        );
    });
    return E(t, 14.15, 0.9);
  }

  function closingBrand(t) {
    const ret = E(t, 19.45, 1.8),
      center = 4900 * (1 - ret),
      round = E(t, 19.45, 0.3),
      spread = E(t, 19.75, 0.95),
      clear = E(t, 19.85, 0.66),
      leave = E(t, 19.45, 0.32),
      px = center - 336.3 * (1 - spread),
      col = lerpColor(C.orange, C.white, clear);

    // Retiring type follows the returning camera for the first 320 ms.
    alpha(c, 1 - leave, () => {
      const dy = -24 * leave;
      text(c, "órbita", center - 147.5, dy, 181.72, C.white, 600);
      text(
        c,
        "MENOS PLANOS. MAIS MUNDO.",
        center,
        159 + dy,
        28,
        "#b6cbd1",
        500,
        "center",
      );
      [
        ["Explore", -285],
        ["Descubra", 0],
        ["Viva", 285],
      ].forEach(([label, dx], i) =>
        text(
          c,
          label,
          center + dx,
          308 + dy,
          46,
          i === 2 ? C.white : "#718f99",
          500,
          "center",
        ),
      );
      line(
        c,
        [
          [center + 237, 366 + dy],
          [center + 333, 366 + dy],
        ],
        C.orange,
        3,
      );
    });

    if (spread === 0) {
      // Flubber returns the compass to precisely the circle it was born from.
      c.save();
      c.translate(px, 0);
      c.scale(1.18, 1.18);
      c.fillStyle = C.orange;
      c.fill(new Path2D(morph(1 - round)));
      c.restore();
    } else {
      // The circle itself becomes the search surface; there is no new fading card.
      plate(
        px,
        0,
        mix(207.68, 1050, spread),
        mix(207.68, 144, spread),
        mix(103.84, 72, spread),
        col,
        spread,
      );
    }

    if (t >= 21.25) {
      fieldContents(center, 0, false);
      return;
    }

    // The compass aperture travels into the search lens as the surface opens.
    const lens = E(t, 19.78, 0.82),
      actualIcon = E(t, 20.45, 0.3),
      lx = center + mix(-336.3, -445.5, lens),
      ly = -1.5 * lens,
      outer = mix(14.16, 13.275, lens);
    alpha(c, 1 - actualIcon, () => {
      disk(c, lx, ly, outer, C.ink);
      disk(c, lx, ly, Math.max(0, outer - 2.55) * lens, col);
      alpha(c, lens, () =>
        line(
          c,
          [
            [lx + 8.5, ly + 8.5],
            [lx + 15, ly + 15],
          ],
          C.ink,
          2.55,
        ),
      );
    });
    alpha(c, actualIcon, () => icon("search", center - 444, 0, 36, C.ink));

    const button = E(t, 20.45, 0.25),
      copy = E(t, 20.3, 0.5);
    alpha(c, button, () => {
      rr(c, center + 433, 0, 104 * button, 104 * button, 31 * button, C.orange);
      icon("arrow-up-right", center + 433, 0, 42 * button, C.ink);
    });
    c.save();
    c.beginPath();
    c.rect(center - 378, -42, 730, 84);
    c.clip();
    alpha(c, copy, () =>
      text(
        c,
        "Para onde vamos?",
        center - 369,
        38 * (1 - copy),
        42,
        C.ink,
        500,
      ),
    );
    c.restore();
  }

  function cursor(t) {
    const travel = E(t, 3.9, 0.85),
      q = route(E(t, 5.05, 1.72)),
      s = ticketState(t);
    let p = { x: 560, y: 270 },
      a = 1;
    const move = (from, to, k) => ({
      x: mix(from.x, to.x, k),
      y: mix(from.y, to.y, k),
    });
    if (t < 1.15) p = move(p, { x: 433, y: 0 }, E(t, 0.02, 0.48));
    else if (t < 3.9)
      p = move({ x: 433, y: 0 }, { x: 408, y: 402 }, E(t, 2.6, 0.55));
    else if (t < 5.05)
      p = move(
        { x: 408, y: 402 },
        { x: 1600 + v.lis[0], y: v.lis[1] + 65 },
        travel,
      );
    else if (t < 7.05) {
      p = { x: 1600 + v.lis[0], y: v.lis[1] + 65 + 110 * E(t, 5.05, 0.35) };
      a = 1 - E(t, 5.18, 0.22);
    } else if (t < 10.65) {
      a = E(t, 8.75, 0.25);
      p = move(
        { x: ticketOrigin.x, y: end.y + 65 },
        { x: ticketOrigin.x + 413, y: end.y + 65 + 183 },
        E(t, 9.02, 0.53),
      );
    } else if (t < 11.45)
      p = { x: s.x + (413 * s.w) / 1120, y: s.y + (183 * s.w) / 1120 };
    else if (t < 14.15)
      p = move(
        { x: 3750 + (413 * 1030) / 1120, y: (183 * 1030) / 1120 },
        { x: 4100, y: 441 },
        E(t, 12.9, 0.5),
      );
    else {
      a = 1 - E(t, 14.15, 0.25);
      p = { x: 4100, y: 441 };
    }
    if (t > 20.65) {
      a = E(t, 20.65, 0.45);
      p = { x: 560, y: 270 };
    }
    const pulse = Math.max(
      ...[0.5, 3.9, 9.55, 10.65, 14.15].map(
        (at) => 1 - clamp(Math.abs(t - at) / 0.12),
      ),
    );
    alpha(c, a, () => {
      c.save();
      c.translate(p.x, p.y);
      c.scale(1 - 0.08 * pulse, 1 - 0.08 * pulse);
      c.drawImage(assets.pointer, -19.7, -11.38, 60, 60);
      c.restore();
    });
    return p;
  }
  function seek(time, displayTime = time) {
    const t = time >= 1319 / 60 ? 0 : designTime(Math.max(0, time)),
      cam = camera(t);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.shadowColor = "transparent";
    c.shadowBlur = 0;
    c.shadowOffsetY = 0;
    c.setLineDash([]);
    c.fillStyle = C.paper;
    c.fillRect(0, 0, W, H);
    const enter = E(t, 3.9, 0.48),
      exit = E(t, 19.45, 0.55);
    if (enter === 1) {
      c.fillStyle = C.navy;
      c.fillRect(0, 0, W, H);
    } else if (enter > 0) {
      const fx = 720 + (408 - cam.x) * cam.z,
        fy = 720 + (402 - cam.y) * cam.z;
      const far = Math.max(
        Math.hypot(fx, fy),
        Math.hypot(W - fx, fy),
        Math.hypot(fx, H - fy),
        Math.hypot(W - fx, H - fy),
      );
      disk(c, fx, fy, enter * far * 1.01, C.navy);
    }
    if (exit > 0)
      disk(c, 720 - 285 * (1 - E(t, 19.45, 1.8)), 720, exit * 2200, C.paper);
    c.save();
    c.translate(720, 720);
    c.scale(cam.z, cam.z);
    c.translate(-cam.x, -cam.y);
    if (t < 4.75) search(t);
    if (t >= 3.9 && t < 7.9) mapScene(t);
    if (t >= 6.75 && t < 15.05) {
      alpha(c, E(t, 6.75, 0.3) * (1 - E(t, 14.15, 0.42)), () => ticket(t));
    }
    if (t >= 14.15 && t < 15.05) {
      const p = E(t, 14.15, 0.9),
        x = mix(4100, 4900, p),
        y = mix(441, 0, p);
      disk(c, x, y, mix(53, 88, p), C.orange);
    }
    if (t >= 15.05 && t < 19.45) mark(t);
    if (t >= 19.45) closingBrand(t);
    const pointer = cursor(t);
    c.restore();
    return { time: t, camera: cam, pointer };
  }
  return { seek };
}
