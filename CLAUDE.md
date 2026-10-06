# Southern Legends — Project Instructions

**Strategy doc:** `STRATEGY.md` — read at the start of any outreach, content, or business strategy session. Covers SL + HW shared outreach strategy, weekly rhythm, profile pipeline, syndication, and platform decisions.

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
    search/
      page.tsx          — search page (server: builds index, passes to client)
      SearchClient.tsx  — client component: input, scoring, keyword highlight
    profiles/
      page.tsx          — all stories listing (tag filter via ?tag= search param)
      [slug]/page.tsx   — individual profile (MDX rendering, progress bar, related stories)
      feed.xml/route.ts — RSS feed (full-text content:encoded)
    essays/
      page.tsx          — essays listing
      [slug]/page.tsx   — individual essay
    components/
      Nav.tsx           — site navigation (search icon links to /search)
      Footer.tsx        — site footer
      ProfileCard.tsx   — story card for grids
      PullQuote.tsx     — Rock Salt accent quotes
      ReadingProgressBar.tsx — fixed top bar tracking scroll through <article>
      ScrollReveal.tsx  — IntersectionObserver scroll animations
      ShareButtons.tsx  — social sharing
      StoryNav.tsx      — prev/next story navigation
      SubscribeCTA.tsx  — email subscribe block
  lib/
    profiles.ts         — MDX content loader (reads content/profiles/*.mdx)
    journal.ts          — MDX content loader (reads content/journal/*.mdx, serves /essays route)
    search.ts           — builds search index from profiles + journal (stripMdx util inside)
    site-config.ts      — site metadata, nav links
content/
  profiles/             — MDX story files that ship (Matt + edited profiles only)
  research/             — .md research docs; raw material, never ships
  research/sources/        — source PDFs (Anniston Star, Calhoun Journal, public records)
  AUTHENTIC-VOICE-GUIDE.md — writing voice reference
```

## Research Doc & Source Filing (automatic — do not skip)

When Matt provides PDFs, links, markdown docs, or any primary source material during a session:
1. **PDFs** → copy to `content/research/sources/` with a clean name: `[subject-slug]-[outlet]-[type]-[year].pdf`
2. **Markdown research docs** → copy to `content/research/` with a clean name: `[subject-slug]-[descriptor].md`
3. **Create or update** `content/research/[subject-slug].md` — the primary source record for that profile. Include: source citations, verified direct quotes with attribution, facts to confirm with subject, cross-link opportunities to other profiles.
4. Do this in the same session the material is provided, before moving on.

This prevents source material from staying in Downloads and becoming unfindable.

## Content Model
Each profile is an `.mdx` file in `content/profiles/` with frontmatter (title, slug, category, location, excerpt, date, etc.) and long-form narrative content. Profiles use the `PullQuote` component for Rock Salt accent quotes.

## Content Status
- **Matt's writing:** `matt-headley.mdx` — Matt's own profile, the voice baseline for the site.
- **Published profiles:** 7 `.mdx` files in `content/profiles/` (Matt's plus 6 edited). `interfaith-ministries-calhoun-county.mdx` has open edit notes (`INTERFAITH-EDIT-NOTES.md` in the same folder) including an unresolved question about whether its `aiWritten: false` claim is accurate.
- **Research docs:** 16 `.md` files in `content/research/`. These started as AI-written profile drafts and were reduced to facts/outlines. They are raw material for Matt to write from. They do not ship — the loader filters them out by directory (it only reads `content/profiles/*.mdx`), and any accidental `.mdx` file with `aiWritten: true` is also filtered out by `getAllProfiles`.
- **AI-written is terminal, not a checkpoint.** `aiWritten: true` is a hard gate, not a review flag. The loader refuses to publish anything with it set. To promote a research doc into a profile, Matt writes the profile from scratch in `content/profiles/`; the new file has `aiWritten: false` or omits the field.
- **Fake sample profiles deleted:** Earl McKinney, Jimmy Dawson, Mae Ruth Foster were fictional — removed.

## Writing Workflow
- **Voice guide:** `content/AUTHENTIC-VOICE-GUIDE.md` — reference for all writing on this site.
- **Storytelling framework:** `STORYTELLING-FRAMEWORK.md` — StoryBrand/Lowry Loop frameworks, three-tier personal story arc, Patreon philosophy.
- **Platform strategy:** `STRATEGY.md` — three-platform architecture, Patreon content plan, syndication order of operations, byline examples, action items.
- **Publishing plan:** `PUBLISHING-PLAN.md` — publishing sequence (SL → Anniston Star → Calhoun Journal), byline strategy, Donna Barton reconnection pitch, immediate next steps.
- **Syndication content handling:** SL always publishes first — it is the canonical source. Pieces syndicated out to the Star or Journal stay in `content/profiles/` or `content/journal/` as normal. No separate folder needed. The only exception: pieces that originated outside SL (e.g. a Star piece reprinted here) should use the `originalPublication` frontmatter field to flag the external canonical source. Do not create separate folders or use `published: false` as a syndication flag — frontmatter handles it.
- **Essays publish checklist:** When publishing an essay, add these to frontmatter: (1) `published: true`, (2) `merchImage` — imgproxy URL of the most relevant product photo, (3) `merchUrl` — direct link to that product (e.g. `https://matt-headley-shop.fourthwall.com/products/still-here`). Posts without `merchUrl` fall back to the store homepage. Match product to essay: Still Here = survival/hospitalization, Bipolar & Proud = diagnosis identity, I Contain Multitudes = default/broad.
- **Two-draft rule:** Matt writes first draft. Claude acts as editor with specific questions. Claude never writes openings, endings, or vulnerable passages.
- **AI psychosis piece — session protocol (revised 2026-05-22):** The hard prerequisite ("defer until Matt has had clinical team input") is lifted at Matt's call 2026-05-22 — he is no longer waiting on clinical clearance as a gate. The underlying working-mode risk has not disappeared, so the guardrail becomes a session protocol rather than a gate. Before starting any session on `journal-drafts/ai-psychosis.md` or the corresponding PB book chapter (Ch 9 "The Manic Dream That Didn't Die"), four checks must hold: **(1) rested** — 7+ hours sleep night before, do not start after a 3-hour-sleep day; **(2) stable** — not manic-leaning, not crashing, if Matt cannot tell, skip the session; **(3) daylight** — no AI-psychosis work after 6pm Central, ever; **(4) short** — 60 minutes max per session, stop when the timer ends even if it is flowing, *especially* if it is flowing. Two-draft rule still holds — AI does not draft vulnerable passages, Matt writes, AI arranges his words and asks one question at a time. If a session starts to feel like generative momentum rather than editorial work, name it and end the session. See `journal-drafts/ai-psychosis.md` for the full seed file and context.
- **Gap audit (runs before scaffold):** When Matt brings in raw material — voice chat, transcript, notes — run a gap audit before touching the draft. For each scene implied by the material, check three criteria: (1) time/place anchor, (2) first sensory hit when entering a space or moment, (3) specific visual of the key person. Ask one question per gap, one at a time. Wait for Matt's answer before asking the next. Only write the scaffold once the gaps are filled.
- **AI kill list:** Avoid words/patterns in Part 5 of the voice guide (delve, foster, leverage, tapestry, etc.)
- **Narrator vs. protagonist:** Matt writes in first person, but the subject must be the main character, not Matt. For business profiles: one personal connection sentence up front (e.g., "Sam is my friend"), then make it about them. Matt's personal stories belong in interview questions that draw out the subject's answers, not in the narrative body. Test: if you removed every sentence about Matt, does the profile still stand? If it collapses, Matt is too centered. Place/nonprofit profiles have more room for Matt's presence when his proximity IS the argument (e.g., Freedom Riders — "my kids were born at the same hospital").
- **Called Coffee crosslink (deadline: May 11, 2026):** Shannon's profile (`content/profiles/shannon-jenkins.mdx`, line 79) has a flagged comment: `{/* Crosslink opportunity: Jared, Called Coffee owner — profile upcoming */}`. Called Coffee appears in at least Shannon's profile and potentially others — it's a recurring location in the personal writing. Writing the Called Coffee profile activates that dormant crosslink. Jared is also a natural Headley Web prospect. May 11 is the Eastaboga Bee deadline — revisit the Called Coffee profile as the next active slot after that piece is filed.

## Personal Writing Section — Essays

Matt's personal writing and curated media live in a dedicated section — separate from profiles. **Section is called "Essays"** (decided 2026-04-25). Nav label: "Essays". Route: `/essays`. Content directory: `content/journal/` (unchanged — no file moves). Permanent 301 redirects from `/journal` and `/journal/:slug`.

**Why this lives on SL (not a separate site, not Patreon):**
SL is the right home because the personal writing isn't separate from the editorial project — it's the explanation for why it exists. The profiles raise the question: why does this person notice these people so carefully? The personal section answers it. Model: The Marginalian (everything on one owned platform), The Bitter Southerner (author voice lives alongside journalism). See design-inspiration-editorial.md.

**This decision is settled (April 2026).** Patreon was wound down and 20+ followers were directed to SL essay links (via permanent 301 redirects). Moving the content now would break those links and relationships. The essays section stays on SL.

**Client credibility note:** SL started as top-of-funnel for Headley Web. The essays section's heavier content (bipolar diagnosis, psychiatric hospitalizations) is a real but manageable credibility risk in the NE Alabama small business market. Mitigation: keep the journal at low visibility (nav + footer + byline only — never a homepage feature), and treat each heavy piece as a judgment call before publishing. Farm/faith/music content is an asset. Clinical mental health material warrants more care. Most clients won't go looking; the ones who do and are put off were probably not the right fit.

**Future pieces — placement decisions (decided April 2026):**
- **Psilocybin trip:** Do NOT publish on SL. This is the hard line. Everything else is about things that happened to Matt; this is about a choice involving a Schedule I substance in Alabama. One client finding it could cost real business. Belongs on Substack or nowhere public yet — not here.
- **Faith post:** Probably fine on SL. Faith, doubt, and wrestling resonate in NE Alabama. Faith deconstruction is more sensitive but manageable — read the angle before publishing.
- **Psych ward, mania, hospital, grief, farm loss:** Case by case. Suffering and survival land differently than choices clients might find disqualifying. These are generally okay on SL with care.
- **The meta-piece** (writing publicly about these placement decisions themselves — the tension of building a business platform while needing somewhere to process) — worth writing and fits naturally on SL. It's the most honest explanation of what the site is.

**Editorial distinction:** Profiles are about other people. This section is about Matt — healing, the farm, bipolar diagnosis, SL as part of recovery. Do not mix them in the same grid or card layout.

**Content model — richer than essays alone:**
- Long-form personal essays (gold star, reintroduction, UAB arc)
- Curated multimedia — music, art, video from other artists (the "Today's Anthem" pattern from Patreon posts)
- Old sermons (audio)
- Podcast episode(s)
- Matt's own photos, candid and personal
- Shorter reflections

MDX files in `content/journal/` (storage directory — route is `/essays`). Frontmatter: title, slug, date, excerpt, optional featuredMedia type.

**MDX components — all built, registered in `src/app/essays/[slug]/page.tsx`:**
- `AudioPlayer` — custom player with scrubber. Props: `src`, `title?`, `caption?`
- `SermonCard` — AudioPlayer + "Preached at…" label above. Props: `src`, `title`, `preachedAt?`, `caption?`
- `VideoEmbed` — YouTube (no-cookie) + Vimeo. IntersectionObserver lazy-load, 16:9 no-shift. Props: `url`, `caption?`
- `MusicEmbed` — Spotify compact (152px) + Bandcamp (120px), auto-detected from URL. Props: `url`, `caption?`
- `SongCard` — "Today's Anthem" link card, no iframe. Props: `title`, `artist`, `url`, `note?`
- `PhotoStrip` — horizontal snap-scroll filmstrip for inline journal photos (lighter than `PhotoCarousel`). Props: `photos` (array of `{src, alt, caption?}`), `caption?`
- `ArtCredit` — image + artist attribution line. Props: `src`, `alt`, `artist`, `artistUrl?`, `caption?`, `width?`, `height?`
- `TimelineBlock` — vertical dot timeline for chronological essays. Props: `items` (array of `{date, label, detail?}`), `caption?`
- `PullQuote`, `ArticleImage`, `FeaturedImage`, `InlineImage`, `Dateline` — existing prose components

**Portfolio value:** Building clean multimedia handling in Next.js (lazy loading, no layout shift, proper aspect ratios) is a real Headley Web skill. Clients ask for this. SL is the live demo.

**Site architecture:**
- `/essays` — editorial column layout on warm parchment (`#F0EDE6`). Large Fraunces display heading, gold "Personal writing" eyebrow, ruled list of posts: date + reading time + title + excerpt only. **No thumbnails** — the subject matter (bipolar, grief, farm loss) is heavy enough that images push it toward "content" and away from "writing." The Bitter Southerner and The Atavist don't use thumbnails on essay listings. The title and opening line do the work. Images show up inside the piece.
- **"Read the Stories" cards at the bottom of essays** — use `ProfileCardHero` in a 2-column grid (not 3). Three columns is too narrow inside `max-w-3xl` and clips titles. Never shrink `containerPx` on `resolveCardTitle` to compensate — that produces lighter-weight cards than the profiles page uses for the same component. Pull the column count lever, not the font size lever.
- **EssayCard** (More from Essays section) — no thumbnail, matches listing page: date · reading time + title + excerpt.
- **Homepage** — quiet callout below the profiles grid. Not a full section.
- **Nav** — distinct nav link alongside profiles.

