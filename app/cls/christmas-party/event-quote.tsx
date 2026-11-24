"use client";

import { useState } from "react";
import { Signatory } from "../../forum/launch-video/proposal";
import formStyles from "../../forum/launch-video/proposal.module.css";
import styles from "./proposal.module.css";

const setups = [
  { label: "One camera", filming: 800 },
  { label: "Two cameras", filming: 1500 },
];
const edit = 700;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function EventQuote() {
  const [selected, setSelected] = useState(setups[0]);
  const [signed, setSigned] = useState(false);
  return (
    <section className={styles.quote} id="quote" aria-labelledby="quote-title">
      <h2 id="quote-title">Christmas party quote</h2>
      <p>Pricing covers one December 2026 party. Lauren and LeaseMagnets will confirm the date, venue, filming hours and delivery schedule before booking.</p>
      <fieldset disabled={signed}>
        <legend>Choose your camera setup</legend>
        <div className={styles.rates}>
          {setups.map(setup => (
            <label key={setup.label}>
              <input type="radio" name="camera-setup" checked={selected === setup} onChange={() => setSelected(setup)} />
              <span><strong>{setup.label}</strong><br />{currency.format(setup.filming)} filming + {currency.format(edit)} editing</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.total} aria-live="polite">
        <span>Christmas party total · {selected.label}</span>
        <strong>{currency.format(selected.filming + edit)}</strong>
      </div>
      <p className={styles.conference}>The CLS Legacy Conference can be quoted separately.</p>
      <h2 className={styles.signHeading}>Signatures</h2>
      <p>By signing, each party approves the Christmas party scope and total above. Print or save a PDF to keep a copy with the signatures entered on this device.</p>
      <div className={formStyles.signGrid}>
        <Signatory provider onSign={() => setSigned(true)} />
        <Signatory provider={false} customer="Campus Life & Style" onSign={() => setSigned(true)} />
      </div>
      <button className={formStyles.button} type="button" onClick={() => window.print()}>Print or save PDF</button>
    </section>
  );
}
