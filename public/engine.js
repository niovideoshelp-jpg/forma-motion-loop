/* FORMA — one canvas, seekable 2D world. No animation state survives seek(). */
export const W = 1440,
  H = 1440,
  FPS = 60,
  DURATION = 22;
export const TIMES = {
  drop: 6.55,
  swipe: 8.85,
  volume: 10.4,
  pull: 11.6,
  pan: 12.4,
  chart: 13.2,
  dive: 15.6,
  ask: 16.4,
  logo: 18.5,
  fold: 19.6,
  loop: 21.983333333333334,
};
const C = {
  paper: "#f3f3f0",
  paper2: "#e3e3de",
  ink: "#111211",
  green: "#1ed760",
  white: "#f8f8f5",
  orange: "#d47755",
};
const clamp = (v) => Math.max(0, Math.min(1, v)),
  mix = (a, b, p) => a + (b - a) * p;
export function ease(x) {
  x = clamp(x);
  let l = 0,
    h = 1;
  for (let i = 0; i < 18; i++) {
    const t = (l + h) / 2,
      s = 1 - t,
      v = 3 * s * s * t * 0.45 + 3 * s * t * t * 0.15 + t * t * t;
    if (v < x) l = t;
    else h = t;
  }
  const t = (l + h) / 2;
  return 3 * (1 - t) * t * t + t * t * t;
}
const E = (t, a, d = 0.8) => ease((t - a) / d),
  back = (t, a) => E(t, a + 0.4, 0.4),
  rgba = (a) => `rgba(255,255,255,${a})`;
