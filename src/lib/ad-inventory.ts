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
 * FEATURED CAMPAIGN — the campaign chooser. The featured venture's ad runs on every SL page
 * with an ad slot (except SENSITIVE pages and pages whose own CTA already pitches it). Paid
 * advertisers still win.
 *
 * The Aisle runs on a SHOW SCHEDULE: it promotes the first show below that hasn't happened
 * yet (Central time), so the ad switches itself the day after each show. Show facts come
 * from src/data/aisle-shows.json (generated from Turso expo_shows by
 * tools/sl-aisle-shows-snapshot.py) — never typed here. Pages revalidate every 5 minutes, so
 * the switch needs no deploy. Empty schedule / all shows past → no featured campaign.
 */
import aisleShows from '@/data/aisle-shows.json'

export const FEATURED_SCHEDULE: string[] = [
  'anniston-oct-2026',   // Sun Oct 18 2026 · Longleaf @ AMAG
  'silver-run-feb-2027', // Sun Feb 21 2027 · Silver Run Chapel (date per Turso)
]

export type AisleShow = {
  slug: string; name: string; venue: string; city: string; state: string
  date: string; registerUrl: string; doorPrice: number | null; vipPrice: number | null
  photo?: string // expo_shows.ad_photo_url
  qr?: string
}

/** The show the Aisle ad promotes today, or null once the schedule is used up. */
export function activeAisleShow(today = new Date()): AisleShow | null {
  const shows = (aisleShows as { shows: AisleShow[] }).shows
  for (const slug of FEATURED_SCHEDULE) {
    const show = shows.find((x) => x.slug === slug)
    if (!show) continue
    const end = new Date(`${show.date}T23:59:59-06:00`) // end of show day, Central
    if (today <= end) return show
  }
  return null
}

/** Presentation only (photo, partner logo, venue wording) — facts stay in the snapshot. */
export const AISLE_SHOW_LOOK: Record<string, { venueLine?: string; partnerLogo?: string; partnerAlt?: string }> = {
  'anniston-oct-2026': {
    venueLine: 'Longleaf Event Center · Anniston Museums & Gardens',
    partnerLogo: '/ad-assets/amag-white.png',
    partnerAlt: 'Anniston Museums and Gardens',
  },
  // Photo per show = Turso expo_shows.ad_photo_url. Silver Run: none yet (the chapel images
  // on disk are AI renderings) → text-forward navy until a real photo URL is set in Turso.
  'silver-run-feb-2027': {},
}

/** "Sunday, Oct 18" from an ISO date (weekday computed, never typed). */
export function showDayLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00-06:00`)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/Chicago' })
}

export function featuredKey(today = new Date()): string | null {
  return activeAisleShow(today) ? 'aisle' : null
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
export function aisleLink(base: string, content: string, campaign = 'aisle-oct18'): string {
  const u = new URL(base)
  u.searchParams.set('utm_source', 'southernlegends')
  u.searchParams.set('utm_medium', 'ad')
  u.searchParams.set('utm_campaign', campaign)
  if (content) u.searchParams.set('utm_content', content)
  if (SL_AISLE_REF) u.searchParams.set('ref', SL_AISLE_REF)
  return u.toString()
}


/**
 * The small label above every ad — one home, so each placement names the right venture.
 * Our own ventures: "<Venture name> · Ad". Sold ads: "Advertisement · <advertiser>".
 * New venture? Add its display name here; every placement picks it up.
 */
export const VENTURE_DISPLAY: Record<string, string> = {
  aisle: 'The Aisle Bridal Shows',
  gatherstudio: 'Gather Studio',
  bsr: 'Bridal Show Reviews',
  sermoncoach: 'SermonCoach',
  tend: 'Tend',
  ecclesia: 'Ecclesia',
  gatherregistry: 'Gather Registry',
  support: 'Southern Legends',
  sl: 'Southern Legends',
}

export function adLabel(key: string, opts: { paid?: boolean; advertiser?: string } = {}): string {
  if (opts.paid) return opts.advertiser ? `Advertisement · ${opts.advertiser}` : 'Advertisement'
  const name = VENTURE_DISPLAY[key]
  return name ? `${name} · Ad` : 'Advertisement'
}
