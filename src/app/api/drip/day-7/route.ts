import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SL_FROM, SL_REPLY_TO } from '@/lib/email-sender'
import { unsubscribeFooterHtml, unsubscribeFooterText } from '@/lib/unsubscribe'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// POST /api/drip/day-7 { email, firstName? }
// Called 7 days after subscribe — forward ask (no money ask this early)
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey || !resend) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
  }

  let body: { email: string; firstName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = body.email?.trim()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const greeting = body.firstName ? `${body.firstName},` : 'Hey,'

  const html = `
    <p>${greeting}</p>
    <p>You've been on the list a week now. Thanks for that.</p>
    <p>If one of these was worth your time, forward it to one person who'd like it. That's how this grows, one reader at a time, mostly around here.</p>
    <p>If someone forwarded this to you, you can get the next one here:<br>
    <a href="https://southernlegends.org/subscribe?source=forward">southernlegends.org/subscribe</a></p>
    <p>Matt</p>
    ${unsubscribeFooterHtml(email)}
  `

  const text = `${greeting}

You've been on the list a week now. Thanks for that.

If one of these was worth your time, forward it to one person who'd like it. That's how this grows, one reader at a time, mostly around here.

If someone forwarded this to you, you can get the next one here:
https://southernlegends.org/subscribe?source=forward

Matt${unsubscribeFooterText(email)}`

  const { error } = await resend.emails.send({
    from: SL_FROM,
    replyTo: SL_REPLY_TO,
    to: email,
    subject: 'One small favor',
    html,
    text,
  })

  if (error) {
    console.error('[drip/day-7] Resend error:', error)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
