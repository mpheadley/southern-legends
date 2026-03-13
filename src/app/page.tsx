import { getAllProfiles } from "@/lib/profiles";
import ProfileCard from "./components/ProfileCard";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  const profiles = getAllProfiles();

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
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-ll-dark text-white overflow-hidden topo-texture">
        <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-20 md:pt-40 md:pb-28 text-center"
          style={{ zIndex: 2 }}
        >
          <p
            className="text-ll-accent text-base tracking-wide mb-6 animate-on-scroll"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Appalachian Foothills
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {siteConfig.name}
          </h1>
          <div className="mx-auto mt-8 mb-8 w-16 h-[3px] bg-ll-accent rounded animate-on-scroll" aria-hidden="true" />
          <p
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
          >
            {siteConfig.tagline}
          </p>
          <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl mx-auto animate-on-scroll">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Latest Profiles */}
      <section className="bg-ll-light">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <h2
            className="text-2xl md:text-3xl font-bold text-ll-dark mb-3 animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Latest Stories
          </h2>
          <p className="text-ll-text-light mb-10 animate-on-scroll">
            Meet the people behind the businesses, shops, and traditions that
            make this region what it is.
          </p>

          {profiles.length === 0 ? (
            <p className="text-ll-text-light">
              No stories yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, i) => (
                <div
                  key={profile.slug}
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-ll-warm">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
          <p
            className="text-ll-accent text-sm mb-3 animate-on-scroll"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            every town has a story
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-ll-dark mb-6 animate-on-scroll"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Local Legends?
          </h2>
          <p className="text-ll-text leading-relaxed mb-6 animate-on-scroll">
            In the Appalachian foothills of Northeast Alabama, people are doing
            extraordinary work that the wider world doesn&apos;t know about. The
            blacksmith who still fires up a coal forge every morning. The baker
            who learned her grandmother&apos;s recipes by feel. The mechanic who
            keeps thirty-year-old trucks on the road because that&apos;s what his
            neighbors need.
          </p>
          <p className="text-ll-text leading-relaxed mb-8 animate-on-scroll">
            Local Legends tells their stories — not to sell anything, but because
            these people and their work deserve to be seen.
          </p>
          <a
            href="/about"
            className="inline-block px-6 py-3 bg-ll-primary text-white font-semibold rounded-lg hover:bg-ll-primary-dark transition-colors animate-on-scroll"
          >
            Read the Full Story
          </a>
        </div>
      </section>
    </main>
  );
}
