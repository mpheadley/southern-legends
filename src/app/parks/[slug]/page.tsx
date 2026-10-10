"use client"

import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PARKS, getPark, managerLabel, parkDifficultyLabel, parkDifficultyColor } from "@/lib/parks"

type Review = {
  id: string
  name: string
  rating: number
  title: string | null
  body: string
  date_hiked: string | null
  conditions: string | null
  difficulty_felt: string | null
  created_at: string
}

const CONDITIONS = ["Excellent", "Good", "Fair", "Crowded", "Muddy", "Closed/Damaged"]

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} aria-hidden="true" style={{ display: "inline", color: i <= rating ? "#CA8A04" : "#E5E5E0" }} fill={i <= rating ? "#CA8A04" : "none"} />
      ))}
    </span>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ color: i <= (hover || value) ? "#CA8A04" : "#E5E5E0", cursor: "pointer", display: "inline-block" }}
          role="button"
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        ><Star size={28} aria-hidden="true" fill={i <= (hover || value) ? "#CA8A04" : "none"} /></span>
      ))}
    </span>
  )
}

const SEASONS: Array<{ key: "spring" | "summer" | "fall" | "winter"; label: string; color: string }> = [
  { key: "spring", label: "Spring", color: "#3D6B4F" },
  { key: "summer", label: "Summer", color: "#CA8A04" },
  { key: "fall", label: "Fall", color: "#9A3412" },
  { key: "winter", label: "Winter", color: "#4B5563" },
]

