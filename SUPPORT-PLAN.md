# Support Feature — Plan
*Southern Legends — drafted April 2026*

---

## What It Is

A `/support` page + quiet links in three places. One-time donations via Stripe. No subscription, no paywall, no membership. Free site, always will be — support is voluntary.

---

## The `/support` Page

One honest page. Not a pitch — an explanation. What Southern Legends is, why it's free, what support makes possible. A donation button. That's it.

**Copy direction:** Short, direct, no performing gratitude. Closer to:
*"This site is free and always will be. If it's worth something to you, here's how to show it."*

Not a fundraising appeal. Not a crisis ask. Just an honest offer.

**Also points to the journal:** One line explaining why support matters — "the profiles are free, the writing is free, and so is everything else here. The journal is where I'm figuring out what all of it means." Points readers toward the journal without making support feel contingent on reading more.

---

## Stripe Implementation

Two options:

**Option 1 — Stripe Payment Link**
Generate a hosted link in the Stripe dashboard. No code. Redirects to Stripe's checkout page. Fast to ship, clean, trustworthy. Slight downside: takes reader off SL domain to pay.

**Option 2 — Custom Stripe Checkout**
Stays on SL domain. More control. Better portfolio piece. More build time.

**Recommendation:** Start with Payment Link — ship it fast. Upgrade to custom checkout when the Letters/Journal section is built. Bundle as one Stripe build then.

---

## Links to Add

### Profile Byline
Two quiet lines after Matt's bio on each profile:
- "I write about what's behind the profiles →" *(links to journal/letters page)*
- "Support this work →" *(links to /support)*

Not two paragraphs. Two lines. The byline is the most-read real estate on the site — use it without crowding it.

### About Page
- Short paragraph near the bottom pointing to `/support`
- Separate line pointing to the journal — readers on the About page are already invested, natural place to go deeper

### Footer
- Single line link to `/support` — always present, never intrusive
- Single line link to journal/letters page

### Journal/Letters Entries
- Each entry ends with a quiet support link — same place the subscriber CTA will eventually live
- Readers who finish a piece and felt something have a natural next step
- Not a popup, not a banner — one line at the bottom

---

## The Loop

Profiles bring people in → journal explains who's writing them → support page gives readers a way to respond. Each points quietly to the others.

- **Profiles** → journal (byline) + support (byline)
- **Journal entries** → support (end of each entry)
- **Support page** → journal (one line in the copy)
- **About page** → support + journal
- **Footer** → support + journal

No shouting. No banners. Quiet, present, honest.

---

## Build Order

1. Create Stripe Payment Link in dashboard (15 minutes)
2. Build `/support` page — copy + donation button
3. Add support + journal links to footer
4. Add support + journal links to About page
5. Update profile byline component — two quiet lines
6. Add support link to bottom of each journal entry template (when journal section is built)

---

## Notes

- Do not put Support in the nav — nav is for navigation, not asks
- Journal section doesn't exist yet — byline and About page can link to it once it's built; placeholder for now
- Upgrade Stripe Payment Link to custom checkout when Letters/Journal section is built — bundle as one build
- Copy must not perform gratitude or crisis. The site is not asking to be rescued. It's offering readers a way to participate in something they already found worth reading.
