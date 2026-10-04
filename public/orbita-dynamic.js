import "./assets/orbita-vectors/flubber.min.js";
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
      y = end.y * pass - end.y * wallet;
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
      w = closing ? mix(180, 1050, s) : mix(1050, 1150, p),
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
      x = 1600;
    alpha(c, arrive * (1 - gone), () => {
      plate(x, 0, 1220, 1120, 40, C.sea);
      clipped(x, 0, 1220, 1120, 40, () => {
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
        alpha(c, E(t, 6.45, 0.45), () => {
          ring(c, end.x, end.y, 27, C.orange, 3);
          text(c, "MADEIRA", end.x + 45, end.y - 12, 29, C.white, 600);
          text(
            c,
            "Você está quase lá.",
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
    const s = ticketState(t);
    plate(s.x, s.y, s.w, s.h, s.r, lerpColor(C.orange, C.white, s.expand));
    clipped(s.x, s.y, s.w, s.h, s.r, () => {
      alpha(c, fade(t, 7.05, 0.78) * (1 - E(t, 10.65, 0.36)), () => {
        c.save();
        c.translate(s.x, s.y);
        c.scale(s.w / 1120, s.w / 1120);
        rr(c, 0, -259, 1120, 148, 0, C.ink);
        icon("compass", -463, -259, 42, C.orange);
        text(c, "órbita", -425, -259, 43, C.white, 600);
        text(c, "BOARDING PASS", 459, -259, 22, C.muted, 500, "right");
        text(c, "LIS", -470, -84, 140, C.ink, 650);
        text(c, "FNC", 210, -84, 140, C.ink, 650);
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
        text(c, "Lisboa", -462, 25, 29, "#66818a", 450);
        text(c, "Madeira", 218, 25, 29, "#66818a", 450);
        c.setLineDash([7, 10]);
        line(
          c,
          [
            [-560, 92],
            [560, 92],
          ],
          "#cad6d7",
          2,
        );
        c.setLineDash([]);
        for (const [label, value, xx, ic] of [
          ["DATA", "24 JUN", -460, "calendar-days"],
          ["PORTÃO", "A12", -185, "navigation"],
          ["ASSENTO", "12F", 90, "luggage"],
        ]) {
          icon(ic, xx + 15, 147, 27, "#82949a");
          text(c, label, xx + 45, 148, 18, "#82949a", 500);
          text(c, value, xx, 205, 39, C.ink, 650);
        }
        rr(c, 413, 183, 130, 130, 30, C.orange);
        icon("check", 413, 183, 62, C.ink, 2);
        alpha(c, E(t, 8.4, 0.38), () => {
          for (let i = 0; i < 48; i++) {
            const bw = 2 + ((i * 7) % 4);
            c.fillStyle = C.ink;
            c.fillRect(-460 + i * 11, 277, bw, 25 + (i % 4 === 0 ? 8 : 0));
          }
          text(c, "DEMO · ORB 024", 457, 292, 18, "#70868d", 500, "right");
        });
        c.restore();
      });
      if (s.move > 0) wallet(t, s);
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
          rr(c, -343, yy, 103, 103, 22, i === 1 ? "#d4e4e3" : "#f9ddc7");
          icon(ic, -343, yy, 47, C.ink, 1.5);
          text(c, title, -265, yy - 22, 35, C.ink, 600);
          text(c, sub, -265, yy + 27, 24, "#70858a", 400);
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
  function mark(t) {
    const inP = E(t, 14.15, 0.9),
      m = E(t, 15.05, 0.65),
      lock = E(t, 15.55, 0.55),
      ret = E(t, 19.45, 1.8);
    const center = 4900 * (1 - ret),
      x = center - 285 * lock * (1 - ret) - 444 * ret,
      y = 0;
    c.save();
    c.translate(x, y);
    c.rotate((-Math.PI / 4) * (1 - m));
    c.scale(mix(1, 0.17, ret), mix(1, 0.17, ret));
    c.fillStyle = C.orange;
    c.fill(new Path2D(morph(m)));
    alpha(c, m * (1 - ret), () => disk(c, 0, 0, 12, C.navy));
    c.restore();
    alpha(c, lock * (1 - E(t, 18.9, 0.45)), () => {
      text(c, "órbita", center - 125, 2, 154, C.white, 600);
      text(
        c,
        "MENOS PLANOS. MAIS MUNDO.",
        center,
        135,
        26,
        "#b6cbd1",
        500,
        "center",
      );
    });
    for (const [label, dx, width, symbol, at] of [
      ["Explore", -255, 202, "compass", 16.35],
      ["Descubra", 0, 239, "map-pin", 17.1],
      ["Viva", 255, 179, "sun", 17.85],
    ]) {
      const slide = E(t, at, 0.45);
      alpha(c, slide * (1 - E(t, 18.85, 0.4)), () =>
        pill(label, center + dx, 276 + 50 * (1 - slide), width, symbol),
      );
    }
    alpha(c, E(t, 20.2, 0.5), () => icon("search", center - 444, 0, 36, C.ink));
    return inP;
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
    else if (t < 7.05) p = { x: 1600 + q.x, y: q.y + 65 };
    else if (t < 10.65)
      p = move(
        { x: ticketOrigin.x, y: end.y + 65 },
        { x: ticketOrigin.x + 413, y: end.y + 65 + 183 },
        E(t, 9.2, 0.6),
      );
    else if (t < 11.45) p = { x: s.x + 413, y: s.y + 183 };
    else if (t < 14.15)
      p = move({ x: 4163, y: 183 }, { x: 4100, y: 441 }, E(t, 12.9, 0.5));
    else {
      a = 1 - E(t, 14.15, 0.25);
      p = { x: 4100, y: 441 };
    }
    if (t > 20.65) {
      a = E(t, 20.65, 0.45);
      p = { x: 560, y: 270 };
    }
    const pulse = Math.max(
      ...[0.5, 3.9, 10.65, 14.15].map(
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
    const t = time >= 1319 / 60 ? 0 : Math.max(0, time),
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
    if (t < 4.75) alpha(c, 1 - fade(t, 3.9, 0.85), () => search(t));
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
    if (t >= 19.45) alpha(c, E(t, 19.45, 0.3), () => search(t, true));
    if (t >= 15.05) alpha(c, 1 - E(t, 19.6, 0.75), () => mark(t));
    const pointer = cursor(t);
    c.restore();
    return { time: t, camera: cam, pointer };
  }
  return { seek };
}
