# Local Legends — Build Plan

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

### In Progress
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
- [ ] `apple-touch-icon.png` — needs Local Legends-branded icon designed
- [ ] OG image — Appalachian foothills photo + "Local Legends" in Fraunces (see Foothills Strategy below)
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
- Appalachian foothills landscape (green ridgelines, morning fog, layered mountains) with "Local Legends" typeset in Fraunces
- Shoot near Cheaha State Park or Little River Canyon — your own photo, not stock
- 1200x630 for social sharing
- This becomes the default OG image for pages without their own

### Tasks
- [ ] Weave "Appalachian foothills" language into homepage hero/tagline and About page copy
- [ ] Shoot or source a foothills photo for OG image (Cheaha, Little River Canyon, etc.)
- [ ] Create branded OG image: foothills photo + Fraunces "Local Legends" overlay
- [ ] Consider foothills photo as subtle background on About page or "Why Local Legends?" section

---

## Headley Web & SEO — Cross-promotion Strategy

Local Legends should support Headley Web as a portfolio piece and authority builder.

### What's in place
- Footer on every page: "A community project by Headley Web & SEO" → headleyweb.com
- About page: name, headshot, link to headleyweb.com, matt@headleyweb.com
- JSON-LD: `author.url` → headleyweb.com on WebSite schema and every Article schema

### Still to do
- [ ] Add `<!-- Built by Headley Web & SEO | headleyweb.com -->` HTML comment in layout.tsx source
- [ ] Add second Headley Web mention at bottom of About page (after "Know a Local Legend?" section) — subtle line: "Local Legends is built and maintained by Headley Web & SEO"
- [ ] Add Local Legends as case study on headleyweb.com (creates backlink loop)
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
- [x] Interfaith Ministries of Calhoun County — published
- [ ] Noccalula Falls — personal narrative, not a travel guide
- [ ] Little River Canyon — "canyon in Alabama" curiosity hook
- [ ] Cheaha State Park — already referenced in existing profiles
- [ ] Covered bridges (Horton Mill, Swann, Easley) — iconic, photographable
- [ ] Janney Furnace — Civil War-era iron furnace in Ohatchee
- [ ] The Depot or downtown square in Jacksonville — small-town character piece
- [ ] Calhoun County Farmers Market — seasonal, connects to Agriculture category
- [ ] A long-running local barbershop or diner (30+ years) — when identified
- [ ] Add "Places" category to frontmatter options and category color map
- [ ] Write real business/maker profiles as relationships develop
- [ ] Nomination form or process — the "Know a Local Legend?" CTA currently links to `/about`
- [ ] Categories to cover: craftspeople, food/restaurants, music, agriculture, places, retail, services
- [ ] Optimize location images >100KB (gadsden-hero 439KB, oxford-hero 157KB, talladega-courthouse 276KB, etc.)

---

## Phase 4 — Polish & Features

- [ ] Subscribe CTA — wire to an actual service (Buttondown, ConvertKit, Substack) or remove
- [ ] Tag/category pages — `/profiles?tag=Craftspeople` works via query params; consider dedicated `/category/[slug]` routes if content grows
- [ ] Search — not needed at launch, consider when >10 profiles
- [ ] Mobile QA pass — nav, cards, profile pages, typography scaling
- [ ] Lighthouse audit — target 90+ all categories
- [ ] Contrast check — verify all text/background combos pass 4.5:1
- [ ] `prefers-reduced-motion` — verify all animations respect it (already in CSS, confirm JS behavior)

---

## Phase 5 — Deploy

- [ ] Push to GitHub
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
- [ ] **Google Business Profile** — post a short update with a link (if Local Legends has a GBP).
- [ ] **Cross-post to headleyweb.com** — share as a GBP post or social post from the Headley Web accounts when relevant. Positions Matt as embedded in the local community.

### Distribution — Milestone Pushes

These happen at key content thresholds, not per-profile:

- [ ] **At 5 real profiles:** Share the site itself (not just a single profile) in Facebook groups. "I've been writing stories about people and places in NE Alabama. Here's the site."
- [ ] **At 10 profiles:** Pitch to local media — Anniston Star, Jacksonville News, JSU student paper. "Local web designer launches community storytelling project."
- [ ] **When a profile features a business:** Send the business owner the link + a ready-to-share social graphic. Make it easy for them to post it.
- [ ] **Seasonal hooks:** Tie profiles to seasons ("5 places to visit this fall in NE Alabama" roundup post linking to individual profiles). Share roundups on social for re-engagement.

### Cross-Promotion with Headley Web

> See also: `headleyweb-rebuild/BLOG_POST_PLAN.md` — several posts directly reference Local Legends.

- [ ] **Blog post #10c** ("5 Local Businesses in Anniston Crushing It Online") — feature Local Legends subjects where relevant. Backlink loop: headleyweb post → Local Legends profile → headleyweb footer link.
- [ ] **Blog post #25** ("I Built a Local Storytelling Site...") — the Local Legends case study for headleyweb. Write when the site has enough real content to showcase.
- [ ] **Roundup posts (#6-10)** — when a business featured in a headleyweb roundup also has a Local Legends profile, link between them.
- [ ] **Keep the editorial line clear:** Local Legends profiles are narrative — no CTAs, no sales pitch. Headleyweb blog posts have CTAs and target keywords. The sites serve different purposes and the tone should never bleed.

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
