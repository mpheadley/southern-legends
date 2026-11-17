export const revalidate = 300

import { VOL1_ON_SALE } from "@/lib/vol1";
import { getAllProfiles, getFeaturedProfiles } from "@/lib/profiles";
import { getJournalPostBySlug } from "@/lib/journal";
import ProfileCardHero from "./components/ProfileCardHero";
import FeaturedTilt from "./components/FeaturedTilt";
import HeroCarousel from "./components/HeroCarousel";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import Image from "next/image";
import SubscribeCTA from "./components/SubscribeCTA";
import FaithTeaser from "./components/FaithTeaser";
import { Editable } from "@headley/gathersites/client";

/**
 * Vol. 1 (the print issue) is the one support ask on the home page while it is
 * on sale. Flip this to false when the 200 copies are gone and the band becomes
 * the $5 reader-support ask (redesign B-07).
 */

export default function HomePage() {
  const allProfiles = getAllProfiles();
  const featuredProfiles = getFeaturedProfiles();
  const featuredJournal = getJournalPostBySlug("no-shade");
  const featuredSlugs = new Set(featuredProfiles.map((p) => p.slug));
  // Six cards. Non-featured first so the grid is not a repeat of the hero.
  const gridProfiles = [
    ...allProfiles.filter((p) => !featuredSlugs.has(p.slug)),
    ...allProfiles.filter((p) => featuredSlugs.has(p.slug)),
  ].slice(0, 6);

  const featuredCards = featuredProfiles.map((p) => ({
    slug: p.slug,
    name: p.frontmatter.name,
    title: p.frontmatter.title,
    titleHtml: p.frontmatter.titleHtml,
    cardTitle: p.frontmatter.cardTitle,
    cardTitleHtml: p.frontmatter.cardTitleHtml,
    cardFont: p.frontmatter.cardFont,
    cardTitleColor: p.frontmatter.cardTitleColor,
    cardFontSize: p.frontmatter.cardFontSize,
    subtitle: p.frontmatter.subtitle,
    excerpt: p.frontmatter.excerpt,
    location: p.frontmatter.location,
    category: p.frontmatter.category,
    heroImage: p.frontmatter.heroImage,
    heroAlt: p.frontmatter.heroAlt,
    heroPosition: p.frontmatter.heroPosition,
  }));

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: "https://plainspokenblueprint.com",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.webp`,
      },
      sameAs: ["https://www.facebook.com/SouthernLegendsAL"],
    },
  };

  const LABEL: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#CA8A04",
    marginBottom: "0.75rem",
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <h1 className="sr-only">Southern Legends — Stories from Northeast Alabama</h1>

      {/* 1 · Featured Stories: 3D tilt on desktop, carousel on mobile */}
      <div className="hidden sm:block">
        <FeaturedTilt cards={featuredCards} />
      </div>
      <section className="sm:hidden relative overflow-hidden" style={{ backgroundColor: "#292524" }}>
        <HeroCarousel profiles={featuredProfiles} />
      </section>

      {/* 2 · More Stories: six cards, one link */}
      <section id="more-stories" className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
        <div aria-hidden="true" className="grid-topo" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <Editable
                path="home.more.headline"
                as="h2"
                className="text-3xl md:text-5xl font-normal text-white tracking-tight"
                style={{ fontFamily: "var(--font-heading)", fontVariationSettings: '"opsz" 60' }}
              >
                More Stories
              </Editable>
              <Editable path="home.more.sub" as="p" className="mt-3 text-white/65 max-w-md">
                The people behind the shops, farms, and traditions that make this region what it is.
              </Editable>
            </div>
            <Link
              href="/profiles"
              className="shrink-0 text-sm font-semibold text-ll-accent hover:opacity-80 transition-opacity"
            >
              View all {allProfiles.length} &rarr;
            </Link>
          </div>

          {gridProfiles.length === 0 ? (
            <p className="text-white/60">More stories coming soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gridProfiles.map((profile, i) => (
                <div
                  key={profile.slug}
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <ProfileCardHero profile={profile} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3 · Essays + faith column teasers, side by side */}
      {featuredJournal && (
        <section className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
          <div aria-hidden="true" className="grid-topo" />
          <div className="mx-auto max-w-5xl px-6 py-10 md:py-14" style={{ position: "relative", zIndex: 1 }}>
            <div className="grid gap-6 md:grid-cols-2">
              <div
                className="rounded-xl flex items-center gap-0 overflow-hidden"
                style={{
                  background: "rgba(250,250,247,0.12)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(250,250,247,0.2)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                }}
              >
                {featuredJournal.frontmatter.cardImage && (
                  <Link
                    href={`/essays/${featuredJournal.slug}`}
                    className="group relative shrink-0 self-stretch overflow-hidden"
                    style={{ width: "9rem" }}
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <Image
                      src={featuredJournal.frontmatter.cardImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{ objectPosition: "center 25%" }}
                      sizes="144px"
                    />
                  </Link>
                )}
                <Link href={`/essays/${featuredJournal.slug}`} className="flex-1 min-w-0 px-5 py-4 hover:opacity-80 transition-opacity">
                  <p
                    className="text-sm uppercase tracking-widest mb-1"
                    style={{ color: "rgba(250,220,150,0.9)", fontFamily: "var(--font-heading)", fontWeight: 600 }}
                  >
                    From the essays
                  </p>
                  <h2
                    className="text-lg md:text-xl leading-snug mb-1"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontStyle: "italic", color: "#FAFAF7" }}
                  >
                    {featuredJournal.frontmatter.title}
                  </h2>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(250,250,247,0.65)", lineHeight: 1.55 }}
                  >
                    {featuredJournal.frontmatter.excerpt}
                  </p>
                </Link>
              </div>
              <FaithTeaser />
            </div>
          </div>
        </section>
      )}

      {/* 4 · ONE support band: Vol. 1 while it is on sale, then the $5 ask */}
      <section id="support-band" style={{ background: "#1C1917", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/topo-7.png')",
            backgroundSize: "cover",
            opacity: 0.15,
            mixBlendMode: "soft-light",
          }}
        />
        <div
          className="mx-auto max-w-4xl px-6"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "4rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {VOL1_ON_SALE ? (
            <>
              <div>
                <Editable path="home.support.sale.label" as="p" style={LABEL}>
                  Now available · Vol. 1
                </Editable>
                <Editable
                  path="home.support.sale.headline"
                  as="h2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                    fontWeight: 300,
                    color: "#FAFAF7",
                    lineHeight: 1.05,
                    marginBottom: "0.75rem",
                  }}
                >
                  Southern Legends<br />in print.
                </Editable>
                <Editable
                  path="home.support.sale.body"
                  as="p"
                  style={{ fontSize: "0.9375rem", color: "rgba(250,250,247,0.6)", lineHeight: 1.7, margin: 0, fontFamily: "var(--font-body)" }}
                >
                  Five profiles. 200 copies. $15.<br />
                  10% supports early childhood literacy through UWECA&rsquo;s Imagination Library.
                </Editable>
              </div>
              <div>
                <Link
                  href="/vol-1"
                  style={{
                    display: "block",
                    background: "#9A3412",
                    color: "#FAFAF7",
                    padding: "0.95rem 1.75rem",
                    fontSize: "var(--text-label)",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    textAlign: "center",
                  }}
                >
                  <Editable path="home.support.sale.cta" as="span">Reserve your copy — $15</Editable>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <Editable path="home.support.ask.label" as="p" style={LABEL}>
                  Reader-supported
                </Editable>
                <Editable
                  path="home.support.ask.headline"
                  as="h2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                    fontWeight: 300,
                    color: "#FAFAF7",
                    lineHeight: 1.05,
                    marginBottom: "0.75rem",
                  }}
                >
                  No paywall.<br />No sponsors picking the stories.
                </Editable>
                <Editable
                  path="home.support.ask.body"
                  as="p"
                  style={{ fontSize: "0.9375rem", color: "rgba(250,250,247,0.6)", lineHeight: 1.7, margin: 0, fontFamily: "var(--font-body)" }}
                >
                  $5 a month keeps the stories free for everyone else.
                </Editable>
              </div>
              <div>
                <Link
                  href="/support"
                  style={{
                    display: "block",
                    background: "#9A3412",
                    color: "#FAFAF7",
                    padding: "0.95rem 1.75rem",
                    fontSize: "var(--text-label)",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    textAlign: "center",
                  }}
                >
                  <Editable path="home.support.ask.cta" as="span">Support this work — $5</Editable>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5 · Subscribe */}
      <SubscribeCTA variant="section" source="homepage" />
    </main>
  );
}
