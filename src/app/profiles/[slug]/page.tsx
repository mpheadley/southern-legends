import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { existsSync } from "fs";
import { join } from "path";
import {
  getProfileBySlug,
  getProfileSlugs,
  getAdjacentProfiles,
} from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import ArticleImage from "@/app/components/ArticleImage";
import PhotoCarouselLoader from "@/app/components/PhotoCarouselLoader";
import PullQuote from "@/app/components/PullQuote";
import VideoLoop from "@/app/components/VideoLoop";
import StoryNav from "@/app/components/StoryNav";
import ShareButtons from "@/app/components/ShareButtons";
import ScrollytellingProfile from "@/app/components/ScrollytellingProfile";
import ParallaxHero from "@/app/components/ParallaxHero";
import { scrollytellingConfigs } from "@/lib/scrollytelling-configs";

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
  PhotoCarousel: PhotoCarouselLoader,
  PullQuote,
  VideoLoop,
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getProfileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) return {};

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
      ...(existsSync(join(process.cwd(), `public/images/social/${slug}-og.png`)) && {
        images: [`/images/social/${slug}-og.png`],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoDescription,
      ...(existsSync(join(process.cwd(), `public/images/social/${slug}-og.png`)) && {
        images: [`/images/social/${slug}-og.png`],
      }),
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

  const { frontmatter, content, readingTime } = profile;
  const { prev, next } = getAdjacentProfiles(slug);
  const scrollyConfig = scrollytellingConfigs[slug];

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
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: frontmatter.date,
    ...(frontmatter.lastModified && {
      dateModified: frontmatter.lastModified,
    }),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: "https://headleyweb.com",
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
        />
      ) : (
        <section className={`relative text-white overflow-hidden ${frontmatter.heroImage ? "" : "gradient-hero"}`}
          style={frontmatter.heroImage ? { background: "var(--color-ll-dark)" } : undefined}
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
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
                dangerouslySetInnerHTML={{ __html: frontmatter.titleHtml }}
              />
            ) : (
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
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

      {/* Article Content */}
      <article className="bg-ll-light">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose-profile">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      {/* Closing — author credit, share, tags on dark topo/gradient */}
      <section className="profile-closing">
        {/* Author credit */}
        <div className="profile-closing-author">
          <Image
            src="/images/about/headshot-hedcut-matt-headley.webp"
            alt="Matt Headley"
            width={48}
            height={48}
            className="rounded-full shrink-0"
            style={{ width: "48px", height: "48px" }}
          />
          <p className="profile-closing-bio">
            <Link href="/about" className="profile-closing-name">
              Matt Headley
            </Link>{" "}
            lives in Jacksonville, Alabama. He builds websites for local businesses at{" "}
            <a href="https://headleyweb.com" target="_blank" rel="noopener noreferrer" className="profile-closing-link">
              headleyweb.com
            </a>
            {" "}and writes about the people and places he finds along the way.
          </p>
        </div>

        {/* Divider */}
        <div className="profile-closing-divider" />

        {/* Share */}
        <div className="profile-closing-share">
          <p className="profile-closing-share-label">Enjoyed this story?</p>
          <ShareButtons
            url={`/profiles/${frontmatter.slug}`}
            title={frontmatter.title}
            description={frontmatter.excerpt}
          />
        </div>

      </section>

      {/* Story Navigation (prev/next) */}
      <StoryNav prev={prev} next={next} />

      {/* Nominate CTA */}
      <section className="bg-ll-dark">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-center">
          <h2
            className="text-xl md:text-2xl font-bold text-white mb-4 animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Know Someone Worth Writing About?
          </h2>
          <p className="mb-6 max-w-xl mx-auto animate-on-scroll" style={{ color: "rgba(255,255,255,0.6)" }}>
            The best profiles start with a recommendation. If you know a person
            or a place whose story deserves more than a paragraph in the local
            paper, I&apos;d like to hear about it.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors animate-on-scroll"
          >
            Tell Me About Them
          </Link>
        </div>
      </section>
    </main>
  );
}
