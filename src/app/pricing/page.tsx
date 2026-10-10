import type { Metadata } from "next";
import Link from "next/link";
import pricing from "@/data/sl-pricing.json";

export const metadata: Metadata = {
  title: "Rates & Licensing — Southern Legends",
  description:
    "Channel sponsorship, ad units, newsletter, syndication, and dataset licensing for Southern Legends — the memory of Northeast Alabama.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" },
  // Internal rate card (audit C-12): kept live for direct links, out of search + sitemap.
  robots: { index: false, follow: false },
};

type Row = { tier: string; unit: string; price: number; actual: boolean; detail: string };

const money = (n: number) =>
  n === 0 ? "Free" : n < 10 && !Number.isInteger(n) ? `$${n.toFixed(2)}` : `$${n.toLocaleString()}`;

const SECTIONS: { key: keyof typeof pricing; title: string; sub: string }[] = [
  { key: "sponsorship", title: "Channel Sponsorship", sub: "A brand presents a section. One masthead, sponsorable per channel." },
  { key: "adUnits", title: "Ad Units", sub: "One canonical, disclosed ad unit across the site." },
  { key: "newsletter", title: "Newsletter", sub: "Reader tiers — the paid-list flywheel." },
  { key: "syndication", title: "Syndication Rate Card", sub: "What a piece runs, per outlet tier." },
  { key: "licensing", title: "Dataset & Nexus Licensing", sub: "The entity graph + 26-year archive as a product." },
];

function Badge({ actual }: { actual: boolean }) {
  return (
    <span
      className={
        "ml-2 align-middle rounded-full px-2 py-0.5 text-[10px] font-mono font-bold " +
        (actual
          ? "bg-green-100 text-green-800"
          : "bg-ll-warm text-ll-primary-dark")
      }
    >
      {actual ? "actual" : "proposed"}
    </span>
  );
}

function PriceTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ll-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.tier} className="border-t border-ll-border first:border-t-0">
              <td className="w-1/3 px-4 py-3 align-top font-medium text-ll-dark">
                {r.tier}
                <Badge actual={r.actual} />
              </td>
              <td className="w-1/5 whitespace-nowrap px-4 py-3 align-top font-mono font-bold text-ll-dark">
                {money(r.price)}
                <span className="block text-[11px] font-normal text-ll-text-light">{r.unit}</span>
              </td>
              <td className="px-4 py-3 align-top text-ll-text">{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="page-light page-top mx-auto max-w-3xl px-4 pb-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-widest text-ll-text-light">Rates & Licensing</p>
        <h1 className="mb-4 text-4xl font-bold text-ll-dark">
          Work with Southern Legends
        </h1>
        <p className="text-lg leading-relaxed text-ll-text">
          {pricing.meta.note}
        </p>
        <p className="mt-3 font-mono text-xs text-ll-text-light">
          <span className="text-green-700">green = confirmed</span> ·{" "}
          <span className="text-ll-primary">amber = proposed, verify before quoting</span> · updated {pricing.meta.updated}
        </p>
      </div>

      {/* SHOW, DON'T TELL — Nexus demo block */}
      <section className="mb-14 rounded-xl border border-ll-border bg-ll-warm p-6">
        <p className="mb-1 text-xs font-mono uppercase tracking-widest text-ll-primary">
          The Nexus · see it, don&apos;t just read it
        </p>
        <h2 className="mb-2 text-2xl font-bold text-ll-dark">
          Nobody else has the backstory
        </h2>
        <p className="mb-6 text-ll-text">
          Every story SL runs carries a <b>then / now</b> thread pulled from 26 years of community
          memory and a 6,400-entity local graph. A weather app can&apos;t do this. A national desk
          can&apos;t. The Anniston Star cut access to its own morgue. This is what licensing buys.
        </p>

        {/* Then / Now live example card */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-ll-border bg-white p-5">
            <p className="mb-1 text-xs font-mono uppercase tracking-wider text-ll-text-light">Now · this week</p>
            <p className="font-serif text-lg font-semibold text-ll-dark">
              Theatre of Gadsden stages <em>Sweeney Todd</em> — 75 auditioned, the director overcast.
            </p>
          </div>
          <div className="rounded-lg border border-ll-border bg-white p-5">
            <p className="mb-1 text-xs font-mono uppercase tracking-wider text-ll-primary">Then · the thread only SL has</p>
            <p className="text-ll-text">
              The lead played the same stage two decades ago. The venue&apos;s history, the director&apos;s
              first show, the families who&apos;ve filled those seats since — surfaced automatically from the
              archive. <span className="italic">That</span> is the licensable layer.
            </p>
          </div>
        </div>

        {/* Reel slot — the video proof */}
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-dashed border-ll-border bg-white/60 p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ll-primary text-white">▶</div>
          <div>
            <p className="font-semibold text-ll-dark">Watch a Nexus reel</p>
            <p className="text-sm text-ll-text-light">
              30-second then/now cut — produced in-house. <span className="font-mono text-xs">[reel embed — drop MP4/YouTube here]</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing sections */}
      {SECTIONS.map((s) => (
        <section key={s.key} className="mb-10">
          <h2 className="mb-1 text-2xl font-bold text-ll-dark">{s.title}</h2>
          <p className="mb-3 font-serif italic text-ll-text-light">{s.sub}</p>
          <PriceTable rows={pricing[s.key] as Row[]} />
        </section>
      ))}

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-ll-border bg-ll-warm p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-ll-dark">
          Sponsor a channel, run a piece, or license the archive
        </h2>
        <p className="mb-4 text-ll-text">
          Southern Legends is the home of record for Northeast Alabama. Let&apos;s talk about the fit.
        </p>
        <Link
          href="/about"
          className="inline-block rounded bg-ll-primary px-5 py-2 font-medium text-white transition hover:bg-ll-primary-dark"
        >
          Get in touch
        </Link>
      </div>

      <p className="mt-10 text-center font-mono text-xs text-ll-text-light">
        Canonical pricing · generated from the SL pricing engine · proposed figures are estimates — verify before quoting.
      </p>
    </main>
  );
}
