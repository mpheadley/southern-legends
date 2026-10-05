export const revalidate = 300

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import SubscribeCTA from "@/app/components/SubscribeCTA";

const PODCAST_PLATFORMS = [
  { name: "Spotify", href: siteConfig.podcast.spotify, color: "#1DB954" },
  { name: "Apple Podcasts", href: siteConfig.podcast.apple, color: "#9c27b0" },
  { name: "YouTube", href: siteConfig.podcast.youtube, color: "#FF0000" },
];

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

          <h2 id="farm">Who&apos;s Behind This?</h2>

          <div className="not-prose my-6">
            <Image
              src="/images/about/headshot-hedcut-matt-headley.webp"
              alt="Matt Headley, illustrated portrait"
              width={120}
              height={120}
              className="rounded-lg float-left mr-6 mb-2"
            />
            <p className="text-ll-text leading-relaxed mb-6">
              My name is Matt Headley. I live in Jacksonville. I spent twenty
              years in music and pastoral ministry. Somewhere in the middle of
              that, my wife Heather and I built a
              flower farm. Cut flowers, farmers markets, a little retail kiosk
              on the Chief Ladiga Trail. We built that thing from the ground up,
              with our kids underfoot. And then we had to sell it.
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              I still drive past farms and gardens on my way to work. Some days
              it&apos;s fine. Some days it isn&apos;t.
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              I was diagnosed with bipolar disorder at 41. I&apos;m in recovery. I was born in California and have lived in Northeast Alabama for twenty-eight years.
            </p>
          </div>

          <div className="not-prose my-8">
            <Image
              src="/images/about/headley-flower-farm-field.webp"
              alt="Rows of zinnias and echinacea at Headley Flower Farm"
              width={800}
              height={600}
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: 280, objectPosition: "center" }}
            />
          </div>
          <div className="not-prose my-8">
            <Image
              src="/images/about/patreon-heather-matt-farm.webp"
              alt="Matt and Heather at the farm — near the end"
              width={2498}
              height={1338}
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: 320, objectPosition: "center 30%" }}
            />
          </div>

          <div>
            <p className="text-ll-text leading-relaxed mb-6">
              What I do now is help small business owners find and say the true
              thing about what they do. I run{" "}
              <a
                href="https://plainspokenblueprint.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
              >
                Gather Studio
              </a>
              {" "}— a messaging clarity practice built from fifteen years in the pulpit, a flower farm, and thirty pieces of software for
              florists, farmers market managers, pastors, and wedding vendors. One 90-minute session. One page. A message that works before you walk in the room.
            </p>
            <p className="text-ll-text leading-relaxed mb-6">
              Southern Legends started because the work kept putting me across
              the table from people, and I needed that more than I expected.
              Turns out sitting with someone and asking them to tell you their story is one of the
              ways back. I wrote more about{" "}
              <Link
                href="/essays/the-same-domain"
                className="text-ll-primary font-medium underline underline-offset-3 hover:text-ll-primary-dark transition-colors"
              >
                why this site exists
              </Link>
              {" "}in the journal. My writing has appeared in the{" "}
              <Link
                href="/essays/hope-in-the-wilderness"
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

          {/* PB section — navy hero treatment */}
          <div className="not-prose my-8 rounded-lg overflow-hidden" style={{ position: "relative", background: "#0c1632" }}>
            {/* Blueprint grid */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(100,140,200,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(100,140,200,0.10) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            {/* Acorn watermark */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", pointerEvents: "none", overflow: "hidden" }}>
              <Image src="/images/acorn-mark-pb.png" alt="" width={480} height={480} style={{ opacity: 0.07, marginRight: "-60px" }} />
            </div>
            {/* Content */}
            <div style={{ position: "relative", zIndex: 1, padding: "2rem 1.75rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b9f78", marginBottom: "1rem" }}>
                Gather Studio
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                <span style={{ display: "block", color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>Clever confuses.</span>
                <span style={{ display: "block", color: "#fff", fontWeight: 900 }}>Clarity sells.</span>
              </p>
              <div style={{ width: "2.5rem", height: "2px", background: "#6b9f78", marginBottom: "1.25rem" }} />
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.68)", marginBottom: "1.5rem" }}>
                I built{" "}
                <a href="https://plainspokenblueprint.com" target="_blank" rel="noopener noreferrer" style={{ color: "#6b9f78", textDecoration: "underline" }}>Gather Studio</a>{" "}
                for small business owners who do good work but struggle to explain it clearly. One 90-minute session. One page: who your customer is, how you help them, exactly how to say it. That page becomes your homepage, your elevator pitch. I also build websites.
              </p>
              <a
                href="https://plainspokenblueprint.com/audit"
                target="_blank"
                rel="noopener noreferrer"
                className="pb-audit-btn"
              >
                Score your message free →
              </a>
            </div>
          </div>

          <h2 id="jsu-opera">JSU Opera</h2>

          <p>
            Before the flower farm, before the software, there was opera. I sang
            at Jacksonville State for several years under Nathan Wight.
            We did full productions in the Ernest Stone Performing Arts Center —
            <em> Pirates of Penzance</em>, <em>Hansel and Gretel</em>,
            <em> The Mercato</em>. Real costumes, real pit orchestra, real
            opening nights.
          </p>

          <p>
            I was a baritone. I also sang with the choir and show band at Gadsden State on a full scholarship. I auditioned for Sweeney Todd this month and turned down the role of Judge Turpin. Some things you say no to on purpose.
          </p>

          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <figure>
              <Image
                src="/images/about/jsu-opera-pirates.webp"
                alt="Jacksonville Opera Theatre — The Pirates of Penzance (2007), Ernest Stone Performing Arts Center and Pell City Center"
                width={960}
                height={1280}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: 360, objectFit: "cover", objectPosition: "top" }}
              />
              <figcaption className="text-xs text-ll-text-light mt-2 text-center">
                <em>The Pirates of Penzance</em> · Jacksonville Opera Theatre · 2007
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/images/about/jsu-opera-hansel.webp"
                alt="Jacksonville Opera Theatre — Hansel and Gretel, JSU Dept. of Music 2007, cast-signed poster"
                width={960}
                height={1280}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: 360, objectFit: "cover", objectPosition: "top" }}
              />
              <figcaption className="text-xs text-ll-text-light mt-2 text-center">
                <em>Hansel and Gretel</em> · JSU Dept. of Music · 2007 · signed by the cast
              </figcaption>
            </figure>
          </div>

          <h2>Know Someone Worth Writing About?</h2>

          <p>
            If you know a person or a place whose story deserves to be told, I&apos;d like to hear about it.
          </p>

          <p>
            Reach out at{" "}
            <a href="mailto:matt@gatherstudio.app">matt@gatherstudio.app</a>.
          </p>

          <hr className="my-10 border-ll-dark/10" />

          <h2>The Podcast</h2>

          <p>
            Some of these profiles are also available as audio essays. Listen anywhere you get podcasts.
          </p>

          <div className="not-prose flex flex-wrap gap-3 my-6">
            {PODCAST_PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ll-border text-sm font-medium text-ll-text hover:text-ll-dark hover:border-ll-dark transition-colors"
              >
                {p.name}
              </a>
            ))}
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ll-border text-sm font-medium text-ll-text hover:text-ll-dark hover:border-ll-dark transition-colors"
            >
              All episodes →
            </Link>
          </div>

          <div className="not-prose flex flex-col sm:flex-row gap-4 my-10">
            <Link
              href="/support"
              className="btn-support inline-block px-7 py-3 bg-ll-primary font-bold text-sm rounded-md hover:bg-ll-primary-dark transition-colors text-center"
            >
              Support this work →
            </Link>
            <Link
              href="/essays"
              className="btn-journal inline-block px-5 py-2 border-2 border-ll-accent font-bold text-sm rounded-md hover:bg-ll-accent transition-colors text-center"
            >
              Matt also writes about his own story →
            </Link>
          </div>

          <hr className="my-10 border-ll-dark/10" />

          <div className="not-prose text-center my-10">
            <p
              className="text-xs uppercase tracking-widest text-ll-dark mb-1"
              style={{ opacity: 0.32, letterSpacing: "0.22em" }}
            >
              Walt Whitman
            </p>
            <p
              className="text-3xl text-ll-dark leading-snug mb-4"
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 300 }}
            >
              I contain<br />multitudes.
            </p>
            <div className="flex gap-6 justify-center flex-wrap mb-5">
              <Link href="/buy/clt-shirt" className="text-center">
                <Image
                  src="/merch/fw/chief-ladiga-trail-01.webp"
                  alt="Chief Ladiga Trail tee"
                  width={160}
                  height={160}
                  className="mx-auto rounded mb-1"
                  unoptimized
                  loading="eager"
                />
                <span className="text-xs text-ll-text-light">Chief Ladiga Trail</span>
              </Link>
              <Link href="/buy/model-city-shirt" className="text-center">
                <Image
                  src="/merch/fw/model-city-dark-01.webp"
                  alt="The Model City tee"
                  width={160}
                  height={160}
                  className="mx-auto rounded mb-1"
                  unoptimized
                  loading="eager"
                />
                <span className="text-xs text-ll-text-light">The Model City</span>
              </Link>
            </div>
            <Link
              href="/merch"
              className="inline-block text-sm font-medium text-ll-primary border border-ll-primary px-5 py-2.5 hover:bg-ll-primary hover:text-white transition-colors"
            >
              The store →
            </Link>
          </div>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Southern Legends is built and maintained by{" "}
            <a
              href="https://matthewheadley.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Matt Headley
            </a>
            {" "}·{" "}
            <a
              href="https://plainspokenblueprint.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gather Studio
            </a>
            .
          </p>
        </div>
      </section>

      <SubscribeCTA variant="section" />
    </main>
  );
}
