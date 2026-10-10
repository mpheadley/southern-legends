import { MapPin } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SL_CITIES, SL_PLACES, getPlace, cityToSlug, isBridalCategory } from "@/lib/places"
import { localBusinesses, cityToSlug as dbCityToSlug } from "@/lib/city-businesses"
import { siteConfig } from "@/lib/site-config"

type Props = { params: Promise<{ city: string; slug: string }> }

export const dynamicParams = true  // unknown slugs rendered on-demand (Circle stubs)
export const revalidate = 86400

export async function generateStaticParams() {
  // Only pre-render curated SL places — Circle stubs are ISR on first request
  return SL_PLACES.map(b => ({
    city: cityToSlug(b.city),
    slug: b.slug,
  }))
}

function getCircleBiz(citySlug: string, slug: string) {
  return localBusinesses.find(
    b => dbCityToSlug(b.city) === citySlug && b.slug === slug
  ) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params
  const biz = getPlace(city, slug)
  const circle = biz ? null : getCircleBiz(city, slug)
  const name = biz?.name ?? circle?.name
  const desc = biz?.description ?? circle?.category ?? ""
  const cityName = biz?.city ?? circle?.city ?? city
  if (!name) return {}
  return {
    title: `${name} — Southern Legends`,
    description: desc,
    alternates: { canonical: `/places/${city}/${slug}` },
    openGraph: {
      title: `${name} | ${cityName}, AL`,
      description: desc,
      url: `/places/${city}/${slug}`,
    },
  }
}

export default async function PlaceDetailPage({ params }: Props) {
  const { city: citySlug, slug } = await params
  const biz = getPlace(citySlug, slug)
  const circle = biz ? null : getCircleBiz(citySlug, slug)
  if (!biz && !circle) notFound()

  // Render Circle stub when no curated content
  if (!biz && circle) {
    return (
      <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
        <div className="mx-auto max-w-2xl px-6 pt-28 pb-20 md:pt-36">
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "2rem" }}>
            <Link href="/places" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-ll-accent-dark)", textDecoration: "none", fontWeight: 600 }}>Places</Link>
            <span style={{ color: "var(--color-ll-accent-dark)" }}>›</span>
            <Link href={`/places/${citySlug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-ll-accent-dark)", textDecoration: "none", fontWeight: 600 }}>{circle.city}</Link>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.75rem" }}>
            {circle.category}
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, color: "var(--color-ll-dark)", fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            {circle.name}
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
            {circle.address && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-text)" }}>
                {circle.address}, {circle.city}, AL
              </p>
            )}
            {circle.phone && (
              <a href={`tel:${circle.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
                {circle.phone}
              </a>
            )}
            {circle.website && (
              <a href={circle.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
                {circle.website.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>
          <div style={{ background: "var(--color-ll-dark)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.5rem" }}>
              Is this your business?
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "#F0EDE6", fontWeight: 400, marginBottom: "1rem" }}>
              Add your hours, photos, and story.
            </p>
            <a
              href={`https://gatherstudio.app/api/wiki-claim?id=${circle.id}&name=${encodeURIComponent(circle.name)}`}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 700, background: "var(--color-ll-accent-dark)", color: "#F0EDE6", padding: "0.5rem 1.25rem", borderRadius: "4px", textDecoration: "none", display: "inline-block" }}
            >
              Claim this listing →
            </a>
          </div>
          <Link href={`/places/${citySlug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
            ← Back to {circle.city}
          </Link>
        </div>
      </main>
    )
  }

  if (!biz) notFound() // narrowing guard — logically unreachable

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    description: biz.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: biz.city,
      addressRegion: biz.state,
      addressCountry: "US",
    },
    ...(biz.phone && { telephone: biz.phone }),
    ...(biz.website && { url: biz.website }),
  }

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mx-auto max-w-2xl px-6 pt-28 pb-20 md:pt-36">

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "2rem" }}>
          <Link href="/places" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-ll-accent-dark)", textDecoration: "none", fontWeight: 600 }}>
            Places
          </Link>
          <span style={{ color: "var(--color-ll-accent-dark)" }}>›</span>
          <Link href={`/places/${citySlug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-ll-accent-dark)", textDecoration: "none", fontWeight: 600 }}>
            {biz.city}
          </Link>
        </div>

        {/* Category badge */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-label)",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-ll-accent-dark)",
          marginBottom: "0.75rem",
        }}>
          {biz.category}
        </p>

        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 400,
          color: "var(--color-ll-dark)",
          marginBottom: "1rem",
          lineHeight: 1.1,
        }}>
          {biz.name}
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.0625rem",
          color: "var(--color-ll-text)",
          lineHeight: 1.7,
          marginBottom: "2rem",
        }}>
          {biz.curatedNote ?? biz.description}
        </p>

        {/* SL story link */}
        {biz.story && (
          <div style={{
            background: "var(--color-ll-dark)",
            borderRadius: "6px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-meta)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-ll-accent-dark)",
              marginBottom: "0.5rem",
            }}>
              Southern Legends Story
            </p>
            <Link
              href={`/profiles/${biz.story}`}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                color: "#F0EDE6",
                textDecoration: "none",
              }}
            >
              Read the story →
            </Link>
          </div>
        )}

        {/* Contact */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "2.5rem",
        }}>
          {biz.address && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-text)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MapPin size={16} aria-hidden="true" /> {biz.address}
            </p>
          )}
          {biz.phone && (
            <a href={`tel:${biz.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
              {biz.phone}
            </a>
          )}
          {biz.website && (
            <a href={biz.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
              {biz.website.replace(/^https?:\/\//, '')} ↗
            </a>
          )}
        </div>

        {/* ReelStudio pitch */}
        <div style={{
          background: "var(--color-ll-dark)",
          borderRadius: "6px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.35rem" }}>
              ReelStudio
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9375rem", color: "#F0EDE6", fontWeight: 400 }}>
              Add a 30-second video to this listing. Free to record.
            </p>
          </div>
          <a
            href="https://gatherstudio.app/reelstudio/record"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 700, background: "var(--color-ll-accent-dark)", color: "#F0EDE6", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none", flexShrink: 0 }}
          >
            Record now →
          </a>
        </div>

        {/* BridalShowReviews — wedding/florist businesses only */}
        {isBridalCategory(biz.category) && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-text)", lineHeight: 1.6 }}>
              Planning a wedding in {biz.city}?{" "}
              <a
                href="https://bridalshowreviews.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "underline" }}
              >
                See every NE Alabama bridal show rated by couples who went →
              </a>
            </p>
          </div>
        )}

        {/* Nominate CTA */}
        <div style={{
          borderTop: "1px solid rgba(154,108,47,0.2)",
          paddingTop: "2rem",
        }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--color-ll-text)",
            marginBottom: "0.75rem",
          }}>
            Know a business in {biz.city} worth featuring?
          </p>
          <Link
            href="/places/nominate"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ll-accent-dark)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Nominate them →
          </Link>
        </div>
      </div>
    </main>
  )
}
