// ad-events.ts — write one ad impression/click to Turso `sl_ad_events` (table drafted in
// tools/sql/sl-ad-events.sql, created 2026-10-05). Server-only. Needs AISLE_TURSO_URL and
// AISLE_TURSO_TOKEN in the environment; if they're missing it logs nothing and never breaks the page.
import "server-only";

export type AdEvent = { event: "impression" | "click" | "hover"; placement: string; page: string; showSlug?: string | null; sessionId?: string | null };

const PLACEMENTS = new Set(["top-strip", "band", "band-vip", "margin", "bottom-bar", "qr"]);

export async function logAdEvent(e: AdEvent): Promise<boolean> {
  if (!PLACEMENTS.has(e.placement) || !["impression", "click", "hover"].includes(e.event)) return false;
  const url = process.env.AISLE_TURSO_URL;
  const token = process.env.AISLE_TURSO_TOKEN;
  if (!url || !token) return false;
  const http = url.replace(/^libsql:\/\//, "https://");
  const args = [e.event, e.placement, e.page.slice(0, 160), e.showSlug ?? null, e.sessionId?.slice(0, 40) ?? null];
  const cell = (v: unknown) => (v === null ? { type: "null" } : { type: "text", value: String(v) });
  try {
    const res = await fetch(`${http}/v2/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql: "insert into sl_ad_events (event, placement, page, show_slug, session_id) values (?, ?, ?, ?, ?)", args: args.map(cell) } },
          { type: "close" },
        ],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
