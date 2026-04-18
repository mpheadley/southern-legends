import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  let body: { slug: string; name: string; email?: string; message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { slug, name, message, email } = body;

  if (!slug || !name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Use service role key server-side to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error: dbError } = await supabase.from("comments").insert({
    slug,
    name: name.trim(),
    email: email?.trim() || null,
    message: message.trim(),
  });

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }

  // Notify Matt via Resend
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "Southern Legends <noreply@headleyweb.com>",
      to: "matt@headleyweb.com",
      subject: `New comment on /${slug}`,
      html: `
        <p><strong>Name:</strong> ${name.trim()}</p>
        ${email ? `<p><strong>Email:</strong> ${email.trim()}</p>` : ""}
        <p><strong>Message:</strong><br>${message.trim().replace(/\n/g, "<br>")}</p>
        <p><strong>Page:</strong> /${slug}</p>
        <hr>
        <p>Approve it in <a href="https://supabase.com/dashboard">Supabase dashboard</a> — set <code>approved = true</code> to publish.</p>
      `,
    }).catch((err: unknown) => console.error("Resend notify error:", err));
  }

  return NextResponse.json({ success: true });
}
