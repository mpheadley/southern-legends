# Local Legends

A content-driven storytelling site profiling small businesses, landmarks, makers, and community organizations in Northeast Alabama. Built by [Headley Web & SEO](https://headleywebseo.com).

## About

Local Legends is an editorial project highlighting the people and places that make Northeast Alabama what it is — the nonprofits holding communities together, the museums hiding in plain sight, the makers and business owners who've been doing the work for decades. Each profile is researched, written in first person, and built to be useful to anyone searching for these places online.

## Current Profiles

- **Interfaith Ministries of Calhoun County** — The coalition of churches that's been pooling resources since 1975 to keep Calhoun County's safety net intact
- **Jacksonville Christian Outreach Center** — The food pantry, clothing closet, and emergency hub that runs on donations and stubbornness
- **Anniston Museum of Natural History & Longleaf Botanical Gardens** — A world-class museum and 15-acre garden campus hiding in a town of 22,000
- **Freedom Riders National Monument** — The 1961 bus firebombing that became a turning point in the Civil Rights Movement, now a National Park Service site
- **Coldwater Mountain** — Over 56 miles of singletrack and the first Leadville qualifying race east of the Mississippi
- **The Peerless Saloon & Grille** — Alabama's oldest bar, a 1904 World's Fair relic, a former brothel, and a ghost named Lucinda
- **Chief Ladiga Trail** — 105 miles of paved trail from Anniston to Atlanta, and the Piedmont trail town businesses built around it
- **Noccalula Falls** — A 90-foot waterfall, a Cherokee legend, and 250 acres of gorge trails in Gadsden
- **Cheaha State Park** — Alabama's highest point at 2,407 feet, CCC-built structures, and the Pinhoti Trail connection
- **Alabama's Covered Bridges** — The oldest in Alabama (Oxford, built ~1850 by a formerly enslaved man) plus the Blount County trio
- **Janney Furnace** — A Confederate iron furnace destroyed before it ever fired, still standing in Ohatchee

## Stack

- **Next.js 16** (App Router, `src/` directory)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **MDX** via `next-mdx-remote` + `gray-matter` + `reading-time`
- **Fonts:** Fraunces (headings), Rock Salt (accent/pull quotes), Source Sans 3 (body)
- **Design system:** "Parchment & Pine" — burnt sienna, gold, warm neutrals
- **Deploy:** Vercel

## Content

Profiles are MDX files in `content/profiles/` with frontmatter for metadata (title, slug, category, location, tags, excerpt, published status). Set `published: false` in frontmatter to keep a profile in draft.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    layout.tsx          — root layout (nav, footer, scroll reveal)
    page.tsx            — homepage (hero, latest stories, about teaser)
    globals.css         — full design system + component styles
    about/page.tsx      — about page
    profiles/
      page.tsx          — all stories listing
      [slug]/page.tsx   — individual profile (MDX rendering)
      feed.xml/route.ts — RSS feed
    components/         — Nav, Footer, ProfileCard, PullQuote, etc.
  lib/
    profiles.ts         — MDX content loader
    site-config.ts      — site metadata, nav links
content/
  profiles/             — MDX story files
```

## License

All content and code in this repository is proprietary. All rights reserved.