**Distribution:** Full content on SL (canonical, source of truth). Post to Facebook and LinkedIn for reach. Patreon is being wound down — message 4 paying supporters personally before closing.

**Paid tier:** Stripe gating added after writing habit is proven (3–4 pieces live). Not before. Resend email delivery wired after same trigger.

## CTA Strategy (decided April 2026 — do not revert without reason)
Profile pages are intentionally lean on asks. The post-read flow is:
1. **Byline** — author photo (80px mobile / 128px desktop), bio, journal link, share buttons, "Support this work →"
2. **StoryNav** — prev/next stories

Decisions and why:
- **SubscribeCTA on homepage only** — no newsletter exists yet. Add back to profiles when a real send cadence is in place. The component (`SubscribeCTA.tsx`) supports `variant="section"` (homepage) and `variant="inline"` (footer).
- **"Support this work" lives in the byline** — not a standalone strip. It sits below share buttons inside `profile-closing-share`, grouped under the author credit where it makes contextual sense.
- **Nominate CTA removed from profile pages** — lives on the About page only. Profile pages already have enough asks.
- **Essays strip removed from homepage** — essays are discoverable via persistent nav, profile byline button, and footer. Doesn't need its own homepage band until there are 8–10 published essays.
- **No "Enjoyed this story?" label** — share and support buttons are self-explanatory. Labels were redundant.
- **Comments: keep on both profiles and essays (decided April 2026)** — not off-brand at this stage. Visible engagement is social proof for Headley Web prospects ("here's the community this site has"). SEO benefit: UGC adds fresh keyword-relevant text. FB sharing not meaningfully affected — commenters are a small minority of readers. Revisit when SL hits 20+ profiles and the editorial identity is more established.
- **Section heading: "Responses" not "Comments"** — more editorial, fits the magazine tone. Keep.
- **No on-site replies** — reply privately via email or on Facebook. Public reply threads are a future feature, not now.

