import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";

interface Item {
  name: string;
  city: string;
  url: string;
  desc: string;
}

/** A short "worth knowing" list for a section hub. Internal links stay in-tab; external ones open a new tab. */
export default function HubList({ heading, items }: { heading: string; items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ll-text-light mb-6" style={{ fontFamily: "var(--font-heading)" }}>
        {heading}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {items.map((it) => {
          const external = it.url.startsWith("http");
          const inner = (
            <>
              <p className="font-semibold text-ll-dark group-hover:text-ll-primary text-base mb-1 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                {it.name}
                {external ? <ExternalLink size={14} aria-hidden="true" /> : <MapPin size={14} aria-hidden="true" />}
              </p>
              <p className="text-sm text-ll-text-light">{it.city} · {it.desc}</p>
            </>
          );
          return (
            <li key={it.name}>
              {external ? (
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="group block border border-ll-border rounded-lg p-4 bg-white/60 hover:border-ll-accent transition">
                  {inner}
                </a>
              ) : (
                <Link href={it.url} className="group block border border-ll-border rounded-lg p-4 bg-white/60 hover:border-ll-accent transition">
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
