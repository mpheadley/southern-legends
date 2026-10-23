import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Flower2, Flower, Music, Megaphone, Printer, Building2, Camera, Heart, Star, Utensils, ShoppingBag, Scissors, Dumbbell, GraduationCap, Wrench, Truck, Headphones } from "lucide-react"
import type { ElementType } from "react"
import { readFileSync } from "fs"
import { join } from "path"
import { CITIES, localBusinesses, cityToSlug as dbCityToSlug } from "@/lib/city-businesses"
import { SL_PLACES, cityToSlug as slCityToSlug } from "@/lib/places"
import { getFeaturedForCity, TAG_LABELS } from "@/lib/featured-businesses"
import { getCityMeta } from "@/lib/city-meta"
import { getAllProfiles, type Profile } from "@/lib/profiles"
import { getAllListicles } from "@/lib/listicles"
import { CITY_THEMES } from "@/lib/city-themes"
import { getPlaylistId } from "@/lib/spotify-config"
import { getPlaylist } from "@/lib/playlists"
import CityNewsletterSignup from "@/app/components/CityNewsletterSignup"
import SectionLinks from "@/app/components/SectionLinks"
import ShareRow from "@/app/components/ShareRow"
import SpotifyEmbed from "@/app/components/SpotifyEmbed"
import CityThemePlayer from "@/app/components/CityThemePlayer"
import PlaylistEmbed from "@/app/components/PlaylistEmbed"
import UpcomingEvents from "@/app/components/UpcomingEvents"
import ProfileCardHero from "@/app/components/ProfileCardHero"

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

/** Local news only. The old statewide fallback put Mobile headlines on a Piedmont page. */
function getNewsForCity(cityName: string): NewsStory[] {
  try {
    const p = join(process.cwd(), "../../.instar/news/news-briefing.json")
    const data = JSON.parse(readFileSync(p, "utf8"))
    const stories: NewsStory[] = data.stories ?? []
    const lo = cityName.toLowerCase()
    return stories
      .filter((s) => s.title?.toLowerCase().includes(lo) || s.excerpt?.toLowerCase().includes(lo))
      .slice(0, 5)
  } catch {
    return []
  }
}

/** Profiles whose location names this city ("Anniston, Alabama", "Oxford, AL", "anniston-al"). */
function profilesForCity(cityName: string): Profile[] {
  const needle = cityName.toLowerCase()
  return getAllProfiles().filter((p) => {
    const loc = (p.frontmatter.location ?? "").toLowerCase().replace(/[^a-z]+/g, " ")
    return loc.split(" ").includes(needle) || loc.includes(needle)
  })
}

/** What the page has that only Southern Legends can offer. Empty cities get the lean variant. */
function cityContent(citySlug: string, cityName: string) {
  const profiles = profilesForCity(cityName)
  const slPlaces = SL_PLACES.filter((p) => slCityToSlug(p.city) === citySlug)
  const featuredBizzes = getFeaturedForCity(citySlug)
  const guides = getAllListicles().filter((l) => l.city === cityName)
  const hasEvents = CALHOUN_EVENT_TOWNS.includes(cityName)
  const hasSLContent = profiles.length > 0 || slPlaces.length > 0 || featuredBizzes.length > 0 || guides.length > 0 || hasEvents
  return { profiles, slPlaces, featuredBizzes, guides, hasEvents, hasSLContent }
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: dbCityToSlug(city) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params
  const cityName = CITIES.find((c) => dbCityToSlug(c) === citySlug)
  if (!cityName) return {}
  const { hasSLContent } = cityContent(citySlug, cityName)
  return {
    title: `${cityName}, Alabama`,
    description: hasSLContent
      ? `Local businesses, stories, and community in ${cityName}, Alabama. Curated by Southern Legends.`
      : `A directory of businesses in ${cityName}, Alabama, from Southern Legends.`,
    alternates: { canonical: `/places/${citySlug}` },
    // Directory-only cities stay out of the index until they have SL content (redesign B-04).
    robots: hasSLContent ? undefined : { index: false, follow: true },
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
  fontSize: "var(--text-label)",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-ll-accent-dark)",
}

