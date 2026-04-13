# Southern Legends — Project Instructions

## What This Is
Editorial / storytelling site profiling small business owners and makers in Northeast Alabama. Not a client site — this is a personal/portfolio project by Matt Headley. Content-driven, MDX-based, magazine-style presentation.

**Editorial lens:** Matt lost a farm and now builds websites for local businesses. The work keeps putting him across the table from people who are still building — and he notices them because of what he lost. The question underneath every profile isn't "what does this person do?" but "what kept them going?" — asked by someone who wanted to keep going and couldn't. Never frame subjects as inspiring, never flatten the complexity into feel-good narrative. Full context in `content/AUTHENTIC-VOICE-GUIDE.md` under "Why This Site Exists."

## Stack
- **Next.js 16** (App Router, `src/` directory)
- **Tailwind v4** (via `@tailwindcss/postcss`)
- **MDX** via `next-mdx-remote` + `gray-matter` + `reading-time`
- **Fonts:** Fraunces (headings), Rock Salt (accent/pull quotes), Source Sans 3 (body via `next/font/google`)
- **Deploy target:** Vercel

## Design System — "Parchment & Pine"
Palette and tokens are in `src/app/globals.css`:
- Primary: `#9A3412` (burnt sienna) — CTAs, links, nav accent
- Accent: `#CA8A04` (gold) — tags, quote marks, dividers
- Dark: `#292524` — headings, hero backgrounds
- Light: `#FAFAF7` — page background
- Warm: `#F0EDE6` — section backgrounds, blockquote bg

Design exploration files (HTML, not part of the app — reference only):
- `font-preview.html`, `font-preview-2.html`, `font-preview-3.html`
- `color-swatches.html`, `texture-preview.html`, `design-decisions.html`

## Architecture

```
src/
  app/
    layout.tsx          — root layout (nav, footer, scroll reveal, skip link)
    page.tsx            — homepage (hero, latest stories grid, about teaser)
    globals.css         — full design system + component styles
    about/page.tsx      — about page
    profiles/
      page.tsx          — all stories listing
      [slug]/page.tsx   — individual profile (MDX rendering)
      feed.xml/route.ts — RSS feed
    components/
      Nav.tsx           — site navigation
      Footer.tsx        — site footer
      ProfileCard.tsx   — story card for grids
      PullQuote.tsx     — Rock Salt accent quotes
      ScrollReveal.tsx  — IntersectionObserver scroll animations
      ShareButtons.tsx  — social sharing
      StoryNav.tsx      — prev/next story navigation
      SubscribeCTA.tsx  — email subscribe block
  lib/
    profiles.ts         — MDX content loader (reads content/profiles/*.mdx)
    site-config.ts      — site metadata, nav links
content/
  profiles/             — MDX story files (21 profiles, see below)
  AUTHENTIC-VOICE-GUIDE.md — writing voice reference
```

## Content Model
Each profile is an `.mdx` file in `content/profiles/` with frontmatter (title, slug, category, location, excerpt, date, etc.) and long-form narrative content. Profiles use the `PullQuote` component for Rock Salt accent quotes.

## Content Status
- **Matt's writing:** `matt-headley.mdx` — Matt's own profile, written by Matt. This is the voice baseline for the site.
- **AI-written profiles (20):** All other profiles were written entirely by Claude and tagged `aiWritten: true` in frontmatter. Do NOT reference these as examples of Matt's voice. They need Matt's review and proofing before being treated as final. Consider them drafts until Matt removes the `aiWritten` flag.
- **Fake sample profiles deleted:** Earl McKinney, Jimmy Dawson, Mae Ruth Foster were fictional — removed.

## Writing Workflow
- **Voice guide:** `content/AUTHENTIC-VOICE-GUIDE.md` — reference for all writing on this site.
- **Storytelling framework:** `STORYTELLING-FRAMEWORK.md` — StoryBrand/Lowry Loop frameworks, three-tier personal story arc, Patreon philosophy.
- **Platform strategy:** `STRATEGY.md` — three-platform architecture, Patreon content plan, syndication order of operations, byline examples, action items.
- **Publishing plan:** `PUBLISHING-PLAN.md` — publishing sequence (SL → Anniston Star → Calhoun Journal), byline strategy, Donna Barton reconnection pitch, immediate next steps.
- **Two-draft rule:** Matt writes first draft. Claude acts as editor with specific questions. Claude never writes openings, endings, or vulnerable passages.
- **Gap audit (runs before scaffold):** When Matt brings in raw material — voice chat, transcript, notes — run a gap audit before touching the draft. For each scene implied by the material, check three criteria: (1) time/place anchor, (2) first sensory hit when entering a space or moment, (3) specific visual of the key person. Ask one question per gap, one at a time. Wait for Matt's answer before asking the next. Only write the scaffold once the gaps are filled.
- **Voice baseline:** Read `matt-headley.mdx` before helping with any new profile writing.
- **AI kill list:** Avoid words/patterns in Part 5 of the voice guide (delve, foster, leverage, tapestry, etc.)
- **Narrator vs. protagonist:** Matt writes in first person, but the subject must be the main character, not Matt. For business profiles: one personal connection sentence up front (e.g., "Sam is my friend"), then make it about them. Matt's personal stories belong in interview questions that draw out the subject's answers, not in the narrative body. Test: if you removed every sentence about Matt, does the profile still stand? If it collapses, Matt is too centered. Place/nonprofit profiles have more room for Matt's presence when his proximity IS the argument (e.g., Freedom Riders — "my kids were born at the same hospital").

