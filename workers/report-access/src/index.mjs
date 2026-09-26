import { DurableObject } from "cloudflare:workers";
import { AccessStore } from "./store.mjs";

export class ReportAccess extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.store = new AccessStore(ctx.storage.sql);
  }

  async allowRequest() {
    const allowed = this.store.rateLimit(20, 0);
    await this.ctx.storage.setAlarm(Date.now() + 16 * 60_000);
    return allowed;
  }

  async start(email) {
    const id = crypto.randomUUID();
    const bytes = new Uint32Array(1);
    // Rejection sampling avoids modulo bias in the six-digit code.
    do { crypto.getRandomValues(bytes); } while (bytes[0] >= 4294000000);
    const code = String(bytes[0] % 1000000).padStart(6, "0");
    const hash = await digest(this.env.SERVICE_TOKEN, `${id}\n${email}\n${code}`);
    const expiresAt = this.store.issue(id, hash);
    if (!expiresAt) return { status: 429, error: "Please wait before requesting another code. Up to five codes can be requested every 15 minutes." };
    await this.ctx.storage.setAlarm(Date.now() + 16 * 60_000);
    try {
      await this.env.EMAIL.send({
        to: email,
        from: { email: this.env.FROM_ADDRESS, name: this.env.FROM_NAME },
        subject: `Your Access Code: ${code} - Tour.report`,
        text: `Your verification code to access the Tour.report marketing visibility report is:\n\n${code}\n\nThis code expires in 10 minutes. Return to the report and enter it to view the workspace.\n\nIf you didn't request this code, please ignore this email.\n\nLeaseMagnets & Tour Team`,
        html: `<div style="font-family:Arial,sans-serif;color:#17191d;max-width:480px;margin:auto;padding:32px"><h2 style="color:#086ad0">Tour.report</h2><p>Your verification code to access the marketing visibility report is:</p><p style="font-size:30px;font-weight:700;letter-spacing:6px;background:#edf6ff;padding:20px;text-align:center">${code}</p><p>This code expires in 10 minutes. Return to the report and enter it to view the workspace.</p><p style="color:#687078;font-size:12px">If you didn't request this code, please ignore this email.</p><p>LeaseMagnets &amp; Tour Team</p></div>`,
      });
      this.store.delivered(id);
      return { status: 200, sent: true, email, challengeId: id, expiresAt };
    } catch {
      this.store.failed(id);
      return { status: 503, error: "We couldn’t send your notification code. Please try again shortly." };
    }
  }

  async verify(email, id, code) {
    const hash = await digest(this.env.SERVICE_TOKEN, `${id}\n${email}\n${code}`);
    const result = this.store.verify(id, hash, email);
    if (result === "verified") return { status: 200, verified: true, email, domain: email.split("@")[1] };
    return { status: result === "locked" ? 429 : 400, error: result === "locked" ? "Too many attempts. Request a new code." : result === "expired" ? "This code has expired or was already used. Request a new code." : "That code is incorrect. Please try again." };
  }

  async alarm() { this.store.cleanup(); }
}

export default {
  async fetch(request, env) {
    if (request.method === "GET") return reply({ ok: true, sender: env.FROM_ADDRESS });
    if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
    if (!env.SERVICE_TOKEN || request.headers.get("authorization") !== `Bearer ${env.SERVICE_TOKEN}`) return reply({ error: "Unauthorized." }, 401);
    const action = new URL(request.url).pathname.slice(1);
    if (!["start", "verify"].includes(action)) return reply({ error: "Not found." }, 404);
    const raw = await request.text();
    if (raw.length > 4096) return reply({ error: "Request too large." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return reply({ error: "Enter a valid email address." }, 400);
    if (action === "verify" && (!/^[0-9a-f-]{36}$/i.test(body.challengeId || "") || !/^\d{6}$/.test(body.code || ""))) return reply({ error: "Enter the complete 6-digit notification code." }, 400);
    try {
      if (action === "start") {
        const ip = request.headers.get("x-report-client-ip") || "unknown";
        const limiter = env.ACCESS.getByName(`ip:${await digest(env.SERVICE_TOKEN, ip)}`);
        if (!await limiter.allowRequest()) return reply({ error: "Too many code requests. Please try again in 15 minutes." }, 429);
      }
      const access = env.ACCESS.getByName(`email:${await digest(env.SERVICE_TOKEN, email)}`);
      const { status, ...result } = action === "start" ? await access.start(email) : await access.verify(email, body.challengeId, body.code);
      return reply(result, status);
    } catch {
      return reply({ error: "Email verification is temporarily unavailable. Please try again." }, 503);
    }
  },
};

async function digest(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function reply(body, status = 200) { return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } }); }
