import fs from "fs";
import path from "path";

// Dated event facts live once in content/data/events.json, kept current daily by
// tools/sl-events-sync.py. The sync also publishes a copy to SL_EVENTS_URL (Vercel
// Blob) so the live site picks up new events without a redeploy; the bundled file
// is the fallback.

export type SLEvent = {
  id: string;
  name: string;
  start: string; // YYYY-MM-DD
  end: string;
  venues: string[]; // SL venue keys, e.g. "longleaf"
  summary: string;
  url?: string;
  urlLabel?: string;
  profile?: string;
  time?: string;
  /** 24h "HH:MM" local start, when the source has one. */
  startTime?: string;
  venue?: string;
  city?: string;
  county?: string;
  category?: string;
  price?: string;
  source?: string;
  sourceUrl?: string;
  auto?: boolean;
  addedAt?: string;
  verifiedAt?: string | null;
  sponsored?: boolean;
};

export type EventsData = { updatedAt?: string; events: SLEvent[] };

function readBundled(): EventsData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "content/data/events.json"), "utf8");
    const d = JSON.parse(raw);
    return { updatedAt: d.updatedAt, events: d.events ?? [] };
  } catch {
    return { events: [] };
  }
}

export async function loadEventsData(): Promise<EventsData> {
  const bundled = readBundled();
  const url = process.env.SL_EVENTS_URL;
  if (!url) return bundled;
  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return bundled;
    const live = (await res.json()) as EventsData;
    if (!Array.isArray(live.events)) return bundled;
    // Never let a stale remote copy override a newer bundled one.
    if (bundled.updatedAt && live.updatedAt && live.updatedAt < bundled.updatedAt) return bundled;
    return live;
  } catch {
    return bundled;
  }
}

/** Today's date in Central time, YYYY-MM-DD. */
export function todayCentral(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/** Hand-entered events are trusted; auto-pulled ones show only once verified. */
export function isShowable(e: SLEvent, today: string): boolean {
  if (e.end < today) return false;
  if (e.auto && !e.verifiedAt) return false;
  return true;
}

export type EventFilter = { venue?: string; city?: string; county?: string; category?: string; exclude?: string };

export function filterEvents(events: SLEvent[], f: EventFilter, today = todayCentral()): SLEvent[] {
  const lc = (s?: string) => (s ?? "").trim().toLowerCase();
  return events
    .filter((e) => isShowable(e, today))
    .filter((e) => !f.venue || (e.venues ?? []).includes(f.venue))
    .filter((e) => !f.city || lc(e.city) === lc(f.city))
    .filter((e) => !f.county || lc(e.county) === lc(f.county))
    .filter((e) => !f.category || lc(e.category) === lc(f.category))
    .filter((e) => e.id !== f.exclude)
    .sort((a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name));
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function monthName(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
}

/** The Fri–Sun window this listing calls "this weekend". */
export function weekendWindow(today = todayCentral()): { fri: string; sun: string } {
  const dow = new Date(today + "T12:00:00Z").getUTCDay(); // 0 Sun … 6 Sat
  if (dow === 0) return { fri: addDays(today, -2), sun: today };
  if (dow === 6) return { fri: addDays(today, -1), sun: addDays(today, 1) };
  return { fri: addDays(today, 5 - dow), sun: addDays(today, 7 - dow) };
}

/** Group upcoming events: This week · This weekend · Next week · Later in <Month> · <Month>… */
export function groupByWeek(events: SLEvent[], today = todayCentral()): { label: string; events: SLEvent[] }[] {
  const { fri, sun } = weekendWindow(today);
  const nextMon = addDays(sun, 1);
  const nextSun = addDays(sun, 7);
  const curMonth = today.slice(0, 7);
  const groups = new Map<string, SLEvent[]>();
  const push = (label: string, e: SLEvent) => {
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(e);
  };
  for (const e of events) {
    const s = e.start < today ? today : e.start; // multi-day events already underway
    if (s < fri) push("This week", e);
    else if (s <= sun) push("This weekend", e);
    else if (s >= nextMon && s <= nextSun) push("Next week", e);
    else if (s.slice(0, 7) === curMonth) push(`Later in ${monthName(s)}`, e);
    else push(monthName(s), e);
  }
  return [...groups.entries()].map(([label, events]) => ({ label, events }));
}

export function fmtRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" };
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const a = s.toLocaleDateString("en-US", opts);
  if (start === end) return a;
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  return a + "–" + (sameMonth ? e.getUTCDate() : e.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }));
}

/** "2026-10-09" + "19:30" -> "2026-10-09T19:30:00-05:00" (Central, DST-aware enough for listings). */
function isoLocal(d: string, t?: string): string {
  if (!t) return d;
  const m = Number(d.slice(5, 7));
  const day = Number(d.slice(8, 10));
  const cdt = (m > 3 && m < 11) || (m === 3 && day >= 8) || (m === 11 && day < 2);
  return `${d}T${t}:00${cdt ? "-05:00" : "-06:00"}`;
}

/** schema.org Event for Google rich results. */
export function eventJsonLd(e: SLEvent, pageUrl: string) {
  const price = e.price?.match(/^\$(\d+(?:\.\d{2})?)$/)?.[1] ?? (e.price === "Free" ? "0" : undefined);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: isoLocal(e.start, e.startTime),
    endDate: e.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.venue || e.city || "Calhoun County",
      address: {
        "@type": "PostalAddress",
        addressLocality: e.city || "Anniston",
        addressRegion: "AL",
        addressCountry: "US",
      },
    },
    description: e.summary,
    url: e.url || pageUrl,
    ...(price !== undefined
      ? { offers: { "@type": "Offer", price, priceCurrency: "USD", url: e.url || pageUrl, availability: "https://schema.org/InStock" } }
      : {}),
  };
}