## Personal Writing Section (Planned — name TBD)

Matt's personal writing and curated media live in a dedicated section — separate from profiles. Name is between **"Letters"** (fits the epistolary essay voice, Patreon posts opened "Dear friends") and **"Notes"** or **"Journal"** (fits the expanded multimedia content model better). Decide before building.

**Why this lives on SL (not a separate site, not Patreon):**
SL is the right home because the personal writing isn't separate from the editorial project — it's the explanation for why it exists. The profiles raise the question: why does this person notice these people so carefully? The personal section answers it. Model: The Marginalian (everything on one owned platform), The Bitter Southerner (author voice lives alongside journalism). See design-inspiration-editorial.md.

**Editorial distinction:** Profiles are about other people. This section is about Matt — healing, the farm, bipolar diagnosis, SL as part of recovery. Do not mix them in the same grid or card layout.

**Content model — richer than essays alone:**
- Long-form personal essays (gold star, reintroduction, UAB arc)
- Curated multimedia — music, art, video from other artists (the "Today's Anthem" pattern from Patreon posts)
- Old sermons (audio)
- Podcast episode(s)
- Matt's own photos, candid and personal
- Shorter reflections

MDX files in `content/letters/` (or `content/notes/` depending on name). Frontmatter: title, slug, date, excerpt, optional featuredMedia type.

**Components needed:**
- Audio player (sermons, podcast)
- Video embed (YouTube, Vimeo)
- Music embed (Spotify, SoundCloud, Bandcamp)
- ArtCredit (image + attribution for other artists' work)
- SongCard ("Today's Anthem" pattern)

**Portfolio value:** Building clean multimedia handling in Next.js (lazy loading, no layout shift, proper aspect ratios) is a real Headley Web skill. Clients ask for this. SL is the live demo.

**Site architecture:**
- `/letters` (or `/notes`) — dedicated page, own layout. Cards with photo, title, date, excerpt — warmer and more personal than profile cards. Warm background (`#F0EDE6`) to signal different space.
- **Homepage** — quiet callout below the profiles grid. Not a full section.
- **Nav** — distinct nav link alongside profiles.

**Distribution:** Full content on SL (canonical, source of truth). Post to Facebook and LinkedIn for reach. Patreon is being wound down — message 4 paying supporters personally before closing.

**Paid tier:** Stripe gating added after writing habit is proven (3–4 pieces live). Not before. Resend email delivery wired after same trigger.

## Current Status
- **Done:** Design system, layout, homepage, about page, profile detail page, profile listing, 21 profiles (1 by Matt, 20 AI drafts), RSS feed, scroll animations, share buttons, story navigation, subscribe CTA
- **Fonts loaded via `<link>` in layout.tsx** — Fraunces and Rock Salt are Google Fonts links, not `next/font`. Source Sans 3 uses `next/font/google`. Consider migrating Fraunces/Rock Salt to `next/font` for performance.

## OG Images
- **Manual OG (preferred):** Open `og-preview.html`, edit title/name/image/position, screenshot at 1200x630, save to `public/images/social/{slug}-og.png`. The site auto-detects and uses it.
- **Satori fallback:** `src/app/profiles/[slug]/opengraph-image.tsx` auto-generates for profiles without a manual screenshot.
- **Detection:** `generateMetadata` in `page.tsx` checks if `public/images/social/{slug}-og.png` exists. If yes, uses it. If no, Satori kicks in.

## Build Rules
- Follow global CLAUDE.md standards (next/image, WebP, contrast checks, etc.)
- No daisyUI — pure Tailwind + custom CSS
- MDX content lives in `content/profiles/`, not in `src/`
- CSS goes in `globals.css` — no inline `<style>` blocks
- Use `var(--font-heading)` / `var(--font-accent)` / `var(--font-body)` — don't hardcode font names in components
- Use design token color classes (`text-ll-dark`, `bg-ll-primary`, etc.) — don't hardcode hex values in components
