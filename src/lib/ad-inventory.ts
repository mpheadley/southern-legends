// ad-inventory.ts — PAID advertisers. The one file Matt edits to put a sold ad live.
//
// FRICTION KILLER: before this, running a sold ad meant editing React components.
// Now: close the sale → add one entry here → it's live on the next deploy. Nothing else.
//
// How it resolves (see pickAd in cta-router.ts):
//   1. Any ACTIVE paid advertiser matching this page  → that ad wins (it's paid)
//   2. else a venture house cross-promo that fits the reader
//   3. else SUPPORT_HOUSE ("support the work")
//
// Dates are inclusive, ISO yyyy-mm-dd. An entry outside its window is skipped
// automatically — no need to come back and delete it when a campaign ends.

import type { VentureCTA } from './cta-router'

export interface PaidAd {
  /** Advertiser slug — also used as the brand-token key. */
  id: string
  /** Business name shown as the eyebrow. */
  advertiser: string
  headline: string
  body?: string
  cta: string
  href: string
  /** Inclusive ISO dates. Omit `end` for an open-ended run. */
  start: string
  end?: string
  /** Which sites may show it. Omit = all. e.g. ['sl','gs'] */
  sites?: string[]
  /**
   * Topic match — lowercase words checked against the page's category + tags.
   * Omit = runs on any page (a general/brand buy, not a targeted one).
   */
  topics?: string[]
  /** Logo path under that site's /ad-assets. Omit → styled text rail. */
  logo?: string
  /** true if the logo is already light/cream (don't invert on dark surfaces). */
  logoOnDark?: boolean
  /** Brand color for eyebrow + button. */
  accent?: string
  /** What they paid, for Matt's own records — never rendered. */
  notes?: string
}

/**
 * SOLD ADS GO HERE. Empty = nothing sold yet, everything falls back to house ads.
 * Example of a filled entry (delete the comment markers when real):
 *
 * {
 *   id: 'model-city-glass',
 *   advertiser: 'Model City Glass',
 *   headline: 'Glass done right, the first time.',
 *   cta: 'Get a quote',
 *   href: 'https://modelcityglass.com',
 *   start: '2026-10-05',
 *   end: '2026-11-05',
 *   sites: ['sl'],
 *   topics: ['anniston', 'business', 'home'],
 *   accent: '#2f6f9f',
 *   notes: '$150/mo — paid via Stripe 2026-10-03',
 * },
 */
export const PAID_ADS: PaidAd[] = []

/**
 * FEATURED CAMPAIGN — the campaign chooser. When set and live, this venture's ad runs on
 * every SL page that has an ad slot (except sensitive pages, which keep the soft Support
 * ad, and pages whose own CTA already pitches this venture). Paid advertisers still win.
 * Set to null to go back to topic-matched house ads. Auto-ends after `until`.
 */
export const FEATURED_CAMPAIGN: { key: string; until: string } | null = {
  key: 'aisle',
  until: '2026-10-18', // The Aisle: Anniston Bridal Show — Sunday, Oct 18 2026
}

export function featuredKey(today = new Date()): string | null {
  const c = FEATURED_CAMPAIGN
  if (!c) return null
  const end = new Date(`${c.until}T23:59:59-05:00`)
  return today <= end ? c.key : null
}

/** Is this ad live today (and on this site)? */
export function isActive(ad: PaidAd, site?: string, today = new Date()): boolean {
  const d = today.toISOString().slice(0, 10)
  if (ad.start > d) return false
  if (ad.end && ad.end < d) return false
  if (site && ad.sites && !ad.sites.includes(site)) return false
  return true
}

/**
 * Best-matching paid ad for a page, or null. A targeted ad (with `topics`) only runs
 * on a matching page; an untargeted one runs anywhere, but a topic match outranks it.
 */
export function pickPaidAd(
  input: { category?: string; tags?: string[]; site?: string },
  today = new Date(),
): VentureCTA | null {
  const cat = (input.category ?? '').toLowerCase()
  const tags = (input.tags ?? []).map((t) => t.toLowerCase())
  const hay = [cat, ...tags].join(' ')

  let best: { ad: PaidAd; score: number } | null = null
  for (const ad of PAID_ADS) {
    if (!isActive(ad, input.site, today)) continue
    let score = 1 // untargeted buys still run
    if (ad.topics?.length) {
      const hits = ad.topics.filter((t) => hay.includes(t.toLowerCase())).length
      if (!hits) continue // targeted ad on a non-matching page → skip
      score = 10 + hits // targeted always beats untargeted
    }
    if (!best || score > best.score) best = { ad, score }
  }
  if (!best) return null

  const a = best.ad
  return {
    key: a.id,
    eyebrow: a.advertiser,
    headline: a.headline,
    body: a.body ?? '',
    cta: a.cta,
    href: a.href,
    paid: true,
  }
}


/**
 * SL's referral code on The Aisle (expo_partners). Empty until the row exists — then every
 * SL registration is credited to Southern Legends in The Aisle's referral counts.
 */
export const SL_AISLE_REF = 'SLREFERS' // expo_partners row 3d6b6b5418b043f5, created 2026-10-05

/** Tagged Aisle register link: source = SL, content = the page or spot it came from. */
export function aisleLink(base: string, content: string): string {
  const u = new URL(base)
  u.searchParams.set('utm_source', 'southernlegends')
  u.searchParams.set('utm_medium', 'ad')
  u.searchParams.set('utm_campaign', 'aisle-oct18')
  if (content) u.searchParams.set('utm_content', content)
  if (SL_AISLE_REF) u.searchParams.set('ref', SL_AISLE_REF)
  return u.toString()
}
