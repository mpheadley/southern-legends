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
import Comments from "@/app/components/Comments";
import JournalCard from "@/app/components/JournalCard";
import ProfileCard from "@/app/components/ProfileCard";
import SubscribeCTA from "@/app/components/SubscribeCTA";

function Dateline({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm italic text-ll-text-light mb-6 leading-relaxed">
      {children}
    </div>
  );
}

function FeaturedImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="not-prose my-10">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={600}
        className="w-full rounded-lg object-cover"
        priority
      />
      {caption && (
        <p className="mt-2 text-xs text-center italic text-ll-text-light">{caption}</p>
      )}
    </div>
  );
}

function InlineImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="not-prose my-8 mx-auto" style={{ maxWidth: "400px" }}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={533}
        className="w-full rounded-lg object-cover"
      />
      {caption && (
        <p className="mt-2 text-xs text-center italic text-ll-text-light">{caption}</p>
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
  hr: () => <hr className="my-10 border-t border-ll-border" />,
  PullQuote,
  FeaturedImage,
  InlineImage,
  Dateline,
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getJournalSlugs().map((slug) => ({ slug }));
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
      ...(post.frontmatter.image && {
        images: [{ url: post.frontmatter.image, alt: post.frontmatter.imageAlt ?? post.frontmatter.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      ...(post.frontmatter.image && {
        images: [post.frontmatter.image],
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

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  const moreJournal = getOtherJournalPosts(slug, 2);
  const profiles = getAllProfiles().slice(0, 3);

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
      <section
        className="relative text-white overflow-hidden gradient-hero"
        style={{ viewTransitionName: `journal-hero-${slug}` } as React.CSSProperties}
      >
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
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose-journal">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      <Comments slug={slug} />

      {/* Share + Support */}
      <section className="profile-closing">
        <div className="profile-closing-share">
          <ShareButtons
            url={`/journal/${slug}`}
            title={frontmatter.title}
            description={frontmatter.excerpt}
          />
        </div>
        <Link href="/support" className="journal-support-btn">
          Support this work →
        </Link>
      </section>

      {/* Subscribe */}
      <SubscribeCTA />

      {/* More from the Journal */}
      {moreJournal.length > 0 && (
        <section className="bg-ll-warm py-12 md:py-16 border-t border-ll-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-xl font-bold text-ll-dark mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Link href="/journal" className="hover:text-ll-primary transition-colors">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {profiles.map((p) => (
                <ProfileCard key={p.slug} profile={p} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
