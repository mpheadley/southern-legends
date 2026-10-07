// GENERATED from gather/packages/books — do not edit here. Edit the package, then run tools/sync.py.
"use client";

import { useEffect, useRef, useState } from "react";
import { mountShelf, type ShelfBook } from "./shelf-core";

export type Book3DItem = ShelfBook;

/**
 * React wrapper over the shared shelf (shelf-core.js). Do not put shelf logic here —
 * change gather/packages/books/shelf-core.js and every site updates on sync.
 * Textures: /images/books/3d/<key>-{front,spine,back}.webp
 */
export default function Book3D({
  books,
  fallbackSrc,
  className = "",
  onSelect,
}: {
  books: Book3DItem[];
  fallbackSrc?: string;
  className?: string;
  onSelect?: (b: Book3DItem) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [label, setLabel] = useState<Book3DItem | null>(null);
  const keys = books.map(b => b.key).join(",");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let handle: { dispose(): void } | null = null;
    let disposed = false;
    const lazy = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      lazy.disconnect();
      if (disposed || el.clientWidth === 0) return;
      handle = mountShelf(el, { books, onLabel: setLabel, onSelect });
      setReady(true);
    }, { rootMargin: "200px" });
    lazy.observe(el);
    return () => { disposed = true; lazy.disconnect(); handle?.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  return (
    <div className={`relative select-none ${className}`}>
      <div ref={wrapRef} className="absolute inset-0">
        {!ready && fallbackSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fallbackSrc} alt={books[0]?.title ?? ""} className="absolute inset-0 m-auto h-[80%] w-auto rounded shadow-lg" />
        )}
      </div>
      {books.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center" aria-live="polite">
          <p className="font-fraunces text-lg text-stone-100">{label?.title ?? " "}</p>
          <p className="text-sm text-stone-400">{label ? label.subtitle : ""}</p>
        </div>
      )}
    </div>
  );
}
