import { getAllProfiles, getAllTags } from "@/lib/profiles";
import ProfileCard from "../components/ProfileCard";
import { siteConfig } from "@/lib/site-config";
import SubscribeCTA from "../components/SubscribeCTA";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stories",
  description:
    "Browse all profiles of local legends from Northeast Alabama — craftspeople, musicians, business owners, and community figures.",
  alternates: {
    canonical: "/profiles",
    types: {
      "application/rss+xml": "/profiles/feed.xml",
    },
  },
  openGraph: {
    url: "/profiles",
  },
};

type SearchParams = Promise<{ tag?: string }>;

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tag } = await searchParams;
  const allProfiles = getAllProfiles();
  const allTags = getAllTags();

  const profiles = tag
    ? allProfiles.filter((p) => p.frontmatter.tags?.includes(tag))
    : allProfiles;

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
    ],
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative text-white overflow-hidden gradient-hero">
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-12 md:pt-36 md:pb-16">
          <h1
            className="text-3xl md:text-4xl font-bold animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {tag ? `Stories tagged "${tag}"` : "All Stories"}
          </h1>
          <p className="mt-4 text-white/60 animate-on-scroll">
            {profiles.length} {profiles.length === 1 ? "story" : "stories"}
            {tag ? ` tagged "${tag}"` : ""} and counting.
          </p>
        </div>
      </section>

      <section className="bg-ll-light">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          {/* Tag filters */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 animate-on-scroll">
              {tag && (
                <Link
                  href="/profiles"
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-ll-dark text-white hover:bg-ll-text transition-colors"
                >
                  Clear filter
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/profiles?tag=${encodeURIComponent(t)}`}
                  className={`category-tag transition-opacity ${
                    tag === t ? "opacity-100 ring-2 ring-ll-accent" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          )}

          {profiles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, i) => (
                <div
                  key={profile.slug}
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-ll-text-light py-12">
              No stories found{tag ? ` for "${tag}"` : ""}. Check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <SubscribeCTA />
    </main>
  );
}
