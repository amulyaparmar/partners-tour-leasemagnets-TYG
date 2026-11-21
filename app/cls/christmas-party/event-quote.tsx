"use client";

import { Signatory } from "../../forum/launch-video/proposal";
import formStyles from "../../forum/launch-video/proposal.module.css";
import styles from "./proposal.module.css";

const filming = 1500;
const edit = 800;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function EventQuote() {
  return (
    <section className={styles.quote} id="quote" aria-labelledby="quote-title">
      <h2 id="quote-title">Christmas party quote</h2>
      <p>Pricing covers one December 2026 party. Lauren and LeaseMagnets will confirm the date, venue, filming hours and delivery schedule before booking.</p>
      <dl className={styles.rates}>
        <div><dt>On-site filming</dt><dd>{currency.format(filming)}</dd></div>
        <div><dt>Edited party recap</dt><dd>{currency.format(edit)}</dd></div>
      </dl>
      <div className={styles.total}>
        <span>Christmas party total</span>
        <strong>{currency.format(filming + edit)}</strong>
      </div>
      <p className={styles.conference}>The CLS Legacy Conference can be quoted separately.</p>
      <h2 className={styles.signHeading}>Signatures</h2>
      <p>By signing, each party approves the Christmas party scope and total above. Print or save a PDF to keep a copy with the signatures entered on this device.</p>
      <div className={formStyles.signGrid}>
        <Signatory provider />
        <Signatory provider={false} customer="Campus Life & Style" />
      </div>
      <button className={formStyles.button} type="button" onClick={() => window.print()}>Print or save PDF</button>
    </section>
  );
}
