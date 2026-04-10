# Southern Legends — Post-Profile Follow-Up

Two touches. Don't combine them. The gap matters.

**Always use the full URL with `https://`** — iMessage won't generate a preview or clickable link without it. Never share as `southernlegends.blog/...` alone.

---

## Touch 1: Profile Delivery (Day of Publish)

Pure gift. No ask. No hint of an ask.

> Hey [Name], your profile just went live on Southern Legends. Really enjoyed writing about [specific detail from their story]. Here's the link: https://southernlegends.blog/profiles/[slug]
>
> Hope it does your story justice.

That's it. Don't add "let me know what you think" or "feel free to share." They will if they want to.

---

## Touch 2: Follow-Up (5–7 Days Later)

Pick ONE version based on the person. Never combine the referral ask and the website offer in the same message.

### Version A — Business Owner (Web/Marketing Offer)

Use when: they own a business and their web presence has a clear gap you can name.

> Hey [Name], glad people connected with your profile. A few folks reached out after reading it.
>
> I noticed [one specific thing — "your Google listing doesn't show up for [search term]" / "your site doesn't load on mobile" / "you don't have a website yet"]. I'm building sites for local businesses right now and waiving my build fee for the first few. Want me to take a look?
>
> No pressure either way. Just figured I'd mention it since I was already looking at your stuff for the profile.

Key: name one real thing. Not "I could help with your online presence." That's a brochure line.

### Version B — Business Owner (Referral Ask)

Use when: they already have a decent website, or you don't want to pitch them directly.

> Hey [Name], your profile got some good traction. Appreciate you being part of it.
>
> I'm building websites for local businesses — if you know anyone who's been needing a site or whose site is hurting them, I'd love an intro. I'm waiving my build fee for the first few in exchange for a case study.

### Version C — Non-Business (Referral Only)

Use when: community figure, educator, nonprofit leader, place profile — no direct web services pitch.

> Hey [Name], your profile has been getting shared around, which is cool to see.
>
> I'm also doing web design for local businesses. If you know a business owner or someone with a side hustle who needs a website or more calls from Google, I'd love an intro.

---

## Rules

1. **Touch 1 is sacred.** The profile is a gift. Any hint of a pitch on delivery day poisons the well.
2. **Pick one ask.** Either offer your services OR ask for a referral. Not both.
3. **Name something specific.** "Your Google listing" beats "your online presence." "Doesn't load on mobile" beats "could use some work."
4. **Keep it short.** These should feel like texts from a friend, not email campaigns.
5. **Track it.** After sending, update the CRM:
   - `sl_profile_published` — date the profile went live
   - `sl_followup_sent` — set to 1 after Touch 2 is sent
   - `follow_up_date` — set to 5-7 days after publish for Touch 2 reminder

---

## CRM Quick Commands

```bash
# Mark profile as published today
sqlite3 ~/Developer/webdev/crm/crm.db "UPDATE contacts SET sl_profile_published = date('now') WHERE name LIKE '%Name%'"

# Set follow-up reminder for 7 days out
sqlite3 ~/Developer/webdev/crm/crm.db "UPDATE contacts SET follow_up_date = date('now', '+7 days') WHERE name LIKE '%Name%'"

# Mark follow-up as sent
sqlite3 ~/Developer/webdev/crm/crm.db "UPDATE contacts SET sl_followup_sent = 1, last_contacted = date('now') WHERE name LIKE '%Name%'"

# See who needs follow-up (published but not yet followed up)
sqlite3 ~/Developer/webdev/crm/crm.db "SELECT name, sl_profile_published FROM contacts WHERE sl_profile_published IS NOT NULL AND sl_followup_sent = 0"
```
