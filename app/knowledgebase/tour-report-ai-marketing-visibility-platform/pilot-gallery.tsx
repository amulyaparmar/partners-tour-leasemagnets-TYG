"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";

import placeholders from "./pilot-placeholders.json";

import styles from "./page.module.css";

const imageBase = "/knowledgebase/tour-report-ai-marketing-visibility-platform";
const screens = [
  {
    src: `${imageBase}/pilot-traffic`,
    blurDataURL: placeholders["traffic"],
    label: "Traffic",
    caption: "Traffic comparison / property + comps",
    alt: "Traffic comparison across a multifamily property and its comps",
  },
  {
    src: `${imageBase}/pilot-reviews`,
    blurDataURL: placeholders["reviews"],
    label: "Reviews",
    caption: "Review momentum / property + comps",
    alt: "Review momentum comparison in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-search`,
    blurDataURL: placeholders["search"],
    label: "SEO / GEO",
    caption: "Search visibility / SEO + GEO",
    alt: "Search event and AI visibility monitoring in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-ads`,
    blurDataURL: placeholders["ads"],
    label: "My ads",
    caption: "Current ads / property view",
    alt: "Google and Meta advertising view in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-comp-ads`,
    blurDataURL: placeholders["comp-ads"],
    label: "Comp ads",
    caption: "Current ads / competitor view",
    alt: "Competitor advertising comparison in a multifamily pilot workspace",
  },
];

// Serve pre-sized WebP files directly, avoiding a cold image-optimization request.
function pilotImageLoader({ src, width }: ImageLoaderProps) {
  const size = width <= 320 ? 320 : width <= 960 ? 960 : 1920;
  return `${src}-${size}.webp`;
}

