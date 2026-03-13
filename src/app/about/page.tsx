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
      <section className="relative bg-ll-dark text-white overflow-hidden topo-texture">
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-12 md:pt-36 md:pb-16">
          <h1
            className="text-3xl md:text-4xl font-bold animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About This Project
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose-profile">
          <p>
            The Appalachian foothills of Northeast Alabama are full of people
            doing remarkable work that most of the world will never hear about.
            Blacksmiths, bakers, musicians, mechanics, farmers, makers — people
            whose skill and dedication are woven into the daily life of their
            communities.
          </p>

          <p>
            <strong>Local Legends</strong> is a project dedicated to finding
            those people and telling their stories. Not quick blurbs or
            directory listings — real profiles, with real conversations, about
            what they do and why it matters.
          </p>

          <p>
            These aren&apos;t celebrities. They&apos;re the blacksmith who still
            fires up a coal forge every morning. The herbalist who knows every
            plant on the mountain. The guitar player who&apos;s been at every
            fish fry for forty years. The people your neighbors know but the
            wider world doesn&apos;t — yet.
          </p>

          <h2>Why Tell These Stories?</h2>

          <p>
            Because they matter. The knowledge, traditions, and ways of working
            that define these foothills are worth documenting — not in a museum
            case, but in the words and voices of the people themselves.
          </p>

          <p>
            Every community has its legends. Most of them never get written
            down. This project is an attempt to change that, one story at a
            time.
          </p>

          <h2>Who&apos;s Behind This?</h2>

          <div className="flex flex-col sm:flex-row items-start gap-6 not-prose my-6">
            <Image
              src="/images/about/headshot-matt-headley.webp"
              alt="Matt Headley"
              width={160}
              height={160}
              className="rounded-lg flex-shrink-0"
            />
            <div className="prose-profile">
              <p>
                My name is Matt Headley. I&apos;m a web designer based in
                Jacksonville, Alabama. I run{" "}
                <a
                  href="https://headleyweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Headley Web &amp; SEO
                </a>
                , where I build websites for local businesses.
              </p>
            </div>
          </div>

          <p>
            I started Local Legends because I kept meeting people whose stories
            were too good not to share. The more businesses I worked with, the
            more I realized that the best part wasn&apos;t the website — it was
            sitting down and hearing someone talk about the work they love.
          </p>

          <p>
            This project isn&apos;t a marketing funnel. It&apos;s not a lead
            generator (though I won&apos;t pretend it hurts). It exists because
            I genuinely believe the people in this region deserve to be
            celebrated — and because telling their stories is the most
            interesting work I do.
          </p>

          <h2>Know a Local Legend?</h2>

          <p>
            The best profiles come from recommendations. If you know someone in
            Northeast Alabama whose story deserves to be told — a maker, a
            business owner, a community figure, anyone doing work that matters
            — I&apos;d love to hear about them.
          </p>

          <p>
            Reach out at{" "}
            <a href="mailto:matt@headleyweb.com">matt@headleyweb.com</a>.
          </p>

          <hr className="my-10 border-ll-dark/10" />

          <p className="text-sm text-ll-text-light">
            Local Legends is built and maintained by{" "}
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
