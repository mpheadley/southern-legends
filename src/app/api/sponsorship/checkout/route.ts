import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2026-05-27.dahlia" as any,
  })
}

const TIERS: Record<string, { label: string; amount: number; description: string }> = {
  // City sponsorship tiers (existing)
  friend: {
    label: "Friend of the City — Southern Legends",
    amount: 2500,
    description: "Name + link in city section footer. Monthly, cancel any time.",
  },
  sponsor: {
    label: "City Sponsor — Southern Legends",
    amount: 7500,
    description: "Logo on city pages + one featured business profile per month.",
  },
  // Site-wide tiers
  trail: {
    label: "Trail Sponsor — Southern Legends",
    amount: 4900,
    description: "Logo + link in the SL footer rotation and on your sponsored program pages. Monthly, cancel any time.",
  },
  landmark: {
    label: "Landmark Sponsor — Southern Legends",
    amount: 9900,
    description: "Logo on all relevant city + event pages, plus a dedicated sponsor spotlight post each month.",
  },
}

export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get("tier")
  const program = req.nextUrl.searchParams.get("program") // optional: 'pvxc', etc.

  // Presenting tier goes through the contact form, not checkout
  if (tier === "presenting") {
    return NextResponse.redirect(new URL("/api/sponsorship/apply", req.url))
  }

  const tierConfig = tier ? TIERS[tier] : null
  if (!tierConfig) {
    return NextResponse.redirect(new URL("/sponsor", req.url))
  }

  const stripe = getStripe()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://southernlegends.org"

  const label = program
    ? `${tierConfig.label} · ${program.toUpperCase()} Program`
    : tierConfig.label

  const description = program
    ? `${tierConfig.description} Your logo appears on the ${program.toUpperCase()} program page.`
    : tierConfig.description

  const successPath = program ? `/programs/${program}?sponsored=1` : `/sponsor/thank-you?tier=${tier}`

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tierConfig.amount,
          recurring: { interval: "month" },
          product_data: {
            name: label,
            description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}${successPath}`,
    cancel_url: program ? `${baseUrl}/programs/${program}` : `${baseUrl}/sponsor`,
    metadata: { tier: tier!, program: program ?? "", source: "sl-sponsor" },
  })

  return NextResponse.redirect(session.url!)
}
