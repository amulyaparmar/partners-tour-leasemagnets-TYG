// Canonical invite ID for https://zcal.co/meliza/45min. The vanity URL sends
// X-Frame-Options: DENY; Zcal's /i/ endpoint supports embedded booking.
export const DEFAULT_SUPPORT_BOOKING_URL = "https://zcal.co/i/CR813A5C";

/** Public appointment URL. Availability and calendar writes are managed in Zcal. */
export function getSupportBookingUrl(value: string | undefined): string | null {
  const configured = value === undefined ? DEFAULT_SUPPORT_BOOKING_URL : value.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "zcal.co" ||
      url.port || url.username || url.password
    ) return null;

    const path = url.pathname.replace(/^\/+|\/+$/g, "");
    // Use an appointment, not the profile page. Drop query parameters so a
    // configured URL cannot silently add guests or prefill someone else's data.
    if (path === "meliza/45min") return DEFAULT_SUPPORT_BOOKING_URL;
    return /^i\/[a-zA-Z0-9_-]+$/.test(path) ? `https://zcal.co/${path}` : null;
  } catch {
    return null;
  }
}
