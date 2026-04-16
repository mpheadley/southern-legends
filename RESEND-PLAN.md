# Southern Legends — Resend Newsletter Plan
*Decisions made April 16, 2026. Hand this to a new session when building.*

---

## Send Cadence (decided April 16, 2026)
No formal nurture sequence. No drip campaigns. Simple rule:

- **New piece publishes → send a broadcast** with a short note and the link
- That's it. One email per piece, when it's ready

Broadcasts are not automated — Matt writes a short note in Resend, picks the SL audience, sends. Takes 10 minutes.

---

## Launch Sequence (do in this order)
1. **DMs first** — 3-5 personal contacts before the public post. Patreon folks, family, close friends. Short note, here's the piece, posting today. Warm the network before going public.
2. **Facebook post** — personal profile first, then share to SL page. Piece: "I'm Not Going to Disappear." Last personal post was August 2024 (Heather's surgery). Draft in this doc below.
3. **Personal outreach (next few days)** — Patreon supporters, GoFundMe donors, CaringBridge followers. Drafts below.
4. **Let it accumulate** — give people a week or two to find the form and subscribe.
5. **First broadcast** — send when the next new piece publishes. Short note + link.
6. **Promote the signup publicly** — after broadcast #1 is sent, share the subscribe link on social.

6 journal pieces are live. That's enough to invite people. Do not wait for more content.

### Facebook post draft (April 17, 2026)
> It's been a while since I've posted anything personal. Heather is doing well. We've had a hard stretch since last summer — but we're okay.
>
> I've been writing again. Some of it is about that.
>
> southernlegends.blog/journal/im-not-going-to-disappear

### On Lucy Morris / contributors
Lucy had coffee with Matt, loved SL, said having her story told was therapeutic. Matt floated the idea of inviting her as a contributor. **Do not open this yet.** Send a personal note thanking her for coffee and letting her know you're sharing publicly today. The contributor idea needs a separate conversation — what it means, what you'd ask, whether SL is ready — before anyone gets invited.

---

## Status
- 6 journal pieces live — past the threshold Matt set ("wire Resend after 3–4 pieces live")
- Newsletter infrastructure LIVE as of April 16, 2026 — subscribe form on journal and profile pages, wired to Resend audience, deployed to Vercel
- **First public Facebook share of the journal has NOT happened yet** (as of April 16)
- Do NOT push the signup link publicly until after broadcast #1 is sent
- Sequence: FB post first → let organic subscribers trickle in → send first broadcast → then promote the signup

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
**For now: `matt@headleyweb.com`** — already verified in Resend, works immediately. Slightly off-brand but functional.

**Eventually: `matt@southernlegends.blog`** — requires Resend paid plan (~$20/mo) to add a second domain. Not worth it at zero subscribers. Upgrade when you hit 50–100 subscribers.

- Resend sends the broadcast
- Set reply-to as `matt@headleyweb.com`
- Revisit domain upgrade at 50–100 subscribers

### API key
**Reuse the existing `RESEND_API_KEY` from headleyweb** — same key works across projects. Add it to the Southern Legends Vercel project env vars. No new key needed.

### Audience
Create a single "Southern Legends" audience in the Resend dashboard. Grab the Audience ID — needed as `RESEND_AUDIENCE_ID` env var.

### What "sending" looks like
Write the email in Resend → pick the Southern Legends audience → send. That's it. Resend calls these **broadcasts**.

---

## Warm Audience Outreach (do NOT import — invite personally)

Do not bulk-import any of these audiences into Resend. Reach out personally and invite them to subscribe via the form on the site. All messages should feel like a personal note, not a marketing email.

---

### Patreon (~20 supporters)
**Context:** Paid for Matt's writing. Warmest possible audience. Were told Patreon was winding down and directed to SL.
**Point to:** "I'm Not Going to Disappear" — closes the loop on why Patreon ended.

**Draft:**
> Hey [name] — I wanted to reach out personally. I wound down Patreon a while back, and I've been quiet since. I'm not gone. I've been writing again, just in a different place.
>
> I built a site called Southern Legends — it profiles small business owners and makers in NE Alabama. But I've also been writing about my own story there. The farm. The diagnosis. What's been happening since.
>
> Here's the first piece I posted: southernlegends.blog/journal/im-not-going-to-disappear
>
> If you want to follow along, there's a subscribe form at the bottom of any page. No pressure either way. Just wanted you to know where I landed.
>
> — Matt

---

### Close friends
**Context:** Know the full story. No need to explain much.
**Point to:** "I'm Not Going to Disappear" or whichever piece fits the friendship.

**Draft (Gladwell principle — short, no instructions, leaves room for response):**
> Hey — I've been writing again. Made something I'm proud of. Would love for you to check it out.
>
> southernlegends.blog/journal/im-not-going-to-disappear

No subscribe nudge. If they want to follow they'll find it. The ask is just "read this."

**List:** Jason, Kyle, Justin, Heather, Estef, Chelsea, Lin, Lucy

---

### Family
**Context:** Know the story but may need slightly more context on what SL is.
**Point to:** "I'm Not Going to Disappear."

**Draft:**
> Hey — I've been doing something I wanted to share with you. I built a site called Southern Legends that profiles local business owners in NE Alabama. I've also started writing about our own story there — the farm, the last couple of years, what's been happening.
>
> Here's the first personal piece: southernlegends.blog/journal/im-not-going-to-disappear
>
> If you want to keep up with it, there's a subscribe form at the bottom of any page.
>
> Love you — Matt

---

### GoFundMe donors
**Context:** Gave during the first depression episode (2024) when the farm was struggling. They invested in Matt during a specific hard moment.
**Point to:** "I'm Not Going to Disappear" — directly addresses that chapter and what came after.

**Draft:**
> Hey [name] — I've been meaning to reach out for a while. You gave during a really hard stretch, and I never said enough about what that meant.
>
> I'm on the other side of it now — still in it in some ways, but standing. I've been writing about it. Here's where I landed:
>
> southernlegends.blog/journal/im-not-going-to-disappear
>
> The site is called Southern Legends. I built it to tell stories about people in NE Alabama who are still building things. I've also started telling my own story there.
>
> If you want to follow along, there's a subscribe form at the bottom. No obligation — just wanted you to know I'm okay, and that what you did mattered.
>
> — Matt

---

### CaringBridge followers (Heather's surgery)
**Context:** Mixed audience — personal friends, congregation, community. Connected through Heather's surgery, not through Matt's writing. More sensitive. Lead with Heather and the family update before introducing the site.
**Point to:** Journal section generally, or "I'm Not Going to Disappear" for those who know more of the story.

**Draft:**
> Hey [name] — I wanted to send a quick update for those who followed along on CaringBridge during Heather's surgery.
>
> Heather is doing well. We've had a hard couple of years since then — the farm sold, some things I'm still processing — but we're okay. Still here.
>
> I've been writing about some of it, if you're interested. I built a site called Southern Legends that profiles local business owners in NE Alabama, and I've started writing about my own story there too.
>
> southernlegends.blog/journal/im-not-going-to-disappear
>
> There's a subscribe form at the bottom if you'd like to follow along. Either way, thank you for the prayers and the care during that season. It meant more than I said at the time.
>
> — Matt

---

**Process for all five:** Personal message or email, not a bulk send. One person at a time where possible. Link to the subscribe form. Let them opt in on their own terms.

---

## What's Built (as of April 16, 2026)
- Resend installed, API route at `/api/subscribe`
- Subscribe form (name optional, email required) on journal listing, journal detail, and profile pages
- Form copy: Option A headline + subtext
- Env vars live in Vercel (RESEND_API_KEY, RESEND_AUDIENCE_ID)
- Deployed to southernlegends.blog

## What's NOT Built Yet
- Homepage subscribe callout (quiet, below profiles grid — add when journal has 8–10 pieces)
- Paid tier / Stripe gating
- Segmentation
- `southernlegends.blog` as sending domain (blocked by Resend free plan — revisit at 50–100 subscribers)
