import { NextResponse } from "next/server";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TourOtpVerifyPayload = {
  verified?: boolean;
  workspace?: unknown;
  error?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    challengeId?: string;
    code?: string;
  };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const challengeId = typeof body.challengeId === "string" ? body.challengeId.trim() : "";
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 6) : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !UUID_PATTERN.test(challengeId) || !/^\d{6}$/.test(code)) {
    return json({ error: "Enter the complete 6-digit verification code." }, 400);
  }

  try {
    const response = await fetch(`${tourOrigin()}/api/admin/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, challengeId, code }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const payload = (await response.json().catch(() => null)) as TourOtpVerifyPayload | null;

    if (!response.ok) {
      const status = response.status === 400 ? 400 : 502;
      return json(
        {
          error:
            response.status >= 500
              ? "Tour verification is temporarily unavailable. Please try again."
              : payload?.error || "That verification code could not be confirmed.",
        },
        status,
      );
    }

    if (payload?.verified !== true && !payload?.workspace) {
      return json({ error: "Tour did not confirm this verification code." }, 502);
    }

    return json({
      verified: true,
      email,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agreement verification failed", error);
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
