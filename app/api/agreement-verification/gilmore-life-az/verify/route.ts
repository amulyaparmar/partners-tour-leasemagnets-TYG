import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  sendCompletedGilmoreAgreement,
  type GilmoreAgreementSubmission,
} from "@/lib/gilmore-agreement-email";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TourOtpVerifyPayload = {
  verified?: boolean;
  workspace?: unknown;
  error?: string;
};

type AgreementRequestBody = {
  email?: string;
  challengeId?: string;
  code?: string;
  agreement?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AgreementRequestBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const challengeId = typeof body.challengeId === "string" ? body.challengeId.trim() : "";
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 6) : "";

  if (!EMAIL_PATTERN.test(email) || !UUID_PATTERN.test(challengeId) || !/^\d{6}$/.test(code)) {
    return json({ error: "Enter the complete 6-digit verification code." }, 400);
  }

  const agreement = parseAgreement(body.agreement);
  if (!agreement || agreement.email !== email) {
    return json(
      { error: "Review the customer agreement fields before completing verification." },
      400,
    );
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

    const verifiedAt = new Date().toISOString();
    const receiptId = createReceiptId(verifiedAt);
    let emailDelivery: {
      status: "sent" | "partial" | "failed" | "not_configured";
      delivered: number;
      expected: number;
    };

    try {
      const delivery = await sendCompletedGilmoreAgreement({
        agreement,
        agreementUrl: publicAgreementUrl(request),
        receiptId,
        verifiedAt,
      });
      emailDelivery = {
        status: !delivery.configured
          ? "not_configured"
          : delivery.delivered === delivery.expected
            ? "sent"
            : delivery.delivered > 0
              ? "partial"
              : "failed",
        delivered: delivery.delivered,
        expected: delivery.expected,
      };
    } catch (error) {
      console.error("Completed agreement email failed", error);
      emailDelivery = { status: "failed", delivered: 0, expected: 2 };
    }

    return json({
      verified: true,
      email,
      verifiedAt,
      receiptId,
      emailDelivery,
    });
  } catch (error) {
    console.error("Agreement verification failed", error);
    return json(
      { error: "Tour verification is temporarily unavailable. Please try again." },
      502,
    );
  }
}

function parseAgreement(value: unknown): GilmoreAgreementSubmission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const company = cleanText(source.company, 160);
  const plan = cleanText(source.plan, 20);
  const name = cleanText(source.name, 120);
  const title = cleanText(source.title, 120);
  const email = cleanText(source.email, 254).toLowerCase();
  const phone = cleanText(source.phone, 50);
  const signature = cleanText(source.signature, 160);
  const date = cleanText(source.date, 10);

  if (
    !company ||
    !["tour-vla", "growth", "growth-actors"].includes(plan) ||
    !name ||
    !title ||
    !EMAIL_PATTERN.test(email) ||
    !signature ||
    !isIsoDate(date) ||
    source.consent !== true
  ) {
    return null;
  }

  return {
    company,
    plan: plan as GilmoreAgreementSubmission["plan"],
    name,
    title,
    email,
    phone,
    signature,
    date,
    consent: true,
  };
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned.length <= maxLength ? cleaned : "";
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function createReceiptId(verifiedAt: string) {
  const day = verifiedAt.slice(0, 10).replace(/-/g, "");
  return `LM-GIL-${day}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function publicAgreementUrl(request: Request) {
  const configured = process.env.GILMORE_AGREEMENT_URL?.trim();
  if (configured) return configured;

  const requestUrl = new URL(request.url);
  if (!["localhost", "127.0.0.1", "::1"].includes(requestUrl.hostname)) {
    return `${requestUrl.origin}/thompson-thrift/gilmore-life-az`;
  }

  return "https://orders.tour.new/thompson-thrift/gilmore-life-az";
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
