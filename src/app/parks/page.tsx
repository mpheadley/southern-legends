import type { Metadata } from "next"
import Link from "next/link"
import { PARKS, managerLabel } from "@/lib/parks"
import SectionLinks from "@/app/components/SectionLinks"
import ShareRow from "@/app/components/ShareRow"

export const metadata: Metadata = {
  title: "Parks — Southern Legends",
  description:
    "Honest, complete guides to the parks of Northeast Alabama — Cheaha, Noccalula Falls, Little River Canyon, DeSoto, Coldwater, and Choccolocco. Real hours, fees, trails, and seasonality, written by someone who actually goes.",
  alternates: { canonical: "/parks" },
  openGraph: { url: "/parks" },
}

export default function ParksPage() {
  const featuredSlugs = ["cheaha-state-park", "noccalula-falls-park", "little-river-canyon"]
  const featured = PARKS.filter((p) => featuredSlugs.includes(p.slug))
  const rest = PARKS.filter((p) => !featuredSlugs.includes(p.slug))

  return (
    <main style={{ background: "var(--color-ll-light)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(to bottom, #1C1917, #24341F)",
          padding: "7.5rem 1.5rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/topo-7.png)", backgroundSize: "400px", opacity: 0.06 }} />
        <div style={{ position: "relative", maxWidth: "48rem", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "1rem" }}>
            Southern Legends · Parks Guide
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#FAFAF7", fontWeight: 400, lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Parks of<br />Northeast Alabama
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "rgba(250,250,247,0.78)", lineHeight: 1.7, maxWidth: "38rem", margin: "0 auto 1rem" }}>
            Real hours, real fees, real trails — and one honest note from someone who&apos;s actually stood there. From the highest point in the state to the waterfall where I got engaged.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(250,250,247,0.5)", fontStyle: "italic", marginBottom: "2rem" }}>
            No crowd-scraped stubs. No fake rankings. Just what&apos;s there.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/parks/cheaha-state-park" style={{ display: "inline-block", background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem 1.75rem", textDecoration: "none", borderRadius: "3px" }}>
              Start with Cheaha →
            </Link>
            <Link href="#all-parks" style={{ display: "inline-block", background: "transparent", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", padding: "0.75rem 1.75rem", textDecoration: "none", border: "1px solid rgba(250,250,247,0.3)", borderRadius: "3px" }}>
              All Parks
            </Link>
          </div>
        </div>
      </div>

      {/* Trails cross-link callout */}
      <div style={{ background: "#3D6B4F", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#FAFAF7", margin: 0 }}>
          <strong style={{ color: "#CA8A04" }}>Looking for trails, not parks?</strong> The Chief Ladiga, Silver Comet, and Coldwater trail guides live in the{" "}
          <Link href="/trails" style={{ color: "#CA8A04", textDecoration: "underline" }}>Trail Guide →</Link>
        </p>
      </div>

      {/* Featured */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem 0" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "2rem" }}>Featured</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {featured.map((park) => (
            <ParkCard key={park.slug} park={park} featured />
          ))}
        </div>

        {/* All parks */}
        <div id="all-parks">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "2rem" }}>All Parks</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "4rem" }}>
            {rest.map((park) => (
              <ParkCard key={park.slug} park={park} />
            ))}
          </div>
        </div>

        {/* Sponsor slot */}
        <div style={{ border: "1px dashed #CA8A04", borderRadius: "6px", padding: "1.25rem 1.5rem", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.25rem" }}>Sponsor the Parks Guide</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#6B6560", margin: 0 }}>Outfitters, campgrounds, and tourism boards. $150/mo for a regional spotlight seen by every visitor planning a trip.</p>
          </div>
          <a href="mailto:matt@gatherstudio.app?subject=Parks Guide Sponsor" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "#9A3412", textDecoration: "none", whiteSpace: "nowrap" }}>Get in touch →</a>
        </div>

        <ShareRow url="/parks" title="Parks of Northeast Alabama — Southern Legends" description="Honest, complete guides to NE Alabama's parks, written by someone who actually goes." />
        <SectionLinks current="/parks" />
      </div>
    </main>
  )
}

function ParkCard({ park, featured = false }: { park: import("@/lib/parks").Park; featured?: boolean }) {
  return (
    <Link href={`/parks/${park.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", overflow: "hidden", transition: "box-shadow 0.15s" }}>
        {/* Park photo */}
        <div style={{ height: featured ? "160px" : "100px", background: "linear-gradient(135deg, #3D6B4F, #1C3A2A)", position: "relative", display: "flex", alignItems: "flex-end", padding: "0.75rem", overflow: "hidden" }}>
          {park.image && (
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${park.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.6 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ background: park.managedBy === "national-preserve" ? "#166534" : "#9A3412", color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
              {managerLabel(park.managedBy)}
            </span>
            {park.mattNote && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#CA8A04" }}>✓ Been there</span>
            )}
          </div>
        </div>

        <div style={{ padding: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.25rem" }}>{park.location}</p>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: featured ? "1.25rem" : "1.05rem", color: "#1C1917", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.2 }}>{park.name}</h3>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            {park.acreage && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6B6560" }}>{park.acreage.toLocaleString()} ac</span>}
            {park.elevationFt && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6B6560" }}>{park.elevationFt.toLocaleString()} ft</span>}
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: park.fee ? "#9A3412" : "#3D6B4F" }}>{park.fee ? "Fee" : "Free"}</span>
          </div>
          {featured && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#3F3B36", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {park.description.substring(0, 120)}…
            </p>
          )}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#9A3412" }}>Read the guide →</span>
        </div>
      </div>
    </Link>
  )
}
