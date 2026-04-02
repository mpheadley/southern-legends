# Southern Legends — Build Plan

> Editorial site profiling small business owners, makers, and notable places in Northeast Alabama's Appalachian foothills.
> Personal/portfolio project by Matt Headley. Not a client site.

---

## Current Status

### Done
- [x] Design system — "Parchment & Pine" palette, CSS tokens in globals.css
- [x] Font exploration — Fraunces (headings), Rock Salt (accent), Source Sans 3 (body)
- [x] Fonts migrated to `next/font/google` (no render-blocking `<link>` tags)
- [x] Root layout — Nav, Footer, ScrollReveal, skip link
- [x] Homepage — hero, latest stories grid, about teaser section
- [x] About page — headshot, Headley Web attribution, topo texture hero
- [x] Profile detail page — MDX rendering, custom components, TL;DR block, share buttons, story nav (prev/next)
- [x] Profile listing page (`/profiles`) with tag filtering via query params
- [x] MDX content pipeline — `next-mdx-remote` + `gray-matter` + `reading-time`
- [x] 3 fictional sample profiles (Earl McKinney, Jimmy Dawson, Mae Ruth Foster) — removed pre-launch, in git history
- [x] PullQuotes added to all 3 sample profiles
- [x] RSS feed (`/profiles/feed.xml`)
- [x] Scroll reveal animations (IntersectionObserver)
- [x] SEO — `generateMetadata` per profile, Article + BreadcrumbList JSON-LD, speakable TL;DR, canonical URLs, OG/Twitter tags
- [x] Components — ProfileCard, PullQuote (Rock Salt + letter reveal), ShareButtons, StoryNav, SubscribeCTA
- [x] Project CLAUDE.md for token-efficient sessions
- [x] Design exploration files — font previews, color swatches, texture preview, design decisions (HTML reference files, not part of app)
- [x] Typography-driven visual system (see Phase 1 below)
- [x] Topo texture overlays on all dark sections (hero, footer, stories listing, about, 404)
- [x] Fix font variable scoping (next/font class vars on `<body>`, not `:root`)
- [x] Fix heading contrast (global h1-h6 color override removed)
- [x] Fix ShareButtons hydration mismatch (use `siteConfig.url` instead of `window.location`)
- [x] `robots.ts` — auto-generated from `site-config.ts`
- [x] `sitemap.ts` — auto-generated from profile slugs + static pages
- [x] `not-found.tsx` — custom 404 with noindex, topo texture, "Wrong trail, friend."
- [x] Location hero images copied from headleyweb (`public/images/locations/`)
- [x] Texture images copied from headleyweb (`public/images/textures/`)
- [x] About page images — headshot + family photo (`public/images/about/`)
- [x] Fictional profiles removed pre-launch (Earl, Jimmy, Mae Ruth) — in git history
- [x] 4 real profiles published (Anniston Museums, JCOC, Interfaith Ministries, Matt Headley)
- [x] GitHub repo pushed (mpheadley/southern-legends, public)
- [x] OG image designed — forest green→gold gradient + topo + Fraunces/Rock Salt (`og-preview.html`)
- [x] Gradient hero (`.gradient-hero`) applied sitewide — replaces flat `bg-ll-dark` on all dark sections
- [x] `--gradient-pine` token + forest green `#3D6B4F` added to design system
- [x] Matt Headley personal profile — first-person, cross-links to headleyweb blog draft
- [x] Patreon monetization plan added (Phase 7)
- [x] Distribution checklist + cross-promotion strategy added (Phase 6)
- [x] `og-preview.html` pattern added to nextjs-starter-kit PLAN.md

### Next Up
- [ ] Deploy to Vercel + buy domain (locallegends.com / locallegendsal.com / neallegends.com)
- [ ] Submit to Google Search Console after deploy
- [ ] Update cross-link URLs in matt-headley.mdx and headleyweb blog draft once domain is live
- [ ] Screenshot OG image from og-preview.html and wire into site metadata
- [ ] Add "Places" category color to design system
- [ ] Mobile QA pass — verify gradient hero and typography on small screens
- [ ] Flesh out headleyweb blog draft `why-i-build-for-local-businesses.mdx`
- [ ] Write more place profiles (Noccalula Falls, Little River Canyon, Cheaha, covered bridges, Janney Furnace, etc.)
- [ ] Add "Places" category + launch content strategy (see Phase 3)

---

