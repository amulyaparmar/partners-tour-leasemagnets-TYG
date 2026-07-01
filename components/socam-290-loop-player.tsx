"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SocamClip = {
  id: string;
  title: string;
  label: string;
  src: string;
  duration: string;
};

type ControlButtonProps = {
  label: string;
  symbol: string;
  onClick: () => void;
  slashed?: boolean;
  tone?: "danger" | "neutral" | "success";
};

const clips: SocamClip[] = [
  {
    id: "intro",
    title: "SoCam 290",
    label: "Intro",
    src: "/storyboards/socam-290-loop/videos/socam-290-intro-2026.m4v",
    duration: "2:16",
  },
  {
    id: "two-bedroom-floor-plan",
    title: "2x2 Floor Plan",
    label: "Floor Plan",
    src: "/storyboards/socam-290-loop/videos/socam-290-2x2-floor-plan-2026.m4v",
    duration: "2:05",
  },
  {
    id: "studio-floor-plan",
    title: "Studio Floor Plan",
    label: "Floor Plan",
    src: "/storyboards/socam-290-loop/videos/socam-290-studio-floor-plan-2026.m4v",
    duration: "1:11",
  },
  {
    id: "cafe-bar",
    title: "Cafe Bar",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-cafe-bar-2026.m4v",
    duration: "0:29",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-clubhouse-2026.m4v",
    duration: "0:43",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-fitness-center-2026.m4v",
    duration: "0:43",
  },
  {
    id: "package-area",
    title: "Package Area",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-package-area-2026.m4v",
    duration: "0:24",
  },
  {
    id: "laundry-area",
    title: "Laundry Area",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-laundry-area-2026.m4v",
    duration: "0:33",
  },
  {
    id: "study-areas",
    title: "Study Areas",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-study-areas-2026.m4v",
    duration: "0:42",
  },
  {
    id: "movie-areas",
    title: "Movie Areas",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-movie-areas-2026.m4v",
    duration: "0:36",
  },
  {
    id: "bus-stop",
    title: "Bus Stop",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-bus-stop-2026.m4v",
    duration: "0:33",
  },
  {
    id: "onsite-retailers",
    title: "Onsite Retailers",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-onsite-retailers-2026.m4v",
    duration: "0:24",
  },
];

const videoCacheName = "socam-290-loop-videos-v1";

type CachedClipSources = Partial<Record<SocamClip["id"], string>>;

async function fetchVideoResponse(src: string) {
  const response = await fetch(src, {
    cache: "force-cache",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${src}`);
  }

  return response;
}

async function loadVideoResponse(src: string) {
  if (!("caches" in window)) {
    return fetchVideoResponse(src);
  }

  try {
    const cache = await caches.open(videoCacheName);
    const cachedResponse = await cache.match(src);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetchVideoResponse(src);
    await cache.put(src, networkResponse.clone()).catch(() => undefined);
    return networkResponse;
  } catch {
    return fetchVideoResponse(src);
  }
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function ControlButton({
  label,
  symbol,
  onClick,
  slashed,
  tone = "neutral",
}: ControlButtonProps) {
  const toneClasses = {
    danger:
      "border-[#ff4d57]/76 bg-[#ff4d57]/18 text-[#ff6b73] hover:border-[#ff6b73] hover:bg-[#ff4d57]/26",
    neutral:
      "border-white/12 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.1]",
    success: "border-[#74e3bb]/70 bg-[#74e3bb]/18 text-white",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid aspect-square min-h-12 place-items-center rounded-full border text-[1.35rem] font-semibold leading-none transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b64b] ${toneClasses[tone]}`}
    >
      <span aria-hidden="true" className="relative inline-grid place-items-center">
        {symbol}
        {slashed ? (
          <span className="absolute h-0.5 w-7 rotate-[-42deg] rounded-full bg-[#ff6b73] shadow-[0_0_12px_rgba(255,77,87,0.42)]" />
        ) : null}
      </span>
    </button>
  );
}

function SocamWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="text-white drop-shadow-[0_16px_34px_rgba(0,0,0,0.42)]">
      <p
        className={`font-semibold leading-none ${
          compact ? "text-2xl sm:text-3xl" : "text-5xl sm:text-6xl lg:text-7xl"
        }`}
      >
        SoCam
      </p>
      <p
        className={`font-semibold leading-none text-white/90 ${
          compact ? "text-xl sm:text-2xl" : "text-4xl sm:text-5xl lg:text-6xl"
        }`}
      >
        290
      </p>
    </div>
  );
}

