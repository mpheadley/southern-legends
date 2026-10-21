/**
 * Featured businesses on SL city pages.
 * Shown above the full directory with richer cards.
 * Tags: "own" = Matt's venture | "aisle" = confirmed Aisle Oct 18 vendor | "partner" = known partner
 */

export type FeaturedBusiness = {
  city: string          // lowercase city slug (e.g. "anniston")
  name: string
  category: string
  website?: string
  phone?: string
  description: string
  storySlug?: string    // links to /places/anniston/[slug] if SL profile exists
  tag: "own" | "aisle" | "partner"
  instagram?: string
  facebook?: string
}

export const FEATURED_BUSINESSES: FeaturedBusiness[] = [
  // ── Matt's ventures ──────────────────────────────────────────────────────

  {
    city: "anniston",
    name: "Heather Florals",
    category: "Florist",
    website: "https://heatherflorals.com",
    phone: "(256) 499-6030",
    description: "Custom floral design for weddings, events, and everyday moments. Anniston's working florist.",
    storySlug: "heather-florals",
    tag: "own",
    instagram: "https://instagram.com/heatherflorals",
    facebook: "https://facebook.com/heatherflorals",
  },
  {
    city: "anniston",
    name: "Bloom Bar",
    category: "Floral Studio",
    website: "https://heatherflorals.com/bloom-bar",
    description: "Walk-in floral bar — pick your stems, build your own arrangement. Heather's pop-up studio.",
    tag: "own",
  },
  {
    city: "anniston",
    name: "Studio 104",
    category: "Music Studio",
    website: "https://studio104.gatherstudio.app",
    description: "Recording and rehearsal studio in downtown Anniston. Run by Brodie Boyd.",
    storySlug: "studio-104",
    tag: "partner",
  },
  {
    city: "anniston",
    name: "Gather Studio",
    category: "Marketing & Web Design",
    website: "https://gatherstudio.app",
    phone: "(256) 644-7334",
    description: "Message coaching, web design, and business strategy for small businesses in NE Alabama.",
    tag: "own",
  },
  {
    city: "anniston",
    name: "Headley Bros",
    category: "3D Printing",
    description: "Custom 3D printed parts, prototypes, and gifts. Run by Noah and Soren Headley, ages 12 and 10.",
    tag: "own",
  },

  // ── Silver Run Chapel ────────────────────────────────────────────────────

  {
    city: "anniston",
    name: "Silver Run Chapel",
    category: "Wedding Venue",
    phone: "(256) 831-2323",
    description: "A restored historic chapel in the Calhoun County hills. Intimate weddings and private events.",
    tag: "partner",
  },

  // ── Confirmed Aisle Oct 18 Vendors ───────────────────────────────────────

  {
    city: "anniston",
    name: "Bama Photo Booths",
    category: "Photo Booth",
    website: "https://bamaphotobooths.com",
    phone: "(256) 676-8219",
    description: "Photo booth rental for weddings and events across NE Alabama.",
    tag: "aisle",
  },
  {
    city: "anniston",
    name: "Anniston Museums & Gardens",
    category: "Wedding Venue",
    website: "https://www.amag.org",
    description: "Stunning museum venue on the finest block in Calhoun County. Hosted The Aisle, October 2026.",
    tag: "aisle",
  },

  // ── Tend Marriage ────────────────────────────────────────────────────────

  {
    city: "anniston",
    name: "Tend Marriage",
    category: "Marriage Coaching",
    website: "https://tendmarriage.com",
    description: "Practical tools and honest conversations for married people who want to do the work.",
    tag: "own",
  },
]

/** Get featured businesses for a city slug */
export function getFeaturedForCity(citySlug: string): FeaturedBusiness[] {
  return FEATURED_BUSINESSES.filter((b) => b.city === citySlug)
}

/** Tag labels for display */
export const TAG_LABELS: Record<FeaturedBusiness["tag"], string> = {
  own: "SL Venture",
  aisle: "Aisle Vendor",
  partner: "SL Partner",
}

export const TAG_COLORS: Record<FeaturedBusiness["tag"], string> = {
  own: "#9a6c2f",
  aisle: "#b45309",
  partner: "#6b5040",
}
