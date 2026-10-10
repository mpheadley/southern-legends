// Faith column data. Source of truth: tools/sl-faith-snapshot.py (webdev root), which reads
// tools/star-columns-manifest.json, renders a share card per column, and uploads the result to
// Vercel Blob at a STABLE URL (FAITH_DATA_URL). Pages read that JSON at request time (ISR, 5 min),
// so a new column or card appears on /faith with NO redeploy. If the fetch fails, the bundled copy
// in src/data/faith-columns.json (same generator) is used. Never hand-edit either; re-run the generator.
//
// The generator already drops anything the Star hasn't published. This file re-checks the
// gate at render time too (fail closed): no Star URL, a future date, or a malformed row = hidden.
import bundled from "@/data/faith-columns.json";

export const FAITH_DATA_URL =
  process.env.FAITH_DATA_URL ||
  "https://r1vzyjvxewtjdk3u.public.blob.vercel-storage.com/faith/faith-columns.json";
export const FAITH_REVALIDATE = 300;

export type FaithImage = { src: string; width: number; height: number; alt?: string; credit?: string };

/** A related video (e.g. The Aisle's Dolly reel for The Book Lady). Shown on the column page only. */
export type FaithReel = {
  url: string;
  title: string;
  blurb: string;
  platform: string;
  tag?: { name: string; url: string };
};

export type FaithColumn = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD, the Star's datePublished
  starUrl: string;
  /** true = `paragraphs` is Matt's longer cut (different, longer writing than the Star column) */
  longCut: boolean;
  /** existing SL essay that is the longer version of this column (link, don't duplicate) */
  longUrl: string;
  /** reading time of the longer version at ~230 wpm (generator-computed). 0 = no longer version. */
  longReadMinutes: number;
  epigraph: string;
  /** Body text. Empty for most columns: the Star gets the words, /faith gets title + one line + link. */
  paragraphs: string[];
  /** The one line. */
  pullQuote: string;
  card: FaithImage | null;
  reel: FaithReel | null;
};

type Snapshot = {
  byline: string;
  attribution: string;
  headshot: FaithImage | null;
  columns: FaithColumn[];
};

function isSnapshot(x: unknown): x is Snapshot {
  return !!x && typeof x === "object" && Array.isArray((x as Snapshot).columns);
}

/** Live snapshot from Blob (cached 5 min by Next), else the bundled copy. Never throws. */
async function loadSnapshot(): Promise<Snapshot> {
  try {
    const res = await fetch(FAITH_DATA_URL, { next: { revalidate: FAITH_REVALIDATE } });
    if (res.ok) {
      const json: unknown = await res.json();
      if (isSnapshot(json)) return json;
    }
  } catch {
    // network or JSON error: fall through to the bundled copy
  }
  return bundled as unknown as Snapshot;
}

const ALLOWED_IMG = /^(\/images\/faith\/|https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/)/;
const ALLOWED_REEL = /^https:\/\/(www\.(facebook|youtube|instagram|southernlegends)\.(com|org)\/|youtu\.be\/)/;

function cleanImage(i: FaithImage | null | undefined): FaithImage | null {
  if (!i || typeof i.src !== "string" || !ALLOWED_IMG.test(i.src)) return null;
  if (!Number.isFinite(i.width) || !Number.isFinite(i.height)) return null;
  return {
    src: i.src,
    width: i.width,
    height: i.height,
    alt: typeof i.alt === "string" ? i.alt : "",
    credit: typeof i.credit === "string" ? i.credit : "",
  };
}

function cleanReel(r: FaithReel | null | undefined): FaithReel | null {
  if (!r || typeof r.url !== "string" || !ALLOWED_REEL.test(r.url)) return null;
  const tag = r.tag && typeof r.tag.name === "string" && /^https:\/\//.test(r.tag.url ?? "") ? r.tag : undefined;
  return {
    url: r.url,
    title: typeof r.title === "string" && r.title ? r.title : "Watch the reel",
    blurb: typeof r.blurb === "string" ? r.blurb : "",
    platform: typeof r.platform === "string" ? r.platform : "",
    ...(tag ? { tag } : {}),
  };
}

function todayInCentral(): string {
  // Anniston is on US Central time; compare dates there, not UTC.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
}

function isPublished(c: FaithColumn, today: string): boolean {
  return (
    typeof c.slug === "string" &&
    /^[a-z0-9-]+$/.test(c.slug) &&
    typeof c.title === "string" &&
    c.title.length > 0 &&
    typeof c.starUrl === "string" &&
    c.starUrl.startsWith("https://www.annistonstar.com/") &&
    /^\d{4}-\d{2}-\d{2}$/.test(c.date) &&
    c.date <= today
  );
}

function normalize(c: FaithColumn): FaithColumn {
  const paragraphs = Array.isArray(c.paragraphs) ? c.paragraphs.filter((p) => typeof p === "string" && p.trim()) : [];
  return {
    ...c,
    paragraphs,
    longCut: c.longCut === true && paragraphs.length > 0,
    longUrl: typeof c.longUrl === "string" && c.longUrl.startsWith("/essays/") ? c.longUrl : "",
    longReadMinutes: Number.isFinite(c.longReadMinutes) && c.longReadMinutes > 0 ? Math.round(c.longReadMinutes) : 0,
    epigraph: typeof c.epigraph === "string" ? c.epigraph : "",
    pullQuote: typeof c.pullQuote === "string" ? c.pullQuote : "",
    card: cleanImage(c.card),
    reel: cleanReel(c.reel),
  };
}

/** Everything a faith page needs, from one fetch. Published columns, newest first. */
export async function getFaithData(): Promise<{
  columns: FaithColumn[];
  byline: string;
  attribution: string;
  headshot: FaithImage | null;
}> {
  const data = await loadSnapshot();
  const today = todayInCentral();
  const columns = data.columns
    .filter((c) => isPublished(c, today))
    .map(normalize)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return {
    columns,
    byline: typeof data.byline === "string" ? data.byline : "",
    attribution: typeof data.attribution === "string" ? data.attribution : "",
    headshot: cleanImage(data.headshot),
  };
}

export async function getFaithColumns(): Promise<FaithColumn[]> {
  return (await getFaithData()).columns;
}

export async function getFaithColumn(slug: string): Promise<FaithColumn | undefined> {
  return (await getFaithColumns()).find((c) => c.slug === slug);
}

/**
 * Where the longer version of a column lives, if one exists: its own /faith page (longer cut) or an
 * existing SL essay. Empty when the Star's column is the only version.
 */
export function faithLongerUrl(c: FaithColumn): string {
  return c.longCut ? `/faith/${c.slug}` : c.longUrl;
}

/** "7 min read" for the longer version, or "" when there is none / no count. */
export function faithReadLabel(c: FaithColumn): string {
  return c.longReadMinutes > 0 ? `${c.longReadMinutes} min read` : "";
}

/** Absolute URL for an image that may be site-relative (headshot) or already absolute (Blob card). */
export function faithAbsUrl(src: string, siteUrl: string): string {
  return /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`;
}

export function formatFaithDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