export function Socam290LoopPlayer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mirrorVideoRef = useRef<HTMLVideoElement>(null);
  const wantsSoundRef = useRef(false);
  const objectUrlsRef = useRef<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cachedClipSources, setCachedClipSources] =
    useState<CachedClipSources>({});
  const [soundOn, setSoundOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMirrorMode, setIsMirrorMode] = useState(false);
  const activeClip = clips[activeIndex];
  const activeVideoSrc = cachedClipSources[activeClip.id] ?? "";
  const isActiveVideoReady = Boolean(activeVideoSrc);

  const progressLabel = useMemo(
    () => `${activeIndex + 1} / ${clips.length}`,
    [activeIndex],
  );

  const stageShellClasses = isMirrorMode
    ? "relative z-10 flex h-screen min-h-screen w-screen items-stretch justify-stretch p-0"
    : "relative z-10 flex min-h-screen items-center justify-center px-4 py-5 sm:px-7 lg:px-10";

  const layoutClasses = isMirrorMode
    ? "flex h-full min-h-screen w-full items-stretch justify-stretch"
    : "grid min-w-0 w-full max-w-[1500px] items-center gap-6 xl:grid-cols-[minmax(250px,0.56fr)_minmax(640px,1.18fr)_minmax(220px,0.42fr)]";

  const videoFrameWidth = isMirrorMode
    ? "100vw"
    : "min(calc(100vw - 32px), calc((100vh - 72px) * 16 / 9), 980px)";

  const resetPlaybackStats = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const playActiveVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.getAttribute("src")) return;

    video.muted = !wantsSoundRef.current;
    video.volume = wantsSoundRef.current ? 1 : 0;

    try {
      await video.play();
      setHasStarted(true);
      setIsPlaying(true);
    } catch {
      wantsSoundRef.current = false;
      setSoundOn(false);
      video.muted = true;
      video.volume = 0;

      try {
        await video.play();
        setHasStarted(true);
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, []);

  const goToClip = useCallback(
    (nextIndex: number) => {
      resetPlaybackStats();
      setActiveIndex((nextIndex + clips.length) % clips.length);
    },
    [resetPlaybackStats],
  );

  const advance = useCallback(() => {
    resetPlaybackStats();
    setActiveIndex((currentIndex) => (currentIndex + 1) % clips.length);
  }, [resetPlaybackStats]);

  const retreat = useCallback(() => {
    resetPlaybackStats();
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + clips.length) % clips.length,
    );
  }, [resetPlaybackStats]);

  const toggleSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextSoundState = !wantsSoundRef.current;
    wantsSoundRef.current = nextSoundState;
    setSoundOn(nextSoundState);
    video.muted = !nextSoundState;
    video.volume = nextSoundState ? 1 : 0;

    await playActiveVideo();
  }, [playActiveVideo]);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await playActiveVideo();
      return;
    }

    video.pause();
    setIsPlaying(false);
  }, [playActiveVideo]);

  const toggleFullscreen = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await stage.requestFullscreen();
  }, []);

  const toggleMirrorMode = useCallback(() => {
    setIsMirrorMode((currentMode) => !currentMode);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadClip = async (clip: SocamClip) => {
      try {
        const response = await loadVideoResponse(clip.src);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (isCancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        objectUrlsRef.current.push(objectUrl);
        setCachedClipSources((currentSources) => ({
          ...currentSources,
          [clip.id]: objectUrl,
        }));
      } catch {
        if (!isCancelled) {
          setCachedClipSources((currentSources) => ({
            ...currentSources,
            [clip.id]: clip.src,
          }));
        }
      }
    };

    const loadVideos = async () => {
      await loadClip(clips[0]);

      for (const clip of clips.slice(1)) {
        if (isCancelled) return;
        await loadClip(clip);
      }
    };

    void loadVideos();

    return () => {
      isCancelled = true;
      objectUrlsRef.current.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideoSrc) return;

    video.muted = !wantsSoundRef.current;
    video.volume = wantsSoundRef.current ? 1 : 0;

    const playWhenReady = () => {
      void playActiveVideo();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playWhenReady();
      return;
    }

    video.addEventListener("loadeddata", playWhenReady, { once: true });

    return () => {
      video.removeEventListener("loadeddata", playWhenReady);
    };
  }, [activeVideoSrc, playActiveVideo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const mirrorVideo = mirrorVideoRef.current;

    if (!isMirrorMode || !activeVideoSrc || !video || !mirrorVideo) return;

    mirrorVideo.muted = true;
    mirrorVideo.volume = 0;

    const syncMirrorVideo = () => {
      if (Number.isFinite(video.currentTime)) {
        const drift = Math.abs(mirrorVideo.currentTime - video.currentTime);

        if (drift > 0.35) {
          try {
            mirrorVideo.currentTime = video.currentTime;
          } catch {
            return;
          }
        }
      }

      if (video.paused) {
        mirrorVideo.pause();
        return;
      }

      void mirrorVideo.play().catch(() => undefined);
    };

    syncMirrorVideo();

    const intervalId = window.setInterval(syncMirrorVideo, 700);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeVideoSrc, isMirrorMode, isPlaying]);

  return (
    <main
      ref={stageRef}
      className={`relative min-h-screen overflow-x-hidden bg-[#050505] text-white ${
        isMirrorMode ? "h-screen overflow-hidden" : ""
      }`}
    >
      {isMirrorMode ? (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#030404_0%,#0a0f10_52%,#050505_100%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(18,175,191,0.3),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(224,31,115,0.25),transparent_24%),radial-gradient(circle_at_76%_86%,rgba(241,99,45,0.2),transparent_30%),linear-gradient(145deg,#071012_0%,#050505_48%,#12100c_100%)]" />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/76 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/84 to-transparent" />

      <div className={stageShellClasses}>
        <div className={layoutClasses}>
          {!isMirrorMode ? (
            <section className="order-2 flex min-w-0 flex-col rounded-lg border border-white/12 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl xl:order-1 xl:p-7">
              <div>
                <SocamWordmark />
                <p className="mt-1 max-w-sm text-sm leading-6 text-white/70">
                  New Brunswick, NJ
                </p>

                <div className="mt-7 max-h-[42vh] space-y-2 overflow-y-auto pr-1 xl:max-h-[48vh]">
                  {clips.map((clip, index) => (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => goToClip(index)}
                      className={`grid w-full grid-cols-[34px_1fr_auto] items-center gap-3 rounded-md border px-3 py-2.5 text-left transition ${
                        activeIndex === index
                          ? "border-[#f3b64b]/68 bg-[#f3b64b]/14 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/66 hover:border-white/24 hover:text-white"
                      }`}
                    >
                      <span className="font-mono text-xs tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {clip.title}
                        </span>
                        <span className="mt-0.5 block text-xs uppercase text-white/45">
                          {clip.label}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-white/48">
                        {clip.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex items-end justify-between gap-5 border-t border-white/12 pt-5">
                <Image
                  src="/logos/lm-logo-tyg-white.svg"
                  alt="LeaseMagnets"
                  width={286}
                  height={56}
                  priority
                  className="h-auto w-36 max-w-[62%] opacity-75"
                />
                <p className="max-w-[34%] text-right font-mono text-xs leading-5 text-white/52">
                  2026
                </p>
              </div>
            </section>
          ) : null}

          <section
            className={`order-1 flex min-w-0 justify-start sm:justify-center xl:order-2 ${
              isMirrorMode ? "h-full w-full" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden border bg-black shadow-[0_34px_100px_rgba(0,0,0,0.62)] ${
                isMirrorMode
                  ? "h-screen rounded-none border-0 shadow-none"
                  : "aspect-video rounded-[26px] border-white/18"
              }`}
              style={
                isMirrorMode
                  ? { width: videoFrameWidth, height: "100vh" }
                  : { width: videoFrameWidth }
              }
            >
              {isMirrorMode ? (
                <video
                  ref={mirrorVideoRef}
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-95 blur-2xl brightness-[0.48] saturate-[1.24]"
                  style={{ transform: "scaleX(-1) scale(1.24)" }}
                  src={activeVideoSrc || undefined}
                  autoPlay
                  muted
                  playsInline
                  preload={isActiveVideoReady ? "auto" : "none"}
                  aria-hidden="true"
                />
              ) : null}

              {isMirrorMode ? (
                <div className="pointer-events-none absolute left-5 top-5 z-40 max-w-[calc(100vw-96px)] sm:left-7 sm:top-7">
                  <SocamWordmark compact />
                </div>
              ) : null}

              <video
                ref={videoRef}
                className={`relative z-10 ${
                  isMirrorMode
                    ? "h-full w-full bg-transparent object-contain"
                    : "h-full w-full bg-black object-cover"
                }`}
                src={activeVideoSrc || undefined}
                autoPlay
                muted={!soundOn}
                playsInline
                preload={isActiveVideoReady ? "auto" : "none"}
                onEnded={advance}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => {
                  setDuration(event.currentTarget.duration || 0);
                }}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  const nextDuration = video.duration || 0;
                  setCurrentTime(video.currentTime || 0);
                  setDuration(nextDuration);
                  setProgress(
                    nextDuration > 0 ? video.currentTime / nextDuration : 0,
                  );
                }}
              />

              {isMirrorMode ? (
                <button
                  type="button"
                  aria-label="Show storyboard controls"
                  title="Show storyboard controls"
                  onClick={toggleMirrorMode}
                  className="absolute right-5 top-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/24 bg-black/36 text-xl font-semibold leading-none text-white/90 shadow-[0_14px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-white/46 hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b64b] sm:right-7 sm:top-7"
                >
                  <span aria-hidden="true">▣</span>
                </button>
              ) : null}

              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-black/62 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-black/78 to-transparent" />

              {!hasStarted || !isActiveVideoReady ? (
                <button
                  type="button"
                  disabled={!isActiveVideoReady}
                  onClick={playActiveVideo}
                  className="absolute left-1/2 top-1/2 z-30 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/62 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:scale-105 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isActiveVideoReady ? "Play" : "Loading"}
                </button>
              ) : null}

              <div
                className={`absolute inset-x-0 bottom-0 z-30 ${
                  isMirrorMode ? "p-5 sm:p-8 lg:p-10" : "p-5"
                }`}
              >
                <div
                  className={`h-1 overflow-hidden rounded-full bg-white/18 ${
                    isMirrorMode ? "mb-2 sm:mb-3" : "mb-3"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-[#f3b64b] transition-[width] duration-150"
                    style={{
                      width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-end justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p
                      className={`font-semibold uppercase text-white/56 ${
                        isMirrorMode ? "text-[0.62rem] sm:text-xs" : "text-xs"
                      }`}
                    >
                      {activeClip.label}
                    </p>
                    <h2
                      className={`mt-1 font-semibold leading-none text-white ${
                        isMirrorMode ? "truncate text-lg sm:text-2xl" : "text-2xl"
                      }`}
                    >
                      {activeClip.title}
                    </h2>
                  </div>
                  <p
                    className={`shrink-0 font-mono text-white/66 ${
                      isMirrorMode ? "text-[0.68rem] sm:text-xs" : "text-xs"
                    }`}
                  >
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {!isMirrorMode ? (
            <aside className="order-3 min-w-0 rounded-lg border border-white/12 bg-black/26 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl xl:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase text-white/54">
                  {progressLabel}
                </p>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isPlaying ? "bg-[#74e3bb]" : "bg-[#f3b64b]"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="mt-6 grid grid-cols-6 gap-2 xl:grid-cols-3">
                <ControlButton label="Previous video" symbol="‹" onClick={retreat} />
                <ControlButton
                  label={isPlaying ? "Pause video" : "Play video"}
                  symbol={isPlaying ? "Ⅱ" : "▶"}
                  onClick={togglePlayback}
                />
                <ControlButton label="Next video" symbol="›" onClick={advance} />
                <ControlButton
                  label={soundOn ? "Mute audio" : "Turn audio on"}
                  symbol="♪"
                  onClick={toggleSound}
                  slashed={!soundOn}
                  tone={soundOn ? "success" : "danger"}
                />
                <ControlButton
                  label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  symbol={isFullscreen ? "−" : "⛶"}
                  onClick={toggleFullscreen}
                />
                <ControlButton
                  label="Mirror fill mode"
                  symbol="▭"
                  onClick={toggleMirrorMode}
                />
              </div>

              <div className="mt-7 grid grid-cols-6 gap-2">
                {clips.map((clip, index) => (
                  <button
                    key={clip.id}
                    type="button"
                    aria-label={`Show ${clip.title}`}
                    onClick={() => goToClip(index)}
                    className={`h-2 rounded-full transition ${
                      activeIndex === index
                        ? "bg-[#f3b64b]"
                        : "bg-white/24 hover:bg-white/44"
                    }`}
                  />
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
