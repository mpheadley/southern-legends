import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SL_FROM, SL_REPLY_TO } from '@/lib/email-sender'
import { unsubscribeFooterHtml, unsubscribeFooterText } from '@/lib/unsubscribe'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// POST /api/drip/day-3 { email, firstName? }
// Called 3 days after subscribe — Noble Street series intro + best essays
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
    <p>A few days ago you signed up. Thought I'd point you somewhere specific.</p>
    <p>The Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama.
    A florist. A pastor who preached about hospital socks. A market that became something else.</p>
    <p><a href="https://southernlegends.org/journal/noble-street-anniston">Start with Noble Street →</a></p>
    <p>There are also city pages if you want to find what's been written about a place you know:</p>
    <p><a href="https://southernlegends.org/places">Browse by city →</a></p>
    <p>Matt</p>
    ${unsubscribeFooterHtml(email)}
  `

  const text = `${greeting}

A few days ago you signed up. Thought I'd point you somewhere specific.

The Noble Street project is the one I keep coming back to — stories from one block in Anniston, Alabama. A florist. A pastor who preached about hospital socks. A market that became something else.

Start here: https://southernlegends.org/journal/noble-street-anniston

There are also city pages if you want to find what's been written about a place you know:
https://southernlegends.org/places

Matt${unsubscribeFooterText(email)}`

  const { error } = await resend.emails.send({
    from: SL_FROM,
    replyTo: SL_REPLY_TO,
    to: email,
    subject: 'One block in Anniston',
    html,
    text,
  })

  if (error) {
    console.error('[drip/day-3] Resend error:', error)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
