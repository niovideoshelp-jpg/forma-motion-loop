/** AURÉA choreography. Coordinates in touchGesture are the fingertip, not the image origin. */
export const MOTION_LAYOUT = {
  duration: 22,
  viewport: { w: 1080, h: 1920 },
  centers: [0, 1150, 2300, 3450, 4600, 5750, 6900],
  heroes: {
    noir: { x: 0, y: 965, w: 768, h: 960 },
    lumiere: { x: 1150, y: 965, w: 768, h: 960 },
    prune: { x: 2300, y: 965, w: 768, h: 960 },
  },
  sharedPoses: [
    { x: 3450, y: 965, w: 688, h: 860 },
    { x: 4600, y: 735, w: 320, h: 400 },
    { x: 5750, y: 925, w: 640, h: 800 },
  ],
  detailPose: { x: 3168, y: 975, w: 336, h: 420 },
  cta: { x: 540, y: 1535, w: 590, h: 104 },
  greenCta: { x: 540, y: 1535, w: 900, h: 112 },
};

const clamp = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, p) => a + (b - a) * p;
const smooth = (v) => {
  const p = clamp(v);
  return p * p * p * (p * (p * 6 - 15) + 10);
};
const copy = (o) =>
  Object.fromEntries(Object.entries(o).filter(([key]) => key !== "_gsap"));
const beats = [3.3, 5.8, 8.3, 12.3, 16.3, 20.3];

