import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SL_FROM, SL_REPLY_TO } from "@/lib/email-sender";
import { createHmac } from "crypto";

function approveToken(commentId: string, secret: string): string {
  return createHmac("sha256", secret).update(commentId).digest("hex");
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  let body: { slug: string; name: string; email?: string; message: string; notifyReplies?: boolean; trap?: string; openedMs?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { slug, name, message, email, notifyReplies, trap, openedMs } = body;

  // Bot checks: a filled honeypot or a form submitted in under 3s is a bot.
  // Return a generic success so bots can't tell they were filtered.
  if ((trap && trap.trim().length > 0) || (typeof openedMs === "number" && openedMs < 3000)) {
    return NextResponse.json({ ok: true });
  }

  if (!slug || !name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: inserted, error: dbError } = await supabase
    .from("comments")
    .insert({
      slug,
      name: name.trim(),
      email: email?.trim() || null,
      message: message.trim(),
      approved: true,
      notify_replies: notifyReplies && !!email?.trim(),
    })
    .select("id")
    .single();

  if (dbError || !inserted) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }

  // Notify Matt via Resend
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const approveSecret = process.env.COMMENT_APPROVE_SECRET?.trim();

  if (resendKey) {
    const resend = new Resend(resendKey);
    const emailLine = email
      ? `<p><strong>Email:</strong> ${email.trim()}${notifyReplies ? " <em>(wants reply notification)</em>" : ""}</p>`
      : "";

    let approveSection = `<p>Approve it in <a href="https://supabase.com/dashboard">Supabase dashboard</a> — set <code>approved = true</code> to publish.</p>`;
    if (approveSecret) {
      const token = approveToken(inserted.id, approveSecret);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://southernlegends.org";
      const approveUrl = `${siteUrl}/api/comments/approve?id=${inserted.id}&token=${token}`;
      approveSection = `<p style="margin-top:1rem"><a href="${approveUrl}" style="display:inline-block;padding:10px 20px;background:#9A3412;color:white;text-decoration:none;border-radius:4px;font-weight:bold">Approve comment</a></p>`;
    }

    await resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: "matt@headleyweb.com",
      subject: `New comment on /${slug}`,
      html: `
        <p><strong>Name:</strong> ${name.trim()}</p>
        ${emailLine}
        <p><strong>Message:</strong><br>${message.trim().replace(/\n/g, "<br>")}</p>
        <p><strong>Page:</strong> /${slug}</p>
        <hr>
        ${approveSection}
      `,
    }).catch((err: unknown) => console.error("Resend notify error:", err));
  }

  return NextResponse.json({ success: true });
}
