import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import StripePricingTable from "@/app/components/StripePricingTable";
import SubscribeCTA from "@/app/components/SubscribeCTA";

export const metadata: Metadata = {
  title: "Support",
  description: `Support Southern Legends — free stories from Northeast Alabama, written by Matt Headley.`,
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    url: "/support",
  },
};

export default function SupportPage() {
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
        name: "Support",
        item: `${siteConfig.url}/support`,
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
            Support This Work
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose-profile">
          <p>
            Southern Legends is free.
          </p>

          <p>
            There&apos;s real time in this. If you&apos;ve read something here that meant something, this is a way to say so. A story that sounded like someone you know. A place you&apos;ve driven past a hundred times without stopping.
          </p>

          <div className="not-prose mt-10">
            <StripePricingTable />
          </div>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm font-medium text-ll-dark">Prefer a one-time gift?</p>

          <div className="not-prose mt-4">
            {process.env.NEXT_PUBLIC_STRIPE_SUPPORT_URL && (
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-support inline-block px-7 py-3 bg-ll-primary font-bold text-sm rounded-md hover:bg-ll-primary-dark"
              >
                Give a one-time gift →
              </a>
            )}
            <p className="text-sm text-ll-text-light mt-4">
              No account needed. Processed securely by Stripe.
            </p>
          </div>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Questions?{" "}
            <a
              href="mailto:matt@headleyweb.com"
              className="text-ll-primary underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
            >
              matt@headleyweb.com
            </a>
          </p>
        </div>
      </section>

      <SubscribeCTA variant="section" />
    </main>
  );
}
