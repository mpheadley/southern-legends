import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let body: { email: string; firstName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const firstName = body.firstName?.trim() ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
