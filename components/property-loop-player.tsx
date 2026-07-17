"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  LoopPlayerIcon,
  type LoopPlayerIconName,
} from "@/components/loop-player-icons";
import { shouldOpenImmersiveMode } from "@/lib/loop-player-query";

export type LoopClip = {
  id: string;
  title: string;
  label: string;
  src: string;
  fallbackSrc?: string;
  duration: string;
  orientation?: "portrait" | "landscape";
};

type BrandLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  compactClassName?: string;
};

type PropertyLoopPlayerProps = {
  clips: LoopClip[];
  cacheName: string;
  propertyLogo: BrandLogo;
  location: string;
  orientation?: "portrait" | "landscape";
  managementLogo?: BrandLogo;
  playbackMode?: "cached" | "stream";
  initialImmersiveMode?: boolean;
  year?: string;
};

type ControlButtonProps = {
  label: string;
  icon: LoopPlayerIconName;
  onClick: () => void;
  compact?: boolean;
  slashed?: boolean;
  tone?: "danger" | "neutral" | "success";
};

type CachedClipSources = Partial<Record<string, string>>;
type ClipOrientations = Partial<Record<string, "portrait" | "landscape">>;

const controlToneClasses = {
  danger:
    "border-[#ff4d57]/76 bg-[#ff4d57]/18 text-[#ff6b73] hover:border-[#ff6b73] hover:bg-[#ff4d57]/26",
  neutral:
    "border-white/12 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.1]",
  success: "border-[#74e3bb]/70 bg-[#74e3bb]/18 text-white",
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

async function loadVideoResponse(src: string, cacheName: string) {
  if (!("caches" in window)) {
    return fetchVideoResponse(src);
  }

  try {
    const cache = await caches.open(cacheName);
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
  icon,
  onClick,
  compact = false,
  slashed,
  tone = "neutral",
}: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`mx-auto grid aspect-square w-full place-items-center rounded-full border text-xl font-semibold leading-none transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b64b] sm:text-2xl ${controlToneClasses[tone]}`}
      style={{
        maxWidth: compact ? "6.5rem" : "none",
        minWidth: "3.75rem",
      }}
    >
      <LoopPlayerIcon name={icon} slashed={slashed} />
    </button>
  );
}

function ImmersiveIconButton({
  label,
  icon,
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
      className={`grid h-11 w-11 place-items-center rounded-full border text-xl font-semibold leading-none shadow-[0_14px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3b64b] ${controlToneClasses[tone]}`}
    >
      <LoopPlayerIcon name={icon} slashed={slashed} />
    </button>
  );
}

function LogoImage({
  logo,
  compact = false,
  priority = false,
}: {
  logo: BrandLogo;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={
        compact
          ? (logo.compactClassName ??
            "h-auto w-36 max-w-[calc(100vw-120px)] opacity-95")
          : (logo.className ?? "h-auto w-56 max-w-full opacity-95")
      }
    />
  );
}

