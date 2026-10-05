// aisle-shows-live.ts — The Aisle's show facts, read LIVE from Turso `expo_shows` (the one
// home for show dates, venues, prices and the ad photo). Cached 5 minutes, so an edit in
// Turso reaches every SL Aisle ad and the /go/aisle redirect within ~5 min, no deploy.
// Falls back to src/data/aisle-shows.json (tools/sl-aisle-shows-snapshot.py) if Turso is
// unreachable or the env vars are missing, so the ad never breaks.
// Server-only: uses AISLE_TURSO_URL + AISLE_TURSO_TOKEN (never exposed to the browser).
import "server-only";
import snapshot from "@/data/aisle-shows.json";
import { FEATURED_SCHEDULE, type AisleShow } from "@/lib/ad-inventory";

const SITE = "https://theaislebridalshows.com";

type Cell = { type: string; value?: string };

async function fromTurso(): Promise<AisleShow[] | null> {
  const url = process.env.AISLE_TURSO_URL;
  const token = process.env.AISLE_TURSO_TOKEN;
  if (!url || !token) return null;
  const http = url.replace(/^libsql:\/\//, "https://");
  const sql = `select slug, display_name, show_venue_name, city, state, date_iso, register_url,
                      price_ga_at_door, price_vip, ad_photo_url
                 from expo_shows
                where lower(trim(status)) = 'confirmed' and is_public = 1
                  and show_venue_name is not null and date_iso is not null
                order by date_iso`;
  try {
    const res = await fetch(`${http}/v2/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql } }, { type: "close" }] }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.results?.[0]?.response?.result;
    if (!result) return null;
    const names: string[] = result.cols.map((c: { name: string }) => c.name);
    const snap = (snapshot as { shows: AisleShow[] }).shows;
    return result.rows.map((row: Cell[]) => {
      const r: Record<string, string | null> = {};
      names.forEach((n, i) => (r[n] = row[i]?.type === "null" ? null : (row[i]?.value ?? null)));
      const num = (v: string | null) => (v == null ? null : Number(v));
      const slug = r.slug as string;
      return {
        slug,
        name: r.display_name ?? "",
        venue: r.show_venue_name ?? "",
        city: r.city ?? "",
        state: r.state ?? "",
        date: r.date_iso ?? "",
        registerUrl: `${SITE}${r.register_url || `/live/${slug}/register`}`,
        // Anniston's door price lives in theaisle expo-pricing.ts, not the row — the snapshot carries it.
        doorPrice: num(r.price_ga_at_door) ?? snap.find((s) => s.slug === slug)?.doorPrice ?? null,
        vipPrice: num(r.price_vip),
        photo: r.ad_photo_url ?? undefined,
      } satisfies AisleShow;
    });
  } catch {
    return null;
  }
}

export async function getAisleShows(): Promise<AisleShow[]> {
  return (await fromTurso()) ?? (snapshot as { shows: AisleShow[] }).shows;
}

/** The show the Aisle ads promote right now (first scheduled show not yet past, Central). */
export async function getActiveAisleShow(today = new Date()): Promise<AisleShow | null> {
  const shows = await getAisleShows();
  for (const slug of FEATURED_SCHEDULE) {
    const show = shows.find((x) => x.slug === slug);
    if (!show?.date) continue;
    if (today <= new Date(`${show.date}T23:59:59-06:00`)) return show;
  }
  return null;
}
