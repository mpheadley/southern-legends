import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SL_FROM, SL_REPLY_TO, SL_NOTIFY_TO } from "@/lib/email-sender";
import { unsubscribeUrl, unsubscribeFooterHtml, unsubscribeFooterText } from "@/lib/unsubscribe";

// Same bot filter as Aisle's is_bot_email() (tools/aisle-network-email-drip.py) —
// known bot/crawler domains + the dotted-segment gmail pattern (x.x.x.x@gmail.com).
const BOT_DOMAINS = new Set(["sagemindai.io", "xwf.google.com"]);
function isBotEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (BOT_DOMAINS.has(domain)) return true;
  if (domain === "gmail.com") {
    const local = email.split("@")[0];
    if (/^[a-z0-9](\.[a-z0-9]+){4,}$/i.test(local)) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let body: { email: string; firstName?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const firstName = body.firstName?.trim() ?? "";
  const source = body.source?.trim() ?? "unknown";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Silently accept-but-drop bots — return success so scrapers don't learn to retry,
  // but never add them to the audience or fire the drip.
  if (isBotEmail(email)) {
    console.log(`[subscribe] dropped bot-pattern email: ${email}`);
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.contacts.create({
      email,
      firstName,
      unsubscribed: false,
      audienceId,
    });

    if (error) {
      console.error("Resend contacts error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    // Every welcome/drip email: same verified sender, reply goes to Matt,
    // and a working unsubscribe link (src/app/api/unsubscribe).
    const greeting = firstName ? `${firstName},` : "Hey,";
    const unsubUrl = unsubscribeUrl(email);
    const listHeaders = {
      "List-Unsubscribe": `<${unsubUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    };

    // Day 0 welcome
    const welcomeHtml = `
      <p>${greeting}</p>
      <p>Thanks for subscribing.</p>
      <p>I'm Matt. I build websites for small businesses here in Northeast Alabama, and somewhere in the middle of that work I started writing about the people I met.</p>
      <p>More stories are here when you're ready:<br>
      <a href="https://southernlegends.org/profiles">southernlegends.org/profiles</a></p>
      <p>About twice a month. If I don't have one worth your time, I skip it.</p>
      <p>Hit reply and tell me where you're reading from. I like knowing.</p>
      <p>Matt Headley<br>
      <a href="https://southernlegends.org">southernlegends.org</a></p>
      ${unsubscribeFooterHtml(email)}
    `;
    const welcomeText = `${greeting}

Thanks for subscribing.

I'm Matt. I build websites for small businesses here in Northeast Alabama, and somewhere in the middle of that work I started writing about the people I met.

More stories are here when you're ready:
https://southernlegends.org/profiles

About twice a month. If I don't have one worth your time, I skip it.

Hit reply and tell me where you're reading from. I like knowing.

Matt Headley
southernlegends.org${unsubscribeFooterText(email)}`;

    await resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: email,
      subject: "You're in",
      html: welcomeHtml,
      text: welcomeText,
      headers: listHeaders,
    }).catch((err) => console.error("Welcome email error:", err));

    // Notify Matt of new subscriber + source
    await resend.emails.send({
      from: SL_FROM,
      to: SL_NOTIFY_TO,
      subject: `New SL subscriber — ${source}`,
      text: `New subscriber on Southern Legends.\n\nEmail: ${email}\nName: ${firstName || "not provided"}\nSource: ${source}`,
    }).catch((err) => console.error("Subscriber notify error:", err));

    // Day 3: Noble Street. Scheduled through Resend's scheduledAt.
    resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: email,
      subject: "One block in Anniston",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      headers: listHeaders,
      html: `<p>${greeting}</p><p>A few days ago you signed up. Thought I'd point you somewhere specific.</p><p>The Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama. A florist. A pastor who preached about hospital socks. A market that became something else.</p><p><a href="https://southernlegends.org/journal/noble-street-anniston">Start with Noble Street →</a></p><p>There are also city pages if you want to find what's been written about a place you know:</p><p><a href="https://southernlegends.org/places">Browse by city →</a></p><p>Matt</p>${unsubscribeFooterHtml(email)}`,
      text: `${greeting}\n\nA few days ago you signed up. Thought I'd point you somewhere specific.\n\nThe Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama. A florist. A pastor who preached about hospital socks. A market that became something else.\n\nhttps://southernlegends.org/journal/noble-street-anniston\n\nThere are also city pages:\nhttps://southernlegends.org/places\n\nMatt${unsubscribeFooterText(email)}`,
    }).catch((err) => console.error('[drip/day-3] schedule error:', err))

    // Day 7: forward ask. No money ask this early.
    resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: email,
      subject: "One small favor",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      headers: listHeaders,
      html: `<p>${greeting}</p><p>You've been on the list a week now. Thanks for that.</p><p>If one of these was worth your time, forward it to one person who'd like it. That's how this grows, one reader at a time, mostly around here.</p><p>If someone forwarded this to you, you can get the next one here:<br><a href="https://southernlegends.org/subscribe?source=forward">southernlegends.org/subscribe</a></p><p>Matt</p>${unsubscribeFooterHtml(email)}`,
      text: `${greeting}\n\nYou've been on the list a week now. Thanks for that.\n\nIf one of these was worth your time, forward it to one person who'd like it. That's how this grows, one reader at a time, mostly around here.\n\nIf someone forwarded this to you, you can get the next one here:\nhttps://southernlegends.org/subscribe?source=forward\n\nMatt${unsubscribeFooterText(email)}`,
    }).catch((err) => console.error('[drip/day-7] schedule error:', err))

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
