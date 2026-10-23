// ad-schedule-live.ts — reads the network-wide ad schedule for Southern Legends.
// Live copy: Vercel Blob ads/schedule.json (tools/sl-ad-schedule.py --upload), fetched at request
// time and cached 10 minutes (ISR). If Blob is unreachable or not uploaded yet, the bundled
// content/data/ad-schedule.json is used. Today's date picks the campaign at render time, so a
// campaign starting or ending needs no deploy, and neither does a schedule edit.
import "server-only";
import bundled from "../../content/data/ad-schedule.json";
import {
  SL_SITE_ID, fillCopy, isSchedule, pickCampaign,
  type AdCampaign, type AdFallback, type AdSchedule, type SlSlot,
} from "@/lib/ad-schedule";
import { SUPPORT_PRICE_LABEL } from "@/lib/patron-tiers";
import { VOL1_ON_SALE } from "@/lib/vol1";
import type { AisleShow } from "@/lib/ad-inventory";
import { getAisleShows } from "@/lib/aisle-shows-live";

export const AD_SCHEDULE_URL =
  process.env.AD_SCHEDULE_URL ||
  "https://r1vzyjvxewtjdk3u.public.blob.vercel-storage.com/ads/schedule.json";
export const AD_SCHEDULE_REVALIDATE = 600;

export async function loadAdSchedule(): Promise<AdSchedule> {
  try {
    const res = await fetch(AD_SCHEDULE_URL, { next: { revalidate: AD_SCHEDULE_REVALIDATE } });
    if (res.ok) {
      const json: unknown = await res.json();
      if (isSchedule(json)) return json;
    }
  } catch {
    // network or JSON error: fall through to the bundled copy
  }
  return bundled as unknown as AdSchedule;
}

/**
 * "Today" for the picker. Production always uses the real clock. In `next dev` only,
 * SL_AD_TEST_DATE=yyyy-mm-dd renders another day (for screenshots of past/future campaigns).
 * Not a query param, and ignored in any production build.
 */
export function adToday(): Date {
  const test = process.env.NODE_ENV === "development" ? process.env.SL_AD_TEST_DATE : undefined;
  if (test && /^\d{4}-\d{2}-\d{2}$/.test(test)) return new Date(`${test}T12:00:00-06:00`);
  return new Date();
}

export type SlAd = {
  campaign: AdCampaign | AdFallback;
  fallback: boolean;
  headline: string;
  body: string;
  short: string;
  cta: string;
  href: string;
  /** Set when the creative is "aisle-show": the live show facts from Turso. */
  show: AisleShow | null;
};

const TOKENS = { support_price: SUPPORT_PRICE_LABEL };

/** The ad for one SL slot right now, copy filled in. null = leave the slot empty. */
export async function getSlAd(slot: SlSlot): Promise<SlAd | null> {
  const schedule = await loadAdSchedule();
  const today = adToday();
  const flags = { VOL1_ON_SALE };
  let picked = pickCampaign(schedule, SL_SITE_ID, slot, today, flags);
  if (!picked) return null;
  let show: AisleShow | null = null;
  if (picked.campaign.creative === "aisle-show") {
    const shows = await getAisleShows();
    show = shows.find((s) => s.slug === picked!.campaign.showSlug) ?? null;
    if (!show) {
      // Show missing from Turso/snapshot: never render a broken show ad → use the fallback.
      picked = pickCampaign({ ...schedule, campaigns: [] }, SL_SITE_ID, slot, today, flags);
      if (!picked) return null;
    }
  }
  const c = picked.campaign;
  return {
    campaign: c,
    fallback: picked.fallback,
    headline: fillCopy(c.headline, TOKENS),
    body: fillCopy(c.body, TOKENS),
    short: fillCopy(c.short ?? c.headline, TOKENS),
    cta: fillCopy(c.cta, TOKENS),
    href: c.href,
    show,
  };
}
