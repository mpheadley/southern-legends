import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { getAllListicles, ANCHOR_GUIDE_CITIES } from "@/lib/listicles";
import { siteConfig } from "@/lib/site-config";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Local Guides — Southern Legends",
  description:
    "Data-driven guides to the best of local business — with the honest method behind every list. No pay-to-play.",
  alternates: { canonical: "/listicles" },
};

export default function ListiclesIndex() {
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
  const citySlug = (c: string) => "city-" + c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Local Guides",
    url: `${siteConfig.url}/listicles`,
    description: "Data-driven local business guides with a transparent method.",
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
          fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 7vw, 4rem)", fontWeight: 400,
          lineHeight: 1.1, color: "var(--color-ll-dark)", marginBottom: "1rem",
        }}>
          Local Guides
        </h1>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "1.125rem", color: "var(--color-ll-text)",
          maxWidth: "42rem", lineHeight: 1.65, marginBottom: "2.5rem",
        }}>
          The best of local business — coffee, barbecue, barbers, boutiques — with the honest method behind
          every list. We start from real data, show our work, and never rank anyone who paid. If a spot is
          missing, tell us and we&apos;ll add it.
        </p>

        <nav aria-label="Jump to a city" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {cities.map((city) => (
            <a key={city} href={`#${citySlug(city)}`} style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600,
              color: "var(--color-ll-dark)", textDecoration: "none", padding: "0.35rem 0.8rem",
              border: "1px solid var(--color-ll-border)", borderRadius: "999px", background: "#fff",
            }}>
              {city} <span style={{ color: "var(--color-ll-text-light)", fontWeight: 400 }}>{byCity[city].length}</span>
            </a>
          ))}
        </nav>

        {cities.map((city) => (
          <div key={city} id={citySlug(city)} style={{ marginBottom: "3rem", scrollMarginTop: "6rem" }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "1rem",
            }}>
              {city}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}>
              {byCity[city].map((l) => (
                <Link key={l.slug} href={`/listicles/${l.slug}`} style={{
                  display: "flex", flexDirection: "column",
                  background: "#fff", border: "1px solid rgba(154,108,47,0.15)",
                  borderRadius: "10px", overflow: "hidden", textDecoration: "none",
                  transition: "box-shadow 0.15s",
                }}>
                  {/* Photo — only when the file exists; otherwise a text-only card (audit C-04) */}
                  {l.image && (
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "var(--color-ll-warm)", flexShrink: 0 }}>
                      <Image
                        src={l.image}
                        alt={l.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                    </div>
                  )}
                  {/* Text */}
                  <div style={{ padding: "0.9rem 1.1rem 1rem", flex: 1 }}>
                    <span style={{
                      fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-ll-dark)",
                      display: "block", lineHeight: 1.25, marginBottom: "0.35rem",
                    }}>
                      {l.title}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-ll-text)",
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <ShareRow url="/listicles" title="Local Guides — Southern Legends" description="Data-driven local business guides with a transparent method." />
        <SectionLinks current="/listicles" />
      </div>
    </main>
  );
}
