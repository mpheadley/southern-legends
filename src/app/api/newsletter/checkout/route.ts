import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" })
  : null;

// $7/mo paid newsletter tier — Headley Ventures account (acct_1TQaSb…)
// Set STRIPE_NEWSLETTER_PRICE_ID in Vercel env vars after creating the price:
//   stripe prices create --unit-amount 700 --currency usd --recurring interval=month \
//     --product-data name="Southern Legends Newsletter"
// Or create in Stripe dashboard → Products → Southern Legends Newsletter → $7/mo recurring
const NEWSLETTER_PRICE_ID = process.env.STRIPE_NEWSLETTER_PRICE_ID ?? "";

// Resend audience for paid newsletter subscribers (separate from free list)
const NEWSLETTER_PAID_AUDIENCE = process.env.RESEND_AUDIENCE_ID_NEWSLETTER ?? "bc84e16a-40ed-4e6b-bc6e-1396bcb83a92";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  if (!NEWSLETTER_PRICE_ID) {
    return NextResponse.json(
      { error: "STRIPE_NEWSLETTER_PRICE_ID not set — create $7/mo price in Stripe dashboard first" },
      { status: 503 }
    );
  }

  const origin = req.headers.get("origin") ?? "https://southernlegends.blog";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: NEWSLETTER_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/newsletter/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/newsletter`,
    allow_promotion_codes: true,
    metadata: { venture: "southern-legends", tier: "newsletter-paid" },
    subscription_data: {
      metadata: { venture: "southern-legends", tier: "newsletter-paid" },
    },
    customer_creation: "always",
  });

  return NextResponse.json({ url: session.url });
}
