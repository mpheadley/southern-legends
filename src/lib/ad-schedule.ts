// ad-schedule.ts — the date-driven ad picker. PURE (no fetch, no server-only), so it can be
// unit-checked with any date. The schedule itself is ONE network-wide file:
//   source of truth (git): content/data/ad-schedule.json
//   live copy (no deploy):  Vercel Blob ads/schedule.json, uploaded by tools/sl-ad-schedule.py
// Loading lives in ad-schedule-live.ts. Field names mirror PaidAd in
// gather/packages/shared/src/ad-inventory.ts (advertiser/headline/body/cta/href/start/end/
// sites/topics/accent/notes) so the two can merge later.
//
// Dates: inclusive ISO yyyy-mm-dd (same as PaidAd), judged on the CENTRAL-time calendar date
// (PaidAd.isActive uses the UTC date; Central is right for an Alabama audience).

export type AdBucket = "house" | "paid";

export type AdCampaign = {
  id: string;
  /** Plain-English name for the schedule report. */
  label: string;
  /** Eyebrow / business name (PaidAd.advertiser). */
  advertiser: string;
  /** "paid" renders the "Advertisement" label; "house" = our own venture. */
  bucket: AdBucket;
  /** Site ids, e.g. ["southern-legends"]. "*" = every opted-in site. (PaidAd.sites) */
  sites: string[];
  /** Slot ids the campaign fills on those sites. */
  slots: string[];
  start: string;
  /** Inclusive; null/omitted = open-ended. */
  end?: string | null;
  headline: string;
  body?: string;
  /** Short line for the slim strip and the phone bar. */
  short?: string;
  cta: string;
  href: string;
  /** Real photos only, never AI. Band background (dimmed). Needs imageCredit when it isn't ours. */
  image?: string;
  imageCredit?: string;
  /** Round face shown beside the headline (real photo of the person asking). */
  portrait?: string;
  /** Name under the portrait, e.g. "Matt Headley". */
  portraitName?: string;
  /** Light-on-dark wordmark/lockup shown on the band and margin card. */
  logo?: string;
  accent?: string;
  /** Topic words (PaidAd.topics). Reserved: SL slots don't target by topic yet. */
  topics?: string[];
  /** Site-specific rich creative, e.g. "aisle-show" (renders live show facts). */
  creative?: string;
  showSlug?: string;
  notes?: string;
};

export type AdFallback = Omit<AdCampaign, "slots" | "start" | "end"> & {
  /** Name of a site flag that must be true for this fallback (e.g. "VOL1_ON_SALE"). */
  requires?: string;
};

export type AdSchedule = {
  version: number;
  sites?: Record<string, { name: string; url: string; slots: string[] }>;
  campaigns: AdCampaign[];
  fallbacks?: AdFallback[];
};

export const SL_SITE_ID = "southern-legends";
export type SlSlot = "top-strip" | "band" | "margin" | "mobile-bar" | "listicle";

/** Central-time calendar date, yyyy-mm-dd. */
export function centralDate(today: Date = new Date()): string {
  return today.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

const onSite = (sites: string[] | undefined, site: string) => !sites || sites.includes("*") || sites.includes(site);

export function isCampaignActive(c: AdCampaign, day: string): boolean {
  if (c.start > day) return false;
  if (c.end && c.end < day) return false;
  return true;
}

export type Picked = { campaign: AdCampaign | AdFallback; fallback: boolean };

/**
 * The campaign for this site + slot on this date. Paid outranks house if two ever overlap
 * (the validator refuses overlaps, so that's a safety net). Nothing scheduled → the first
 * fallback for the site whose `requires` flag is on. Nothing at all → null.
 */
export function pickCampaign(
  schedule: AdSchedule | null | undefined,
  site: string,
  slot: string,
  today: Date = new Date(),
  flags: Record<string, boolean> = {},
): Picked | null {
  const day = centralDate(today);
  const live = (schedule?.campaigns ?? []).filter(
    (c) => onSite(c.sites, site) && c.slots?.includes(slot) && isCampaignActive(c, day),
  );
  live.sort((a, b) => (a.bucket === b.bucket ? b.start.localeCompare(a.start) : a.bucket === "paid" ? -1 : 1));
  if (live[0]) return { campaign: live[0], fallback: false };
  const fb = (schedule?.fallbacks ?? []).find((f) => onSite(f.sites, site) && (!f.requires || flags[f.requires]));
  return fb ? { campaign: fb, fallback: true } : null;
}

/** Is this campaign an ask for reader support (so a page that already asks can skip it)? */
export const isSupportAsk = (c: { href: string }) => c.href === "/support" || c.href.startsWith("/support?");

/** Fill copy tokens ({support_price}) from their one home. */
export function fillCopy(text: string | undefined, tokens: Record<string, string>): string {
  if (!text) return "";
  return text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
}

/** Loose shape check for a fetched schedule (fail closed to the bundled copy). */
export function isSchedule(x: unknown): x is AdSchedule {
  if (!x || typeof x !== "object") return false;
  const s = x as AdSchedule;
  return Array.isArray(s.campaigns) && s.campaigns.every(
    (c) => c && typeof c.id === "string" && typeof c.start === "string" && Array.isArray(c.slots) && Array.isArray(c.sites) && typeof c.href === "string",
  );
}
