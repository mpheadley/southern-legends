# Email Sequence — Southern Legends

> **Subscriber letters (story emails) live in `/Volumes/Samsung_T5/webdev/reports/sl-notify/README.md`**: tool, rules, drafted letters, Fable review status. This file covers the comment flow and signup drips only.

## Comment Flow (built April 2026)

Every comment submission:
1. Saves to Supabase `comments` table (`approved = false`)
2. Emails Matt at matt@headleyweb.com with name, email (if provided), message, and an **Approve comment** button
3. Tapping Approve hits `/api/comments/approve?id=&token=` — verifies HMAC signature, sets `approved = true`, shows confirmation page
4. After submit, the form shows an inline subscribe nudge: "Want to hear when new stories go up?" — pre-filled with their email if they provided one, posts to `/api/subscribe`

**Env vars required:**
- `COMMENT_APPROVE_SECRET` — set in Vercel, generated with `openssl rand -hex 32`
- `RESEND_API_KEY` — already set
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — already set

---

## Database Migration (run once)

Open [supabase.com](https://supabase.com) → project `wpitqjhvephecfppzvoi` → SQL Editor:

```sql
alter table comments add column if not exists notify_replies boolean default false;
```

---


> Drafted April 2026. Claude draft — Matt to proof voice before activating.
> Welcome email triggers on subscribe (wired in `/api/subscribe/route.ts`).
> Day-3 email: use Resend Automations (preferred) or cron fallback (see below).

---

## Email 1 — Welcome (Day 0)

Sent immediately from `/api/subscribe/route.ts` after contact is created.

**Subject:** You're in

**From:** Matt Headley <noreply@southernlegends.blog>

---

[firstName], (or "Hey," if no first name)

Thanks for subscribing.

I'm Matt. I build websites for small businesses here in Northeast Alabama, and somewhere in the middle of that work I started writing about the people I met.

More stories are here when you're ready:
https://southernlegends.blog/profiles

Profiles go out when they're ready. I'm not chasing a schedule.

Matt Headley
southernlegends.blog

---

## Email 2 — Day 3

Introduce the journal. No pitch — just the honest context for why the site exists.

**Subject:** One more thing

**From:** Matt Headley <noreply@southernlegends.blog>

---

Thanks for being here.

I write about more than other people's businesses.

A few weeks ago I published something more personal — about coming back after a hard few years. The farm we built and sold. The bipolar diagnosis. Three weeks in a psych center. I'm not disappearing, but it took a minute to believe that.

If you're curious: https://southernlegends.blog/journal/im-not-going-to-disappear

Matt

---

## Activation Status

| Email | Status | Notes |
|-------|--------|-------|
| Welcome (Day 0) | ✅ Live | Fires from `/api/subscribe/route.ts`. Links to `/profiles` index (not Jean specifically — subscriber may have arrived via a profile). |
| Day-3 Journal Intro | ✅ Live | Resend Automation "SL Day-3 Journal", activated April 2026. Links to `/journal` index — evergreen, never goes stale. |

## When to Add More Emails

**SL:** Welcome + Day 3 is the full automated sequence. Next email is a manual broadcast when a new profile publishes. Don't add more automation until publishing consistently (roughly twice a month). Revisit at 10+ profiles live.

**HW newsletter:** Welcome + Day 3 is right-sized for now. Days 7, 14, 21 make sense eventually — but only when there's blog content to pull from. Adding emails without content means writing into a vacuum. Trigger: 3-4 proofed blog posts live, or first real case study with data (Between Worlds 30-day numbers, or similar).

**HW audit funnel:** Already has 5 emails (Days 0, 3, 7, 14, 21). Complete. Revisit when a real case study is ready to replace Email 4.

---

## Source Tracking (April 2026)

Every new SL subscriber triggers a notification email to matt@headleyweb.com with the source in the subject line.

**Subject format:** `New subscriber: {email} (source: {source})`

**Why:** Resend's free plan has no custom contact attributes — there's no way to tag a contact with where they came from. Notification email is the workaround: Matt gets a copy per subscriber, source visible at a glance.

**Sources tracked:**
| Source value | Where it fires |
|---|---|
| `homepage` | Section SubscribeCTA on the homepage |
| `footer` | Inline SubscribeCTA in the footer |
| `comment` | Inline subscribe nudge after comment submit |

**Code:** `source` prop on `SubscribeCTA` and `Comments.tsx` → passed to `/api/subscribe` body → included in notification email. Defaults to `"footer"` (inline) or `"homepage"` (section) if prop is omitted.

---

## Decisions & Rationale (April 2026)

- **One list, not two** — no segmentation by entry point (profile vs. journal). Small list, not worth the overhead. Revisit at 500+.
- **No specific article link in Day-3** — links to `/journal` index instead. Any specific piece would go stale. Evergreen index lets them browse.
- **No specific profile link in welcome** — links to `/profiles` index. Subscriber may have arrived from the Jean Ellison profile; linking back is redundant.
- **Day-3 timing** — 3 days is right for this site. Day 1 feels rushed; the welcome email gives them Jean Ellison to read first.
- **No automation for new profiles** — each new profile gets a manual Resend broadcast. Personal note from Matt, subject line written for that story. Do not automate. See STRATEGY.md publishing checklist.
- **First 5 subscribers (April 2026)** — all subscribed after the journal launched, likely via `im-not-going-to-disappear`. Did not receive Day-3 (automation wasn't live yet). No catch-up broadcast sent — they came from the journal, so linking back to it would be redundant. They'll receive the next broadcast when a new profile or piece publishes.
- **Broadcasts: when to send** — every new profile. Short personal note (2-3 sentences), one link. Manual. See STRATEGY.md → Two-Touch Sequence for the publishing checklist.

---

## Activation: Day-3 Email

### Option A — Resend Automations (preferred, no infrastructure needed)

1. Go to [resend.com](https://resend.com) → **Automations** → **New Automation**
2. Trigger: **Contact added to audience** → select audience `bc84e16a-40ed-4e6b-bc6e-1396bcb83a92`
3. Add step: **Wait** → 3 days
4. Add step: **Send email** → paste the Day-3 copy above
5. Activate

No code needed. Resend handles the delay and send automatically.

> **Free plan check:** Resend Automations were available on the free tier as of early 2025. If the Automations tab isn't visible in your dashboard, you may need to upgrade to a paid plan — or use Option B.

### Option B — Cron fallback (if Automations not available)

Requires adding a subscriber tracking table. Since HW already has Supabase wired (`wpitqjhvephecfppzvoi`), SL can share it.

**Step 1 — Add table in Supabase SQL Editor:**

```sql
create table sl_nurture_leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  first_name text,
  added_at timestamptz default now(),
  sequence_step integer default 0,
  last_sent_at timestamptz,
  active boolean default true
);
```

**Step 2 — Add Supabase upsert to `/api/subscribe/route.ts`** (after contact created):

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!.trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
);

await supabase.from("sl_nurture_leads").upsert(
  { email, first_name: firstName, sequence_step: 0 },
  { onConflict: "email" }
);
```

**Step 3 — Create `/api/cron/sl-nurture/route.ts`:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET?.trim()}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY!.trim());
  const supabase = createClient(
    process.env.SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
  );

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data: leads } = await supabase
    .from("sl_nurture_leads")
    .select("*")
    .eq("sequence_step", 0)
    .eq("active", true)
    .lte("added_at", threeDaysAgo);

  let sent = 0;
  for (const lead of leads ?? []) {
    const text = `Thanks for being here.

I write about more than other people's businesses.

A few weeks ago I published something more personal — about coming back after a hard few years. The farm we built and sold. The bipolar diagnosis. Three weeks in a psych center. I'm not disappearing, but it took a minute to believe that.

If you're curious: https://southernlegends.blog/journal/im-not-going-to-disappear

Matt`;

    const { error } = await resend.emails.send({
      from: "Matt Headley <noreply@southernlegends.blog>",
      to: lead.email,
      subject: "One more thing",
      text,
    });

    if (!error) {
      await supabase
        .from("sl_nurture_leads")
        .update({ sequence_step: 1, last_sent_at: new Date().toISOString() })
        .eq("id", lead.id);
      sent++;
    }
  }

  return NextResponse.json({ sent });
}
```

**Step 4 — Add to `vercel.json`:**

```json
{
  "crons": [
    { "path": "/api/cron/sl-nurture", "schedule": "0 14 * * *" }
  ]
}
```

**Step 5 — Add env vars to Vercel (SL project):**

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://wpitqjhvephecfppzvoi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | same as HW project |
| `CRON_SECRET` | same as HW project (or generate a new one) |
