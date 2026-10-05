# Southern Legends — Shipped Features

*Last updated: 2026-10-05. Source of truth for what's built.*

---

## Shirts Page + Merch DAM API (2026-10-05)

- **`/author` refresh** — books ordered by completeness ("Closest to done": Clever Confuses. Clarity Sells. first, then Tend, SL Vol. 1; "Also in the works": Broken Ground, God & the Algorithm, Back Forty). Parked titles (Chief Ladiga, Company of Farmers) removed to match BOOKS.md. Canonical byline in header. Title-card fallback for books without a real cover. Fake per-book merch replaced with real Fourthwall shirts from `merch.ts`.
- **Shirt cards** — 3D card flip on hover/tap; cream panel with multiply blend melts the Fourthwall photos' white backdrop.

- **`/merch/shirts`** — full shirt catalog: "On Fourthwall" (every item with `fwUrl`) + "Local & At Events". Real Fourthwall product photos in `public/merch/fw/`; tap (mobile) or hover flips to the back; thumbnail strip from `gallery`.
- **`MerchItem.fwUrl` / `gallery`** — Fourthwall product link and extra photos live in `merch.ts` (one home), not in page code.
- **`/api/merch-dam`** — DAM-shaped manifest (groups by category + assets) from the full `MERCH` array. Consumed by Gather Works `/dam-merch`. Asset `src` is `id|photo` so items sharing a photo don't collide; labels carry `[FW]` / `[print]` for search.

---

## Ad Network Pass 2 — placements, tracking, status (2026-10-05)

**Status key:** ✅ live in code and verified locally · 🟡 built, not yet verified in a browser · ⏳ waiting on a gate or a credential · ❌ not started

### Placements (The Aisle, the featured campaign)
- ✅ **Top strip** — slim card above the first paragraph of every profile and essay. Headline "Bridal Show", date, venue, website URL. `AisleStrip.tsx`.
- ✅ **End-of-page band** — full card above the footer, with the couple photo, QR code, "Register free →" button, and "Free to register in advance · $25 at the door". Site-wide from `layout.tsx` via `SiteAisleBand.tsx`. Single copy per page (duplicate removed 2026-10-05).
- 🟡 **Desktop margin card** — 300×250 standard medium rectangle, right margin, shown from 1440px wide. Fades in at a quarter of the page, out at the footer, has a close ×. Subtle photo drift and button hover, off under reduced-motion. `MarginAisle.tsx`.
- 🟡 **Mobile bottom bar** — 320×50 sticky bar below 1024px, same fade rules, close ×. `MobileAisleBar.tsx`. Not yet seen on a phone.
- ✅ **Support fallback** — sensitive pages (grief, illness, obituaries, etc.) get only the soft "Get new stories free" email signup. `TestimonialBand.tsx`.

### Show schedule and live data
- ✅ **Schedule** — `FEATURED_SCHEDULE` in `src/lib/ad-inventory.ts`: Anniston Oct 18 2026, then Silver Run Chapel Feb 21 2027. Switches itself the day after each show.
- ✅ **Snapshot** — `tools/sl-aisle-shows-snapshot.py` reads Turso `expo_shows` and writes `src/data/aisle-shows.json` plus one QR per show. Includes `ad_photo_url`.
- ✅ **Live read** — `src/lib/aisle-shows-live.ts` reads Turso directly and falls back to the snapshot. `AISLE_TURSO_URL` and `AISLE_TURSO_TOKEN` set in Vercel production 2026-10-05.

### Links, referral, QR
- ✅ **Permanent link `/go/aisle`** — forwards to the current show. Every placement links here, so a QR screenshotted today still works after the show changes. Tags each click with `utm_source=southernlegends`, `utm_content=<page>:<spot>`, and `ref=SLREFERS`.
- ✅ **Referral partner** — "Southern Legends" row (`SLREFERS`) in Turso `expo_partners`, created 2026-10-05. Live lookup confirmed.
- ✅ **Per-page QR** — every QR points to `/go/aisle` with the page tagged in.
- ✅ **VIP link** — "Make it VIP · $75 →" under the end band, via `/go/aisle?tier=vip` → register page with `tier=vip`. VIP price comes from the snapshot (Turso, falling back to `expo-pricing.ts`).