## Current Status
- **Done:** Design system, layout, homepage, about page, profile detail page, profile listing (with tag filtering), search page (`/search`), reading progress bar on profiles, related stories by tag on profiles, full-text RSS, 7 published profiles (1 by Matt, 6 edited), 16 research docs in `content/research/`, scroll animations, share buttons, story navigation, subscribe CTA
- **Fonts loaded via `<link>` in layout.tsx** — Fraunces and Rock Salt are Google Fonts links, not `next/font`. Source Sans 3 uses `next/font/google`. Consider migrating Fraunces/Rock Salt to `next/font` for performance.

## Essays MDX Components — Status (browser-tested April 2026)

All components registered in `src/app/essays/[slug]/page.tsx` under `mdxComponents`.

**Working (simple string/url props):**
- `VideoEmbed` — YouTube embed, correct 16:9 aspect ratio, caption renders
- `MusicEmbed` — Spotify embed, correct height, caption renders
- `SongCard` — "Today's Anthem" card, title/artist/note all render
- `ArtCredit` — image + "Art: [artist]" attribution renders correctly
- `SermonCard` — wraps AudioPlayer, "Preached at" label renders, audio functional

**Fixed — JSON string prop workaround (April 2026):**
- `PhotoStrip` — use `photosJson='[{"src":"...","alt":"...","caption":"..."}]'` instead of `photos={[...]}`. Component parses the JSON string internally.
- `TimelineBlock` — use `itemsJson='[{"date":"...","label":"...","detail":"..."}]'` instead of `items={[...]}`. Component parses the JSON string internally.

