export const revalidate = 300

import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { getAllJournalPosts, getJournalPostBySlug, getJournalSlugs, getOtherJournalPosts } from "@/lib/journal";
import { getAllProfiles } from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";
import ShareButtons from "@/app/components/ShareButtons";
import PullQuote from "@/app/components/PullQuote";
import ArticleImage from "@/app/components/ArticleImage";
import InlineImage from "@/app/components/InlineImage";
import AudioPlayer from "@/app/components/AudioPlayer";
import VideoEmbed from "@/app/components/VideoEmbed";
import VideoPlayer from "@/app/components/VideoPlayer";
import VideoLoop from "@/app/components/VideoLoop";
import MusicEmbed from "@/app/components/MusicEmbed";
import SongCard from "@/app/components/SongCard";
import PhotoStrip from "@/app/components/PhotoStrip";
import ArtCredit from "@/app/components/ArtCredit";
import SermonCard from "@/app/components/SermonCard";
import TimelineBlock from "@/app/components/TimelineBlock";
import Comments from "@/app/components/Comments";
import JournalCard from "@/app/components/JournalCard";
import ProfileCardHero from "@/app/components/ProfileCardHero";
import SubscribeCTA from "@/app/components/SubscribeCTA";
import { getEssayMerch, getMerchForCity } from "@/lib/merch";
import ClosingSection from "@/app/components/ClosingSection"
import { pickCTA, pickAd, snapshotAd } from "@/lib/cta-router";
import HouseAdUnit from "@/app/components/HouseAdUnit";
import AisleStrip from "@/app/components/AisleStrip";
import SpotifyEmbed from "@/app/components/SpotifyEmbed"
import AuthorSupport from "@/app/components/AuthorSupport"
import { getPlaylistId } from "@/lib/spotify-config";
import Callout from "@/app/components/Callout";
import ReadingProgressBar from "@/app/components/ReadingProgressBar";
import BookTeaser from "@/app/components/BookTeaser";
import ArticleGate from "@/app/components/ArticleGate";
import PhotoCarouselLoader from "@/app/components/PhotoCarouselLoader";
import TestimonialBlock from "@/app/components/TestimonialBlock";
import PlaylistEmbed from "@/app/components/PlaylistEmbed";
import { getPlaylist } from "@/lib/playlists";

function Dateline({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm italic text-ll-text-light mb-6 leading-relaxed">
      {children}
    </div>
  );
}

function FeaturedImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="not-prose -mx-4 md:-mx-8 lg:-mx-16 mb-10">
      <div className="relative w-full" style={{ height: "50vh", minHeight: 320 }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      {caption && (
        <p className="mt-2 text-xs text-center italic text-ll-text-light px-4">{caption}</p>
      )}
    </div>
  );
}