/** Layout is immutable for a rig. Create a fresh rig when art direction changes. */
export function createMotionRig(overrides = {}) {
  const layout = {
    ...MOTION_LAYOUT,
    ...overrides,
    viewport: { ...MOTION_LAYOUT.viewport, ...overrides.viewport },
    heroes: Object.fromEntries(
      Object.entries(MOTION_LAYOUT.heroes).map(([name, rect]) => [
        name,
        { ...rect, ...overrides.heroes?.[name] },
      ]),
    ),
    cta: { ...MOTION_LAYOUT.cta, ...overrides.cta },
    greenCta: { ...MOTION_LAYOUT.greenCta, ...overrides.greenCta },
    detailPose: { ...MOTION_LAYOUT.detailPose, ...overrides.detailPose },
  };
  const { gsap, CustomEase, MotionPathPlugin } = globalThis;
  if (!gsap || !CustomEase || !MotionPathPlugin)
    throw new Error(
      "Load local GSAP, CustomEase and MotionPathPlugin before creating AURÉA motion",
    );
  gsap.registerPlugin(CustomEase, MotionPathPlugin);
  const ease = CustomEase.create("aureaTouchGlide", "M0,0 C0.45,0 0.15,1 1,1");
  const camera = { x: layout.centers[0], y: 0, logZoom: 0 };
  const shared = { ...layout.heroes.prune };
  const drift = { noir: 0, lumiere: 0 };
  const tl = gsap.timeline({
    paused: true,
    defaults: { immediateRender: false, lazy: false, overwrite: false },
  });
  let lastCamera = { ...camera };
  beats.forEach((at, i) => {
    const next = {
      x: layout.centers[i + 1],
      y: 0,
      logZoom: 0,
    };
    tl.fromTo(camera, lastCamera, { ...next, duration: 0.8, ease }, at);
    lastCamera = next;
  });
  // Subtle composition drift uses its arrival as the next departure, never a reset.
  const pruneArrival = {
    ...layout.heroes.prune,
    x: layout.heroes.prune.x,
    y: layout.heroes.prune.y - 12,
  };
  tl.fromTo(
    shared,
    layout.heroes.prune,
    { ...pruneArrival, duration: 1.7, ease: smooth },
    6.6,
  );
  let previous = pruneArrival;
  [8.3, 12.3, 16.3].forEach((at, i) => {
    const next = { ...layout.sharedPoses[i] };
    tl.fromTo(shared, previous, { ...next, duration: 0.8, ease }, at);
    if (i === 0) {
      // Arrive as a large portrait; only shrink when the detail crop is revealed.
      const detail = { ...layout.detailPose };
      tl.fromTo(shared, next, { ...detail, duration: 0.8, ease }, 9.3);
      const end = { ...detail, y: detail.y - 24 };
      tl.fromTo(shared, detail, { ...end, duration: 2.2, ease: smooth }, 10.1);
      previous = end;
    } else {
      const end = {
        ...next,
        x: next.x,
        y: next.y - (i === 1 ? 8 : 12),
      };
      tl.fromTo(
        shared,
        next,
        { ...end, duration: 3.2, ease: smooth },
        at + 0.8,
      );
      previous = end;
    }
  });
  tl.fromTo(
    drift,
    { noir: 0 },
    { noir: -16, duration: 3.25, ease: smooth },
    0.05,
  );
  tl.fromTo(
    drift,
    { lumiere: 0 },
    { lumiere: -16, duration: 2.5, ease: smooth },
    3.3,
  );
  tl.to({}, { duration: 0.9 }, 21.1);
  tl.seek(22, true).seek(0, true);

  // The normalized fingertip approach is an actual paused MotionPath tween.
  const travel = { x: 0, y: 0 };
  const path = gsap.to(travel, {
    paused: true,
    duration: 1,
    ease: "none",
    immediateRender: false,
    lazy: false,
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: 0.16, y: 0.4 },
        { x: 0.65, y: 0.88 },
        { x: 1, y: 1 },
      ],
      curviness: 0.65,
    },
  });
  path.progress(1, true).progress(0, true);
  gsap.ticker.sleep();
  const time = (t) =>
    Math.max(0, Math.min(layout.duration, Number.isFinite(t) ? t : 0));
  const screen = (point, cam) => ({
    x: layout.viewport.w / 2 + (point.x - cam.x) * Math.exp(cam.logZoom),
    y:
      layout.viewport.h / 2 +
      (point.y - layout.viewport.h / 2 - cam.y) * Math.exp(cam.logZoom),
  });
  function sample(t) {
    t = time(t);
    tl.seek(t, true);
    const cam = copy(camera),
      sh = copy(shared);
    const index = beats.findIndex((at) => t >= at && t < at + 0.8);
    const progress = index < 0 ? 0 : ease(clamp((t - beats[index]) / 0.8));
    const delta = 0.0001;
    const velocity =
      index < 0
        ? 0
        : ((layout.centers[index + 1] - layout.centers[index]) *
            (ease(clamp((t - beats[index] + delta) / 0.8)) -
              ease(clamp((t - beats[index] - delta) / 0.8)))) /
          (2 * delta);
    return {
      camera: cam,
      shared: sh,
      portraits: {
        noir: { ...layout.heroes.noir, y: layout.heroes.noir.y + drift.noir },
        lumiere: {
          ...layout.heroes.lumiere,
          y: layout.heroes.lumiere.y + drift.lumiere,
        },
        prune: sh,
        return: {
          ...layout.heroes.noir,
          x: layout.centers[6] + layout.heroes.noir.x - layout.centers[0],
        },
      },
      pan: {
        index,
        progress,
        velocity,
        direction: velocity > 0 ? 1 : 0,
        active: index >= 0,
      },
    };
  }
  function point(s, anchor) {
    if (anchor.kind === "cta" || anchor.kind === "greenCta") {
      const rect = anchor.kind === "greenCta" ? layout.greenCta : layout.cta;
      return {
        x: rect.x + (anchor.u - 0.5) * rect.w,
        y: rect.y + (anchor.v - 0.5) * rect.h,
      };
    }
    const rect = anchor.kind === "shared" ? s.shared : s.portraits[anchor.kind];
    return screen(
      {
        x: rect.x + (anchor.u - 0.5) * rect.w,
        y: rect.y + (anchor.v - 0.5) * rect.h,
      },
      s.camera,
    );
  }
  const gestures = [
    {
      enter: 0.05,
      down: 0.35,
      up: 1.02,
      exit: 1.52,
      anchor: { kind: "cta", u: 1, v: 0.5 },
      mode: "touch",
      beat: 0.46,
    },
    {
      enter: 2.46,
      down: 3.16,
      up: 3.54,
      exit: 4.12,
      anchor: { kind: "noir", u: 0.85, v: 0.65 },
      mode: "swipe",
      beat: 3.3,
    },
    {
      enter: 4.84,
      down: 5.66,
      up: 6.04,
      exit: 6.62,
      anchor: { kind: "lumiere", u: 0.85, v: 0.65 },
      mode: "swipe",
      beat: 5.8,
    },
    {
      enter: 7.35,
      down: 8.2,
      up: 9.44,
      exit: 10.12,
      anchor: { kind: "shared", u: 0.85, v: 0.65 },
      mode: "touch",
      beat: 8.3,
      secondBeat: 9.3,
    },
    {
      enter: 11.22,
      down: 12.18,
      up: 12.46,
      exit: 13.04,
      anchor: { kind: "greenCta", u: 0.8, v: 0.5 },
      mode: "touch",
      beat: 12.3,
    },
    {
      enter: 18.08,
      down: 18.9,
      up: 19.4,
      exit: 20.02,
      anchor: { kind: "greenCta", u: 0.8, v: 0.5 },
      mode: "touch",
      beat: 19.06,
    },
  ];
  for (const gesture of gestures) {
    gesture.arrival = point(sample(gesture.down), gesture.anchor);
    gesture.departure = point(sample(gesture.up), gesture.anchor);
    const a = point(sample(gesture.up - 0.0001), gesture.anchor);
    const b = point(sample(gesture.up + 0.0001), gesture.anchor);
    gesture.releaseVelocity = {
      x: (b.x - a.x) / 0.0002,
      y: (b.y - a.y) / 0.0002,
    };
  }
  tl.seek(0, true);
  const offscreen = layout.viewport.h + 260;
  function route(a, b, q) {
    path.progress(smooth(q), true);
    const ceiling = q < 1 ? 1 - 1e-9 : 1;
    return {
      x: mix(a.x, b.x, Math.min(ceiling, clamp(travel.x))),
      y: mix(a.y, b.y, Math.min(ceiling, clamp(travel.y))),
    };
  }
  function touch(t, s = sample(t)) {
    t = time(t);
    const g = gestures.find((g) => t >= g.enter && t < g.exit);
    const hidden = {
      x: layout.viewport.w * 0.8,
      y: offscreen,
      rotation: -8,
      opacity: 0,
      press: 0,
      mode: "hidden",
      contact: false,
      anchor: null,
    };
    if (!g) return hidden;
    const arrival = g.arrival,
      departure = g.departure;
    let p, rotation, mode, contact;
    if (t < g.down) {
      const q = (t - g.enter) / (g.down - g.enter);
      p = route(
        { x: Math.min(layout.viewport.w - 30, arrival.x + 95), y: offscreen },
        arrival,
        q,
      );
      rotation = mix(-12, -5, smooth(q));
      mode = "approach";
      contact = false;
    } else if (t <= g.up) {
      p = point(s, g.anchor);
      contact = true;
      mode = g.mode;
      const q = clamp((t - g.beat) / Math.max(0.001, g.up - g.beat));
      rotation = g.mode === "swipe" ? mix(-5, -17, smooth(q)) : -5;
    } else {
      const q = (t - g.up) / (g.exit - g.up);
      p = route(
        departure,
        {
          x: Math.min(layout.viewport.w - 35, departure.x + 145),
          y: offscreen,
        },
        q,
      );
      // Release retains the velocity of the grabbed photo before the hand turns down.
      const carry = (g.exit - g.up) * q * (1 - q) ** 3;
      p.x += g.releaseVelocity.x * carry;
      p.y += g.releaseVelocity.y * carry;
      rotation = mix(g.mode === "swipe" ? -17 : -5, 8, smooth(q));
      mode = "release";
      contact = false;
    }
    const pressure = (beat) =>
      smooth((t - beat + 0.1) / 0.1) * (1 - smooth((t - beat) / 0.17));
    const press = Math.max(
      pressure(g.beat),
      g.secondBeat ? pressure(g.secondBeat) : 0,
    );
    return {
      ...p,
      rotation,
      opacity: 1,
      press,
      mode,
      contact,
      anchor: { ...g.anchor },
    };
  }
  return {
    sampleMotion: sample,
    touchGesture: touch,
    layout,
    dispose: () => {
      tl.kill();
      path.kill();
    },
  };
}

let defaultRig;
const rig = () => (defaultRig ??= createMotionRig());
export const sampleMotion = (t) => rig().sampleMotion(t);
export const touchGesture = (t, s) => rig().touchGesture(t, s);
