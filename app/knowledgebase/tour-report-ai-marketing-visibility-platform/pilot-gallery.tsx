"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import styles from "./page.module.css";

const imageBase = "/knowledgebase/tour-report-ai-marketing-visibility-platform";
const screens = [
  {
    src: `${imageBase}/pilot-traffic.png`,
    label: "Traffic",
    caption: "Traffic comparison / property + comps",
    alt: "Traffic comparison across a multifamily property and its comps",
  },
  {
    src: `${imageBase}/pilot-reviews.png`,
    label: "Reviews",
    caption: "Review momentum / property + comps",
    alt: "Review momentum comparison in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-search.png`,
    label: "SEO / GEO",
    caption: "Search visibility / SEO + GEO",
    alt: "Search event and AI visibility monitoring in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-ads.png`,
    label: "My ads",
    caption: "Current ads / property view",
    alt: "Google and Meta advertising view in a multifamily pilot workspace",
  },
  {
    src: `${imageBase}/pilot-comp-ads.png`,
    label: "Comp ads",
    caption: "Current ads / competitor view",
    alt: "Competitor advertising comparison in a multifamily pilot workspace",
  },
];

export default function PilotGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeScreen = screens[activeIndex];

  function changeScreen(direction: -1 | 1) {
    setActiveIndex((index) => (index + direction + screens.length) % screens.length);
  }

  return (
    <>
      <div className={styles.pilotGallery} aria-label="Private pilot workspace screenshots">
        <button
          type="button"
          className={styles.pilotHero}
          onClick={() => dialogRef.current?.showModal()}
          aria-label={`Enlarge the ${activeScreen.label} pilot screenshot`}
        >
          <Image
            src={activeScreen.src}
            alt={activeScreen.alt}
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className={styles.pilotImage}
          />
          <span className={styles.pilotHeroLabel}>{activeScreen.caption}</span>
        </button>
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
              <span className={styles.pilotThumbImage}>
                <Image
                  src={screen.src}
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
            <Image
              src={activeScreen.src}
              alt={activeScreen.alt}
              fill
              sizes="95vw"
              className={styles.pilotExpandedImage}
            />
          </div>
          <p className={styles.pilotDialogCaption}>{activeScreen.caption} · Use arrows to browse or Esc to close.</p>
        </div>
      </dialog>
    </>
  );
}