## Phase 1 — Visual Strategy (no photography)

The site uses **typography as the primary visual element** instead of stock photos. Decisions finalized via `typography-options-preview.html`:

- **Profile Cards:** Oversized initial — category-colored background + giant semi-transparent Fraunces first letter + name overlay + paper grain texture. Falls back gracefully when `heroImage` exists.
- **Homepage Hero:** Large editorial type — Fraunces at `text-5xl md:text-7xl lg:text-8xl`, gold accent divider bar, topo texture on dark background.
- **Profile Detail Hero:** Typographic hero with ghost initial — giant 4% opacity Fraunces first letter anchored bottom-right, topo texture, `overflow-hidden` to contain.
- **Texture:** Topo contour line overlay (`topo-7.png`) via `.topo-texture` class — `opacity: 0.35`, `filter: invert(1)`, `mix-blend-mode: soft-light` on dark backgrounds. Also `.topo-texture-light` variant at `opacity: 0.06` for light sections.
- **AI Images:** No AI images — typography only. Authentic photography will come later from real shoots.
- **Category Colors:** Craftspeople=#9A3412, Food=#CA8A04, Music=#6B4C8A, Agriculture=#3D6B4F, Places=TBD

### Tasks
- [x] Define the no-photo visual system (typography, color blocks, texture)
- [x] Update ProfileCard component — oversized initial fallback with category colors
- [x] Update profile detail hero — ghost initial typographic treatment
- [x] Homepage hero — large editorial Fraunces type with accent divider
- [x] Add CSS for card-initial, ghost-initial, paper-grain, category colors
- [x] Topo texture overlay on all dark sections
- [ ] Add "Places" category color to design system
- [ ] Test on mobile — ensure typographic layouts hold at small sizes

---

## Phase 2 — Infrastructure

- [x] `robots.ts` — auto-generated from `site-config.ts`
- [x] `sitemap.ts` — auto-generated from profile slugs + static pages
- [x] `not-found.tsx` — custom 404 with noindex, on-brand design
- [ ] `apple-touch-icon.png` — needs Southern Legends-branded icon designed
- [x] OG image — typography-only: forest green→gold gradient + topo + Fraunces/Rock Salt (`og-preview.html`). Photo version deferred — CC-licensed Cheaha photo rejected (ShareAlike license). Shoot own photo later.
- [ ] Security headers in `next.config.ts`
- [ ] `<!-- Built by Headley Web & SEO | headleyweb.com -->` HTML comment in layout.tsx

---

## Foothills / Appalachian Identity Strategy

The MDX content references "southern Appalachian foothills," "Dugger Mountain," "ridgeline above Cheaha State Park," and "Appalachian craftspeople" — but the site chrome (homepage, about, heroes) only says "Northeast Alabama" without ever mentioning foothills or Appalachian.

### Why add "Appalachian foothills" language
- Stronger sense-of-place than "Northeast Alabama" alone
- Searchable — people search "Appalachian Alabama," "foothills Alabama," etc.
- Connects the site's identity to the land, not just the geography
- The topo texture, earthy palette, and Parchment & Pine design system already evoke this — the copy should match

### OG image
- Appalachian foothills landscape (green ridgelines, morning fog, layered mountains) with "Southern Legends" typeset in Fraunces
- Shoot near Cheaha State Park or Little River Canyon — your own photo, not stock
- 1200x630 for social sharing
- This becomes the default OG image for pages without their own

### Tasks
- [ ] Weave "Appalachian foothills" language into homepage hero/tagline and About page copy
- [ ] Shoot or source a foothills photo for OG image (Cheaha, Little River Canyon, etc.)
- [ ] Create branded OG image: foothills photo + Fraunces "Southern Legends" overlay
- [ ] Consider foothills photo as subtle background on About page or "Why Southern Legends?" section

---

## Headley Web & SEO — Cross-promotion Strategy

Southern Legends should support Headley Web as a portfolio piece and authority builder.

### What's in place
- Footer on every page: "A community project by Headley Web & SEO" → headleyweb.com
- About page: name, headshot, link to headleyweb.com, matt@headleyweb.com
- JSON-LD: `author.url` → headleyweb.com on WebSite schema and every Article schema

