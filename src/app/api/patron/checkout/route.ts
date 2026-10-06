import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" })
  : null;

// Southern Legends Patron prices — Headley Ventures account (acct_1TQaSb…).
// Created 2026-08-01. Replaces the stale wrong-account Stripe pricing table.
const TIERS: Record<string, string> = {
  "5": "price_1TzgSDLAZU170UPn99Im380M",
  "10": "price_1TzgSELAZU170UPn5inAVCNr",
  "20": "price_1TzgSELAZU170UPnEDiqNpAd",
};

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const { tier } = (await req.json().catch(() => ({}))) as { tier?: string };
  const price = TIERS[tier ?? "20"] ?? TIERS["20"];
  const origin = req.headers.get("origin") ?? "https://southernlegends.org";

  const isTwenty = (tier ?? "20") === "20";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/support/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/support`,
    allow_promotion_codes: true,
    // Collect shipping for $20 patrons so we can send the welcome kit
    ...(isTwenty ? { shipping_address_collection: { allowed_countries: ["US"] } } : {}),
    metadata: { venture: "southern-legends", tier: `patron-${tier ?? "20"}` },
    subscription_data: { metadata: { venture: "southern-legends", tier: `patron-${tier ?? "20"}` } },
  });

  return NextResponse.json({ url: session.url });
}
