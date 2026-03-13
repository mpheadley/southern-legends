import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getProfileBySlug,
  getProfileSlugs,
  getAdjacentProfiles,
} from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import PullQuote from "@/app/components/PullQuote";
import ShareButtons from "@/app/components/ShareButtons";
import StoryNav from "@/app/components/StoryNav";
import SubscribeCTA from "@/app/components/SubscribeCTA";

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
  PullQuote,
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

  const { title, excerpt, name, location, heroImage, tags } =
    profile.frontmatter;

  return {
    title: `${name} — ${location}`,
    description: excerpt,
    alternates: {
      canonical: `/profiles/${slug}`,
    },
    keywords: tags,
    openGraph: {
      url: `/profiles/${slug}`,
      title,
      description: excerpt,
      type: "article",
      publishedTime: profile.frontmatter.date,
      ...(profile.frontmatter.lastModified && {
        modifiedTime: profile.frontmatter.lastModified,
      }),
      tags,
      ...(heroImage && {
        images: [
          {
            url: heroImage,
            width: 1200,
            height: 630,
            alt: `${name} — ${location}`,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
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
    },
    mainEntityOfPage: `${siteConfig.url}/profiles/${slug}`,
    ...(frontmatter.heroImage && {
      image: frontmatter.heroImage,
    }),
    ...(frontmatter.tldr && {
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ".tldr",
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

      {/* Hero */}
      <section className="relative bg-ll-dark text-white overflow-hidden topo-texture">
        {/* Ghost Initial */}
        <span className="ghost-initial" aria-hidden="true">
          {frontmatter.name.charAt(0)}
        </span>

        <div className="relative max-w-3xl mx-auto px-6 pt-32 pb-16 md:pt-36 md:pb-20"
          style={{ zIndex: 2 }}
        >
          <Link
            href="/profiles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ll-accent hover:text-ll-accent-dark transition-colors mb-8"
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

          {/* Tags */}
          {frontmatter.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/profiles?tag=${encodeURIComponent(tag)}`}
                  className="category-tag hover:opacity-80 transition-opacity"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {frontmatter.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60 animate-on-scroll">
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
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime}</span>
          </div>

          {/* Share buttons */}
          <div className="mt-6 animate-on-scroll">
            <ShareButtons
              url={`/profiles/${slug}`}
              title={frontmatter.title}
              description={frontmatter.excerpt}
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="bg-ll-light">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose-profile">
          {/* TL;DR / The Short Version */}
          {frontmatter.tldr && (
            <div
              className="tldr mb-12 p-6 bg-ll-warm rounded-lg border-l-4 border-ll-accent"
              data-speakable="true"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-ll-accent mb-2">
                The Short Version
              </p>
              <p className="text-ll-text leading-relaxed text-base italic mb-0">
                {frontmatter.tldr}
              </p>
            </div>
          )}

          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      {/* Story Navigation (prev/next) */}
      <StoryNav prev={prev} next={next} />

      {/* Nominate CTA */}
      <section className="bg-ll-warm">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-center">
          <h2
            className="text-xl md:text-2xl font-bold text-ll-dark mb-4 animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Know a Local Legend?
          </h2>
          <p className="text-ll-text-light mb-6 max-w-xl mx-auto animate-on-scroll">
            If you know someone in Northeast Alabama whose story deserves to be
            told, we&apos;d love to hear about them.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors animate-on-scroll"
          >
            Nominate Someone
          </Link>
        </div>
      </section>

      {/* Subscribe CTA */}
      <SubscribeCTA />
    </main>
  );
}
