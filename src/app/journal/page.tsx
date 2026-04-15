import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllJournalPosts } from "@/lib/journal";
import { siteConfig } from "@/lib/site-config";
import SubscribeCTA from "@/app/components/SubscribeCTA";

export const metadata: Metadata = {
  title: "Journal",
  description: `Matt Headley writes about what's behind the profiles — and what's behind him.`,
  alternates: { canonical: "/journal" },
  openGraph: { url: "/journal" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalPage() {
  const posts = getAllJournalPosts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${siteConfig.url}/journal` },
    ],
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative text-white overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-black/50 z-[1]" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-10 md:pt-32 md:pb-14">
          <h1
            className="text-3xl md:text-4xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Journal
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-xl">
            I write about what&apos;s behind the profiles. And what&apos;s behind me.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          {posts.length === 0 ? (
            <p className="text-ll-text-light text-sm">Coming soon.</p>
          ) : (
            <ul className="space-y-10">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-ll-border pb-10 last:border-0 last:pb-0">
                  <Link href={`/journal/${post.slug}`} className="group flex gap-6 items-start">
                    {post.frontmatter.image && (
                      <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
                        <Image
                          src={post.frontmatter.image}
                          alt={post.frontmatter.imageAlt ?? post.frontmatter.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ll-text-light mb-2 uppercase tracking-wide">
                        {formatDate(post.frontmatter.date)}
                        {post.frontmatter.originalPublication && (
                          <> &middot; Originally in {post.frontmatter.originalPublication.name}</>
                        )}
                      </p>
                      <h2
                        className="text-xl md:text-2xl font-bold text-ll-dark group-hover:text-ll-primary transition-colors mb-3"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {post.frontmatter.title}
                      </h2>
                      <p className="text-ll-text leading-relaxed">{post.frontmatter.excerpt}</p>
                      <span className="inline-block mt-4 text-sm font-medium text-ll-primary group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Subscribe */}
      <SubscribeCTA />

    </main>
  );
}