const HEADING: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 400,
  color: "var(--color-ll-dark)",
}

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  color: "var(--color-ll-text)",
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
  const { profiles, slPlaces, featuredBizzes, guides, hasEvents, hasSLContent } = cityContent(citySlug, cityName)
  const cityMeta = getCityMeta(citySlug)

  // Category counts for stats line
  const categoryCounts: Record<string, number> = {}
  for (const b of cityBizzes) {
    const cat = b.category || "Other"
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  // Human labels for raw category keys (audit C-16). "other" is dropped; unknown keys are title-cased.
  const CATEGORY_LABELS: Record<string, string | null> = {
    other: null,
    "food truck": "Food trucks",
    "hair salon wedding": "Hair & wedding",
    "wedding photographer": "Wedding photographers",
  }
  const labelFor = (cat: string): string | null => {
    const key = cat.trim().toLowerCase()
    if (key in CATEGORY_LABELS) return CATEGORY_LABELS[key]
    return key.replace(/\b\w/g, (c) => c.toUpperCase())
  }
  const labelCounts: Record<string, number> = {}
  for (const [cat, n] of Object.entries(categoryCounts)) {
    const label = labelFor(cat)
    if (label) labelCounts[label] = (labelCounts[label] || 0) + n
  }
  const topCategories = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, n]) => `${n} ${label}`)
    .join(" · ")
  const news = hasSLContent ? getNewsForCity(cityName) : []
  const isAnniston = citySlug === "anniston"

  // Listen row: theme audio (only when the file is on disk), Spotify, YouTube playlist — one row, or nothing.
  const theme = CITY_THEMES[citySlug]
  const hasTheme = !!theme && fs.existsSync(path.join(process.cwd(), "public", theme.file))
  const spotifyId = getPlaylistId(citySlug)
  const ytPlaylist = getPlaylist(citySlug)
  const hasListen = hasTheme || !!spotifyId || !!ytPlaylist

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Businesses in ${cityName}, Alabama`,
    url: `https://southernlegends.org/places/${citySlug}`,
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

  const directory = (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ ...LABEL, margin: 0 }}>Who&apos;s building in {cityName}</h2>
        <p style={{ ...BODY, fontSize: "var(--text-meta)", margin: 0 }}>{cityBizzes.length} businesses</p>
      </div>
      <p style={{ ...BODY, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Every business in {cityName} in the directory. Tap or tab to a card for details.
      </p>
      <div className="biz-grid" style={{ marginBottom: "1.5rem" }}>
        {[...cityBizzes]
          // Businesses with a real photo on file lead the grid.
          .map((biz) => ({ biz, photo: fs.existsSync(path.join(process.cwd(), "public/images/businesses", `${biz.slug}.webp`)) ? `/images/businesses/${biz.slug}.webp` : null }))
          .sort((a, b) => Number(!!b.photo) - Number(!!a.photo))
          .slice(0, 21)
          .map(({ biz, photo }) => {
          const bgColor = BIZ_COLORS[biz.vertical] ?? BIZ_COLORS.default
          const frontBg = photo
            ? `linear-gradient(to top, rgba(20,16,14,0.88) 0%, rgba(20,16,14,0.45) 55%, rgba(20,16,14,0.15) 100%), url(${photo}) center/cover no-repeat, ${bgColor}`
            : bgColor
          return (
            <div key={biz.id} className="flip-card" tabIndex={0}>
              <div className="flip-card-inner">
                <div className="flip-card-front" style={{ background: frontBg }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,237,230,0.55)", marginBottom: "0.5rem" }}>
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
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "rgba(240,237,230,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {biz.category}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <Link
                      href={`/places/${citySlug}/${biz.slug}`}
                      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "var(--color-ll-accent)", fontWeight: 600, textDecoration: "none" }}
                    >
                      View listing →
                    </Link>
                    {biz.phone && (
                      <a href={`tel:${biz.phone}`} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "rgba(240,237,230,0.55)", textDecoration: "none" }}>
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
        /* The rest of the directory, opened in place (B-10: /businesses is gone, /places is the one directory). */
        <details style={{ ...BODY, fontSize: "0.875rem" }}>
          <summary style={{ cursor: "pointer", textAlign: "center", color: "var(--color-ll-accent-dark)", fontWeight: 600 }}>
            + {cityBizzes.length - 21} more in {cityName}
          </summary>
          <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", columns: 2, columnGap: "2rem" }}>
            {[...cityBizzes]
              .sort((a, b) => Number(fs.existsSync(path.join(process.cwd(), "public/images/businesses", `${b.slug}.webp`))) - Number(fs.existsSync(path.join(process.cwd(), "public/images/businesses", `${a.slug}.webp`))))
              .slice(21)
              .map((biz) => (
                <li key={biz.id} style={{ breakInside: "avoid", padding: "0.3rem 0", borderBottom: "1px solid rgba(154,108,47,0.12)" }}>
                  <Link href={`/places/${citySlug}/${biz.slug}`} style={{ color: "var(--color-ll-dark)", fontWeight: 600, textDecoration: "none" }}>
                    {biz.name}
                  </Link>
                  <span style={{ color: "#6b625a", fontSize: "var(--text-label)" }}> · {biz.category}</span>
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  )

  const nearby = cityMeta?.nearbySlug && cityMeta.nearbySlug.length > 0 && (
    <div className="mx-auto max-w-4xl px-6 pb-4">
      <p style={{ ...LABEL, marginBottom: "0.5rem" }}>Also in NE Alabama</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {cityMeta.nearbySlug.map((slug) => {
          const name = CITIES.find((c) => dbCityToSlug(c) === slug) || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          return (
            <Link
              key={slug}
              href={`/places/${slug}`}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "none", padding: "0.3rem 0.75rem", border: "1px solid rgba(154,108,47,0.25)", borderRadius: "4px" }}
            >
              {name}
            </Link>
          )
        })}
      </div>
    </div>
  )

  const nominate = (
    <div className="mx-auto max-w-4xl px-6 py-8" style={{ textAlign: "center" }}>
      <Link
        href="/places/nominate"
        style={{ ...BODY, fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "underline" }}
      >
        Know a business in {cityName} that belongs here? Nominate them →
      </Link>
    </div>
  )

  const shareAndLinks = (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <ShareRow
        url={`/places/${citySlug}`}
        title={`${cityName}, Alabama — Southern Legends`}
        description={`The people, places, and stories of ${cityName}, Alabama.`}
      />
      <SectionLinks current="/places" />
    </div>
  )

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        .biz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem}
        @media(max-width:640px){.biz-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:380px){.biz-grid{grid-template-columns:1fr}}
        .flip-card{perspective:1000px;height:128px;cursor:default}
        .flip-card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.4s cubic-bezier(0.4,0.2,0.2,1)}
        .flip-card:hover .flip-card-inner,.flip-card:focus-within .flip-card-inner{transform:rotateY(180deg)}
        .flip-card-front,.flip-card-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:8px;padding:1rem 1.125rem;overflow:hidden}
        .flip-card-back{transform:rotateY(180deg);background:var(--color-ll-dark)!important;display:flex;flex-direction:column;justify-content:space-between}
        @media(max-width:640px){.feat-grid{grid-template-columns:1fr!important}.feat-grid>div{grid-column:auto!important}}
        .city-hero{position:relative;width:100%;min-height:${hasSLContent ? "clamp(420px, 62vh, 680px)" : "clamp(300px, 42vh, 460px)"};display:flex;align-items:flex-end;overflow:hidden;background:linear-gradient(135deg, var(--color-ll-dark) 0%, #2e1e0a 45%, #4a2e12 100%)}
        .city-hero-inner{position:relative;z-index:2;width:100%;max-width:56rem;margin:0 auto;padding:7rem 1.5rem 2.5rem}
        .city-hero h1{font-family:var(--font-heading);font-weight:400;font-size:clamp(3rem, 10vw, 7rem);line-height:0.95;color:#FAFAF7;margin:0 0 0.75rem;font-variation-settings:"opsz" 72;text-shadow:0 2px 18px rgba(0,0,0,0.45)}
        .city-hero-sub{font-family:var(--font-body);font-size:clamp(1rem, 2vw, 1.2rem);color:rgba(250,250,247,0.85);max-width:36rem;line-height:1.5;margin:0;text-shadow:0 1px 8px rgba(0,0,0,0.5)}
      `}</style>

      {/* HERO — the city photo is the hero; name on it; credit as a caption under it (redesign B-04) */}
      <section className="city-hero">
        {cityMeta?.heroImage && (
          <Image
            src={cityMeta.heroImage}
            alt={`${cityName}, Alabama`}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        )}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to top, rgba(26,18,8,0.82) 0%, rgba(26,18,8,0.35) 50%, rgba(26,18,8,0.15) 100%)" }} />
        <div className="city-hero-inner">
          <Link
            href="/places"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(250,220,150,0.95)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.25rem" }}
          >
            <MapPin size={14} aria-hidden="true" /> Places · Alabama
          </Link>
          <h1>{cityName}</h1>
          <p className="city-hero-sub">
            {cityMeta?.tagline ? `${cityMeta.tagline}.` : `The people, places, and stories of ${cityName}, Alabama.`}
          </p>
        </div>
      </section>
      {(cityMeta?.heroCredit || topCategories || cityMeta?.facebook) && (
        <div className="mx-auto max-w-4xl px-6" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", padding: "0.6rem 1.5rem" }}>
          <p style={{ ...BODY, fontSize: "var(--text-meta)", margin: 0, color: "var(--color-ll-text-light)" }}>
            {cityMeta?.heroCredit ?? ""}
          </p>
          <p style={{ ...BODY, fontSize: "var(--text-meta)", margin: 0 }}>
            {topCategories}
            {cityMeta?.facebook && (
              <>
                {topCategories ? " · " : ""}
                <a href={cityMeta.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "none" }}>
                  {cityName} on Facebook ↗
                </a>
              </>
            )}
          </p>
        </div>
      )}

      {!hasSLContent ? (
        /* LEAN VARIANT — a directory page until this city has SL stories. noindex (see generateMetadata). */
        <>
          <div className="mx-auto max-w-4xl px-6 pt-6">
            <p style={{ ...BODY, fontSize: "1rem", maxWidth: "40rem" }}>
              I haven&apos;t written about {cityName} yet. Until I do, here is who&apos;s building there.
            </p>
          </div>
          {cityBizzes.length > 0 ? directory : (
            <div className="mx-auto max-w-4xl px-6 py-10">
              <p style={BODY}>No businesses on file for {cityName} yet.</p>
            </div>
          )}
          {nominate}
          {nearby}
          {shareAndLinks}
        </>
      ) : (
        <>
          {/* LISTEN — one row for theme audio, Spotify, and the playlist (only when something exists) */}
          {hasListen && (
            <section className="mx-auto max-w-4xl px-6 pt-8 pb-2">
              <h2 style={{ ...LABEL, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Headphones size={14} aria-hidden="true" /> Listen
              </h2>
              {hasTheme && <CityThemePlayer citySlug={citySlug} />}
              {spotifyId && <SpotifyEmbed playlistId={spotifyId} compact />}
              {ytPlaylist && (
                <PlaylistEmbed
                  playlistId={ytPlaylist.playlistId}
                  videoId={ytPlaylist.videoId}
                  title={ytPlaylist.title}
                  caption={ytPlaylist.caption}
                />
              )}
            </section>
          )}

          {/* STORIES — the real SL content first */}
          {profiles.length > 0 && (
            <section className="mx-auto max-w-4xl px-6 py-10">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
                <h2 style={{ ...LABEL, margin: 0 }}>Stories from {cityName}</h2>
                <Link href="/profiles" style={{ ...BODY, fontSize: "var(--text-meta)", color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "none" }}>All stories →</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.slice(0, 6).map((p) => (
                  <ProfileCardHero key={p.slug} profile={p} />
                ))}
              </div>
            </section>
          )}

          {/* DISPATCH — local news (local matches only) */}
          {news.length > 0 && (
            <section style={{ background: "var(--color-ll-dark)" }}>
              <div className="mx-auto max-w-4xl px-6 py-8">
                <h2 style={{ ...LABEL, color: "var(--color-ll-accent-dark)", marginBottom: "1rem" }}>
                  This week in {cityName}
                </h2>
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
            <section className="mx-auto max-w-4xl px-6 py-10">
              <h2 style={{ ...LABEL, marginBottom: "1.25rem" }}>Featured in {cityName}</h2>
              <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.875rem" }}>
                {featuredBizzes.map((biz, i) => {
                  const Icon = getFeatIcon(biz.category)
                  const isHero = i === 0
                  const href = biz.storySlug
                    ? `/places/${citySlug}/${biz.storySlug}`
                    : biz.website ?? undefined
                  const isExternal = !biz.storySlug && !!biz.website
                  const bg = biz.tag === "own" ? "var(--color-ll-dark)" : biz.tag === "aisle" ? "#231808" : "#1c1812"
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
                        <Icon size={isHero ? 26 : 18} style={{ color: "var(--color-ll-accent)", marginBottom: "0.625rem" }} aria-hidden="true" />
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,237,230,0.45)", marginBottom: "0.3rem" }}>
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
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "var(--color-ll-accent)", fontWeight: 600, marginTop: "0.75rem" }}>
                          {biz.storySlug ? "Read more →" : "Visit ↗"}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* DIRECTORY */}
          {cityBizzes.length > 0 && directory}

          {/* EVENTS — Calhoun County towns link to the rolling events pages */}
          {hasEvents && (
            <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
              <div className="mx-auto max-w-4xl px-6 py-10">
                <h2 style={{ ...LABEL, marginBottom: "1rem" }}>Coming up in {cityName}</h2>
                <UpcomingEvents city={cityName} title={`Next up in ${cityName}`} limit={3} />
                <Link
                  href={cityName === "Anniston" ? "/listicles/anniston-events" : "/listicles/calhoun-county-events"}
                  style={{ ...BODY, color: "var(--color-ll-accent-dark)", textDecoration: "underline" }}
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
                <h2 style={{ ...LABEL, marginBottom: "1rem" }}>Places with a story</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {slPlaces.map((place) => (
                    <Link
                      key={place.id}
                      href={`/places/${citySlug}/${place.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{ background: "#fff", borderRadius: "6px", padding: "1.125rem 1.5rem", border: "1px solid rgba(154,108,47,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 400, color: "var(--color-ll-dark)", marginBottom: "0.2rem" }}>
                            {place.name}
                          </p>
                          <p style={{ ...BODY, fontSize: "0.8125rem" }}>
                            {place.category}
                            {place.story && " · SL Story"}
                          </p>
                        </div>
                        <span style={{ color: "var(--color-ll-accent-dark)", fontSize: "1.125rem" }} aria-hidden="true">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* GUIDES for this city */}
          {guides.length > 0 && (
            <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
              <div className="mx-auto max-w-4xl px-6 py-10">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem", gap: "1rem", flexWrap: "wrap" }}>
                  <h2 style={{ ...LABEL, margin: 0 }}>Local guides · {cityName}</h2>
                  <Link href={`/listicles?city=${encodeURIComponent(cityName)}`} style={{ ...BODY, fontSize: "var(--text-meta)", color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "none" }}>All {cityName} guides →</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                  {guides.slice(0, 6).map((g) => (
                    <Link key={g.slug} href={`/listicles/${g.slug}`} style={{
                      display: "block", background: "#fff", border: "1px solid rgba(154,108,47,0.15)",
                      borderRadius: "6px", padding: "0.9rem 1.1rem", textDecoration: "none",
                      fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "var(--color-ll-dark)", lineHeight: 1.25,
                    }}>
                      {g.title}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAITH — Anniston only. The column lives on this site now. */}
          {isAnniston && (
            <section style={{ borderTop: "1px solid rgba(154,108,47,0.12)" }}>
              <div className="mx-auto max-w-4xl px-6 py-10">
                <h2 style={{ ...LABEL, marginBottom: "1rem" }}>Faith in Anniston</h2>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "var(--color-ll-dark)", marginBottom: "0.75rem" }}>
                  A weekly column in the Anniston Star.
                </p>
                <p style={{ ...BODY, fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.25rem", maxWidth: "36rem" }}>
                  Matt Headley writes about faith, family, and what it means to build something in a small Alabama city. It runs in the Star first, then here.
                </p>
                <Link
                  href="/faith"
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-ll-accent-dark)", fontWeight: 600, textDecoration: "underline" }}
                >
                  Read the column →
                </Link>
              </div>
            </section>
          )}

          {/* THE ONE ASK — claim your listing */}
          <section style={{ background: "var(--color-ll-dark)" }}>
            <div className="mx-auto max-w-4xl px-6 py-12" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
              <p style={{ ...LABEL, color: "var(--color-ll-accent-dark)" }}>Gather Circle</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", color: "#F0EDE6", fontWeight: 400, maxWidth: "36rem", lineHeight: 1.1 }}>
                Is your business listed in {cityName}?
              </h2>
              <p style={{ ...BODY, color: "rgba(240,237,230,0.65)", fontSize: "0.9375rem", maxWidth: "36rem", lineHeight: 1.65 }}>
                Add your hours, photos, and story. Get found by people already looking for what you do.
              </p>
              <a
                href={`https://gatherstudio.app/api/wiki-claim?city=${citySlug}`}
                style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", background: "var(--color-ll-accent-dark)", color: "#F0EDE6", padding: "0.75rem 1.5rem", borderRadius: "4px", textDecoration: "none" }}
              >
                Add your listing →
              </a>
            </div>
          </section>

          {/* NEWSLETTER */}
          <div style={{ borderTop: "1px solid rgba(154,108,47,0.1)" }}>
            <div className="mx-auto max-w-4xl px-6 py-10">
              <CityNewsletterSignup city={cityName} />
            </div>
          </div>

          {nearby}
          {nominate}
          {shareAndLinks}
        </>
      )}
    </main>
  )
}
