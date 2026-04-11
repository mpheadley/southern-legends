# Southern Legends — Strategy

*Matt Headley — April 2026*

---

## The Big Picture

Three platforms. One body of work. Written once, deployed strategically.

You're not building three separate things. You're building one story and letting it live in three places at different depths. The income comes from multiple layers, not one big bet.

---

## The Longer Vision — Chamber of Commerce Alternative

Southern Legends is the beginning of a Chamber of Commerce alternative for Northeast Alabama.

A traditional Chamber does three things: community visibility for local businesses, business networking, and a directory of local businesses. Southern Legends does all three — without membership fees, gatekeeping, or bureaucracy. It leads with free value and serves the community first.

Over time it could evolve into:
- A full business directory for Northeast Alabama
- A community events calendar
- A small business resource hub
- A referral network for local service providers

Every business in that ecosystem already knows Matt Headley built it. When they need a website or SEO help, they call him.

---

## What Southern Legends Is NOT

- A sales pitch vehicle — keep editorial content clean, no web design pitches inside profiles
- A Facebook group — distribute into existing groups, don't create new ones to maintain
- A replacement for direct outreach — it runs parallel to cold walk-ins, not instead of them

---

## Platform Architecture

### Layer 1 — Southern Legends (Free, Public)

**What it is:** Editorial profiles of people and places in Northeast Alabama. Your owned platform. The credibility and discovery engine.

**Your own profile lives here.** Honest about the loss, not the full depth. Gold star detail possibly fits. UAB ward does not.

**Role in the funnel:** Warm entry point. Readers find you through the Calhoun Journal, click through to Southern Legends, read your profile, and follow the trail deeper.

**Publish here first** — before syndicating anywhere. Southern Legends is the primary home.

---

### Layer 2 — Patreon (Free tier + paid tier)

**What it is:** The deeper layer of Southern Legends. Where your own story gets told in full — gold star, UAB, Jack and the dominoes, Lucy, all of it. Also where the book gets built, post by post.

**Free tier:** Open to anyone. Full access to your personal essays. People who find you through the Calhoun Journal or Southern Legends can read without a paywall. This is the value-first play.

**Paid tier:** Early access, book chapters as they develop, direct conversation, or whatever you decide has enough value to charge for. Figure this out once you have traction.

**Short-term income play:** You already have paying patrons. The Calhoun Journal syndication will drive new readers. Get the Patreon live and populated *before* you start sending content to the Journal.

### Patreon Content Plan

Write these in order — they build on each other:

1. **Why Southern Legends** — the first post. Why you're doing this personally and professionally. How you're beginning to suspect it's part of your healing. Reconnecting with people you thought you'd lost relationships with because of decisions made while manic. Present tense, unresolved, honest. Write this one first — it's happening now, which makes it easier than The Gold Star. It also sets up everything that comes after: readers who find you here will understand why the backstory matters.
2. **The Gold Star** — Psychiatrist's office. Published in the Anniston Star. Everything buttoned up. The unfilled prescription. Then: "I wasn't through it." Write it and stop. Don't resolve it. The gold star / Anniston Star irony is the point — neither of you knew what was coming. Draft in progress: see `content/profiles/matt-headley-sources/gold-star-draft-notes.md`.
3. **The mania that felt like recovery** — the meds you decided not to take. The ego death that was actually mania. The lightness that was a warning sign neither of you recognized.
4. **The UAB Ward** — Jack, dominoes, badminton in hospital gowns, the anger, being away while your family dismantled everything.
5. **The pulpit that couldn't heal you** — you spent your life being the one with answers. The second depression took that away.
6. **Lucy and the finish line** — the conversation about there being no finish line. The honest ending that isn't resolution.
7. **The pole vault** — earns its place as the first "throwing myself at something unlikely." Also genuinely funny alongside everything else.

**This is also where the book gets written.** Post by post, the shape will emerge.

---

### Layer 3 — Headley Web & SEO (Paid, Long-term)

**What it is:** The web design and local SEO business. The longer-term income play.

**Role:** Southern Legends positions you as someone who understands story and community — not just a service provider but someone with deep roots and real credibility in Northeast Alabama. That's what makes the web business different from every other freelancer in the market.

