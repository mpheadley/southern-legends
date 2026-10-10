export const revalidate = 300

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
          {/* Rewritten 2026-10-10 (design audit C-13) from what the code actually does:
              api/subscribe, api/city-newsletter (Resend), api/comments (Supabase),
              api/members + lib/subscribers (sl_member cookie), Stripe checkout routes,
              TurnstileWidget, CookieBanner + Analytics (GA4 after consent), api/ad-event. */}
          <p>
            Southern Legends is a small editorial site run by one person. I
            don&apos;t sell your information. Here is what the site collects,
            and why.
          </p>

          <h2>Analytics</h2>

          <p>
            If you visit without accepting the cookie banner, no analytics run.
            If you accept, the site loads <strong>Google Analytics 4 (GA4)</strong>{" "}
            to measure traffic: which stories get read, how people find the
            site, and roughly where visitors are. GA4 sets its own cookies to
            tell sessions apart. It does not get your name or email from this
            site.
          </p>

          <p>
            The site also counts views and clicks on its own small promos (for
            example, The Aisle bridal show). That count records the page and
            the promo, plus a random session ID. No name, no email, no cookie.
          </p>

          <h2>Email newsletter</h2>

          <p>
            When you subscribe, your email address (and first name, if you give
            it) goes to <strong>Resend</strong>, the service that sends the
            newsletter. Every email has an unsubscribe link. Subscribe forms are
            protected by <strong>Cloudflare Turnstile</strong>, a spam check that
            may look at your browser and IP address to tell people from bots.
          </p>

          <h2>Comments and reviews</h2>

          <p>
            If you leave a comment on a story, the site stores your name, your
            message, and your email if you choose to give it (used only to tell
            you about replies, if you ask for that). Trail reviews store the
            name and review you submit. Comments are held for approval before
            they appear. Your email is never shown publicly.
          </p>
          {/* [EDIT: confirm] — how long comments/reviews are kept and whether Supabase logs IP addresses. */}

          <h2>Payments and members</h2>

          <p>
            Purchases, memberships, and support payments are handled by{" "}
            <strong>Stripe</strong>. Card details go straight to Stripe; this
            site never sees or stores them. For memberships, the site keeps
            your email, your Stripe customer and subscription IDs, and whether
            the membership is active.
          </p>

          <h2>Cookies and browser storage</h2>

          <ul>
            <li>
              <code>cookie_consent</code> (stored in your browser) remembers
              whether you accepted analytics.
            </li>
            <li>
              <code>sl_member</code> is a sign-in cookie, set only if you
              unlock the members area. It lasts 30 days.
            </li>
            <li>
              A few small browser-storage flags remember whether you&apos;ve
              already seen a popup, so it doesn&apos;t keep showing.
            </li>
            <li>
              Google sets its own analytics cookies, only after you accept.
            </li>
          </ul>

          <p>
            Some stories embed videos or music from YouTube, Spotify, or
            Facebook. Those players come from those companies and follow their
            own privacy policies.
          </p>

          <p>
            To reset your cookie choice, clear this site&apos;s cookies and
            storage in your browser. The banner will come back on your next
            visit.
          </p>

          <h2>Who sees it</h2>

          <p>
            I use this information to run the site, send the newsletter, and
            see which stories reach people in Northeast Alabama. It isn&apos;t
            sold. The services named above (Google, Resend, Cloudflare,
            Stripe, and the database host for comments) handle it on the
            site&apos;s behalf under their own privacy policies.
          </p>

          <p>
            Want your email, comment, or review removed? Email me and I&apos;ll
            take care of it.
          </p>

          <h2>Contact</h2>

          <p>
            Questions about any of this? Reach out at{" "}
            <a href="mailto:matt@gatherstudio.app">matt@gatherstudio.app</a>.
          </p>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Last updated October 2026. Southern Legends is built and maintained by{" "}
            <a
              href="https://gatherstudio.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gather Studio
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
