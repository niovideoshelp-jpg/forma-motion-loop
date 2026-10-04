/**
 * Lume+ motion score. All coordinates are authored, all timelines are paused.
 * Camera and surface are composed in screen space so the selected object stays
 * continuous while the world travels behind it. Canvas owns the actual drawing.
 */
export const MOTION_BEATS = Object.freeze([
  { key: "a", name: "library", at: 3.3, duration: 0.8 },
  { key: "b", name: "player", at: 6.8, duration: 0.7 },
  { key: "d", name: "progress", at: 9.3, duration: 0.75 },
  { key: "e", name: "membership", at: 12.3, duration: 0.85 },
  { key: "f", name: "brand", at: 16.3, duration: 0.65 },
  { key: "r", name: "return", at: 20.3, duration: 1.45 },
]);
// Rounded-rectangle hit time for the authored pointer route, measured in GSAP.
export const CTA_HOVER = Object.freeze({
  start: 0.79079984,
  duration: 0.8,
  x: 100.09419,
  y: 46,
});

const clamp = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, p) => a + (b - a) * p;
const clean = (o) =>
  Object.fromEntries(Object.entries(o).filter(([k]) => k !== "_gsap"));

export function createMotion(runtime = globalThis) {
  const { gsap, CustomEase, MotionPathPlugin } = runtime;
  if (!gsap || !CustomEase || !MotionPathPlugin) {
    throw new Error(
      "Lume motion requires local GSAP, CustomEase and MotionPathPlugin.",
    );
  }
  gsap.registerPlugin(CustomEase, MotionPathPlugin);

  // Zero endpoint velocity, decisive acceleration, a long controlled landing.
  // Every curve is monotone: no bounce, spring, overshoot or direction-dependent ease.
  const travel = CustomEase.create("lumeTravel", "M0,0 C0.34,0 0.18,1 1,1");
  const morph = CustomEase.create("lumeMorph", "M0,0 C0.28,0 0.24,1 1,1");
  const settle = CustomEase.create("lumeSettle", "M0,0 C0.22,0 0.18,1 1,1");
  const returnEase = CustomEase.create("lumeReturn", "M0,0 C0.42,0 0.22,1 1,1");
  const pointerEase = CustomEase.create(
    "lumePointer",
    "M0,0 C0.32,0 0.22,1 1,1",
  );

  const camera = { x: 0, y: 0, logZoom: 0 };
  const anchor = { x: 315, y: 250 };
  const box = { w: 420, h: 92, rad: 24 };
  const contact = { scale: 1 };
  const phases = { a: 0, b: 0, d: 0, e: 0, f: 0, r: 0 };
  const pointer = { x: 285, y: 140, alpha: 1, pulse: 0, follow: 0 };
  const tl = gsap.timeline({
    paused: true,
    defaults: { overwrite: false, lazy: false },
  });

  const poses = [
    {
      camera: { x: 0, y: 0, z: 1 },
      anchor: { x: 315, y: 250 },
      box: { w: 420, h: 92, rad: 24 },
    },
    {
      camera: { x: 1000, y: 0, z: 0.98 },
      anchor: { x: -343, y: 29.4 },
      box: { w: 420, h: 520, rad: 22 },
    },
    {
      camera: { x: 2250, y: 0, z: 1.04 },
      anchor: { x: 0, y: 0 },
      box: { w: 1160, h: 850, rad: 34 },
    },
    {
      camera: { x: 3600, y: 0, z: 1 },
      anchor: { x: 0, y: 0 },
      box: { w: 1160, h: 950, rad: 34 },
    },
    {
      camera: { x: 4870, y: 0, z: 1.03 },
      anchor: { x: 236.9, y: 41.2 },
      box: { w: 760, h: 470, rad: 40 },
    },
    {
      camera: { x: 6200, y: 0, z: 1 },
      anchor: { x: 0, y: 0 },
      box: { w: 1800, h: 1800, rad: 0 },
    },
    {
      camera: { x: 0, y: 0, z: 1 },
      anchor: { x: 315, y: -10 },
      box: { w: 510, h: 760, rad: 34 },
    },
  ];
  // Cubic handles keep the hero on one short, intelligible route per handoff.
  // Player -> progress is deliberately pinned: the timeline itself is the subject.
  const routes = [
    "M315,250 C130,250 -343,190 -343,29.4",
    "M-343,29.4 C-275,29.4 -110,0 0,0",
    "M0,0 C0,0 0,0 0,0",
    "M0,0 C55,0 236.9,8 236.9,41.2",
    "M236.9,41.2 C210,41.2 45,0 0,0",
    "M0,0 C85,0 315,-10 315,-10",
  ];

  function tween(target, from, to, at, duration, ease = travel) {
    tl.fromTo(
      target,
      from,
      { ...to, duration, ease, immediateRender: false, lazy: false },
      at,
    );
  }

  MOTION_BEATS.forEach((beat, i) => {
    const { at, duration, key, name } = beat;
    const before = poses[i],
      after = poses[i + 1];
    const ease = key === "r" ? returnEase : travel;
    tl.addLabel(name, at);
    tween(phases, { [key]: 0 }, { [key]: 1 }, at, duration, ease);
    tween(
      camera,
      {
        x: before.camera.x,
        y: before.camera.y,
        logZoom: Math.log(before.camera.z),
      },
      {
        x: after.camera.x,
        y: after.camera.y,
        logZoom: Math.log(after.camera.z),
      },
      at,
      duration,
      ease,
    );
    tween(
      anchor,
      before.anchor,
      key === "d"
        ? after.anchor
        : { motionPath: { path: routes[i], autoRotate: false } },
      at,
      duration,
      ease,
    );

    // Expansion opens the useful axis first; compression preserves the reading
    // width until the graph has carried into the membership credential.
    const widthLag = key === "e" ? 0.1 : key === "a" ? 0 : 0.025;
    const heightLag = key === "a" ? 0.035 : key === "b" ? 0.08 : 0;
    tween(
      box,
      { w: before.box.w },
      { w: after.box.w },
      at + widthLag,
      duration - widthLag,
      morph,
    );
    tween(
      box,
      { h: before.box.h },
      { h: after.box.h },
      at + heightLag,
      duration - heightLag,
      morph,
    );
    tween(
      box,
      { rad: before.box.rad },
      { rad: after.box.rad },
      at,
      duration,
      settle,
    );
  });

  // Pointer trajectories are relative to the live shared surface, so a pressed
  // target cannot leave its pointer behind during camera travel.
  function pointerPath(path, from, at, duration) {
    tween(
      pointer,
      from,
      { motionPath: { path, autoRotate: false } },
      at,
      duration,
      pointerEase,
    );
  }
  pointerPath("M285,140 C220,140 75,12 0,0", { x: 285, y: 140 }, 0.12, 1.65);
  tween(contact, { scale: 1 }, { scale: 0.985 }, 2.925, 0.075, "power1.in");
  tween(contact, { scale: 0.985 }, { scale: 1 }, 3, 0.18, settle);
  pointerPath("M0,0 C40,30 175,240 155,275", { x: 0, y: 0 }, 3.38, 0.72);
  pointerPath("M155,275 C130,255 -8,158 0,60", { x: 155, y: 275 }, 5.2, 0.8);
  pointerPath("M0,60 C0,46 0,14 0,0", { x: 0, y: 60 }, 6.8, 0.7);
  // The final approach is blended against the live endpoint by evaluate().
  tween(pointer, { follow: 0 }, { follow: 1 }, 8.6, 0.45, pointerEase);
  tween(pointer, { alpha: 1 }, { alpha: 0 }, 10.05, 0.25, settle);
  // Hidden relocation is a cursor exit/re-entry, never a rendered object reset.
  tween(pointer, { x: 0, y: 0 }, { x: 285, y: 400 }, 20.9, 0.15, "none");
  tween(pointer, { follow: 1 }, { follow: 0 }, 20.9, 0.15, "none");
  tween(pointer, { alpha: 0 }, { alpha: 1 }, 21.4, 0.35, settle);
  for (const click of [3, 6.8, 8.3]) {
    tween(
      pointer,
      { pulse: 0 },
      { pulse: 1 },
      click - 0.085,
      0.085,
      "power1.in",
    );
    tween(pointer, { pulse: 1 }, { pulse: 0 }, click, 0.13, "power2.out");
  }
  tl.to({}, { duration: 0.25 }, 21.75);

  // Prime every child once. Subsequent random/reverse seeks never lazily infer
  // a start value from whatever sample happened to render immediately before.
  tl.seek(22, true);
  tl.seek(0, true);
  gsap.ticker.sleep();

  function evaluate(time) {
    const t = Math.max(0, Math.min(22, Number.isFinite(time) ? time : 0));
    tl.seek(t, true);
    const cam = { x: camera.x, y: camera.y, z: Math.exp(camera.logZoom) };
    const s = {
      x: cam.x + anchor.x / cam.z,
      y: cam.y + anchor.y / cam.z,
      ...clean(box),
      ...clean(phases),
    };
    s.w *= contact.scale;
    s.h *= contact.scale;
    const p = { x: s.x + pointer.x, y: s.y + pointer.y };
    const follow = pointer.follow;
    if (follow > 0) {
      const sampleTime = Math.min(t, 10.05);
      const lineAdvance = travel(clamp((sampleTime - 8.3) / 1));
      const extent = mix(mix(0.05, 0.78, lineAdvance), 1, s.d);
      const values = [0.05, 0.18, 0.3, 0.46, 0.58, 0.71, 0.84];
      const j = Math.min(5, Math.floor(extent * 6));
      const lineY =
        mix(380, 150, s.d) -
        230 * mix(values[j], values[j + 1], extent * 6 - j) * s.d;
      p.x = mix(p.x, s.x + mix(-470, 470, extent), follow);
      // A gentle tangent approach, not a ruler-straight diagonal to the timeline.
      p.y = mix(p.y, s.y + lineY, follow) - 24 * Math.sin(Math.PI * follow);
    }
    return {
      time: t,
      camera: cam,
      surface: s,
      cursor: { ...p, alpha: pointer.alpha, pulse: pointer.pulse, follow },
    };
  }

  return {
    evaluate,
    seek: evaluate,
    timeline: tl,
    // Use this for subsidiary content whose timing follows the motion score.
    ease: (value) => travel(clamp(value)),
    phase: (time, key) => {
      const beat = MOTION_BEATS.find(
        (entry) => entry.key === key || entry.name === key,
      );
      if (!beat) return 0;
      return (beat.key === "r" ? returnEase : travel)(
        clamp((time - beat.at) / beat.duration),
      );
    },
    dispose: () => tl.kill(),
  };
}
