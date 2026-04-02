import { getAllProfiles } from "@/lib/profiles";
import ProfileCard from "./components/ProfileCard";
import HeroCarousel from "./components/HeroCarousel";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export default function HomePage() {
  const allProfiles = getAllProfiles();

  // Top 4 profiles cycle in the hero carousel; all profiles show as cards below
  const carouselProfiles = allProfiles.slice(0, 4);
  const gridProfiles = allProfiles;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: "https://headleyweb.com",
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

      {/* ─── Hero Carousel ─── */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent z-[1]" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-24 md:pb-16" style={{ zIndex: 3 }}>
          {carouselProfiles.length > 0 ? (
            <HeroCarousel profiles={carouselProfiles} />
          ) : (
            <div className="text-center py-12">
              <h1
                className="text-white font-bold tracking-tight hero-headline"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {siteConfig.name}
              </h1>
              <p
                className="mt-4 text-white/50 text-lg max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
              >
                {siteConfig.tagline}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Stories Grid ─── */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-ll-dark tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {"More Stories"}
              </h2>
              <p className="mt-2 text-ll-text-light">
                Meet the people behind the businesses, shops, and traditions that
                make this region what it is.
              </p>
            </div>
            {allProfiles.length > 3 && (
              <Link
                href="/profiles"
                className="hidden sm:inline-flex text-sm font-semibold text-ll-primary hover:text-ll-primary-dark transition-colors"
              >
                View all &rarr;
              </Link>
            )}
          </div>

          {gridProfiles.length === 0 ? (
            <p className="text-ll-text-light">
              More stories coming soon.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gridProfiles.map((profile, i) => (
                <div
                  key={profile.slug}
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
