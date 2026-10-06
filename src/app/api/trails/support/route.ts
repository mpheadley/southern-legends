import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" })
  : null

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://southernlegends.org"
const SL_FEE_PERCENT = 15

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })

  const { trail_slug, trail_name, amount } = await req.json()
  if (!trail_slug || !amount || amount < 5) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const amountCents = Math.round(amount * 100)

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        unit_amount: amountCents,
        product_data: {
          name: `Support ${trail_name}`,
          description: `Trail maintenance, repairs, and improvements. Southern Legends keeps a ${SL_FEE_PERCENT}% platform fee; the remainder goes directly to the trail organization.`,
        },
      },
      quantity: 1,
    }],
    success_url: `${BASE_URL}/trails/${trail_slug}?supported=1`,
    cancel_url: `${BASE_URL}/trails/${trail_slug}#support`,
    metadata: { trail_slug, trail_name, type: "trail_support" },
  })

  return NextResponse.json({ url: session.url })
}
