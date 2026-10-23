// patron-tiers.ts — the one home for the Southern Legends reader-support amounts (monthly).
// /support (PatronTiers), the closing block and the scheduled support ad all read from here,
// so the ask never drifts from what Stripe charges (price ids: src/app/api/patron/checkout).
export type PatronTier = { amount: string; label: string; note: string; featured?: boolean };

export const PATRON_TIERS: PatronTier[] = [
  { amount: "5", label: "$5", note: "Keeps a light on" },
  { amount: "10", label: "$10", note: "Patron letter monthly" },
  { amount: "20", label: "$20", note: "Welcome shirt + sticker", featured: true },
];

/** The entry-level monthly ask ("$5"). */
export const SUPPORT_PRICE_LABEL = PATRON_TIERS[0].label;
