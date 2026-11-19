import type { Metadata } from "next";
import { Agreement, SampleFilms } from "./proposal";
import styles from "./proposal.module.css";

export const metadata: Metadata = { title: "REIIF’s first five years · Forum production agreement" };

export default function ForumLaunchVideo() {
  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <header className={styles.header}>
          <span className={styles.brand}>LeaseMagnets</span>
          <a className={styles.button} href="#agreement">Review agreement</a>
        </header>
        <section className={styles.hero}>
          <p>Prepared for Bruce Costa · Forum Asset Management</p>
          <h1>REIIF’s first five years</h1>
          <p>From five assets worth roughly $200 million to 33 assets worth $3 billion. A film told by the people who built the portfolio, on location at the properties behind those numbers.</p>
        </section>
        <SampleFilms />
        <Agreement />
      </div>
    </main>
  );
}
