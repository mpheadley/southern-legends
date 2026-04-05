# /featured — Card-Tilt Cinematic Profile Showcase

## What
A standalone `/featured` page on Southern Legends. 5-6 handpicked profiles presented as a full-viewport, scroll-driven card-tilt sequence. Each profile flips in with 3D rotationX as the user scrolls — cinematic, fast, impressive. Not an archive, not a listing. A sizzle reel.

## Why
- **Portfolio piece** — standalone URL to screenshot/link from Headley Web. "I built this for my editorial site."
- **Shareable first impression** — the link you send when you want someone to feel the project in 15 seconds
- **Complements, doesn't replace** — homepage carousel stays (browse), profiles grid stays (archive), `/featured` is the curated experience
- **Proves the card-tilt mechanic** on a real project before pitching it to clients

## Reference
Based on `design-playground/scrollytelling-card-tilt/` — Next.js + GSAP, pinned scroll, 3D rotationX card flip transitions.

## How It Fits the Site

### What exists now
| Surface | Purpose | Change? |
|---------|---------|---------|
| Homepage hero carousel | Auto-rotating latest 4 profiles | No change |
| Homepage grid ("More Stories") | Browse all profiles | No change |
| `/profiles` listing | Full archive with tag filtering | No change |
| Individual profile pages | Long-form read | No change |
| About page | Project + Matt intro | No change |

### What's new
| Surface | Purpose |
|---------|---------|
| **`/featured`** | Cinematic card-tilt showcase of 5-6 curated profiles |

### Navigation
- Add "Featured" link in nav (between "Stories" and "About")
- Optional: "See our featured stories →" CTA on homepage below the carousel
- Optional: link from About page

## Per-Card Content
Each card fills the viewport. Content per card:

- **Background:** Profile's hero image (full bleed, dark overlay for readability)
- **Fallback:** If no hero image, use the typographic ghost-initial treatment (already in the design system)
- **Text overlay:**
  - Category tag (color-coded, top corner)
  - Profile name (Fraunces, large)
  - One-line hook / excerpt
  - Location
  - "Read the story →" link to full profile
- **Transition:** Outgoing card tips up and away (rotationX: -65), incoming card rises from below (rotationX: 65 → 0)

## Curation
- Use `featured: true` in frontmatter (field already exists in the content model)
- `/featured` page pulls only profiles with `featured: true`, sorted by date
- Start with 5-6 strong profiles — mix of people and places
- Good candidates: Aquality Farms (Samuel), Freedom Riders, Cheaha, Peerless Saloon, WaldenFARMacy, Covered Bridges

## Technical Notes

### Stack
- Next.js page at `src/app/featured/page.tsx`
- Client component for GSAP (same pattern as card-tilt demo)
- `@gsap/react` + `gsap` + `ScrollTrigger` (already in the card-tilt demo, need to add to SL deps)
- `next/image` for profile photos (with `fill` + `priority` on first card)

### Adaptation from card-tilt demo
- Swap placeholder panels for dynamic profile data (from `getAllProfiles()` filtered by `featured: true`)
- Use SL design system: Fraunces headings, Source Sans 3 body, Parchment & Pine palette
- Add topo texture overlay on dark panels (existing `.topo-texture` class)
- Category color accents per card
- HUD progress dots styled to match SL nav

### Accessibility
- `prefers-reduced-motion`: disable 3D tilt, fall back to simple opacity crossfade
- Cards are links — keyboard navigable
- ARIA labels on progress HUD
- Proper heading hierarchy (h1 on page, h2 per card)

### SEO
- `generateMetadata` with title "Featured Stories — Southern Legends"
- OG image: could reuse site default or create a custom one
- JSON-LD: ItemList schema pointing to featured profile URLs

## Build Steps
1. Add `gsap`, `@gsap/react` to SL dependencies
2. Create `src/app/featured/page.tsx` — server component wrapper
3. Create `src/app/components/FeaturedTilt.tsx` — client component with GSAP logic (adapt from card-tilt demo's `PinSection.tsx`)
4. Filter profiles by `featured: true` in frontmatter
5. Style cards with SL design system (Fraunces, topo, category colors)
6. Wire hero images as card backgrounds (with ghost-initial fallback)
7. Add "Featured" to nav in `Nav.tsx`
8. Mark 5-6 profiles as `featured: true` in frontmatter
9. Test mobile — card-tilt on touch scroll
10. `prefers-reduced-motion` fallback
11. Lighthouse audit

## Scope
2-3 sessions. Most of the GSAP logic is already written in the card-tilt demo — the work is adapting it to SL's design system and wiring it to real content.