export default function ParkPage() {
  const { slug } = useParams<{ slug: string }>()
  const park = getPark(slug)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [planEmail, setPlanEmail] = useState("")
  const [planDone, setPlanDone] = useState(false)

  const [form, setForm] = useState({ name: "", rating: 0, title: "", body: "", date_hiked: "", conditions: "" })

  useEffect(() => {
    if (!slug) return
    fetch(`/api/trails/review?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? [])
        setAvgRating(d.average ?? null)
      })
      .catch(() => {})
  }, [slug])

  if (!park) {
    return (
      <main style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "#1C1917" }}>Park not found</h1>
        <Link href="/parks" style={{ color: "#9A3412", fontFamily: "var(--font-body)" }}>← All Parks</Link>
      </main>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rating === 0) return alert("Please select a rating.")
    if (form.body.length < 20) return alert("Review must be at least 20 characters.")
    setSubmitting(true)
    const res = await fetch("/api/trails/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trail_slug: slug, ...form, difficulty_felt: "" }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
      setShowForm(false)
    } else {
      alert("Something went wrong. Try again.")
    }
  }

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault()
    if (!planEmail) return
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: planEmail, source: `parks-planner-${slug}`, tags: ["parks-guide"] }),
    }).catch(() => {})
    setPlanDone(true)
  }

  const nearby = PARKS.filter((p) => p.slug !== park.slug).slice(0, 4)

  return (
    <main style={{ background: "var(--color-ll-light)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(to bottom, #1C1917, #1C3A2A)", padding: "7.5rem 1.5rem 3rem", position: "relative", overflow: "hidden" }}>
        {park.image && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${park.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />
        )}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/topo-7.png)", backgroundSize: "400px", opacity: 0.07 }} />
        <div style={{ position: "relative", maxWidth: "52rem", margin: "0 auto" }}>
          <Link href="/parks" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(250,250,247,0.6)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← All Parks</Link>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.75rem" }}>{park.location} · {managerLabel(park.managedBy)}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAFAF7", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>{park.name}</h1>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {park.established && <Stat label="Established" value={String(park.established)} />}
            {park.acreage && <Stat label="Size" value={`${park.acreage.toLocaleString()} acres`} />}
            {park.elevationFt && <Stat label="Elevation" value={`${park.elevationFt.toLocaleString()} ft`} />}
            <Stat label="Fee" value={park.fee ? (park.feeNote ?? "Yes") : "Free"} color={park.fee ? "#FCD34D" : "#86EFAC"} />
            {park.hours && <Stat label="Hours" value={park.hours} />}
          </div>

          {avgRating !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Stars rating={Math.round(avgRating)} size={18} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(250,250,247,0.8)" }}>{avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* MattNote — the honest-source moat */}
        {park.mattNote && (
          <section style={{ background: "var(--color-ll-light)", borderLeft: "4px solid #CA8A04", borderRadius: "0 6px 6px 0", padding: "1.75rem", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.75rem" }}>From someone who&apos;s actually been</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", color: "#1C1917", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>{park.mattNote}</p>
            {park.profileSlug && (
              <Link href={`/profiles/${park.profileSlug}`} style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "#9A3412", textDecoration: "none" }}>
                Read the full story →
              </Link>
            )}
          </section>
        )}

        {/* Description + history */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "#3F3B36", lineHeight: 1.8, marginBottom: "1.5rem" }}>{park.description}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#6B6560", lineHeight: 1.75 }}>{park.history}</p>
        </section>

        {/* Highlights */}
        <section style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.75rem", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Highlights</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {park.highlights.map((h, i) => (
              <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#3F3B36", lineHeight: 1.6, display: "flex", gap: "0.6rem" }}>
                <span style={{ color: "#CA8A04", flexShrink: 0 }}>→</span> {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Trails in park */}
        {park.trailsInPark && park.trailsInPark.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Trails in the Park</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {park.trailsInPark.map((t, i) => (
                <div key={i} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "#1C1917", margin: "0 0 0.15rem" }}>{t.name}</p>
                    {t.note && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#6B6560", margin: 0 }}>{t.note}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#3F3B36" }}>{t.length} mi</span>
                    <span style={{ background: parkDifficultyColor(t.difficulty), color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>{parkDifficultyLabel(t.difficulty)}</span>
                  </div>
                </div>
              ))}
            </div>
            {park.trailSlug && (
              <Link href={`/trails/${park.trailSlug}`} style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "#9A3412", textDecoration: "none" }}>
                Full trail guide + reviews →
              </Link>
            )}
          </section>
        )}

        {/* When to go — seasonality */}
        {park.seasonality && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>When to Go</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "0.75rem" }}>
              {SEASONS.map((s) => {
                const note = park.seasonality?.[s.key]
                if (!note) return null
                return (
                  <div key={s.key} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderTop: `3px solid ${s.color}`, borderRadius: "6px", padding: "1.1rem 1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: s.color, marginBottom: "0.4rem" }}>{s.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#3F3B36", lineHeight: 1.55, margin: 0 }}>{note}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Activities + camping */}
        <section style={{ marginBottom: "3rem", display: "grid", gridTemplateColumns: park.camping ? "1fr 1fr" : "1fr", gap: "1rem" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.75rem" }}>Things to Do</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {park.activities.map((a, i) => (
                <span key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#3F3B36", background: "#F0EDE6", padding: "0.3rem 0.7rem", borderRadius: "3px" }}>{a}</span>
              ))}
            </div>
          </div>
          {park.camping && (
            <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.75rem" }}>Camping & Lodging</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#3F3B36", lineHeight: 1.6, margin: 0 }}>{park.camping}</p>
            </div>
          )}
        </section>

        {/* External links */}
        <section style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <a href={park.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#9A3412", border: "1px solid #9A3412", padding: "0.5rem 1rem", borderRadius: "3px", textDecoration: "none" }}>
            Official Site ↗
          </a>
          {park.npsSite && (
            <a href={park.npsSite} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#166534", border: "1px solid #166534", padding: "0.5rem 1rem", borderRadius: "3px", textDecoration: "none" }}>
              NPS.gov ↗
            </a>
          )}
        </section>

        {/* Noccalula tee — per-park woodcut merch (only where real art exists) */}
        {park.slug === "noccalula-falls-park" && (
          <section style={{ background: "#1C1917", borderRadius: "8px", padding: "2rem", marginBottom: "3rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.5rem" }}>Park Woodcut</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "#FAFAF7", fontWeight: 400, marginBottom: "0.5rem" }}>&ldquo;Where the Water Thunders&rdquo;</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(250,250,247,0.7)", lineHeight: 1.6, margin: "0 0 1rem" }}>A hand-woodcut emblem of the falls. Printed on demand, ships direct — one tee, this one park.</p>
              <Link href="/merch" style={{ display: "inline-block", background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", padding: "0.7rem 1.5rem", textDecoration: "none", borderRadius: "3px" }}>See the tee →</Link>
            </div>
          </section>
        )}

        {/* F0 — parks planner email gate */}
        <section style={{ background: "#0A1F12", border: "1px solid #2D4A30", borderRadius: "8px", padding: "2rem", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4ADE80", marginBottom: "0.5rem" }}>Plan the Trip</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "#FAFAF7", fontWeight: 400, marginBottom: "0.75rem" }}>Get the honest park list before you drive.</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(250,250,247,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            A short seasonal note when the falls are running, the leaves are turning, or a park&apos;s worth the drive. NE Alabama first, more parks as I get to them. No spam, unsubscribe anytime.
          </p>
          {!planDone ? (
            <form onSubmit={handlePlan} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input type="email" required value={planEmail} onChange={(e) => setPlanEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: "220px", fontFamily: "var(--font-body)", fontSize: "0.9rem", padding: "0.75rem 1rem", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#FAFAF7", outline: "none" }} />
              <button type="submit" style={{ background: "#16A34A", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", borderRadius: "4px", whiteSpace: "nowrap" }}>Send me the list →</button>
            </form>
          ) : (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#4ADE80", margin: 0 }}>✓ You&apos;re in. Watch your inbox.</p>
          )}
        </section>

        {/* Sponsor slot */}
        <section style={{ border: "1px dashed #CA8A04", borderRadius: "6px", padding: "1.25rem 1.5rem", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.25rem" }}>Sponsor this park page</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#6B6560", margin: 0 }}>Local outfitters, campgrounds, cabins, and tourism boards. $150/mo — seen by every visitor planning a trip here.</p>
          </div>
          <a href={`mailto:matt@gatherstudio.app?subject=Parks Guide Sponsor — ${park.name}`} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "#9A3412", textDecoration: "none", whiteSpace: "nowrap" }}>Get in touch →</a>
        </section>

        {/* Reviews */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.25rem" }}>Visitor Reviews</p>
              {avgRating !== null
                ? <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>{avgRating.toFixed(1)} avg · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                : <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>No reviews yet — be first.</p>}
            </div>
            {!showForm && !submitted && (
              <button onClick={() => setShowForm(true)} style={{ background: "#9A3412", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem 1.25rem", border: "none", cursor: "pointer", borderRadius: "3px" }}>Write a Review</button>
            )}
          </div>

          {submitted && (
            <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#15803D", margin: 0 }}>✓ Review submitted — thank you. It will appear after a quick check.</p>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.75rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1.5rem" }}>Your Review — {park.name}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>Your name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required style={inputStyle} placeholder="First name" />
                </div>
                <div>
                  <label style={labelStyle}>Date visited</label>
                  <input type="date" value={form.date_hiked} onChange={(e) => setForm((f) => ({ ...f, date_hiked: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Rating *</label>
                <StarInput value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Conditions</label>
                <select value={form.conditions} onChange={(e) => setForm((f) => ({ ...f, conditions: e.target.value }))} style={inputStyle}>
                  <option value="">Select…</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Review title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="Optional short title" />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Your review *</label>
                <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} required rows={5} style={{ ...inputStyle, resize: "vertical" }} placeholder="What was it like? Crowds, conditions, tips for others…" />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={submitting} style={{ background: "#9A3412", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", borderRadius: "3px", opacity: submitting ? 0.6 : 1 }}>{submitting ? "Submitting…" : "Submit Review"}</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#6B6560", fontFamily: "var(--font-body)", fontSize: "0.875rem", padding: "0.75rem 1rem", border: "1px solid var(--color-ll-border)", cursor: "pointer", borderRadius: "3px" }}>Cancel</button>
              </div>
            </form>
          )}

          {reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <Stars rating={r.rating} size={14} />
                      {r.title && <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", color: "#1C1917", margin: "0.25rem 0 0" }}>{r.title}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#3F3B36", margin: 0 }}>{r.name}</p>
                      {r.date_hiked && <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "#9B8B7A", margin: "0.15rem 0 0" }}>{r.date_hiked}</p>}
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#3F3B36", lineHeight: 1.75, margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "2.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "#1C1917", marginBottom: "0.5rem" }}>No reviews yet.</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>Be the first to review {park.name}.</p>
            </div>
          )}
        </section>

        {/* Nearby parks + trails cross-link */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Nearby Parks</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {nearby.map((p) => (
              <Link key={p.slug} href={`/parks/${p.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#9A3412", border: "1px solid #9A3412", padding: "0.4rem 0.875rem", borderRadius: "3px", textDecoration: "none" }}>{p.shortName} →</Link>
            ))}
            <Link href="/trails" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#3D6B4F", border: "1px solid #3D6B4F", padding: "0.4rem 0.875rem", borderRadius: "3px", textDecoration: "none" }}>All Trails →</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(250,250,247,0.5)", margin: "0 0 0.15rem" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: color ?? "rgba(250,250,247,0.9)", fontWeight: color ? 700 : 400, margin: 0 }}>{value}</p>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  color: "#1C1917",
  background: "#FAFAF7",
  border: "1px solid var(--color-ll-border)",
  borderRadius: "3px",
  padding: "0.625rem 0.75rem",
  outline: "none",
  marginTop: "0.25rem",
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-label)",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6B6560",
  display: "block",
  marginBottom: "0.25rem",
}
