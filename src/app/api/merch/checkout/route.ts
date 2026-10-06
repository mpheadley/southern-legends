import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })
  : null

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const { cart, bundleDiscount } = await req.json() as {
    cart: { id: string; name: string; size?: string; price: number; qty: number }[]
    bundleDiscount?: number
  }

  if (!cart?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const origin = req.headers.get('origin') ?? 'https://southernlegends.org'

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map((item) => ({
    price_data: {
      currency: 'usd',
      unit_amount: item.price * 100,
      product_data: {
        name: item.name + (item.size ? ` — ${item.size}` : ''),
        description: item.id.includes('sticker')
          ? 'Sticker · Vinyl · Weather-resistant'
          : 'Pre-order · Ships 2–3 weeks after Woodstock 5K (Aug 2)',
      },
    },
    quantity: item.qty,
  }))

  // Bundle discount as a negative line item
  if (bundleDiscount && bundleDiscount > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        unit_amount: -Math.round(bundleDiscount * 100),
        product_data: { name: 'Bundle Discount (20% off 3+ shirts)' },
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${origin}/merch?success=1`,
    cancel_url: `${origin}/merch`,
    metadata: { items: cart.length.toString(), bundle: bundleDiscount ? '1' : '0' },
    shipping_address_collection: { allowed_countries: ['US'] },
  })

  return NextResponse.json({ url: session.url })
}
