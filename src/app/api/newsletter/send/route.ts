import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  let body: { subject: string; html: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { subject, html } = body;

  if (!subject?.trim() || !html?.trim()) {
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
  }

  const resend = new Resend(resendKey);

  const createResult = await resend.broadcasts.create({
    audienceId,
    from: "Southern Legends <noreply@southernlegends.blog>",
    subject: subject.trim(),
    html: html.trim(),
    name: `SL - ${subject.trim()} - ${new Date().toISOString().slice(0, 10)}`,
  });

  if (createResult.error) {
    console.error("Broadcast create error:", createResult.error);
    return NextResponse.json({ error: createResult.error.message }, { status: 500 });
  }

  const broadcastId = createResult.data?.id;
  if (!broadcastId) {
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }

  const sendResult = await resend.broadcasts.send(broadcastId);

  if (sendResult.error) {
    console.error("Broadcast send error:", sendResult.error);
    return NextResponse.json({ error: sendResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, broadcastId });
}
