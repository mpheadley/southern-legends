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
- **Two-draft rule:** Matt writes first draft. Claude acts as editor with specific questions. Claude never writes openings, endings, or vulnerable passages.
- **Voice baseline:** Read `matt-headley.mdx` before helping with any new profile writing.
- **AI kill list:** Avoid words/patterns in Part 5 of the voice guide (delve, foster, leverage, tapestry, etc.)
- **Narrator vs. protagonist:** Matt writes in first person, but the subject must be the main character, not Matt. For business profiles: one personal connection sentence up front (e.g., "Sam is my friend"), then make it about them. Matt's personal stories belong in interview questions that draw out the subject's answers, not in the narrative body. Test: if you removed every sentence about Matt, does the profile still stand? If it collapses, Matt is too centered. Place/nonprofit profiles have more room for Matt's presence when his proximity IS the argument (e.g., Freedom Riders — "my kids were born at the same hospital").

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
