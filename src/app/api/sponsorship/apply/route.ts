import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { SL_FROM } from "@/lib/email-sender"
import { junkReason, rateLimited } from "@/lib/junk"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  let body: {
    businessName: string
    city: string
    email: string
    phone?: string
    tier?: string
    message?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { businessName, city, email, phone, tier = "city", message } = body

  if (!businessName || !city || !email) {
    return NextResponse.json({ error: "businessName, city, and email are required" }, { status: 400 })
  }
  if (rateLimited(request, "sponsorship-apply")) return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 })
  if (junkReason({ name: businessName, email, message })) {
    return NextResponse.json({ success: true })
  }

  if (resend) {
    await resend.emails.send({
      from: SL_FROM,
      replyTo: email,
      to: "matt@gatherstudio.app",
      subject: `SL Sponsorship inquiry — ${city} — ${businessName}`,
      text: [
        `New sponsorship inquiry.`,
        ``,
        `Business: ${businessName}`,
        `City: ${city}`,
        `Tier: ${tier}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        message ? `\nMessage: ${message}` : "",
      ].filter(Boolean).join("\n"),
    }).catch((err: Error) => console.error("Sponsorship notify error:", err))
  }

  return NextResponse.json({
    success: true,
    message: "We'll be in touch within 48 hours.",
  })
}