### Still to do
- [ ] Add `<!-- Built by Headley Web & SEO | headleyweb.com -->` HTML comment in layout.tsx source
- [ ] Add second Headley Web mention at bottom of About page (after "Know a Local Legend?" section) — subtle line: "Southern Legends is built and maintained by Headley Web & SEO"
- [ ] Add Southern Legends as case study on headleyweb.com (creates backlink loop)
- [ ] Cookie banner + GA4 analytics (when ready) — modeled after headleyweb's `CookieBanner.tsx` + `Analytics.tsx`

---

## Phase 3 — Content

The 3 existing profiles are fictional (Earl McKinney, Jimmy Dawson, Mae Ruth Foster). They serve as content model examples and design references.

### Launch Content Strategy
Start with **places** instead of (or alongside) business profiles for launch:
- Matt can write these immediately using personal stories and personal photos — no coordination with business owners needed
- Places like Noccalula Falls, Little River Canyon, covered bridges have built-in local search traffic
- Frame as personal narratives, not travel guides — "the falls where my grandfather taught me to fish" not "Noccalula Falls: Hours & Admission"
- The editorial voice fits: these are stories about *what places mean*, not tourism info
- Mix: 2-3 place stories for launch, layer in business/maker profiles as relationships develop
- The `name` field in frontmatter works for both people and places
- Need a "Places" category with its own color in the design system
- Location hero images already available: Anniston, Centre, Gadsden, Jacksonville, Oxford, Talladega (from headleyweb)

