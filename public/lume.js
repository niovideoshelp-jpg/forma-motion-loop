import { drawCover, drawEmblem, drawLesson } from "./lume-art.js";
import "./assets/orbita-vectors/flubber.min.js";
export const W = 1440,
  H = 1440,
  FPS = 60,
  DURATION = 22;
const C = {
  paper: "#f4f2ed",
  white: "#fffef9",
  ink: "#17181c",
  panel: "#222329",
  blue: "#3259ff",
  gray: "#9497a2",
  line: "#d8d9de",
  lime: "#dbedbc",
};
const clamp = (x) => Math.max(0, Math.min(1, x)),
  mix = (a, b, p) => a + (b - a) * p;
function curve(v) {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  let lo = 0,
    hi = 1,
    u = v;
  for (let i = 0; i < 18; i++) {
    u = (lo + hi) / 2;
    const q = 1 - u,
      x = 3 * q * q * u * 0.45 + 3 * q * u * u * 0.15 + u * u * u;
    if (x < v) lo = u;
    else hi = u;
  }
  return 3 * (1 - u) * u * u + u * u * u;
}
const E = (t, a, d) => curve((t - a) / d),
  F = (t, a, d) => E(t, a + d * 0.45, d * 0.55);
function color(a, b, p) {
  if (p <= 0) return a;
  if (p >= 1) return b;
  const n = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = n(a),
    y = n(b);
  return "rgb(" + x.map((v, i) => Math.round(mix(v, y[i], p))).join(",") + ")";
}
function rr(c, x, y, w, h, r, col) {
  if (w <= 0 || h <= 0) return;
  c.beginPath();
  c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
  c.fillStyle = col;
  c.fill();
}
function circle(c, x, y, r, col) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col;
  c.fill();
}
function line(c, pts, col, width = 3) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = col;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke();
}
function text(
  c,
  s,
  x,
  y,
  size = 32,
  col = C.ink,
  weight = 500,
  align = "left",
) {
  c.font = weight + " " + size + "px Geist";
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillStyle = col;
  c.fillText(s, x, y);
}
function alpha(c, a, fn) {
  if (a <= 0.00001) return;
  c.save();
  c.globalAlpha *= clamp(a);
  fn();
  c.restore();
}
function clip(c, x, y, w, h, r, fn) {
  c.save();
  c.beginPath();
  c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
  c.clip();
  fn();
  c.restore();
}
function arrow(c, x, y, size, col = C.white) {
  line(
    c,
    [
      [x - size, y],
      [x + size, y],
    ],
    col,
    3,
  );
  line(
    c,
    [
      [x + size * 0.3, y - size * 0.7],
      [x + size, y],
      [x + size * 0.3, y + size * 0.7],
    ],
    col,
    3,
  );
}
function check(c, x, y, p = 1, size = 20, col = C.blue) {
  const pts = [
      [-size * 0.8, 0],
      [-size * 0.15, size * 0.6],
      [size, -size * 0.65],
    ],
    q = clamp(p / 0.38),
    r = clamp((p - 0.38) / 0.62),
    out = [
      [x + pts[0][0], y + pts[0][1]],
      [x + mix(pts[0][0], pts[1][0], q), y + mix(pts[0][1], pts[1][1], q)],
    ];
  if (r > 0)
    out.push([
      x + mix(pts[1][0], pts[2][0], r),
      y + mix(pts[1][1], pts[2][1], r),
    ]);
  line(c, out, col, 3.3);
}
function play(c, x, y, r, col = C.ink) {
  c.beginPath();
  c.moveTo(x - r * 0.34, y - r * 0.5);
  c.lineTo(x + r * 0.5, y);
  c.lineTo(x - r * 0.34, y + r * 0.5);
  c.closePath();
  c.fillStyle = col;
  c.fill();
}
function plus(c, x, y, size, width, col = C.blue, vertical = 1) {
  rr(c, x, y, size, width, width / 2, col);
  rr(c, x, y, width, size * vertical, width / 2, col);
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
    return p;
  });
}
export async function loadAssets(base = "./assets/") {
  const vectors = await (
    await fetch(base + "orbita-vectors/vectors.json")
  ).json();
  const pointer = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = base + "macos-pointer.png";
  });
  const font = new FontFace(
    "Geist",
    "url(" + base + "geist-latin-wght-normal.woff2)",
    { weight: "100 900", style: "normal" },
  );
  await font.load();
  document.fonts.add(font);
  return {
    pointer,
    icons: Object.fromEntries(
      Object.entries(vectors.icons).map(([n, s]) => [n, iconPaths(s)]),
    ),
  };
}
export function createRenderer(canvas, assets) {
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d", { alpha: false });
  const plusPath =
    "M-16-49Q-16-65 0-65Q16-65 16-49V-16H49Q65-16 65 0Q65 16 49 16H16V49Q16 65 0 65Q-16 65-16 49V16H-49Q-65 16-65 0Q-65-16-49-16H-16Z";
  const lPath =
    "M-75.6-75.6H-32.4V23.4Q-32.4 32.4-23.4 32.4H32.4L10.8 75.6H-75.6Z";
  const smallPlus =
    "M21.6-77.4H57.6V-54H81V-18H57.6V5.4H21.6V-18H-1.8V-54H21.6Z";
  const pillPath =
    "M-186-46H186A24 24 0 0 1 210-22V22A24 24 0 0 1 186 46H-186A24 24 0 0 1-210 22V-22A24 24 0 0 1-186-46Z";
  const logoMain = globalThis.flubber.interpolate(plusPath, lPath, {
    maxSegmentLength: 4,
  });
  const logoSide = globalThis.flubber.fromCircle(39.6, -36, 0.001, smallPlus, {
    maxSegmentLength: 4,
  });
  const closeMain = globalThis.flubber.interpolate(lPath, pillPath, {
    maxSegmentLength: 4,
  });
  const closeSide = globalThis.flubber.toCircle(smallPlus, 0, 0, 0.001, {
    maxSegmentLength: 4,
  });
  function icon(name, x, y, size = 32, col = C.ink) {
    c.save();
    c.translate(x - size / 2, y - size / 2);
    c.scale(size / 24, size / 24);
    c.strokeStyle = col;
    c.lineWidth = 1.7;
    c.lineCap = "round";
    c.lineJoin = "round";
    for (const p of assets.icons[name] || []) c.stroke(p);
    c.restore();
  }
  function plate(x, y, w, h, r, col, shadow = 1) {
    c.save();
    c.shadowColor = "rgba(7,8,14," + 0.12 * shadow + ")";
    c.shadowBlur = 40 * shadow;
    c.shadowOffsetY = 18 * shadow;
    rr(c, x, y, w, h, r, col);
    c.restore();
    c.save();
    c.beginPath();
    c.roundRect(
      x - w / 2 + 0.5,
      y - h / 2 + 0.5,
      w - 1,
      h - 1,
      Math.min(r, w / 2, h / 2),
    );
    c.strokeStyle = col === C.white ? "#ffffff" : "#ffffff12";
    c.lineWidth = 1;
    c.stroke();
    c.restore();
  }
  function camera(t) {
    const a = E(t, 3.3, 0.8),
      b = E(t, 6.8, 0.7),
      d = E(t, 9.3, 0.75),
      e = E(t, 12.3, 0.85),
      f = E(t, 16.3, 0.65),
      ret = E(t, 20.3, 1.45);
    let x = 1000 * a + 1250 * b + 1350 * d + 1270 * e + 1330 * f;
    const log =
      Math.log(0.98) * a +
      Math.log(1.04 / 0.98) * b +
      Math.log(1 / 1.04) * d +
      Math.log(1.03) * e +
      Math.log(1 / 1.03) * f;
    return { x: x * (1 - ret), y: 0, z: Math.exp(log * (1 - ret)) };
  }
  function planContent(x = 315, y = -10, drawName = true) {
    c.save();
    c.translate(x - 315, y + 10);
    text(c, "SEU PLANO", 110, -305, 28, C.gray, 600);
    if (drawName) text(c, "Lume+", 110, -248, 56, C.ink, 650);
    text(c, "R$ 39", 110, -131, 87, C.ink, 650);
    text(c, "/mês", 370, -113, 32, C.gray, 450);
    line(
      c,
      [
        [110, -50],
        [520, -50],
      ],
      C.line,
      1,
    );
    for (const [label, yy] of [
      ["Biblioteca completa", 14],
      ["Aulas de até 15 min", 74],
      ["Novidades semanais", 134],
    ]) {
      check(c, 124, yy, 1, 13, C.blue);
      text(c, label, 153, yy, 34, C.ink, 450);
    }
    text(c, "Cancele quando quiser.", 315, 337, 28, C.gray, 450, "center");
    c.restore();
  }
  function intro(t, amount = 1, drawPlan = true) {
    alpha(c, amount, () => {
      drawEmblem(c, -515, -515, 50, 1);
      text(c, "Lume+", -466, -515, 38, C.ink, 650);
      text(c, "Sua próxima", -550, -225, 85, C.ink, 600);
      text(c, "ideia começa", -550, -126, 85, C.ink, 600);
      text(c, "aqui.", -550, -27, 85, C.ink, 600);
      text(c, "Conhecimento que cabe", -545, 132, 32, "#727580", 450);
      text(c, "na sua rotina.", -545, 176, 32, "#727580", 450);
      const under = E(t, 1.1, 0.65) * (1 - E(t, 2.65, 0.25));
      alpha(c, under, () =>
        line(
          c,
          [
            [-544, 37],
            [-544 + 300 * under, 37],
          ],
          C.blue,
          7,
        ),
      );
      if (drawPlan) {
        plate(315, -10, 510, 760, 34, C.white);
        clip(c, 315, -10, 510, 760, 34, () => planContent());
      }
    });
  }
  function surface(t) {
    const a = E(t, 3.3, 0.8),
      b = E(t, 6.8, 0.7),
      d = E(t, 9.3, 0.75),
      e = E(t, 12.3, 0.85),
      f = E(t, 16.3, 0.65),
      r = E(t, 20.3, 1.45);
    let x = mix(315, 650, a) + 1600 * b + 1350 * d + 1500 * e + 1100 * f,
      y = mix(250, 30, a) - 30 * b + 40 * e - 40 * f;
    let w = mix(420, 420, a) + 740 * b - 400 * e + 1040 * f,
      h = mix(92, 520, a) + 330 * b + 100 * d - 480 * e + 1330 * f,
      rad = mix(24, 22, a) + 12 * b + 6 * e - 40 * f;
    x = mix(x, 315, r);
    y = mix(y, -10, r);
    w = mix(w, 510, r);
    h = mix(h, 760, r);
    rad = mix(rad, 34, r);
    return { x, y, w, h, rad, a, b, d, e, f, r };
  }
  function library(t) {
    const p = E(t, 3.3, 0.8),
      gone = E(t, 6.8, 0.45);
    alpha(c, p * (1 - gone), () => {
      plate(1000, 0, 1240, 1160, 42, C.panel, 0.4);
      text(c, "Lume+", 460, -513, 34, C.white, 650);
      circle(c, 1373, -515, 6, C.blue);
      text(c, "ACESSO ATIVO", 1395, -515, 20, C.gray, 550);
      text(c, "Seu mundo de ideias.", 460, -412, 64, C.white, 600);
      for (const [idx, x, at] of [
        [1, 1070, 3.72],
        [2, 1390, 3.9],
      ]) {
        const enter = E(t, at, 0.42);
        alpha(c, enter, () => {
          drawCover(c, idx, x, 65 + 45 * (1 - enter), 300, 390, 1);
          text(
            c,
            idx === 1 ? "Ideias em ação" : "Tecnologia útil",
            x - 150,
            307,
            28,
            C.white,
            550,
          );
          text(c, "CURSO · 12 AULAS", x - 150, 353, 19, C.gray, 500);
        });
      }
      text(c, "Design que", 440, 356, 40, C.white, 550);
      text(c, "comunica.", 440, 405, 40, C.white, 550);
      text(c, "Explore no seu ritmo.", 460, 505, 30, C.gray, 450);
      icon("arrow-up-right", 1520, 505, 35, C.blue);
    });
  }
  function playerOverlay(t, s) {
    const appear = F(t, 6.8, 0.7),
      leave = 1 - E(t, 9.3, 0.3);
    alpha(c, appear * leave, () => {
      c.save();
      c.translate(s.x, s.y);
      rr(c, 0, -351, 1160, 148, 0, C.ink);
      text(c, "Design que comunica.", -478, -358, 43, C.white, 550);
      text(c, "01 / COMPOSIÇÃO", -477, -305, 21, C.gray, 500);
      text(c, "12 MIN", 485, -351, 24, C.gray, 500, "right");
      rr(c, 0, 348, 1160, 155, 0, C.white);
      const press = E(t, 8.3, 0.22);
      circle(c, 0, 0, 63, C.white);
      alpha(c, 1 - press, () => play(c, 0, 0, 48, C.ink));
      alpha(c, press, () => {
        rr(c, -12, 0, 10, 36, 3, C.ink);
        rr(c, 12, 0, 10, 36, 3, C.ink);
      });
      icon("clock-3", -476, 321, 27, C.gray);
      text(c, "Aula em andamento", -443, 321, 26, C.ink, 500);
      text(c, "02:40 / 12:00", 474, 321, 22, C.gray, 450, "right");
      c.restore();
    });
  }
  function mainSurface(t, displayTime = t) {
    const s = surface(t);
    let fill = C.blue;
    if (t >= 3.3) fill = color(C.blue, C.paper, s.a);
    if (t >= 12.3) fill = color(C.paper, C.blue, s.e);
    if (t >= 20.3) fill = color(C.blue, C.white, s.r);
    plate(s.x, s.y, s.w, s.h, Math.max(0, s.rad), fill, 1 - s.f + s.r);
    clip(c, s.x, s.y, s.w, s.h, Math.max(0, s.rad), () => {
      if (t < 3.3) {
        alpha(c, 1 - E(t, 3, 0.2), () =>
          text(c, "Assinar agora", 315, 250, 38, C.white, 600, "center"),
        );
        alpha(c, E(t, 3, 0.2), () =>
          check(c, 315, 250, E(t, 3, 0.2), 22, C.white),
        );
      }
      if (t >= 3.3 && t < 10.05)
        alpha(c, F(t, 3.3, 0.8) * (1 - E(t, 9.3, 0.34)), () =>
          t < 6.8
            ? drawCover(c, 0, s.x, s.y, s.w, s.h, 1)
            : drawLesson(c, s.x, s.y, s.w, s.h, E(t, 6.8, 0.7)),
        );
      if (t >= 6.8 && t < 9.6) playerOverlay(t, s);
      if (t >= 9.3 && t < 13.15) progressContent(t, s, displayTime);
      if (t >= 12.3 && t < 16.95) memberContent(t, s);
      if (t >= 16.3 && t < 21.05) brandContent(t, s);
      if (t >= 20.3)
        alpha(c, F(t, 20.3, 1.45), () => planContent(s.x, s.y, false));
    });
    if (t >= 20.3) closing(t, s);
    return s;
  }
  function timelinePoint(t, p) {
    const s = surface(t),
      m = E(t, 9.3, 0.75),
      values = [0.05, 0.18, 0.3, 0.46, 0.58, 0.71, 0.84],
      j = Math.min(5, Math.floor(p * 6)),
      q = p * 6 - j;
    return {
      x: s.x + mix(-470, 470, p),
      y: s.y + mix(380, 150, m) - 230 * mix(values[j], values[j + 1], q) * m,
    };
  }
  function timelineTip(t) {
    return timelinePoint(
      t,
      mix(mix(0.05, 0.78, E(t, 8.3, 1)), 1, E(t, 9.3, 0.75)),
    );
  }
  function timeline(t) {
    if (t < 6.8 || t >= 13.15) return;
    const s = surface(t),
      m = E(t, 9.3, 0.75),
      end = E(t, 12.3, 0.85),
      extent = mix(mix(0.05, 0.78, E(t, 8.3, 1)), 1, m),
      pts = [];
    for (let i = 0; i <= 72; i++) {
      const pt = timelinePoint(t, (extent * i) / 72);
      pts.push([pt.x, pt.y]);
    }
    const tip = timelineTip(t),
      target = { x: s.x + 250, y: s.y - 125 },
      start = { x: target.x - 50, y: target.y },
      finish = { x: target.x + 50, y: target.y };
    const turned = pts.map(([x, y], i) => [
      mix(x, mix(start.x, finish.x, i / 72), end),
      mix(y, target.y, end),
    ]);
    clip(c, s.x, s.y, s.w, s.h, Math.max(0, s.rad), () =>
      alpha(c, F(t, 6.8, 0.7), () => {
        if (m < 1)
          line(
            c,
            [
              [s.x - 470, s.y + mix(380, 150, m)],
              [s.x + 470, s.y + mix(380, 150, m)],
            ],
            "#d0d2db",
            5 * (1 - end),
          );
        line(c, turned, color(C.blue, C.white, end), mix(7, 24, end));
        alpha(c, 1 - end, () =>
          circle(
            c,
            mix(tip.x, finish.x, end),
            mix(tip.y, finish.y, end),
            10 * (1 - end),
            color(C.blue, C.white, end),
          ),
        );
        for (let i = 0; i < 7; i++) {
          const pt = timelinePoint(t, i / 6);
          alpha(c, E(t, 10.05 + i * 0.13, 0.22) * (1 - end), () =>
            circle(c, pt.x, pt.y, 7, C.blue),
          );
        }
      }),
    );
  }
  function progressContent(t, s, displayTime = t) {
    alpha(c, F(t, 9.3, 0.75) * (1 - E(t, 12.3, 0.3)), () => {
      c.save();
      c.translate(s.x, s.y);
      text(c, "Aprender virou hábito.", -470, -348, 65, C.ink, 600);
      text(
        c,
        "Pequenos passos. Novas possibilidades.",
        -466,
        -275,
        28,
        C.gray,
        450,
      );
      const number = [1, 3, 5, 7][
        Math.min(3, Math.floor(clamp((displayTime - 10.05) / 1.1) * 4))
      ];
      text(c, String(number), -470, -103, 146, C.ink, 650);
      text(c, "dias de novas ideias", -354, -72, 36, C.ink, 500);
      for (let i = 0; i < 4; i++) {
        line(
          c,
          [
            [-470, 85 + i * 65],
            [470, 85 + i * 65],
          ],
          "#dedfe4",
          1,
        );
      }
      for (const [label, num, xx, at] of [
        ["Primeira aula", "01", -465, 10.2],
        ["Ideia aplicada", "02", -125, 10.7],
        ["Próximo passo", "03", 225, 11.2],
      ]) {
        const a = E(t, at, 0.34);
        alpha(c, a, () => {
          check(c, xx + 15, 330, 1, 14, C.blue);
          text(c, label, xx + 45, 329, 25, C.ink, 550);
          text(c, num, xx, 389, 20, C.gray, 500);
        });
      }
      c.restore();
    });
  }
  function memberContent(t, s) {
    const p = F(t, 12.3, 0.85),
      gone = 1 - E(t, 16.3, 0.3);
    alpha(c, p * gone, () => {
      c.save();
      c.translate(s.x, s.y);
      alpha(c, E(t, 13.3, 0.35), () =>
        text(c, "ANA MARTINS", -292, 5, 40, C.white, 550),
      );
      alpha(c, E(t, 14.3, 0.35), () =>
        text(c, "PLANO MENSAL", -289, 70, 30, "#dce3ff", 500),
      );
      line(
        c,
        [
          [-291, 132],
          [290, 132],
        ],
        "#ffffff40",
        1,
      );
      alpha(c, E(t, 15.3, 0.35), () => {
        circle(c, -282, 172, 5, C.white);
        text(c, "ASSINATURA ATIVA", -262, 172, 28, C.white, 500);
        text(c, "01", 291, 172, 28, C.white, 600, "right");
      });
      c.restore();
    });
  }
  function memberCaption(t) {
    const p = E(t, 13.0, 0.4) * (1 - E(t, 16.3, 0.3));
    alpha(c, p, () => {
      text(c, "Seu acesso.", 4260, -175, 72, C.white, 600);
      text(c, "Seu futuro.", 4260, -78, 72, C.white, 600);
      text(c, "Uma assinatura.", 4315, 83, 29, C.gray, 450);
      text(c, "Novas possibilidades.", 4315, 129, 29, C.gray, 450);
    });
  }
  function sharedPlus(t) {
    if (t < 12.3 || t >= 20.3) return;
    const s = surface(t),
      p = E(t, 12.3, 0.85),
      b = E(t, 16.3, 0.65),
      x = s.x + 250 - 680 * b,
      y = s.y - 125 + 55 * b - 220 * Math.sin(Math.PI * b),
      size = 100 + 30 * b,
      width = 24 + 8 * b;
    if (t < 17.3) {
      if (t >= 13.15) rr(c, x, y, size, width, width / 2, C.white);
      rr(c, x, y, width, size * E(t, 12.85, 0.3), width / 2, C.white);
    } else {
      const m = E(t, 17.3, 0.8);
      c.save();
      c.translate(x, y);
      c.fillStyle = C.white;
      c.fill(new Path2D(logoMain(m)));
      alpha(c, m, () => c.fill(new Path2D(logoSide(m))));
      c.restore();
    }
  }
  function sharedName(t) {
    if (t < 12.3) return;
    const s = surface(t),
      b = E(t, 16.3, 0.65),
      r = E(t, 20.3, 1.45);
    alpha(c, F(t, 12.3, 0.85), () =>
      text(
        c,
        "Lume+",
        mix(mix(s.x - 292, 6000, b), 110, r),
        mix(mix(s.y - 144, -70, b), -248, r),
        mix(mix(56, 190, b), 56, r),
        color(C.white, C.ink, r),
        650,
      ),
    );
  }
  function brandContent(t, s) {
    const b = E(t, 16.3, 0.65),
      copy = E(t, 16.95, 0.38),
      tag = E(t, 18.3, 0.45);
    alpha(c, copy * (1 - E(t, 20.3, 0.65)), () =>
      text(
        c,
        "Conhecimento para ir além.",
        6200,
        149 + 30 * (1 - copy),
        44,
        "#dce3ff",
        450,
        "center",
      ),
    );
    alpha(c, tag * (1 - E(t, 20.3, 0.65)), () => {
      line(
        c,
        [
          [5955, 255],
          [5955 + 490 * tag * (1 - E(t, 19.3, 0.55)), 255],
        ],
        "#ffffff90",
        2,
      );
      text(
        c,
        "Sua próxima ideia começa aqui.",
        6200,
        331 + 22 * (1 - tag),
        35,
        C.white,
        500,
        "center",
      );
    });
  }
  function closing(t, s) {
    const p = E(t, 20.3, 1.45),
      copy = F(t, 20.3, 1.45);
    alpha(c, copy, () => intro(0, 1, false));
    const bx = mix(5770, 315, p),
      by = mix(-70, 250, p),
      bw = mix(130, 420, p),
      bh = mix(32, 92, p);
    if (p === 1) plate(bx, by, 420, 92, 24, C.blue);
    else {
      c.save();
      c.translate(bx, by);
      c.shadowColor = "rgba(7,8,14," + 0.12 * p + ")";
      c.shadowBlur = 40 * p;
      c.shadowOffsetY = 18 * p;
      c.fillStyle = color(C.white, C.blue, p);
      c.fill(new Path2D(closeMain(p)));
      c.shadowColor = "transparent";
      alpha(c, 1 - p, () => c.fill(new Path2D(closeSide(p))));
      c.restore();
    }
    alpha(c, F(t, 20.3, 1.45), () =>
      text(c, "Assinar agora", bx, by, 38, C.white, 600, "center"),
    );
  }
  function cursor(t) {
    let p = { x: 600, y: 390 },
      a = 1;
    const pos = (from, to, k) => ({
      x: mix(from.x, to.x, k),
      y: mix(from.y, to.y, k),
    });
    if (t < 3.3) p = pos(p, { x: 315, y: 250 }, E(t, 0.15, 0.7));
    else if (t < 6.8)
      p = pos({ x: 315, y: 250 }, { x: 650, y: 90 }, E(t, 5.2, 0.8));
    else if (t < 8.3)
      p = pos({ x: 650, y: 90 }, { x: 2250, y: 0 }, E(t, 6.8, 0.7));
    else if (t < 9.3)
      p = pos({ x: 2250, y: 0 }, timelineTip(t), E(t, 8.6, 0.45));
    else if (t < 10.05) p = timelineTip(t);
    else {
      p = timelineTip(10.05);
      a = 1 - E(t, 10.05, 0.25);
    }
    if (t >= 21.1) {
      p = { x: 600, y: 390 };
      a = E(t, 21.1, 0.35);
    }
    const pulse = Math.max(
      ...[3, 6.8, 8.3].map((x) => 1 - clamp(Math.abs(t - x) / 0.13)),
    );
    alpha(c, a, () => {
      c.save();
      c.translate(p.x, p.y);
      c.scale(1 - 0.07 * pulse, 1 - 0.07 * pulse);
      c.drawImage(assets.pointer, -19.7, -11.38, 60, 60);
      c.restore();
    });
    return p;
  }
  function seek(time, displayTime = time) {
    const t = Math.max(0, Math.min(time, 22)),
      cam = camera(t);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.shadowBlur = 0;
    c.shadowColor = "transparent";
    c.shadowOffsetY = 0;
    c.setLineDash([]);
    c.fillStyle = C.paper;
    c.fillRect(0, 0, W, H);
    const dark = E(t, 3.3, 0.45),
      ret = E(t, 20.3, 0.5);
    if (dark === 1) {
      c.fillStyle = C.ink;
      c.fillRect(0, 0, W, H);
    } else if (dark > 0) {
      const x = 720 + (315 - cam.x) * cam.z,
        y = 970,
        far = Math.max(
          Math.hypot(x, y),
          Math.hypot(W - x, y),
          Math.hypot(x, H - y),
          Math.hypot(W - x, H - y),
        );
      circle(c, x, y, dark * far * 1.01, C.ink);
    }
    if (t >= 16.3 && t < 20.3) {
      const b = E(t, 16.3, 0.65);
      if (b === 1) {
        c.fillStyle = C.blue;
        c.fillRect(0, 0, W, H);
      }
    }
    if (ret > 0) {
      const x = 720 + (5770 * (1 - E(t, 20.3, 1.45)) - cam.x) * cam.z,
        y = 650,
        far = Math.max(
          Math.hypot(x, y),
          Math.hypot(W - x, y),
          Math.hypot(x, H - y),
          Math.hypot(W - x, H - y),
        );
      circle(c, x, y, ret * far * 1.01, C.paper);
    }
    c.save();
    c.translate(720, 720);
    c.scale(cam.z, cam.z);
    c.translate(-cam.x, 0);
    if (t < 3.3) intro(t, 1 - E(t, 3.12, 0.18));
    if (t >= 3.3 && t < 7.25) library(t);
    mainSurface(t, displayTime);
    timeline(t);
    if (t >= 12.3 && t < 16.6) memberCaption(t);
    sharedPlus(t);
    sharedName(t);
    const pointer = cursor(t);
    c.restore();
    return { time: t, camera: cam, surface: surface(t), pointer };
  }
  return { seek };
}
