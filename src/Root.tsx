import React, { useEffect, useRef, useState } from "react";
import {
  Composition,
  useCurrentFrame,
  delayRender,
  continueRender,
  staticFile,
  Audio,
} from "remotion";
const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<{ seek: (t: number) => void } | null>(null);
  const [handle] = useState(() => delayRender("Loading Forma assets"));
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const run = async () => {
      const engine = await import(
        /* webpackIgnore: true */ staticFile("engine.js")
      );
      const assets = await engine.loadAssets(staticFile("assets/"));
      if (active && canvas.current) {
        renderer.current = engine.createRenderer(canvas.current, assets);
        renderer.current!.seek(frame / 60);
        setLoaded(true);
        continueRender(handle);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [handle]);
  useEffect(() => {
    renderer.current?.seek(frame / 60);
  }, [frame, loaded]);
  return (
    <>
      <canvas ref={canvas} width={1440} height={1440} />
      <Audio src={staticFile("assets/mix.wav")} />
    </>
  );
};
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Forma"
    component={Film}
    width={1440}
    height={1440}
    fps={60}
    durationInFrames={1320}
  />
);
