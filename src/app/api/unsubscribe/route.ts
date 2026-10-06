import { NextRequest } from "next/server";
import { Resend } from "resend";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const dynamic = "force-dynamic";

function page(title: string, body: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Southern Legends</title></head>
<body style="margin:0;background:#F7F5F2;font-family:Georgia,serif;color:#292524;">
  <div style="max-width:520px;margin:0 auto;padding:72px 24px;">
    <p style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C4622D;font-family:'Courier New',monospace;margin:0 0 16px;">Southern Legends</p>
    <h1 style="font-size:28px;font-weight:400;line-height:1.3;margin:0 0 16px;">${title}</h1>
    <p style="font-size:17px;line-height:1.7;margin:0 0 28px;">${body}</p>
    <a href="https://southernlegends.org" style="color:#9A3412;font-size:16px;">Back to southernlegends.org</a>
  </div>
</body>
</html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

async function handle(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e")?.trim().toLowerCase() ?? "";
  const token = req.nextUrl.searchParams.get("t")?.trim() ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return page(
      "That link didn't work.",
      "The unsubscribe link looks broken or incomplete. Reply to any of my emails, or write matt@gatherstudio.app, and I'll take you off the list by hand.",
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) {
    console.error("[unsubscribe] Resend not configured");
    return page(
      "Something went wrong on my end.",
      "I couldn't reach the mailing list just now. Write matt@gatherstudio.app and I'll take you off by hand.",
      500,
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.contacts.update({ audienceId, email, unsubscribed: true });
  if (error) {
    console.error("[unsubscribe] Resend error:", error);
    return page(
      "Something went wrong on my end.",
      "I couldn't update the list just now. Write matt@gatherstudio.app and I'll take you off by hand.",
      500,
    );
  }

  console.log(JSON.stringify({ event: "sl_unsubscribe", email, at: new Date().toISOString() }));
  return page("You're unsubscribed.", "Sorry to see you go. Thanks for reading.", 200);
}

export async function GET(req: NextRequest) {
  return handle(req);
}

// One-click unsubscribe (RFC 8058) from the List-Unsubscribe header.
export async function POST(req: NextRequest) {
  return handle(req);
}
