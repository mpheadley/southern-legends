import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Flower2, Flower, Music, Megaphone, Printer, Building2, Camera, Heart, Star, Utensils, ShoppingBag, Scissors, Dumbbell, GraduationCap, Wrench, Truck } from "lucide-react"
import type { ElementType } from "react"
import { readFileSync } from "fs"
import { join } from "path"
import { CITIES, localBusinesses, cityToSlug as dbCityToSlug } from "@/lib/city-businesses"
import { SL_PLACES, cityToSlug as slCityToSlug } from "@/lib/places"
import { getFeaturedForCity, TAG_LABELS, TAG_COLORS } from "@/lib/featured-businesses"
import { getCityMeta } from "@/lib/city-meta"
import CityNewsletterSignup from "@/app/components/CityNewsletterSignup"
import SectionLinks from "@/app/components/SectionLinks"
import ShareRow from "@/app/components/ShareRow"
import SpotifyEmbed from "@/app/components/SpotifyEmbed"
import CityThemePlayer from "@/app/components/CityThemePlayer"
import { getPlaylistId } from "@/lib/spotify-config"
import PlaylistEmbed from "@/app/components/PlaylistEmbed"
import { getPlaylist } from "@/lib/playlists"
import UpcomingEvents from "@/app/components/UpcomingEvents"

const CALHOUN_EVENT_TOWNS = ["Anniston", "Oxford", "Jacksonville", "Piedmont", "Weaver", "Ohatchee", "Alexandria", "Glencoe"]

export const revalidate = 86400 // revalidate daily

type Props = { params: Promise<{ city: string }> }

type NewsStory = {
  title: string
  url: string
  source: string
  excerpt?: string
  priority?: string
}

function getNewsForCity(cityName: string): NewsStory[] {
  try {
    const p = join(process.cwd(), "../../.instar/news/news-briefing.json")
    const data = JSON.parse(readFileSync(p, "utf8"))
    const stories: NewsStory[] = data.stories ?? []
    const lo = cityName.toLowerCase()
    const local = stories.filter(
      (s) => s.title?.toLowerCase().includes(lo) || s.excerpt?.toLowerCase().includes(lo)
    )
    return local.length > 0 ? local.slice(0, 5) : stories.slice(0, 3)
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: dbCityToSlug(city) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params
  const cityName = CITIES.find((c) => dbCityToSlug(c) === citySlug)
  if (!cityName) return {}
  return {
    title: `${cityName}, Alabama — Southern Legends`,
    description: `Local businesses, stories, and community in ${cityName}, Alabama. Curated by Southern Legends.`,
    alternates: { canonical: `/places/${citySlug}` },
    openGraph: {
      title: `${cityName}, Alabama — Southern Legends`,
      description: `The people, places, and stories of ${cityName}.`,
      url: `/places/${citySlug}`,
    },
  }
}

const FEAT_ICONS: Record<string, ElementType> = {
  "Florist": Flower2,
  "Floral Studio": Flower,
  "Music Studio": Music,
  "Recording Studio": Music,
  "Marketing & Web Design": Megaphone,
  "3D Printing": Printer,
  "Wedding Venue": Building2,
  "Venue": Building2,
  "Photo Booth": Camera,
  "Photography": Camera,
  "Marriage Coaching": Heart,
  "Food": Utensils,
  "Restaurant": Utensils,
  "Retail": ShoppingBag,
  "Salon": Scissors,
  "Beauty": Scissors,
  "Fitness": Dumbbell,
  "Education": GraduationCap,
  "Construction": Wrench,
  "Delivery": Truck,
}
function getFeatIcon(category: string): ElementType {
  return FEAT_ICONS[category] ?? Star
}

const BIZ_COLORS: Record<string, string> = {
  "Music":            "#2A3A5A",
  "Beauty & Wellness":"#5A3A48",
  "Market & Food":    "#6B3D1E",
  "Food & Catering":  "#6B3D1E",
  "Venue & Events":   "#2A4A3A",
  "Florals":          "#3A5430",
  "Wedding":          "#4A3A2A",
  "Photography":      "#3A4A5A",
  "Local Business":   "#3D3028",
  default:            "#3D3028",
}

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#9a6c2f",
}

