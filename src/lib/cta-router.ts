// cta-router.ts — MIRROR of gather/packages/shared/src/cta-router.ts.
// SL doesn't depend on @mpheadley/shared (deploy-bug avoidance), so the canonical
// router is copied here. Keep in sync with shared — that file is the authority.
//
// TWO guards:
//   1. TACKY-GUARD — venture CTA only when the page topic matches; grief/arts/
//      personal always get the soft SL subscribe default.
//   2. FRICTION-GUARD — every CTA is a FREE one-click yes (subscribe / free tool /
//      register free). NEVER a paid ask on a cold editorial page. An SL reader
//      won't buy a $300 Blueprint off a profile — they'll subscribe. Paid asks
//      live downstream in the email nurture, never on the front door.

import { featuredKey, pickPaidAd } from './ad-inventory';

export type VentureCTA = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  key: string;
  /** true = a sold advertiser (label "Advertisement"); house ads say "From Southern Legends". */
  paid?: boolean;
};

const SL_DEFAULT: VentureCTA = {
  key: "sl",
  eyebrow: "Southern Legends",
  headline: "More stories like this one.",
  body: "Southern Legends tells the stories of the people and places of Northeast Alabama. Get the next one in your inbox — free.",
  cta: "Subscribe",
  href: "/subscribe",
};

// Reader-facing fallback when no venture matches: "Support SL", not "buy an ad".
// Most readers aren't advertisers — pitching ad space AT a reader is a dead CTA.
// Supporting the work is actionable for anyone, reuses the live /support page, and
// monetizes today instead of waiting on a sales close.
export const SUPPORT_HOUSE: VentureCTA = {
  key: "support",
  eyebrow: "Southern Legends",
  headline: "If this is worth something to you, say so.",
  body: "Subscribe, grab something from the shop, or just keep reading — every bit keeps this free for everyone else.",
  cta: "Support the work",
  href: "/support",
};

// Advertiser-facing pitch (NOT the default fallback) — for when Matt is literally
// showing this page to a prospective business, not a random reader. HouseAdUnit
// special-cases key "advertise" to render the dashed "＋ Your ad here" placeholder.
export const ADVERTISE_HOUSE: VentureCTA = {
  key: "advertise",
  eyebrow: "Advertise",
  headline: "Your business, in front of Northeast Alabama.",
  body: "Reach Southern Legends readers — real local audience, honest rates.",
  cta: "Get this spot",
  href: "https://gatherstudio.app/advertise",
};

type Rule = { key: string; weight: string[]; cta: VentureCTA };

const VENTURES: Rule[] = [
  {
    key: "aisle",
    weight: ["wedding", "weddings", "bridal", "florist", "venue", "engaged", "engagement", "marriage", "photography", "photographer", "vendor", "reception", "catering"],
    cta: {
      key: "aisle",
      eyebrow: "The Aisle",
      headline: "Planning a wedding in East Alabama?",
      body: "Register free for The Aisle — the region's best wedding vendors under one roof, one afternoon.",
      cta: "Register free",
      href: "https://theaislebridalshows.com/live/anniston-oct-2026/register",
    },
  },
  {
    key: "bsr",
    weight: ["bridal show", "wedding vendor", "wedding expo", "wedding fair", "vendor review", "book vendors", "wedding directory", "wedding", "bridal", "venue", "engaged", "marriage"],
    cta: {
      key: "bsr",
      eyebrow: "Bridal Show Reviews",
      headline: "Which wedding vendors are worth it?",
      body: "Free, real reviews of the vendors couples actually booked — spend your budget on the ones that deliver.",
      cta: "Read the reviews",
      href: "https://bridalshowreviews.com",
    },
  },
  {
    key: "ecclesia",
    weight: ["faith", "church", "worship", "ministry", "sermon", "ecclesia", "gospel", "congregation", "pastor", "prayer"],
    cta: {
      key: "ecclesia",
      eyebrow: "Ecclesia Community",
      headline: "Faith, in plain language.",
      body: "Free reflections on faith and everyday life in Northeast Alabama — in your inbox, no strings.",
      cta: "Subscribe free",
      href: "https://ecclesiacommunity.org/subscribe",
    },
  },
  {
    key: "gatherstudio",
    weight: ["business", "entrepreneur", "brand", "startup", "shop", "store", "company", "founder", "marketing", "restaurant", "small business", "owner"],
    cta: {
      key: "gatherstudio",
      eyebrow: "Plainspoken Blueprint",
      headline: "Clever confuses. Clarity sells.",
      body: "Free messaging tool + a short newsletter on plainspoken marketing for people who build things. No cost, no pitch.",
      cta: "Get the free tool",
      href: "https://plainspokenblueprint.com/card-builder",
    },
  },
  {
    key: "sermoncoach",
    weight: ["preacher", "preaching", "homiletics", "sermon prep", "pulpit", "clergy"],
    cta: {
      key: "sermoncoach",
      eyebrow: "SermonCoach",
      headline: "Preach with a coach in your corner.",
      body: "Try the sermon-prep tool free — say the true thing clearly, every week.",
      cta: "Start free",
      href: "https://sermoncoach.app",
    },
  },
  {
    key: "tend",
    weight: ["couples", "relationship", "spouse", "newlywed", "parenting", "family life"],
    cta: {
      key: "tend",
      eyebrow: "Tend",
      headline: "Tend the marriage, not just the wedding.",
      body: "Free weekly practice for couples who want to keep choosing each other after the big day.",
      cta: "Get free practices",
      href: "https://tendmarriage.com",
    },
  },
];

