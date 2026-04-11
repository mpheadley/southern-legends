import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Journal",
  description: `Matt Headley writes about what's behind the profiles — and what's behind him. Coming soon to Southern Legends.`,
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    url: "/journal",
  },
};

export default function JournalPage() {
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
        name: "Journal",
        item: `${siteConfig.url}/journal`,
      },
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
        </div>
      </section>

      {/* Content */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose-profile">
          <p>
            I write about what&apos;s behind the profiles. And what&apos;s behind me.
          </p>
          <p className="text-ll-text-light text-sm">
            Coming soon.
          </p>
        </div>
      </section>
    </main>
  );
}