const HEADING: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 400,
  color: "#1a1208",
}

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  color: "#6b5040",
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params
  const cityName = CITIES.find((c) => dbCityToSlug(c) === citySlug)
  if (!cityName) notFound()

  const cityBizzes = localBusinesses.filter((b) =>
    dbCityToSlug(b.city) === citySlug &&
    !b.website?.includes("eventbrite.com") &&
    !b.name.match(/^\d{4}\s/) // filter year-prefixed event names
  )
  const slPlaces = SL_PLACES.filter((p) => slCityToSlug(p.city) === citySlug)
  const featuredBizzes = getFeaturedForCity(citySlug)
  const cityMeta = getCityMeta(citySlug)

  // Category counts for stats line
  const categoryCounts: Record<string, number> = {}
  for (const b of cityBizzes) {
    const cat = b.category || "Other"
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat, n]) => `${n} ${cat.toLowerCase()}`)
    .join(" · ")
  const news = getNewsForCity(cityName)
  const isAnniston = citySlug === "anniston"

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Businesses in ${cityName}, Alabama`,
    url: `https://southernlegends.blog/places/${citySlug}`,
    numberOfItems: cityBizzes.length,
    itemListElement: cityBizzes.slice(0, 20).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: b.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityName,
          addressRegion: "AL",
        },
        ...(b.website ? { url: b.website } : {}),
        ...(b.phone ? { telephone: b.phone } : {}),
      },
    })),
  }

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        .biz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem}
        @media(max-width:640px){.biz-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:380px){.biz-grid{grid-template-columns:1fr}}
        .flip-card{perspective:1000px;height:128px;cursor:default}
        .flip-card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.4s cubic-bezier(0.4,0.2,0.2,1)}
        .flip-card:hover .flip-card-inner{transform:rotateY(180deg)}
        .flip-card-front,.flip-card-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:8px;padding:1rem 1.125rem;overflow:hidden}
        .flip-card-back{transform:rotateY(180deg);background:#1a1208!important;display:flex;flex-direction:column;justify-content:space-between}
      `}</style>

      {/* HERO */}
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-8 md:pt-36">
        <Link
          href="/places"
          style={{ ...BODY, fontSize: "0.8rem", fontWeight: 600, color: "#9a6c2f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}
        >
          ← Places
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <MapPin size={14} style={{ color: "#9a6c2f" }} />
          <p style={{ ...LABEL, marginBottom: 0 }}>Alabama</p>
        </div>
        <h1 style={{ ...HEADING, fontSize: "clamp(2.5rem, 7vw, 4rem)", marginBottom: "0.5rem" }}>
          {cityName}
        </h1>
        <p style={{ ...BODY, fontSize: "1rem", marginBottom: "1rem" }}>
          The people, places, and stories of {cityName}, Alabama.
          {cityMeta?.tagline && ` ${cityMeta.tagline}.`}
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {cityMeta?.facebook && (
            <a
              href={cityMeta.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#9a6c2f", fontWeight: 600, textDecoration: "none" }}
            >
              {cityName} on Facebook ↗
            </a>
          )}
          {topCategories && (
            <p style={{ ...BODY, fontSize: "0.75rem", margin: 0 }}>{topCategories}</p>
          )}
        </div>
      </div>

      {/* CITY THEME AUDIO + SPOTIFY */}
      <div className="mx-auto max-w-4xl px-6 pb-2">
        <CityThemePlayer citySlug={citySlug} />
        <SpotifyEmbed
          playlistId={getPlaylistId(citySlug)}
          title="Listening — Southern Legends"
          compact
        />
        {(() => {
          const pl = getPlaylist(citySlug)
          return pl ? (
            <PlaylistEmbed
              playlistId={pl.playlistId}
              videoId={pl.videoId}
              title={pl.title}
              caption={pl.caption}
            />
          ) : null
        })()}
      </div>

      {/* HERO PHOTO */}
      <div className="mx-auto max-w-4xl px-6 pb-8">
        <div style={{
          position: "relative", width: "100%", height: "320px", borderRadius: "8px", overflow: "hidden",
          background: cityMeta?.heroImage ? undefined : "linear-gradient(135deg, #1a1208 0%, #2e1e0a 45%, #4a2e12 100%)",
        }}>
          {cityMeta?.heroImage && (
            <Image
              src={cityMeta.heroImage}
              alt={`${cityName}, Alabama`}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.5) 0%, transparent 65%)" }} />
          {!cityMeta?.heroImage && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 8vw, 3.5rem)", color: "rgba(240,237,230,0.18)", fontWeight: 400, letterSpacing: "0.04em" }}>
                Alabama
              </p>
            </div>
          )}
          <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem" }}>
            <p style={{ ...LABEL, color: "#F0EDE6", fontSize: "0.65rem", margin: 0 }}>{cityName}, Alabama</p>
          </div>
        </div>
      </div>

      {/* DISPATCH — local news */}
      {news.length > 0 && (
        <section style={{ background: "#1a1208" }}>
          <div className="mx-auto max-w-4xl px-6 py-8">
            <p style={{ ...LABEL, color: "#9a6c2f", marginBottom: "1rem" }}>
              This week in {cityName}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {news.map((story, i) => (
                <a
                  key={i}
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", padding: "0.75rem 0", borderBottom: i < news.length - 1 ? "1px solid rgba(240,237,230,0.08)" : "none" }}
                >
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "#F0EDE6", fontWeight: 400, lineHeight: 1.4 }}>
                    {story.title}
                  </span>
                  <span style={{ ...LABEL, color: "rgba(240,237,230,0.4)", flexShrink: 0, marginTop: "0.2rem" }}>
                    {story.source}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED — bento grid with Lucide icons */}
      {featuredBizzes.length > 0 && (
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p style={{ ...LABEL, marginBottom: "1.25rem" }}>Featured in {cityName}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem" }}>
            {featuredBizzes.map((biz, i) => {
              const Icon = getFeatIcon(biz.category)
              const isHero = i === 0
              const href = biz.storySlug
                ? `/places/${citySlug}/${biz.storySlug}`
                : biz.website ?? undefined
              const isExternal = !biz.storySlug && !!biz.website
              const bg = biz.tag === "own" ? "#1a1208" : biz.tag === "aisle" ? "#231808" : "#1c1812"
              return (
                <div
                  key={biz.name}
                  style={{
                    gridColumn: isHero ? "span 2" : undefined,
                    background: bg,
                    borderRadius: "10px",
                    padding: isHero ? "1.625rem" : "1.125rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: isHero ? "176px" : "130px",
                  }}
                >
                  <div>
                    <Icon size={isHero ? 26 : 18} style={{ color: "#c4974a", marginBottom: "0.625rem" }} />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,230,0.45)", marginBottom: "0.3rem" }}>
                      {TAG_LABELS[biz.tag]} · {biz.category}
                    </p>
                    {href ? (
                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        style={{ fontFamily: "var(--font-heading)", fontSize: isHero ? "1.1875rem" : "0.9375rem", fontWeight: 400, color: "#F0EDE6", lineHeight: 1.2, textDecoration: "none", display: "block" }}
                      >
                        {biz.name}
                      </Link>
                    ) : (
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: isHero ? "1.1875rem" : "0.9375rem", fontWeight: 400, color: "#F0EDE6", lineHeight: 1.2 }}>
                        {biz.name}
                      </p>
                    )}
                    {isHero && biz.description && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(240,237,230,0.55)", lineHeight: 1.6, marginTop: "0.5rem" }}>
                        {biz.description}
                      </p>
                    )}
                  </div>
                  {href && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "#c4974a", fontWeight: 600, marginTop: "0.75rem" }}>
                      {biz.storySlug ? "Read more →" : "Visit ↗"}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CIRCLE — 6,818-business directory as flip cards */}
      {cityBizzes.length > 0 && (
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
            <p style={{ ...LABEL }}>Who&apos;s building in {cityName}</p>
            <p style={{ ...BODY, fontSize: "0.75rem" }}>{cityBizzes.length} businesses</p>
          </div>
          <p style={{ ...BODY, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Every business in {cityName} in the directory. Hover a card for details.
          </p>
          <div className="biz-grid" style={{ marginBottom: "1.5rem" }}>
            {cityBizzes.slice(0, 21).map((biz) => {
              const bgColor = BIZ_COLORS[biz.vertical] ?? BIZ_COLORS.default
              return (
                <div key={biz.id} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ background: bgColor }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.55)", marginBottom: "0.5rem" }}>
                        {biz.category}
                      </p>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.9375rem", fontWeight: 400, color: "#F0EDE6", lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                        {biz.name}
                      </p>
                    </div>
                    <div className="flip-card-back">
                      <div>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.875rem", fontWeight: 400, color: "#F0EDE6", marginBottom: "0.2rem", lineHeight: 1.2 }}>
                          {biz.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(240,237,230,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {biz.category}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <Link
                          href={`/places/${citySlug}/${biz.slug}`}
                          style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#c4974a", fontWeight: 600, textDecoration: "none" }}
                        >
                          View listing →
                        </Link>
                        {biz.phone && (
                          <a href={`tel:${biz.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "rgba(240,237,230,0.55)", textDecoration: "none" }}>
                            {biz.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {cityBizzes.length > 21 && (
            <p style={{ ...BODY, fontSize: "0.8125rem", textAlign: "center" }}>
              + {cityBizzes.length - 21} more in {cityName}
            </p>
          )}
        </div>
      )}

      {/* EVENTS — Calhoun County towns link to the rolling events pages */}
      {CALHOUN_EVENT_TOWNS.includes(cityName) && (
        <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
          <div className="mx-auto max-w-4xl px-6 py-10">
            <p style={{ ...LABEL, marginBottom: "1rem" }}>Coming up in {cityName}</p>
            <UpcomingEvents city={cityName} title={`Next up in ${cityName}`} limit={3} />
            <Link
              href={cityName === "Anniston" ? "/listicles/anniston-events" : "/listicles/calhoun-county-events"}
              style={{ ...BODY, color: "#9a6c2f", textDecoration: "underline" }}
            >
              {cityName === "Anniston" ? "All Anniston events →" : "All Calhoun County events →"}
            </Link>
          </div>
        </section>
      )}

      {/* SL PLACES — curated editorial listings */}
      {slPlaces.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
          <div className="mx-auto max-w-4xl px-6 py-10">
            <p style={{ ...LABEL, marginBottom: "1rem" }}>Stories from {cityName}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {slPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={`/places/${citySlug}/${place.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{ background: "#fff", borderRadius: "6px", padding: "1.125rem 1.5rem", border: "1px solid rgba(154,108,47,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 400, color: "#1a1208", marginBottom: "0.2rem" }}>
                        {place.name}
                      </p>
                      <p style={{ ...BODY, fontSize: "0.8125rem" }}>
                        {place.category}
                        {place.story && " · SL Story"}
                      </p>
                    </div>
                    <span style={{ color: "#9a6c2f", fontSize: "1.125rem" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLAIM BAND */}
      <div style={{ background: "#1a1208" }}>
        <div className="mx-auto max-w-4xl px-6 py-10" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
          <p style={{ ...LABEL, color: "#9a6c2f" }}>Gather Circle</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", color: "#F0EDE6", fontWeight: 400, maxWidth: "36rem" }}>
            Is your business listed in {cityName}?
          </p>
          <p style={{ ...BODY, color: "rgba(240,237,230,0.65)", fontSize: "0.9375rem", maxWidth: "36rem", lineHeight: 1.65 }}>
            Add your hours, photos, and story. Get found by people already looking for what you do.
          </p>
          <a
            href={`https://gatherstudio.app/api/wiki-claim?city=${citySlug}`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", background: "#9a6c2f", color: "#F0EDE6", padding: "0.625rem 1.5rem", borderRadius: "4px", textDecoration: "none" }}
          >
            Add your listing →
          </a>
        </div>
      </div>

      {/* FAITH — Anniston only */}
      {isAnniston && (
        <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
          <div className="mx-auto max-w-4xl px-6 py-10">
            <p style={{ ...LABEL, marginBottom: "1rem" }}>Faith in Anniston</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "#1a1208", marginBottom: "0.75rem" }}>
              A weekly column in the Anniston Star.
            </p>
            <p style={{ ...BODY, fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.25rem", maxWidth: "36rem" }}>
              Matt Headley writes about faith, community, and what it means to build something in a small Alabama city. It runs Sundays in the Anniston Star, beginning August 3.
            </p>
            <a
              href="https://www.annistonstar.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#9a6c2f", fontWeight: 600, textDecoration: "underline" }}
            >
              Read the Anniston Star →
            </a>
          </div>
        </section>
      )}

      {/* SPONSOR SLOT — shown when city has a sponsor */}
      {/* Populated via SL_SPONSORS in places.ts — empty until first sponsor signs */}

      {/* BLUEPRINT PITCH */}
      <div style={{ background: "#f5f0e8", borderTop: "1px solid rgba(154,108,47,0.1)" }}>
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p style={{ ...LABEL, marginBottom: "0.75rem" }}>Gather Studio</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", color: "#1a1208", fontWeight: 400, marginBottom: "0.75rem", maxWidth: "32rem" }}>
            Does your {cityName} business have a clear message?
          </p>
          <p style={{ ...BODY, fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.25rem", maxWidth: "36rem" }}>
            A Blueprint Session gets you there in 90 minutes. Find out what you&apos;re actually building and why it matters.
          </p>
          <a
            href="https://gatherstudio.app/book"
            style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", background: "#1a1208", color: "#F0EDE6", padding: "0.625rem 1.5rem", borderRadius: "4px", textDecoration: "none" }}
          >
            Book a Blueprint Session
          </a>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div style={{ borderTop: "1px solid rgba(154,108,47,0.1)" }}>
        <div className="mx-auto max-w-4xl px-6 py-10">
          <CityNewsletterSignup city={cityName} />
        </div>
      </div>

      {/* NEARBY CITIES */}
      {cityMeta?.nearbySlug && cityMeta.nearbySlug.length > 0 && (
        <div className="mx-auto max-w-4xl px-6 pb-4">
          <p style={{ ...LABEL, marginBottom: "0.5rem" }}>Also in NE Alabama</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {cityMeta.nearbySlug.map((slug) => {
              const name = CITIES.find((c) => dbCityToSlug(c) === slug) || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              return (
                <Link
                  key={slug}
                  href={`/places/${slug}`}
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#9a6c2f", fontWeight: 600, textDecoration: "none", padding: "0.3rem 0.75rem", border: "1px solid rgba(154,108,47,0.25)", borderRadius: "4px" }}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* BUSINESSES DIRECTORY LINK */}
      <div className="mx-auto max-w-4xl px-6 py-6">
        <Link
          href={`/businesses/${dbCityToSlug(cityName)}`}
          style={{ ...BODY, fontSize: "0.875rem", color: "#9a6c2f", fontWeight: 600, textDecoration: "underline" }}
        >
          Browse all {cityName} businesses →
        </Link>
      </div>

      {/* NOMINATE */}
      <div className="mx-auto max-w-4xl px-6 py-8" style={{ textAlign: "center" }}>
        <Link
          href="/places/nominate"
          style={{ ...BODY, fontSize: "0.875rem", color: "#9a6c2f", fontWeight: 600, textDecoration: "underline" }}
        >
          Know a business in {cityName} that belongs here? Nominate them →
        </Link>
      </div>

      {/* SHARE + SECTION CROSSLINKS */}
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <ShareRow
          url={`/places/${citySlug}`}
          title={`${cityName}, Alabama — Southern Legends`}
          description={`The people, places, and stories of ${cityName}, Alabama.`}
        />
        <SectionLinks current="/places" />
      </div>
    </main>
  )
}