### Tracking
- ✅ **Table** — `sl_ad_events` in Turso (impression / click, placement, page, show, session). Created 2026-10-05, empty. SQL in `tools/sql/sl-ad-events.sql`.
- ✅ **Click logging** — `/go/aisle` records a click before forwarding. Verified writing to Turso 2026-10-05 (test row, then removed).
- 🟡 **Impression logging** — `ImpressionOnView` + `/api/ad-event`, approved by Matt 2026-10-05, placed in the band, top strip, margin card and mobile bar. Fires once per placement per visit, when half the card is on screen. Verified writing to Turso 2026-10-05.
- ✅ **Hover tracking** — logged once per placement per visit after an 800ms pause on the card. `sl_ad_events` accepts `hover` (schema changed 2026-10-05).
- 🟡 **Registration attribution** — `expo_registrations.sl_placement` and `sl_page` added 2026-10-05. Nothing writes them yet: theaisle's register route needs to save `utm_content` there (Luna's code).

### Still waiting
- ⏳ `DEPLOY SOUTHERNLEGENDS TO VERCEL` — required for any of this to go live. Note: `nexus-trail-news.py` no longer deploys on its own; its daily auto-deploy was removed 2026-10-05.
- ❌ Video ads — after deploy.
- ❌ Margin and bottom-bar rollouts for GS, BSR, Heather Florals, and other ventures.

---

## Ad Network on SL + Aisle Campaign (2026-10-05)

- **One ad router** — `src/lib/cta-router.ts` `pickAd`/`snapshotAd`: paid advertiser → featured campaign → topic-matched house ad → Support SL. SENSITIVE pages (grief, obituary, illness…) only ever get the soft Support ad; arts/theater pages skip random venture pitches but do run the featured campaign.
- **Campaign chooser** — `FEATURED_SCHEDULE` in `src/lib/ad-inventory.ts`: The Aisle promotes the next show that hasn't happened yet (Anniston Oct 18 2026 → Silver Run Chapel, date per Turso), switching itself the day after each show (ISR, no deploy). Show facts + per-show QR come from `src/data/aisle-shows.json`, generated from Turso `expo_shows` by `tools/sl-aisle-shows-snapshot.py`. Selling an ad = add an entry to `PAID_ADS` (no code change).
- **Aisle ads** — `AisleStrip` (slim, top of every profile/essay) + `AisleBand` (full, end of article; church-banner photo, Aisle arch + AMAG at ½ height, QR for laptop + phone). Both link straight to the register page via `aisleLink()`: `utm_source=southernlegends`, `utm_content=<page>:<spot>`, `ref=SLREFERS` (expo_partners "Southern Legends", so registrations are credited).
- **Testimonial band** — `TestimonialBand`: consented quote + face + one action. Support ad = inline free email signup (`/api/subscribe`, source `ad-band-support`). Consent source: `data/testimonials.json`.
- **Honest labels** — "From Southern Legends" for our own ventures, "Advertisement" only for paid (`VentureCTA.paid`).
- **Comments** — honeypot + 3s minimum-time check on `/api/comments/submit`.

---

## Empire Build: Entity Graph + Newsletter Tier + Column Syndication (2026-08-03)

- **Entity graph** — Supabase `subjects` table: 8 entity types (person/place/business/church/venue/trail/organization/event). GIN index on `ventures[]`. 50 NE Alabama subjects seeded. Server query lib at `src/lib/entity-graph.ts`.
- **Column syndication engine** — `tools/column-syndicate.py`: parses `columns.ts`, routes by tag to ventures (SL/Ecclesia/Aisle/Attune) and external pubs (Garden & Gun, Oxford American, Sojourners, Image Journal, etc.). Writes MDX with Star attribution. `--send` flag broadcasts via Resend.
- **Newsletter $7/mo tier** — `/api/newsletter/checkout` Stripe checkout route. `/newsletter` page with hero + sample issues + Matt bio. `/newsletter/welcome` success page. Requires `STRIPE_NEWSLETTER_PRICE_ID` env var (create in Stripe dashboard: $7/mo recurring).
- **4 new column candidates** in `src/data/columns.ts`: farming/place, Southern diaspora, AI/small biz, music/arts.

---

## Contextual Merch Engine + Cross-Site API (2026-07-30)

