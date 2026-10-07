// GENERATED from gather/packages/books — do not edit here. Edit the package, then run tools/sync.py.
// @mpheadley/books — ONE home for book facts and locked cover copy.
// Data lives in books.json (also read by tools/export.py). Edit there, then:
//   python3 tools/export.py   (re-render covers, backs, wraps, 3D textures)
//   python3 tools/sync.py     (push data + component + images into the sites)
import data from "./books.json";

export type BookCopy = Record<string, string | undefined>;

export interface CanonicalBook {
  key: string;            // cover + 3D texture key (cc, tend, sl, gata, clt…)
  slug: string;           // site slug
  order: number;
  advertised: boolean;    // false = never shown on any public site
  title: string;
  series: string | null;
  subtitle: string | null;
  tagline: string;        // plain-text tagline for cards and listings
  cover: string;          // filename under /images/books/
  front: BookCopy;        // exact cover copy (may contain simple HTML)
  back: BookCopy;
}

export const BOOKS_LOCKED: string = data.locked;
export const ALL_BOOKS = (data.books as CanonicalBook[]).slice().sort((a, b) => a.order - b.order);
export const ADVERTISED_BOOKS = ALL_BOOKS.filter(b => b.advertised);

export const bookBySlug = (slug: string) => ALL_BOOKS.find(b => b.slug === slug);
export const bookByKey = (key: string) => ALL_BOOKS.find(b => b.key === key);
export const coverPath = (b: CanonicalBook) => `/images/books/${b.cover}`;

// ---------- CTA picker (same order as ad-inventory.ts / cta-router.ts) ----------
// 1. An ENABLED preorder whose window contains today, with a price set → Preorder.
// 2. Else the next advertised book (round-robin) → "Read the next book".
// 3. Else SUPPORT — the fallback. Never a checkout unless a price is set and enabled.
export type BookCta =
  | { kind: "preorder"; book: CanonicalBook; href: string; label: string }
  | { kind: "next"; book: CanonicalBook; href: string; label: string }
  | { kind: "support"; href: string; label: string };

export const SUPPORT_HREF = "/support";

export function pickBookCta(current: string | null, today = new Date()): BookCta {
  const iso = today.toISOString().slice(0, 10);
  for (const b of ADVERTISED_BOOKS) {
    const pre = (b as any).cta?.preorder;
    if (pre?.enabled && pre.price && pre.start <= iso && iso <= (pre.end ?? "9999-12-31") && b.key !== current) {
      return { kind: "preorder", book: b, href: pre.href, label: `Preorder ${b.title}` };
    }
  }
  const pool = ADVERTISED_BOOKS.filter(b => b.key !== current);
  if (pool.length) {
    const b = pool[new Date().getDate() % pool.length];
    return { kind: "next", book: b, href: `/book/${b.slug}`, label: `Read ${b.title}` };
  }
  return { kind: "support", href: SUPPORT_HREF, label: "Support the work" };
}