**Root cause:** Turbopack/next-mdx-remote v6 RSC drops object-array JSX prop expressions at the MDX source level. Simple string props pass through fine. JSON string props are simple strings — they survive the compilation.

**MDX usage example:**
```mdx
<TimelineBlock
  caption="My timeline"
  itemsJson='[{"date":"2019","label":"Started farming","detail":"Planted the first field."},{"date":"2024","label":"Started over"}]'
/>

<PhotoStrip
  caption="My photos"
  photosJson='[{"src":"/images/photo.webp","alt":"Description","caption":"Optional caption"}]'
/>
```

## OG Images
- **Manual OG (preferred):** Open `og-preview.html`, edit title/name/image/position, screenshot at 1200x630, save to `public/images/social/{slug}-og.png`. The site auto-detects and uses it.
- **Satori fallback:** `src/app/profiles/[slug]/opengraph-image.tsx` auto-generates for profiles without a manual screenshot.
- **Detection:** `generateMetadata` in `page.tsx` checks if `public/images/social/{slug}-og.png` exists. If yes, uses it. If no, Satori kicks in.

## Writing Coach & Audit Triggers

**The writing coach for SL lives in BookCoach** (`gather/apps/bookcoach`), not as a Claude Code skill. `/coach-sl` was never built as a skill file — do not attempt to invoke it.