function circle(c, x, y, r, fill) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}
function rr(c, x, y, w, h, r, fill) {
  if (w <= 0 || h <= 0) return;
  c.beginPath();
  c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  c.fillStyle = fill;
  c.fill();
}
function text(
  c,
  s,
  x,
  y,
  size = 40,
  col = C.ink,
  weight = 500,
  align = "left",
) {
  c.fillStyle = col;
  c.font = `${weight} ${size}px Geist, sans-serif`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
function line(c, pts, color, width = 5) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.stroke();
}
function shadow(c, h = 1) {
  c.shadowColor = `rgba(0,0,0,${0.1 * h})`;
  c.shadowBlur = 44 * h;
  c.shadowOffsetY = 18 * h;
}
function noShadow(c) {
  c.shadowColor = "transparent";
  c.shadowBlur = 0;
  c.shadowOffsetY = 0;
}
function cursor(c, x, y, scale = 1, down = 0, alpha = 1) {
  c.save();
  c.globalAlpha *= alpha;
  c.translate(x, y);
  c.scale(scale * (1 - down * 0.1), scale * (1 - down * 0.1));
  c.drawImage(c.pointer, -25.23, -14.568, 76.8, 76.8);
  c.restore();
}
function heart(c, x, y, liked) {
  c.save();
  c.translate(x, y);
  c.beginPath();
  c.moveTo(0, 12);
  c.bezierCurveTo(-42, -12, -20, -44, 0, -24);
  c.bezierCurveTo(20, -44, 42, -12, 0, 12);
  c.closePath();
  c.fillStyle = C.green;
  c.strokeStyle = liked > 0.5 ? C.green : "#c7ccc8";
  c.lineWidth = 3;
  if (liked > 0) {
    c.globalAlpha = liked;
    c.fill();
    c.globalAlpha = 1;
  }
  c.stroke();
  c.restore();
}
function triangle(c, x, y, r, p = 1, color = C.ink) {
  c.beginPath();
  const verts = [
    [r * 0.92, 0],
    [-r * 0.56, r * 0.84],
    [-r * 0.56, -r * 0.84],
  ];
  for (let i = 0; i < 90; i++) {
    const edge = Math.floor(i / 30),
      f = (i % 30) / 30,
      a = verts[edge],
      b = verts[(edge + 1) % 3],
      angle = (i / 90) * Math.PI * 2,
      px = mix(Math.cos(angle) * r, mix(a[0], b[0], f), p),
      py = mix(Math.sin(angle) * r, mix(a[1], b[1], f), p);
    if (i) c.lineTo(x + px, y + py);
    else c.moveTo(x + px, y + py);
  }
  c.closePath();
  c.fillStyle = color;
  c.fill();
}
function camera(t) {
  let x = 0,
    y = 0,
    z = 1;
  for (const [a, nx, ny, nz] of [
    [6.75, 0, -390, 0.79],
    [10, 190, 215, 1.65],
    [12.4, 2090, 215, 1],
    [13.2, 2160, -40, 1],
    [15.6, 2680, -240, 38],
  ]) {
    const p = E(t, a);
    x = mix(x, nx, p);
    y = mix(y, ny, p);
    z = Math.exp(mix(Math.log(z), Math.log(nz), p));
  }
  return { x, y, z };
}
export function knob(t) {
  return {
    x: mix(mix(mix(20, 280, E(t, 10.8)), 500, E(t, 11.6)), 2680, E(t, 12.4)),
    y: mix(215, -240, E(t, 13.2)),
  };
}
function withCamera(c, cam, fn) {
  c.save();
  c.translate(720, 720);
  c.scale(cam.z, cam.z);
  c.translate(-cam.x, -cam.y);
  fn();
  c.restore();
}
function cover(c, img, x, y, size) {
  c.save();
  c.beginPath();
  c.roundRect(x, y, size, size, 20);
  c.clip();
  c.drawImage(img, x, y, size, size);
  c.restore();
}
function fan(c, x, y, p, fold = 0) {
  c.save();
  c.translate(x, y);
  for (let i = 0; i < 6; i++) {
    c.save();
    c.rotate(mix(0, (i * Math.PI) / 6, p) * (1 - fold));
    const w = mix(520, 350, p),
      h = mix(8, 24, p);
    rr(c, -w / 2, -h / 2, w, h, h / 2, C.orange);
    c.restore();
  }
  c.restore();
}
export async function loadAssets(base = "./assets/") {
  const [a, b, pointer] = await Promise.all(
    ["after-the-rain.png", "dune.png", "macos-pointer.png"].map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = base + src;
        }),
    ),
  );
  const font = new FontFace(
    "Geist",
    `url(${base}geist-latin-wght-normal.woff2)`,
  );
  await font.load();
  document.fonts.add(font);
  return { a, b, pointer };
}
export function createRenderer(canvas, assets) {
  const c = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = W;
  canvas.height = H;
  c.pointer = assets.pointer;
  const goo = document.createElement("canvas");
  goo.width = 720;
  goo.height = 720;
  const g = goo.getContext("2d", { willReadFrequently: true });
  const blur = document.createElement("canvas");
  blur.width = 720;
  blur.height = 720;
  const gc = blur.getContext("2d", { willReadFrequently: true });
  function gooDots(positions) {
    g.clearRect(0, 0, 720, 720);
    g.save();
    g.translate(360, 360);
    g.scale(0.5, 0.5);
    for (const d of positions) circle(g, d.x, d.y, d.r, C.ink);
    g.restore();
    gc.clearRect(0, 0, 720, 720);
    gc.filter = "blur(3px)";
    gc.drawImage(goo, 0, 0);
    gc.filter = "none";
    const im = gc.getImageData(0, 0, 720, 720);
    for (let i = 3; i < im.data.length; i += 4)
      im.data[i] = Math.max(0, Math.min(255, (im.data[i] - 105) * 25));
    gc.putImageData(im, 0, 0);
    c.drawImage(blur, 0, 0, 720, 720, -720, -720, 1440, 1440);
  }
  function opening(t) {
    if (t < 2.15) {
      const p = E(t, 0.55),
        check = E(t, 1.35);
      c.save();
      shadow(c, 1);
      rr(c, -mix(240, 70, p), -70, mix(480, 140, p), 140, 70, C.ink);
      c.restore();
      c.save();
      c.globalAlpha = 1 - back(t, 0.55);
      text(c, "Generate", 0, 0, 46, C.white, 550, "center");
      c.restore();
      if (p > 0.05) {
        c.save();
        c.globalAlpha = p * (1 - check);
        c.rotate((t - 0.55) * 4);
        c.beginPath();
        c.arc(0, 0, 26, -1, 3.6);
        c.strokeStyle = C.white;
        c.lineWidth = 5;
        c.lineCap = "round";
        c.stroke();
        c.restore();
      }
      if (check > 0) {
        c.save();
        c.globalAlpha = check;
        line(
          c,
          [
            [-24, 0],
            [-5, 20],
            [28, -20],
          ],
          C.white,
          7,
        );
        c.restore();
      }
    } else if (t < 2.95) {
      const p = E(t, 2.15);
      gooDots([
        { x: -90 * p, y: 0, r: mix(70, 23, p) },
        { x: 0, y: 0, r: mix(70, 23, p) },
        { x: 90 * p, y: 0, r: mix(70, 23, p) },
      ]);
      c.save();
      c.globalAlpha = 1 - back(t, 2.15);
      line(
        c,
        [
          [-24, 0],
          [-5, 20],
          [28, -20],
        ],
        C.white,
        7,
      );
      c.restore();
    } else if (t < 5.6) {
      const a = E(t, 2.95),
        b = E(t, 3.75),
        out = E(t, 4.8),
        qa = a * (1 - out),
        qb = b * (1 - out),
        dx = [mix(-90, -64, qa) * (1 - out), mix(90, 75, qb) * (1 - out)],
        dy = [-112 * qa, 112 * qb];
      for (let i = 0; i < 2; i++) {
        const p = i ? qb : qa,
          w = mix(46, i ? 604 : 582, p),
          h = mix(46, 142, p);
        c.save();
        shadow(c, p);
        rr(c, dx[i] - w / 2, dy[i] - h / 2, w, h, mix(23, 40, p), C.ink);
        c.restore();
        const str = i ? "yes. every frame." : "is this all code?",
          n = Math.floor(clamp((t - (i ? 4.1 : 3.32)) / 0.55) * str.length);
        c.save();
        c.beginPath();
        c.roundRect(dx[i] - w / 2, dy[i] - h / 2, w, h, mix(23, 40, p));
        c.clip();
        c.globalAlpha = back(t, i ? 3.75 : 2.95) * (1 - back(t, 4.8));
        text(c, str.slice(0, n), dx[i], dy[i], 46, C.white, 500, "center");
        c.restore();
      }
      circle(c, 0, 0, 23, C.ink);
      c.save();
      c.globalAlpha = E(t, 4.8);
      gooDots([
        { x: dx[0], y: dy[0], r: 23 },
        { x: 0, y: 0, r: mix(23, 50, out) },
        { x: dx[1], y: dy[1], r: 23 },
      ]);
      c.restore();
    } else {
      triangle(c, 0, 0, mix(50, 68, E(t, 5.6)), E(t, 5.6));
    }
    const enter = E(t, 0.05, 0.5),
      leave = E(t, 0.9);
    let x = mix(410, 144, enter),
      y = mix(260, 23, enter),
      alpha = 1 - leave;
    if (t > 5.6) {
      const p = E(t, 5.6);
      x = mix(380, 8, p);
      y = mix(220, 8, p);
      alpha = p;
    }
    cursor(c, x, y, 1, Math.max(0, 1 - Math.abs(t - 0.55) / 0.12), alpha);
  }
  function app(t) {
    const s = E(t, 8.85),
      show = back(t, 6.75);
    c.save();
    c.globalAlpha = show;
    text(c, "FORMA  /  SESSIONS", -440, -1130, 24, rgba(0.65), 600);
    text(c, "•••", 440, -1130, 30, C.white, 600, "right");
    c.save();
    c.beginPath();
    c.rect(-400, -1030, 800, 800);
    c.clip();
    cover(c, assets.a, -400 - s * 900, -1030, 800);
    cover(c, assets.b, 500 - s * 900, -1030, 800);
    c.restore();
    c.save();
    c.globalAlpha *= 1 - s;
    text(c, "After the rain", -400, -153, 61, C.white, 570);
    text(c, "Forma Sessions · Vol. 01", -400, -95, 28, rgba(0.52), 400);
    c.restore();
    c.save();
    c.globalAlpha *= s;
    text(c, "Dune / 02", -400, -153, 61, C.white, 570);
    text(c, "Forma Sessions · Vol. 02", -400, -95, 28, rgba(0.52), 400);
    c.restore();
    heart(c, 390, -136, E(t, 7.6));
    line(
      c,
      [
        [-400, -32],
        [400, -32],
      ],
      rgba(0.16),
      5,
    );
    line(
      c,
      [
        [-400, -32],
        [mix(-305, -255, clamp((t - 7) / 4)), -32],
      ],
      C.green,
      5,
    );
    circle(c, mix(-305, -255, clamp((t - 7) / 4)), -32, 6, C.green);
    text(c, "0:42", -400, 8, 18, rgba(0.5), 400);
    text(c, "3:28", 400, 8, 18, rgba(0.5), 400, "right");
    line(
      c,
      [
        [-196, 51],
        [-196, 89],
      ],
      C.white,
      5,
    );
    c.save();
    c.translate(-177, 70);
    c.rotate(Math.PI);
    triangle(c, 0, 0, 21, 1, C.white);
    c.restore();
    line(
      c,
      [
        [196, 51],
        [196, 89],
      ],
      C.white,
      5,
    );
    triangle(c, 177, 70, 21, 1, C.white);
    line(
      c,
      [
        [-340, 65],
        [-325, 80],
        [-306, 61],
      ],
      rgba(0.6),
      3,
    );
    line(
      c,
      [
        [306, 62],
        [333, 62],
        [333, 82],
        [309, 82],
      ],
      rgba(0.6),
      3,
    );
    c.restore();
    const move = E(t, 6.75),
      by = mix(0, 70, move),
      radius = mix(78, 58, move);
    circle(c, 0, by, radius, C.white);
    triangle(c, 5, by, mix(48, 24, move), 1, C.ink);
    if (show > 0) {
      c.save();
      c.globalAlpha = show;
      line(
        c,
        [
          [-280, 215],
          [280, 215],
        ],
        rgba(0.18),
        6,
      );
      const k = knob(t);
      line(
        c,
        [
          [-280, 215],
          [Math.min(k.x, 280), 215],
        ],
        C.green,
        6,
      );
      text(c, "−", -336, 215, 32, rgba(0.6));
      text(c, "+", 328, 215, 30, rgba(0.6));
      c.restore();
    }
    const k = knob(t);
    if (t >= 11.6 && t < 13.2) {
      const bend = E(t, 11.6) * (1 - E(t, 12.4));
      c.beginPath();
      c.moveTo(280, 215);
      c.bezierCurveTo(
        470,
        215 + 80 * bend,
        k.x - 200,
        k.y + 40 * bend,
        k.x,
        k.y,
      );
      c.strokeStyle = C.green;
      c.lineWidth = 6;
      c.stroke();
    }
    if (t < 13.2) circle(c, k.x, k.y, 14, C.white);
    let px = 8,
      py = 8;
    if (t < 7.6) {
      const p = E(t, 6.75);
      px = mix(8, 390, p);
      py = mix(8, -140, p);
    } else if (t < 8.4) {
      px = 390;
      py = -140;
    } else if (t < 9.65) {
      const p = E(t, 8.05);
      px = mix(390, 195, p) - s * 660;
      py = mix(-140, -655, p);
    } else if (t < 10.8) {
      const p = E(t, 9.65);
      px = mix(-465, 20, p);
      py = mix(-655, 215, p);
    } else {
      px = k.x;
      py = k.y;
    }
    if (t < 13.2)
      cursor(c, px, py, 1, Math.max(0, 1 - Math.abs(t - 7.6) / 0.15));
  }
  function chart(t) {
    const p = E(t, 13.2),
      k = knob(t);
    if (t < 12.4) return;
    c.save();
    c.globalAlpha = E(t, 12.4);
    for (let x = 1160; x < 3300; x += 42)
      for (let y = -900; y < 1200; y += 42) circle(c, x, y, 1.4, "#454a46");
    c.restore();
    const points = [
      [280, 215],
      [1450, 215],
      [1670, 170],
      [1840, 206],
      [2060, 48],
      [2250, 84],
      [2470, -128],
      [2680, -240],
    ].map(([x, y]) => [x, mix(215, y, p)]);
    c.save();
    c.globalAlpha = p;
    const grd = c.createLinearGradient(0, -240, 0, 400);
    grd.addColorStop(0, "#1ed76020");
    grd.addColorStop(1, "#1ed76000");
    c.beginPath();
    c.moveTo(points[0][0], 400);
    points.forEach(([x, y]) => c.lineTo(x, y));
    c.lineTo(2680, 400);
    c.closePath();
    c.fillStyle = grd;
    c.fill();
    c.restore();
    if (t >= 13.2) {
      line(c, points, C.green, 7);
      circle(c, k.x, k.y, 14, C.white);
    }
    c.save();
    c.globalAlpha = back(t, 13.2);
    text(c, "MADE WITH FORMA", 1515, -495, 25, rgba(0.5), 550);
    const n = Math.floor(clamp((Math.floor(t * 6) / 6 - 13.45) / 1.35) * 128);
    text(c, n.toLocaleString("en-US") + "%", 1505, -370, 139, C.white, 500);
    text(c, "from a single idea.", 1515, -250, 33, rgba(0.55), 400);
    text(c, "01", 1515, 454, 21, rgba(0.35));
    text(c, "07", 2650, 454, 21, rgba(0.35), "right");
    c.restore();
    if (t >= 13.2)
      cursor(
        c,
        k.x,
        k.y,
        1,
        Math.max(0, 1 - Math.abs(t - 15.6) / 0.15),
        1 - E(t, 15.6, 0.3),
      );
  }
  function ending(t) {
    const ask = E(t, 16.4),
      thin = E(t, 17.4),
      fanIn = E(t, 18.2),
      fold = E(t, 19.6),
      gen = E(t, 20.4);
    if (t < 18.2) {
      const w = mix(0, 520, ask),
        h = mix(140, 8, thin);
      c.save();
      shadow(c, 1 - thin);
      rr(
        c,
        -w / 2,
        -h / 2,
        w,
        h,
        h / 2,
        `rgb(${Math.round(mix(17, 212, thin))},${Math.round(mix(18, 119, thin))},${Math.round(mix(17, 85, thin))})`,
      );
      c.restore();
      c.save();
      c.globalAlpha = back(t, 16.4) * (1 - back(t, 17.4));
      text(c, "Ask Forma", 0, 0, 46, C.white, 550, "center");
      c.restore();
    } else if (t < 20.4) {
      fan(c, 0, 0, fanIn, fold);
    } else {
      const w = mix(350, 480, gen),
        h = mix(24, 140, gen);
      c.save();
      shadow(c, gen);
      rr(
        c,
        -w / 2,
        -h / 2,
        w,
        h,
        h / 2,
        `rgb(${Math.round(mix(212, 17, gen))},${Math.round(mix(119, 18, gen))},${Math.round(mix(85, 17, gen))})`,
      );
      c.restore();
      c.save();
      c.globalAlpha = back(t, 20.4);
      text(c, "Generate", 0, 0, 46, C.white, 550, "center");
      c.restore();
    }
    cursor(c, 410, 260, 1, 0, E(t, 21, 0.8));
  }
  function seek(time) {
    const t = clamp(time / DURATION) * DURATION,
      tt = t >= TIMES.loop ? 0 : t;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    noShadow(c);
    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, C.paper);
    bg.addColorStop(1, C.paper2);
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    if (tt < 6.55) {
      withCamera(c, { x: 0, y: 0, z: 1 }, () => opening(tt));
    } else if (tt < 16.4) {
      const f = E(tt, 6.55, 0.4);
      c.save();
      c.beginPath();
      c.arc(720, 720, Math.max(0.01, f * 1030), 0, Math.PI * 2);
      c.clip();
      const s = E(tt, 8.85),
        r = Math.round(mix(23, 42, s)),
        g1 = Math.round(mix(37, 29, s)),
        b = Math.round(mix(30, 24, s)),
        dark = c.createLinearGradient(0, 0, 0, H);
      dark.addColorStop(0, `rgb(${r},${g1},${b})`);
      dark.addColorStop(1, "#121212");
      c.fillStyle = dark;
      c.fillRect(0, 0, W, H);
      withCamera(c, camera(tt), () => {
        chart(tt);
        if (tt < 13.2) app(tt);
      });
      c.restore();
      if (tt < 6.95) {
        withCamera(c, { x: 0, y: 0, z: 1 }, () => {
          circle(c, 0, 0, 78 * E(tt, 6.55, 0.13), C.white);
          triangle(c, 0, 0, mix(68, 48, E(tt, 6.55, 0.13)), 1, C.ink);
          cursor(
            c,
            8,
            8,
            1,
            Math.max(0, 1 - (tt - 6.55) / 0.18),
            1 - E(tt, 6.55, 0.4),
          );
        });
      }
      if (tt >= 15.6) {
        const cam = camera(tt),
          sx = 720 + (2680 - cam.x) * cam.z,
          sy = 720 + (-240 - cam.y) * cam.z;
        circle(c, sx, sy, mix(0, 2200, E(tt, 15.6, 0.8)), bg);
      }
    } else {
      withCamera(c, { x: 0, y: 0, z: 1 }, () => ending(tt));
    }
    return { time: tt, camera: camera(tt), knob: knob(tt) };
  }
  return { seek };
}
