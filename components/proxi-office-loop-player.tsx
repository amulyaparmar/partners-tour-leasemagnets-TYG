"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { shouldOpenImmersiveMode } from "@/lib/loop-player-query";

type ProxiClip = {
  id: string;
  title: string;
  label: string;
  src: string;
  fallbackSrc: string;
  duration: string;
};

type ControlButtonProps = {
  label: string;
  symbol: string;
  onClick: () => void;
  slashed?: boolean;
  tone?: "danger" | "neutral" | "success";
};

const clips: ProxiClip[] = [
  {
    id: "intro",
    title: "Proxi Lawrence",
    label: "Intro",
    src: "/storyboards/proxi-office-loop/videos/proxi-intro-2025-1080p.mp4",
    fallbackSrc: "/storyboards/proxi-office-loop/videos/proxi-intro-2025.mp4",
    duration: "1:15",
  },
  {
    id: "floor-plan",
    title: "4x4 Floor Plan",
    label: "Residence",
    src: "/storyboards/proxi-office-loop/videos/proxi-4x4-floor-plan-2025-1080p.mp4",
    fallbackSrc:
      "/storyboards/proxi-office-loop/videos/proxi-4x4-floor-plan-2025.mp4",
    duration: "0:50",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    label: "Amenity",
    src: "/storyboards/proxi-office-loop/videos/proxi-clubhouse-2025-1080p.mp4",
    fallbackSrc: "/storyboards/proxi-office-loop/videos/proxi-clubhouse-2025.mp4",
    duration: "0:36",
  },
  {
    id: "fitness",
    title: "Fitness Center",
    label: "Amenity",
    src:
      "/storyboards/proxi-office-loop/videos/proxi-fitness-center-2025-1080p.mp4",
    fallbackSrc:
      "/storyboards/proxi-office-loop/videos/proxi-fitness-center-2025.mp4",
    duration: "0:25",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: "/storyboards/proxi-office-loop/videos/proxi-pool-2025-1080p.mp4",
    fallbackSrc: "/storyboards/proxi-office-loop/videos/proxi-pool-2025.mp4",
    duration: "0:20",
  },
];

const brandLogos = {
  proxi: "/storyboards/proxi-office-loop/logos/proxi-lawrence-white.svg",
  peakmade: "/storyboards/proxi-office-loop/logos/peakmade-white.png",
};

const videoCacheName = "proxi-office-loop-videos-v1";

type CachedClipSources = Partial<Record<ProxiClip["id"], string>>;

type ProxiOfficeLoopPlayerProps = {
  initialImmersiveMode?: boolean;
};

const controlToneClasses = {
  danger:
    "border-[#ff4d57]/76 bg-[#ff4d57]/18 text-[#ff6b73] hover:border-[#ff6b73] hover:bg-[#ff4d57]/26",
  neutral:
    "border-white/12 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.1]",
  success: "border-[#73e0a9]/70 bg-[#73e0a9]/18 text-white",
};

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
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid aspect-square min-h-12 place-items-center rounded-full border text-[1.35rem] font-semibold leading-none transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9c35f] ${controlToneClasses[tone]}`}
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

function ImmersiveIconButton({
  label,
  symbol,
  onClick,
  slashed,
  tone = "neutral",
}: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-11 w-11 place-items-center rounded-full border text-xl font-semibold leading-none shadow-[0_14px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9c35f] ${controlToneClasses[tone]}`}
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

