# Client filming equipment guide

Route: `/filming-setup`.

Three steps: choose Mobile 6 or Mobile SE, connect a Mic Mini using the small
DJI Mic Series Mobile Receiver, then learn the gimbal controls. The final
checklist is session-only and makes no network requests. Switching the gimbal
remounts its player; playing one video pauses the others. Videos load only on
play, use native controls, and have an open-in-new-tab fallback.

## Media

The four videos were verified in the supplied Frame.io folder:
https://app.frame.io/project/d0a1f34b-cd7d-4b28-8447-79b1306bc2ef/e7ee0376-9e53-4c71-b900-b6f66ac90bbb

The matching original files were already available locally in Downloads, plus
the Mic Mini tutorial previously downloaded to Desktop. Original durations and
combined size (223.29 MB) match the folder. Originals remain unchanged.

| Original | Page asset | Duration |
| --- | --- | --- |
| DJI Osmo Mobile 6 SetUp.mp4 | osmo-mobile-6.mp4 | 5:44 |
| DJI Osmo Mobile SE Gimbal.mp4 | osmo-mobile-se.mp4 | 4:42 |
| DJI Mic Series - Mobile Receiver Tutorial.mp4 | mic-mini.mp4 | 2:47 |
| DJI Osmo Mobile Functions.mp4 | gimbal-functions.mp4 | 2:48 |

Assets live in `public/guide/filming-setup/`: H.264/AAC MP4, 1280×720,
CRF 26, with faststart metadata. Total video payload is approximately 53.4 MB,
and `preload="none"` prevents downloading all clips on page load. JPEG posters
come from the videos. English WebVTT subtitles for the microphone tutorial were
extracted from the original MP4. Gimbal tutorials have on-screen instructions;
the short text instructions alongside each video provide an additional reading
path. Keep these files with the route when deploying; do not replace sources
with expiring signed Frame.io download URLs.

## Instruction references

- https://www.dji.com/support/product/osmo-mobile-6
- https://www.dji.com/support/product/osmo-mobile-se
- https://www.dji.com/mic-mini/faq
- https://dl.djicdn.com/downloads/DJI_Mic_Series_MobileRX/20251015/UM/MobileRX_um_en.pdf
- https://dl.djicdn.com/downloads/DJI_Osmo_Mobile_6/UM/20240614/Osmo_Mobile_6_User_Manual_V1.6_en.pdf

No publishing or Frame.io sharing settings are changed by this route.

## Setup-call booking

The support form requires **Property Name**, **Email**, and **Phone number**,
then opens Meliza's existing Zcal appointment inline:
https://zcal.co/meliza/45min (Equipment Setup & Filming Prep, 45 minutes).
The embed uses its canonical URL, `https://zcal.co/i/CR813A5C`, because the vanity
URL sends `X-Frame-Options: DENY` and cannot be embedded.
The user selected Meliza as the only host; no team calendar or extra guest is
added. The email support link also goes directly to Meliza.

The default public appointment URL is set in `support-booking-config.ts`.
`FILMING_SUPPORT_BOOKING_URL` can override it at build time. An explicitly empty
or invalid value disables the form with an email fallback. Only HTTPS Zcal
canonical `/i/` appointment links are accepted (the known vanity link is mapped
to its canonical URL), and query parameters are removed so configured
URLs cannot add unrequested guests. No scheduler API keys or Google credentials
are used by this website.

The native Zcal embed receives these documented prefill parameters:

| Required page field | Zcal field | Purpose |
| --- | --- | --- |
| Property Name | `name` | Property used as attendee display name and in event details |
| Email | `email` | Client confirmation/invitation address |
| Phone number | `a0` | First custom booking question: Phone Number (required) |

The appointment's public booking form was inspected on 2026-11-15. Its first
custom question is required Phone Number, and its duration is 45 minutes. If
questions are reordered or the appointment URL changes, update and verify this
mapping before publishing. The Zcal final form labels the property value as
Name; clients do not need to enter a separate personal name on our page.

Zcal manages availability, timezone conversion, conflict checks, the calendar
write, confirmation, cancellation, and rescheduling. Its existing available
hours and calendar settings are used unchanged. Merely submitting our form does
not reserve a slot: clients must select a time and confirm it in Zcal. The page
never generates its own booking-success message.

The iframe is created only after validation, uses the provider's embed mode,
and has a fixed responsive width with internal scrolling for longer screens.
A direct-link fallback remains available if embedded booking is blocked.
Editing details unmounts the calendar and restores focus without losing input.

Details stay in form controls/React memory until the embed is opened. They are
then passed to Zcal in its iframe URL, as required for prefilling. They are not
written to this site's top-level URL, browser storage, or our server. The
fallback link omits personal details; visitors re-enter them on Zcal.

Verification covers required fields, prefilled values in the actual Zcal final
booking form, mobile layout, and editing details. No appointment was submitted
and no test event or invitation was sent. Final calendar insertion is handled
by the existing Zcal integration and was not tested with a live booking.

References:
- https://help.zcal.co/share/embed
- https://help.zcal.co/invite-settings/pre-populate-form-fields
- https://help.zcal.co/getting-started
