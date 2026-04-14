import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
            className="text-3xl md:text-4xl font-bold uppercase tracking-tight"
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
            I profile people in Northeast Alabama. Business owners, mostly.
            But also places and organizations that have been here long enough
            to have a story worth hearing.
          </p>

          <p>
            The format is simple. I sit down with someone, ask how they got
            here, and write it with enough room to actually tell the story.
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
              My name is Matt Headley. I live in Jacksonville. I spent nineteen
              years in music and pastoral ministry. Somewhere in the middle of
              that, my wife and I built a
              flower farm. Cut flowers, farmers markets, a little retail kiosk
              on the Chief Ladiga Trail. We built that thing from the ground up,
              with our kids underfoot. And then we lost it.
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              I still drive past farms and gardens on my way to work. Some days
              it&apos;s fine. Some days it isn&apos;t.
            </p>
          </div>

          <div className="not-prose my-8 grid grid-cols-2 gap-4">
            <Image
              src="/images/about/matt-and-heather-flower-farm.webp"
              alt="Matt and Heather Headley at the flower farm"
              width={720}
              height={720}
              className="w-full rounded-lg object-cover aspect-square"
            />
            <Image
              src="/images/about/headley-flower-farm-field.webp"
              alt="Rows of zinnias and echinacea at Headley Flower Farm"
              width={800}
              height={600}
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>

          <div className="not-prose">
            <p className="text-ll-text leading-relaxed mb-6">
              What I do now is build websites and run search campaigns for local businesses. That&apos;s{" "}
              <a
                href="https://headleyweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
              >
                Headley Web &amp; SEO
              </a>
              . Southern Legends started because the work kept putting me across
              the table from people, and I needed that more than I expected.
              Turns out sitting
              with someone and asking them to tell you their story is one of the
              ways back. My writing has appeared in the{" "}
              <Link
                href="/journal/hope-in-the-wilderness"
                className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
              >
                Anniston Star
              </Link>
              .
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              When you&apos;ve lost something you built, you notice the people
              who are still building. You pay attention differently. You ask
              better questions.
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

          <p>
            If Southern Legends has meant something to you, you can{" "}
            <Link
              href="/support"
              className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
            >
              support this work here
            </Link>
            . There&apos;s also a{" "}
            <Link
              href="/journal"
              className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
            >
              journal
            </Link>{" "}
            — where I write about what&apos;s behind the profiles, and what&apos;s behind me.
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
