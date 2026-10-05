import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

    // Welcome email — best-effort, doesn't block subscribe success
    const greeting = firstName ? `${firstName},` : "Hey,";
    const welcomeHtml = `
      <p>${greeting}</p>
      <p>Thanks for subscribing.</p>
      <p>I'm Matt. I build websites for small businesses here in Northeast Alabama, and somewhere in the middle of that work I started writing about the people I met.</p>
      <p>More stories are here when you're ready:<br>
      <a href="https://southernlegends.org/profiles">southernlegends.org/profiles</a></p>
      <p>Profiles go out when they're ready. I'm not chasing a schedule.</p>
      <p>Matt Headley<br>
      <a href="https://southernlegends.org">southernlegends.org</a></p>
    `;
    const welcomeText = `${greeting}

Thanks for subscribing.

I'm Matt. I build websites for small businesses here in Northeast Alabama, and somewhere in the middle of that work I started writing about the people I met.

More stories are here when you're ready:
https://southernlegends.org/profiles

Profiles go out when they're ready. I'm not chasing a schedule.

Matt Headley
southernlegends.org`;

    await resend.emails.send({
      from: "Matt Headley <noreply@gatherstudio.app>",
      to: email,
      subject: "You're in",
      html: welcomeHtml,
      text: welcomeText,
    }).catch((err) => console.error("Welcome email error:", err));

    // Notify Matt of new subscriber + source
    await resend.emails.send({
      from: "Southern Legends <noreply@gatherstudio.app>",
      to: "matt@gatherstudio.app",
      subject: `New SL subscriber — ${source}`,
      text: `New subscriber on Southern Legends.\n\nEmail: ${email}\nName: ${firstName || "not provided"}\nSource: ${source}`,
    }).catch((err) => console.error("Subscriber notify error:", err));

    // Schedule Day 3 + Day 7 drip — fire-and-forget via Resend scheduled sends
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://southernlegends.org'
    const dripPayload = JSON.stringify({ email, firstName })
    // Day 3: 3 days = 259200s delay — we use Resend's scheduledAt for reliable delivery
    resend.emails.send({
      from: "Matt Headley <noreply@gatherstudio.app>",
      to: email,
      subject: "One block in Anniston",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      html: `<p>${firstName ? `${firstName},` : 'Hey,'}</p><p>A few days ago you signed up. Thought I'd point you somewhere specific.</p><p>The Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama. A florist. A pastor who preached about hospital socks. A market that became something else.</p><p><a href="https://southernlegends.org/journal/noble-street-anniston">Start with Noble Street →</a></p><p>There are also city pages if you want to find what's been written about a place you know:</p><p><a href="https://southernlegends.org/places">Browse by city →</a></p><p>Matt</p>`,
      text: `${firstName ? `${firstName},` : 'Hey,'}\n\nA few days ago you signed up. Thought I'd point you somewhere specific.\n\nThe Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama. A florist. A pastor who preached about hospital socks. A market that became something else.\n\nhttps://southernlegends.org/journal/noble-street-anniston\n\nThere are also city pages:\nhttps://southernlegends.org/places\n\nMatt`,
    }).catch((err) => console.error('[drip/day-3] schedule error:', err))

    // Day 7: $4.99 Reader pitch
    resend.emails.send({
      from: "Matt Headley <noreply@gatherstudio.app>",
      to: email,
      subject: "If you want to help keep this going",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      html: `<p>${firstName ? `${firstName},` : 'Hey,'}</p><p>Southern Legends is free to read. It's always going to be free to read.</p><p>But if you've found something here worth keeping, there's a Reader tier for $4.99/month that helps me keep doing this.</p><p>What it is: you help cover the time it takes to write this. That's the whole pitch.</p><p><a href="https://southernlegends.org/subscribe">Become a Reader ($4.99/mo) →</a></p><p>If not, no change. The free feed keeps going. I'm glad you're here either way.</p><p>Matt</p>`,
      text: `${firstName ? `${firstName},` : 'Hey,'}\n\nSouthern Legends is free to read. It's always going to be free to read.\n\nBut if you've found something here worth keeping, there's a Reader tier for $4.99/month that helps me keep doing this.\n\nWhat it is: you help cover the time it takes to write this. That's the whole pitch.\n\nBecome a Reader ($4.99/mo): https://southernlegends.org/subscribe\n\nIf not, no change. The free feed keeps going. I'm glad you're here either way.\n\nMatt`,
    }).catch((err) => console.error('[drip/day-7] schedule error:', err))

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