**Not the short-term play.** The portfolio is still building. Stephens Small Engine is in progress. Keep doing the work, keep the outreach going, but don't count on this for income in the next 90 days.

---

## Patreon → Southern Legends Member Area (Migration Plan)

Long-term, the Patreon moves off Patreon and into Southern Legends as a built-in member area.

**Trigger:** ~10 paying patrons — enough proof the writing has an audience, small enough that migration is personal.

**Stack:** Next.js (already the SL platform) + Stripe Billing (same account as Headley Web client billing — separate Products, one account) + auth (Clerk or NextAuth) + content gating via middleware.

**Migration ask to patrons:** One new payment setup in Stripe, cancel their Patreon. Low friction for people who care about the work. Message Rae Wall through Patreon directly — her email is an Apple private relay, unreachable otherwise.

**Justification to patrons:** "I built something. I want to own the relationship with the people supporting this work — no platform in the middle."

**Bonus:** The member area is a legitimate Next.js portfolio piece (auth + subscriptions + content gating) — demonstrable to future clients in media, fitness, education, local journalism.

**Sequence:** Write 2–3 posts → get to ~10 patrons → build member area → migrate → close Patreon.

---

## The Book

The Patreon is the workshop. By the time you've written enough posts, you'll have:

- The inciting incident (unclear yet — gold star? the manic episode?)
- The real center of the story (you spent your life being the one with answers; the second depression took that away)
- The honest ending (not recovery — *there is no finish line*, per Lucy)

Don't think about the book yet. Write the Patreon posts. The book will find its shape.

---

## The Real Center

Everything connects to this:

You spent your life being the one with the answers — from the pulpit, from the Anniston Star, from the self-care disciplines that were supposed to hold. The second depression took all of that away. The mania felt like recovery. The gold star felt like the end of the hard chapter. Neither was true.

That's not a Southern Legends detail. That's the book. And the Patreon is where you write your way toward it.

---

## Syndication Strategy

### Order of Operations

1. Write the piece
2. Publish on **Southern Legends** first (your owned platform)
3. Wait one to two weeks
4. Syndicate to **Calhoun Journal** (Lee)
5. Pitch to **Anniston Star** (Donna Barton) for paid syndication ($50–100/article)

---

### Calhoun Journal

**Contact:** Lee Kathryn Evancho

**What it is:** Weekly paper with broad reach across Calhoun County. Lee reached out to Matt — they came to him, which matters. Running on donations (not a nonprofit, so no tax incentive for donors).

**Strategic value:**
- Largest raw reach of any local outlet (~120,000 weekly readers).
- Already said yes. Use this credential now.
- Best for general community awareness and building Southern Legends' name recognition.

**Competitive sensitivity:** Lee's husband owns JLM Communications, a web design and marketing company based in Weaver — direct overlap with Headley Web & SEO. Do not proactively raise this. Keep the editorial relationship clean and separate. Don't create friction — build the relationship first. Do not put a Patreon link directly in your Calhoun Journal byline, at least not yet. Once you've built trust and she understands what you're doing, revisit.

**Calhoun Journal byline:**
> *Matt Headley writes profiles of people and places in Northeast Alabama at southernlegends.com. He runs Headley Web & SEO from Jacksonville, Alabama.*

Point to Southern Legends, not directly to Patreon. Readers who want the deeper story find it naturally from there.

**Action:** Confirm submission process with Lee this week.

---

### Anniston Star

**Contact:** Donna Barton (editor, existing relationship)

**What it is:** Established local newspaper with institutional credibility. Matt is already a published author there — 2024 personal essay on depression and ministry. This is a returning contributor relationship, not a cold reconnect.

**The credential is already active.** Use "published in the Anniston Star" in outreach now.

**Strategic value:**
- Most prestigious local credential for cold business outreach.
- The 2024 essay establishes Matt as a writer willing to be honest in public — relevant context for anyone considering being profiled.
- Potentially paid. The stringer payroll history suggests Donna was willing to pay. Pitch syndication at $50–100/article — standard and reasonable.
- Better for targeting businesses and community figures embedded in the older local media ecosystem.

**Pitch to Donna:** You own the work, Southern Legends publishes first, the Star publishes for a small fee. Ask directly.