- **`getMerchForContext(ctx)`** in `src/lib/merch.ts` — scores all 100+ items by city/tag/venture/slug signals. Replaces hardcoded `FW_PRODUCTS` lookup for essays/profiles/city pages.
- **`/api/merch` (edge route)** — GET `?cities=&tags=&venture=&slug=&limit=` → returns scored `MerchItem[]`. CORS open. Any gather app (Attune, Ecclesia, GS) can call this to get contextual merch.
- **`ContextualMerchGrid` component** — drop-in merch block: shows shirt-bg-by-default + hover-raw-graphic, labeled section with `heading` override. Used on essays, profiles, city pages.
- **Merch card hover behavior flip** — ProductCard: default = graphic on shirt color bg; hover = raw graphic on plain/transparent bg.

---

## Affiliate Partner Program (2026-07-30)

- **`/affiliate`** — Signup form: name, email, optional social handle/platform → POSTs to Gather Registry Turso API (`gather-registry.vercel.app/api/affiliate`) → returns unique affiliate code + referral link. Shows code, copy-to-clipboard, and link to Registry affiliate dashboard.
- **`/r/[code]`** — Server-side referral redirect: records click via Registry API, then redirects to destination (merch, shop, or books) with `?ref=<code>` appended for downstream tracking. `noindex` metadata.
- **`/api/affiliate-redirect`** — Thin proxy: POST to create affiliate (proxies to Registry), GET to look up code. Keeps SL client-side code clean.
- **Footer** — Partner Program link added under Get Involved.
- **Backend** — Unified across ventures via Gather Registry Turso DB (not SL Supabase). All commissions tracked in one place.

## Email Growth System (2026-07-21)

- **`SubscribePopup`** — fires at 45% scroll depth, localStorage-gated (14-day cooldown), dark SL aesthetic, email + firstName → `/api/subscribe`. Wired in root `layout.tsx`.
- **`SupportPopup`** — fires at 88% scroll after subscribe popup has shown, bottom-right corner, $4.99/mo Reader pitch → `/support`. 30-day cooldown.
- **`/api/newsletter/send-post`** — POST `{title, excerpt, postUrl, section}` → branded SL post-announcement broadcast via Resend. Auth-gated (`ADMIN_SEND_SECRET`).
- **`/admin/send`** — Tabbed admin UI: "Announce a Post" (structured form → send-post route) + "Write a Newsletter" (freeform → send route). Section dropdown (Profile/Essay/The Back Forty/Places/Books/Arts).

## SL Places — City Targeting Engine (2026-07-17)

- **`src/lib/city-businesses.ts`** — 244 AL cities / 6,818 businesses from Gather Circle DB. Exports `CITIES`, `localBusinesses`, `cityToSlug`, `businessToSlug`, `LocalBusiness` type.
- **`/places`** — Curated index + A-Z grid of all 244 cities.
- **`/places/[city]`** — Full city page: Hero, Dispatch (news feed), Circle (business directory + claim CTAs → gatherstudio.app/api/wiki-claim), SL Places, Claim Band, Blueprint pitch, Faith section (Anniston only). JSON-LD ItemList schema.
- **`/places/[city]/[slug]`** — Business detail. ReelStudio video pitch. BridalShowReviews link for wedding/florist categories. JSON-LD LocalBusiness schema.
- **`/places/nominate`** — Nomination form (POST to `/api/places/nominate`).
- **`src/lib/places.ts`** — `SLSponsor`, `SLLegacyPerson`, `SLEvent` types + `getCitySponsor`, `getCityEvents`, `getCityLegacy`, `isBridalCategory` helpers. Seed `SL_SPONSORS`/`SL_LEGACY`/`SL_EVENTS` as data grows.
- **`/api/city-newsletter/subscribe`** — POST `{email, city}` → Resend subscribe + city-tagged welcome email.
- **`/api/sponsorship/apply`** — POST sponsorship inquiry → notify matt@gatherstudio.app.
- **City components:** `CityHouseAd` (dominant-category→venture ad), `CitySponsor` (sponsor banner), `CityLegacy` (Gather Legacy), `CityEvents` (coming up in [City]), `CityNewsletterSignup` (The [City] Letter).
- **profiles/[slug]** — Blueprint Session pitch block injected after article content.
- **Nav** — "Places" in site nav.

## CMS

- **`/api/revalidate`** — POST endpoint for on-demand ISR cache purge. Called by gatherstudio.app CMS admin after every content save. Requires `x-revalidate-secret: <CMS_ADMIN_TOKEN>` header. Returns `{revalidated: true}` on success.

