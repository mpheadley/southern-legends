import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { SL_FROM, SL_REPLY_TO } from "@/lib/email-sender"

const SL_NEWSLETTER_AUDIENCE_ID = "bc84e16a-40ed-4e6b-bc6e-1396bcb83a92"
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
  }

  let body: { email: string; city: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim()
  const city = body.city?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }
  if (!city) {
    return NextResponse.json({ error: "City required" }, { status: 400 })
  }

  try {
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: SL_NEWSLETTER_AUDIENCE_ID,
    })

    if (error) {
      console.error("Resend contacts error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    await resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: email,
      subject: `The ${city} Letter — you're in`,
      html: `<p>You're on the list for The ${city} Letter.</p><p>When something worth knowing happens in ${city}, Alabama — a story, an event, a business worth knowing — you'll hear about it. Not on a schedule. When it's ready.</p><p><a href="https://southernlegends.org/places/${city.toLowerCase().replace(/\s+/g, "-")}">See what's happening in ${city} →</a></p><p>Matt Headley<br>Southern Legends</p>`,
      text: `You're on the list for The ${city} Letter.\n\nWhen something worth knowing happens in ${city}, Alabama — you'll hear about it.\n\nhttps://southernlegends.org/places/${city.toLowerCase().replace(/\s+/g, "-")}\n\nMatt Headley\nSouthern Legends`,
    }).catch((err: Error) => console.error("Welcome email error:", err))

    await resend.emails.send({
      from: SL_FROM,
      replyTo: SL_REPLY_TO,
      to: "matt@gatherstudio.app",
      subject: `City newsletter signup — ${city}`,
      text: `New subscriber.\n\nEmail: ${email}\nCity: ${city}`,
    }).catch((err: Error) => console.error("Notify error:", err))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Subscribe error:", err)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