export function ProxiOfficeLoopPlayer({
  initialImmersiveMode = false,
}: ProxiOfficeLoopPlayerProps) {
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
  const [isMirrorMode, setIsMirrorMode] = useState(initialImmersiveMode);
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
    : "grid min-w-0 w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(240px,0.72fr)_minmax(360px,1fr)_minmax(220px,0.58fr)]";

  const videoFrameWidth = isMirrorMode
    ? "100vw"
    : "min(calc(100vw - 32px), 46.125vh, 460px)";

  const resetPlaybackStats = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const applySoundPreference = useCallback(
    (video: HTMLVideoElement | null, shouldPlaySound = wantsSoundRef.current) => {
      if (!video) return;

      video.defaultMuted = !shouldPlaySound;
      video.muted = !shouldPlaySound;
      video.volume = shouldPlaySound ? 1 : 0;
    },
    [],
  );

  const playActiveVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.getAttribute("src")) return;

    applySoundPreference(video);

    try {
      await video.play();
      setHasStarted(true);
      setIsPlaying(true);
    } catch {
      wantsSoundRef.current = false;
      setSoundOn(false);
      applySoundPreference(video, false);

      try {
        await video.play();
        setHasStarted(true);
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, [applySoundPreference]);

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
    applySoundPreference(video, nextSoundState);

    await playActiveVideo();
  }, [applySoundPreference, playActiveVideo]);

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
    const shouldOpenImmersiveModeByDefault = shouldOpenImmersiveMode(
      window.location.search,
      window.location.pathname,
    );

    const animationFrameId = window.requestAnimationFrame(() => {
      setIsMirrorMode(shouldOpenImmersiveModeByDefault);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    applySoundPreference(videoRef.current, soundOn);
  }, [applySoundPreference, isMirrorMode, soundOn]);

  useEffect(() => {
    let isCancelled = false;

    const loadClip = async (clip: ProxiClip) => {
      const sources = [clip.src, clip.fallbackSrc];
      let loadedSrc = clip.src;

      try {
        let response: Response | null = null;

        for (const src of sources) {
          try {
            response = await loadVideoResponse(src);
            loadedSrc = src;
            break;
          } catch {
            response = null;
          }
        }

        if (!response) {
          throw new Error(`Unable to load ${clip.src}`);
        }

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
            [clip.id]: loadedSrc,
          }));
        }
      }
    };

    const loadVideos = async () => {
      await loadClip(clips[0]);
      await Promise.all(clips.slice(1).map(loadClip));
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

    applySoundPreference(video);

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
  }, [activeVideoSrc, applySoundPreference, playActiveVideo]);

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
      className={`relative min-h-screen overflow-x-hidden bg-[#060606] text-white ${
        isMirrorMode ? "h-screen overflow-hidden" : ""
      }`}
    >
      {isMirrorMode ? (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#040404_0%,#10100d_48%,#060606_100%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(241,71,47,0.34),transparent_30%),radial-gradient(circle_at_86%_24%,rgba(64,154,185,0.32),transparent_26%),linear-gradient(145deg,#161111_0%,#060606_46%,#15150f_100%)]" />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/74 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/82 to-transparent" />

      <div className={stageShellClasses}>
        <div className={layoutClasses}>
          {!isMirrorMode ? (
            <section className="order-2 flex min-w-0 flex-col rounded-lg border border-white/12 bg-black/28 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:order-1 lg:p-7">
              <div>
                <Image
                  src={brandLogos.proxi}
                  alt="Proxi Lawrence"
                  width={418}
                  height={161}
                  priority
                  className="h-auto w-64 max-w-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.38)]"
                />
                <p className="mt-2 max-w-sm text-sm leading-7 text-white/70">
                  Lawrence, KS
                </p>

                <div className="mt-8 space-y-3">
                  {clips.map((clip, index) => (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => goToClip(index)}
                      className={`grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 rounded-md border px-3 py-3 text-left transition ${
                        activeIndex === index
                          ? "border-[#f9c35f]/64 bg-[#f9c35f]/14 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/66 hover:border-white/24 hover:text-white"
                      }`}
                    >
                      <span className="font-mono text-xs tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">
                          {clip.title}
                        </span>
                        <span className="mt-0.5 block text-xs uppercase tracking-[0.18em] text-white/45">
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

              <div className="mt-8 flex items-end justify-between gap-5 border-t border-white/12 pt-5">
                <Image
                  src="/logos/lm-logo-tyg-white.svg"
                  alt="LeaseMagnets"
                  width={286}
                  height={56}
                  priority
                  className="h-auto w-32 max-w-[48%] opacity-70"
                />
                <Image
                  src={brandLogos.peakmade}
                  alt="PeakMade Real Estate"
                  width={1200}
                  height={510}
                  className="h-auto w-24 max-w-[38%] opacity-70"
                />
              </div>
            </section>
          ) : null}

          <section
            className={`order-1 flex min-w-0 justify-start sm:justify-center lg:order-2 ${
              isMirrorMode ? "h-full w-full" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden border bg-black shadow-[0_34px_100px_rgba(0,0,0,0.62)] ${
                isMirrorMode
                  ? "h-screen rounded-none border-0 shadow-none"
                  : "aspect-[9/16] rounded-[34px] border-white/18"
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
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-95 blur-2xl brightness-[0.5] saturate-[1.28]"
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
                <div className="pointer-events-none absolute left-5 top-5 z-40 max-w-[calc(100vw-96px)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] sm:left-7 sm:top-7">
                  <Image
                    src={brandLogos.proxi}
                    alt="Proxi Lawrence"
                    width={418}
                    height={161}
                    priority
                    className="h-auto w-32 max-w-[42vw] sm:w-40 lg:w-44"
                  />
                </div>
              ) : null}

              <video
                ref={videoRef}
                className={`relative z-10 ${
                  isMirrorMode
                    ? "mx-auto block h-full w-auto max-w-full cursor-pointer bg-transparent object-cover"
                    : "h-full w-full bg-black object-cover"
                }`}
                src={activeVideoSrc || undefined}
                autoPlay
                muted={!soundOn}
                playsInline
                preload={isActiveVideoReady ? "auto" : "none"}
                onClick={togglePlayback}
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
                <div className="absolute right-5 top-5 z-50 flex gap-3 sm:right-7 sm:top-7">
                  <ImmersiveIconButton
                    label={soundOn ? "Mute audio" : "Turn audio on"}
                    symbol="♪"
                    onClick={toggleSound}
                    slashed={!soundOn}
                    tone={soundOn ? "success" : "danger"}
                  />
                  <ImmersiveIconButton
                    label="Show storyboard controls"
                    symbol="▣"
                    onClick={toggleMirrorMode}
                  />
                </div>
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
                    className="h-full rounded-full bg-[#f9c35f] transition-[width] duration-150"
                    style={{ width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }}
                  />
                </div>
                <div className="flex items-end justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p
                      className={`font-semibold uppercase text-white/56 ${
                        isMirrorMode
                          ? "text-[0.62rem] tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]"
                          : "text-xs tracking-[0.22em]"
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
            <aside className="order-3 min-w-0 rounded-lg border border-white/12 bg-black/24 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/54">
                  {progressLabel}
                </p>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isPlaying ? "bg-[#73e0a9]" : "bg-[#f9c35f]"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="mt-6 grid grid-cols-6 gap-2 lg:grid-cols-3">
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

              <div className="mt-7 grid grid-cols-5 gap-2">
                {clips.map((clip, index) => (
                  <button
                    key={clip.id}
                    type="button"
                    aria-label={`Show ${clip.title}`}
                    onClick={() => goToClip(index)}
                    className={`h-2 rounded-full transition ${
                      activeIndex === index
                        ? "bg-[#f9c35f]"
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
