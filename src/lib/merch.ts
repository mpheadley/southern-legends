export type MerchCategory =
  | 'shirt' | 'hoodie' | 'hat'
  | 'sticker' | 'patch' | 'pin'
  | 'tote' | 'print' | 'poster'
  | 'mug' | 'sock' | 'bandana' | 'pennant' | 'journal'
  | '3d-print' | 'magazine'

export type MerchItem = {
  id: string
  name: string
  tagline: string
  sub?: string
  price: number
  photo: string
  /** Optional back-of-garment art — product pages swap to this on hover. */
  photoBack?: string
  rawGraphic?: string
  bg?: string
  badge?: string
  badgeColor?: string
  category: MerchCategory
  /** Mediums this design is available on — shown in click overlay. Defaults to category label. */
  mediums?: string[]
  fundraiser?: string
  sizes?: string[]
  available: boolean
  comingSoon?: boolean
  cities?: string[]
}

export const MERCH: MerchItem[] = [
  // ── WOODSTOCK 5K ───────────────────────────────────────────
  {
    id: 'woodstock-oval-shirt',
    name: 'Woodstock Avenue Oval',
    tagline: 'Anniston, AL · Aug 2, 2026 · Woodstock 5K',
    sub: 'Cream shirt · DTG · RRCA Alabama State Championship',
    price: 35,
    photo: '/print-files/WOODSTOCK-00-woodstock-avenue-oval-CREAM.png',
    bg: '#f5f0e8',
    badge: 'Event',
    badgeColor: '#166534',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'woodstock-shirt',
    name: 'I Survived Woodstock Avenue',
    tagline: 'Anniston, AL · Aug 2, 2026',
    sub: 'Woodstock 5K · RRCA Alabama State Championship',
    price: 30,
    photo: '/merch/sl-woodstock-black.webp',
    rawGraphic: '/merch/woodstock-shirt-v2.png',
    bg: '#f5f0e8',
    badge: 'Event',
    badgeColor: '#166534',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['anniston'],
  },
  {
    id: 'woodstock-sticker',
    name: 'Woodstock 5K Sticker',
    tagline: 'Anniston, Alabama · 3" vinyl',
    price: 5,
    photo: '/merch/woodstock-badge.png',
    badge: 'At booth',
    badgeColor: '#166534',
    category: 'sticker',
    available: true,
    cities: ['anniston'],
  },

  // ── ANNISTON 45 ────────────────────────────────────────────
  {
    id: 'anniston-45-shirt',
    name: 'Anniston 45',
    tagline: 'Anniston, Alabama · 45 Years of Running',
    sub: 'Navy shirt · DTF print',
    price: 35,
    photo: '/print-files/SL-03-anniston-45-NAVY.png',
    bg: '#1e3a5f',
    badge: 'Local Pride',
    badgeColor: '#1e3a5f',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['anniston'],
  },

  // ── PV RAIDERS XC ──────────────────────────────────────────
  {
    id: 'pv-raiders-shirt',
    name: 'PV Raiders XC',
    tagline: 'Run Like You Stole It.',
    sub: '25% of every sale → Raiders XC program',
    price: 30,
    photo: '/merch/fw/pv-raiders-xc-01.webp',
    photoBack: '/merch/fw/pv-raiders-xc-02.webp',
    badge: 'Fundraiser',
    badgeColor: '#9A3412',
    category: 'shirt',
    fundraiser: 'Raiders XC',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },

  // ── CHIEF LADIGA TRAIL ─────────────────────────────────────
  {
    id: 'clt-shirt',
    name: "Ladiga's Land",
    tagline: '1832 · 2032 · Anniston to Piedmont',
    sub: '33.5 miles. Ivory, Moss, Denim.',
    price: 35,
    photo: '/merch/fw/chief-ladiga-trail-01.webp',
    photoBack: '/merch/fw/chief-ladiga-trail-02.webp',
    category: 'shirt',
    mediums: ['T-Shirt', 'Tote Bag', 'Sticker', 'Art Print', 'Hat'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston', 'piedmont'],
  },
  {
    id: 'clt-tote',
    name: 'Chief Ladiga Trail Tote',
    tagline: 'Cream canvas · Trail map on back',
    sub: 'DTF print · Handmade in Alabama',
    price: 22,
    photo: '/merch/clt-tote.webp',
    badge: 'In stock',
    badgeColor: '#166534',
    category: 'tote',
    available: true,
    cities: ['anniston', 'piedmont'],
  },
  {
    id: 'model-city-tote',
    name: 'The Model City Tote',
    tagline: 'Anniston, Alabama · Cream canvas',
    sub: 'DTF print · Handmade in Alabama',
    price: 22,
    photo: '/merch/model-city-tote.webp',
    badge: 'In stock',
    badgeColor: '#166534',
    category: 'tote',
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'clt-sticker',
    name: 'Chief Ladiga Trail Sticker',
    tagline: '3" round · Matte · Weather-resistant',
    price: 5,
    photo: '/merch/clt-sticker-print.png',
    badge: 'In stock',
    badgeColor: '#166534',
    category: 'sticker',
    available: true,
    cities: ['anniston', 'piedmont'],
  },
  {
    id: 'clt-trail-map',
    name: 'CLT Trail Map Print',
    tagline: '18×24 · Full trail · Print-ready',
    sub: 'Rolled · Ships in tube',
    price: 15,
    photo: '/merch/clt-trail-map-print.webp',
    category: 'print',
    available: true,
    cities: ['anniston', 'piedmont'],
  },

  // ── ECCLESIA ────────────────────────────────────────────────
  {
    id: 'ecclesia-pilgrims',
    name: 'Ecclesia — Pilgrims',
    tagline: 'We are all on the way.',
    sub: 'Forest green shirt · Forest scene illustration',
    price: 30,
    photo: '/merch/ecclesia-pilgrims-forest.webp',
    rawGraphic: '/merch/ecclesia-pilgrims.png',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['anniston'],
  },
  {
    id: 'ecclesia-coin',
    name: 'Ecclesia Coin · 8-bit Sticker',
    tagline: 'Triskelion · distressed · 3" vinyl',
    price: 5,
    photo: '/merch/ecclesia-coin-sticker-8bit-v2.png',
    category: 'sticker',
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'ecclesia-coin-sticker-photoreal',
    name: 'Ecclesia Coin · Celtic Sticker',
    tagline: 'Photoreal triskelion · Uncial · 3" vinyl',
    price: 5,
    photo: '/merch/ecclesia-coin-sticker-photoreal-v2.png',
    category: 'sticker',
    available: true,
    cities: ['anniston'],
  },

  // ── FREEDOM RIDERS ─────────────────────────────────────────
  {
    id: 'freedom-riders-shirt',
    name: 'Freedom Riders — Anniston, 1961',
    tagline: 'May 14, 1961. Highway 202. The bus burned.',
    sub: '25% of every sale → West Anniston Foundation',
    price: 40,
    photo: '/print-files/FREEDOM-RIDERS-01-burning-bus-WHITE-trans.webp',
    photoBack: '/merch/freedom-riders/back.png',
    bg: '#1a1a2e',
    badge: 'Memorial',
    badgeColor: '#1a1a2e',
    category: 'shirt',
    mediums: ['T-Shirt', 'Hoodie', 'Art Print', 'Poster', 'Sticker'],
    fundraiser: 'West Anniston Foundation',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },

  {
    id: 'david-dennis-shirt',
    name: 'Dave Dennis — Freedom Rider, 1961',
    tagline: '"I was trying to get a date with a woman." — Dave Dennis, 1961',
    sub: '100% → West Anniston Foundation · Black, True Navy, Midnight Denim',
    price: 40,
    photo: '/merch/fw/dave-dennis-freedom-rider-01.webp',
    photoBack: '/merch/fw/dave-dennis-freedom-rider-02.webp',
    badge: 'SL Editorial',
    badgeColor: '#1a1a2e',
    category: 'shirt',
    fundraiser: 'West Anniston Foundation',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },

  // ── BLOOM BAR ──────────────────────────────────────────────
  {
    id: 'bloom-bar-tee',
    name: 'The Bloom Bar Tee',
    tagline: 'Heather Florals · Anniston, Alabama',
    sub: 'Soft floral tee · Heather Florals x Southern Legends',
    price: 29,
    photo: '/merch/fw/bloom-bar-01.webp',
    photoBack: '/merch/fw/bloom-bar-02.webp',
    badge: 'Heather Florals',
    badgeColor: '#166534',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },

  // ── NEURO-SPICY ────────────────────────────────────────────
  {
    id: 'neuro-spicy-nutrition-shirt',
    name: 'Neuro-Spicy',
    tagline: 'Nutrition label parody · DTG on cream',
    sub: 'For the neurodivergent, the twice exceptional, the sensory-rich.',
    price: 35,
    photo: '/print-files/NEUROSPICY-01-nutrition-label-CREAM.png',
    bg: '#f5f0e8',
    badge: 'Mental Health',
    badgeColor: '#6d28d9',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },

  // ── FREEDOM RIDERS STICKERS ────────────────────────────────
  {
    id: 'freedom-riders-bus-sticker',
    name: 'Freedom Riders — Burning Bus',
    tagline: 'Anniston, 1961 · 100% → West Anniston Foundation',
    sub: 'Horizontal die-cut · 4" × 3" vinyl',
    price: 5,
    photo: '/print-files/FREEDOM-RIDERS-S1-burning-bus-sticker.png',
    badge: 'Fundraiser',
    badgeColor: '#7f1d1d',
    category: 'sticker',
    fundraiser: 'West Anniston Foundation',
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'freedom-riders-dennis-sticker',
    name: 'Freedom Riders — David Dennis',
    tagline: 'Freedom Rider portrait · 100% → West Anniston Foundation',
    sub: 'Square · 3" × 3" vinyl · Dark bg',
    price: 5,
    photo: '/print-files/FREEDOM-RIDERS-S2-dennis-sticker.png',
    badge: 'Fundraiser',
    badgeColor: '#7f1d1d',
    category: 'sticker',
    fundraiser: 'West Anniston Foundation',
    available: true,
    cities: ['anniston'],
  },

  // ── MENTAL HEALTH LINE ─────────────────────────────────────
  {
    id: 'i-contain-multitudes',
    name: 'I Contain Multitudes',
    tagline: 'Walt Whitman · Southern Legends Mental Health Series',
    price: 30,
    photo: '/merch/fw/i-contain-multitudes-01.webp',
    photoBack: '/merch/fw/i-contain-multitudes-02.webp',
    badge: 'Mental Health',
    badgeColor: '#4c1d95',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },
  {
    id: 'bipolar-proud',
    name: 'Bipolar & Proud',
    tagline: 'Not broken. Just wired differently. · Mental Health Series',
    price: 30,
    photo: '/merch/fw/bipolar-proud-01.webp',
    photoBack: '/merch/fw/bipolar-proud-02.webp',
    badge: 'Mental Health',
    badgeColor: '#4c1d95',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },
  {
    id: 'i-contain-multitudes-sticker',
    name: 'I Contain Multitudes — Sticker',
    tagline: 'Walt Whitman · 3" die-cut vinyl',
    price: 5,
    photo: '/merch/i-contain-multitudes-sticker.png',
    badge: 'Mental Health',
    badgeColor: '#4c1d95',
    category: 'sticker',
    available: true,
    cities: [],
  },
  {
    id: 'bipolar-proud-sticker',
    name: 'Bipolar & Proud — Sticker',
    tagline: 'Not broken. Just wired differently. · 3" die-cut vinyl',
    price: 5,
    photo: '/merch/bipolar-proud-sticker.png',
    badge: 'Mental Health',
    badgeColor: '#4c1d95',
    category: 'sticker',
    available: true,
    cities: [],
  },
  {
    id: 'still-here',
    name: 'Still Here',
    tagline: 'Southern Legends Mental Health Series',
    price: 30,
    photo: '/merch/fw/still-here-01.webp',
    photoBack: '/merch/fw/still-here-03.webp',
    badge: 'Mental Health',
    badgeColor: '#4c1d95',
    category: 'shirt',
    available: true,
    cities: [],
  },

  // ── DIASPORA LINE ──────────────────────────────────────────
  {
    id: 'diaspora-shirt',
    name: 'I left. I came back.',
    tagline: 'The Southern Legends thesis on a shirt.',
    sub: 'Cream on dark olive · Fraunces serif',
    price: 30,
    photo: '/merch/diaspora-shirt.webp',
    badge: 'SL Original',
    badgeColor: '#7a5c1e',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: [],
  },
  {
    id: 'jacksonville-shirt',
    name: 'Jacksonville, Alabama',
    tagline: 'Est. 1881 · JSU country.',
    sub: 'Forest green · Cream · Black',
    price: 28,
    photo: '/merch/jacksonville-shirt.webp',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['jacksonville'],
  },
  {
    id: 'coldwater-shirt',
    name: 'Coldwater Mountain',
    tagline: 'Anniston, Alabama · 1,800 ft.',
    sub: 'Navy · Slate · Cream',
    price: 30,
    photo: '/merch/coldwater-shirt.webp',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['anniston'],
  },

  // ── ECCLESIA 8-BIT ─────────────────────────────────────────
  {
    id: 'cheshire-shirt',
    name: "We're All Mad Here.",
    tagline: 'The Cheshire Cat · Also the early church.',
    sub: 'Black tee · 8-bit grin · DTF print',
    price: 35,
    photo: '/print-files/ECCLESIA-02-cheshire-cat-BLACK.png',
    bg: '#1a1a1a',
    badge: 'Ecclesia',
    badgeColor: '#1a5a4a',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
  },
  {
    id: 'ecclesia-coin-8bit',
    name: 'We are all on the way.',
    tagline: 'Ecclesia coin · pilgrim community',
    sub: 'Black tee · 8-bit coin',
    price: 28,
    photo: '/merch/ecclesia-coin-shirt.webp',
    badge: '8-bit',
    badgeColor: '#3b1f6a',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
  },

  // ── ECCLESIA PHOTOREAL ─────────────────────────────────────
  {
    id: 'ecclesia-stone-shirt',
    name: 'Ancient paths.',
    tagline: 'Ecclesia · A Fresh Expression',
    sub: 'Black tee · teal pixel stone',
    price: 32,
    photo: '/merch/ecclesia-stone-black.webp',
    rawGraphic: '/merch/ecclesia-stone-shirt.webp',
    badge: 'Ecclesia',
    badgeColor: '#1a5a4a',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
  },
  {
    id: 'ecclesia-coin-photoreal',
    name: 'Ecclesia Coin — We are all on the way.',
    tagline: 'Celtic triskelion · photoreal · Fraunces type',
    sub: 'Black · Navy',
    price: 32,
    photo: '/merch/ecclesia-coin-photoreal-shirt.webp',
    badge: 'Ecclesia',
    badgeColor: '#1a5a4a',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
  },

  // ── ECCLESIA PRESS SATIRE TEES ─────────────────────────────
  {
    id: 'ep-chewed-gum',
    name: 'You were not chewed gum.',
    tagline: 'Ecclesia Press — purity culture, corrected.',
    sub: 'Black · Purple · Cream',
    price: 28,
    photo: '/merch/ep-chewed-gum.webp',
    badge: 'Ecclesia Press',
    badgeColor: '#5b21b6',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: [],
  },
  {
    id: 'ep-father-runs',
    name: 'The father runs.',
    tagline: 'Luke 15. He doesn\'t walk.',
    sub: 'Black · Cream',
    price: 28,
    photo: '/merch/ep-father-runs.webp',
    badge: 'Ecclesia Press',
    badgeColor: '#5b21b6',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: [],
  },
  {
    id: 'ep-here-i-stand',
    name: '"Here I stand." — Luther, probably.',
    tagline: 'Ecclesia Press — Reformation merch.',
    sub: 'Black · Cream · Red',
    price: 28,
    photo: '/merch/ep-here-i-stand.webp',
    badge: 'Ecclesia Press',
    badgeColor: '#5b21b6',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: [],
  },

  // ── CHEAHA SKYWAY ──────────────────────────────────────────
  {
    id: 'cheaha-skyway-shirt',
    name: 'Cheaha — Building the Skyway',
    tagline: 'Blasted Through Solid Rock · Cheaha State Park',
    sub: 'Black shirt · DTF print · CCC era engineering',
    price: 35,
    photo: '/print-files/WOODSTOCK-11-cheaha-skyway-BLACK.png',
    bg: '#1a1a1a',
    badge: 'SL Woodcut',
    badgeColor: '#78350f',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['piedmont', 'gadsden'],
  },

  // ── CHEAHA SUMMIT ──────────────────────────────────────────
  {
    id: 'cheaha-summit-shirt',
    name: 'Cheaha — Alabama\'s Summit',
    tagline: '2,413 ft · Cleburne County · Alabama\'s highest point',
    sub: 'Black shirt · Crimson mountain woodcut · Bold serif',
    price: 35,
    photo: '/merch/cheaha-summit-shirt.webp',
    badge: 'SL Woodcut',
    badgeColor: '#7f1d1d',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['piedmont', 'gadsden'],
  },

  // ── JACKSONVILLE ────────────────────────────────────────────
  {
    id: 'jacksonville-gamecock-shirt',
    name: 'Jacksonville — Home of JSU',
    tagline: 'Jacksonville, Alabama · Est. 1833',
    sub: 'Cream shirt · Bold gamecock badge · Gold + crimson',
    price: 35,
    photo: '/print-files/WOODSTOCK-04-jacksonville-gamecock-BLACK.png',
    bg: '#f5f0e8',
    badge: 'SL Woodcut',
    badgeColor: '#7a3c00',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['jacksonville'],
  },
  {
    id: 'jacksonville-water-tower-sticker',
    name: 'Jacksonville Water Tower',
    tagline: 'Jacksonville, Alabama · Est. 1833 · 3" round',
    sub: 'Rust distressed badge · Gamecock weathervane · Crossed rifles',
    price: 5,
    photo: '/merch/jacksonville-water-tower-badge.webp',
    badge: 'SL Woodcut',
    badgeColor: '#7a3c00',
    category: 'sticker',
    available: true,
    cities: ['jacksonville'],
  },

  // ── PIEDMONT / CLT ─────────────────────────────────────────
  {
    id: 'piedmont-name-changes-shirt',
    name: 'Piedmont: Changed Our Name Like Socks',
    tagline: 'Hollow Stump → Griffen\'s Creek → Cross Plains → Palona → Piedmont',
    sub: 'Cream shirt · The 1800s Identity Crisis · DTG print',
    price: 35,
    photo: '/merch/piedmont-change.png',
    badge: 'SL Woodcut',
    badgeColor: '#166534',
    category: 'shirt' as const,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: false,
    cities: ['piedmont'],
  },
  {
    id: 'piedmont-clt-print',
    name: 'Piedmont — Chief Ladiga Trail Mile 0',
    tagline: 'Piedmont, Alabama · Population 4,600 · Trail Town',
    sub: '11×14 · Matte cardstock · Pine forest + trail perspective woodcut',
    price: 15,
    photo: '/merch/piedmont-clt-banner-print.webp',
    badge: 'Art Print',
    badgeColor: '#166534',
    category: 'print',
    available: true,
    cities: ['piedmont'],
  },

  // ── BLOSSOM & DECAY STICKER VARIANTS ───────────────────────
  {
    id: 'skull-marigold-sticker',
    name: 'Blossom & Decay — Marigold',
    tagline: 'Sugar skull + orange marigolds · Southern Gothic',
    sub: '3" die-cut · Matte · Bright colorful variant',
    price: 5,
    photo: '/merch/skull-marigold-sticker.png',
    badge: 'SL Original',
    badgeColor: '#92400e',
    category: 'sticker',
    available: true,
    cities: [],
  },
  {
    id: 'skull-gothic-sticker',
    name: 'Blossom & Decay — Gothic',
    tagline: 'Dark skull + red rose · Southern Gothic',
    sub: '3" die-cut · Matte · Dark moody variant',
    price: 5,
    photo: '/merch/skull-gothic-sticker.png',
    badge: 'SL Original',
    badgeColor: '#7f1d1d',
    category: 'sticker',
    available: true,
    cities: [],
  },

  // ── CLT HIKE & EXPLORE ─────────────────────────────────────
  {
    id: 'clt-hike-explore-shirt',
    name: 'Hike & Explore — Chief Ladiga Trail',
    tagline: 'Chief Ladiga Trail · Alabama',
    sub: 'Navy shirt · Vintage badge · Mountains + pines + sunset',
    price: 35,
    photo: '/merch/sl-clt-hike-navy.webp',
    rawGraphic: '/merch/clt-hike-explore-shirt.png',
    badge: 'SL Woodcut',
    badgeColor: '#0f4c75',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston', 'piedmont'],
  },

  // ── BLOSSOM & DECAY (clean regen 2026-07-26) ───────────────
  {
    id: 'blossom-decay-roses-shirt',
    name: 'Blossom & Decay — Roses',
    tagline: 'Southern Gothic · Roses on Mocha',
    sub: 'Mocha shirt · DTF print',
    price: 35,
    photo: '/print-files/WOODSTOCK-12-blossom-decay-roses-MOCHA.png',
    bg: '#6b4c35',
    badge: 'SL Original',
    badgeColor: '#7f1d1d',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },
  {
    id: 'blossom-decay-shirt',
    name: 'Blossom & Decay — Gothic',
    tagline: 'Southern Legends · Thorns + roses + Southern Gothic',
    sub: 'Cream shirt · Skull emerging from vines',
    price: 35,
    photo: '/merch/sl-blossom-decay-cream.webp',
    rawGraphic: '/merch/blossom-and-decay-clean.png',
    badge: 'SL Original',
    badgeColor: '#7f1d1d',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },
  {
    id: 'blossom-decay-sugar-shirt',
    name: 'Blossom & Decay — Sugar Skull',
    tagline: 'Southern Legends · Día de los Muertos · Full color',
    sub: 'Cream shirt · Marigolds + sugar skull',
    price: 35,
    photo: '/merch/blossom-decay-sugar-skull.png',
    badge: 'SL Original',
    badgeColor: '#7f1d1d',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: [],
  },
  {
    id: 'blossom-decay-sticker',
    name: 'Blossom & Decay',
    tagline: 'Southern Legends · Sugar skull + marigolds',
    sub: '3" die-cut · Matte · Full color',
    price: 5,
    photo: '/merch/blossom-decay-sugar-skull.png',
    badge: 'SL Original',
    badgeColor: '#7f1d1d',
    category: 'sticker',
    available: true,
    cities: [],
  },

  // ── GREEN THUMBS CLUB (Heather Florals) ────────────────────
  {
    id: 'green-thumbs-club-sticker',
    name: 'Green Thumbs Club',
    tagline: 'Heather Florals · Est. 2014 · Alabama',
    sub: '3" oval · Matte · Botanical illustration',
    price: 5,
    photo: '/merch/green-thumbs-club-sticker.webp',
    badge: 'Heather Florals',
    badgeColor: '#166534',
    category: 'sticker',
    available: true,
    cities: ['anniston'],
  },

  // ── CHEAHA MOUNTAIN ────────────────────────────────────────
  {
    id: 'cheaha-tower-shirt',
    name: 'Cheaha Tower',
    tagline: '2,413 ft · State of Alabama Peak · Built with Muscle & Fire',
    sub: 'Forest green shirt · Blue / gold badge · DTF print',
    price: 35,
    photo: '/merch/sl-cheaha-forest.webp',
    rawGraphic: '/merch/cheaha-tower-badge.png',
    badge: 'SL Woodcut',
    badgeColor: '#1e3a5f',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['piedmont', 'gadsden'],
  },
  {
    id: 'cheaha-tower-sticker',
    name: 'Cheaha Tower Sticker',
    tagline: '3" round · Matte · Weather-resistant',
    sub: 'Blue / gold / cream on dark',
    price: 5,
    photo: '/merch/cheaha-tower-badge.png',
    badge: 'SL Woodcut',
    badgeColor: '#1e3a5f',
    category: 'sticker',
    available: true,
    cities: ['piedmont', 'gadsden'],
  },
  {
    id: 'cheaha-sanctuary-sticker',
    name: 'To Lasting Sanctuary',
    tagline: 'Cheaha Mountain · CCC Built 1933 · From Ancient High Place',
    sub: '3" round · Rust red · Matte',
    price: 5,
    photo: '/merch/cheaha-lasting-sanctuary.png',
    badge: 'SL Woodcut',
    badgeColor: '#7f1d1d',
    category: 'sticker',
    available: true,
    cities: ['piedmont', 'gadsden'],
  },
  {
    id: 'cheaha-skyway-print',
    name: 'Building the Skyway',
    tagline: 'Cheaha State Park · Blasted Through Solid Rock',
    sub: '11×14 · Matte cardstock · Frame-ready',
    price: 15,
    photo: '/merch/cheaha-building-skyway.png',
    badge: 'Art Print',
    badgeColor: '#78350f',
    category: 'print',
    available: true,
    cities: ['piedmont', 'gadsden'],
  },

  // ── OXFORD / LICKSKILLET ────────────────────────────────────
  {
    id: 'lickskillet-premium-shirt',
    name: 'Lickskillet · Oxford, Alabama',
    tagline: 'The Frontier Original · Legendary Hospitality Since Then',
    sub: 'Black shirt · Premium circle badge · DTF print · Test print recommended',
    price: 35,
    photo: '/merch/sl-lickskillet-black.webp',
    rawGraphic: '/merch/lickskillet-premium-shirt.png',
    badge: 'SL Woodcut',
    badgeColor: '#7a3c00',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['oxford'],
  },
  {
    id: 'lickskillet-ox-sticker',
    name: "You'll Have to Lick the Skillet",
    tagline: 'Oxford, Alabama · Historic nickname',
    sub: '3" round · Teal / cream · Matte',
    price: 5,
    photo: '/merch/lickskillet-ox-sticker.png',
    badge: 'SL Woodcut',
    badgeColor: '#0f766e',
    category: 'sticker',
    available: true,
    cities: ['oxford'],
  },

  // ── JACKSONVILLE ────────────────────────────────────────────
  {
    id: 'jacksonville-court-square-print',
    name: 'Jacksonville — Historic Court Square',
    tagline: 'The Heart of Benton County · Est. 1834',
    sub: '11×14 · Matte cardstock · Frame-ready',
    price: 12,
    photo: '/merch/jacksonville-court-square.png',
    badge: 'Art Print',
    badgeColor: '#166534',
    category: 'print',
    available: true,
    cities: ['jacksonville'],
  },

  // ── MODEL CITY ─────────────────────────────────────────────
  {
    id: 'model-city-shirt',
    name: 'The Model City — Dark',
    tagline: 'Anniston, Alabama — Est. 1872',
    sub: 'Black · Navy · Forest · Slate',
    price: 29,
    photo: '/merch/fw/model-city-dark-01.webp',
    photoBack: '/merch/fw/model-city-dark-02.webp',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'model-city-shirt-light',
    name: 'The Model City — Light',
    tagline: 'Anniston, Alabama — Est. 1872',
    sub: 'Mustard · Light Green · Ice Blue · Crimson · White',
    price: 29,
    photo: '/merch/fw/model-city-light-01.webp',
    photoBack: '/merch/fw/model-city-light-02.webp',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },

  // ── COLDWATER MOUNTAIN ─────────────────────────────────────
  {
    id: 'coldwater-shirt',
    name: 'Coldwater Mountain',
    tagline: 'Oxford, Alabama · IMBA Epic',
    sub: 'Forest green · Calhoun County',
    price: 35,
    photo: '/merch/coldwater-shirt.png',
    badge: 'SL Woodcut',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['oxford', 'anniston'],
  },
  {
    id: 'coldwater-sticker',
    name: 'Coldwater Mountain Badge',
    tagline: 'Oxford · IMBA Epic · Calhoun County',
    price: 5,
    photo: '/merch/coldwater-badge-sticker.png',
    badge: 'SL Woodcut',
    category: 'sticker',
    available: true,
    cities: ['oxford', 'anniston'],
  },

  // ── PINHOTI TRAIL ──────────────────────────────────────────
  {
    id: 'pinhoti-shirt',
    name: 'Pinhoti Trail',
    tagline: 'Alabama · 172 Miles · Talladega National Forest',
    sub: 'Black shirt · DTF print',
    price: 35,
    photo: '/print-files/WOODSTOCK-06-pinhoti-trail-BLACK.png',
    bg: '#1a1a1a',
    badge: 'SL Woodcut',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
  },
  {
    id: 'pinhoti-sticker',
    name: 'Pinhoti Trail',
    tagline: 'Alabama · 172 Miles · Talladega National Forest',
    price: 5,
    photo: '/merch/pinhoti-badge-sticker.png',
    badge: 'SL Woodcut',
    category: 'sticker',
    available: true,
  },

  // ── NOCCALULA FALLS ────────────────────────────────────────
  {
    id: 'noccalula-falls-shirt',
    name: 'Noccalula Falls',
    tagline: 'Gadsden, Alabama · Yellow Creek Falls',
    sub: 'Black shirt · DTF print',
    price: 35,
    photo: '/print-files/SL-07-noccalula-falls-BLACK.png',
    bg: '#1a1a1a',
    badge: 'SL Woodcut',
    badgeColor: '#0f4c75',
    category: 'shirt' as const,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['gadsden'],
  },
  {
    id: 'noccalula-water-thunders-shirt',
    name: 'Where the Water Thunders',
    tagline: 'Noccalula Falls · Gadsden, Alabama',
    sub: 'Black shirt · Woodcut badge · DTF print',
    price: 35,
    photo: '/print-files/SL-08-noccalula-water-thunders-BLACK.png',
    bg: '#1a1a1a',
    badge: 'SL Woodcut',
    badgeColor: '#0f4c75',
    category: 'shirt' as const,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['gadsden'],
  },
  {
    id: 'noccalula-print',
    name: 'Noccalula Falls',
    tagline: 'Gadsden, Alabama · Est. as a Park 1929',
    price: 12,
    photo: '/merch/noccalula-falls-print.png',
    badge: 'SL Editorial',
    category: 'print',
    available: true,
    cities: ['gadsden'],
  },

  {
    id: 'noccalula-sticker',
    name: 'Noccalula Falls',
    tagline: 'Gadsden, Alabama · Est. as a Park 1929',
    price: 5,
    photo: '/merch/noccalula-falls-print.png',
    badge: 'SL Editorial',
    category: 'sticker',
    available: true,
    cities: ['gadsden'],
  },

  // ── FORT McCLELLAN ─────────────────────────────────────────
  {
    id: 'fort-mcclellan-shirt',
    name: 'Fort McClellan',
    tagline: 'Anniston, Alabama · 1917 – 1999',
    price: 35,
    photo: '/print-files/WOODSTOCK-08-fort-mcclellan-BLACK.webp',
    bg: '#4a5741',
    badge: 'SL Editorial',
    category: 'shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available: true,
    cities: ['anniston'],
  },
  {
    id: 'fort-mcclellan-sticker',
    name: 'Fort McClellan Badge',
    tagline: 'Anniston · 1917 – 1999',
    price: 5,
    photo: '/merch/fort-mcclellan-sticker.png',
    badge: 'SL Editorial',
    category: 'sticker',
    available: true,
    cities: ['anniston'],
  },

  // ── HATS ───────────────────────────────────────────────────
  { id: 'clt-trucker-hat', name: 'Chief Ladiga Trail Trucker', tagline: 'Anniston to Piedmont · 33.5 mi', price: 28, photo: '/merch/clt-sticker-print.png', badge: 'Coming Soon', category: 'hat', available: false, comingSoon: true, cities: ['anniston', 'piedmont'] },
  { id: 'sl-5panel-hat', name: 'Southern Legends 5-Panel', tagline: 'NE Alabama · Est. 2023', price: 28, photo: '/merch/sl-run.webp', badge: 'Coming Soon', category: 'hat', available: false, comingSoon: true },
  { id: 'ecclesia-hat', name: 'Ecclesia Coin Hat', tagline: 'Triskelion patch · Trucker', price: 28, photo: '/merch/ecclesia-coin.png', badge: 'Coming Soon', category: 'hat', available: false, comingSoon: true },
  { id: 'pv-raiders-hat', name: 'PV Raiders Snapback', tagline: 'Run Like You Stole It.', price: 26, photo: '/merch/pv-raiders-xc.webp', badge: 'Coming Soon', category: 'hat', available: false, comingSoon: true, cities: ['anniston'] },

  // ── HOODIES ────────────────────────────────────────────────
  { id: 'clt-trail-hoodie', name: 'CLT Trail Hoodie', tagline: 'Chief Ladiga Trail · Pullover', price: 55, photo: '/merch/clt-hike-explore-shirt.png', badge: 'Coming Soon', category: 'hoodie', available: false, comingSoon: true, cities: ['anniston', 'piedmont'] },
  { id: 'sl-crewneck', name: 'Southern Legends Crewneck', tagline: 'NE Alabama · Heavy cotton', price: 55, photo: '/merch/diaspora-shirt.webp', badge: 'Coming Soon', category: 'hoodie', available: false, comingSoon: true },
  { id: 'diaspora-pullover', name: 'Diaspora Pullover', tagline: 'I left. I came back. — Hoodie', price: 58, photo: '/merch/diaspora-shirt.webp', badge: 'Coming Soon', category: 'hoodie', available: false, comingSoon: true },

  // ── PATCHES ────────────────────────────────────────────────
  { id: 'clt-patch', name: 'CLT Iron-On Patch', tagline: 'Chief Ladiga Trail · 3" embroidered', price: 8, photo: '/merch/clt-sticker-print.png', badge: 'Coming Soon', category: 'patch', available: false, comingSoon: true },
  { id: 'pinhoti-patch', name: 'Pinhoti Trail Patch', tagline: '172 Miles · Iron-on', price: 8, photo: '/merch/pinhoti-badge-sticker.png', badge: 'Coming Soon', category: 'patch', available: false, comingSoon: true },
  { id: 'sl-patch', name: 'SL Wordmark Patch', tagline: 'Southern Legends · Embroidered', price: 8, photo: '/merch/sl-run.webp', badge: 'Coming Soon', category: 'patch', available: false, comingSoon: true },

  // ── ENAMEL PINS ────────────────────────────────────────────
  { id: 'sl-triskelion-pin', name: 'SL Triskelion Pin', tagline: 'Hard enamel · 1.25"', price: 12, photo: '/merch/ecclesia-coin.png', badge: 'Coming Soon', category: 'pin', available: false, comingSoon: true },
  { id: 'clt-boot-pin', name: 'CLT Boot Pin', tagline: 'Trail boot · Hard enamel · 1"', price: 12, photo: '/merch/clt-sticker-print.png', badge: 'Coming Soon', category: 'pin', available: false, comingSoon: true },
  { id: 'fort-mcclellan-pin', name: 'Fort McClellan Badge Pin', tagline: 'Hard enamel · 1.25"', price: 12, photo: '/merch/fort-mcclellan-sticker.png', badge: 'Coming Soon', category: 'pin', available: false, comingSoon: true },

  // ── MUGS ───────────────────────────────────────────────────
  { id: 'model-city-mug', name: 'The Model City Mug', tagline: 'Anniston, Alabama · 11oz ceramic', price: 18, photo: '/merch/model-city-print.png', badge: 'Coming Soon', category: 'mug', available: false, comingSoon: true, cities: ['anniston'] },
  { id: 'lickskillet-mug', name: 'Lickskillet Mug', tagline: 'Oxford, Alabama · 11oz', price: 18, photo: '/merch/lickskillet-premium-shirt.png', badge: 'Coming Soon', category: 'mug', available: false, comingSoon: true, cities: ['oxford'] },
  { id: 'clt-trail-map-mug', name: 'CLT Trail Map Mug', tagline: 'Full trail · 11oz ceramic', price: 18, photo: '/merch/clt-trail-map-print.webp', badge: 'Coming Soon', category: 'mug', available: false, comingSoon: true },

  // ── POSTERS ────────────────────────────────────────────────
  { id: 'noccalula-poster', name: 'Noccalula Falls Poster', tagline: 'Gadsden, Alabama · 18×24 print', price: 22, photo: '/merch/noccalula-falls-print.png', badge: 'Coming Soon', category: 'poster', available: false, comingSoon: true, cities: ['gadsden'] },
  { id: 'freedom-riders-poster', name: 'Freedom Riders Poster', tagline: 'Anniston, 1961 · 11×14 editorial', price: 18, photo: '/merch/freedom-riders/shirt-mockup-dark.webp', badge: 'Coming Soon', category: 'poster', available: false, comingSoon: true, cities: ['anniston'] },
  { id: 'cheaha-tower-poster', name: 'Cheaha Tower Poster', tagline: '2,413 ft · 11×14 print', price: 18, photo: '/merch/cheaha-tower-badge.png', badge: 'Coming Soon', category: 'poster', available: false, comingSoon: true },

  // ── SOCKS ──────────────────────────────────────────────────
  { id: 'clt-trail-socks', name: 'CLT Trail Socks', tagline: 'Chief Ladiga Trail · Crew length', price: 18, photo: '/merch/clt-sticker-print.png', badge: 'Coming Soon', category: 'sock', available: false, comingSoon: true },
  { id: 'raider-road-runners-socks', name: 'Raider Road Runners Socks', tagline: 'PV Raiders · Crew length', price: 18, photo: '/merch/raider-road-runners.webp', badge: 'Coming Soon', category: 'sock', available: false, comingSoon: true },

  // ── 3D PRINTS — HEADLEY BROS ───────────────────────────────
  { id: 'sl-triskelion-coin-3d', name: 'SL Triskelion Coin', tagline: 'Headley Bros · PLA · 2" coin', price: 8, photo: '/merch/ecclesia-coin.png', badge: 'Headley Bros', category: '3d-print', available: false, comingSoon: true },
  { id: 'clt-trail-marker-3d', name: 'CLT Trail Marker', tagline: 'Headley Bros · PLA · Desk piece', price: 12, photo: '/merch/clt-sticker-print.png', badge: 'Headley Bros', category: '3d-print', available: false, comingSoon: true },
  { id: 'cheaha-token-3d', name: 'Cheaha Summit Token', tagline: 'Headley Bros · PLA · 1.5" coin', price: 8, photo: '/merch/cheaha-tower-badge.png', badge: 'Headley Bros', category: '3d-print', available: false, comingSoon: true },
  { id: 'ecclesia-stone-3d', name: 'Ecclesia Standing Stone', tagline: 'Headley Bros · PLA · 3" desktop', price: 14, photo: '/merch/ecclesia-stone.png', badge: 'Headley Bros', category: '3d-print', available: false, comingSoon: true },

  // ── PENNANTS ───────────────────────────────────────────────
  { id: 'jsu-gamecocks-pennant', name: 'Jacksonville · JSU Country', tagline: 'Felt pennant · 12"', price: 16, photo: '/merch/jacksonville-gamecock-shirt.webp', badge: 'Coming Soon', category: 'pennant', available: false, comingSoon: true, cities: ['jacksonville'] },
  { id: 'pv-raiders-pennant', name: 'PV Raiders Pennant', tagline: 'Felt pennant · 12"', price: 16, photo: '/merch/pv-raiders-xc.webp', badge: 'Coming Soon', category: 'pennant', available: false, comingSoon: true, cities: ['anniston'] },

  // ── JOURNALS ───────────────────────────────────────────────
  { id: 'sl-journal', name: 'Southern Legends Journal', tagline: 'NE Alabama · 160 pages · Smyth-sewn', price: 22, photo: '/merch/model-city-print.png', badge: 'Coming Soon', category: 'journal', available: false, comingSoon: true },

  // ── CHRISTIAN SATIRE — FUNNY & REVERENT (Kerusso/NOTW style) ──
  { id: 'xian-early-church', name: 'The Early Church Was Weird Too', tagline: 'Ecclesia Press · You\'re in good company.', sub: 'Black · Cream · 8-bit pixel art', price: 28, photo: '/merch/ecclesia-pilgrims.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-demons-believe', name: 'Even the demons believe.', tagline: 'James 2:19 · And they shudder.', sub: 'Black tee · Cream type · Dry theological wit', price: 28, photo: '/merch/ecclesia-pilgrims.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-repent-podcast', name: 'Repent, For the Podcast Is at Hand.', tagline: 'Ecclesia Press · Satire for the digitally devout.', sub: 'Black tee · Gold type', price: 28, photo: '/merch/ecclesia-pilgrims.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-sinners-welcome', name: 'Sinners Welcome. Especially You.', tagline: 'Ecclesia Press · No exceptions.', sub: 'Black tee · Cream type · Bold sans', price: 28, photo: '/merch/ecclesia-pilgrims.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-jesus-wept', name: "Jesus Wept. I Get It.", tagline: 'Ecclesia Press · Shortest verse, deepest truth.', sub: 'Navy · Cream · DM Sans', price: 28, photo: '/merch/ep-father-runs.webp', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-table-room', name: 'There Is Room at the Table.', tagline: 'Ecclesia Press · Come as you are.', sub: 'Cream tee · Forest green type · Woodcut table illustration', price: 28, photo: '/merch/ecclesia-coin.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-left-unsupervised', name: 'In My Defense, I Was Left Unsupervised.', tagline: 'Ecclesia Press · A theological statement.', sub: 'Black tee · Cream · Dry humor', price: 28, photo: '/merch/ecclesia-pilgrims.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-well-behaved', name: 'Well-Behaved Christians Rarely Make History.', tagline: 'Ecclesia Press · Paraphrase. You know why.', sub: 'Black · Purple · Cream · Fraunces serif', price: 28, photo: '/merch/ep-here-i-stand.webp', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-door-open', name: 'The Door Is Always Open.', tagline: 'Ecclesia Press · Luke 15. He runs.', sub: 'Cream tee · Warm brown type · Woodcut door', price: 28, photo: '/merch/ep-father-runs.webp', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-not-religious', name: "I'm Not Religious. I Just Love the Lord.", tagline: "Ecclesia Press · There's a difference.", sub: 'Navy · Gold · Clean type', price: 28, photo: '/merch/ecclesia-coin.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'xian-sticker-demons', name: 'Even the Demons Believe — Sticker', tagline: 'James 2:19 · Die-cut 3"', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'sticker', available: false, comingSoon: true },
  { id: 'xian-sticker-sinners', name: 'Sinners Welcome — Sticker', tagline: 'Ecclesia Press · 3" vinyl', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'Ecclesia Press', badgeColor: '#5b21b6', category: 'sticker', available: false, comingSoon: true },

  // ── MATT'S OWN — SERIOUS & REVERENT FAITH LINE ─────────────
  // Broken Ground — memoir testimony (ships with the book as presell merch)
  { id: 'faith-credential-wreckage', name: 'The Credential Is the Wreckage.', tagline: 'Not the podium. The wound.', sub: 'Black · Cream serif · Limping Guide line', price: 30, photo: '/merch/ep-father-runs.webp', badge: 'Broken Ground', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-limp', name: 'I Walk with a Limp.', tagline: 'Genesis 32 · The wrestling left a mark.', sub: 'Black · Ivory · Fraunces serif italic', price: 30, photo: '/merch/ep-father-runs.webp', badge: 'Broken Ground', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-beloved-broken', name: 'Beloved and Broken.', tagline: 'Both things are true.', sub: 'Navy · Cream · DM Sans + Fraunces', price: 30, photo: '/merch/ep-father-runs.webp', badge: 'Broken Ground', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-sticker-limp', name: 'I Walk with a Limp — Sticker', tagline: 'Genesis 32 · 3" die-cut', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'Broken Ground', badgeColor: '#7f1d1d', category: 'sticker', available: false, comingSoon: true },
  // Attune — formation / contemplative (ships with Attune product rollout)
  { id: 'faith-wound-is-way', name: 'The Wound Is the Way.', tagline: 'Rohr. Nouwen. The mystics knew.', sub: 'Black · Gold · Fraunces italic', price: 30, photo: '/merch/ep-father-runs.webp', badge: 'Attune', badgeColor: '#c9a227', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-sufficient', name: 'My grace is sufficient.', tagline: '2 Corinthians 12:9 · Not barely. Enough.', sub: 'Cream tee · Sage type · Quiet design', price: 30, photo: '/merch/ecclesia-stone-shirt.webp', badge: 'Attune', badgeColor: '#c9a227', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-incarnational', name: 'Incarnational.', tagline: 'God showed up in a body. We should too.', sub: 'Black · Cream · Simple bold type', price: 30, photo: '/merch/ecclesia-stone-shirt.webp', badge: 'Attune', badgeColor: '#c9a227', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-kingdom-quietly', name: 'The Kingdom Comes Quietly.', tagline: 'Against triumphalism. For the long work.', sub: 'Dark olive · Cream · Fraunces serif', price: 30, photo: '/merch/ecclesia-pilgrims.png', badge: 'Attune', badgeColor: '#c9a227', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'faith-sticker-wound', name: 'The Wound Is the Way — Sticker', tagline: '3" vinyl · Fraunces italic', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'Attune', badgeColor: '#c9a227', category: 'sticker', available: false, comingSoon: true },

  // ── MUSHROOM & FORAGER LINE ─────────────────────────────────
  { id: 'forager-forage-ridge', name: 'Forage the Ridge', tagline: 'NE Alabama · Talladega National Forest', sub: 'Sage green · Cream · Botanical badge illustration', price: 30, photo: '/merch/blossom-and-decay-clean.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-chanterelle', name: 'Chanterelle Season', tagline: 'Alabama · July · Golden in the hollow.', sub: 'Cream tee · Gold + orange · Hand-drawn mushroom', price: 30, photo: '/merch/blossom-decay-sugar-skull.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-death-cap', name: 'Death Cap Diner', tagline: 'Fine Dining in the Forest Floor.', sub: 'Black tee · Cream · Dark humor · Amanita illustration', price: 30, photo: '/merch/skull-gothic-sticker.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-mycelium', name: 'Mycelium Network', tagline: 'Everything is connected underground.', sub: 'Dark tee · Teal · Root network illustration', price: 30, photo: '/merch/ecclesia-pilgrims.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-underground-church', name: 'The Underground Church', tagline: 'First: the mycelium. Then: everything else.', sub: 'Black tee · Teal + cream · Faith × fungi crossover', price: 30, photo: '/merch/ecclesia-pilgrims.png', badge: 'SL Forager', badgeColor: '#1a5a4a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-spore-season', name: 'Spore Season', tagline: 'Alabama · Spring & Fall · Pinhoti corridor', sub: 'Olive · Cream · Minimal mushroom badge', price: 28, photo: '/merch/blossom-and-decay-clean.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-ne-ala-mycology', name: 'NE Alabama Mycology', tagline: 'Calhoun · Cleburne · Cherokee Counties', sub: 'Cream tee · Field guide aesthetic · Species illustration', price: 30, photo: '/merch/blossom-decay-sugar-skull.png', badge: 'SL Forager', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'forager-sticker-chanterelle', name: 'Chanterelle — Alabama Forager Sticker', tagline: '3" die-cut · Botanical illustration', price: 5, photo: '/merch/blossom-and-decay-clean.png', badge: 'SL Forager', badgeColor: '#365314', category: 'sticker', available: false, comingSoon: true },
  { id: 'forager-sticker-death-cap', name: 'Death Cap Diner — Sticker', tagline: '3" die-cut · Dark humor', price: 5, photo: '/merch/skull-gothic-sticker.png', badge: 'SL Forager', badgeColor: '#365314', category: 'sticker', available: false, comingSoon: true },
  { id: 'forager-print', name: 'NE Alabama Field Guide — Mushroom Print', tagline: '11×14 · Field guide layout · 8 species', sub: 'Cream stock · Frame-ready', price: 18, photo: '/merch/clt-trail-map-print.webp', badge: 'SL Forager', badgeColor: '#365314', category: 'print', available: false, comingSoon: true },

  // ── UNIVERSAL SPORTS — XC / MTB / TRAIL ────────────────────
  { id: 'sport-run-ridge', name: 'Run the Ridge', tagline: 'NE Alabama Cross Country', sub: 'Black · Cream · Universal XC badge', price: 28, photo: '/merch/pv-raiders-xc.webp', badge: 'SL Sports', badgeColor: '#1e3a5f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'sport-ride-coldwater', name: 'Ride Coldwater', tagline: 'Oxford, Alabama · IMBA Epic · MTB', sub: 'Forest green · Cream · Mountain badge', price: 28, photo: '/merch/coldwater-badge-sticker.png', badge: 'SL Sports', badgeColor: '#1e3a5f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'sport-swim-bike-run', name: 'Swim. Bike. Run. NE Alabama.', tagline: 'Tri NE Alabama', sub: 'Navy · Gold · Triathlon badge', price: 28, photo: '/merch/pv-raiders-xc.webp', badge: 'SL Sports', badgeColor: '#1e3a5f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'sport-al-xc', name: 'AL XC', tagline: 'Alabama Cross Country · Run Your Hills', sub: 'Crimson · Cream · Statewide XC design', price: 28, photo: '/merch/pv-raiders-xc.webp', badge: 'SL Sports', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'sport-pirate-xc', name: 'Jolly Roger XC — Run Like You\'re Haunted.', tagline: 'Universal pirate XC · Any school, any team.', sub: 'Black · Cream · Skull + running legs badge', price: 28, photo: '/merch/pv-raiders-xc.webp', badge: 'SL Sports', badgeColor: '#1a1a2e', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'sport-pirate-mtb', name: 'Jolly Roger MTB — Ride Like You\'re Cursed.', tagline: 'Universal pirate MTB · Any trail, any crew.', sub: 'Black · Cream · Skull + bike badge', price: 28, photo: '/merch/coldwater-badge-sticker.png', badge: 'SL Sports', badgeColor: '#1a1a2e', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },

  // ── THEATER & ARTS VERTICAL ─────────────────────────────────
  { id: 'theater-all-mad', name: "We're All Mad Here.", tagline: 'Alice · The theater kid creed.', sub: 'Black · Purple · 8-bit Cheshire', price: 28, photo: '/merch/cheshire-shirt.webp', badge: 'SL Theater', badgeColor: '#3b1f6a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'theater-break-leg', name: 'Break a Leg. It\'s a Blessing.', tagline: 'Ecclesia Press × Theater · Reverent break-a-leg.', sub: 'Black · Gold · Fraunces italic', price: 28, photo: '/merch/ep-here-i-stand.webp', badge: 'SL Theater', badgeColor: '#3b1f6a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'theater-show-must', name: "The Show Must Go On. (It Doesn't.)", tagline: 'Community theater honesty.', sub: 'Black · Cream · Stage curtain graphic', price: 28, photo: '/merch/cheshire-shirt.webp', badge: 'SL Theater', badgeColor: '#3b1f6a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'theater-sticker-curtain', name: 'Stage Curtain — Sticker', tagline: '3" die-cut · Red velvet graphic', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'SL Theater', badgeColor: '#3b1f6a', category: 'sticker', available: false, comingSoon: true },

  // ── FOOD & MARKET VERTICAL ─────────────────────────────────
  { id: 'food-dirt-to-table', name: 'Dirt to Table.', tagline: 'NE Alabama Growers · No middleman.', sub: 'Sage green · Cream · Farmer badge', price: 28, photo: '/merch/diaspora-shirt.webp', badge: 'SL Market', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'food-eat-local', name: 'Eat Local or Eat Alone.', tagline: 'MarketDay · NE Alabama · Strong opinion.', sub: 'Black · Cream · Bold sans', price: 28, photo: '/merch/model-city-print.png', badge: 'SL Market', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'food-market-day', name: 'MarketDay', tagline: 'Gather Ground · NE Alabama Producers Market', sub: 'Cream · Sage · Market scene woodcut', price: 28, photo: '/merch/model-city-tote.webp', badge: 'SL Market', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'food-market-tote', name: 'Gather Ground Market Tote', tagline: 'Noble Street · Anniston, Alabama', sub: 'Cream canvas · Green handle · Market badge', price: 22, photo: '/merch/model-city-tote.webp', badge: 'SL Market', badgeColor: '#365314', category: 'tote', available: false, comingSoon: true, cities: ['anniston'] },

  // ── AGRICULTURE & FARM VERTICAL ────────────────────────────
  { id: 'farm-slow-grown', name: 'Slow Grown.', tagline: 'NE Alabama · The opposite of everything.', sub: 'Sage · Cream · Root system illustration', price: 28, photo: '/merch/diaspora-shirt.webp', badge: 'SL Farm', badgeColor: '#78350f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'farm-bloom-bar', name: 'Bloom Bar', tagline: 'Heather Florals · Calhoun County · Est. 2014', sub: 'Sage · Cream · Botanical logo tee', price: 28, photo: '/merch/green-thumbs-club-sticker.webp', badge: 'Heather Florals', badgeColor: '#166534', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'farm-flower-farmer', name: "I'm a Flower Farmer.", tagline: 'Not a florist. A farmer. Ask me the difference.', sub: 'Sage · Cream · Drip humor', price: 28, photo: '/merch/green-thumbs-club-sticker.webp', badge: 'Heather Florals', badgeColor: '#166534', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },

  // ── MUSIC VERTICAL ─────────────────────────────────────────
  { id: 'music-sacred-secular', name: 'Sacred and Secular.', tagline: 'Ecclesia Collective · The Evergreens · NE Alabama', sub: 'Black · Cream · Music note + cross fusion', price: 28, photo: '/merch/ecclesia-stone-shirt.webp', badge: 'SL Music', badgeColor: '#1a5a4a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'music-beat-studio', name: 'BeatStudio', tagline: 'Chord charts for the rest of us.', sub: 'Black · Pixel guitar · 8-bit', price: 28, photo: '/merch/ecclesia-coin-shirt.webp', badge: 'BeatStudio', badgeColor: '#3b1f6a', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'music-sticker-treble', name: 'Sacred & Secular — Sticker', tagline: 'Ecclesia Collective · 3" vinyl', price: 5, photo: '/merch/ecclesia-coin.png', badge: 'SL Music', badgeColor: '#1a5a4a', category: 'sticker', available: false, comingSoon: true },

  // ── HUNTING & FISHING VERTICAL ─────────────────────────────
  { id: 'hunt-calhoun-county', name: 'Calhoun County · Hunt. Fish. Stay.', tagline: 'NE Alabama · Talladega Forest corridor', sub: 'Olive · Cream · Oak + deer badge', price: 28, photo: '/merch/diaspora-shirt.webp', badge: 'SL Outdoors', badgeColor: '#365314', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'hunt-coosa-river', name: 'Coosa River. Always.', tagline: 'NE Alabama · Etowah · Gadsden · Weiss Lake', sub: 'Navy · Cream · River bass badge', price: 28, photo: '/merch/diaspora-shirt.webp', badge: 'SL Outdoors', badgeColor: '#1e3a5f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },

  // ── SMALL TOWN VERTICAL ────────────────────────────────────
  { id: 'smalltown-born-here', name: "Born Here. Still Here.", tagline: 'NE Alabama · No apologies.', sub: 'Cream · Black · Diaspora counter-shirt', price: 28, photo: '/merch/diaspora-shirt.webp', badge: 'SL Small Town', badgeColor: '#7a5c1e', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'smalltown-piedmont', name: 'Piedmont, Alabama.', tagline: 'Pop. 4,600 · Trail Town · Enough.', sub: 'Cream · Green · Bold serif', price: 28, photo: '/merch/piedmont-clt-banner-print.webp', badge: 'SL Small Town', badgeColor: '#166534', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true, cities: ['piedmont'] },
  { id: 'smalltown-oxford', name: 'Oxford, Alabama.', tagline: 'Lickskillet. Coldwater. Cold cuts.', sub: 'Black · Cream · Oxford badge', price: 28, photo: '/merch/lickskillet-premium-shirt.png', badge: 'SL Small Town', badgeColor: '#7a3c00', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true, cities: ['oxford'] },

  // ── HISTORY & CIVIL RIGHTS VERTICAL ───────────────────────
  { id: 'history-1961-anniston', name: 'Anniston, 1961.', tagline: 'The bus burned. History didn\'t forget.', sub: 'Black · Cream · Woodcut · Freedom Riders', price: 35, photo: '/merch/freedom-riders/shirt-mockup-dark.webp', badge: 'SL Editorial', badgeColor: '#1a1a2e', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true, cities: ['anniston'] },
  { id: 'history-ccc-cheaha', name: 'CCC — Cheaha, 1933.', tagline: 'Civilian Conservation Corps · Built with hands.', sub: 'Olive · Cream · Woodcut tower illustration', price: 35, photo: '/merch/cheaha-building-skyway.png', badge: 'SL Editorial', badgeColor: '#78350f', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },

  // ── GOTHIC / LITERARY VERTICAL ────────────────────────────
  { id: 'gothic-southern-rot', name: "Everything Rots. That's the Point.", tagline: 'Blossom & Decay · Southern Gothic', sub: 'Cream · Black · Vines + skull + serif', price: 30, photo: '/merch/blossom-and-decay-clean.png', badge: 'SL Gothic', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'gothic-pleasant-decay', name: "It Was Never Pleasant Valley.", tagline: 'Southern Gothic memoir tee · Broken Ground', sub: 'Dark olive · Cream italic · Fraunces', price: 30, photo: '/merch/blossom-and-decay-clean.png', badge: 'SL Gothic', badgeColor: '#7f1d1d', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true },
  { id: 'gothic-sticker-rot', name: '"Everything Rots." — Sticker', tagline: 'Southern Legends Gothic · 3" die-cut', price: 5, photo: '/merch/skull-gothic-sticker.png', badge: 'SL Gothic', badgeColor: '#7f1d1d', category: 'sticker', available: false, comingSoon: true },

  // ── WEDDING & AISLE VERTICAL ───────────────────────────────
  { id: 'wedding-vendor-tee', name: 'The Aisle — Vendor Crew', tagline: 'Anniston Bridal Market · Oct 18, 2026', sub: 'Black shirt · Gold · Aisle wordmark tee', price: 28, photo: '/merch/aisle-vendor-tee-black.webp', rawGraphic: '/merch/aisle-vendor-tee-front.png', badge: 'The Aisle', badgeColor: '#c9a227', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: true, cities: ['anniston'] },
  { id: 'wedding-bloom-bar-shirt', name: 'Bloom Bar — Florals', tagline: 'Heather Florals · The Aisle · Anniston', sub: 'Cream · Sage · Bloom Bar logo tee', price: 28, photo: '/merch/green-thumbs-club-sticker.webp', badge: 'The Aisle', badgeColor: '#166534', category: 'shirt', sizes: ['S','M','L','XL','2XL'], available: false, comingSoon: true, cities: ['anniston'] },
  { id: 'wedding-tote', name: 'The Aisle — Market Tote', tagline: 'Anniston Bridal Market · Cream canvas', sub: 'DTF print · Gold handle accent', price: 22, photo: '/merch/model-city-tote.webp', badge: 'The Aisle', badgeColor: '#c9a227', category: 'tote', available: false, comingSoon: true, cities: ['anniston'] },
  { id: 'wedding-bride-cap', name: "She Said Yes. She's In Charge.", tagline: 'The Aisle · Bride trucker cap', sub: 'Cream · Gold embroidery · Trucker', price: 26, photo: '/merch/sl-run.webp', badge: 'The Aisle', badgeColor: '#c9a227', category: 'hat', available: false, comingSoon: true },

  // ── ECCLESIA ───────────────────────────────────────────
  { id: 'ec-pilgrims-shirt', name: 'Pilgrims Shirt', tagline: 'Ecclesia Community · Ancient Paths design', sub: 'Black shirt · DTF print · Faith formation', price: 32, photo: '/print-files/ECCLESIA-05-pilgrims-shirt.webp', rawGraphic: '/print-files/ECCLESIA-05-pilgrims-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Hoodie', 'Sticker', 'Art Print'], sizes: ['S','M','L','XL','2XL'], available: true },
  { id: 'ec-wound-shirt', name: 'The Wound Is the Way', tagline: 'Ecclesia Community · Woodcut design', sub: 'Black shirt · woodcut print · Formation wear', price: 32, photo: '/print-files/ECCLESIA-09-wound-woodcut-shirt.webp', rawGraphic: '/print-files/ECCLESIA-09-wound-is-the-way-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Hoodie', 'Sticker', 'Art Print'], sizes: ['S','M','L','XL','2XL'], available: false },
  { id: 'ec-gum-shirt', name: 'Chewed Gum Shirt', tagline: 'Ecclesia Community · Humor + formation', sub: 'Black shirt · Chewed Gum graphic', price: 32, photo: '/print-files/ECCLESIA-06-chewed-gum-shirt.webp', rawGraphic: '/print-files/ECCLESIA-06-chewed-gum-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Hoodie', 'Sticker'], sizes: ['S','M','L','XL','2XL'], available: true },
  { id: 'ec-coin-photo-shirt', name: 'Coin (Photoreal)', tagline: 'Ecclesia Community · Coin design series', sub: 'Black shirt · Photoreal coin', price: 32, photo: '/print-files/ECCLESIA-07-coin-photoreal-shirt.webp', rawGraphic: '/print-files/ECCLESIA-07-coin-photoreal-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Hoodie', 'Sticker', 'Pin'], sizes: ['S','M','L','XL','2XL'], available: false },
  { id: 'ec-risen-shirt', name: 'He Is Not Here', tagline: 'Ecclesia Community · Easter design', sub: 'Black shirt · Resurrection woodcut', price: 32, photo: '/print-files/ECCLESIA-08-he-is-not-here-shirt.webp', rawGraphic: '/print-files/ECCLESIA-08-he-is-not-here-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Hoodie', 'Sticker', 'Art Print'], sizes: ['S','M','L','XL','2XL'], available: true },
  { id: 'ec-coin-8bit-shirt', name: 'Coin (8-bit)', tagline: 'Ecclesia Community · Pixel art coin', sub: 'Black shirt · 8-bit pixel design', price: 28, photo: '/print-files/ECCLESIA-04-coin-8bit-shirt.webp', rawGraphic: '/print-files/ECCLESIA-04-coin-8bit-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Sticker', 'Pin'], sizes: ['S','M','L','XL','2XL'], available: true },
  { id: 'ec-coin-celtic-shirt', name: 'Coin (Celtic)', tagline: 'Ecclesia Community · Celtic knotwork coin', sub: 'Black shirt · Celtic coin design', price: 28, photo: '/print-files/ECCLESIA-03-coin-celtic-shirt.webp', rawGraphic: '/print-files/ECCLESIA-03-coin-celtic-BLACK.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'shirt', mediums: ['T-Shirt', 'Sticker', 'Pin'], sizes: ['S','M','L','XL','2XL'], available: true },
  // Ecclesia stickers
  { id: 'ec-sticker-pilgrims', name: 'Pilgrims Sticker', tagline: 'Ecclesia Community · 3" die-cut vinyl', price: 5, photo: '/print-files/ECCLESIA-S1-pilgrims-clergy-sticker.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'sticker', available: true },
  { id: 'ec-sticker-stone', name: 'Ancient Paths Sticker', tagline: 'Ecclesia Community · 3" die-cut vinyl', price: 5, photo: '/print-files/ECCLESIA-S1-stone-sticker.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'sticker', available: true },
  { id: 'ec-sticker-coin-8bit', name: 'Coin 8-bit Sticker', tagline: 'Ecclesia Community · 3" die-cut vinyl', price: 5, photo: '/print-files/ECCLESIA-S2-coin-sticker-8bit.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'sticker', available: true },
  { id: 'ec-sticker-wound', name: 'Wound Is the Way Sticker', tagline: 'Ecclesia Community · 3" die-cut vinyl', price: 5, photo: '/print-files/ECCLESIA-S6-wound-bowl-sticker.png', bg: '#0d1a0f', badge: 'Ecclesia', badgeColor: '#2dd4bf', category: 'sticker', available: true },
]


// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL SCORING ENGINE
// Called by: city pages, essay pages, profile pages, /api/merch (cross-site)
// ─────────────────────────────────────────────────────────────────────────────

export type MerchContext = {
  cities?:   string[]   // e.g. ['anniston']
  tags?:     string[]   // e.g. ['trail','history','mental-health','ecclesia','faith','running']
  venture?:  string     // 'ecclesia' | 'attune' | 'aisle' | 'heather' | 'sl'
  slug?:     string     // essay or profile slug — enables exact lookup overrides
  category?: MerchCategory  // force a category
  limit?:    number     // default 4
  includeUnavailable?: boolean  // default false
}

function scoreItem(item: MerchItem, ctx: MerchContext): number {
  let s = 0

  // availability base
  if (!item.available && !ctx.includeUnavailable) return -999
  if (!item.available) s -= 5

  // city match — strongest signal
  const cityHits = (item.cities ?? []).filter(c => ctx.cities?.includes(c)).length
  s += cityHits * 5

  // tag scoring against name, tagline, badge, sub
  const haystack = [
    item.name, item.tagline, item.sub ?? '', item.badge ?? ''
  ].join(' ').toLowerCase()

  for (const tag of ctx.tags ?? []) {
    const t = tag.toLowerCase()
    if (haystack.includes(t)) s += 3
  }

  // venture match against badge
  if (ctx.venture) {
    const v = ctx.venture.toLowerCase()
    const b = (item.badge ?? '').toLowerCase()
    if (b === v || b.includes(v)) s += 4
  }

  // category preference — shirts first, then stickers, totes, prints
  const catScore: Partial<Record<MerchCategory, number>> = {
    shirt: 2, tote: 1, sticker: 0, print: -1
  }
  s += catScore[item.category] ?? 0

  // fundraiser items get a bump (good community story)
  if (item.fundraiser) s += 1

  return s
}

/** Main context-aware scorer — used by all surfaces and the /api/merch endpoint */
export function getMerchForContext(ctx: MerchContext): MerchItem[] {
  // 1. exact slug overrides (keep these for hand-tuned editorial picks)
  if (ctx.slug) {
    const profileHit = PROFILE_MERCH[ctx.slug]
    const essayHit   = ESSAY_MERCH[ctx.slug]
    // If we have an override, seed with those then fill from scorer
    if (profileHit || essayHit) {
      const overrideIds = profileHit
        ? profileHit.filter(Boolean).map(p => p!.url.replace('/buy/', ''))
        : [essayHit!.url.replace('/buy/', '')]

      const overrides = overrideIds
        .map(id => MERCH.find(m => m.id === id))
        .filter((m): m is MerchItem => !!m && m.available)

      const rest = MERCH
        .filter(m => !overrideIds.includes(m.id))
        .map(m => ({ item: m, score: scoreItem(m, ctx) }))
        .filter(x => x.score > -999)
        .sort((a, b) => b.score - a.score)
        .map(x => x.item)

      return [...overrides, ...rest].slice(0, ctx.limit ?? 4)
    }
  }

  // 2. Pure scoring path
  return MERCH
    .map(m => ({ item: m, score: scoreItem(m, ctx) }))
    .filter(x => x.score > -999)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item)
    .slice(0, ctx.limit ?? 4)
}

export function getMerchForCity(citySlug: string, limit = 4): MerchItem[] {
  const cityAvail = MERCH.filter(m => m.available && m.cities?.includes(citySlug))
  const cityPending = MERCH.filter(m => !m.available && m.cities?.includes(citySlug))
  const wide = MERCH.filter(m => m.available && (!m.cities || m.cities.length === 0))
  // city-tagged items first (available then coming-soon placeholders), fill with SL-wide if sparse
  const result = [...cityAvail, ...cityPending]
  if (result.length < 2) result.push(...wide)
  return result.slice(0, limit)
}

export function getWideMerch(limit = 4): MerchItem[] {
  return MERCH.filter(m => m.available && (!m.cities || m.cities.length === 0)).slice(0, limit)
}

export function getMerchItem(id: string): MerchItem | undefined {
  return MERCH.find(m => m.id === id)
}

export function getMerchByCategory(cat: MerchItem['category']): MerchItem[] {
  return MERCH.filter(m => m.category === cat && m.available)
}

export function getMerchForOutdoors(limit = 6): MerchItem[] {
  const clt = MERCH.filter(m => m.id.startsWith('clt') || m.id.includes('ladiga') || m.id.includes('chief'))
  const anniston = MERCH.filter(m => m.available && m.cities?.includes('anniston') && !clt.find(c => c.id === m.id))
  return [...clt, ...anniston].slice(0, limit)
}

// Merch product lookups for profile/essay crosslinks — all internal routes
export const FW_PRODUCTS = {
  ICM: { url: '/merch/shirts', name: 'I Contain Multitudes', image: '/merch/fw/i-contain-multitudes-01.webp' },
  SH:  { url: '/merch/shirts', name: 'Still Here', image: '/merch/fw/still-here-01.webp' },
  BP:  { url: '/merch/shirts', name: 'Bipolar & Proud', image: '/merch/fw/bipolar-proud-01.webp' },
  CLT: { url: '/merch/shirts', name: "Ladiga's Land", image: '/merch/fw/chief-ladiga-trail-01.webp' },
  MC:  { url: '/merch/shirts', name: 'The Model City', image: '/merch/fw/model-city-dark-01.webp' },
  DD:  { url: '/merch/freedom-riders', name: 'Freedom Riders — Anniston, 1961', image: '/merch/fw/dave-dennis-freedom-rider-01.webp' },
} as const

type FWProduct = (typeof FW_PRODUCTS)[keyof typeof FW_PRODUCTS]
const PROFILE_MERCH: Record<string, [FWProduct, FWProduct, FWProduct?]> = {
  // trail / outdoor
  'chief-ladiga-trail': [FW_PRODUCTS.CLT, FW_PRODUCTS.ICM],
  'otter-creek-farmstead': [FW_PRODUCTS.CLT, FW_PRODUCTS.MC],
  'michele-hornsby-redbird-willow': [FW_PRODUCTS.CLT, FW_PRODUCTS.SH],
  // history / civil rights
  'noccalula-falls': [FW_PRODUCTS.CLT, FW_PRODUCTS.MC],
  'freedom-riders-national-monument': [FW_PRODUCTS.DD, FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'interfaith-ministries-calhoun-county': [FW_PRODUCTS.DD, FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  // mental health / formation
  'dale-clem': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'kelly-clem': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'dr-patricia-corbin': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'dr-renee-baptiste': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'ciara-smith-roston': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'blair-callaway': [FW_PRODUCTS.SH, FW_PRODUCTS.ICM],
  'sherill-clontz': [FW_PRODUCTS.SH, FW_PRODUCTS.MC],
  // Anniston / NE Alabama
  'anniston-museums-gardens': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'aquality-farms': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'lewis-downing': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'mom-to-go': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'shannon-jenkins': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'karla-eden-main-street-anniston': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'peerless-saloon': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'katelyn-iron-city-bloomery': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'lori-floyd-the-right-place': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'connie-thompson': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'mickey-starling-kiwanis': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'patrick-wigley-wigs-wheels': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'aaron-norris-anniston': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'headley-flower-farm': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'leah-cleghorn-southern-girl-coffee': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'lee-kathryn-evancho-calhoun-journal': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'brian-howell': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'aubrey-fullbright-romarin': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'cathy-simpson-longleaf-bookshop': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'clinton-hubbard': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'eric-traynor': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'gadsden-state-show-band': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'jackson-hodges': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'jeremy-stovall': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'ken-bodiford': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'lucy-vandervoort-morris': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'martha-vandervoort': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'nathan-wight': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'scott-emmalie-whitney': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'teresa-stricklin': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'adlene-kufarimai': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'eli-yanson-jsu': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'james-spann': [FW_PRODUCTS.MC, FW_PRODUCTS.ICM],
  'matt-mitchell-southern-humorist': [FW_PRODUCTS.ICM, FW_PRODUCTS.MC],
  // Jacksonville
  'mark-jones-jacksonville': [FW_PRODUCTS.CLT, FW_PRODUCTS.MC],
}
const ESSAY_MERCH: Record<string, FWProduct> = {
  // mental health / survival
  'the-hospital': FW_PRODUCTS.SH,
  'hope-in-the-wilderness': FW_PRODUCTS.SH,
  'im-not-going-to-disappear': FW_PRODUCTS.SH,
  'the-same-songs': FW_PRODUCTS.SH,
  'five-fifteen': FW_PRODUCTS.SH,
  // bipolar
  'the-same-domain': FW_PRODUCTS.BP,
  // trail / outdoor
  'chief-ladiga-trail': FW_PRODUCTS.CLT,
  'the-trail-at-night': FW_PRODUCTS.CLT,
  // identity / multitudes
  'attempt-73': FW_PRODUCTS.ICM,
  'a-letter-never-sent': FW_PRODUCTS.ICM,
  'my-writing-has-a-new-home': FW_PRODUCTS.ICM,
  'no-shade': FW_PRODUCTS.ICM,
  'heather': FW_PRODUCTS.ICM,
  'the-woman-behind-the-flowers': FW_PRODUCTS.ICM,
  'what-indiana-gave-me': FW_PRODUCTS.ICM,
  'what-muncie-gave-me': FW_PRODUCTS.ICM,
  'everything-is-running-under-the-same-shape': FW_PRODUCTS.ICM,
  // Anniston / NE Alabama
  'prestons-deck': FW_PRODUCTS.MC,
  'noble-street-anniston': FW_PRODUCTS.MC,
  'called-coffee-jerod-snider': FW_PRODUCTS.MC,
  'camp-lee': FW_PRODUCTS.MC,
  'anniston-farmers-market': FW_PRODUCTS.MC,
  'woodstock-race-2016': FW_PRODUCTS.MC,
  'the-church-ladies': FW_PRODUCTS.MC,
  // civil rights / history
  'one-cheer-from-inside-the-machine': FW_PRODUCTS.DD,
}
export function getProfileMerch(slug: string) {
  const [primary, secondary, tertiary] = PROFILE_MERCH[slug] ?? [FW_PRODUCTS.MC, FW_PRODUCTS.ICM]
  return { primary, secondary, tertiary }
}
export function getEssayMerch(slug: string) {
  const primary = ESSAY_MERCH[slug] ?? FW_PRODUCTS.ICM
  return { primary, secondary: primary === FW_PRODUCTS.ICM ? FW_PRODUCTS.SH : FW_PRODUCTS.ICM }
}