When Matt asks for coaching (any of the phrases below), apply the coaching methodology directly from `content/AUTHENTIC-VOICE-GUIDE.md` and the `southern-legends` config in `gather/apps/bookcoach/lib/coaching-configs.ts`:

| User says | What to do |
|---|---|
| "writing guide", "writing coach", "coach me", "socratic coach", "voice guide" | Apply SL coaching methodology inline: gap audit → underneath question → telling detail → ending. One question at a time. |
| "audit this", "voice check", "check this draft", "run the audit" | Read the draft, run kill list check, flag one thing. Wait for response before flagging the next. |

Matt writes first. Always. Do not generate content before coaching is complete.

---

## Build Rules
- Follow global CLAUDE.md standards (next/image, WebP, contrast checks, etc.)
- No daisyUI — pure Tailwind + custom CSS
- MDX content lives in `content/profiles/`, not in `src/`
- CSS goes in `globals.css` — no inline `<style>` blocks
- Use `var(--font-heading)` / `var(--font-accent)` / `var(--font-body)` — don't hardcode font names in components
- Use design token color classes (`text-ll-dark`, `bg-ll-primary`, etc.) — don't hardcode hex values in components

## Subscriber letters
Start at `/Volumes/Samsung_T5/webdev/reports/sl-notify/README.md`. Letters are JSON data rendered by `tools/sl-notify-subscribers.py`; the send is gated in Python (reviewed hash, live page and images, 988, `/go/aisle`, reply invite, kill-list). No Iris byline; video links go to `<page>#video`.
