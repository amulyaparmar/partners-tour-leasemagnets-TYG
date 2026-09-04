import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TourOtpStartPayload = {
  sent?: boolean;
  email?: string;
  challengeId?: string;
  expiresAt?: string;
  error?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Enter a valid work email address." }, 400);
  }

  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    const forwardedFor = (
      request.headers.get("x-vercel-forwarded-for") ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      ""
    )
      .split(",")[0]
      ?.trim();
    if (forwardedFor) headers.set("x-vercel-forwarded-for", forwardedFor);

    const response = await fetch(`${tourOrigin()}/api/admin/auth/otp/start`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const payload = (await response.json().catch(() => null)) as TourOtpStartPayload | null;

    if (!response.ok) {
      const status = [400, 429, 503].includes(response.status) ? response.status : 502;
      return json(
        {
          error:
            response.status >= 500
              ? "Tour verification is temporarily unavailable. Please try again."
              : payload?.error || "Could not send a verification code.",
          challengeId: payload?.challengeId,
          expiresAt: payload?.expiresAt,
        },
        status,
      );
    }

    if (!payload?.sent || !payload.challengeId || !payload.expiresAt) {
      return json({ error: "Tour did not return a verification challenge." }, 502);
    }

    return json({
      sent: true,
      email: payload.email || email,
      challengeId: payload.challengeId,
      expiresAt: payload.expiresAt,
    });
  } catch (error) {
    console.error("Agreement verification start failed", error);
    return json(
      { error: "Tour verification is temporarily unavailable. Please try again." },
      502,
    );
  }
}

function tourOrigin() {
  return (process.env.TOUR_API_BASE_URL?.trim() || "https://tour.you").replace(/\/+$/, "");
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
