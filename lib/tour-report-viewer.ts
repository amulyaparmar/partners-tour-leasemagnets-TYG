import { createHmac, timingSafeEqual } from "node:crypto";

export const REPORT_VIEWER_COOKIE = "tour-report-viewer";
export const VIEWER_MAX_AGE = 12 * 60 * 60;

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(`report-viewer:${payload}`).digest("base64url");
}

export function createViewerToken(email: string, secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email, expires: now + VIEWER_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function readViewerToken(token: string | undefined, secret: string, now = Date.now()): string | null {
  if (!token || !secret || token.length > 1024) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const viewer = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof viewer.email === "string" && viewer.email.length <= 254 && viewer.expires > now ? viewer.email : null;
  } catch { return null; }
}
