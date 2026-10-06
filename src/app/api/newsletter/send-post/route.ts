import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SL_FROM, SL_REPLY_TO } from "@/lib/email-sender";

const BASE_URL = "https://southernlegends.org";

function buildPostEmail(params: {
  title: string;
  excerpt: string;
  postUrl: string;
  section: string;
  firstName?: string;
}): { html: string; text: string } {
  const { title, excerpt, postUrl, section, firstName } = params;
  const greeting = firstName ? `${firstName},` : "Hey,";
  const fullUrl = postUrl.startsWith("http") ? postUrl : `${BASE_URL}${postUrl}`;
  const sectionLabel = section || "Southern Legends";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#FAFAF7;">

    <!-- Header -->
    <div style="background:#1C1917;padding:24px 32px 20px;border-bottom:2px solid #C4622D;">
      <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C4622D;font-family:system-ui,sans-serif;font-weight:600;">
        ${sectionLabel}
      </p>
      <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(250,250,247,0.4);font-family:system-ui,sans-serif;">
        Southern Legends — Northeast Alabama
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px 32px;">
      <p style="margin:0 0 20px;font-size:16px;color:#292524;line-height:1.7;">${greeting}</p>

      <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;color:#1C1917;line-height:1.25;font-style:italic;">
        ${title}
      </h1>

      <p style="margin:0 0 28px;font-size:16px;color:#44403C;line-height:1.8;">
        ${excerpt}
      </p>

      <a href="${fullUrl}"
         style="display:inline-block;padding:13px 28px;background:#C4622D;color:#ffffff;text-decoration:none;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.04em;border-radius:4px;">
        Read the full piece →
      </a>

      <p style="margin:32px 0 0;font-size:14px;color:#78716C;line-height:1.7;">
        Matt Headley<br>
        <a href="${BASE_URL}" style="color:#C4622D;text-decoration:none;">southernlegends.org</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#F0EDE8;border-top:1px solid #E7E5E4;">
      <p style="margin:0;font-size:11px;color:#A8A29E;font-family:system-ui,sans-serif;line-height:1.6;">
        You're getting this because you subscribed to Southern Legends.
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#9A3412;">Unsubscribe</a>.
      </p>
    </div>

  </div>
</body>
</html>`;

  const text = `${greeting}

${title}

${excerpt}

Read the full piece: ${fullUrl}

—
Matt Headley
southernlegends.org

Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`;

  return { html, text };
}

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SEND_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

  if (!resendKey || !audienceId) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  let body: { title: string; excerpt: string; postUrl: string; section?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, excerpt, postUrl, section = "New" } = body;

  if (!title?.trim() || !excerpt?.trim() || !postUrl?.trim()) {
    return NextResponse.json({ error: "title, excerpt, and postUrl are required" }, { status: 400 });
  }

  const resend = new Resend(resendKey);
  const { html, text } = buildPostEmail({ title, excerpt, postUrl, section });
  const subject = `${title} — Southern Legends`;
  const broadcastName = `SL Post — ${title.slice(0, 60)} — ${new Date().toISOString().slice(0, 10)}`;

  const createResult = await resend.broadcasts.create({
    audienceId,
    from: SL_FROM,
    replyTo: SL_REPLY_TO,
    subject,
    html,
    text,
    name: broadcastName,
  });

  if (createResult.error) {
    return NextResponse.json({ error: createResult.error.message }, { status: 500 });
  }

  const broadcastId = createResult.data?.id;
  if (!broadcastId) {
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }

  const sendResult = await resend.broadcasts.send(broadcastId);

  if (sendResult.error) {
    return NextResponse.json({ error: sendResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, broadcastId, subject });
}
