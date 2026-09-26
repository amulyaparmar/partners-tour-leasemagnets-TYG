import { NextRequest, NextResponse } from "next/server";
import { readViewerToken, REPORT_VIEWER_COOKIE } from "@/lib/tour-report-viewer";

export const runtime = "nodejs";
const views: Record<string, string> = { traffic: "Traffic", reviews: "Reviews", search: "SEO / GEO", ads: "My ads", "comp-ads": "Comp ads" };
// Best-effort burst protection per server instance; bound memory and expire entries.
const visitors = new Map<string, { count: number; expires: number }>();
const reportUrl = "https://partners.leasemagnets.com/knowledgebase/tour-report-ai-marketing-visibility-platform#private-pilots";

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Invalid origin." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Invalid event." }, 400);
  const raw = await request.text();
  if (raw.length > 512) return json({ error: "Event too large." }, 413);
  let event;
  try { event = JSON.parse(raw); } catch { return json({ error: "Invalid event." }, 400); }
  if (!event || typeof event.view !== "string" || !Object.hasOwn(views, event.view) || !["select", "open"].includes(event.action)) {
    return json({ error: "Invalid event." }, 400);
  }
  const webhook = process.env.TOUR_REPORT_DISCORD_WEBHOOK_URL?.trim();
  if (!webhook) return json({ error: "Notifications unavailable." }, 503);
  const now = Date.now();
  for (const [key, value] of visitors) if (value.expires <= now) visitors.delete(key);
  const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const visitor = visitors.get(ip) || { count: 0, expires: now + 60000 };
  if (visitor.count >= 30 || (!visitors.has(ip) && visitors.size >= 10000)) return json({ error: "Too many events." }, 429);
  visitor.count++;
  visitors.set(ip, visitor);
  const email = readViewerToken(request.cookies.get(REPORT_VIEWER_COOKIE)?.value, process.env.TOUR_REPORT_ACCESS_TOKEN?.trim() || "");
  try {
    const url = new URL(webhook);
    url.searchParams.set("wait", "true");
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [{
          title: "Tour.report demo image clicked", url: reportUrl, color: 0x2563eb,
          fields: [
            { name: "View", value: views[event.view], inline: true },
            { name: "Action", value: event.action === "open" ? "Opened image" : "Selected view", inline: true },
            { name: "Verified email", value: email || "Not verified yet" },
          ],
          footer: { text: "Partners · Private pilot demo" }, timestamp: new Date(now).toISOString(),
        }],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Discord rejected event");
    const message = await response.json();
    if (!message.id) throw new Error("Discord did not confirm event");
    return json({ notified: true });
  } catch {
    console.error("Tour.report demo notification failed.");
    return json({ error: "Notification could not be delivered." }, 502);
  }
}
