import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { upsertSubscriber, updateSubscriberStatus } from '@/lib/subscribers'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { SL_FROM, SL_REPLY_TO, SL_NOTIFY_TO } from '@/lib/email-sender'

// The $5 reader (and legacy $10/$20 patron) checkout sets these in
// src/app/api/patron/checkout/route.ts. Only these become active members.
function isPatronSession(session: Stripe.Checkout.Session): boolean {
  return (
    session.metadata?.venture === 'southern-legends' &&
    (session.metadata?.tier ?? '').startsWith('patron-')
  )
}

// One-time checkout kinds this site creates itself. Anything else in
// mode=payment with no metadata is treated as a one-time gift (payment link).
function paymentKind(session: Stripe.Checkout.Session): string {
  const m = session.metadata ?? {}
  if (m.book) return 'book'
  if (m.items) return 'merch'
  if (m.type) return m.type
  return 'gift'
}

async function sendEmail(params: { to: string; subject: string; text: string; html?: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return
  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: SL_FROM,
    replyTo: params.replyTo ?? SL_REPLY_TO,
    to: params.to,
    subject: params.subject,
    text: params.text,
    ...(params.html ? { html: params.html } : {}),
  })
  if (error) console.error('[stripe-webhook] email error:', error)
}

function thanksBody(firstName: string, monthly: boolean) {
  const hi = firstName ? `${firstName},` : 'Hey,'
  const line = monthly
    ? "Your $5 a month is set up. That covers the gas, the memory card, and the afternoon it takes to sit with somebody. I don't take that lightly."
    : "Your gift came through. It goes to the gas, the memory card, and the afternoon it takes to sit with somebody. I don't take that lightly."
  const cancel = monthly
    ? '\n\nIf you ever need to cancel, just reply to this email and I\'ll take care of it.'
    : ''
  const text = `${hi}\n\nThank you.\n\n${line}\n\nSouthern Legends stays free to read because of people like you.${cancel}\n\nIf there's somebody in Northeast Alabama you think I ought to go sit with, hit reply and tell me.\n\nMatt Headley\nhttps://southernlegends.org`
  const html = text
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
  return { text, html }
}

// Lazy-initialize to avoid build-time failure when env vars aren't set
function getStripe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' as any })
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Log trail support donations
        if (session.metadata?.type === 'trail_support') {
          await supabase.from('trail_support').insert({
            trail_slug: session.metadata.trail_slug,
            trail_name: session.metadata.trail_name,
            amount_cents: session.amount_total ?? 0,
            stripe_session_id: session.id,
          })
          break
        }

        const email = session.customer_details?.email ?? session.customer_email
        const firstName = (session.customer_details?.name ?? '').trim().split(/\s+/)[0] ?? ''
        const amount = ((session.amount_total ?? 0) / 100).toFixed(2)

        // One-time payments: no table for these yet, so log a structured line
        // (Vercel logs) and tell Matt by email.
        if (session.mode === 'payment') {
          const kind = paymentKind(session)
          console.log(JSON.stringify({
            event: 'sl_one_time_payment',
            kind,
            amount_cents: session.amount_total ?? 0,
            currency: session.currency,
            email: email ?? null,
            session_id: session.id,
            payment_link: session.payment_link ?? null,
            metadata: session.metadata ?? {},
            at: new Date().toISOString(),
          }))
          if (kind === 'gift') {
            await sendEmail({
              to: SL_NOTIFY_TO,
              subject: `SL one-time gift: $${amount}`,
              text: `One-time gift on Southern Legends.\n\nAmount: $${amount}\nEmail: ${email ?? 'not provided'}\nName: ${session.customer_details?.name ?? 'not provided'}\nSession: ${session.id}`,
            })
            // Thank-you only for the SL support payment link, so a payment link
            // from another venture on the same Stripe account never gets an SL note.
            const supportLinkId = process.env.STRIPE_SUPPORT_PAYMENT_LINK_ID?.trim()
            const linkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link?.id
            if (email && supportLinkId && linkId === supportLinkId) {
              const { text, html } = thanksBody(firstName, false)
              await sendEmail({ to: email, subject: 'Thank you', text, html })
            }
          }
          break
        }

        if (session.mode !== 'subscription') break

        // Only the reader/patron product makes someone an active member.
        // Sponsor and other subscriptions are logged, not added to `subscribers`.
        if (!isPatronSession(session)) {
          console.log(JSON.stringify({
            event: 'sl_non_patron_subscription',
            tier: session.metadata?.tier ?? null,
            source: session.metadata?.source ?? null,
            email: email ?? null,
            session_id: session.id,
            at: new Date().toISOString(),
          }))
          break
        }

        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        if (!email) break

        // Get full subscription to confirm status
        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        await upsertSubscriber({
          email,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: sub.status === 'active' ? 'active' : 'past_due',
        })

        // /support/thanks promises a confirmation email.
        const { text, html } = thanksBody(firstName, true)
        await sendEmail({ to: email, subject: 'Thank you', text, html })
        await sendEmail({
          to: SL_NOTIFY_TO,
          subject: `New SL reader: ${session.metadata?.tier ?? 'patron'} ($${amount})`,
          text: `New monthly reader on Southern Legends.\n\nTier: ${session.metadata?.tier}\nAmount: $${amount}\nEmail: ${email}\nName: ${session.customer_details?.name ?? 'not provided'}`,
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const status =
          sub.status === 'active' ? 'active' :
          sub.status === 'canceled' ? 'canceled' : 'past_due'
        await updateSubscriberStatus(sub.id, status)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await updateSubscriberStatus(sub.id, 'canceled')
        break
      }
    }
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
