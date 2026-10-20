import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { MapPin } from "lucide-react";
import { getAllListicles, ANCHOR_GUIDE_CITIES } from "@/lib/listicles";
import { siteConfig } from "@/lib/site-config";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Local Guides",
  description:
    "Guides to the best of local business in Northeast Alabama, with the honest method behind every list. No pay-to-play.",
  alternates: { canonical: "/listicles" },
};

const PAGE = 12;

type SearchParams = Promise<{ city?: string; all?: string }>;

export default async function ListiclesIndex({ searchParams }: { searchParams: SearchParams }) {
  const { city: cityParam, all: allParam } = await searchParams;
  const all = getAllListicles();
  const byCity = all.reduce<Record<string, typeof all>>((acc, l) => {
    const c = l.city || "Elsewhere";
    (acc[c] ||= []).push(l);
    return acc;
  }, {});
  // Home market first, then A–Z (audit QW-12)
  const cities = Object.keys(byCity).sort((a, b) => {
    const ai = ANCHOR_GUIDE_CITIES.indexOf(a), bi = ANCHOR_GUIDE_CITIES.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.localeCompare(b);
  });
  // City picker (redesign B-05): Anniston first; ≤12 cards unless the reader asks for all.
  const selected = cityParam && byCity[cityParam] ? cityParam : cities[0];
  const guides = byCity[selected] ?? [];
  const showAll = allParam === "1";
  const shown = showAll ? guides : guides.slice(0, PAGE);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Local Guides",
    url: `${siteConfig.url}/listicles`,
    description: "Local business guides with a transparent method.",
  };

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-16 md:pt-36">
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600,
          letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "1rem",
        }}>
          Southern Legends
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 400,
          lineHeight: 1.0, color: "var(--color-ll-dark)", marginBottom: "1rem", fontVariationSettings: '"opsz" 72',
        }}>
          Local Guides
        </h1>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "1.125rem", color: "var(--color-ll-text)",
          maxWidth: "40rem", lineHeight: 1.65, marginBottom: "2rem",
        }}>
          Coffee, barbecue, barbers, boutiques. I start from real data, show my work, and never rank anyone who paid. Pick a town.
        </p>

        {/* City picker */}
        <nav aria-label="Pick a city" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {cities.map((city) => {
            const active = city === selected;
            return (
              <Link
                key={city}
                href={active ? "/listicles" : `/listicles?city=${encodeURIComponent(city)}`}
                aria-current={active ? "page" : undefined}
                style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600,
                  color: active ? "#F0EDE6" : "var(--color-ll-dark)", textDecoration: "none", padding: "0.4rem 0.85rem",
                  border: "1px solid var(--color-ll-border)", borderRadius: "999px",
                  background: active ? "var(--color-ll-dark)" : "#fff",
                }}
              >
                {city} <span style={{ color: active ? "rgba(240,237,230,0.6)" : "var(--color-ll-text-light)", fontWeight: 400 }}>{byCity[city].length}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "1rem" }}>
          <MapPin size={14} aria-hidden="true" style={{ color: "var(--color-ll-accent-dark)" }} />
          <h2 style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", margin: 0,
          }}>
            {selected} · {guides.length} {guides.length === 1 ? "guide" : "guides"}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {shown.map((l) => (
            <Link key={l.slug} href={`/listicles/${l.slug}`} style={{
              display: "flex", flexDirection: "column",
              background: "#fff", border: "1px solid rgba(154,108,47,0.15)",
              borderRadius: "10px", textDecoration: "none", padding: "1rem 1.15rem 1.1rem",
            }}>
              <span style={{
                fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--color-ll-dark)",
                display: "block", lineHeight: 1.2, marginBottom: "0.4rem",
              }}>
                {l.title}
              </span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-text)",
                lineHeight: 1.5, display: "block",
              }}>
                {l.excerpt}
              </span>
              {l.businesses && l.businesses.length > 0 && (
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "var(--color-ll-accent-dark)",
                  fontWeight: 600, letterSpacing: "0.08em", marginTop: "0.6rem", display: "block",
                }}>
                  {l.businesses.length} places →
                </span>
              )}
            </Link>
          ))}
        </div>
        {!showAll && guides.length > PAGE && (
          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href={`/listicles?city=${encodeURIComponent(selected)}&all=1`}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "var(--color-ll-accent-dark)", textDecoration: "underline" }}
            >
              Show all {guides.length} {selected} guides →
            </Link>
          </p>
        )}
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <ShareRow url="/listicles" title="Local Guides — Southern Legends" description="Local business guides with a transparent method." />
        <SectionLinks current="/listicles" />
      </div>
    </main>
  );
}