### Content Tasks
- [x] Remove fictional profiles (Earl, Jimmy, Mae Ruth) — deleted, recoverable from git history
- [ ] Write 2-3 real place stories (Noccalula Falls, Little River Canyon, etc.) with personal photos
- [x] Anniston Museum of Natural History & Longleaf Botanical Gardens — published
- [x] Jacksonville Christian Outreach Center — published
- [x] Interfaith Ministries of Calhoun County — published (expanded with researched programs, First UMC connection)
- [x] Freedom Riders National Monument — published
- [x] Coldwater Mountain — published
- [x] The Peerless Saloon & Grille — published
- [x] Chief Ladiga Trail + Piedmont trail town — published
- [x] Noccalula Falls — published
- [ ] Little River Canyon — "canyon in Alabama" curiosity hook
- [x] Cheaha State Park — published
- [x] Covered bridges (Coldwater, Horton Mill, Swann, Easley) — published
- [x] Janney Furnace — published
- [x] WaldenFARMacy (Trevor & Joanna Mann) — published (permaculture mentors, personal connection)
- [x] Weaver, Alabama — published (seven years pastoring, personal connection)
- [x] JSU Music & Theater — published (alma mater, B.A. Music, drama minor)
- [x] Shepherd's Table breakfast ministry — published (Anniston First UMC, personal connection)
- [x] Pleasant Valley — published (current home, Heather's roots)
- [ ] The Depot or downtown square in Jacksonville — small-town character piece
- [ ] Calhoun County Farmers Market — seasonal, connects to Agriculture category
- [ ] A long-running local barbershop or diner (30+ years) — when identified
- [ ] Add "Places" category to frontmatter options and category color map
- [ ] **Indigo Ridge Farms** — regenerative farm, pasture-raised meat, grass-finished beef. Family gave Headleys a farm tour, shared meat, encouraged us during flower farm. **Priority: HIGH mission, MEDIUM business.** Great Agriculture category story (regenerative philosophy, family generosity, land stewardship). Website rebuild is possible long-term play but small farm budget — write profile first, let business side develop organically. Website: indigoridgefarms.com (Eat From Farms template, undersells their story). CRM #97.
- [ ] **Will Clay (LaPlante Faulkner)** — attorney, former high school classmate. **Priority: MEDIUM-HIGH mission, HIGH business.** Progressive attorney, plays rugby, competitive (banged up a judge in a basketball game), mutual friends, Facebook friends, donated to Matt's birthday fundraiser. Profile angle: Will is the subject, firm is context — why does a progressive rugby-playing attorney put his name on a building in Anniston instead of heading to Birmingham or Atlanta? **Requires interview** — message on Facebook, buy him coffee. Don't draft before talking to him. Write after Indigo Ridge. CRM #23.
- [ ] Write real business/maker profiles as relationships develop
- [ ] Nomination form or process — the "Know a Local Legend?" CTA currently links to `/about`
- [ ] Categories to cover: craftspeople, food/restaurants, music, agriculture, places, retail, services
- [ ] Optimize location images >100KB (gadsden-hero 439KB, oxford-hero 157KB, talladega-courthouse 276KB, etc.)

---

## Phase 4 — Polish & Features

- [ ] **Rotating homepage hero** — auto-cycling featured stories, Bitter Southerner-style. Cross-fade between 3 stories, auto-advance every 5-6s, pause on hover, respects `prefers-reduced-motion`. **Trigger: 6-8 published profiles.** At fewer stories, a static single-featured hero is cleaner. Implementation: mark top stories with `featured: true` (already in frontmatter), update homepage to rotate among them client-side. Accessibility: pause on focus, ARIA live region for screen readers.
- [ ] Subscribe CTA — wire to an actual service (Buttondown, ConvertKit, Substack) or remove
- [ ] Tag/category pages — `/profiles?tag=Craftspeople` works via query params; consider dedicated `/category/[slug]` routes if content grows
- [ ] Search — not needed at launch, consider when >10 profiles
- [ ] Mobile QA pass — nav, cards, profile pages, typography scaling
- [ ] Lighthouse audit — target 90+ all categories
- [ ] Contrast check — verify all text/background combos pass 4.5:1
- [ ] `prefers-reduced-motion` — verify all animations respect it (already in CSS, confirm JS behavior)

---

## Phase 5 — Deploy

- [x] Push to GitHub (mpheadley/southern-legends, public)
- [ ] Deploy to Vercel
- [ ] Domain — buy through Vercel (locallegends.com? locallegendsal.com? neallegends.com?)
- [ ] Verify OG tags render correctly (use og-preview tools)
- [ ] Submit to Google Search Console
- [ ] Add to headleyweb.com portfolio as case study

---

## Phase 6 — Growth (post-launch)

- [ ] Real photography — shoot or collect photos as profiles are written
- [ ] Update visual system to blend typography + photography as images become available
- [ ] Community nominations — formalize the nomination flow
- [ ] Cookie banner + GA4 analytics — model after headleyweb's consent-first approach
- [ ] Track profile views, nomination clicks, subscribe conversions

### Distribution — Per-Profile Checklist

Every time a new profile is published, run through this list:

- [ ] **Facebook** — share to personal feed + Calhoun County / NE Alabama community groups. Write a 2-3 sentence hook, not just a link. Example: "Most people in Anniston have no idea what's inside the museum on Highway 431. I wrote about it:"
- [ ] **Instagram** — post a photo or typographic card with a teaser excerpt. Link in bio to the profile. Stories for quick reach, Reels if there's video content.
- [ ] **Tag the subject** — if the profile is about a business, nonprofit, or place with a social presence, tag them. They share it = free reach to their audience.
- [ ] **Email list** — when subscribe CTA is wired up, every new profile goes to the list. "New story: [title]" with excerpt + link.
- [ ] **Google Business Profile** — post a short update with a link (if Southern Legends has a GBP).
- [ ] **Cross-post to headleyweb.com** — share as a GBP post or social post from the Headley Web accounts when relevant. Positions Matt as embedded in the local community.

### Distribution — Milestone Pushes

These happen at key content thresholds, not per-profile:

- [ ] **At 5 real profiles:** Share the site itself (not just a single profile) in Facebook groups. "I've been writing stories about people and places in NE Alabama. Here's the site."
- [ ] **At 10 profiles:** Pitch to local media — Anniston Star, Jacksonville News, JSU student paper. "Local web designer launches community storytelling project."
- [ ] **When a profile features a business:** Send the business owner the link + a ready-to-share social graphic. Make it easy for them to post it.
- [ ] **Seasonal hooks:** Tie profiles to seasons ("5 places to visit this fall in NE Alabama" roundup post linking to individual profiles). Share roundups on social for re-engagement.

### Cross-Promotion with Headley Web

> See also: `headleyweb-rebuild/BLOG_POST_PLAN.md` — several posts directly reference Southern Legends.

- [ ] **Blog post #10c** ("5 Local Businesses in Anniston Crushing It Online") — feature Southern Legends subjects where relevant. Backlink loop: headleyweb post → Southern Legends profile → headleyweb footer link.
- [ ] **Blog post #25** ("I Built a Local Storytelling Site...") — the Southern Legends case study for headleyweb. Write when the site has enough real content to showcase.
- [ ] **Roundup posts (#6-10)** — when a business featured in a headleyweb roundup also has a Southern Legends profile, link between them.
- [ ] **Keep the editorial line clear:** Southern Legends profiles are narrative — no CTAs, no sales pitch. Headleyweb blog posts have CTAs and target keywords. The sites serve different purposes and the tone should never bleed.

### Publication Pitching

> **Trigger:** 5+ polished, published profiles on the live domain. No editor will click a Vercel preview URL.

Pitch targets (in order of fit):
1. **The Bitter Southerner** — closest editorial match. Personal, place-based, long-form Southern storytelling. Contributed pieces.
2. **Reckon** (AL.com's editorial arm) — Alabama-specific storytelling
3. **Scalawag** — Southern culture and community
4. **Garden & Gun** — place profiles with strong sensory detail (Cheaha, Noccalula Falls, covered bridges)
5. **Alabama Heritage** — academic-leaning but publishes narrative nonfiction about Alabama places and people

Strategy:
- Pitch one polished profile as a standalone piece, linking back to Southern Legends for the full collection
- A publication feature linking back = massive credibility + SEO win
- This is exposure, not revenue — don't expect payment
- Proof and polish to their editorial bar before pitching

Tasks:
- [ ] Reach 5+ published profiles on live domain (trigger point)
- [ ] Research submission guidelines for each publication
- [ ] Select strongest profile for first pitch (likely a place profile — broadest appeal)
- [ ] Write pitch email with link to published piece
- [ ] Track pitches and responses

---

## Phase 7 — Monetization: Patreon

> **Trigger:** Launch when Southern Legends has 10+ published profiles AND visible social engagement (200-300+ engaged followers in local Facebook groups counts).

### Why Patreon fits Southern Legends (but not Headley Web)
- Southern Legends is a **community content project**, not a service business — exactly what Patreon is built for.
- The pitch: *"Help me tell the stories of the people who make Northeast Alabama great."*
- Headley Web clients buy a service (audit → build → care plan). They're not patrons. Keep Patreon separate from the business.

### Who would support it
- Featured businesses and their networks (they're already invested in the project)
- Community members who care about local pride and storytelling
- Other small-town creators doing similar things in their regions
- JSU alumni, NE Alabama expats who want to stay connected

### Tier ideas
| Tier | Price | Perks |
|------|-------|-------|
| **Supporter** | $5/mo | Early access to profiles (48 hrs before public), name in credits on About page |
| **Champion** | $15/mo | Nominate a business/person to be featured, behind-the-scenes content (interview notes, photo outtakes) |
| **Sponsor** | $25/mo | Your business name on a profile page as presenting sponsor, all lower-tier perks |

### Important decisions
- **Start a new Patreon page** — don't revive the old farm/ministry page. Clean slate, clear mission, no baggage. The old page served a different chapter.
- **Keep it modest** — this isn't a revenue engine. It's a sustainability tool. Goal: cover domain, hosting, and gas money for interviews/photo shoots. If it grows beyond that, great.
- **Transparency** — mention on the Patreon page that Matt is a web designer. Same philosophy as the About page: honest about who you are, but the project isn't a sales funnel.

### Tasks
- [ ] Reach 10+ published profiles (trigger point)
- [ ] Create new Patreon page for Southern Legends (not the old farm/ministry page)
- [ ] Design tier structure and perks
- [ ] Add "Support Southern Legends" link in footer and About page (only after Patreon is live)
- [ ] Create a patron credits section on the About page
- [ ] Announce via per-profile distribution channels (Facebook, email list, Instagram)

---

## Architecture Notes

```
Content model:
  content/profiles/*.mdx → frontmatter + long-form narrative
  Frontmatter: title, name, location, category, tags[], date, excerpt, tldr, heroImage, heroAlt, published

Routes:
  /                    — homepage (latest profiles + about teaser)
  /profiles            — all profiles listing (filterable by tag)
  /profiles/[slug]     — individual profile
  /profiles/feed.xml   — RSS feed
  /about               — about the project
  /not-found           — custom 404

Components:
  Layout: Nav, Footer, ScrollReveal
  Content: ProfileCard, PullQuote, ShareButtons, StoryNav, SubscribeCTA
  MDX: custom h2/h3/p/a/ul/ol/li/blockquote/strong/hr + PullQuote

Images:
  public/images/locations/  — city/town hero images (from headleyweb)
  public/images/textures/   — wood/timber textures (from headleyweb)
  public/images/about/      — headshot, family photo
  public/topo-7.png         — topo contour line pattern for dark section overlays
```
