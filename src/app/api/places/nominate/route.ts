import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { SL_FROM, SL_REPLY_TO } from "@/lib/email-sender"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const fields = {
    business_name: data.get("business_name")?.toString().trim() ?? "",
    city: data.get("city")?.toString().trim() ?? "",
    website: data.get("website")?.toString().trim() ?? "",
    your_name: data.get("your_name")?.toString().trim() ?? "",
    your_email: data.get("your_email")?.toString().trim() ?? "",
    reason: data.get("reason")?.toString().trim() ?? "",
  }

  if (!fields.business_name || !fields.your_name || !fields.your_email || !fields.reason) {
    return NextResponse.redirect(new URL("/places/nominate?error=missing", req.url))
  }

  await resend?.emails.send({
    from: SL_FROM,
    replyTo: fields.your_email || SL_REPLY_TO,
    to: "matt@gatherstudio.app",
    subject: `SL Places nomination: ${fields.business_name} in ${fields.city}`,
    html: `
      <h2>New SL Places Nomination</h2>
      <p><strong>Business:</strong> ${fields.business_name}</p>
      <p><strong>City:</strong> ${fields.city}</p>
      ${fields.website ? `<p><strong>Website:</strong> <a href="${fields.website}">${fields.website}</a></p>` : ""}
      <p><strong>Submitted by:</strong> ${fields.your_name} (${fields.your_email})</p>
      <hr />
      <p><strong>Why they belong:</strong></p>
      <p>${fields.reason}</p>
    `,
  })

  return NextResponse.redirect(new URL("/places/nominate?success=1", req.url))
}
