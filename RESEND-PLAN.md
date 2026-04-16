# Southern Legends — Resend Newsletter Plan
*Decisions made April 16, 2026. Hand this to a new session when building.*

---

## Status
- 6 journal pieces live — past the threshold Matt set ("wire Resend after 3–4 pieces live")
- First public Facebook share of the journal happening today (April 16)
- No newsletter infrastructure exists yet

## Decision: One List
Do NOT segment profiles vs. journal. One list, everyone gets everything.

**Why:**
- NE Alabama audience overlap is high — journal readers care about profiles and vice versa
- Two lists = two signup forms, two send flows, crossover subscriber management, complexity before a single subscriber exists
- The risk (subscribers blindsided by heavy personal writing) is handled at signup with clear expectation-setting on the form, not by splitting the list

**When segmentation makes sense:** paid tier. Free subscribers might get profiles only; paying subscribers get everything including deeper personal writing. That's the natural split — not now.

**Send discipline:** Lead every email with what type of piece it is (journal vs. profile) so subscribers know what they're opening before they click.

## Subscribe Form Copy

**Headline:**
> Stories from Northeast Alabama — and from the person writing them.

**Subtext (Option A — recommended):**
> Profiles of local makers and business owners, plus occasional personal writing from Matt. One list. No spam.

**Subtext (Option B):**
> Business profiles, personal essays, and the occasional note. You'll know what you're getting.

**Subtext (Option C — leans into the "why SL exists" angle, good for journal readers deciding to subscribe):**
> Profiles of people building something in NE Alabama. Plus some writing from me about what that's like to watch — and why I started.

---

## Email Infrastructure Decisions (April 16, 2026)

### Sending tool
**Resend handles everything** — subscriber list, broadcasts (what Resend calls newsletters), and sending. No MailChimp, no Substack, no extra tools needed.

### From address
**`matt@southernlegends.blog`** — verified sending address via Resend DNS records. Does NOT need to be a real inbox. Never needs paid email hosting.

- Resend sends the broadcast
- Replies go to `matt@headleyweb.com` (set as reply-to)
- `southernlegends.blog` domain just needs Resend's DNS verification records added (free, one-time)

### API key
**Reuse the existing `RESEND_API_KEY` from headleyweb** — same key works across projects. Add it to the Southern Legends Vercel project env vars. No new key needed.

### Audience
Create a single "Southern Legends" audience in the Resend dashboard. Grab the Audience ID — needed as `RESEND_AUDIENCE_ID` env var.

### What "sending" looks like
Write the email in Resend → pick the Southern Legends audience → send. That's it. Resend calls these **broadcasts**.

---

## Warm Audience Outreach (do NOT import — invite personally)

Three existing warm audiences who already know Matt's voice. Do not bulk-import any of them into Resend — they didn't opt into an email newsletter. Reach out personally and invite them to subscribe.

### Patreon (~20 supporters)
Matt has their emails from Patreon. Send a short personal note: Patreon is wound down, the writing lives at southernlegends.blog now, here's the subscribe link. These people already paid — they're the warmest possible list.

### GoFundMe donors
People who gave during a hard season. They've demonstrated care. A brief personal note acknowledging the connection before inviting them to follow the writing. Don't make it transactional — acknowledge what they did first.

### CaringBridge followers (Heather's surgery updates)
Matt posted updates there, so these people are connected through family crisis, not editorial interest. More sensitive audience. Approach carefully — a personal note is appropriate, but don't assume they're interested in the SL editorial project. Lead with the personal writing (journal section), not the business profiles.

**Process for all three:** Personal email or message, not a bulk send. Link to the subscribe form. Let them opt in on their own terms.

---

## What to Build
- Resend account + API key
- Subscribe form component (name + email, minimal)
- Form copy from above
- Double opt-in confirmation (Resend handles this)
- Place form: profile pages (byline area or after StoryNav), journal pages, maybe homepage
- No paid tier yet — free list only

## What NOT to Build Yet
- Segmentation
- Paid tier / Stripe gating
- Automated send sequences
- Separate profile vs. journal lists
