// ÓRBITA — continuous shared-object motion, authored for a deterministic canvas.
export const W = 1440,
  H = 1440,
  FPS = 60,
  DURATION = 22;
export const CUTS = {
  expand: 2.3,
  map: 6.15,
  route: 7.8,
  ticket: 10.8,
  fold: 14,
  brand: 15.7,
  return: 18.5,
};
const C = {
  paper: "#f5f2eb",
  ink: "#102f43",
  navy: "#09283e",
  sea: "#123b50",
  orange: "#f39a59",
  white: "#fffdf8",
};
const clamp = (v) => Math.max(0, Math.min(1, v)),
  mix = (a, b, p) => a + (b - a) * p;
// Quintic interpolation has zero velocity AND zero acceleration at every handoff.
export const smooth = (x) => {
  x = clamp(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const E = (t, a, d) => smooth((t - a) / d),
  fade = (t, a, d) => E(t, a + d * 0.35, d * 0.65);
function color(a, b, p) {
  const parse = (s) => {
    if (s.startsWith("#")) {
      const n = parseInt(s.slice(1), 16);
      return [16, 8, 0].map((k) => (n >> k) & 255);
    }
    return s
      .match(/[\d.]+/g)
      .map(Number)
      .slice(0, 3);
  };
  const ar = parse(a),
    br = parse(b);
  return `rgb(${ar.map((v, i) => Math.round(mix(v, br[i], p))).join(",")})`;
}
function rr(c, x, y, w, h, r, fill) {
  if (w < 0.01 || h < 0.01) return;
  c.beginPath();
  c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
  c.fillStyle = fill;
  c.fill();
}
function disk(c, x, y, r, fill) {
  if (r < 0.001) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}
function stroke(c, pts, color, width = 3) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.strokeStyle = color;
  c.stroke();
}
function txt(
  c,
  s,
  x,
  y,
  size = 34,
  fill = C.ink,
  weight = 500,
  align = "left",
) {
  c.fillStyle = fill;
  c.font = `${weight} ${size}px Geist`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
function alpha(c, a, fn) {
  if (a < 0.00001) return;
  c.save();
  c.globalAlpha *= clamp(a);
  fn();
  c.restore();
}
function arrow(c, x, y, size, col) {
  stroke(
    c,
    [
      [x - size, y],
      [x + size, y],
    ],
    col,
    3,
  );
  stroke(
    c,
    [
      [x + size * 0.25, y - size * 0.75],
      [x + size, y],
      [x + size * 0.25, y + size * 0.75],
    ],
    col,
    3,
  );
}
function ring(c, x, y, r, width, col) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.strokeStyle = col;
  c.lineWidth = width;
  c.stroke();
}
function cam(t) {
  const a = E(t, 2.3, 2),
    b = E(t, 6.15, 1.65),
    d = E(t, 10.3, 2.05),
    f = E(t, 14, 1.7),
    ret = E(t, 18.5, 2.7);
  let x = 20 * a + 1630 * b + 340 * d + 400 * f,
    y = -18 * a + 18 * b - 160 * d + 230 * f;
  let z = Math.exp(
    Math.log(1.04) * a +
      Math.log(0.94 / 1.04) * b +
      Math.log(1.08 / 0.94) * d +
      Math.log(1 / 1.08) * f,
  );
  x *= 1 - ret;
  y *= 1 - ret;
  z = Math.exp(Math.log(z) * (1 - ret));
  return { x, y, z };
}
export function route(p) {
  const q = 1 - p;
  return {
    x:
      q * q * q * -380 +
      3 * q * q * p * -220 +
      3 * q * p * p * 60 +
      p * p * p * 340,
    y:
      q * q * q * 250 +
      3 * q * q * p * -200 +
      3 * q * p * p * 220 +
      p * p * p * -160,
  };
}
function pathPoints(p) {
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const a = route((p * i) / 100);
    pts.push([a.x, a.y]);
  }
  return pts;
}
function pointer(c, img, x, y, press = 0) {
  c.save();
  c.translate(x, y);
  const s = 1 - 0.065 * press;
  c.scale(s, s);
  c.drawImage(img, -25.23, -14.568, 76.8, 76.8);
  c.restore();
}
function between(a, b, p) {
  return { x: mix(a.x, b.x, p), y: mix(a.y, b.y, p) };
}
export async function loadAssets(base = "./assets/") {
  const list = await Promise.all(
    ["orbita-madeira.png", "macos-pointer.png"].map(
      (n) =>
        new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = reject;
          im.src = base + n;
        }),
    ),
  );
  const font = new FontFace(
    "Geist",
    `url(${base}geist-latin-wght-normal.woff2)`,
  );
  await font.load();
  document.fonts.add(font);
  return { photo: list[0], pointer: list[1] };
}
export function createRenderer(canvas, assets) {
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d", { alpha: false });
  function plate(x, y, w, h, r, col, shadow = 1) {
    c.save();
    c.shadowColor = `rgba(12,34,45,${0.11 * shadow})`;
    c.shadowBlur = 48 * shadow;
    c.shadowOffsetY = 22 * shadow;
    rr(c, x, y, w, h, r, col);
    c.restore();
  }
  function field(t, closing = false) {
    const ret = E(t, 18.5, 2.7),
      p = closing ? 1 : E(t, 2.3, 1.5),
      cx = closing ? 2390 * (1 - ret) : 0,
      cy = closing ? 70 * (1 - ret) : 0;
    const width = closing ? 820 * E(t, 19.05, 2.15) : mix(820, 1060, p),
      height = closing ? 126 * E(t, 19.05, 2.15) : mix(126, 1080, p),
      radius = closing ? 63 : mix(63, 48, p);
    plate(cx, cy, width, height, radius, C.white, 1);
    if (closing) {
      const content = E(t, 20.05, 0.95);
      alpha(c, content, () => {
        txt(c, "Para onde vamos?", cx - 45, cy, 40, C.ink, 450, "center");
        disk(c, cx + 330, cy, 38, C.orange);
        arrow(c, cx + 330, cy, 15, C.ink);
      });
      return;
    }
    const fadeText = 1 - E(t, 2.3, 0.65),
      typed = Math.floor(clamp((Math.floor(t * 12) / 12 - 1.15) / 0.8) * 7);
    alpha(c, fadeText, () => {
      ring(c, -320, 0, 18, 3, C.ink);
      stroke(
        c,
        [
          [-306, 14],
          [-294, 26],
        ],
        C.ink,
        3,
      );
      const transition = E(t, 1.15, 0.25);
      alpha(c, 1 - transition, () =>
        txt(c, "Para onde vamos?", -45, 0, 40, C.ink, 450, "center"),
      );
      alpha(c, transition, () =>
        txt(c, "Madeira".slice(0, typed), -246, 0, 42, C.ink, 500),
      );
      disk(c, 330, 0, 38, C.orange);
      arrow(c, 330, 0, 15, C.ink);
    });
    if (p > 0) {
      c.save();
      c.beginPath();
      c.roundRect(-width / 2, -height / 2, width, height, radius);
      c.clip();
      alpha(c, fade(t, 2.3, 1.2), () => {
        const photoH = 820,
          scale = 1 + 0.02 * E(t, 3.8, 2.6);
        c.save();
        c.beginPath();
        c.rect(-530, -540, 1060, 820);
        c.clip();
        c.translate(0, -130);
        c.scale(scale, scale);
        c.drawImage(assets.photo, -530, -530, 1060, 1060);
        c.restore();
        const shade = c.createLinearGradient(0, 60, 0, 280);
        shade.addColorStop(0, "#061a2d00");
        shade.addColorStop(1, "#061a2d60");
        c.fillStyle = shade;
        c.fillRect(-530, 60, 1060, 220);
        txt(c, "PORTUGAL · ATLÂNTICO", -444, 230, 24, C.white, 550);
      });
      alpha(c, fade(t, 2.75, 0.9), () => {
        txt(c, "Madeira", -444, 355, 100, C.ink, 550);
        txt(c, "Uma ilha. Mil caminhos.", -440, 440, 31, "#70808a", 400);
        disk(c, 425, 400, 48, C.orange);
        arrow(c, 425, 400, 19, C.ink);
      });
      c.restore();
    }
  }
  function contours(t) {
    const island = (ox, oy, sx, sy, rotation) => {
      c.save();
      c.translate(ox, oy);
      c.rotate(rotation);
      for (let k = 0; k < 8; k++) {
        const factor = 1 + k * 0.11;
        c.beginPath();
        for (let i = 0; i <= 140; i++) {
          const a = (i / 140) * Math.PI * 2,
            r = 1 + 0.1 * Math.sin(3 * a) + 0.06 * Math.cos(5 * a);
          const x = Math.cos(a) * sx * r * factor,
            y = Math.sin(a) * sy * r * factor;
          if (i) c.lineTo(x, y);
          else c.moveTo(x, y);
        }
        c.closePath();
        if (k === 0) {
          c.fillStyle = "#244e5e";
          c.fill();
        }
        c.strokeStyle = k === 0 ? "#52717a" : "#315564";
        c.lineWidth = k === 0 ? 2 : 1.3;
        c.stroke();
      }
      c.restore();
    };
    island(-320, 200, 130, 210, -0.7);
    island(320, -155, 178, 75, -0.42);
  }
  function map(t) {
    const move = E(t, 6.15, 1.65),
      ticket = E(t, 10.8, 1.55);
    const x = 1650 * move,
      w = mix(1060, 1160, move),
      h = mix(1080, 1080, move);
    alpha(c, 1 - ticket, () => {
      plate(x, 0, w, h, 48, C.sea, 1);
      c.save();
      c.translate(x, 0);
      c.beginPath();
      c.roundRect(-w / 2, -h / 2, w, h, 48);
      c.clip();
      alpha(c, move, () => {
        contours(t);
        txt(c, "O CAMINHO TAMBÉM É A VIAGEM.", -470, -429, 27, "#d4e5e8", 500);
        txt(c, "Seu próximo capítulo.", -470, -368, 47, C.white, 450);
        const full = pathPoints(1);
        c.save();
        c.setLineDash([3, 14]);
        stroke(c, full, "#ffffff3c", 3);
        c.restore();
        const draw = E(t, 7.8, 2.7);
        if (draw > 0) stroke(c, pathPoints(draw), C.orange, 8);
        ring(c, -380, 250, 12, 3, C.white);
        alpha(c, E(t, 7.4, 0.6), () => {
          txt(c, "LISBOA", -380, 312, 23, "#e2e9e6", 550, "center");
          txt(c, "MADEIRA", 340, -230, 23, "#e2e9e6", 550, "center");
        });
        txt(c, "ENCONTRE SEU LUGAR.", -470, 438, 22, "#97b2bd", 500);
      });
      c.restore();
    });
  }
  function pointAndTicket(t) {
    const p = E(t, 7.8, 2.7),
      q = route(p),
      m = E(t, 10.8, 1.55),
      fold = E(t, 14, 1.7);
    const x = mix(1650 + q.x, 2390, fold),
      y = mix(q.y, 70, fold),
      w = mix(mix(36, 1060, m), 180, fold),
      h = mix(mix(36, 580, m), 180, fold),
      rad = mix(mix(18, 42, m), 90, fold);
    const fill = color(color(C.orange, C.white, m), C.orange, fold);
    plate(x, y, w, h, rad, fill, m * (1 - fold));
    if (m > 0) {
      c.save();
      c.beginPath();
      c.roundRect(x - w / 2, y - h / 2, w, h, rad);
      c.clip();
      alpha(c, fade(t, 10.8, 1.55) * (1 - E(t, 14, 0.95)), () => {
        c.save();
        c.translate(x, y);
        c.scale(w / 1060, w / 1060);
        c.translate(-x, -y);
        txt(c, "ÓRBITA", x - 445, y - 208, 27, C.ink, 650);
        txt(c, "BOARDING PASS", x + 445, y - 208, 20, "#79909a", 500, "right");
        txt(c, "LIS", x - 445, y - 73, 118, C.ink, 550);
        txt(c, "FNC", x + 180, y - 73, 118, C.ink, 550);
        txt(c, "Lisboa", x - 440, y + 17, 30, "#71848d", 450);
        txt(c, "Madeira", x + 187, y + 17, 30, "#71848d", 450);
        arrow(c, x - 20, y - 66, 48, C.orange);
        c.save();
        c.setLineDash([5, 11]);
        stroke(
          c,
          [
            [x - 530, y + 94],
            [x + 530, y + 94],
          ],
          "#c7cfd0",
          2,
        );
        c.restore();
        txt(c, "PRONTO PARA PARTIR.", x - 440, y + 163, 29, C.ink, 550);
        txt(
          c,
          "Sua história começa aqui.",
          x - 440,
          y + 211,
          23,
          "#70868f",
          400,
        );
        disk(c, x + 360, y + 180, 43, C.orange);
        stroke(
          c,
          [
            [x + 343, y + 180],
            [x + 355, y + 191],
            [x + 379, y + 166],
          ],
          C.ink,
          4,
        );
        c.restore();
      });
      c.restore();
    }
    return { x, y };
  }
  function brand(t) {
    const b = E(t, 15.7, 1.3),
      lock = E(t, 16.8, 1),
      ret = E(t, 18.5, 2.7),
      cx = 2390 * (1 - ret),
      cy = 70 * (1 - ret),
      x = cx + mix(-220 * lock, -320, ret),
      radius = mix(90, 18, ret);
    const col = color(C.orange, C.ink, ret),
      thick = mix(mix(90, 9, b), 3, ret);
    c.beginPath();
    c.arc(x, cy, radius, 0, Math.PI * 2);
    c.arc(x, cy, Math.max(0.001, radius - thick), 0, Math.PI * 2, true);
    c.fillStyle = col;
    c.fill();
    alpha(c, b * (1 - ret), () => {
      c.save();
      c.translate(x, cy);
      c.rotate(-0.38);
      c.beginPath();
      c.ellipse(0, 0, 140, 54, 0, 0, Math.PI * 2);
      c.lineWidth = 3;
      c.strokeStyle = "#f4d4b7";
      c.stroke();
      const a = -0.7 + (t - 15.7) * 0.62;
      disk(c, Math.cos(a) * 140, Math.sin(a) * 54, 11, C.white);
      c.restore();
    });
    alpha(c, lock * (1 - E(t, 18.5, 0.9)), () => {
      txt(c, "órbita", cx - 91, cy + 3, 116, C.white, 500);
      txt(
        c,
        "Seu próximo destino.",
        cx,
        cy + 119,
        31,
        "#a6bcc7",
        400,
        "center",
      );
    });
    alpha(c, E(t, 20.15, 1), () =>
      stroke(
        c,
        [
          [x + 13, cy + 13],
          [x + 26, cy + 26],
        ],
        C.ink,
        3,
      ),
    );
  }
  function drawCursor(t) {
    let a = { x: 510, y: 270 };
    const pulse = (at) => 1 - Math.min(1, Math.abs(t - at) / 0.16);
    if (t < 2.3) a = between(a, { x: 330, y: 0 }, E(t, 0.1, 1.05));
    else if (t < 6.15)
      a = between({ x: 330, y: 0 }, { x: 425, y: 400 }, E(t, 3.8, 1.9));
    else if (t < 7.8)
      a = between({ x: 425, y: 400 }, { x: 1270, y: 250 }, E(t, 6.15, 1.65));
    else if (t < 10.8) {
      const r = route(E(t, 7.8, 2.7));
      a = { x: 1650 + r.x, y: r.y };
    } else if (t < 14) {
      a = between({ x: 1990, y: -160 }, { x: 2350, y: 20 }, E(t, 12.2, 1.5));
    } else if (t < 15) {
      a = between({ x: 2350, y: 20 }, { x: 2400, y: 110 }, E(t, 14, 1));
    } else a = { x: 510, y: 270 };
    const opacity = 1 - E(t, 14, 0.7) + E(t, 20.5, 1.1);
    alpha(c, opacity, () =>
      pointer(
        c,
        assets.pointer,
        a.x,
        a.y,
        Math.max(pulse(1.15), pulse(6.15), pulse(14)),
      ),
    );
    return a;
  }
  function seek(time, displayTime = time) {
    const t = time >= 1319 / 60 ? 0 : Math.max(0, time),
      camera = cam(t);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.shadowColor = "transparent";
    c.shadowBlur = 0;
    c.shadowOffsetY = 0;
    c.setLineDash([]);
    const bg = c.createLinearGradient(0, 0, 1440, 1440);
    bg.addColorStop(0, "#faf8f2");
    bg.addColorStop(1, "#e9e6de");
    c.fillStyle = bg;
    c.fillRect(0, 0, 1440, 1440);
    const enter = E(t, 6.15, 1.15),
      leave = E(t, 18.65, 1.25);
    if (enter > 0) {
      c.save();
      const trigger = {
        x: 720 + (425 - camera.x) * camera.z,
        y: 720 + (400 - camera.y) * camera.z,
      };
      c.beginPath();
      c.arc(trigger.x, trigger.y, enter * 6000, 0, Math.PI * 2);
      c.clip();
      c.fillStyle = C.navy;
      c.fillRect(0, 0, 1440, 1440);
      c.restore();
    }
    if (leave > 0) {
      c.save();
      const trigger = { x: 720 - 220 * (1 - E(t, 18.5, 2.7)), y: 720 };
      c.beginPath();
      c.arc(trigger.x, trigger.y, leave * 1900, 0, Math.PI * 2);
      c.clip();
      c.fillStyle = bg;
      c.fillRect(0, 0, 1440, 1440);
      c.restore();
    }
    c.save();
    c.translate(720, 720);
    c.scale(camera.z, camera.z);
    c.translate(-camera.x, -camera.y);
    if (t < 7.8) {
      const move = E(t, 6.15, 1.65);
      c.save();
      c.translate(1650 * move, 0);
      alpha(c, 1 - fade(t, 6.15, 1.65), () => field(t));
      c.restore();
    }
    if (t >= 6.15 && t < 12.35) alpha(c, fade(t, 6.15, 1.65), () => map(t));
    if (t >= 7.2 && t < 15.7) alpha(c, E(t, 7.2, 0.6), () => pointAndTicket(t));
    if (t >= 18.5) field(t, true);
    if (t >= 15.7) brand(t);
    const pointerPosition = drawCursor(t);
    c.restore();
    return {
      time: t,
      camera,
      route: route(E(t, 7.8, 2.7)),
      pointer: pointerPosition,
    };
  }
  return { seek };
}