// SENSITIVE: never any promo — these pages get only the soft Support ad.
const SENSITIVE = ["obituary", "obituaries", "grief", "memorial", "funeral", "death", "cancer", "illness", "mental health", "suicide", "addiction"];
// NO_SELL: no topic-matched venture pitch (an arts profile shouldn't get a random business ad),
// but the featured campaign may still run here.
const NO_SELL = [...SENSITIVE, "arts", "theatre", "theater", "poetry", "personal"];

/**
 * category = 3 (a real topical match); each matching tag = 1. A venture wins only
 * at/above threshold 3 — a lone tag never triggers a pitch. Sensitive topics always
 * fall through to the soft SL subscribe default.
 */
export function pickCTA(input: { category?: string; tags?: string[] }): VentureCTA {
  const cat = (input.category ?? "").toLowerCase();
  const tags = (input.tags ?? []).map((t) => t.toLowerCase());
  const hay = [cat, ...tags].join(" ");
  if (NO_SELL.some((w) => hay.includes(w))) return SL_DEFAULT;

  let best: { rule: Rule; score: number } | null = null;
  for (const rule of VENTURES) {
    let score = 0;
    if (rule.weight.some((w) => cat.includes(w))) score += 3;
    score += rule.weight.filter((w) => tags.some((t) => t.includes(w))).length;
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }
  return best && best.score >= 3 ? best.rule.cta : SL_DEFAULT;
}

/**
 * pickHouseAd — a house ad IS a venture CTA in an ad slot. Excludes the page's own
 * venture (`excludeKey`) so a page never ads itself. Returns null below threshold or
 * on sensitive topics (show nothing, never a mismatched promo). Lower bar than the
 * page CTA — house ads can be a bit looser. Mirror of @mpheadley/shared cta-router.
 */
export function pickHouseAd(
  input: { category?: string; tags?: string[] },
  excludeKey?: string,
): VentureCTA | null {
  const cat = (input.category ?? "").toLowerCase();
  const tags = (input.tags ?? []).map((t) => t.toLowerCase());
  const hay = [cat, ...tags].join(" ");
  // Sensitive/arts topics never get a venture pitch, but every page still carries a unit:
  // the soft reader-facing Support SL ad (Matt 2026-10-05: ads on all pages).
  if (NO_SELL.some((w) => hay.includes(w))) return SUPPORT_HOUSE;
  let best: { rule: Rule; score: number } | null = null;
  for (const rule of VENTURES) {
    if (rule.key === excludeKey) continue;
    let score = 0;
    if (rule.weight.some((w) => cat.includes(w))) score += 3;
    score += rule.weight.filter((w) => tags.some((t) => t.includes(w))).length;
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }
  if (best && best.score >= 2) return best.rule.cta;
  // No venture matches the reader → don't force a mismatched cross-promo, and don't
  // pitch ad space at a random reader (that's a dead CTA for ~95% of traffic — most
  // readers aren't advertisers). Default to SUPPORT_HOUSE, which is actionable for
  // anyone. ADVERTISE_HOUSE stays available for Matt to show a prospect directly.
  return SUPPORT_HOUSE;
}

/**
 * pickAd — THE one call every SL ad slot uses.
 * 1. live PAID advertiser that fits the page (revenue first) → 2. venture house
 * cross-promo → 3. SUPPORT_HOUSE. Sensitive topics get SUPPORT_HOUSE (never a pitch).
 * Selling an ad = add an entry to PAID_ADS in lib/ad-inventory.ts. No code change.
 */
export function pickAd(
  input: { category?: string; tags?: string[]; site?: string },
  excludeKey?: string,
): VentureCTA | null {
  const cat = (input.category ?? "").toLowerCase();
  const tags = (input.tags ?? []).map((t) => t.toLowerCase());
  const hay = [cat, ...tags].join(" ");
  if (SENSITIVE.some((w) => hay.includes(w))) return SUPPORT_HOUSE;
  const paid = pickPaidAd({ ...input, site: input.site ?? "sl" });
  if (paid) return paid;
  // Campaign chooser (ad-inventory FEATURED_CAMPAIGN): one venture promoted site-wide,
  // including arts/theater pages — only SENSITIVE pages are skipped.
  const feat = featuredKey();
  if (feat && feat !== excludeKey) {
    const rule = VENTURES.find((v) => v.key === feat);
    if (rule) return rule.cta;
  }
  if (NO_SELL.some((w) => hay.includes(w))) return SUPPORT_HOUSE;
  return pickHouseAd(input, excludeKey);
}

/**
 * snapshotAd — the publish-time decision wins for SOLD ads only.
 * Snapshot (src/data/ad-placements.json, from tools/ad-placements-snapshot.py) holds the
 * AI-judged paid choice per page. House/support choices stay on the live deterministic
 * resolver, so the page never depends on a stale snapshot for non-sold content.
 */
import placements from "@/data/ad-placements.json";
import { PAID_ADS, isActive } from "./ad-inventory";
export function snapshotAd(key: string, input: { category?: string; tags?: string[] }, excludeKey?: string): VentureCTA | null {
  const entry = (placements as { pages: Record<string, { decision: string | null }> }).pages[key];
  const id = entry?.decision;
  if (id && !id.startsWith("house:") && !id.startsWith("support")) {
    const ad = PAID_ADS.find((a) => a.id === id);
    if (ad && isActive(ad, "sl")) return pickPaidAd(input);
  }
  return pickAd(input, excludeKey);
}
