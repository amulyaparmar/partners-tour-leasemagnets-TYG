import type { Metadata } from "next";
import Image from "next/image";
import { SampleFilms } from "../../forum/launch-video/proposal";
import { EventQuote } from "./event-quote";
import holidayLogo from "./holiday-logo.png";
import styles from "./proposal.module.css";

export const metadata: Metadata = {
  title: "CLS Christmas Party · Event film proposal",
  description: "Event filming, editing and optional interview coverage for Campus Life & Style.",
};

export default function ClsEventProposal() {
  return (
    <main className={styles.page}>
      <div className={styles.cover}>
        <div className={styles.wrap}>
          <header className={styles.header}>
            <Image src={holidayLogo} alt="Tour and LeaseMagnets" width={138} priority />
            <a href="#quote">Review pricing</a>
          </header>
          <section className={styles.hero}>
            <p>Prepared for Campus Life &amp; Style</p>
            <h1>CLS Christmas Party<span aria-hidden="true" className={styles.tree}>&nbsp;🎄</span></h1>
            <p className={styles.intro}>A film of the December celebration, from the first arrivals to the last toast, for colleagues across Campus Life &amp; Style.</p>
          </section>
        </div>
      </div>
      <div className={styles.wrap}>
        <section className={styles.content} aria-labelledby="coverage-title">
          <div>
            <h2 id="coverage-title">Filming the December party</h2>
            <article className={styles.option}>
              <h3>On the night</h3>
              <p>We’ll film the room before guests arrive, then capture greetings, candid moments and the toasts Lauren flags on the evening’s schedule.</p>
            </article>
            <article className={styles.option}>
              <h3>The party recap</h3>
              <p>The edited film brings those moments together for the CLS team to share. With the interview add-on, guests can also record a short year-end message in a lit, miked setup.</p>
            </article>
          </div>
          <aside className={styles.sample} aria-labelledby="sample-title">
            <h2 id="sample-title">Previous work with CLS</h2>
            <SampleFilms clsOnly />
          </aside>
        </section>
        <EventQuote />
      </div>
    </main>
  );
}
