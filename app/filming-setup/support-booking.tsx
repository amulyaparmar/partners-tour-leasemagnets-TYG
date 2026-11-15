"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";

import styles from "./page.module.css";

type Details = { propertyName: string; email: string; phone: string };
const subscribeToHydration = () => () => {};

function getEmbedUrl(bookingUrl: string, details: Details) {
  const url = new URL(bookingUrl);
  url.searchParams.set("embed", "1");
  url.searchParams.set("embedType", "iframe");
  // This appointment has one required custom question, Phone Number (index 0).
  // Use the property as the attendee name so it is included in the calendar event.
  url.searchParams.set("name", details.propertyName);
  url.searchParams.set("email", details.email);
  url.searchParams.set("a0", details.phone);
  return url.toString();
}

export default function SupportBooking({ bookingUrl }: { bookingUrl: string | null }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [details, setDetails] = useState<Details | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const propertyInput = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (details) heading.current?.focus();
    else if (restoreFocus.current) {
      propertyInput.current?.focus();
      restoreFocus.current = false;
    }
  }, [details]);

  function chooseTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookingUrl) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const propertyName = String(data.get("propertyName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;

    propertyInput.current?.setCustomValidity(propertyName ? "" : "Please enter your property name.");
    const digits = phone.replace(/\D/g, "");
    phoneInput.setCustomValidity(
      /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15
        ? ""
        : "Please enter a phone number with 7–15 digits, including your country code."
    );
    if (!form.reportValidity()) return;
    setDetails({ propertyName, email, phone });
  }

  return (
    <section id="support" className={styles.supportSection} aria-labelledby="support-title">
      <div className={styles.supportIntro}>
        <span className={styles.supportBadge}>A LITTLE EXTRA HELP</span>
        <h2 id="support-title">Let’s set it up together.</h2>
        <p>Stuck on a step? Book 45 minutes with Meliza to walk through your gimbal and mic. Pick a time that works for you.</p>
        <a href="mailto:meliza@leasemagnets.com?subject=Filming%20equipment%20setup%20help">Prefer email? Get in touch <span aria-hidden="true">↗</span></a>
      </div>

      <div className={styles.bookingCard} hidden={details !== null}>
        <h3>Book a setup call</h3>
        <p className={styles.bookingNote}>Your details first, then choose a time. All fields are required.</p>
        <form method="post" onSubmit={chooseTime}>
          <fieldset disabled={!bookingUrl || !hydrated} className={styles.bookingFields}>
            <label htmlFor="support-property">Property Name
              <input ref={propertyInput} id="support-property" name="propertyName" autoComplete="organization" required maxLength={150} placeholder="Your property’s name" onChange={(event) => event.currentTarget.setCustomValidity("")} />
            </label>
            <label htmlFor="support-email">Email
              <input id="support-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@property.com" />
            </label>
            <label htmlFor="support-phone">Phone number
              <input id="support-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="+1 (555) 123-4567" aria-describedby="support-phone-hint" onChange={(event) => event.currentTarget.setCustomValidity("")} />
              <span id="support-phone-hint" className={styles.fieldHint}>Include your country code.</span>
            </label>
            <button type="submit" className={styles.bookingButton}>Choose a time <span aria-hidden="true">→</span></button>
          </fieldset>
          {bookingUrl ? (
            <p className={styles.bookingFinePrint}>We’ll use these details to arrange your setup call. Scheduling is provided by Zcal.</p>
          ) : (
            <p className={styles.bookingUnavailable}>Online booking isn’t available right now. <a href="mailto:meliza@leasemagnets.com?subject=Filming%20equipment%20setup%20help">Email Meliza for setup help.</a></p>
          )}
        </form>
        {bookingUrl && <noscript><p className={styles.bookingUnavailable}>To book a call, <a href={bookingUrl}>open Meliza’s booking page</a>.</p></noscript>}
      </div>

      {details && bookingUrl && (
        <div className={styles.bookingCalendar}>
          <div className={styles.bookingCalendarHeader}>
            <div>
              <h3 ref={heading} tabIndex={-1}>Choose a time</h3>
              <p>Your call is booked once you see the confirmation below.</p>
            </div>
            <button type="button" onClick={() => {
              restoreFocus.current = true;
              setDetails(null);
            }}>Edit details</button>
          </div>
          <iframe
            className={styles.bookingFrame}
            title="Book a 45-minute equipment setup call with Meliza"
            src={getEmbedUrl(bookingUrl, details)}
            referrerPolicy="no-referrer"
          />
          <p className={styles.bookingFinePrint}>Calendar not loading? <a href={bookingUrl} target="_blank" rel="noreferrer">Open booking in a new tab ↗</a> and enter your details there.</p>
        </div>
      )}
    </section>
  );
}
