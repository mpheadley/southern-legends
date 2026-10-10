import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, ArrowUpRight, BookOpen, Mail, Newspaper } from "lucide-react";
import SubscribeCTA from "@/app/components/SubscribeCTA";
import { getFaithData, faithLongerUrl, faithReadLabel, formatFaithDate, type FaithColumn } from "@/lib/faith";
import { plain } from "./FaithText";
import FaithTrack from "./FaithTrack";

// Data: tools/sl-faith-snapshot.py -> Vercel Blob JSON, read at request time (src/lib/faith.ts) and
// re-checked every 5 minutes (ISR). New columns and cards show up without a deploy. Only columns the
// Star has already published (verified live, date <= today) are in it.
//
// Fable rules (2026-10-10): "The Star gets the words. /faith gets the title, one line, and the link."
// "One line, one door. Two at most, and the Star is always one of them."
//
// Hierarchy (2026-10-10, Matt: "better visual hierarchy when there's a fuller version"): a row with a
// longer version on SL carries a Courier label above the title and ONE outlined button to that version
// (with its reading time); the Star link drops to a quiet text link. Rows without one keep the Star link
// as their single, plain door. The page's solid button is Subscribe; nothing in the list is filled.

const DESCRIPTION =
  "Matt Headley's weekly faith column from The Anniston Star, collected in one place. Plain words about God, family, and ordinary life in Northeast Alabama.";

export const revalidate = 300; // keep in step with FAITH_REVALIDATE in src/lib/faith.ts

export async function generateMetadata(): Promise<Metadata> {
  const { headshot } = await getFaithData();
  return {
    title: "Faith column",
    description: DESCRIPTION,
    alternates: { canonical: "/faith" },
    openGraph: {
      url: "/faith",
      title: "Faith column — Matt Headley in The Anniston Star",
      description: DESCRIPTION,
      images: headshot ? [{ url: headshot.src, width: headshot.width, height: headshot.height, alt: "Matt Headley" }] : undefined,
    },
  };
}

const HERO_BG = "radial-gradient(120% 90% at 85% 10%, #3a2a1a 0%, #1C1917 55%, #141210 100%)";