export default function PilotGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<{ id: string; expiresAt: string } | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resendDeadline, setResendDeadline] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLButtonElement>(null);
  const submittingRef = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeScreen = screens[activeIndex];

  function changeScreen(direction: -1 | 1) {
    setActiveIndex((index) => (index + direction + screens.length) % screens.length);
  }

  useEffect(() => {
    if (!challenge || !resendDeadline) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((resendDeadline - Date.now()) / 1000));
      setResendSeconds(remaining);
      if (remaining === 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [challenge, resendDeadline]);

  async function requestAccess(action: "start" | "verify", website = "") {
    if (submittingRef.current) return;
    if (action === "verify" && challenge && Date.now() >= Date.parse(challenge.expiresAt)) {
      setError("This code has expired. Request a new code below.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/tour-report/access/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, ...(action === "verify" ? { code, challengeId: challenge?.id } : {}) }),
        signal: AbortSignal.timeout(35000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t confirm your request. Please try again.");
      if (action === "start") {
        if (!result.sent || !result.challengeId || !result.expiresAt) throw new Error("We couldn’t send a notification code. Please try again.");
        setEmail(result.email);
        setChallenge({ id: result.challengeId, expiresAt: result.expiresAt });
        setCode("");
        setResendSeconds(60);
        setResendDeadline(Date.now() + 60000);
        requestAnimationFrame(() => codeRef.current?.focus());
      } else {
        if (result.verified !== true) throw new Error("That code could not be confirmed. Please try again.");
        setUnlocked(true);
        setChallenge(null);
        setCode("");
        requestAnimationFrame(() => heroRef.current?.focus());
      }
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" && cause.name !== "TypeError"
        ? cause.message : "We couldn’t connect. Please try again shortly.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function submitAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const website = String(new FormData(event.currentTarget).get("website") || "");
    void requestAccess(challenge ? "verify" : "start", website);
  }

  function changeEmail() {
    setChallenge(null);
    setCode("");
    setError("");
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  return (
    <>
      <div className={styles.pilotGallery} aria-label="Private pilot workspace screenshots">
        <div className={styles.pilotPreview}>
          <button
            ref={heroRef}
            type="button"
            className={`${styles.pilotHero} ${!unlocked ? styles.pilotLocked : ""}`}
            onClick={() => {
              if (!unlocked) { (challenge ? codeRef : emailRef).current?.focus(); return; }
              setDialogOpen(true);
              dialogRef.current?.showModal();
            }}
            tabIndex={unlocked ? 0 : -1}
            aria-label={unlocked ? `Enlarge the ${activeScreen.label} pilot screenshot` : "Enter your email to unlock the pilot screenshots"}
          >
            <Image
              loader={pilotImageLoader}
              src={activeScreen.src}
              placeholder="blur"
              blurDataURL={activeScreen.blurDataURL}
              alt={activeScreen.alt}
              fill
              sizes="(max-width: 900px) 90vw, (max-width: 1500px) 55vw, 760px"
              className={styles.pilotImage}
            />
            <span className={styles.pilotHeroLabel}>{activeScreen.caption}</span>
          </button>
          {!unlocked && (
            <div className={styles.pilotGate}>
              <form className={styles.pilotForm} onSubmit={submitAccess} aria-labelledby="pilot-access-title" aria-busy={submitting}>
                <span className={styles.pilotGateEyebrow}>{challenge ? "02 / VERIFY YOUR EMAIL" : "01 / REPORT ACCESS"}</span>
                <h3 id="pilot-access-title">{challenge ? "Check your inbox" : "See inside Tour.report"}</h3>
                {challenge ? (
                  <>
                    <p role="status">We sent a notification code to <strong className={styles.pilotEmailAddress}>{email}</strong>.</p>
                    <label htmlFor="pilot-code">6-digit notification code</label>
                    <input
                      ref={codeRef} id="pilot-code" name="code" type="text"
                      inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}"
                      placeholder="000000" required minLength={6} maxLength={6}
                      value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={submitting} className={styles.pilotCodeInput}
                      aria-describedby={error ? "pilot-form-error" : "pilot-code-help"}
                    />
                    <small id="pilot-code-help">Look for the email from notifications@tour.report. Your code expires in 10 minutes.</small>
                    <button type="submit" disabled={submitting || code.length !== 6}>{submitting ? "Please wait…" : "Verify & view report"}<span aria-hidden="true"> →</span></button>
                    <div className={styles.pilotCodeActions}>
                      <button type="button" disabled={submitting || resendSeconds > 0} onClick={() => void requestAccess("start")}>
                        {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
                      </button>
                      <button type="button" disabled={submitting} onClick={changeEmail}>Change email</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Enter your work email. We’ll send a notification code to unlock the report.</p>
                    <label htmlFor="pilot-email">Work email</label>
                    <input
                      ref={emailRef} id="pilot-email" name="email" type="email" autoComplete="email"
                      placeholder="you@company.com" required maxLength={254}
                      value={email} onChange={(event) => setEmail(event.target.value)}
                      disabled={submitting} aria-describedby={error ? "pilot-form-error" : undefined}
                    />
                    <div className={styles.pilotHoneypot} aria-hidden="true">
                      <label htmlFor="pilot-website">Website</label>
                      <input id="pilot-website" name="website" tabIndex={-1} autoComplete="off" />
                    </div>
                    <button type="submit" disabled={submitting}>{submitting ? "Sending code…" : "Email me a code"}<span aria-hidden="true"> →</span></button>
                    <small>By continuing, you agree that our team may contact you about Tour.report.</small>
                  </>
                )}
                {error && <p id="pilot-form-error" className={styles.pilotFormError} role="alert">{error}</p>}
              </form>
            </div>
          )}
        </div>
        {unlocked && <p className={styles.pilotSuccess} role="status">Email verified. Choose a view below, then click the image to explore.</p>}
        <div className={styles.pilotThumbs} aria-label="Choose a workspace view">
          {screens.map((screen, index) => (
            <button
              key={screen.src}
              type="button"
              className={styles.pilotThumb}
              aria-label={`Show ${screen.label} screenshot`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className={`${styles.pilotThumbImage} ${!unlocked ? styles.pilotLocked : ""}`}>
                <Image
                  loader={pilotImageLoader}
                  src={screen.src}
                  placeholder="blur"
                  blurDataURL={screen.blurDataURL}
                  alt=""
                  fill
                  sizes="(max-width: 540px) 44vw, (max-width: 900px) 22vw, 12vw"
                  className={styles.pilotImage}
                />
              </span>
              <span className={styles.pilotThumbLabel}>{screen.label}</span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.pilotDialog}
        aria-labelledby="pilot-dialog-title"
        onClose={() => setDialogOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") changeScreen(-1);
          if (event.key === "ArrowRight") changeScreen(1);
        }}
      >
        <div className={styles.pilotDialogPanel}>
          <div className={styles.pilotDialogHeader}>
            <div>
              <span>PRIVATE MULTIFAMILY PILOT / WORKSPACE VIEW</span>
              <strong id="pilot-dialog-title">{activeScreen.label}</strong>
            </div>
            <div className={styles.pilotDialogActions}>
              <button type="button" onClick={() => changeScreen(-1)} aria-label="Previous screenshot">
                ←
              </button>
              <span>{String(activeIndex + 1).padStart(2, "0")} / 05</span>
              <button type="button" onClick={() => changeScreen(1)} aria-label="Next screenshot">
                →
              </button>
              <button
                type="button"
                className={styles.pilotDialogClose}
                onClick={() => dialogRef.current?.close()}
                aria-label="Close enlarged screenshot"
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.pilotDialogImage}>
            {dialogOpen && <Image
              loader={pilotImageLoader}
              src={activeScreen.src}
              placeholder="blur"
              blurDataURL={activeScreen.blurDataURL}
              alt={activeScreen.alt}
              fill
              sizes="(max-width: 1680px) 95vw, 1600px"
              loading="eager"
              className={styles.pilotExpandedImage}
            />}
          </div>
          <p className={styles.pilotDialogCaption}>{activeScreen.caption} · Use arrows to browse or Esc to close.</p>
        </div>
      </dialog>
    </>
  );
}
