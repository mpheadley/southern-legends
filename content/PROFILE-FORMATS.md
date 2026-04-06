# Profile Format Guide: Standard MDX vs. Scrollytelling

*Decision reference for choosing a presentation format when building new profiles.*

---

## The Two Formats

### Standard MDX

The default format. Content lives in a `.mdx` file in `content/profiles/`. The profile page renders a full-bleed hero image, then flows the article as continuous prose with inline `<ArticleImage>` components (left, right, center, or full layout), `<PullQuote>` accents, and optional `<PhotoCarousel>` blocks.

**What it produces:** A long-form editorial article. Feels like a magazine feature. The reader scrolls through prose interrupted by photos at natural sizes.

**How it works technically:** Add the `.mdx` file. No config changes needed. The `[slug]/page.tsx` renders it automatically if no scrollytelling config exists for that slug.

---

### Scrollytelling (Parallax Panel Format)

The immersive format. Content is **not** written in the MDX file — it's hard-coded in `src/lib/scrollytelling-configs.ts` as structured data (prose paragraphs, panel headings, panel images). The `ScrollytellingProfile` component renders alternating fullscreen pinned panels and prose blocks, animated by GSAP.

**What it produces:** A cinematic, chapter-based experience. Each "section" pins a fullscreen background photo for ~300vh of scroll while text animates in over it. Between panels, prose blocks flow normally. Includes a side HUD progress tracker. Dark background throughout.

**How it works technically:** Add a config object to `scrollytelling-configs.ts` keyed to the profile slug. The page router detects the config and hands off to `ScrollytellingProfile`. The `.mdx` file still exists for metadata and SEO schema but its body content is ignored.

---

## When to Use Each

### Use standard MDX when:

- The photos are **portrait-oriented** or **smaller format** — brand shots, event photos, intimate scenes. These work beautifully inline but can't carry fullscreen panels.
- The article is a **personal essay or single narrative arc** — one continuous thread without natural chapter breaks. Forcing it into panels would interrupt momentum.
- The photos are **archival, low-resolution, or social-media quality** — older Facebook photos, candid shots, anything under ~1500px wide will look rough at 100vw.
- The piece is **shorter** (under ~1000 words). Scrollytelling's overhead (pinned panels, GSAP, HUD) is expensive for a short read.
- The subject's story **doesn't have a natural 3–4 chapter structure** with a distinct visual identity per chapter.

### Use scrollytelling when:

- You have **3–4 dramatic, wide-format, high-resolution photos** that can each hold a fullscreen panel — architectural interiors, landscapes, workshop/studio environments, action shots with environmental context.
- The article has **clear, distinct chapters** that map to separate visual spaces or topics (e.g., The Warehouse → The Mission → The Outdoors).
- The visual material is **varied enough** that each panel feels different — not three versions of the same scene.
- The subject's work has **a sense of place or scale** that benefits from the immersive treatment. Industrial spaces, natural settings, significant buildings.
- You have **at least 800–1000 words** of prose to populate the sections between panels.

---

## The Photo Test

Before choosing scrollytelling, run each candidate panel image through this check:

| Question | Standard MDX | Scrollytelling |
|---|---|---|
| Landscape orientation (wider than tall)? | Either | Required |
| At least 2000px wide? | Not required | Strongly preferred |
| Can the subject be identified at a glance with text overlaid? | N/A | Yes |
| Does it convey a distinct location or environment? | Nice to have | Required |
| Would a fullscreen crop at 16:9 look composed, not cropped? | N/A | Yes |

If you can't answer yes to the bottom three for each panel candidate, use standard MDX.

---

## Case Studies

### Aquality Farms — Scrollytelling ✓

Three visually distinct environments with wide-format, high-resolution photos: the grow room with vertical towers, the lettuce under LED lights, the mushroom lab. The story had three clear chapters (The Warehouse, The Mission, Chaha Outdoors). Each panel had its own sense of place. The photos were taken specifically for the farm, in-space, with a wide lens.

### Jean Ellison / Mom-To-Go — Standard MDX ✓

Strong Emil Loeken portraits — but portrait-oriented, outdoor and kitchen settings that work as inline images, not panel backgrounds. JSU performance photos are 2007-quality Facebook jpegs — not suitable for fullscreen. The article is a single narrative arc (the plan, the collapse, what grew from it) with no natural chapter breaks. Essay form benefits from unbroken prose flow.

---

## Maintaining the Scrollytelling Config

When adding a scrollytelling profile:

1. Add a config object to `src/lib/scrollytelling-configs.ts`
2. Prose paragraphs, panel headings, and image paths are all hard-coded there — not in the MDX
3. The MDX file is still required for: slug generation, metadata, SEO schema, RSS feed, profile card data (excerpt, date, tags, hero image for card thumbnail)
4. Keep the MDX body minimal or add a note that prose is in the config

When editing prose on a scrollytelling profile, **edit the config, not the MDX body.**
