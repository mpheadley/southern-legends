"use client";

import { useState } from "react";
import Link from "next/link";
import Book3D from "@/lib/books/Book3D";

export type ShelfEntry = {
  key: string;            // cover3d key (cc, tend, sl, gata, clt)
  title: string;
  tagline: string;
  description: string;
  cta?: { label: string; href: string };
};

/**
 * The shelf is the only index of the books. Grabbing a book (or stepping with
 * the arrow keys) selects it; the block below describes the selected book.
 */
export default function ShelfSection({ entries }: { entries: ShelfEntry[] }) {
  const [sel, setSel] = useState(entries[0]);
  const books = entries.map(e => ({ key: e.key, title: e.title, subtitle: e.tagline }));
  const rows = [books.slice(0, 3), books.slice(3)];

  return (
    <section className="mb-14">
      <div className="relative hidden sm:block -mx-4 md:-mx-24 space-y-2">
        {rows.map((r, i) => (
          <Book3D key={i} className="h-[300px] w-full" books={r} onSelect={b => setSel(entries.find(e => e.key === b.key)!)} />
        ))}
      </div>
      <div className="sm:hidden space-y-6">
        {books.map(b => (
          <Book3D key={b.key} className="h-72 w-full" books={[b]} onSelect={() => setSel(entries.find(e => e.key === b.key)!)} />
        ))}
      </div>

      <div aria-live="polite" className="mt-8 max-w-xl mx-auto text-center">
        <h2 className="text-2xl text-stone-100 font-fraunces">{sel.title}</h2>
        <p className="mt-2 text-stone-400 italic">{sel.tagline}</p>
        <p className="mt-4 text-stone-300 leading-relaxed">{sel.description}</p>
        {sel.cta && (
          <Link href={sel.cta.href} className="inline-block mt-5 text-amber-500 underline underline-offset-4">
            {sel.cta.label} →
          </Link>
        )}
      </div>
    </section>
  );
}
