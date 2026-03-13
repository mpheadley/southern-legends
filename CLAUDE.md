# Local Legends — Project Instructions

## What This Is
Editorial / storytelling site profiling small business owners and makers in Northeast Alabama. Not a client site — this is a personal/portfolio project by Matt Headley. Content-driven, MDX-based, magazine-style presentation.

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
  profiles/             — MDX story files
    earl-mckinney-blacksmith.mdx
    jimmy-dawson-musician.mdx
    mae-ruth-foster-herbalist.mdx
```

## Content Model
Each profile is an `.mdx` file in `content/profiles/` with frontmatter (title, slug, category, location, excerpt, date, etc.) and long-form narrative content. Profiles use the `PullQuote` component for Rock Salt accent quotes.

## Current Status
- **Done:** Design system, layout, homepage, about page, profile detail page, profile listing, 3 sample profiles (Earl/Jimmy/Mae Ruth), RSS feed, scroll animations, share buttons, story navigation, subscribe CTA
- **Fonts loaded via `<link>` in layout.tsx** — Fraunces and Rock Salt are Google Fonts links, not `next/font`. Source Sans 3 uses `next/font/google`. Consider migrating Fraunces/Rock Salt to `next/font` for performance.

## Build Rules
- Follow global CLAUDE.md standards (next/image, WebP, contrast checks, etc.)
- No daisyUI — pure Tailwind + custom CSS
- MDX content lives in `content/profiles/`, not in `src/`
- CSS goes in `globals.css` — no inline `<style>` blocks
- Use `var(--font-heading)` / `var(--font-accent)` / `var(--font-body)` — don't hardcode font names in components
- Use design token color classes (`text-ll-dark`, `bg-ll-primary`, etc.) — don't hardcode hex values in components
