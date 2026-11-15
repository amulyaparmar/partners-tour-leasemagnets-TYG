"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

import styles from "./page.module.css";
import SupportBooking from "./support-booking";

type Gimbal = "osmo-mobile-6" | "osmo-mobile-se";
type Clip = { file: string; title: string; duration: string; captions?: string };

const clips: Record<Gimbal | "mic-mini" | "gimbal-functions", Clip> = {
  "osmo-mobile-6": { file: "osmo-mobile-6", title: "Osmo Mobile 6 · first use", duration: "5:44" },
  "osmo-mobile-se": { file: "osmo-mobile-se", title: "Osmo Mobile SE · first use", duration: "4:42" },
  "mic-mini": { file: "mic-mini", title: "Mic Mini · mobile receiver setup", duration: "2:47", captions: "mic-mini.en.vtt" },
  "gimbal-functions": { file: "gimbal-functions", title: "Osmo Mobile 6 · gimbal functions", duration: "2:48" },
};

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Check() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Video({ clip }: { clip: Clip }) {
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = `/guide/filming-setup/${clip.file}.mp4`;

  async function play() {
    if (!player.current) return;
    setStarted(true);
    try {
      await player.current.play();
    } catch {
      // Native controls remain available when a browser blocks programmatic play.
      player.current.focus();
    }
  }

  return (
    <figure className={styles.videoFigure}>
      <div className={styles.videoFrame}>
        <video
          ref={player}
          aria-label={clip.title}
          controls={started}
          playsInline
          preload="none"
          poster={`/guide/filming-setup/${clip.file}.jpg`}
          onError={() => setFailed(true)}
          onPlay={(event) => {
            setStarted(true);
            document.querySelectorAll("video").forEach((video) => {
              if (video !== event.currentTarget) video.pause();
            });
          }}
        >
          <source src={source} type="video/mp4" />
          {clip.captions && <track kind="subtitles" src={`/guide/filming-setup/${clip.captions}`} srcLang="en" label="English" default />}
          Your browser does not support embedded video. Open the video below.
        </video>
        {!started && (
          <button type="button" className={styles.playOverlay} onClick={play} aria-label={`Play ${clip.title}`}>
            <span className={styles.playCircle}><svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="currentColor"><path d="M8 4.5v15l12-7.5z" /></svg></span>
            <span className={styles.playLabel}>Watch the walkthrough <span>{clip.duration}</span></span>
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        <span>{clip.title}</span>
        <a href={source} target="_blank" rel="noreferrer">{failed ? "Video not loading? Open video" : "Open video"} <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
}

function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return <ol className={styles.steps}>{items.map((item, index) => <li key={item.title}><span className={styles.stepIndex}>{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}</ol>;
}

function SectionHeading({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className={styles.sectionHeading}><span className={styles.sectionNumber}>{number}</span><div><h2>{title}</h2><p>{note}</p></div></div>;
}

export default function FilmingGuide({ supportBookingUrl }: { supportBookingUrl: string | null }) {
  const [gimbal, setGimbal] = useState<Gimbal>("osmo-mobile-6");
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const allReady = checked.every(Boolean);

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#setup">Skip to setup</a>
      <header className={styles.header}>
        <Link href="/" aria-label="Tour home"><Image src="/logos/tour-logo-tyg.svg" alt="Tour" width={111} height={40} priority /></Link>
        <span className={styles.headerLabel}>CLIENT FILMING GUIDE</span>
        <a className={styles.headerLink} href="#support">Book a setup call <Arrow /></a>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="guide-title">
          <div className={styles.eyebrow}><span /> LET’S GET YOU SET UP</div>
          <div className={styles.heroRow}>
            <h1 id="guide-title">Set up.<br /><span>Start filming.</span></h1>
            <div className={styles.heroCopy}>
              <p>Your phone. Your gimbal. Your mic.<br />Follow these three steps and you’re ready to go.</p>
              <a className={styles.startButton} href="#setup">Set up my kit <Arrow down /></a>
              <span className={styles.heroNote}>Short instructions. Video help when you need it.</span>
              <a className={styles.heroSupport} href="#support">Need a hand? Book a setup call ↗</a>
            </div>
          </div>
          <div className={styles.before}>
            <strong>Before you start</strong>
            <span><Check /> Charge your phone, gimbal &amp; mic</span>
            <span><Check /> Turn on phone Bluetooth</span>
            <a href="https://www.dji.com/downloads/djiapp/dji-mimo" target="_blank" rel="noreferrer"><Check /> Install DJI Mimo <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <nav className={styles.jumpNav} aria-label="Setup steps">
          <a href="#setup"><span>01</span> Set up gimbal</a>
          <a href="#microphone"><span>02</span> Connect mic</a>
          <a href="#controls"><span>03</span> Learn controls</a>
        </nav>

        <section id="setup" className={styles.section} aria-label="Step 1: Set up your gimbal">
          <SectionHeading number="01" title="Set up your gimbal" note="Choose the model in your kit. You only need to watch one." />
          <div className={styles.modelPicker} role="group" aria-label="Choose your gimbal model">
            <button type="button" aria-pressed={gimbal === "osmo-mobile-6"} onClick={() => setGimbal("osmo-mobile-6")}>Osmo Mobile 6 {gimbal === "osmo-mobile-6" && <Check />}</button>
            <button type="button" aria-pressed={gimbal === "osmo-mobile-se"} onClick={() => setGimbal("osmo-mobile-se")}>Osmo Mobile SE {gimbal === "osmo-mobile-se" && <Check />}</button>
          </div>
          <div className={styles.contentGrid}>
            <Video key={gimbal} clip={clips[gimbal]} />
            <div className={styles.instructions}>
              <Steps items={[
                { title: "Unfold the gimbal", body: gimbal === "osmo-mobile-6" ? "Open the arm and unlock the roll axis as shown. The Mobile 6 powers on when unfolded." : "Open the arm as shown in the video. Attach the phone before switching the gimbal on." },
                { title: "Attach your phone", body: "Center the clamp on your phone. Align the white dots on the clamp and gimbal, then snap them together securely." },
                { title: gimbal === "osmo-mobile-6" ? "Connect in DJI Mimo" : "Power on & connect", body: gimbal === "osmo-mobile-6" ? "Open DJI Mimo, tap the device icon and select your gimbal. Follow the pairing and first-time activation prompts." : "Hold the M button to power on. Open DJI Mimo, select your gimbal and follow the pairing and activation prompts." },
                { title: "Choose your orientation", body: "Press the switch button twice to rotate between horizontal and vertical. Use the format requested for your shoot." },
              ]} />
              <p className={styles.tip}><span>QUICK CHECK</span> The phone is secure and level, and the arm moves freely.</p>
            </div>
          </div>
        </section>

        <section id="microphone" className={styles.section} aria-label="Step 2: Connect your mic">
          <SectionHeading number="02" title="Connect your mic" note="DJI Mic Mini + the small USB-C mobile receiver." />
          <div className={styles.contentGrid}>
            <Video clip={clips["mic-mini"]} />
            <div className={styles.instructions}>
              <Steps items={[
                { title: "Plug the receiver into your phone", body: "Use the phone’s USB-C port. For a Lightning iPhone, use the DJI mobile receiver’s USB-C to Lightning adapter." },
                { title: "Turn on the clip-on mic", body: "Hold its power button. If it is already paired, it reconnects automatically. Otherwise, follow the pairing tip below." },
                { title: "Clip it near your collar", body: "Keep the microphone clear of hair, jewelry and clothing that could rub against it. Add the furry windscreen outdoors." },
              ]} />
              <details className={styles.inlineHelp}>
                <summary>First time pairing? <span aria-hidden="true">+</span></summary>
                <p>For Mic Mini, use the receiver’s green-light mode (double-press its linking button to switch modes). Hold the receiver’s linking button for 2 seconds, then hold the mic’s linking button for 2 seconds. Wait for the connection lights to stop flashing.</p>
              </details>
              <p className={styles.tip}><span>QUICK CHECK</span> The receiver connects to your phone. Keep it clear of the moving gimbal arm.</p>
            </div>
          </div>
        </section>

        <section id="controls" className={styles.section} aria-label="Step 3: Learn the controls">
          <SectionHeading number="03" title="Learn the essentials" note="A few controls are all you need to get started." />
          <div className={styles.contentGrid}>
            <Video clip={clips["gimbal-functions"]} />
            <div className={styles.instructions}>
              <div className={styles.controlList}>
                <div><span className={styles.controlIcon}>●</span><div><h3>Start / stop recording</h3><p>In DJI Mimo’s video mode, press the record button once.</p></div></div>
                <div><span className={styles.controlIcon}>⌖</span><div><h3>Recenter your phone</h3><p>Double-press the trigger on the back of the handle.</p></div></div>
                <div><span className={styles.controlIcon}>↔</span><div><h3>Adjust your framing</h3><p>Move the joystick gently to pan left/right or tilt up/down.</p></div></div>
                <div><span className={styles.controlIcon}>M</span><div><h3>Choose Follow mode</h3><p>Press M to cycle modes. Start with Follow for natural camera movement.</p></div></div>
              </div>
              <p className={styles.tip}><span>KEEP IT SIMPLE</span> Walk slowly, hold the grip steady and make gentle turns.</p>
              <p className={styles.smallNote}>The video shows Mobile 6. These basic controls also apply to Mobile SE.</p>
            </div>
          </div>
        </section>

        <section id="test" className={styles.testSection} aria-labelledby="test-title">
          <div className={styles.testIntro}>
            <span className={styles.testBadge}>ONE LAST THING</span>
            <h2 id="test-title">Give it 10 seconds.</h2>
            <p>Record a short clip while speaking and walking. Play it back, then check these three things.</p>
          </div>
          <div className={styles.checklist}>
            {["My voice sounds clear", "The video looks smooth and level", "The video is in the right orientation"].map((label, index) => (
              <label key={label}>
                <input type="checkbox" checked={checked[index]} onChange={(event) => setChecked((previous) => previous.map((value, i) => i === index ? event.target.checked : value))} />
                <span className={styles.checkbox}><Check /></span><span>{label}</span>
              </label>
            ))}
            <p className={styles.readyMessage} role="status">{allReady ? <><Check /> You’re ready. Let’s get filming!</> : "A quick test now makes the rest of your shoot easier."}</p>
          </div>
        </section>

        <div className={styles.troubleshooting}>
          <details><summary>Something not working? <span aria-hidden="true">+</span></summary><div>
            <p><strong>Phone tilted or gimbal shaking?</strong> Recenter the phone clamp, remove a bulky case, and make sure the receiver is not touching the arm. Use Gimbal Auto Calibration in DJI Mimo on a flat surface if needed.</p>
            <p><strong>Mic not picking up your voice?</strong> Check that the receiver is fully inserted and the mic is linked. Record another test in the app you’ll use for the shoot.</p>
            <p><strong>Still stuck?</strong> <a href="#support">Book a setup call</a> and we’ll help before you record the full shoot.</p>
          </div></details>
        </div>
        <SupportBooking bookingUrl={supportBookingUrl} />
      </main>

      <footer className={styles.footer}>
        <span>Made for your next great tour.</span>
        <span>Video tutorials by DJI · <a href="https://www.dji.com/support" target="_blank" rel="noreferrer">Equipment support ↗</a></span>
      </footer>
    </div>
  );
}