## Content

- **Broken Ground (Essays)** — MDX-driven at `/essays/[slug]`. Nav label "Broken Ground", URL stays `/essays/`. Frontmatter: `title`, `date`, `image`, `imageCaption`, `audioUrl`, `videoUrl`, `youtubeUrl`, `audioDuration`, `excerpt`, `published`, `featured`, `unlisted`, `related`, `cardImage`, `merchImage`, `merchUrl`
- **Profiles** — MDX-driven at `/profiles/[slug]`. Frontmatter: `title`, `slug`, `published`, `listed`, `aiWritten`, `date`, `excerpt`, `image`. `listed:false` = live URL but excluded from index, sitemap, and search. `aiWritten` flag for editorial tracking.
- **Unlisted profile support** — `getServableProfiles()` returns all published profiles (routable); `getAllProfiles()` returns only `listed:true` (shown in index/search/sitemap)
- **Search** — full-text search across essays + profiles
- **Sitemap + robots.txt** — auto-generated

## Media

- **AudioPlayer** — custom scrubber player; auto-renders when `audioUrl` in frontmatter
- **VideoPlayer** — native `<video>` embed; fallback when `videoUrl` present but no `youtubeUrl`
- **YouTube-first video** — essay page prefers `youtubeUrl` frontmatter for the video slot (renders VideoEmbed); falls back to VideoPlayer for blob URLs
- **VideoEmbed** — YouTube / Vimeo iframe embed (lazy-loaded via IntersectionObserver)
- **VideoLoop** — looping silent background video
- **PhotoStrip** — horizontal photo strip component

## Podcast

- **RSS feed** at `/podcast.xml` — itunes-compatible; pulls all essays + profiles with `audioUrl` or `videoUrl`
- **Video podcast support** — `videoUrl` frontmatter → `video/mp4` enclosure (Spotify video); `audioUrl` only → `audio/mpeg`. Episode links in RSS point to `/essays/[slug]`.
- **JournalCard photo layout** — when `image` or `heroImage` present in frontmatter, renders 16:9 photo card; text-only fallback otherwise
- **Blob store** — `southern-legends-blob` (Vercel Blob, public, IAD1) for audio and video assets

## Storage

- **Vercel Blob** — store ID `store_F46wkKj98GIsW4TA`; public bucket; `BLOB_READ_WRITE_TOKEN` in project env
- **Upload script** — `scripts/upload-blob.mjs` — `BLOB_READ_WRITE_TOKEN=xxx node scripts/upload-blob.mjs <file> <pathname>`

