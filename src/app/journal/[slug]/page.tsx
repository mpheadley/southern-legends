import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { getAllJournalPosts, getJournalPostBySlug } from "@/lib/journal";
import { siteConfig } from "@/lib/site-config";
import ShareButtons from "@/app/components/ShareButtons";
import PullQuote from "@/app/components/PullQuote";

function FeaturedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="not-prose my-10">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={600}
        className="w-full rounded-lg object-cover"
      />
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
  hr: () => <hr className="my-10 border-t border-ll-border" />,
  PullQuote,
  FeaturedImage,
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post || !post.frontmatter.published) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      url: `/journal/${slug}`,
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
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

  const { frontmatter, content, readingTime } = post;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${siteConfig.url}/journal` },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: `${siteConfig.url}/journal/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: frontmatter.date,
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
    mainEntityOfPage: `${siteConfig.url}/journal/${slug}`,
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, articleSchema]) }}
      />

      {/* Hero */}
      <section className="relative text-white overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-black/50 z-[1]" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-14 md:pt-32 md:pb-18">
          <Link
            href="/journal"
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

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/60">
            <span>By {siteConfig.author}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{formatDate(frontmatter.date)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="bg-ll-light">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose-profile">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      {/* Closing */}
      <section className="profile-closing">
        <div className="profile-closing-author">
          <Image
            src="/images/about/headshot-hedcut-matt-headley.webp"
            alt="Matt Headley"
            width={48}
            height={48}
            className="rounded-full shrink-0"
            style={{ width: "48px", height: "48px" }}
          />
          <div>
            <p className="profile-closing-bio">
              <Link href="/about" className="profile-closing-name">
                Matt Headley
              </Link>{" "}
              is a former pastor, classically trained singer, and flower farmer from Northeast Alabama.
            </p>
            <div className="profile-closing-links">
              <Link href="/journal" className="profile-closing-link">
                More from the journal →
              </Link>
              <Link href="/profiles" className="profile-closing-link">
                Read the stories →
              </Link>
            </div>
          </div>
        </div>

        <div className="profile-closing-divider" />

        <div className="profile-closing-share">
          <p className="profile-closing-share-label">Found this useful?</p>
          <ShareButtons
            url={`/journal/${slug}`}
            title={frontmatter.title}
            description={frontmatter.excerpt}
          />
        </div>
      </section>
    </main>
  );
}
