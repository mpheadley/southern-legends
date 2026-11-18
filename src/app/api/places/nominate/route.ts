import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { SL_FROM, SL_REPLY_TO } from "@/lib/email-sender"
import { isHoneypotFilled, verifyTurnstile } from "@/lib/turnstile"
import { junkReason } from "@/lib/junk"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const LIMITS = { business_name: 120, city: 120, your_name: 120, your_email: 254, website: 500, reason: 2000 } as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function field(data: FormData, name: keyof typeof LIMITS): string {
  const raw = data.get(name)
  if (typeof raw !== "string") return ""
  return raw.trim().slice(0, LIMITS[name])
}

/** Only an http(s) URL is accepted; anything else is dropped (the field is optional). */
function safeWebsite(raw: string): string | null {
  if (!raw) return ""
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(candidate)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const redirectTo = (query: string) => NextResponse.redirect(new URL(`/places/nominate?${query}`, req.url), 303)

  let data: FormData
  try {
    data = await req.formData()
  } catch {
    return redirectTo("error=invalid")
  }

  // Honeypot: hidden "company" field, empty for people. Accept-but-drop so bots don't retry.
  if (isHoneypotFilled(data.get("company"))) {
    console.log("[places/nominate] dropped honeypot submission")
    return redirectTo("success=1")
  }

  const captcha = await verifyTurnstile(
    data.get("cf-turnstile-response")?.toString(),
    req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  )
  if (!captcha.ok) return redirectTo("error=captcha")

  const fields = {
    business_name: field(data, "business_name"),
    city: field(data, "city"),
    website: field(data, "website"),
    your_name: field(data, "your_name"),
    your_email: field(data, "your_email"),
    reason: field(data, "reason"),
  }

  if (!fields.business_name || !fields.city || !fields.your_name || !fields.your_email || !fields.reason) {
    return redirectTo("error=missing")
  }
  if (!EMAIL_RE.test(fields.your_email)) return redirectTo("error=email")

  const junk = junkReason({ name: fields.your_name, email: fields.your_email, message: fields.reason })
  if (junk) {
    console.log(`[places/nominate] dropped junk (${junk})`)
    return redirectTo("success=1")
  }

  const website = safeWebsite(fields.website)
  if (website === null) return redirectTo("error=website")

  if (!resend) {
    console.error("[places/nominate] RESEND_API_KEY not set; nomination not delivered")
    return redirectTo("error=send")
  }

  const e = {
    business_name: escapeHtml(fields.business_name),
    city: escapeHtml(fields.city),
    website: escapeHtml(website),
    your_name: escapeHtml(fields.your_name),
    your_email: escapeHtml(fields.your_email),
    reason: escapeHtml(fields.reason).replace(/\r?\n/g, "<br />"),
  }

  try {
    const { error } = await resend.emails.send({
      from: SL_FROM,
      replyTo: fields.your_email || SL_REPLY_TO,
      to: "matt@gatherstudio.app",
      subject: `SL Places nomination: ${fields.business_name} in ${fields.city}`,
      html: `
        <h2>New SL Places Nomination</h2>
        <p><strong>Business:</strong> ${e.business_name}</p>
        <p><strong>City:</strong> ${e.city}</p>
        ${website ? `<p><strong>Website:</strong> <a href="${e.website}">${e.website}</a></p>` : ""}
        <p><strong>Submitted by:</strong> ${e.your_name} (${e.your_email})</p>
        <hr />
        <p><strong>Why they belong:</strong></p>
        <p>${e.reason}</p>
      `,
      text: [
        "New SL Places Nomination",
        "",
        `Business: ${fields.business_name}`,
        `City: ${fields.city}`,
        website ? `Website: ${website}` : null,
        `Submitted by: ${fields.your_name} (${fields.your_email})`,
        "",
        "Why they belong:",
        fields.reason,
      ].filter((line) => line !== null).join("\n"),
    })
    if (error) {
      console.error("[places/nominate] Resend error:", error)
      return redirectTo("error=send")
    }
  } catch (err) {
    console.error("[places/nominate] send failed:", err)
    return redirectTo("error=send")
  }

  return redirectTo("success=1")
}
