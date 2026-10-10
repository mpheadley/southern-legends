import type { Metadata } from "next"
import Link from "next/link"
import { Bike, Footprints, PersonStanding, TrainTrack, type LucideIcon } from "lucide-react"
import { TRAILS, difficultyLabel, difficultyColor, surfaceLabel } from "@/lib/trails"
import SectionLinks from "@/app/components/SectionLinks"
import ShareRow from "@/app/components/ShareRow"

export const metadata: Metadata = {
  title: "Trails — Southern Legends",
  description: "Trail reviews, trip reports, and local knowledge for the Chief Ladiga Trail, Silver Comet, Coldwater Mountain, Pinhoti, and the broader NE Alabama trail network.",
  alternates: { canonical: "/trails" },
  openGraph: { url: "/trails" },
}

// Lucide, not emoji (audit QW-17). Uses without an icon (e.g. horses) fall back to a text label.
const USE_ICONS: Record<string, { Icon: LucideIcon; label: string }> = {
  biking: { Icon: Bike, label: "Biking" },
  hiking: { Icon: Footprints, label: "Hiking" },
  running: { Icon: PersonStanding, label: "Running" },
  "rail-trail": { Icon: TrainTrack, label: "Rail-trail" },
}

export default function TrailsPage() {
  const featured = TRAILS.filter(t => ["chief-ladiga-trail", "silver-comet-trail", "coldwater-mountain"].includes(t.slug))
  const rest = TRAILS.filter(t => !featured.map(f => f.slug).includes(t.slug))

  return (
    <main style={{ background: "var(--color-ll-light)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(to bottom, #1C1917, #3D2B1A)",
        padding: "7.5rem 1.5rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/topo-7.png)", backgroundSize: "400px", opacity: 0.06 }} />
        <div style={{ position: "relative", maxWidth: "48rem", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "1rem" }}>
            Southern Legends · Trail Guide
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#FAFAF7", fontWeight: 400, lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Trails of the<br />Alabama Corridor
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "rgba(250,250,247,0.75)", lineHeight: 1.7, maxWidth: "36rem", margin: "0 auto 2rem" }}>
            Chief Ladiga to Silver Comet. Coldwater to Cheaha. Real reviews and local knowledge for the best trails in NE Alabama and the Southeast corridor.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/trails/chief-ladiga-trail" style={{ display: "inline-block", background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem 1.75rem", textDecoration: "none", borderRadius: "3px" }}>
              Chief Ladiga Trail →
            </Link>
            <Link href="#all-trails" style={{ display: "inline-block", background: "transparent", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", padding: "0.75rem 1.75rem", textDecoration: "none", border: "1px solid rgba(250,250,247,0.3)", borderRadius: "3px" }}>
              All Trails
            </Link>
          </div>
        </div>
      </div>

      {/* CLT Corridor callout */}
      <div style={{ background: "#3D6B4F", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#FAFAF7", margin: 0 }}>
          <strong style={{ color: "#CA8A04" }}>94+ miles of connected paved trail:</strong> Chief Ladiga Trail (AL) + Silver Comet Trail (GA) — one of the longest paved corridors in the eastern US.{" "}
          <Link href="/trails/chief-ladiga-trail" style={{ color: "#CA8A04", textDecoration: "underline" }}>Start planning →</Link>
        </p>
      </div>

      {/* Featured trails */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem 0" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "2rem" }}>Featured</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {featured.map(trail => (
            <TrailCard key={trail.slug} trail={trail} featured />
          ))}
        </div>

        {/* All trails */}
        <div id="all-trails">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "2rem" }}>All Trails</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "4rem" }}>
            {rest.map(trail => (
              <TrailCard key={trail.slug} trail={trail} />
            ))}
          </div>
        </div>

        {/* Support CLT */}
        <div style={{ background: "#1C1917", borderRadius: "8px", padding: "2.5rem", marginBottom: "3rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.5rem" }}>Support the Trail</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "#FAFAF7", fontWeight: 400, marginBottom: "0.75rem" }}>Chief Ladiga Trail needs your help.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "rgba(250,250,247,0.7)", lineHeight: 1.7 }}>
              The CLT is volunteer-maintained and grant-funded. Trail repairs, trailhead improvements, and new connections depend on community support.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Link href="/trails/chief-ladiga-trail#support" style={{ display: "inline-block", background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", padding: "0.875rem 1.75rem", textDecoration: "none", borderRadius: "3px", whiteSpace: "nowrap" }}>
              Support CLT →
            </Link>
          </div>
        </div>

        <ShareRow url="/trails" title="Trails — Southern Legends" description="Trail reviews and local knowledge for NE Alabama and the Southeast corridor." />
        <SectionLinks current="/trails" />
      </div>
    </main>
  )
}

function TrailCard({ trail, featured = false }: { trail: import("@/lib/trails").Trail; featured?: boolean }) {
  const uses = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      {trail.uses.map((u) => {
        const ic = USE_ICONS[u]
        return ic
          ? <ic.Icon key={u} size={16} aria-label={ic.label} role="img" />
          : <span key={u} style={{ textTransform: "capitalize" }}>{u}</span>
      })}
    </span>
  )

  return (
    <Link href={`/trails/${trail.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: "#FFFFFF",
        border: "1px solid var(--color-ll-border)",
        borderRadius: "6px",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}>
        {/* Trail photo */}
        <div style={{ height: featured ? "160px" : "100px", background: "linear-gradient(135deg, #3D6B4F, #1C3A2A)", position: "relative", display: "flex", alignItems: "flex-end", padding: "0.75rem", overflow: "hidden" }}>
          {trail.image && (
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${trail.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.6 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{
              background: difficultyColor(trail.difficulty),
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.2rem 0.5rem",
              borderRadius: "2px",
            }}>{difficultyLabel(trail.difficulty)}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "rgba(250,250,247,0.9)" }}>{uses}</span>
          </div>
        </div>

        <div style={{ padding: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.25rem" }}>{trail.region}</p>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: featured ? "1.25rem" : "1.05rem", color: "#1C1917", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.2 }}>{trail.name}</h3>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6B6560" }}>{trail.length} mi</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6B6560" }}>{surfaceLabel(trail.surface)}</span>
            {trail.fee && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#9A3412" }}>Fee</span>}
          </div>
          {featured && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#3F3B36", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {trail.description.substring(0, 120)}…
            </p>
          )}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#9A3412" }}>
            Read reviews →
          </span>
        </div>
      </div>
    </Link>
  )
}
