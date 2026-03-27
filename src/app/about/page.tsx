import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — why we tell these stories and who's behind the project.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "/about",
  },
};

export default function AboutPage() {
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
        name: "About",
        item: `${siteConfig.url}/about`,
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
            className="text-3xl md:text-4xl font-bold animate-on-scroll uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose-profile">
          <p>
            Most of the people worth writing about never get written about.
            They make the local news when they open a business or win an award,
            and that&apos;s about it. Nobody sits down and asks them how they
            got here.
          </p>

          <p>
            That&apos;s what Southern Legends is. Profiles of people, places,
            and organizations in Northeast Alabama, written with enough room
            to actually tell the story.
          </p>

          <h2>Who&apos;s Behind This?</h2>

          <div className="not-prose my-6">
            <Image
              src="/images/about/headshot-hedcut-matt-headley.webp"
              alt="Matt Headley, illustrated portrait"
              width={120}
              height={120}
              className="rounded-lg float-left mr-6 mb-2"
            />
            <p className="text-ll-text leading-relaxed mb-6">
              My name is Matt Headley. I&apos;m a web designer based in
              Jacksonville, Alabama. I run{" "}
              <a
                href="https://headleyweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
              >
                Headley Web &amp; SEO
              </a>
              , where I build websites for local businesses.
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              I started Southern Legends because I kept meeting people whose stories
              were too good not to share. The more businesses I worked with, the
              more I realized that the best part wasn&apos;t the website. It was
              sitting down and hearing someone talk about the work they love.
            </p>
          </div>

          <h2>Know Someone Worth Writing About?</h2>

          <p>
            The best profiles start with a recommendation. If you know a person
            or a place whose story deserves more than a paragraph in the local
            paper, I&apos;d like to hear about it.
          </p>

          <p>
            Reach out at{" "}
            <a href="mailto:matt@headleyweb.com">matt@headleyweb.com</a>.
          </p>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Southern Legends is built and maintained by{" "}
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
