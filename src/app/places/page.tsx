import type { Metadata } from "next"
import Link from "next/link"
import { getFeatured, SL_PLACES, cityToSlug, bizToSlug } from "@/lib/places"
import { CITIES, cityToSlug as dbCityToSlug } from "@/lib/city-businesses"
import { ANCHOR_CITIES, regionCities } from "@/lib/region"
import { getAllListicles } from "@/lib/listicles"
import { siteConfig } from "@/lib/site-config"
import SectionLinks from "@/app/components/SectionLinks"
import ShareRow from "@/app/components/ShareRow"

export const metadata: Metadata = {
  title: "SL Places — Southern Legends",
  description: "Businesses with a story behind them. A curated directory of local businesses in Northeast Alabama, vouched for by Southern Legends.",
  alternates: { canonical: "/places" },
  openGraph: { url: "/places" },
}

const CATEGORY_COLORS: Record<string, string> = {
  "Florist": "#d97706",
  "Music Studio": "#7c3aed",
  "Theater": "#be185d",
  "Restaurant": "#b45309",
  "Retail": "#0369a1",
  "Contractor": "#15803d",
}

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#6b7280"
}

export default function PlacesPage() {
  const featured = getFeatured()
  const all = SL_PLACES
  const guides = getAllListicles().slice(0, 8)

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SL Places",
    description: "Curated local businesses featured in Southern Legends",
    url: `${siteConfig.url}/places`,
    numberOfItems: all.length,
  }

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Header */}
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-10 md:pt-36">
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#9a6c2f",
          marginBottom: "1rem",
        }}>
          Southern Legends
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2.5rem, 7vw, 4rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "#1a1208",
          marginBottom: "1rem",
        }}>
          Places
        </h1>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.125rem",
          color: "#4a3728",
          maxWidth: "42rem",
          lineHeight: 1.65,
          marginBottom: "2.5rem",
        }}>
          Not every business pays to be here. These are the ones someone wrote about, vouched for, or built something worth knowing. If you know one that belongs, nominate them.
        </p>
        <Link
          href="/places/nominate"
          style={{
            display: "inline-block",
            background: "#9a6c2f",
            color: "#F0EDE6",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            padding: "0.625rem 1.25rem",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Nominate a business
        </Link>
      </div>

      {/* Featured grid */}
      <div className="mx-auto max-w-4xl px-6 pb-20">
        {featured.length > 0 && (
          <>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9a6c2f",
              marginBottom: "1.25rem",
            }}>
              Featured
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "3rem",
            }}>
              {featured.map(biz => (
                <Link
                  key={biz.id}
                  href={`/places/${cityToSlug(biz.city)}/${biz.slug || bizToSlug(biz.name)}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    border: "1px solid rgba(154,108,47,0.15)",
                    transition: "box-shadow 0.15s",
                    height: "100%",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <span style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: categoryColor(biz.category),
                        fontFamily: "var(--font-body)",
                      }}>
                        {biz.category}
                      </span>
                      {biz.story && (
                        <span style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#F0EDE6",
                          background: "#9a6c2f",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "3px",
                          fontFamily: "var(--font-body)",
                        }}>
                          SL Story
                        </span>
                      )}
                    </div>
                    <h2 style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      fontWeight: 400,
                      color: "#1a1208",
                      marginBottom: "0.5rem",
                      lineHeight: 1.2,
                    }}>
                      {biz.name}
                    </h2>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "#6b5040",
                      lineHeight: 1.5,
                      marginBottom: "0.75rem",
                    }}>
                      {biz.curatedNote ?? biz.description}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "#9a6c2f",
                      fontWeight: 600,
                    }}>
                      {biz.city}, {biz.state}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Anchor cities — where SL has real stories */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9a6c2f",
            marginBottom: "1.25rem",
          }}>
            Where we spend our time
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}>
            {ANCHOR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/places/${dbCityToSlug(city)}`}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: "#1a1208",
                  textDecoration: "none",
                  padding: "1rem 1.25rem",
                  background: "#fff",
                  border: "1px solid rgba(154,108,47,0.15)",
                  borderRadius: "6px",
                  display: "block",
                }}
              >
                {city}
                <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#9a6c2f", fontWeight: 600, marginTop: "0.25rem" }}>
                  Northeast Alabama
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Rest of the region — Northeast Alabama */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9a6c2f",
            marginBottom: "1.25rem",
          }}>
            More across Northeast Alabama
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "0.375rem",
          }}>
            {regionCities(CITIES).map((city) => (
              <Link
                key={city}
                href={`/places/${dbCityToSlug(city)}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "#4a3728",
                  textDecoration: "none",
                  padding: "0.35rem 0",
                  borderBottom: "1px solid rgba(154,108,47,0.08)",
                  display: "block",
                  transition: "color 0.1s",
                }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Local Guides — data-driven listicles */}
        {guides.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600,
                letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a6c2f",
              }}>
                Local Guides
              </p>
              <Link href="/listicles" style={{
                fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600,
                color: "#9a6c2f", textDecoration: "none",
              }}>
                See all →
              </Link>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem",
            }}>
              {guides.map((g) => (
                <Link key={g.slug} href={`/listicles/${g.slug}`} style={{
                  display: "block", background: "#fff", border: "1px solid rgba(154,108,47,0.15)",
                  borderRadius: "6px", padding: "0.9rem 1.1rem", textDecoration: "none",
                  fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "#1a1208", lineHeight: 1.25,
                }}>
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nominate CTA */}
        <div style={{
          background: "#1a1208",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            color: "#F0EDE6",
            marginBottom: "0.75rem",
            fontWeight: 400,
          }}>
            Know a business that belongs here?
          </p>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "rgba(240,237,230,0.7)",
            marginBottom: "1.5rem",
          }}>
            These listings grow as SL grows. Nominate someone worth knowing.
          </p>
          <Link
            href="/places/nominate"
            style={{
              display: "inline-block",
              background: "#9a6c2f",
              color: "#F0EDE6",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Nominate a business
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <ShareRow
          url="/places"
          title="SL Places — Southern Legends"
          description="Businesses with a story behind them. A curated directory of local businesses in Northeast Alabama."
        />
        <SectionLinks current="/places" />
      </div>
    </main>
  )
}
