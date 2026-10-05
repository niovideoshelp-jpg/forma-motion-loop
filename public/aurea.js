/** AURÉA. One canvas, authored world, paused GSAP, no frame history. */
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
const mix = (a, b, p) => a + (b - a) * p;
function curve(v) {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  let lo = 0,
    hi = 1,
    u = v;
  for (let i = 0; i < 22; i++) {
    u = (lo + hi) / 2;
    const q = 1 - u,
      x = 3 * q * q * u * 0.45 + 3 * q * u * u * 0.15 + u * u * u;
    if (x < v) lo = u;
    else hi = u;
  }
  return 3 * (1 - u) * u * u + u * u * u;
}
const E = (t, a, d = 0.8) => curve((t - a) / d);
const content = (t, a) => E(t, a + 0.4, 0.4);
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
  const fonts = [
    ["AureaBodoni", "BodoniModa-500-opsz12.ttf", "500"],
    ["AureaManrope", "Manrope-normal-variable.ttf", "200 800"],
  ];
  for (const [family, file, weight] of fonts) {
    const f = new FontFace(
      family,
      "url(" + base + "aurea/fonts/" + file + ")",
      { weight, style: "normal" },
    );
    await f.load();
    document.fonts.add(f);
  }
  const images = await Promise.all(
    ["noir", "lumiere", "prune", "pointer"].map(
      (name) =>
        new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => reject(Error("Cannot load " + name));
          im.src =
            base +
            (name === "pointer"
              ? "macos-pointer.png"
              : "aurea/" + name + ".webp");
        }),
    ),
  );
  gsap.ticker.sleep();
  return Object.fromEntries(
    ["noir", "lumiere", "prune", "pointer"].map((name, i) => [name, images[i]]),
  );
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
function clip(c, x, y, w, h, r, fn) {
  c.save();
  rr(c, x, y, w, h, r);
  c.clip();
  fn();
  c.restore();
}
function alpha(c, a, fn) {
  if (a <= 0) return;
  c.save();
  c.globalAlpha *= clamp(a);
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
) {
  c.font = weight + " " + size + "px " + font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
function rule(c, x, y, w, color) {
  c.strokeStyle = color;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + w, y);
  c.stroke();
}
function arrow(c, x, y, col, size = 18) {
  c.strokeStyle = col;
  c.lineWidth = 3.5;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(x - size, y);
  c.lineTo(x + size, y);
  c.moveTo(x + size * 0.25, y - size * 0.7);
  c.lineTo(x + size, y);
  c.lineTo(x + size * 0.25, y + size * 0.7);
  c.stroke();
}
function shadow(c, x, y, w, h, r) {
  for (const [blur, dy, opacity] of [
    [38, 20, 0.07],
    [12, 5, 0.08],
  ]) {
    c.save();
    c.shadowBlur = blur;
    c.shadowOffsetY = dy;
    c.shadowColor = "rgba(20,12,24," + opacity + ")";
    rr(c, x, y, w, h, r, C.plum);
    c.restore();
  }
}
function photo(c, im, x, y, w, h, rad = 6) {
  shadow(c, x, y, w, h, rad);
  clip(c, x, y, w, h, rad, () => c.drawImage(im, x - w / 2, y - h / 2, w, h));
}
function disk(c, x, y, r, col) {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col;
  c.fill();
}
function morphPath(from, to) {
  const value = { d: from };
  const tween = gsap.to(value, {
    morphSVG: { shape: to, prop: "d", precision: 5 },
    duration: 1,
    ease: "none",
    paused: true,
    lazy: false,
  });
  tween.progress(1, true).progress(0, true);
  return (p) => {
    tween.progress(clamp(p), true);
    return value.d;
  };
}
function motion() {
  gsap.registerPlugin(CustomEase, MotionPathPlugin, MorphSVGPlugin);
  const ease = CustomEase.create("aureaGlide", "M0,0 C0.45,0 0.15,1 1,1");
  const camera = { x: 0, y: 0, logZoom: 0 };
  const shared = { x: 2240, y: 1000, w: 720, h: 900 };
  const tl = gsap.timeline({
    paused: true,
    defaults: { lazy: false, immediateRender: false, overwrite: false },
  });
  const poses = [
    [3.3, { x: 1150, y: 0, logZoom: 0 }],
    [5.8, { x: 2300, y: 0, logZoom: 0 }],
    [8.3, { x: 3450, y: -12, logZoom: Math.log(1.015) }],
    [12.3, { x: 4600, y: 0, logZoom: 0 }],
    [16.3, { x: 5750, y: 0, logZoom: 0 }],
    [20.3, { x: 6900, y: 0, logZoom: 0 }],
  ];
  let prior = { x: 0, y: 0, logZoom: 0 };
  for (const [at, next] of poses) {
    tl.fromTo(camera, prior, { ...next, duration: 0.8, ease }, at);
    prior = next;
  }
  const photoPoses = [
    [8.3, { x: 3300, y: 1000, w: 620, h: 775 }],
    [12.3, { x: 4450, y: 855, w: 288, h: 360 }],
    [16.3, { x: 5980, y: 970, w: 460, h: 575 }],
  ];
  let previous = { x: 2240, y: 1000, w: 720, h: 900 };
  for (const [at, next] of photoPoses) {
    tl.fromTo(shared, previous, { ...next, duration: 0.8, ease }, at);
    previous = next;
  }
  tl.to({}, { duration: 0.9 }, 21.1);
  tl.seek(22, true);
  tl.seek(0, true);
  gsap.ticker.sleep();
  const clean = (o) =>
    Object.fromEntries(Object.entries(o).filter(([k]) => k !== "_gsap"));
  return (t) => {
    tl.seek(t, true);
    const sh = clean(shared);
    for (const [a, b, dx, dy] of [
      [6.6, 8.3, 5, -3],
      [13.1, 16.3, 8, -6],
      [17.1, 20.3, -8, -7],
    ])
      if (t >= a && t <= b) {
        const drift = Math.sin(Math.PI * clamp((t - a) / (b - a))) ** 2;
        sh.x += dx * drift;
        sh.y += dy * drift;
      }
    return { camera: clean(camera), shared: sh };
  };
}
export function createRenderer(canvas, assets) {
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  const sampleMotion = motion();
  const flourish = morphPath(
    "M-180,0 L0,0 L180,0",
    "M-108,116 L0,-132 L108,116",
  );
  const lower = morphPath("M-80,0 L0,0 L80,0", "M-64,34 L0,34 L64,34");
  const pill = morphPath(
    "M-140.4,0 L140.4,0 Z",
    "M-385,-55 H385 A55,55 0 0 1 440,0 A55,55 0 0 1 385,55 H-385 A55,55 0 0 1 -440,0 A55,55 0 0 1 -385,-55 Z",
  );
  const screen = (x, y, cam) => ({
    x: 540 + (x - cam.x) * Math.exp(cam.logZoom),
    y: 960 + (y - 960 - cam.y) * Math.exp(cam.logZoom),
  });
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
  function cursor(t, s) {
    const camera = s.camera,
      sh = s.shared;
    let p = { x: 1015, y: 1710 },
      opacity = 1;
    function route(a, b, q) {
      return {
        x: mix(a.x, b.x, q),
        y: mix(a.y, b.y, q) - 18 * Math.sin(Math.PI * q),
      };
    }
    if (t < 0.35) p = route(p, { x: 980, y: 1530 }, E(t, 0.05, 0.3));
    else if (t < 3.3)
      p = route({ x: 980, y: 1530 }, { x: 805, y: 1530 }, E(t, 0.35, 0.8));
    else if (t < 5.5) {
      const q = E(t, 3.3, 0.8);
      p = screen(mix(265, 1450, q), mix(1530, 1200, q), camera);
    } else if (t < 5.8)
      p = route({ x: 840, y: 1200 }, { x: 900, y: 1250 }, E(t, 5.5, 0.3));
    else if (t < 6.6) {
      p = screen(1510, 1250, camera);
      opacity = 1 - E(t, 6.25, 0.35);
    } else if (t < 7.0) opacity = 0;
    else if (t < 8.3) {
      p = route({ x: 1030, y: 1660 }, { x: 681.6, y: 1090 }, E(t, 7, 0.6));
      opacity = E(t, 7, 0.4);
    } else if (t < 10.1)
      p = screen(sh.x + 0.28 * sh.w, sh.y + 0.1 * sh.h, camera);
    else if (t < 10.85) {
      p = route(
        { x: 563.954, y: 1091.4425 },
        { x: 1040, y: 1320 },
        E(t, 10.1, 0.75),
      );
    } else if (t < 11.25) {
      p = route({ x: 1040, y: 1320 }, { x: 1018, y: 1610 }, E(t, 10.85, 0.4));
    } else if (t < 12.3) {
      p = route({ x: 1018, y: 1610 }, { x: 805, y: 1530 }, E(t, 11.25, 0.75));
    } else if (t < 13.1) {
      p = { x: 805, y: 1530 };
    } else if (t < 16.3) {
      p = route({ x: 805, y: 1530 }, { x: 1015, y: 1710 }, E(t, 13.1, 0.8));
      opacity = 1 - E(t, 13.9, 0.4);
    } else if (t < 20.3) {
      p = route({ x: 1015, y: 1710 }, { x: 805, y: 1530 }, E(t, 17.7, 0.8));
      opacity = E(t, 17.7, 0.4);
    } else if (t < 20.7) {
      p = route({ x: 805, y: 1530 }, { x: 1015, y: 1710 }, E(t, 20.3, 0.4));
      opacity = 1 - E(t, 20.3, 0.4);
    } else {
      p = { x: 1015, y: 1710 };
      opacity = E(t, 21.3, 0.45);
    }
    const pulse = Math.max(
      ...[3.3, 8.3, 9.3, 12.3].map(
        (a) => E(t, a - 0.08, 0.08) * (1 - E(t, a, 0.14)),
      ),
    );
    return { ...p, opacity, pulse };
  }
  function header(cx, col, small = "VESTIDOS DE FESTA") {
    text(c, "AURÉA", cx - 444, 270, 64, col, "AureaBodoni", 500);
    text(c, small, cx + 444, 272, 32, col, "AureaManrope", 500, "right");
    rule(c, cx - 444, 309, 888, col);
  }
  function editorial(cx, name, subtitle, im, t, first = false) {
    const light = name === "Prune",
      col = light ? C.plum : C.cream;
    const start = name === "Noir" ? 0 : name === "Lumière" ? 3.3 : 5.8;
    const drift =
      first && cx === 6900
        ? 0
        : Math.sin(
            Math.PI *
              clamp(
                (t - start - (name === "Noir" ? 0.05 : 0)) /
                  (name === "Noir" ? 3.25 : 2.5),
              ),
          ) * 8;
    if (name !== "Prune")
      photo(c, im, cx + drift + (name === "Lumière" ? 60 : 0), 1000, 720, 900);
    header(cx, col);
    const lines = first
      ? ["Para noites", "inesquecíveis."]
      : name === "Lumière"
        ? ["Luz em", "movimento."]
        : ["Caimento", "que encanta."];
    text(c, lines[0], cx, 375, 96, col, "AureaBodoni", 500, "center");
    text(c, lines[1], cx, 471, 96, col, "AureaBodoni", 500, "center");
    text(c, name, cx - 444, 1439, 54, col, "AureaBodoni");
    text(c, subtitle, cx + 444, 1443, 40, col, "AureaManrope", 500, "right");
  }
  function liquidButton(
    cx,
    t,
    label,
    green = false,
    opacity = 1,
    returning = false,
  ) {
    alpha(c, opacity, () => {
      const y = 1530,
        w = 880,
        h = 110,
        r = 55;
      const fill = green ? 1 : returning ? 0 : E(t, 0.35, 0.8);
      c.save();
      c.shadowBlur = 18;
      c.shadowOffsetY = 7;
      c.shadowColor = "rgba(24,12,29,.10)";
      if (green) rr(c, cx, y, w, h, r, C.green);
      c.restore();
      rr(c, cx, y, w, h, r);
      c.strokeStyle = green ? C.green : C.champagne;
      c.lineWidth = 2.8;
      c.stroke();
      if (!green && fill > 0)
        clip(c, cx, y, w, h, r, () => {
          disk(c, cx + 440, 1530, 900 * fill, C.champagne);
        });
      const drawLabel = (fg) => {
        text(c, label, cx - 350, y, 44, fg, "AureaManrope", 600);
        arrow(c, cx + 370, y, fg);
      };
      drawLabel(green ? C.cream : C.champagne);
      if (!green && fill > 0) {
        c.save();
        c.beginPath();
        c.arc(cx + 440, 1530, 900 * fill, 0, Math.PI * 2);
        c.clip();
        drawLabel(C.plum);
        c.restore();
      }
    });
  }
  function detail(t, dt) {
    const cx = 3450;
    const inA = content(t, 8.3),
      outA = 1 - content(t, 12.3);
    alpha(c, inA * outA, () => {
      header(cx, C.plum, "PRUNE / LONGO");
      text(c, "Elegância", cx, 390, 96, C.plum, "AureaBodoni", 500, "center");
      text(
        c,
        "em cada detalhe.",
        cx,
        486,
        96,
        C.plum,
        "AureaBodoni",
        500,
        "center",
      );
      const q = E(t, 9.3, 0.8),
        x = cx + 275,
        y = 1020,
        w = 410 * q,
        h = 640 * q;
      if (q > 0) {
        shadow(c, x, y, w, h, 5);
        clip(c, x, y, w, h, 5, () => {
          const im = assets.prune;
          c.drawImage(im, 420, 345, 355, 555, x - w / 2, y - h / 2, w, h);
        });
      }
      alpha(c, content(t, 9.3), () => {
        text(
          c,
          "Drapeado",
          cx + 275,
          1400,
          44,
          C.plum,
          "AureaManrope",
          500,
          "center",
        );
        text(
          c,
          "Cetim",
          cx - 185,
          1414,
          44,
          C.plum,
          "AureaManrope",
          500,
          "center",
        );
      });
      liquidButton(cx, t, "Peça pelo WhatsApp", true, content(t, 10.5));
    });
  }
  function composer(t, dt) {
    const cx = 4600,
      a = content(t, 12.3) * (1 - content(t, 16.3));
    alpha(c, a, () => {
      header(cx, C.plum, "SEU VESTIDO, DIRETO");
      text(
        c,
        "Vamos conversar?",
        cx,
        397,
        108,
        C.plum,
        "AureaBodoni",
        500,
        "center",
      );
      shadow(c, cx, 1000, 880, 880, 30);
      rr(c, cx, 1000, 880, 880, 30, C.cream);
      text(c, "WhatsApp", cx - 380, 608, 48, C.green, "AureaManrope", 600);
      rule(c, cx - 380, 655, 760, "#ded1c2");
      text(c, "Prune", cx + 170, 788, 68, C.plum, "AureaBodoni", 500, "center");
      text(
        c,
        "Longo",
        cx + 170,
        872,
        44,
        C.plum,
        "AureaManrope",
        500,
        "center",
      );
      text(
        c,
        "Ameixa",
        cx + 170,
        932,
        44,
        C.muted,
        "AureaManrope",
        500,
        "center",
      );
      rr(c, cx, 1255, 780, 330, 22, "#eee7dc");
      alpha(c, content(dt, 12.3), () => {
        [
          "Olá! Tenho interesse",
          "no vestido Prune.",
          "Quais tamanhos estão",
          "disponíveis?",
        ].forEach((line, i) =>
          text(c, line, cx - 345, 1153 + i * 61, 44, C.plum),
        );
      });
      text(c, "Rascunho", cx - 345, 1384, 38, C.muted, "AureaManrope");
      arrow(c, cx + 341, 1384, "#a398a2", 16);
      liquidButton(cx, t, "Peça pelo WhatsApp", true);
    });
  }
  function brand(t) {
    const cx = 5750,
      a = content(t, 16.3) * (1 - content(t, 20.3));
    alpha(c, a, () => {
      text(c, "AURÉA", cx, 367, 150, C.champagne, "AureaBodoni", 500, "center");
      text(
        c,
        "VESTIDOS DE FESTA",
        cx,
        478,
        34,
        C.cream,
        "AureaManrope",
        500,
        "center",
      );
      text(
        c,
        "Seu próximo evento",
        cx,
        1332,
        82,
        C.cream,
        "AureaBodoni",
        500,
        "center",
      );
      text(
        c,
        "começa aqui.",
        cx,
        1414,
        82,
        C.cream,
        "AureaBodoni",
        500,
        "center",
      );
      liquidButton(cx, t, "Peça pelo WhatsApp", true);
    });
  }
  function signature(t) {
    if (t < 16.3 || t >= 21.1) return;
    const ret = E(t, 20.3, 0.8),
      fold = E(t, 20.3, 0.4),
      open = E(t, 20.7, 0.4);
    alpha(c, content(t, 16.3), () => {
      c.save();
      c.translate(mix(5495, 6900, ret), mix(925, 1530, ret));
      c.strokeStyle = C.champagne;
      c.lineWidth = mix(4.68, 2.8, ret);
      c.lineJoin = "miter";
      c.lineCap = "butt";
      if (t < 20.7) {
        c.scale(0.78, 0.78);
        c.lineWidth /= 0.78;
        c.stroke(new Path2D(flourish(E(t, 16.3) * (1 - fold))));
        alpha(c, 1 - fold, () => c.stroke(new Path2D(lower(E(t, 16.3)))));
      } else {
        if (open === 1) rr(c, 0, 0, 880, 110, 55);
        else c.stroke(new Path2D(pill(open)));
        if (open === 1) c.stroke();
        alpha(c, E(t, 20.9, 0.2), () => {
          text(c, "Ver coleção", -350, 0, 44, C.champagne, "AureaManrope", 600);
          arrow(c, 370, 0, C.champagne);
        });
      }
      c.restore();
    });
  }
  function diagnose(time) {
    const t = Math.max(0, Math.min(22, Number.isFinite(time) ? time : 0)),
      s = sampleMotion(t),
      p = cursor(t, s),
      sc = scene(t);
    const first = t < 3.3 || t >= 20.3,
      fill = t >= 20.3 ? 0 : first ? E(t, 0.35, 0.8) : 1;
    const rect = { x: 540, y: 1530, w: 880, h: 110 };
    const inside =
      Math.abs(p.x - rect.x) <= rect.w / 2 &&
      Math.abs(p.y - rect.y) <= rect.h / 2;
    return {
      t,
      scene: sc,
      camera: s.camera,
      cursor: { x: p.x, y: p.y, opacity: p.opacity },
      activeDress:
        sc === "noir" || sc === "return"
          ? "Noir"
          : sc === "lumiere"
            ? "Lumière"
            : "Prune",
      cta: {
        rect,
        hover: first && inside && t >= 0.35,
        fill,
        green: !first,
        label: first ? "Ver coleção" : "Peça pelo WhatsApp",
      },
      composer: { draftComplete: t >= 13.1 && t < 16.3, sendEnabled: false },
      safeArea: { left: 90, right: 990, top: 240, bottom: 1600 },
      shared: s.shared,
    };
  }
  function seek(time, displayTime = time) {
    const t = Math.max(0, Math.min(22, Number.isFinite(time) ? time : 0));
    const dt = Math.max(
      0,
      Math.min(22, Number.isFinite(displayTime) ? displayTime : t),
    );
    const s = sampleMotion(t),
      cam = s.camera;
    c.reset();
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = "high";
    c.fillStyle = C.plum;
    c.fillRect(0, 0, W, H);
    if (t >= 5.8) {
      const q = E(t, 5.8, 0.4);
      if (q === 1) {
        c.fillStyle = C.cream;
        c.fillRect(0, 0, W, H);
      } else
        disk(
          c,
          900,
          1250,
          Math.max(
            Math.hypot(900, 1250),
            Math.hypot(180, 1250),
            Math.hypot(900, 670),
          ) *
            1.01 *
            q,
          C.cream,
        );
    }
    if (t >= 16.3) {
      const q = E(t, 16.3, 0.4);
      if (q === 1) {
        c.fillStyle = C.plum;
        c.fillRect(0, 0, W, H);
      } else
        disk(
          c,
          300,
          925,
          Math.max(
            Math.hypot(780, 995),
            Math.hypot(300, 995),
            Math.hypot(780, 925),
          ) *
            1.01 *
            q,
          C.plum,
        );
    }
    c.save();
    c.translate(540, 960);
    c.scale(Math.exp(cam.logZoom), Math.exp(cam.logZoom));
    c.translate(-cam.x, -960 - cam.y);
    // Portraits inhabit adjacent locations. No photo crossfades or garment morphs.
    if (cam.x < 1120)
      editorial(0, "Noir", "LONGO · PRETO", assets.noir, t, true);
    if (cam.x > 40 && cam.x < 2260) {
      editorial(1150, "Lumière", "MIDI · CHAMPANHE", assets.lumiere, t);
      alpha(c, 1 - content(t, 5.8), () =>
        liquidButton(1150, t, "Escolha seu vestido", false, 1),
      );
    }
    if (cam.x < 700)
      alpha(c, 1 - content(t, 3.3), () => liquidButton(0, t, "Ver coleção"));
    if (t >= 12.3 && t < 17.1) composer(t, dt);
    if (t >= 16.3 && t < 21.1) brand(t);
    // Keep this layer order through every handoff, including exactly 12.30.
    if (t >= 5.8 && t < 21.1)
      photo(c, assets.prune, s.shared.x, s.shared.y, s.shared.w, s.shared.h);
    if (cam.x > 1200 && cam.x < 3350) {
      alpha(c, 1 - content(t, 8.3), () =>
        editorial(2300, "Prune", "LONGO · AMEIXA", assets.prune, t),
      );
    }
    if (t >= 8.3 && t < 13.1) detail(t, dt);
    if (cam.x > 5820) {
      editorial(6900, "Noir", "LONGO · PRETO", assets.noir, t, true);
      if (t >= 21.1) liquidButton(6900, t, "Ver coleção", false, 1, true);
    }
    signature(t);
    c.restore();
    const p = cursor(t, s);
    alpha(c, p.opacity, () => {
      c.save();
      c.translate(p.x, p.y);
      c.scale(1 - 0.065 * p.pulse, 1 - 0.065 * p.pulse);
      c.drawImage(assets.pointer, -19.7, -11.38, 60, 60);
      c.restore();
    });
    return diagnose(t);
  }
  return { seek, inspect: diagnose };
}
