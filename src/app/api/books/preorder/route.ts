import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getBook, getTier } from "@/data/book-preorders";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const { slug, tier } = (await req.json()) as { slug?: string; tier?: string };

  const book = slug ? getBook(slug) : undefined;
  const chosen = slug && tier ? getTier(slug, tier) : undefined;
  if (!book || !chosen) {
    return NextResponse.json({ error: "Unknown book or tier" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://southernlegends.org";
  const isSupport = chosen.id === "support";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: chosen.price * 100,
          product_data: {
            name: `${book.title} — ${chosen.label}`,
            description: chosen.desc,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/books/${book.slug}?success=${chosen.id}`,
    cancel_url: `${origin}/books/${book.slug}`,
    metadata: { book: book.slug, tier: chosen.id, kind: isSupport ? "support" : "preorder" },
    // preorders/founding ship a physical book; support gift does not
    ...(isSupport ? {} : { shipping_address_collection: { allowed_countries: ["US"] } }),
  });

  return NextResponse.json({ url: session.url });
}