const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => {
    const id =
      typeof props.children === "string"
        ? props.children
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        : undefined;
    return (
      <h2
        id={id}
        className="text-2xl md:text-3xl font-bold mt-12 mb-4 scroll-mt-24"
        style={{ fontFamily: "var(--font-heading)" }}
        {...props}
      />
    );
  },
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="text-xl md:text-2xl font-bold mt-10 mb-3"
      style={{ fontFamily: "var(--font-heading)" }}
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-ll-text leading-relaxed mb-6" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-ll-text" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 text-ll-text" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-ll-accent pl-6 py-2 my-8 bg-ll-warm rounded-r-lg italic text-ll-text"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-bold text-ll-dark" {...props} />
  ),
  hr: () => (
    <div className="my-10 text-center text-ll-accent tracking-[0.5em] select-none" aria-hidden="true">
      · · ·
    </div>
  ),
  PullQuote,
  ArticleImage,
  AudioPlayer,
  VideoEmbed,
  VideoPlayer,
  VideoLoop,
  MusicEmbed,
  SongCard,
  PhotoStrip,
  ArtCredit,
  SermonCard,
  TimelineBlock,
  FeaturedImage,
  InlineImage,
  Dateline,
  Callout,
  PhotoCarouselLoader,
  TestimonialBlock,
  PlaylistEmbed,
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getJournalSlugs()
    .map(getJournalPostBySlug)
    .filter((p): p is NonNullable<typeof p> => p !== null && p.frontmatter.published)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post || !post.frontmatter.published) return {};

  const unlistedRobots = post.frontmatter.unlisted
    ? { robots: { index: false, follow: false } }
    : {};

  return {
    ...unlistedRobots,
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    alternates: { canonical: `/essays/${slug}` },
    openGraph: {
      url: `/essays/${slug}`,
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      images: (post.frontmatter.image || post.frontmatter.cardImage)
        ? [{ url: (post.frontmatter.image || post.frontmatter.cardImage)!, width: 1200, height: 630, alt: post.frontmatter.imageAlt ?? post.frontmatter.title }]
        : [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: (post.frontmatter.image || post.frontmatter.cardImage)
        ? [(post.frontmatter.image || post.frontmatter.cardImage)!]
        : ["/og-default.jpg"],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post || !post.frontmatter.published) notFound();

  const moreJournal = getOtherJournalPosts(slug, 2);
  const profiles = getAllProfiles().slice(0, 2);

  const { frontmatter, content, readingTime } = post;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Broken Ground", item: `${siteConfig.url}/journal` },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: `${siteConfig.url}/essays/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: "https://matthewheadley.com",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.webp`,
      },
    },
    mainEntityOfPage: `${siteConfig.url}/essays/${slug}`,
  };

  const heroSrc = frontmatter.heroImage || frontmatter.image;

  return (
    <main id="main-content">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, articleSchema]) }}
      />

      {/* Hero */}
      <section
        className={`relative text-white overflow-hidden min-h-[70vh] flex flex-col justify-end ${heroSrc ? "" : "gradient-hero"}`}
        style={{ ...(heroSrc ? { background: "var(--color-ll-dark)" } : {}), viewTransitionName: `journal-hero-${slug}` } as React.CSSProperties}
      >
        {heroSrc ? (
          <>
            <Image
              src={heroSrc}
              alt={frontmatter.imageAlt ?? frontmatter.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: (frontmatter as { heroFocus?: string }).heroFocus ?? "center 20%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ll-dark/95 via-ll-dark/60 to-ll-dark/30 z-[1]" aria-hidden="true" />
          </>
        ) : (
          <div className="absolute inset-0 bg-black/50 z-[1]" aria-hidden="true" />
        )}
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-14 md:pt-32 md:pb-18">
          <Link
            href="/essays"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ll-accent hover:text-ll-accent-dark transition-colors mb-8"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Journal
          </Link>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {frontmatter.title}
          </h1>

          {frontmatter.subtitle && (
            <p className="mt-3 text-lg md:text-xl text-white/70 italic" style={{ fontFamily: "var(--font-heading)" }}>
              {frontmatter.subtitle}
            </p>
          )}

          {/* Byline — guest posts run under their own byline; Matt's pieces just "By Matt Headley" */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60">
            <span>By {frontmatter.author ?? siteConfig.author}</span>
            {frontmatter.author && frontmatter.author !== siteConfig.author && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>Southern Legends</span>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{formatDate(frontmatter.date)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="bg-ll-light">
        <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-16 prose-journal after:content-[''] after:block after:clear-both">
          <ArticleGate slug={slug} />
          {frontmatter.image && frontmatter.image !== heroSrc && (
            <div className="not-prose mb-10">
              <Image
                src={frontmatter.image}
                alt={frontmatter.imageAlt ?? frontmatter.title}
                width={900}
                height={600}
                className="w-full rounded-lg object-cover"
                priority
              />
              {frontmatter.imageCaption && (
                <p className="mt-2 text-xs text-center italic text-ll-text-light">{frontmatter.imageCaption}</p>
              )}
            </div>
          )}
          {((frontmatter as unknown as {youtubeUrl?:string}).youtubeUrl || frontmatter.videoUrl) && (
            <div className="not-prose mb-6">
              {(frontmatter as unknown as {youtubeUrl?:string}).youtubeUrl
                ? <VideoEmbed url={(frontmatter as unknown as {youtubeUrl:string}).youtubeUrl} />
                : <VideoPlayer src={frontmatter.videoUrl!} caption="Watch this essay" />
              }
            </div>
          )}
          {frontmatter.audioUrl && (
            <div className="not-prose mb-10">
              <AudioPlayer src={frontmatter.audioUrl} title="Listen to this essay" />
            </div>
          )}
          {(() => {
            const pageCta = pickCTA({ category: (frontmatter as { category?: string }).category, tags: frontmatter.tags });
            const top = snapshotAd(`essays/${slug}`, { category: (frontmatter as { category?: string }).category, tags: frontmatter.tags }, pageCta.key);
            if (top?.key === "aisle") return <AisleStrip ad={top} page={`essays/${slug}`} />;
            // Sensitive page (only the soft Support ad) → tell the site-wide Aisle band to stay off.
            return top?.key === "support" ? <span data-sl-no-promo hidden /> : null;
          })()}
          <MDXRemote source={content} components={mdxComponents} />

          {/* Auto-inject YouTube playlist if one is configured for this slug */}
          {(() => {
            const pl = getPlaylist(slug);
            return pl ? (
              <div className="mt-10">
                <PlaylistEmbed
                  playlistId={pl.playlistId}
                  videoId={pl.videoId}
                  title={pl.title}
                  caption={pl.caption}
                />
              </div>
            ) : null;
          })()}
        </div>
      </article>

      <BookTeaser />

      {/* Closing */}
      {(() => {
        const { primary, secondary } = getEssayMerch(slug);
        const fm = frontmatter as unknown as { audioUrl?: string; youtubeUrl?: string };
        const podcastUrls = fm.audioUrl ? {
          spotify: siteConfig.podcast.spotify,
          apple: siteConfig.podcast.apple,
          youtube: fm.youtubeUrl ?? siteConfig.podcast.youtube,
        } : undefined;
        return (
          <ClosingSection
            shareUrl={`/essays/${slug}`}
            title={frontmatter.title}
            excerpt={frontmatter.excerpt}
            primary={primary}
            secondary={secondary}
            podcastUrls={podcastUrls}
          />
        );
      })()}

      {/* Spotify — Southern Legends playlist */}
      <div className="max-w-3xl mx-auto px-6 mt-2">
        <SpotifyEmbed
          playlistId={getPlaylistId("southern-legends")}
          title="Listening — Southern Legends"
          compact
        />
      </div>

      {/* Ad slot — ONE tasteful house cross-promo (or the Support SL fallback) at the
          end, before Comments. Mirrors the profiles/[slug] pattern. See lib/cta-router.ts */}
      {(() => {
        const pageCta = pickCTA({
          category: (frontmatter as { category?: string }).category,
          tags: frontmatter.tags,
        });
        const houseAd = snapshotAd(`essays/${slug}`, 
          { category: (frontmatter as { category?: string }).category, tags: frontmatter.tags },
          pageCta.key,
        );
        return houseAd ? <HouseAdUnit ad={houseAd} page={`essays/${slug}`} /> : null;
      })()}

      <Comments slug={slug} />

      {/* Subscribe */}
      <SubscribeCTA />

      {/* Place-based merch — show city items when essay has a location */}
      {(() => {
        const fm = frontmatter as unknown as { location?: string }
        if (!fm.location) return null
        // Parse "Jacksonville, Alabama" → "jacksonville"
        const cityName = fm.location.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-')
        const items = getMerchForCity(cityName, 3)
        if (items.length === 0) return null
        return (
          <section style={{ background: '#1a1208', borderTop: '1px solid rgba(154,108,47,0.12)' }}>
            <div className="max-w-3xl mx-auto px-6 py-10">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9a6c2f', marginBottom: '0.75rem' }}>
                {fm.location.split(',')[0].trim()} merch
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                {items.map((item) => (
                  <a key={item.id} href={`/merch#${item.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#2a1e10', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.4rem', aspectRatio: '1' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: '#F0EDE6', lineHeight: 1.2 }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'rgba(240,237,230,0.45)' }}>${item.price}</p>
                  </a>
                ))}
              </div>
              <a href="/merch" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#c4974a', fontWeight: 600, textDecoration: 'none' }}>
                All Southern Legends merch →
              </a>
            </div>
          </section>
        )
      })()}

      {/* More from the Journal */}
      {moreJournal.length > 0 && (
        <section className="bg-ll-warm py-12 md:py-16 border-t border-ll-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-xl font-bold text-ll-dark mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Link href="/essays" className="hover:text-ll-primary transition-colors">
                More from the Journal
              </Link>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {moreJournal.map((p) => (
                <JournalCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stories */}
      {profiles.length > 0 && (
        <section className="bg-ll-light py-12 md:py-16 border-t border-ll-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-xl font-bold text-ll-dark mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Link href="/profiles" className="hover:text-ll-primary transition-colors">
                Read the Stories
              </Link>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {profiles.map((p) => (
                <ProfileCardHero key={p.slug} profile={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AuthorSupport />
    </main>
  );
}
