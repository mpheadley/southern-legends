import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects and uses data.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "/privacy",
  },
};

export default function PrivacyPage() {
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
        name: "Privacy Policy",
        item: `${siteConfig.url}/privacy`,
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
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose-profile">
          <p>
            Southern Legends is a small editorial site. We don&apos;t sell
            anything, run ads, or collect personal information beyond what&apos;s
            described below.
          </p>

          <h2>What We Collect</h2>

          <p>
            If you visit the site without accepting cookies, we collect nothing.
            Full stop.
          </p>

          <p>
            If you accept cookies, we use{" "}
            <strong>Google Analytics 4 (GA4)</strong> to measure traffic — things
            like which stories get read, how people find the site, and roughly
            where visitors are coming from. GA4 uses cookies to track sessions
            and page views. No names, no email addresses, no account data.
          </p>

          <p>
            We don&apos;t have a newsletter signup, comment system, or user
            accounts, so there&apos;s no way to submit personal information
            through the site itself.
          </p>

          <h2>Cookies</h2>

          <p>
            We use one first-party cookie to remember your consent choice
            (<code>cookie_consent</code>). If you accept analytics, Google sets
            additional cookies to distinguish sessions and measure traffic. You
            can decline at any time — the site works exactly the same either way.
          </p>

          <p>
            If you want to clear your choice, clearing your browser&apos;s
            cookies for this site will reset the banner on your next visit.
          </p>

          <h2>How It&apos;s Used</h2>

          <p>
            Analytics data helps me understand which stories are resonating and
            whether the site is actually reaching people in Northeast Alabama.
            That&apos;s it. The data isn&apos;t shared with anyone, sold, or used
            for advertising.
          </p>

          <h2>Third Parties</h2>

          <p>
            The only third-party service with any access to site data is Google
            Analytics, and only when you&apos;ve consented. Google&apos;s own
            privacy policy governs how they handle that data.
          </p>

          <h2>Contact</h2>

          <p>
            Questions about any of this? Reach out at{" "}
            <a href="mailto:matt@headleyweb.com">matt@headleyweb.com</a>.
          </p>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Last updated March 2026. Southern Legends is built and maintained by{" "}
            <a
              href="https://headleyweb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Headley Web &amp; SEO
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