## Newsletter Capture — added 2026-06-14
- **Component:** `src/app/components/NewsletterCapture.tsx` — email-only, dark bg (#1C1917), rust accent (#C4622D)
- **Route:** `POST /api/newsletter/subscribe` — adds to Resend audience `bc84e16a-40ed-4e6b-bc6e-1396bcb83a92`; sends welcome email + Matt notification
- **Magazine waitlist flag:** `magazine_waitlist: true` in POST body → notification email tagged "magazine waitlist ✓"
- **Placement:** Homepage (replaces SubscribeCTA) + bottom of every profile page
- **Copy:** "Subscribe and get SL Magazine Issue 1 free when it drops this fall."

## Email Drip Sequences (added 2026-07-18)

- **Day 0:** Welcome email fires on subscribe (existing)
- **Day 3:** Noble Street series intro — `api/drip/day-3/route.ts`. Scheduled via Resend `scheduledAt` from subscribe route.
- **Day 7:** $4.99 Reader pitch — `api/drip/day-7/route.ts`. Scheduled via Resend `scheduledAt` from subscribe route.
- No separate cron needed — Resend handles delivery timing.

## Business Blurbs (added 2026-07-18)

- `content/businesses/[slug].mdx` — 80-word Haiku-generated blurbs for AL businesses from `gather_circle_members`
- Auto-generated nightly at 2am via `tools/sl-business-blurbs.py` (`com.headley.sl-business-blurbs`)
- Batch: 20/night. Auto-deploys every 500 files. 5 initial blurbs seeded.
- `published: true, unlisted: false` — appear in site but not featured

## Business Directory

- `/businesses` — Alabama business directory index (6,818 businesses)
- `/businesses/anniston` — 210 Anniston businesses from Circle DB + profiled stories + LocalBusiness JSON-LD
- `/businesses/calhoun-county` — 457 businesses across 11 Calhoun County cities + ItemList JSON-LD
- `/businesses/[city]` — dynamic city route using content/businesses/*.mdx
- `/contributors` — profiles grid + Person JSON-LD + nominate CTA

## Other Routes

- `/profiles/feed.xml` — profiles RSS
- `/api/content-feed` — content API
- `/api/youtube-stats` — YouTube view/like counts for VideoEmbed
- `/podcast.xml` — podcast RSS (essays + profiles, audio + video)
- `/subscribe` — email signup (Supabase)
- `/api/newsletter/subscribe` — newsletter subscribe → Resend audience bc84e16a
- `/support`, `/colophon`, `/about`, `/search`

## Deploy

- GitHub → Vercel auto-deploy (push = deploy)
- Project: `southern-legends` (`prj_o78QHj3ziy62Rgg1yZnGFt202VQd`)
- Live: southernlegends.blog
- Email from address updated to noreply@gatherstudio.app (was noreply@plainspokenblueprint.com)

## Sponsorship (2026-07-27)
- `/sponsor` — sponsor page with tier info and Stripe checkout
- `/api/sponsorship/checkout` — Stripe inline price_data checkout for sponsorship tiers
- `SponsoredBadge` component — badge shown on sponsored content

## /merch (2026-07-26)
- 6 shirts: PV Raiders XC, Survived Woodstock, Anniston 45yr, SL Run, Raider Road Runners, CLT Trail
- 4 stickers: SL, Raiders, Woodstock, CLT — $4 each
- Cart checkout with Stripe inline price_data
- Bundle deal: 3+ shirts = 20% off
- Team pricing: $25/shirt via checkbox
- Pre-order: ships 2–3 weeks after Woodstock 5K (Aug 2)
- 25% of PV Raiders XC sales donated to XC program

## /trails (2026-07-27)
- `/trails` — trail index: 7 regional trails (CLT, Silver Comet, Coldwater, Pinhoti, Cheaha, Oxford Lake, Choccolocco Greenway)
- `/trails/[slug]` — individual trail page: full profile, highlights, difficulty stats, AllTrails link
- Star ratings with avg + review count in hero
- Review submission form: rating, conditions, difficulty felt, date hiked → Supabase (approved=false)
- CLT support widget: Stripe checkout passthrough, $10/$25/$50/$100 tiers, 15% SL platform fee (85% to CLT), disclosed to donor
- Sponsor slot on every trail page: $75/mo
- `/api/trails/review` — GET (approved reviews by slug) + POST (submit review)
- `/api/trails/support` — Stripe checkout for CLT donations
- Supabase: `trail_reviews` + `trail_support` tables
- `src/lib/trails.ts` — typed trail data, helper fns
- Trails added to SectionLinks nav
- Daily trail scraper: `tools/trail-scraper.py` runs at 7:15am, SMS summary
- `/api/trails/news` — serves trail news from scraper JSON, filterable by slug
- Trail news section on detail pages (shows when scraper finds items)
- `/admin/trail-reviews` — approve/reject/delete reviews, PIN-gated
- `/api/admin/trail-reviews` — GET/PATCH/DELETE for review moderation
- Stripe webhook updated: logs trail_support donations to Supabase on checkout.session.completed

## 2026-07-28 — CLT Trail Page Full Build
- CLT founding backer section (Kickstarter-style, 4 tiers $10/$25/$100/$500)
  - Backer email capture → /api/subscribe + Stripe checkout in one click
- "From the Journal" section (chief-ladiga-trail + the-trail-at-night essays)
- Trail gear / merch section (hat $32, la-dee-ga tee $28, sticker $5) → trails/support Stripe
- Products section:
  - La-dee-ga Chapbook $4.99 (3 essays, instant PDF)
  - CLT Conditions Reporter (trail SaaS, notify-me email capture for interest list)
- All CLT sections gate on `trail.slug === "chief-ladiga-trail"` — safe for other trails

## 2026-08-05 — Masthead + Deepgram TTS
- /masthead — editorial statement, contributor grid (8 contributors), per-contributor record modal with webcam + teleprompter overlay
- /api/masthead/speak — Deepgram TTS proxy (aura-asteria-en); "Listen" button on editorial statement
- Camera device selector on masthead (DSLR-ready via HDMI capture card)
- Links to ReelStudio /dialogue for full podcast dialogue mode
