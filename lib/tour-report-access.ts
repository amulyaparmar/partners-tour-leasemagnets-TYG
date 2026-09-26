import "server-only";

import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/transactional-email";

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function handleReportAccess(request: Request, action: "start" | "verify") {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Please submit the form from the Tour.report page." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Please submit a valid form." }, 400);
  }
  const raw = await request.text();
  if (raw.length > 4096) return json({ error: "The form is too long." }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Please submit a valid form." }, 400);
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const domain = email.split("@")[1];
  if (body.website || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json({ error: "Enter a valid work email address." }, 400);
  }
  const challengeId = typeof body.challengeId === "string" ? body.challengeId : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (action === "verify" && (!UUID_PATTERN.test(challengeId) || !/^\d{6}$/.test(code))) {
    return json({ error: "Enter the complete 6-digit notification code." }, 400);
  }

  try {
    const workerUrl = process.env.TOUR_REPORT_ACCESS_URL?.trim();
    const workerToken = process.env.TOUR_REPORT_ACCESS_TOKEN?.trim();
    if (!workerUrl || !workerToken) {
      return json({ error: "Email verification is temporarily unavailable. Please try again." }, 503);
    }
    const headers = new Headers({ "Content-Type": "application/json", Authorization: `Bearer ${workerToken}` });
    const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (ip) headers.set("x-report-client-ip", ip);
    const origin = workerUrl.replace(/\/+$/, "");
    // The report service owns durable challenges, expiry, single use and delivery.
    const response = await fetch(`${origin}/${action}`, {
      method: "POST",
      headers,
      body: JSON.stringify(action === "start" ? { email } : { email, challengeId, code }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const status = [400, 401, 403, 429, 503].includes(response.status) ? response.status : 502;
      return json({ error: response.status >= 500
        ? "Email verification is temporarily unavailable. Please try again."
        : payload?.error || "That code could not be confirmed. Please try again." }, status);
    }
    if (action === "start") {
      if (!payload?.sent || !UUID_PATTERN.test(payload.challengeId || "") || !Number.isFinite(Date.parse(payload.expiresAt))) {
        return json({ error: "We couldn’t send a notification code. Please try again." }, 502);
      }
      return json({ sent: true, email, challengeId: payload.challengeId, expiresAt: payload.expiresAt });
    }
    if (payload?.verified !== true) {
      return json({ error: "That code could not be confirmed. Please try again." }, 502);
    }

    // The notification sender is not a lead inbox. Only notify a configured team inbox.
    const recipient = process.env.TOUR_REPORT_LEAD_EMAIL?.trim();
    if (recipient) {
      await sendTransactionalEmail({
        to: [recipient], replyTo: email, subject: "Verified Tour.report report lead",
        text: `Email: ${email}\nCompany domain: ${domain}\nReport: https://partners.leasemagnets.com/knowledgebase/tour-report-ai-marketing-visibility-platform\nVerified at: ${new Date().toISOString()}`,
        html: `<h2>Verified Tour.report report lead</h2><p>Email: ${escapeHtml(email)}</p><p>Company domain: ${escapeHtml(domain)}</p><p>Requested access to the Tour.report private pilot report.</p>`,
      }).then((result) => {
        if (result.delivered !== 1) console.error("Tour.report lead notification was not accepted by the email service.");
      }).catch(() => console.error("Tour.report lead notification failed."));
    }
    // Return only verified report-access fields to the browser.
    return json({ verified: true, email, domain });
  } catch {
    return json({ error: "Email verification is temporarily unavailable. Please try again." }, 502);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}
