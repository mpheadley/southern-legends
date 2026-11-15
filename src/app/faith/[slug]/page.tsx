import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import SubscribeCTA from "@/app/components/SubscribeCTA";
import ShareRow from "@/app/components/ShareRow";
import { siteConfig } from "@/lib/site-config";
import { getFaithData, faithAbsUrl, faithReadLabel, formatFaithDate, type FaithColumn, type FaithReel } from "@/lib/faith";
import { inline, plain } from "../FaithText";
import FaithTrack from "../FaithTrack";

// Fable rule (2026-10-10): the Star gets the words. A column page carries body text only when it is
// Matt's longer cut (longCut) or the manifest says the Star OK'd a full repost; otherwise it is the
// title, the one line, and the Star link. Pages without their own text canonicalize to the Star.
//
// Doors (2026-10-10): at most two, the Star always one of them. When an SL essay is the longer version
// (longUrl), it is the page's one outlined button, with reading time; the Star stays a text link.

// Data is read at request time from the Blob snapshot (src/lib/faith.ts) and re-checked every 5 minutes,
// so a column the Star runs next week gets its page with no deploy. Slugs not in the snapshot 404 (fail closed).
export const revalidate = 300; // keep in step with FAITH_REVALIDATE in src/lib/faith.ts
export const dynamicParams = true;

export async function generateStaticParams() {
  const { columns } = await getFaithData();
  return columns.map((c) => ({ slug: c.slug }));
}