export function PropertyLoopPlayer({
  clips,
  cacheName,
  propertyLogo,
  location,
  orientation = "portrait",
  managementLogo,
  playbackMode = "cached",
  initialImmersiveMode = false,
  year = "2026",
}: PropertyLoopPlayerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mirrorVideoRef = useRef<HTMLVideoElement>(null);
  const wantsSoundRef = useRef(false);
  const objectUrlsRef = useRef<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cachedClipSources, setCachedClipSources] =
    useState<CachedClipSources>({});
  const [streamFallbackSources, setStreamFallbackSources] =
    useState<CachedClipSources>({});
  const [clipOrientations, setClipOrientations] = useState<ClipOrientations>(
    {},
  );
  const [soundOn, setSoundOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [immersiveModeEnabled, setImmersiveModeEnabled] = useState(
    initialImmersiveMode,
  );
  const activeClip = clips[activeIndex];
  const activeVideoSrc =
    playbackMode === "stream"
      ? (streamFallbackSources[activeClip.id] ?? activeClip.src)
      : (cachedClipSources[activeClip.id] ?? "");
  const isActiveVideoReady = Boolean(activeVideoSrc);
  const activeOrientation =
    activeClip.orientation ?? clipOrientations[activeClip.id] ?? orientation;
  const isActivePortrait = activeOrientation === "portrait";
  const isMirrorModeActive = immersiveModeEnabled && isActivePortrait;
  const isFullVideoModeActive = immersiveModeEnabled && !isActivePortrait;
  const isImmersiveModeActive = isMirrorModeActive || isFullVideoModeActive;

  const progressLabel = useMemo(
    () => `${activeIndex + 1} / ${clips.length}`,
    [activeIndex, clips.length],
  );

  const stageShellClasses = isImmersiveModeActive
    ? "relative z-10 flex h-screen min-h-screen w-screen items-stretch justify-stretch p-0"
    : "relative z-10 flex min-h-screen items-center justify-center px-4 py-5 sm:px-7 lg:px-10";

  const layoutClasses = isImmersiveModeActive
    ? "flex h-full min-h-screen w-full items-stretch justify-stretch"
    : isActivePortrait
      ? "grid min-w-0 w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(240px,0.72fr)_minmax(360px,1fr)_minmax(220px,0.58fr)]"
      : "grid min-w-0 w-full max-w-[1500px] items-center gap-6 xl:grid-cols-[minmax(250px,0.56fr)_minmax(640px,1.18fr)_minmax(220px,0.42fr)]";

  const videoFrameWidth = isImmersiveModeActive
    ? "100vw"
    : isActivePortrait
      ? "min(calc(100vw - 32px), 46.125vh, 460px)"
      : "min(calc(100vw - 32px), calc((100vh - 72px) * 16 / 9), 980px)";

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
    [clips.length, resetPlaybackStats],
  );

  const advance = useCallback(() => {
    resetPlaybackStats();
    setActiveIndex((currentIndex) => (currentIndex + 1) % clips.length);
  }, [clips.length, resetPlaybackStats]);

  const retreat = useCallback(() => {
    resetPlaybackStats();
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + clips.length) % clips.length,
    );
  }, [clips.length, resetPlaybackStats]);

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

  const toggleImmersiveMode = useCallback(() => {
    setImmersiveModeEnabled((isEnabled) => !isEnabled);
  }, []);

  useEffect(() => {
    const shouldOpenImmersiveModeByDefault = shouldOpenImmersiveMode(
      window.location.search,
      window.location.pathname,
    );

    const animationFrameId = window.requestAnimationFrame(() => {
      setImmersiveModeEnabled(shouldOpenImmersiveModeByDefault);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    applySoundPreference(videoRef.current, soundOn);
  }, [applySoundPreference, immersiveModeEnabled, soundOn]);

  useEffect(() => {
    let isCancelled = false;

    if (playbackMode === "stream") {
      return;
    }

    const loadClip = async (clip: LoopClip) => {
      const sourceOptions = [clip.src, clip.fallbackSrc].filter(Boolean) as string[];

      for (const source of sourceOptions) {
        try {
          const response = await loadVideoResponse(source, cacheName);
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
          return;
        } catch {
          continue;
        }
      }

      if (!isCancelled) {
        setCachedClipSources((currentSources) => ({
          ...currentSources,
          [clip.id]: clip.fallbackSrc ?? clip.src,
        }));
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
  }, [cacheName, clips, playbackMode]);

  const handleActiveVideoError = useCallback(() => {
    if (!activeClip.fallbackSrc || activeVideoSrc === activeClip.fallbackSrc) {
      return;
    }

    if (playbackMode === "stream") {
      setStreamFallbackSources((currentSources) => ({
        ...currentSources,
        [activeClip.id]: activeClip.fallbackSrc,
      }));
      return;
    }

    setCachedClipSources((currentSources) => ({
      ...currentSources,
      [activeClip.id]: activeClip.fallbackSrc,
    }));
  }, [activeClip.fallbackSrc, activeClip.id, activeVideoSrc, playbackMode]);

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

    if (!isMirrorModeActive || !activeVideoSrc || !video || !mirrorVideo) return;

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
  }, [activeVideoSrc, isMirrorModeActive, isPlaying]);

  return (
    <main
      ref={stageRef}
      className={`relative min-h-screen overflow-x-hidden bg-[#050505] text-white ${
        isImmersiveModeActive ? "h-screen overflow-hidden" : ""
      }`}
    >
      {isMirrorModeActive ? (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#030404_0%,#0a0f10_52%,#050505_100%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(18,175,191,0.3),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(224,31,115,0.25),transparent_24%),radial-gradient(circle_at_76%_86%,rgba(241,99,45,0.2),transparent_30%),linear-gradient(145deg,#071012_0%,#050505_48%,#12100c_100%)]" />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/76 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/84 to-transparent" />

      <div className={stageShellClasses}>
        <div className={layoutClasses}>
          {!isImmersiveModeActive ? (
            <section className="order-2 flex min-w-0 flex-col rounded-lg border border-white/12 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:order-1 lg:p-7">
              <div>
                <LogoImage logo={propertyLogo} priority />
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                  {location}
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
                  className="h-auto w-36 max-w-[48%] opacity-75"
                />
                {managementLogo ? (
                  <LogoImage logo={managementLogo} />
                ) : (
                  <p className="max-w-[34%] text-right font-mono text-xs leading-5 text-white/52">
                    {year}
                  </p>
                )}
              </div>
            </section>
          ) : null}

          <section
            className={`order-1 flex min-w-0 justify-start sm:justify-center lg:order-2 ${
              isImmersiveModeActive ? "h-full w-full" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden border bg-black shadow-[0_34px_100px_rgba(0,0,0,0.62)] ${
                isMirrorModeActive
                  ? "h-screen rounded-none border-0 shadow-none"
                  : isFullVideoModeActive
                    ? "h-screen rounded-none border-0 shadow-none"
                    : isActivePortrait
                      ? "aspect-[9/16] rounded-[34px] border-white/18"
                      : "aspect-video rounded-[26px] border-white/18"
              }`}
              style={
                isImmersiveModeActive
                  ? { width: videoFrameWidth, height: "100vh" }
                  : { width: videoFrameWidth }
              }
            >
              {isMirrorModeActive ? (
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

              {isMirrorModeActive ? (
                <div className="pointer-events-none absolute left-5 top-5 z-40 max-w-[calc(100vw-96px)] sm:left-7 sm:top-7">
                  <LogoImage logo={propertyLogo} compact />
                </div>
              ) : null}

              <video
                ref={videoRef}
                className={`relative z-10 ${
                  isMirrorModeActive
                    ? "mx-auto block h-full w-auto max-w-full cursor-pointer bg-transparent object-cover"
                    : isFullVideoModeActive
                      ? "h-full w-full cursor-pointer bg-black object-contain"
                    : `h-full w-full bg-black ${
                        isActivePortrait ? "object-cover" : "object-contain"
                      }`
                }`}
                src={activeVideoSrc || undefined}
                autoPlay
                muted={!soundOn}
                playsInline
                preload={isActiveVideoReady ? "auto" : "none"}
                onClick={togglePlayback}
                onEnded={advance}
                onError={handleActiveVideoError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget;
                  setDuration(video.duration || 0);

                  if (video.videoWidth && video.videoHeight) {
                    const measuredOrientation =
                      video.videoHeight > video.videoWidth
                        ? "portrait"
                        : "landscape";

                    setClipOrientations((currentOrientations) => ({
                      ...currentOrientations,
                      [activeClip.id]: measuredOrientation,
                    }));
                  }
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

              {isImmersiveModeActive ? (
                <div className="absolute bottom-28 right-5 z-50 flex gap-3 sm:bottom-32 sm:right-7 lg:bottom-36 lg:right-10">
                  <ImmersiveIconButton
                    label={soundOn ? "Mute audio" : "Turn audio on"}
                    icon="music"
                    onClick={toggleSound}
                    slashed={!soundOn}
                    tone={soundOn ? "success" : "danger"}
                  />
                  <ImmersiveIconButton
                    label="Show storyboard controls"
                    icon="controls"
                    onClick={toggleImmersiveMode}
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
                  isImmersiveModeActive ? "p-5 sm:p-8 lg:p-10" : "p-5"
                }`}
              >
                <div
                  className={`h-1 overflow-hidden rounded-full bg-white/18 ${
                    isImmersiveModeActive ? "mb-2 sm:mb-3" : "mb-3"
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
                        isImmersiveModeActive
                          ? "text-[0.62rem] sm:text-xs"
                          : "text-xs"
                      }`}
                    >
                      {activeClip.label}
                    </p>
                    <h2
                      className={`mt-1 font-semibold leading-none text-white ${
                        isImmersiveModeActive
                          ? "truncate text-lg sm:text-2xl"
                          : "text-2xl"
                      }`}
                    >
                      {activeClip.title}
                    </h2>
                  </div>
                  <p
                    className={`shrink-0 font-mono text-white/66 ${
                      isImmersiveModeActive
                        ? "text-[0.68rem] sm:text-xs"
                        : "text-xs"
                    }`}
                  >
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {!isImmersiveModeActive ? (
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

              <div className="mt-6 space-y-3">
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  }}
                >
                  <ControlButton
                    label="Previous video"
                    icon="chevronLeft"
                    onClick={retreat}
                    compact={!isActivePortrait}
                  />
                  <ControlButton
                    label={isPlaying ? "Pause video" : "Play video"}
                    icon={isPlaying ? "pause" : "play"}
                    onClick={togglePlayback}
                    compact={!isActivePortrait}
                  />
                  <ControlButton
                    label="Next video"
                    icon="chevronRight"
                    onClick={advance}
                    compact={!isActivePortrait}
                  />
                </div>
                <div
                  className={`grid gap-3 ${
                    isActivePortrait ? "" : "mx-auto"
                  }`}
                  style={{
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    width: isActivePortrait ? undefined : "100%",
                  }}
                >
                  <ControlButton
                    label={soundOn ? "Mute audio" : "Turn audio on"}
                    icon="music"
                    onClick={toggleSound}
                    compact={!isActivePortrait}
                    slashed={!soundOn}
                    tone={soundOn ? "success" : "danger"}
                  />
                  <ControlButton
                    label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    icon={isFullscreen ? "exitFullscreen" : "fullscreen"}
                    onClick={toggleFullscreen}
                    compact={!isActivePortrait}
                  />
                  <ControlButton
                    label={
                      isActivePortrait ? "Mirror fill mode" : "Full video mode"
                    }
                    icon="mirror"
                    onClick={toggleImmersiveMode}
                    compact={!isActivePortrait}
                  />
                </div>
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
