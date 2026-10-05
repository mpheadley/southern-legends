// POST /api/ad-event — impression beacons from the SL Aisle ads (sendBeacon, fire-and-forget).
// Body: { event: "impression"|"click", placement, page, showSlug?, sessionId? }. No cookies, no personal data.
import { NextResponse, type NextRequest } from "next/server";
import { logAdEvent } from "@/lib/ad-events";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return new NextResponse(null, { status: 400 }); }
  const ok = await logAdEvent({
    event: body.event as "impression" | "click" | "hover",
    placement: String(body.placement ?? ""),
    page: String(body.page ?? "").slice(0, 160),
    showSlug: typeof body.showSlug === "string" ? body.showSlug : null,
    sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
  });
  return new NextResponse(null, { status: ok ? 204 : 202 });
}