const HERO_BG = "radial-gradient(120% 90% at 85% 10%, #3a2a1a 0%, #1C1917 55%, #141210 100%)";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { columns, headshot } = await getFaithData();
  const c = columns.find((x) => x.slug === slug);
  if (!c) return {};
  const description = plain(c.pullQuote) || `Matt Headley's faith column in The Anniston Star, ${formatFaithDate(c.date)}.`;
  const image = c.card ?? headshot;
  const ownText = c.paragraphs.length > 0;
  return {
    title: c.title,
    description,
    // The Star ran it first. A page with SL's own text (the longer cut) is its own canonical;
    // a link-only page credits the Star's article.
    alternates: { canonical: ownText ? `${siteConfig.url}/faith/${c.slug}` : c.starUrl },
    authors: [{ name: siteConfig.author }],
    openGraph: {
      type: "article",
      url: `/faith/${c.slug}`,
      title: c.title,
      description,
      publishedTime: c.date,
      authors: [siteConfig.author],
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: c.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function FaithColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { columns: all, headshot: faithHeadshot, byline: faithByline, attribution: faithAttribution } = await getFaithData();
  const c = all.find((x) => x.slug === slug);
  if (!c) notFound();

  const idx = all.findIndex((x) => x.slug === c.slug);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx < all.length - 1 ? all[idx + 1] : undefined;
  const ownText = c.paragraphs.length > 0;
  const description = plain(c.pullQuote);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    datePublished: c.date,
    author: { "@type": "Person", name: siteConfig.author, url: `${siteConfig.url}/about` },
    isBasedOn: c.starUrl,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(c.card ? { image: faithAbsUrl(c.card.src, siteConfig.url) } : {}),
  };

  const doors = (
    <Doors column={c} ownText={ownText} attribution={faithAttribution} byline={faithByline} />
  );

  return (
    <main id="main-content" className="bg-ll-light">
      <FaithTrack page="column" slug={c.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="text-ll-light" style={{ background: HERO_BG }}>
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-14 md:pt-36 md:pb-20">
          <Link
            href="/faith"
            className="faith-mono mb-8 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] text-ll-accent hover:text-white"
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
            Faith column
          </Link>
          <h1 className="faith-display text-[clamp(2.5rem,7vw,5rem)] font-semibold text-white" style={{ lineHeight: 1.02 }}>
            {c.title}
          </h1>
          <div className="mt-8 flex items-center gap-4">
            {faithHeadshot && (
              <Image
                src={faithHeadshot.src}
                width={56}
                height={56}
                alt=""
                className="h-14 w-14 rounded-full object-cover object-top ring-1 ring-white/20"
              />
            )}
            <div>
              <p className="text-base font-semibold text-white">By {siteConfig.author}</p>
              <p className="faith-mono text-sm uppercase tracking-[0.12em] text-white/60">
                <span className="whitespace-nowrap">The Anniston Star</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={c.date} className="whitespace-nowrap">
                  {formatFaithDate(c.date)}
                </time>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      {ownText ? (
        <article className="mx-auto max-w-[42rem] px-6 py-14 md:py-20">
          {c.epigraph && (
            <blockquote className="mb-10 border-l-2 border-ll-accent pl-5 text-lg italic leading-relaxed text-ll-text-light">
              {inline(c.epigraph)}
            </blockquote>
          )}
          <div className="faith-prose">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{inline(p)}</p>
            ))}
          </div>
          {doors}
          {c.reel && <ReelBox reel={c.reel} slug={c.slug} />}
          <div className="mt-8">
            <ShareRow url={`/faith/${c.slug}`} title={c.title} description={description} />
          </div>
          {c.card && (
            <figure className="mt-12">
              <Image
                src={c.card.src}
                width={c.card.width}
                height={c.card.height}
                alt={c.card.alt || `Share card for “${c.title}”`}
                sizes="(min-width: 768px) 420px, 100vw"
                className="mx-auto h-auto w-full max-w-[420px] rounded-sm shadow-lg"
              />
            </figure>
          )}
        </article>
      ) : (
        // Link-only page: the one line and the doors on the left, the share card beside them.
        <article className="mx-auto max-w-5xl px-6 py-14 md:px-12 md:py-20">
          <div className={`grid items-start gap-10 ${c.card ? "md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16 lg:grid-cols-[minmax(0,1fr)_20rem]" : ""}`}>
            <div className="min-w-0 max-w-[42rem]">
              {c.pullQuote && (
                <p className="faith-display text-[clamp(1.6rem,3.2vw,2.25rem)] italic leading-snug text-ll-dark">“{description}”</p>
              )}
              {doors}
              {c.reel && <ReelBox reel={c.reel} slug={c.slug} />}
              <div className="mt-8">
                <ShareRow url={`/faith/${c.slug}`} title={c.title} description={description} />
              </div>
            </div>
            {c.card && (
              <figure className="mx-auto w-full max-w-[18rem] md:sticky md:top-28 md:max-w-none">
                <Image
                  src={c.card.src}
                  width={c.card.width}
                  height={c.card.height}
                  alt={c.card.alt || `Share card for “${c.title}”`}
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 288px, 288px"
                  priority
                  className="h-auto w-full rounded-sm shadow-lg ring-1 ring-black/5"
                />
              </figure>
            )}
          </div>
        </article>
      )}

      {/* ── Subscribe (the one primary CTA) ─────────────────────────── */}
      <SubscribeCTA
        id="subscribe"
        source="faith-column"
        heading="Get the column in your inbox."
        subhead="Join the Southern Legends list for new columns, stories, and essays from Northeast Alabama. Unsubscribe anytime."
      />

      {/* ── Newer / older ───────────────────────────────────────────── */}
      {(newer || older) && (
        <nav aria-label="More columns" className="mx-auto grid max-w-3xl gap-6 px-6 py-14 sm:grid-cols-2">
          {older && (
            <Link
              href={`/faith/${older.slug}`}
              data-faith-track="faith_column_click"
              data-faith-slug={older.slug}
              className="group block"
            >
              <span className="faith-mono mb-2 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] text-ll-text-light">
                <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" /> Older
              </span>
              <span className="faith-display block text-xl font-semibold text-ll-dark group-hover:text-ll-primary">
                {older.title}
              </span>
            </Link>
          )}
          {newer && (
            <Link
              href={`/faith/${newer.slug}`}
              data-faith-track="faith_column_click"
              data-faith-slug={newer.slug}
              className="group block sm:col-start-2 sm:text-right"
            >
              <span className="faith-mono mb-2 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] text-ll-text-light">
                Newer <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="faith-display block text-xl font-semibold text-ll-dark group-hover:text-ll-primary">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}

/**
 * The doors. Longer version (SL essay) = the one outlined button, with reading time. The Star = text link,
 * always present. Then the attribution line and the canonical byline.
 */
function Doors({
  column: c,
  ownText,
  attribution,
  byline,
}: {
  column: FaithColumn;
  ownText: boolean;
  attribution: string;
  byline: string;
}) {
  const readLabel = faithReadLabel(c);
  const starLabel = c.longCut || c.longUrl ? "Read it as it ran in The Anniston Star" : "Read it in The Anniston Star";
  return (
    <div className={`border-t border-ll-border pt-8 ${ownText || c.pullQuote ? "mt-10" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        {c.longUrl && !c.longCut && (
          <Link href={c.longUrl} data-faith-track="faith_longer_click" data-faith-slug={c.slug} className="faith-btn-outline">
            Read the longer version
            {readLabel && <span className="faith-btn-meta">{readLabel}</span>}
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
        <a
          href={c.starUrl}
          target="_blank"
          rel="noopener"
          data-faith-track="faith_star_click"
          data-faith-slug={c.slug}
          className={`inline-flex items-center gap-1.5 underline-offset-4 hover:underline ${
            c.longUrl && !c.longCut
              ? "text-sm font-medium text-ll-text-light hover:text-ll-dark"
              : "text-base font-semibold text-ll-primary"
          }`}
        >
          {starLabel}
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-ll-text-light">
        {c.longCut
          ? "This is the longer version. A shorter cut ran in The Anniston Star."
          : c.longUrl
            ? "A longer version of this column lives on Southern Legends. The column itself ran in The Anniston Star."
            : attribution}
      </p>
      {byline && <p className="mt-2 text-sm italic leading-relaxed text-ll-text-light">{byline}</p>}
      {/* Free to read; one plain support line, no paywall (faith-column-owned-channel-strategy, 2026-11-15). */}
      <p className="mt-4 text-sm leading-relaxed text-ll-text-light">
        Free to read.{" "}
        <a href="/support" className="font-medium text-ll-primary underline underline-offset-4">
          Support the writing
        </a>
        .
      </p>
    </div>
  );
}

/** "Watch the reel": a related video on another page (e.g. The Aisle's reel for Dolly's Imagination Library). */
function ReelBox({ reel, slug }: { reel: FaithReel; slug: string }) {
  const tag = reel.tag;
  const idx = tag ? reel.blurb.indexOf(tag.name) : -1;
  const blurb =
    tag && idx >= 0 ? (
      <>
        {reel.blurb.slice(0, idx)}
        <a href={tag.url} target="_blank" rel="noopener" className="font-semibold text-ll-primary underline-offset-4 hover:underline">
          {tag.name}
        </a>
        {reel.blurb.slice(idx + tag.name.length)}
      </>
    ) : (
      reel.blurb
    );
  return (
    <aside className="mt-10 rounded-sm border border-ll-border bg-ll-warm px-6 py-6">
      <p className="faith-mono mb-3 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] text-ll-accent-dark">
        <Play size={14} strokeWidth={2} aria-hidden="true" />
        Watch
      </p>
      <a
        href={reel.url}
        target="_blank"
        rel="noopener"
        data-faith-track="faith_reel_click"
        data-faith-slug={slug}
        className="faith-display block text-xl font-semibold text-ll-dark underline-offset-4 hover:text-ll-primary hover:underline"
      >
        {reel.title}
        {reel.platform && <span className="faith-mono ml-2 align-middle text-sm font-normal uppercase tracking-[0.12em] text-ll-text-light">on {reel.platform}</span>}
        <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" className="ml-1 inline align-[-3px]" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {blurb && <p className="mt-2 text-base leading-relaxed text-ll-text">{blurb}</p>}
    </aside>
  );
}
