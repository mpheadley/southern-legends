export const revalidate = 300

import { getAllProfiles, getFeaturedProfiles } from "@/lib/profiles";
import { getJournalPostBySlug } from "@/lib/journal";
import ProfileCardHero from "./components/ProfileCardHero";
import FeaturedTilt from "./components/FeaturedTilt";
import HeroCarousel from "./components/HeroCarousel";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import Image from "next/image";
import SubscribeCTA from "./components/SubscribeCTA";

export default function HomePage() {
  const allProfiles = getAllProfiles();
  const featuredProfiles = getFeaturedProfiles();
  const featuredJournal = getJournalPostBySlug("no-shade");
  const gridProfiles = [
    ...allProfiles.filter((p) => !p.frontmatter.featured),
    ...allProfiles.filter((p) => p.frontmatter.featured),
  ];

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

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <h1 className="sr-only">Southern Legends — Stories from Northeast Alabama</h1>

      {/* ─── Featured Stories: 3D tilt on desktop, carousel on mobile ─── */}
      <div className="hidden sm:block">
        <FeaturedTilt cards={featuredCards} />
      </div>
      <section className="sm:hidden relative overflow-hidden" style={{ backgroundColor: "#292524" }}>
        <HeroCarousel profiles={featuredProfiles} />
      </section>

      {/* ─── Stories Grid ─── */}
      <section className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
        <div aria-hidden="true" className="grid-topo" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                More Stories
              </h2>
              <p className="mt-2 text-white/60">
                Meet the people behind the businesses, shops, and traditions that
                make this region what it is.
              </p>
            </div>
            {allProfiles.length > 3 && (
              <Link
                href="/profiles"
                className="hidden sm:inline-flex text-sm font-semibold text-ll-accent hover:opacity-80 transition-opacity"
              >
                View all &rarr;
              </Link>
            )}
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

      {/* ─── Journal Teaser ─── */}
      {featuredJournal && (
        <section className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
          <div aria-hidden="true" className="grid-topo" />
          <div className="mx-auto max-w-3xl px-6 py-10 md:py-12" style={{ position: "relative", zIndex: 1 }}>

            {/* Horizontal strip glass card */}
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
              {/* Left — journal photo */}
              {featuredJournal.frontmatter.cardImage && (
                <Link
                  href={`/essays/${featuredJournal.slug}`}
                  className="group relative shrink-0 self-stretch overflow-hidden"
                  style={{ width: "9rem" }}
                >
                  <Image
                    src={featuredJournal.frontmatter.cardImage}
                    alt={featuredJournal.frontmatter.cardImageAlt || featuredJournal.frontmatter.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: "center 25%" }}
                    sizes="144px"
                  />
                </Link>
              )}

              {/* Middle — text */}
              <Link href={`/essays/${featuredJournal.slug}`} className="flex-1 min-w-0 px-5 py-4 hover:opacity-80 transition-opacity">
                <p
                  className="text-sm uppercase tracking-widest mb-1"
                  style={{ color: "rgba(250,220,150,0.9)", fontFamily: "var(--font-heading)", fontWeight: 600 }}
                >
                  From the Journal
                </p>
                <h2
                  className="text-lg md:text-xl leading-snug mb-1"
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontStyle: "italic", color: "#FAFAF7" }}
                >
                  {featuredJournal.frontmatter.title}
                </h2>
                <p
                  className="text-xs md:text-sm line-clamp-2"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(250,250,247,0.65)", lineHeight: 1.55 }}
                >
                  {featuredJournal.frontmatter.excerpt}
                </p>
              </Link>

            </div>

          </div>
        </section>
      )}

      {/* ─── Merch / Support section (split from journal teaser) ─── */}
      {featuredJournal && featuredJournal.frontmatter.merchImage && featuredJournal.frontmatter.merchUrl && (
        <section className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
          <div aria-hidden="true" className="grid-topo" />
          <div className="mx-auto max-w-3xl px-6 py-8 md:py-10" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,220,150,0.8)", marginBottom: "0.75rem" }}>
              Support This Work
            </p>
            <a
              href={featuredJournal.frontmatter.merchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                border: "1px solid rgba(250,250,247,0.25)",
                color: "#FAFAF7",
                padding: "0.75rem 1.5rem",
                fontSize: "var(--text-label)",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              Get the shirt &rarr;
            </a>
          </div>
        </section>
      )}

      {/* Vol. 1 Magazine Band */}
      <section style={{ background: "#1C1917", position: "relative", overflow: "hidden" }}>
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
            padding: "3.5rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "var(--text-label)",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#CA8A04",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-body)",
              }}
            >
              Now Available · Vol. 1
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: 300,
                color: "#FAFAF7",
                lineHeight: 1.05,
                marginBottom: "0.75rem",
              }}
            >
              Southern Legends<br />in print.
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(250,250,247,0.55)",
                lineHeight: 1.75,
                marginBottom: "0",
                fontFamily: "var(--font-body)",
              }}
            >
              Five profiles. 200 copies. $15.<br />
              10% benefits UWECA Imagination Library — doubled by Alabama.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <Link
              href="/vol-1"
              style={{
                display: "inline-block",
                background: "#9A3412",
                color: "#FAFAF7",
                padding: "0.85rem 1.75rem",
                fontSize: "var(--text-label)",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                textAlign: "center",
              }}
            >
              Reserve your copy — $15
            </Link>
            <p
              style={{
                fontSize: "var(--text-label)",
                color: "rgba(250,250,247,0.3)",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              Available Oct 18 at The Aisle: Anniston Bridal Show · select local spots
            </p>
          </div>
        </div>
      </section>

      {/* The Book */}
      <section
        style={{
          background: "#110b08",
          position: "relative",
          overflow: "hidden",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/topo-7.png')",
            backgroundSize: "cover",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "38rem",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#CA8A04",
              marginBottom: "0.75rem",
            }}
          >
            The Collected Book
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              fontWeight: 300,
              color: "#FAFAF7",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            Southern Legends:<br />the profiles, the places, the history.
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(250,250,247,0.55)",
              lineHeight: 1.75,
              marginBottom: "1.75rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Every profile is a chapter. Every essay is a source. When there are enough of them, we&rsquo;re compiling them into the book Northeast Alabama has never had.
            The mythology is what the chamber prints. This is the reality.
          </p>
          <Link
            href="/essays"
            style={{
              display: "inline-block",
              border: "1px solid rgba(250,250,247,0.3)",
              color: "#FAFAF7",
              padding: "0.85rem 1.75rem",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            Read the essays →
          </Link>
        </div>
      </section>

      {/* Business owner bridge */}
      <div style={{ borderTop: "1px solid rgba(154,108,47,0.12)", padding: "1.5rem 0", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#6b5040" }}>
          Business in Alabama?{" "}
          <Link href="/places" style={{ color: "#9a6c2f", fontWeight: 600, textDecoration: "none" }}>
            Find your listing →
          </Link>
        </p>
      </div>

      {/* ─── Guide Band ─── */}
      <section style={{ padding: "4rem 2rem", background: "rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <img src="/images/matt-headshot-studio-canonical-192.webp" alt="Matt Headley — Southern Legends" width={96} height={96}
               style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              I write these stories so they&rsquo;re not lost.
            </h2>
            <p style={{ opacity: 0.65, lineHeight: 1.7, marginBottom: "1rem" }}>
              Matt Headley, founder. Northeast Alabama history and culture — told by someone who lives here.
            </p>
            <a href="mailto:matt@gatherstudio.app" style={{ fontWeight: 600, color: "var(--primary, #c9a96e)", textDecoration: "none" }}>
              Get in touch →
            </a>
          </div>
        </div>
      </section>

      <SubscribeCTA variant="section" source="homepage" />
    </main>
  );
}
