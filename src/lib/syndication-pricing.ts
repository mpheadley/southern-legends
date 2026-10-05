// Canonical syndication pricing engine. Data lives in src/data/syndication-rates.json
// (the single home for numbers); this file is logic only. Mirrors the gs-pricing.ts
// pattern — never hardcode a rate anywhere else, always computeQuote().
import rates from "@/data/syndication-rates.json";

export type Deliverable = "text" | "shortText" | "photos" | "reel" | "column";
export type Rights = "reprint" | "first";
export type OutletKey = keyof typeof rates.outlets;

export interface LineItem {
  deliverable: string;
  label: string;
  price: number;
  source: "outlet-override" | "bundle" | "base";
}
export interface Quote {
  outlet: string;
  status: string;
  rights: Rights;
  lineItems: LineItem[];
  total: number;
  notes: string[];
}

const base = rates.base as Record<string, { label: string; reprint?: number; first?: number; flat?: number; perPhoto?: number }>;

function baseRate(d: Deliverable, rights: Rights): number {
  const b = base[d];
  if (!b) return 0;
  if (typeof b.flat === "number") return b.flat;
  return (rights === "first" ? b.first : b.reprint) ?? 0;
}

/** Detect a bundle that matches the exact deliverable set (order-independent). */
function bundleKey(set: Set<Deliverable>): keyof typeof rates.bundles | null {
  const has = (d: Deliverable) => set.has(d);
  if (set.size === 3 && has("text") && has("photos") && has("reel")) return "text+photos+reel";
  if (set.size === 2 && has("text") && has("photos")) return "text+photos";
  if (set.size === 2 && has("photos") && has("reel")) return "photos+reel";
  return null;
}

/**
 * Quote a set of deliverables for one outlet.
 * Priority: outlet bundle override > generic bundle > (outlet per-item override | base rate).
 */
export function computeQuote(args: {
  outlet: OutletKey;
  deliverables: Deliverable[];
  rights?: Rights;
}): Quote {
  const rights: Rights = args.rights ?? "reprint";
  const outlet = rates.outlets[args.outlet] as {
    name: string; status: string; overrides?: Record<string, number | boolean>;
  };
  const ov = outlet.overrides ?? {};
  const notes: string[] = [];
  const set = new Set(args.deliverables);

  // Home of record = free.
  if (ov.free) {
    return { outlet: outlet.name, status: outlet.status, rights, lineItems: [], total: 0, notes: ["Home of record — free."] };
  }

  const bk = bundleKey(set);

  // Outlet-specific bundle overrides beat everything.
  if (bk === "text+photos+reel" && typeof ov.bundleFull === "number") {
    return { outlet: outlet.name, status: outlet.status, rights,
      lineItems: [{ deliverable: bk, label: rates.bundles[bk].label, price: ov.bundleFull, source: "outlet-override" }],
      total: ov.bundleFull, notes };
  }
  if (bk === "text+photos" && typeof ov.bundleTextPhotos === "number") {
    return { outlet: outlet.name, status: outlet.status, rights,
      lineItems: [{ deliverable: bk, label: rates.bundles[bk].label, price: ov.bundleTextPhotos, source: "outlet-override" }],
      total: ov.bundleTextPhotos, notes };
  }

  // Generic bundle price (reprint-based; first rights = itemize instead for the premium).
  if (bk && rights === "reprint") {
    return { outlet: outlet.name, status: outlet.status, rights,
      lineItems: [{ deliverable: bk, label: rates.bundles[bk].label, price: rates.bundles[bk].price, source: "bundle" }],
      total: rates.bundles[bk].price, notes };
  }
  if (bk && rights === "first") notes.push("First-rights: itemized (bundle prices are reprint-based).");

  // Itemize: outlet per-item override wins, else base rate.
  const lineItems: LineItem[] = args.deliverables.map((d) => {
    if (typeof ov[d] === "number") {
      return { deliverable: d, label: base[d]?.label ?? d, price: ov[d] as number, source: "outlet-override" };
    }
    return { deliverable: d, label: base[d]?.label ?? d, price: baseRate(d, rights), source: "base" };
  });
  const total = lineItems.reduce((s, li) => s + li.price, 0);
  return { outlet: outlet.name, status: outlet.status, rights, lineItems, total, notes };
}

export { rates as syndicationRates };
