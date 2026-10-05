export const revalidate = 300

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { existsSync } from "fs";
import { join } from "path";
import {
  getProfileBySlug,
  getPublishedSlugs,
  getAdjacentProfiles,
  getAllProfiles,
} from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import ArticleImage from "@/app/components/ArticleImage";
import InlineImage from "@/app/components/InlineImage";
import Figure from "@/app/components/Figure";
import PhotoCarouselLoader from "@/app/components/PhotoCarouselLoader";
import { pickCTA, pickAd, snapshotAd } from "@/lib/cta-router";
import HouseAdUnit from "@/app/components/HouseAdUnit";
import AisleStrip from "@/app/components/AisleStrip";
import PullQuote from "@/app/components/PullQuote";
import FacebookEmbed from "@/app/components/FacebookEmbed";
import VideoLoop from "@/app/components/VideoLoop";
import ShareButtons from "@/app/components/ShareButtons";
import ScrollytellingProfile from "@/app/components/ScrollytellingProfile";
import ParallaxHero from "@/app/components/ParallaxHero";
import NewsletterCapture from "@/app/components/NewsletterCapture";
import Comments from "@/app/components/Comments";
import PlaylistEmbed from "@/app/components/PlaylistEmbed";
import { getPlaylist } from "@/lib/playlists";
import { getProfileMerch } from "@/lib/merch";
import ClosingSection from "@/app/components/ClosingSection";
import ReadingProgressBar from "@/app/components/ReadingProgressBar";
import ProfileCardHero from "@/app/components/ProfileCardHero";
import { scrollytellingConfigs } from "@/lib/scrollytelling-configs";
import FloatingShareBar from "@/app/components/FloatingShareBar";
import PrevNextEdgeArrows from "@/app/components/PrevNextEdgeArrows";
import NextUpPopup from "@/app/components/NextUpPopup";
import VideoEmbed from "@/app/components/VideoEmbed";
import UpcomingEvents from "@/app/components/UpcomingEvents";
import ShelfLifeNotice from "@/app/components/ShelfLifeNotice";
import MerchBlock from "@/app/components/MerchBlock";
import ArtCredit from "@/app/components/ArtCredit";
import Callout from "@/app/components/Callout";
import NextProfileCard from "@/app/components/NextProfileCard";
import AuthorSupport from "@/app/components/AuthorSupport";

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
    <ul
      className="list-disc list-inside space-y-2 mb-6 text-ll-text"
      {...props}
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-6 text-ll-text"
      {...props}
    />
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
  hr: () => <hr className="my-10 border-t border-ll-border" />,
  ArticleImage,
  InlineImage,
  Figure,
  PhotoCarousel: PhotoCarouselLoader,
  PullQuote,
  FacebookEmbed,
  VideoLoop,
  VideoEmbed,
  UpcomingEvents,
  MerchBlock,
  ArtCredit,
  Callout,
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) return {};
  // AI-written drafts are not publishable — return empty metadata so nothing leaks.
  if (profile.frontmatter.aiWritten) return {};

  const { title, excerpt, metaDescription, name, location, tags } =
    profile.frontmatter;

  const seoDescription = metaDescription ?? excerpt;

  return {
    title: `${name} — ${location}`,
    description: seoDescription,
    alternates: {
      canonical: `/profiles/${slug}`,
    },
    keywords: tags,
    openGraph: {
      url: `/profiles/${slug}`,
      title,
      description: seoDescription,
      type: "article",
      publishedTime: profile.frontmatter.date,
      ...(profile.frontmatter.lastModified && {
        modifiedTime: profile.frontmatter.lastModified,
      }),
      tags,
      images: existsSync(join(process.cwd(), `public/images/social/${slug}-og.png`))
        ? [{ url: `/images/social/${slug}-og.png`, width: 1200, height: 630, alt: name }]
        : profile.frontmatter.heroImage
        ? [{ url: profile.frontmatter.heroImage, width: 1200, height: 630, alt: name }]
        : [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoDescription,
      images: existsSync(join(process.cwd(), `public/images/social/${slug}-og.png`))
        ? [`/images/social/${slug}-og.png`]
        : profile.frontmatter.heroImage
        ? [profile.frontmatter.heroImage]
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

export default async function ProfilePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) notFound();
  // published: false profiles intentionally render at their direct URL — this is the preview
  // workflow for sharing a draft with a profile subject before it appears in any listings.
  // They are excluded from the grid, RSS, sitemap, and search. Only someone with the exact
  // slug can reach them. Do NOT add a notFound() check here for published: false.
  // AI-written drafts are not publishable — 404 at runtime even on direct URL visits.
  // Local dev only: render them so Matt can review in the browser. Production still 404s.
  if (profile.frontmatter.aiWritten && process.env.NODE_ENV !== "development") notFound();

  const { frontmatter, content, readingTime } = profile;
  const { prev, next } = getAdjacentProfiles(slug);
  const scrollyConfig = scrollytellingConfigs[slug];

  const profileTags = frontmatter.tags ?? [];
  const others = getAllProfiles().filter((p) => p.slug !== slug);
  const tagMatched = others
    .map((p) => ({ profile: p, shared: (p.frontmatter.tags ?? []).filter((t) => profileTags.includes(t)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .map(({ profile }) => profile);
  const tagMatchedSlugs = new Set(tagMatched.map((p) => p.slug));
  const rest = others.filter((p) => !tagMatchedSlugs.has(p.slug));
  const related = [...tagMatched, ...rest].slice(0, 3);

  // If a scrollytelling config exists, render the immersive layout
  if (scrollyConfig) {
    return (
      <main id="main-content">
        <ScrollytellingProfile config={scrollyConfig} />
      </main>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: `${siteConfig.url}/profiles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.name,
        item: `${siteConfig.url}/profiles/${slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: frontmatter.date,
    ...(frontmatter.lastModified && {
      dateModified: frontmatter.lastModified,
    }),
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
    mainEntityOfPage: `${siteConfig.url}/profiles/${slug}`,
    ...(frontmatter.heroImage && {
      image: frontmatter.heroImage,
    }),
    ...(frontmatter.subtitle && {
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ".subtitle",
      },
    }),
    about: {
      "@type": "Person",
      name: frontmatter.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: frontmatter.location.split(",")[0]?.trim(),
        addressRegion: "AL",
      },
    },
  };

  return (
    <main id="main-content">
      <ReadingProgressBar />
      <PrevNextEdgeArrows prev={prev} next={next} />
      <FloatingShareBar slug={slug} title={frontmatter.title} description={frontmatter.excerpt ?? ""} />
      {next && <NextUpPopup next={next} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, articleSchema]),
        }}
      />

      {/* Hero — parallax by default, opt out with parallaxHero: false */}
      {frontmatter.parallaxHero !== false && frontmatter.heroImage ? (
        <ParallaxHero
          title={frontmatter.title}
          titleHtml={frontmatter.titleHtml}
          subtitle={frontmatter.subtitle}
          eyebrow={`${frontmatter.name} — ${frontmatter.location}`}
          heroImage={frontmatter.heroImage}
          heroAlt={frontmatter.heroAlt || frontmatter.name}
          heroPosition={frontmatter.heroPosition}
          heroTextBottom={frontmatter.heroTextBottom}
          heroFontSize={frontmatter.heroFontSize}
          displayTitle={frontmatter.displayTitle}
          cardFont={frontmatter.cardFont}
          slug={slug}
          photoCredit={frontmatter.photoCredit}
        />
      ) : (
        <section
          className={`relative text-white overflow-hidden ${frontmatter.heroImage ? "" : "gradient-hero"}`}
          style={{ ...(frontmatter.heroImage ? { background: "var(--color-ll-dark)" } : {}), viewTransitionName: `profile-hero-${slug}` } as React.CSSProperties}
        >
          {frontmatter.heroImage ? (
            <>
              <Image
                src={frontmatter.heroImage}
                alt={frontmatter.heroAlt || frontmatter.name}
                fill
                priority
                className="object-cover"
                sizes="100vw"
                style={frontmatter.heroPosition ? { objectPosition: frontmatter.heroPosition } : undefined}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ll-dark/95 via-ll-dark/60 to-ll-dark/25"
                style={{ zIndex: 1 }}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/50 z-[1]" aria-hidden="true" />
              <span className="ghost-initial" aria-hidden="true">
                {frontmatter.name.charAt(0)}
              </span>
            </>
          )}

          <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-14 md:pt-32 md:pb-18"
            style={{ zIndex: 2 }}
          >
            <Link
              href="/profiles"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ll-accent hover:text-ll-accent-dark transition-colors mb-8"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All Stories
            </Link>

            {frontmatter.titleHtml ? (
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white${frontmatter.displayTitle ? " profile-title-display" : ""}`}
                style={{ fontFamily: "var(--font-heading)" }}
                dangerouslySetInnerHTML={{ __html: frontmatter.titleHtml }}
              />
            ) : (
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white${frontmatter.displayTitle ? " profile-title-display" : ""}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {frontmatter.title}
              </h1>
            )}

            {frontmatter.name && frontmatter.name !== frontmatter.title && (
              <p className="mt-4 text-sm md:text-base font-medium tracking-wide text-ll-accent uppercase"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                {frontmatter.name}
              </p>
            )}

            {frontmatter.subtitle && (
              <p
                className="mt-4 text-base md:text-lg leading-relaxed text-white/75 max-w-2xl"
                data-speakable="true"
              >
                {frontmatter.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60">
              <span>By {siteConfig.author}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{frontmatter.location}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{formatDate(frontmatter.date)}</span>
              {frontmatter.lastModified &&
                frontmatter.lastModified !== frontmatter.date && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span>Updated {formatDate(frontmatter.lastModified)}</span>
                  </>
                )}
            </div>

          </div>
        </section>
      )}

      {/* Mobile deck — subtitle below hero, visible on mobile only */}
      {frontmatter.parallaxHero !== false && frontmatter.heroImage && frontmatter.subtitle && (
        <div className="sm:hidden bg-ll-light px-6 pt-6 pb-2">
          <p
            className="max-w-3xl mx-auto text-base italic leading-relaxed"
            style={{ color: "var(--color-ll-text)", fontFamily: "var(--font-heading)", fontWeight: 300 }}
          >
            {frontmatter.subtitle}
          </p>
        </div>
      )}

      {/* Hero Caption */}
      {(frontmatter.heroCaption || frontmatter.heroCaptionHtml) && (
        <div className="bg-ll-light border-b border-ll-border">
          {frontmatter.heroCaptionHtml ? (
            <p className="max-w-3xl mx-auto px-6 py-3 text-xs text-ll-text-light italic text-right"
              dangerouslySetInnerHTML={{ __html: frontmatter.heroCaptionHtml }}
            />
          ) : (
            <p className="max-w-3xl mx-auto px-6 py-3 text-xs text-ll-text-light italic text-right">
              {frontmatter.heroCaption}
            </p>
          )}
        </div>
      )}

      <div id="hero-end-sentinel" aria-hidden="true" />

      {/* Article Content */}
      {/* Ad policy (2026-10-05, Matt: income first through the show): while a campaign is
          featured, a slim strip opens the article and the full band closes it. Otherwise
          ONE ad, end-of-article. Sensitive pages get only the soft Support ad. */}
      <article className="bg-ll-light">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose-profile">
          {(() => {
            const pageCta = pickCTA({ category: (frontmatter as { category?: string }).category, tags: frontmatter.tags });
            const top = snapshotAd(`profiles/${slug}`, { category: (frontmatter as { category?: string }).category, tags: frontmatter.tags }, pageCta.key);
            return top?.key === "aisle" ? <AisleStrip ad={top} page={`profiles/${slug}`} /> : null;
          })()}
          <ShelfLifeNotice
            shelfLife={frontmatter.shelfLife}
            validUntil={frontmatter.validUntil}
            label={frontmatter.shelfLabel}
            evergreenHref={frontmatter.evergreenHref}
          />
          <MDXRemote source={content} components={mdxComponents} />
          {(() => {
            const pl = getPlaylist(slug);
            return pl ? (
              <div className="mt-10 not-prose">
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
      <div id="share-bar-sentinel" aria-hidden="true" />

      {/* Context-aware CTA — pickCTA matches the page's topic to the right
          venture, or falls back to a soft SL subscribe. No mismatched pitches
          on arts / personal / community profiles. See lib/cta-router.ts */}
      {(() => {
        const cta = pickCTA({
          category: (frontmatter as { category?: string }).category,
          tags: frontmatter.tags,
        });
        return (
          <div className="bg-ll-warm border-t border-ll-accent/10 px-6 py-10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-ll-accent-dark text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "var(--font-body)" }}>
                {cta.eyebrow}
              </p>
              <p className="text-ll-dark font-normal mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}>
                {cta.headline}
              </p>
              <p className="text-ll-dark/80 text-[0.9375rem] leading-relaxed mb-6 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                {cta.body}
              </p>
              <a
                href={cta.href}
                className="inline-block bg-ll-primary hover:bg-ll-primary-dark text-ll-warm font-semibold text-sm px-6 py-2.5 rounded transition-colors no-underline"
              >
                {cta.cta}
              </a>
            </div>
          </div>
        );
      })()}

      {/* Ad slot — a house cross-promo for a DIFFERENT venture than the page CTA,
          so the profile visibly carries buyable ad inventory. Renders nothing on
          sensitive topics (pickHouseAd returns null). Canonical unit: @mpheadley/shared
          GatherAd; this is SL's deploy-safe local mirror. See lib/cta-router.ts */}
      {(() => {
        const pageCta = pickCTA({
          category: (frontmatter as { category?: string }).category,
          tags: frontmatter.tags,
        });
        const houseAd = snapshotAd(`profiles/${slug}`, 
          {
            category: (frontmatter as { category?: string }).category,
            tags: frontmatter.tags,
          },
          pageCta.key,
        );
        return houseAd ? <HouseAdUnit ad={houseAd} page={`profiles/${slug}`} /> : null;
      })()}

      <Comments slug={slug} />

      {/* Closing */}
      {(() => {
        const { primary, secondary, tertiary } = getProfileMerch(slug);
        const fm = frontmatter as unknown as { audioUrl?: string; youtubeUrl?: string };
        // Bottom podcast player ALWAYS shows (the SL show) — at the top it only
        // shows when the piece has its own episode (fm.audioUrl). See [[feedback_sl_podcast_player]].
        const podcastUrls = {
          spotify: "https://open.spotify.com/show/033rE2IJkbyZuLXZwEjtgo",
          apple: "https://podcasts.apple.com/podcast/id1896892029",
          youtube: fm.youtubeUrl ?? "https://www.youtube.com/@mpheadley",
        };
        return (
          <ClosingSection
            shareUrl={`/profiles/${slug}`}
            title={frontmatter.title}
            excerpt={frontmatter.excerpt}
            primary={primary}
            secondary={secondary}
            tertiary={tertiary}
            podcastUrls={podcastUrls}
          />
        );
      })()}

      {/* Related Stories by tag */}
      {related.length > 0 && (
        <section className="bg-ll-warm border-t border-ll-border py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-sm font-semibold uppercase tracking-[0.15em] text-ll-text-light mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More Stories
            </h2>
            <div className={`grid gap-8 ${related.length === 1 ? "max-w-sm" : related.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {related.map((p) => (
                <ProfileCardHero key={p.slug} profile={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next Profile */}
      {next && (
        <NextProfileCard
          slug={next.slug}
          name={next.frontmatter.name}
          teaser={next.frontmatter.excerpt ?? next.frontmatter.subtitle ?? ""}
          image={next.frontmatter.heroImage}
        />
      )}

      {/* Subscribe */}
      <NewsletterCapture source="profile" />

      <AuthorSupport />
    </main>
  );
}
