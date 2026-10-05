export type AffiliateProduct = {
  key: string
  label: string
  venture: string
  price: string
  commission: string
  commissionNote: string
  dest: string
  description: string
  category: 'merch' | 'service' | 'product' | 'event' | 'shop'
}

export const AFFILIATE_CATALOG: AffiliateProduct[] = [
  // ── MERCH ──────────────────────────────────────────────────────────────────
  {
    key: 'freedom-riders-shirt',
    label: 'Freedom Riders — Anniston, 1961',
    venture: 'Southern Legends',
    price: '$40',
    commission: '15%',
    commissionNote: '$6 per sale · 25% → civil rights ed.',
    dest: 'https://southernlegends.blog/buy/freedom-riders-shirt',
    description: 'The shirt that started SL merch. Anniston, 1961. A quarter of every sale funds local civil rights education.',
    category: 'merch',
  },
  {
    key: 'anniston-45-shirt',
    label: 'Anniston 45 — 45 Years of Running',
    venture: 'Southern Legends',
    price: '$35',
    commission: '15%',
    commissionNote: '$5.25 per sale',
    dest: 'https://southernlegends.blog/buy/anniston-45-shirt',
    description: 'Anniston, Alabama — 45 years of road racing. Navy shirt, DTF print.',
    category: 'merch',
  },
  {
    key: 'woodstock-shirt',
    label: 'I Survived Woodstock Avenue',
    venture: 'Southern Legends',
    price: '$30',
    commission: '15%',
    commissionNote: '$4.50 per sale',
    dest: 'https://southernlegends.blog/buy/woodstock-shirt',
    description: 'Woodstock 5K — RRCA Alabama State Championship. Aug 2, 2026, Anniston.',
    category: 'merch',
  },
  {
    key: 'pv-raiders-shirt',
    label: 'PV Raiders XC — Run Like You Stole It',
    venture: 'Southern Legends',
    price: '$30',
    commission: '10%',
    commissionNote: '$3 per sale · 25% → Raiders XC program',
    dest: 'https://southernlegends.blog/buy/pv-raiders-shirt',
    description: 'Every sale puts money back into the Pleasant Valley XC program. Real fundraiser, not just a slogan.',
    category: 'merch',
  },
  {
    key: 'clt-shirt',
    label: "Ladiga's Land — Chief Ladiga Trail",
    venture: 'Southern Legends',
    price: '$35',
    commission: '15%',
    commissionNote: '$5.25 per sale',
    dest: 'https://southernlegends.blog/buy/clt-shirt',
    description: '61 miles, Anniston to Cleburne County. The best trail in Alabama that nobody talks about.',
    category: 'merch',
  },
  {
    key: 'sl-stickers',
    label: 'Southern Legends Stickers',
    venture: 'Southern Legends',
    price: '$5–$8',
    commission: '15%',
    commissionNote: '$0.75–$1.20 per sale',
    dest: 'https://southernlegends.org/merch',
    description: 'CLT trail sticker, Ecclesia coin sticker, Woodstock badge. Vinyl, waterproof.',
    category: 'merch',
  },
  {
    key: 'headley-bros',
    label: 'Headley Bros 3D Prints',
    venture: 'Headley Bros',
    price: '$8–$45',
    commission: '12%',
    commissionNote: '$1–5 per sale',
    dest: 'https://matthewheadley.com/bros',
    description: "Noah and Soren's 3D printing business. Custom prints, keychains, figurines.",
    category: 'merch',
  },

  // ── MENTAL HEALTH / NEUROSPICY MERCH ─────────────────────────────────────
  {
    key: 'multitudes-shirt',
    label: 'I Contain Multitudes — Mental Health Shirt',
    venture: 'Southern Legends',
    price: '$32',
    commission: '15%',
    commissionNote: '$4.80 per sale',
    dest: 'https://southernlegends.blog/buy/multitudes-shirt',
    description: '"I contain multitudes." For the people holding more than one thing at once.',
    category: 'merch',
  },
  {
    key: 'neurospicy-shirt',
    label: 'Neurospicy — Nutrition Label Shirt',
    venture: 'Southern Legends',
    price: '$32',
    commission: '15%',
    commissionNote: '$4.80 per sale',
    dest: 'https://southernlegends.blog/buy/neurospicy-shirt',
    description: 'Nutrition label for the neurospicy mind. ADHD/autism community shirt.',
    category: 'merch',
  },

  // ── HEATHER FLORALS ────────────────────────────────────────────────────────
  {
    key: 'heather-florals',
    label: 'Heather Florals — Custom Arrangements',
    venture: 'Heather Florals',
    price: '$75–$500+',
    commission: '5%',
    commissionNote: '$4–25 per booking',
    dest: 'https://heatherflorals.com',
    description: 'Custom floral design for weddings, events, and gifts in NE Alabama.',
    category: 'service',
  },
  {
    key: 'bloom-bar',
    label: 'Bloom Bar — Floral Workshop',
    venture: 'Bloom Bar',
    price: '$45–$85/seat',
    commission: '10%',
    commissionNote: '$4–8 per seat',
    dest: 'https://heatherflorals.com/bloom-bar',
    description: 'DIY floral design workshop. Great gift. NE Alabama.',
    category: 'event',
  },

  // ── SILVER RUN CHAPEL ──────────────────────────────────────────────────────
  {
    key: 'silver-run',
    label: 'Silver Run Chapel — Wedding Venue',
    venture: 'Silver Run Chapel',
    price: 'Contact for pricing',
    commission: '2%',
    commissionNote: '~$30–60 per booked event',
    dest: 'https://silverrunchapel.com',
    description: 'Historic chapel near Anniston, AL. Intimate weddings, small events.',
    category: 'event',
  },

  // ── THE AISLE ─────────────────────────────────────────────────────────────
  {
    key: 'aisle-tickets',
    label: 'The Aisle — Bridal Show Tickets',
    venture: 'The Aisle',
    price: 'GA $25 · VIP $75',
    commission: '10%',
    commissionNote: '$2.50–$7.50 per ticket',
    dest: 'https://theaisle.app',
    description: 'Oct 18 NE Alabama bridal show. Couples + vendors. Anniston.',
    category: 'event',
  },

  // ── ECCLESIA MERCH ────────────────────────────────────────────────────────
  {
    key: 'ecclesia-shirts',
    label: 'Ecclesia Shirts — Ancient Paths, Coin, Pilgrims',
    venture: 'Ecclesia Studio',
    price: '$28–$35',
    commission: '12%',
    commissionNote: '$3.36–$4.20 per sale',
    dest: 'https://southernlegends.org/merch',
    description: '8-bit coin, pilgrims in the forest, Celtic knot. For the church that walks a different road.',
    category: 'merch',
  },

  // ── ECCLESIA SHOP ─────────────────────────────────────────────────────────
  {
    key: 'advent-kit',
    label: 'Ecclesia — Advent 2026 Kit',
    venture: 'Ecclesia Studio',
    price: '$49',
    commission: '20%',
    commissionNote: '$9.80 per sale',
    dest: 'https://ecclesiacommunity.org/shop',
    description: '"In the Meantime" — Advent sermon series kit for small churches. Ships Nov 1.',
    category: 'shop',
  },
  {
    key: 'ecclesia-marketing',
    label: 'Ecclesia Marketing — Church Comms',
    venture: 'Ecclesia Studio',
    price: '$49–$149/mo',
    commission: '15%',
    commissionNote: '$7–22/mo per client',
    dest: 'https://ecclesiacommunity.org/marketing',
    description: 'Done-for-you social, newsletters, and announcements for churches.',
    category: 'service',
  },

  // ── GATHER STUDIO SERVICES ────────────────────────────────────────────────
  {
    key: 'blueprint-session',
    label: 'Blueprint Session — Messaging Strategy',
    venture: 'Gather Studio',
    price: '$300 founding rate',
    commission: '10%',
    commissionNote: '$30 per booked session',
    dest: 'https://gatherstudio.app/book',
    description: '90-min messaging strategy session. Clear positioning for small businesses.',
    category: 'service',
  },
  {
    key: 'gather-os',
    label: 'Gather Studio OS — Full Business Blueprint',
    venture: 'Gather Studio',
    price: '$1,500–$2,500',
    commission: '5%',
    commissionNote: '$75–125 per closed client',
    dest: 'https://gatherstudio.app',
    description: 'Full 8-document Plainspoken Blueprint OS for small businesses and nonprofits.',
    category: 'service',
  },
  {
    key: 'cadence',
    label: 'Cadence — Content Engine',
    venture: 'Gather Studio',
    price: '$69–$99/mo',
    commission: '10%',
    commissionNote: '$7–10 first month',
    dest: 'https://gatherstudio.app/cadence',
    description: 'Social, blogs, email, and reels — all drafted for you. Keep your voice in rhythm.',
    category: 'service',
  },

  // ── BOOKS + WRITING ───────────────────────────────────────────────────────
  {
    key: 'tend-presell',
    label: 'Tend: Before the Wedding — Presell',
    venture: 'Tend',
    price: '$12–$25',
    commission: '15%',
    commissionNote: '$1.80–$3.75 per copy',
    dest: 'https://tendmarriage.com',
    description: 'Pre-order the marriage prep workbook. Ships Aug 15.',
    category: 'product',
  },
  {
    key: 'sl-books',
    label: 'Southern Legends Books',
    venture: 'Southern Legends',
    price: '$8–$20',
    commission: '10%',
    commissionNote: 'via Bookshop.org',
    dest: 'https://southernlegends.blog/books',
    description: "Books about the South — essays, profiles, and Matt's forthcoming titles.",
    category: 'product',
  },

  // ── GATHER REGISTRY ───────────────────────────────────────────────────────
  {
    key: 'gather-registry',
    label: 'Gather Registry — Local Gift Registry',
    venture: 'Gather Studio',
    price: 'Free to create',
    commission: '3%',
    commissionNote: 'on vendor-package gifts purchased',
    dest: 'https://gather-registry.vercel.app/create',
    description: 'Create a registry with local NE Alabama businesses — florists, venues, caterers, artists.',
    category: 'product',
  },

  // ── CHURCH WHITELIST SHIRTS ───────────────────────────────────────────────
  {
    key: 'church-custom-shirt',
    label: 'Church Custom Shirt — Your Logo, Your Community',
    venture: 'Ecclesia Studio',
    price: '$10–$14/shirt (qty 12+)',
    commission: '10%',
    commissionNote: 'on first order, per referral',
    dest: 'https://ecclesiacommunity.org/studio',
    description: 'Whitelabeled church shirts through Ecclesia Studio — your logo, your colors, Madi Lou DTF printing. Min 12 shirts.',
    category: 'service',
  },

  // ── SERMONCOACH ───────────────────────────────────────────────────────────
  {
    key: 'sermoncoach',
    label: 'SermonCoach — AI Sermon Prep',
    venture: 'SermonCoach',
    price: '$29/mo',
    commission: '10%',
    commissionNote: '$2.90 first month',
    dest: 'https://sermoncoach.app',
    description: 'AI-assisted sermon prep tool for pastors. Outline, structure, illustrations.',
    category: 'service',
  },
]

export const DESTINATIONS: Record<string, string> = Object.fromEntries(
  AFFILIATE_CATALOG.map(p => [p.key, p.dest])
)

// Add legacy keys
DESTINATIONS['default'] = 'https://southernlegends.org/merch'
DESTINATIONS['merch'] = 'https://southernlegends.org/merch'
DESTINATIONS['shop'] = 'https://ecclesiacommunity.org/shop'
DESTINATIONS['books'] = 'https://southernlegends.blog/books'
DESTINATIONS['freedom-riders'] = 'https://southernlegends.blog/buy/freedom-riders-shirt'
DESTINATIONS['anniston-45'] = 'https://southernlegends.blog/buy/anniston-45-shirt'
DESTINATIONS['woodstock'] = 'https://southernlegends.blog/buy/woodstock-shirt'
DESTINATIONS['pv-raiders'] = 'https://southernlegends.blog/buy/pv-raiders-shirt'
DESTINATIONS['clt'] = 'https://southernlegends.blog/buy/clt-shirt'

export const CATEGORY_LABELS: Record<AffiliateProduct['category'], string> = {
  merch: 'Merch',
  service: 'Services',
  product: 'Books & Products',
  event: 'Events & Venues',
  shop: 'Shop',
}