export default async function FaithPage() {
  const { columns, headshot: faithHeadshot } = await getFaithData();
  const [latest, ...rest] = columns;
  const longerCount = columns.filter((c) => faithLongerUrl(c)).length;

  return (
    <main id="main-content" className="bg-ll-light">
      <FaithTrack page="index" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-ll-light" style={{ background: HERO_BG }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-28 pb-16 md:grid-cols-[1.25fr_0.75fr] md:gap-16 md:px-12 md:pt-36 md:pb-24 lg:min-h-[84vh]">
          <div className="order-2 md:order-1">
            <p className="faith-mono mb-5 text-sm uppercase tracking-[0.25em] text-ll-accent">
              Faith column <span className="text-white/40">·</span> <span className="whitespace-nowrap text-white/60">The Anniston Star</span>
            </p>
            {/* [EDIT] Hero headline — Matt, change freely. */}
            <h1
              className="faith-display text-[clamp(2.75rem,8.5vw,7rem)] font-semibold text-white"
              style={{ lineHeight: 0.98 }}
            >
              The table, not the pulpit.
            </h1>
            {/* [EDIT] One line about the column. */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
              A weekly faith column in The Anniston Star. Plain words about God, family, and the ordinary
              days in between, from a pastor who writes from the kitchen table.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#subscribe"
                data-faith-track="faith_hero_subscribe_click"
                className="inline-flex items-center gap-2 rounded bg-ll-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-ll-primary-dark"
              >
                <Mail size={18} strokeWidth={2} aria-hidden="true" />
                Get it by email
              </a>
              {latest && (
                <a
                  href="#columns"
                  className="inline-flex items-center gap-1.5 text-base text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Read the latest
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {faithHeadshot && (
            <figure className="order-1 md:order-2">
              <div className="relative mx-auto w-40 overflow-hidden rounded-full ring-2 ring-ll-accent/60 sm:w-48 md:w-full md:max-w-sm md:rounded-sm md:ring-0">
                <Image
                  src={faithHeadshot.src}
                  width={faithHeadshot.width}
                  height={faithHeadshot.height}
                  alt="Matt Headley, who writes the column"
                  priority
                  sizes="(min-width: 768px) 384px, 192px"
                  className="aspect-square h-auto w-full object-cover object-top md:aspect-auto"
                />
              </div>
              <figcaption className="faith-mono mt-4 hidden text-center text-sm uppercase tracking-[0.2em] text-white/50 md:block">
                Matt Headley
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* ── Columns ──────────────────────────────────────────────────── */}
      <section id="columns" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16 md:px-12 md:py-24" aria-labelledby="columns-heading">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ll-border pb-4 md:mb-6">
          <h2 id="columns-heading" className="faith-display text-3xl font-semibold text-ll-dark md:text-4xl">
            The columns
          </h2>
          <p className="faith-mono text-sm uppercase tracking-[0.2em] text-ll-text-light">
            {columns.length} so far
            {longerCount > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="whitespace-nowrap">{longerCount} with a longer version</span>
              </>
            )}
          </p>
        </div>

        {columns.length === 0 ? (
          <EmptyState />
        ) : (
          <ol className="divide-y divide-ll-border">
            {latest && <ColumnRow column={latest} featured />}
            {rest.map((c) => (
              <ColumnRow key={c.slug} column={c} />
            ))}
          </ol>
        )}
      </section>

      {/* ── Subscribe (the one primary CTA) ─────────────────────────── */}
      {/* [EDIT] Subscribers join the main Southern Legends list (source tag "faith"). */}
      <SubscribeCTA
        id="subscribe"
        source="faith"
        heading="Get the column in your inbox."
        subhead="Join the Southern Legends list for new columns, stories, and essays from Northeast Alabama. Unsubscribe anytime."
      />
    </main>
  );
}

/** Shown only when the snapshot has no published column (e.g. before the first one runs). */
function EmptyState() {
  return (
    <div className="mt-10 flex max-w-xl items-start gap-4 rounded-sm border border-ll-border bg-ll-warm px-6 py-6">
      <Newspaper size={22} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-ll-primary" />
      <div>
        <p className="faith-display text-xl font-semibold text-ll-dark">Nothing here yet.</p>
        <p className="mt-2 text-base leading-relaxed text-ll-text">
          The first column lands here the week it runs in the Star.{" "}
          <a href="#subscribe" className="font-semibold text-ll-primary underline-offset-4 hover:underline">
            Get it by email
          </a>{" "}
          and you will not have to check back.
        </p>
      </div>
    </div>
  );
}

/**
 * One row = title, one line, and at most two doors; the Star is always one of them.
 * Every row carries its share card at the SAME size (Matt, 2026-10-10: "one graphic is smaller"):
 * 6.5rem beside the text on phones, 13rem at sm, 15rem at md+. The latest row is marked by its
 * label and bigger title, not by a bigger card.
 */
function ColumnRow({ column: c, featured = false }: { column: FaithColumn; featured?: boolean }) {
  const longer = faithLongerUrl(c);
  const readLabel = faithReadLabel(c);
  // The title opens the longer version when there is one, otherwise the Star's page.
  const titleHref = longer || c.starUrl;
  const titleIsStar = !longer;
  const titleLinkProps = titleIsStar
    ? { href: titleHref, target: "_blank", rel: "noopener", "data-faith-track": "faith_star_click" }
    : { href: titleHref, "data-faith-track": "faith_longer_click" };

  return (
    <li className={featured ? "pt-8 pb-12 md:pt-10 md:pb-14" : "py-10 md:py-12"}>
      <div
        className={`grid items-start gap-x-5 gap-y-6 sm:gap-x-8 ${
          c.card ? "grid-cols-[minmax(0,1fr)_6.5rem] sm:grid-cols-[minmax(0,1fr)_13rem] md:grid-cols-[minmax(0,1fr)_15rem]" : ""
        }`}
      >
        <div className="min-w-0">
          <p className="faith-mono mb-3 text-sm uppercase tracking-[0.2em] text-ll-text-light">
            {featured && (
              <>
                <span className="font-bold text-ll-primary">Latest</span>
                <span aria-hidden="true"> · </span>
              </>
            )}
            <time dateTime={c.date} className="whitespace-nowrap">{formatFaithDate(c.date)}</time>
          </p>

          {longer && (
            // The scan cue: a row with a longer version says so before the title.
            <p className="faith-mono mb-2 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.18em] text-ll-accent-dark">
              <BookOpen size={14} strokeWidth={2} aria-hidden="true" />
              Longer version
            </p>
          )}

          <h3
            className={`faith-display font-semibold text-ll-dark ${
              featured ? "text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.02]" : "text-2xl leading-tight md:text-3xl"
            }`}
          >
            <Link {...titleLinkProps} data-faith-slug={c.slug} className="transition-colors hover:text-ll-primary">
              {c.title}
            </Link>
          </h3>
          {c.pullQuote && (
            <p className="faith-display mt-4 max-w-2xl text-lg italic text-ll-text sm:text-xl">“{plain(c.pullQuote)}”</p>
          )}

          {longer ? (
            // Two doors: the longer version is the button; the Star is the quiet text link.
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={longer}
                data-faith-track="faith_longer_click"
                data-faith-slug={c.slug}
                className="faith-btn-outline"
              >
                Read the longer version
                {readLabel && <span className="faith-btn-meta">{readLabel}</span>}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <a
                href={c.starUrl}
                target="_blank"
                rel="noopener"
                data-faith-track="faith_star_click"
                data-faith-slug={c.slug}
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-ll-text-light underline-offset-4 hover:text-ll-dark hover:underline"
              >
                As it ran in The Anniston Star
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          ) : (
            // One door.
            <div className="mt-5">
              <a
                href={c.starUrl}
                target="_blank"
                rel="noopener"
                data-faith-track="faith_star_click"
                data-faith-slug={c.slug}
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-ll-primary underline-offset-4 hover:underline"
              >
                Read it in The Anniston Star
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          )}
        </div>
        {c.card && (
          // Same destination as the title; hidden from the tab order so keyboard users get one stop per door.
          <Link
            {...titleLinkProps}
            data-faith-slug={c.slug}
            tabIndex={-1}
            aria-hidden="true"
            className="block overflow-hidden rounded-sm shadow-md ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
          >
            <Image
              src={c.card.src}
              width={c.card.width}
              height={c.card.height}
              alt=""
              sizes="(min-width: 768px) 240px, (min-width: 640px) 208px, 104px"
              priority={featured}
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </Link>
        )}
      </div>
    </li>
  );
}