**Content model — open question:** Syndication of existing Southern Legends profiles, original pieces for the Star, or a hybrid. Clarify on reconnect.

**Action:** Email Donna Barton this week. Frame it as a returning contributor with new work.

---

### The Two Outlets Compared

| | Anniston Star | Calhoun Journal |
|---|---|---|
| Prestige / credibility | Higher | Moderate |
| Raw reach | Smaller | ~120,000 weekly |
| Contact | Donna Barton | Lee Kathryn Evancho |
| Relationship status | Published author, warm reconnect | Already accepted |
| Paid opportunity | Yes — pitch $50–100/article | Unknown |
| Competitive sensitivity | None | Lee's husband in web/marketing |
| Best use | Targeted outreach, credibility | Broad name recognition |
| Content model | TBD — syndication or original | Syndication |
| Use credential now? | Yes — byline already exists | Yes |

**The play:** Use Calhoun Journal now for momentum and reach. Reestablish the Star relationship for targeted, high-credibility outreach and paid income. Route content strategically once both are active.

---

### How Syndication and the Patreon Interact

**Syndication feeds the Patreon.** Calhoun Journal's 120k readers and the Star's local audience are a pipeline of potential supporters. Syndication builds the top of the funnel; Patreon converts the readers who want to go deeper.

**The Star byline lends the Patreon credibility.** The credential transfers.

**The Patreon helps the syndication relationships.** An active Patreon with real supporters signals Matt's writing has an audience. That's a stronger position when pitching editors.

**The clean pipeline:** Article → bio line mentioning southernlegends.com → site → Patreon link. One degree of separation. Do not reference Patreon directly in paid editorial content or in the Calhoun Journal byline until the relationship is established.

**Content differentiation (prevents conflict):**
- Star / Calhoun Journal — published editorial journalism
- Southern Legends — full editorial treatment on your own platform
- Patreon — the personal inner arc, the things that don't fit in a published piece

As long as Patreon isn't a paywall for Star content, and content stays clearly distinct, all three run simultaneously with no conflict.

**Clarify with Donna:** *"I run a community storytelling site and have a Patreon for my writing work — is there anything in how we'd work together that I should know about?"*

---

## Target Businesses

- Service companies with weak or no websites
- Small local businesses with a good story to tell
- Businesses whose owners are active in the community (church, farmers market, civic groups)
- Use Google Business Profile scraper to identify targets by area

---

## Southern Legends vs. Cold Walk-Ins

Southern Legends and cold walk-ins serve different moments:

| Situation | Use |
|---|---|
| Walking into a cold business with no prior contact | Cold walk-in — leave business card, no profile offer on first visit |
| Following up with a cold walk-in contact | Southern Legends profile offer as warm re-entry |
| Approaching a warm contact (church, farmers market, referral) | Lead with Southern Legends profile immediately |

---

## Profile Pipeline

| Subject | Status | Notes |
|---|---|---|
| Jean Ellison (Mom-To-Go) | Published | Two-touch complete. Made a Facebook reel unprompted — strong social proof. |
| Samuel Sawyer (Aquality Farms) | Published | Two-touch complete. Reel planned. |
| Lewis Downing (Downing and Sons) | Draft ready | Contacted today. Draft ready for editing. |
| Shannon Jenkins (United Way of East Central Alabama) | Draft in progress | Met today, he agreed. Draft half written — send it. He/him. |
| Anniston Museums & Gardens | Published | Follow-up status? |
| Freedom Riders National Monument | Published | Follow-up status? |
| Interfaith Ministries | Published | Follow-up status? |
| Called Coffee / Jerrod | Research file exists | Community-rooted business. |
| Dolores Heidock | Not yet contacted | Alabama storyteller, Birmingham. Matt organized a workshop with her during ministry. Strong candidate and potential thinking partner on storytelling as craft. |

*Update this table as outreach progresses.*

---

## Profile Quality Standard

Jean Ellison / Mom-To-Go is the bar. Real interview. Real photography. Longform narrative. That level of quality is what generates the social proof (Jean made a reel without being asked). Do not dilute it to publish faster.

