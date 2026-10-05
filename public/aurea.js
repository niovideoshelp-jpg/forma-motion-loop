/** AURÉA editorial. One canvas, a shared photograph and a fingertip-led world. */
import { createMotionRig } from "./aurea-motion.js";
export const W = 1080,
  H = 1920,
  FPS = 60,
  DURATION = 22;
const C = {
  plum: "#291C30",
  champagne: "#F4DFBF",
  cream: "#FFF8EE",
  green: "#176B45",
  muted: "#756977",
};
const clamp = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, q) => a + (b - a) * q;
function curve(v) {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  let lo = 0,
    hi = 1,
    u = v;
  for (let i = 0; i < 24; i++) {
    u = (lo + hi) / 2;
    const q = 1 - u;
    const x = 3 * q * q * u * 0.45 + 3 * q * u * u * 0.15 + u * u * u;
    if (x < v) lo = u;
    else hi = u;
  }
  return 3 * (1 - u) * u * u + u * u * u;
}
const E = (t, a, d = 0.8) => curve((t - a) / d);
const content = (t, a) => E(t, a + 0.4, 0.4);
const arrive = (t, a) => E(t, a + 0.16, 0.64);
const LAYOUT = {
  heroes: {
    noir: { x: 90, y: 907.5, w: 940, h: 1175 },
    lumiere: { x: 1050, y: 927.5, w: 940, h: 1175 },
    prune: { x: 2400, y: 907.5, w: 940, h: 1175 },
  },
  sharedPoses: [
    { x: 3470, y: 1000, w: 720, h: 900 },
    { x: 4358, y: 780, w: 416, h: 520 },
    { x: 5870, y: 900, w: 688, h: 860 },
  ],
  cta: { x: 385, y: 1535, w: 590, h: 104 },
  greenCta: { x: 540, y: 1535, w: 900, h: 112 },
  detailPose: { x: 3180, y: 1225, w: 360, h: 450 },
};
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = url;
    el.onload = resolve;
    el.onerror = () => reject(Error("Cannot load " + url));
    document.head.append(el);
  });
}
export async function loadAssets(base = "./assets/") {
  for (const [name, file] of [
    ["gsap", "gsap.min.js"],
    ["CustomEase", "CustomEase.min.js"],
    ["MotionPathPlugin", "MotionPathPlugin.min.js"],
    ["MorphSVGPlugin", "MorphSVGPlugin.min.js"],
  ])
    if (!globalThis[name]) await loadScript(base + "gsap/" + file);
  for (const [family, file, weight] of [
    ["AureaBodoni", "BodoniModa-500-opsz12.ttf", "500"],
    ["AureaManrope", "Manrope-normal-variable.ttf", "200 800"],
  ]) {
    const f = new FontFace(
      family,
      "url(" + base + "aurea/fonts/" + file + ")",
      { weight, style: "normal" },
    );
    await f.load();
    document.fonts.add(f);
  }
  const names = ["noir", "lumiere", "prune", "touchHand"];
  const images = await Promise.all(
    names.map(
      (name) =>
        new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => reject(Error("Cannot load " + name));
          im.src =
            base +
            "aurea/" +
            (name === "touchHand" ? "touch-hand-long.svg" : name + ".webp");
        }),
    ),
  );
  gsap.ticker.sleep();
  return Object.fromEntries(names.map((name, i) => [name, images[i]]));
}
function rr(c, x, y, w, h, r, fill) {
  if (w <= 0 || h <= 0) return;
  c.beginPath();
  c.roundRect(x - w / 2, y - h / 2, w, h, Math.min(r, w / 2, h / 2));
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
}
function alpha(c, a, fn) {
  if (a <= 0) return;
  c.save();
  c.globalAlpha *= clamp(a);
  fn();
  c.restore();
}
function clip(c, x, y, w, h, r, fn) {
  c.save();
  rr(c, x, y, w, h, r);
  c.clip();
  fn();
  c.restore();
}
function text(
  c,
  s,
  x,
  y,
  size,
  color = C.cream,
  font = "AureaManrope",
  weight = 500,
  align = "left",
  tracking = 0,
) {
  c.font = weight + " " + size + "px " + font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.letterSpacing = tracking + "px";
  c.fillText(s, x, y);
  c.letterSpacing = "0px";
}
function disk(c, x, y, r, col) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col;
  c.fill();
}
function chevron(c, x, y, col) {
  c.strokeStyle = col;
  c.lineWidth = 3;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(x - 7, y - 11);
  c.lineTo(x + 4, y);
  c.lineTo(x - 7, y + 11);
  c.stroke();
}
function whatsapp(c, x, y, color, size = 40) {
  c.save();
  c.translate(x, y);
  c.scale(size / 40, size / 40);
  c.strokeStyle = color;
  c.fillStyle = color;
  c.lineWidth = 2.7;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(-17, 18);
  c.lineTo(-13, 10);
  c.bezierCurveTo(-25, -8, -8, -25, 8, -17);
  c.bezierCurveTo(27, -8, 20, 20, 1, 20);
  c.bezierCurveTo(-4, 20, -7, 19, -10, 17);
  c.closePath();
  c.stroke();
  c.beginPath();
  c.moveTo(-6, -9);
  c.bezierCurveTo(-10, -8, -8, -1, -2, 5);
  c.bezierCurveTo(4, 11, 10, 12, 11, 7);
  c.lineTo(6, 4);
  c.lineTo(3, 6);
  c.bezierCurveTo(-1, 4, -4, 1, -5, -3);
  c.lineTo(-3, -5);
  c.closePath();
  c.fill();
  c.restore();
}
function picture(c, im, rect, r = 0) {
  clip(c, rect.x, rect.y, rect.w, rect.h, r, () =>
    c.drawImage(im, rect.x - rect.w / 2, rect.y - rect.h / 2, rect.w, rect.h),
  );
}
function morphPath(from, to) {
  const v = { d: from };
  const tween = gsap.to(v, {
    morphSVG: { shape: to, prop: "d", precision: 5 },
    duration: 1,
    ease: "none",
    paused: true,
    lazy: false,
  });
  tween.progress(1, true).progress(0, true);
  return (p) => {
    tween.progress(clamp(p), true);
    return v.d;
  };
}
export function createRenderer(canvas, assets) {
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  gsap.registerPlugin(CustomEase, MotionPathPlugin, MorphSVGPlugin);
  const rig = createMotionRig(LAYOUT);
  const pill = morphPath(
    "M-77.5,0 H77.5 Z",
    "M-243,-52 H243 A52,52 0 0 1 295,0 A52,52 0 0 1 243,52 H-243 A52,52 0 0 1 -295,0 A52,52 0 0 1 -243,-52 Z",
  );
  const scene = (t) =>
    t < 3.3
      ? "noir"
      : t < 5.8
        ? "lumiere"
        : t < 8.3
          ? "prune"
          : t < 12.3
            ? "detail"
            : t < 16.3
              ? "whatsapp"
              : t < 20.3
                ? "brand"
                : "return";
  function brandSmall(cx, color) {
    text(c, "AURÉA", cx - 450, 270, 64, color, "AureaBodoni");
  }
  function label(
    cx,
    name,
    sub,
    t,
    dt,
    at,
    exit,
    right = false,
    returning = false,
  ) {
    const light = name === "Prune",
      col = light ? C.plum : C.cream;
    const a =
      (at === 0 || returning ? 1 : arrive(dt, at)) *
      (returning ? 1 : 1 - content(dt, exit));
    const q = at === 0 || returning ? 1 : E(t, at + 0.16, 0.64);
    alpha(c, a, () => {
      c.save();
      c.translate(0, 26 * (1 - q));
      brandSmall(cx, col);
      const x = cx + (right ? 450 : -450),
        align = right ? "right" : "left";
      text(
        c,
        name,
        x,
        390,
        name === "Lumière" ? 116 : 124,
        col,
        "AureaBodoni",
        500,
        align,
      );
      text(
        c,
        sub,
        x + (right ? -4 : 4),
        486,
        44,
        col,
        "AureaManrope",
        500,
        align,
      );
      if (name === "Noir") {
        text(c, "Para noites", cx - 446, 580, 40, col);
        text(c, "inesquecíveis.", cx - 446, 632, 40, col);
      }
      if (name === "Lumière")
        text(
          c,
          "Luz em movimento.",
          cx + 446,
          580,
          40,
          col,
          "AureaManrope",
          500,
          "right",
        );
      c.restore();
    });
  }
  function button(cx, t, label, green = false, a = 1, returning = false) {
    const rect = green ? LAYOUT.greenCta : LAYOUT.cta;
    const x = cx + rect.x - 540,
      y = rect.y,
      w = rect.w,
      h = rect.h;
    const fill = green ? 1 : returning ? 0 : E(t, 0.35, 0.8);
    alpha(c, a, () => {
      rr(c, x, y, w, h, h / 2, green ? C.green : undefined);
      c.strokeStyle = green ? C.green : C.champagne;
      c.lineWidth = 2.7;
      c.stroke();
      if (!green && fill > 0)
        clip(c, x, y, w, h, h / 2, () =>
          disk(c, x + w / 2, y, (w + 3) * fill, C.champagne),
        );
      const words = (col) => {
        if (green) whatsapp(c, x - w / 2 + 53, y, col, 39);
        text(
          c,
          label,
          x - w / 2 + (green ? 106 : 38),
          y,
          44,
          col,
          "AureaManrope",
          600,
        );
        chevron(c, x + w / 2 - 37, y, col);
      };
      words(green ? C.cream : C.champagne);
      if (!green && fill > 0) {
        c.save();
        c.beginPath();
        c.arc(x + w / 2, y, (w + 3) * fill, 0, Math.PI * 2);
        c.clip();
        words(C.plum);
        c.restore();
      }
    });
  }
  function detail(t, dt) {
    const cx = 3450,
      a = arrive(dt, 8.3) * (1 - content(dt, 12.3));
    alpha(c, a, () => {
      brandSmall(cx, C.plum);
      text(c, "O drapeado.", cx - 450, 400, 108, C.plum, "AureaBodoni");
      alpha(c, E(dt, 8.95, 0.15), () =>
        text(c, "Prune · longo ameixa", cx - 446, 490, 40, C.plum),
      );
      const q = E(t, 9.3),
        x = cx + 150,
        y = 1005,
        w = 568,
        h = 890;
      if (q > 0)
        clip(c, x, y, w * q, h, 0, () =>
          c.drawImage(
            assets.prune,
            420,
            345,
            355,
            555,
            x - w / 2,
            y - h / 2,
            w,
            h,
          ),
        );
      alpha(c, content(dt, 9.3), () => {
        text(c, "Prune", cx - 450, 885, 48, C.plum, "AureaBodoni");
        text(c, "Longo ameixa", cx - 450, 938, 36, C.muted);
      });
    });
  }
  function composer(t, dt) {
    const cx = 4600,
      a = arrive(dt, 12.3) * (1 - content(dt, 16.3));
    alpha(c, a, () => {
      brandSmall(cx, C.plum);
      text(c, "Vamos conversar?", cx - 450, 390, 96, C.plum, "AureaBodoni");
      whatsapp(c, cx + 95, 571, C.green, 35);
      text(c, "WhatsApp", cx + 131, 573, 40, C.green, "AureaManrope", 600);
      text(c, "Prune", cx + 65, 674, 84, C.plum, "AureaBodoni");
      text(c, "Longo", cx + 70, 770, 44, C.plum);
      text(c, "Ameixa", cx + 70, 833, 44, C.muted);
      rr(c, cx, 1265, 900, 350, 22, "#EEE7DC");
      alpha(c, content(dt, 12.3), () =>
        [
          "Olá! Tenho interesse no",
          "vestido Prune. Quais",
          "tamanhos estão",
          "disponíveis?",
        ].forEach((line, i) =>
          text(c, line, cx - 410, 1146 + i * 59, 44, C.plum),
        ),
      );
      text(c, "Rascunho", cx - 410, 1396, 38, C.muted);
    });
  }
  function brand(t, dt) {
    const cx = 5750,
      a = arrive(dt, 16.3) * (1 - content(dt, 20.3));
    alpha(c, a, () => {
      text(c, "AURÉA", cx - 450, 330, 150, C.champagne, "AureaBodoni");
      text(
        c,
        "VESTIDOS DE FESTA",
        cx - 446,
        430,
        34,
        C.cream,
        "AureaManrope",
        500,
        "left",
        2,
      );
      if (t < 20.3) {
        c.strokeStyle = C.champagne;
        c.lineWidth = 2.7;
        c.beginPath();
        c.moveTo(cx - 435, 481);
        c.lineTo(cx - 280, 481);
        c.stroke();
      }
      text(
        c,
        "Para o seu próximo evento.",
        cx - 450,
        1397,
        64,
        C.cream,
        "AureaBodoni",
      );
    });
  }
  function signature(t) {
    if (t < 20.3 || t >= 21.1) return;
    const q = E(t, 20.3),
      open = E(t, 20.7, 0.4);
    c.save();
    c.translate(mix(5750 - 357.5, 6900 - 155, q), mix(481, 1535, q));
    c.strokeStyle = C.champagne;
    c.lineWidth = 2.7;
    c.stroke(new Path2D(pill(open)));
    alpha(c, E(t, 20.9, 0.2), () => {
      text(c, "Ver coleção", -257, 0, 44, C.champagne, "AureaManrope", 600);
      chevron(c, 258, 0, C.champagne);
    });
    c.restore();
  }
  function flood(t, at, col, origin) {
    if (t < at) return;
    const q = E(t, at, 0.4);
    if (q === 1) {
      c.fillStyle = col;
      c.fillRect(0, 0, W, H);
      return;
    }
    const radius = Math.max(
      ...[
        [0, 0],
        [W, 0],
        [0, H],
        [W, H],
      ].map(([x, y]) => Math.hypot(x - origin.x, y - origin.y)),
    );
    disk(c, origin.x, origin.y, radius * 1.01 * q, col);
  }
  function drawHand(t, s) {
    const p = rig.touchGesture(t, s);
    if (p.opacity <= 0) return;
    alpha(c, p.opacity, () => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate((p.rotation * Math.PI) / 180);
      const scale = 0.84 * (1 - 0.028 * p.press);
      c.scale(scale, scale);
      c.shadowColor = "rgba(24,12,20,.13)";
      c.shadowBlur = 13;
      c.shadowOffsetX = 4;
      c.shadowOffsetY = 9;
      c.drawImage(assets.touchHand, -55, -15, 300, 1230);
      c.restore();
      if (p.contact && p.press > 0) {
        c.save();
        c.strokeStyle =
          scene(t) === "prune" ||
          scene(t) === "detail" ||
          scene(t) === "whatsapp"
            ? "rgba(41,28,48,.25)"
            : "rgba(244,223,191,.35)";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(p.x, p.y, 10 + 15 * (1 - p.press), 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }
    });
  }
  function diagnose(time) {
    const t = Math.max(0, Math.min(22, Number.isFinite(time) ? time : 0));
    const s = rig.sampleMotion(t),
      touch = rig.touchGesture(t, s),
      sc = scene(t);
    const green = t >= 10.9 && t < 20.7,
      first = t < 3.3 || t >= 20.7,
      rect = green ? LAYOUT.greenCta : LAYOUT.cta;
    return {
      t,
      scene: sc,
      camera: s.camera,
      shared: s.shared,
      portraits: s.portraits,
      pan: s.pan,
      touch,
      cursor: { ...touch, pulse: touch.press },
      activeDress:
        sc === "noir" || sc === "return"
          ? "Noir"
          : sc === "lumiere"
            ? "Lumière"
            : "Prune",
      cta: {
        rect: { ...rect, r: rect.h / 2 },
        hover: t >= 0.35 && t < 1.02,
        fill: green ? 1 : t >= 20.3 ? 0 : E(t, 0.35, 0.8),
        green,
        visible: green || t < 3.3 || t >= 21.1,
        space: green ? "screen" : "world",
        label: green ? "Peça pelo WhatsApp" : "Ver coleção",
      },
      composer: { draftComplete: t >= 13.1 && t < 16.3, sendEnabled: false },
      safeArea: { left: 90, right: 990, top: 240, bottom: 1600 },
    };
  }
  function seek(time, displayTime = time) {
    const t = Math.max(0, Math.min(22, Number.isFinite(time) ? time : 0)),
      dt = Math.max(
        0,
        Math.min(22, Number.isFinite(displayTime) ? displayTime : t),
      );
    const s = rig.sampleMotion(t),
      cam = s.camera;
    c.reset();
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = "high";
    c.fillStyle = C.plum;
    c.fillRect(0, 0, W, H);
    flood(t, 5.8, C.cream, rig.touchGesture(5.8, rig.sampleMotion(5.8)));
    flood(t, 16.3, C.plum, { x: 620, y: 1535 });
    c.save();
    c.translate(540, 960);
    c.scale(Math.exp(cam.logZoom), Math.exp(cam.logZoom));
    c.translate(-cam.x, -960 - cam.y);
    if (cam.x < 1250) picture(c, assets.noir, s.portraits.noir);
    if (cam.x > 0 && cam.x < 2350)
      picture(c, assets.lumiere, s.portraits.lumiere);
    if (t >= 5.8 && t < 21.1) picture(c, assets.prune, s.shared);
    if (cam.x > 5750) picture(c, assets.noir, s.portraits.return);
    if (cam.x < 1250) {
      label(0, "Noir", "Longo preto", t, dt, 0, 3.3);
      button(0, t, "Ver coleção", false, 1 - content(dt, 3.3));
    }
    if (cam.x > 0 && cam.x < 2350)
      label(1150, "Lumière", "Midi champanhe", t, dt, 3.3, 5.8, true);
    if (cam.x > 1200 && cam.x < 3350)
      label(2300, "Prune", "Longo ameixa", t, dt, 5.8, 8.3);
    if (t >= 8.3 && t < 13.1) detail(t, dt);
    if (t >= 12.3 && t < 17.1) composer(t, dt);
    if (t >= 16.3 && t < 21.1) brand(t, dt);
    if (t >= 9.3 && t < 13.1) picture(c, assets.prune, s.shared);
    if (cam.x > 5750) {
      label(6900, "Noir", "Longo preto", t, dt, 0, 22, false, true);
      if (t >= 21.1) button(6900, t, "Ver coleção", false, 1, true);
    }
    signature(t);
    c.restore();
    // One persistent mobile control. The touched target stays under the fingertip
    // while the editorial world and the draft travel behind it.
    if (t >= 10.5 && t < 20.7)
      button(540, t, "Peça pelo WhatsApp", true,
        content(dt, 10.5) * (1 - E(dt, 20.3, 0.4)));
    drawHand(t, s);
    return diagnose(t);
  }
  return { seek, inspect: diagnose };
}
