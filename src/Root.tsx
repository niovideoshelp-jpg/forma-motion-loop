import React, { useEffect, useRef, useState } from "react";
import {
  Composition,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  staticFile,
  Audio,
} from "remotion";
const Film: React.FC<{ engine: string; audio: string }> = ({
  engine,
  audio,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const initialFrame = useRef(frame);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<{
    seek: (t: number, displayTime?: number) => void;
  } | null>(null);
  const [handle] = useState(() => delayRender("Loading film assets"));
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const run = async () => {
      const module = await import(/* webpackIgnore: true */ staticFile(engine));
      const assets = await module.loadAssets(staticFile("assets/"));
      if (active && canvas.current) {
        renderer.current = module.createRenderer(canvas.current, assets);
        renderer.current!.seek(
          initialFrame.current / fps,
          initialFrame.current / fps,
        );
        setLoaded(true);
        continueRender(handle);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [handle, engine, fps]);
  useEffect(() => {
    renderer.current?.seek(frame / fps, frame / fps);
  }, [frame, fps, loaded]);
  return (
    <>
      <canvas ref={canvas} width={width} height={height} />
      <Audio src={staticFile(audio)} />
    </>
  );
};
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Forma"
      component={Film}
      width={1440}
      height={1440}
      fps={60}
      durationInFrames={1320}
      defaultProps={{ engine: "engine.js", audio: "assets/mix.wav" }}
    />
    <Composition
      id="Orbita"
      component={Film}
      width={1440}
      height={1440}
      fps={60}
      durationInFrames={1320}
      defaultProps={{
        engine: "orbita-dynamic.js",
        audio: "assets/orbita-mix.wav",
      }}
    />
    <Composition
      id="Lume"
      component={Film}
      width={1440}
      height={1440}
      fps={60}
      durationInFrames={1320}
      defaultProps={{ engine: "lume.js", audio: "assets/lume-mix.wav" }}
    />
    <Composition
      id="LumeRefined"
      component={Film}
      width={1440}
      height={1440}
      fps={60}
      durationInFrames={1320}
      defaultProps={{ engine: "lume-refined.js", audio: "assets/lume-mix.wav" }}
    />
    <Composition
      id="Aurea"
      component={Film}
      width={1080}
      height={1920}
      fps={60}
      durationInFrames={1320}
      defaultProps={{ engine: "aurea.js", audio: "assets/aurea-mix.wav" }}
    />
  </>
);