The credibility of the site depends on every profile being that good. One weak profile doesn't just underperform — it makes the strong ones look like exceptions.

Current warm network profiles skew toward business owners who already have decent websites. The B2B conversion from Southern Legends is slower by design. Patreon fills the gap — it monetizes the audience directly rather than waiting for a web design need to surface.

---

## Two-Touch Follow-Up Sequence

Run this on **every published profile without exception**.

**Touch 1 — Day of publish:**
Send the link. Nothing else. No ask. "Your profile is live — [link]."

**Touch 2 — 5–7 days later:**
Check in. Ask how it landed. This is where the conversation starts.

The sequence is complete when Touch 2 is sent. Whether they respond or not, you've done your part. Do not follow up a third time unless they initiate.

---

## The Outreach Approach (Cold Businesses)

The Star/Calhoun Journal credential creates a legitimate reason to approach businesses with weak or no websites:

1. Reach out as a journalist/writer — ask to profile them for Southern Legends (and/or the Star/Journal).
2. Do the interview. Publish the profile.
3. Run the two-touch sequence.
4. Follow up separately as a web designer — don't pitch inside the editorial relationship.

Keep editorial and web services cleanly separate. Never pitch web design inside paid editorial content.

---

## Known Blockers

- **Social anxiety** following bipolar episode makes initiating conversations hard. The system is solid. The block is initiation, not planning.
- **Perfectionism** slows publishing cadence. The site is good enough. Stop polishing, start outreaching.
- **Zero outreach conversations initiated** — this is the core problem, not content quality or site readiness.

The work to do is not more writing or more building. It is sending the messages.

---

## Action Items

### This Week
- [ ] Update Patreon — pivot from flower farm / ministry framing to storytelling + personal essay
- [ ] Message the 4 paying patrons personally before publishing anything new — they've been paying through radio silence
- [x] Set up free tier on Patreon (already done)
- [ ] Write first Patreon post: **Why Southern Legends** — healing, reconnection, present tense
- [ ] Write second Patreon post: **The Gold Star** — draft in progress
- [ ] Message Lewis (Downing and Sons)
- [ ] Confirm submission process with Lee at Calhoun Journal
- [ ] Email Donna Barton at Anniston Star to reconnect
- [ ] Make Samuel / Aquality Farms reel

### Before First Calhoun Journal Submission
- [ ] Have at least 2–3 Patreon posts live
- [ ] Make sure Southern Legends profile links clearly to Patreon
- [ ] Confirm byline language with Lee — Southern Legends link, not Patreon

### Soon
- [ ] Finish Stephens Small Engine site
- [ ] Run two-touch follow-up on every published profile that hasn't had it
- [ ] Build support page at southernlegends.com/support
- [ ] Add pole vaulter detail to Southern Legends profile opening

### Ongoing
- [ ] Publish on Southern Legends weekly (or close to it)
- [ ] Syndicate to Calhoun Journal one to two weeks after
- [ ] Write toward the Patreon — UAB section, Lucy, the mania

---

## Writing Habit

The Patreon writing is emotionally heavy. A rigid schedule backfires — forcing "The UAB Ward" on a Tuesday because it's Tuesday produces bad writing or nothing at all.

**Daily (low bar):** 10 minutes of longhand or voice memo. Not drafting — noticing. What surfaced today that connects to the larger story. No pressure to use it. The goal is staying close to the material.

**Weekly (real session):** One 60–90 minute writing block. Away from the desk — coffee shop, outside, different chair. Anywhere that doesn't feel like web work. Your brain needs a different physical context to know which mode it's in. Longhand in the Moleskine is better for the rawest material (harder to self-edit as you go) — use it for first pass, then bring it here to shape into a draft.

**Trigger-based:** When something surfaces in a Southern Legends interview or profile conversation that connects to your own story, note it immediately. Those moments are the best raw material.

The habit isn't "publish a post every week." It's staying close enough to the material that when you sit down, something's there.

---

## Long-Term Vision

Southern Legends grows into the go-to community resource for Northeast Alabama small businesses. Matt Headley is known as the guy who built it. Every business owner in the directory is a potential web design and SEO client. The community spotlight becomes a sustainable, compounding lead generation engine that no competitor can easily replicate.
