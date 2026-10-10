"use client"

import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { TRAILS, getTrail, difficultyLabel, difficultyColor, surfaceLabel } from "@/lib/trails"

const CLT_ESSAYS = [
  {
    slug: "chief-ladiga-trail",
    title: "Chief Ladiga, 1832",
    subtitle: "Ladiga's Story & Ours",
    excerpt: "I used to call it 'la-dee-ga.' I didn't know how else to say it. I also didn't know whose land I was running on.",
    image: "/images/journal/chief-ladiga-trail-snow-2017.webp",
  },
  {
    slug: "the-trail-at-night",
    title: "The Trail at Night",
    subtitle: "Broken Ground",
    excerpt: "For months I walked the Ladiga Trail at one and two in the morning, talking to an AI, losing the farm right beside it.",
    image: "/images/journal/the-trail-at-night.webp",
  },
]

const CLT_MERCH = [
  { id: "clt-trail-hat", name: "Chief Ladiga Trail Hat", price: 32, note: "Navy trucker, white embroidery" },
  { id: "clt-la-dee-ga", name: '"La-dee-ga" Tee', price: 28, note: "Heather gray · Sm–2XL" },
  { id: "clt-trail-sticker", name: "CLT Trail Sticker", price: 5, note: "Waterproof · 3-inch die cut" },
]

const CLT_BACKER_TIERS = [
  { label: "Trail Friend", amount: 10, perks: "Name in the annual trail report" },
  { label: "Trailhead Sponsor", amount: 25, perks: "Name in report + digital trail map" },
  { label: "Founding Backer", amount: 100, perks: "Name on trail signage + all above" },
  { label: "Bicentennial Patron", amount: 500, perks: "Named in the 2032 reckoning project + all above" },
]

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

const CONDITIONS = ["Excellent", "Good", "Fair", "Muddy", "Icy", "Closed/Damaged"]
const DIFFICULTY_FELT = ["Easier than expected", "As expected", "Harder than expected"]

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} aria-hidden="true" style={{ display: "inline", color: i <= rating ? "#CA8A04" : "#E5E5E0" }} fill={i <= rating ? "#CA8A04" : "none"} />
      ))}
    </span>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
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

export default function TrailPage() {
  const { slug } = useParams<{ slug: string }>()
  const trail = getTrail(slug)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [supportAmount, setSupportAmount] = useState(25)
  const [news, setNews] = useState<Array<{title:string;url:string;source:string;date?:string}>>([])
  const [backerEmail, setBackerEmail] = useState("")
  const [backerTier, setBackerTier] = useState(25)
  const [backerSubmitting, setBackerSubmitting] = useState(false)
  const [backerDone, setBackerDone] = useState(false)



  const [form, setForm] = useState({
    name: "", rating: 0, title: "", body: "",
    date_hiked: "", conditions: "", difficulty_felt: "",
  })

  useEffect(() => {
    if (!slug) return
    fetch(`/api/trails/review?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        setReviews(d.reviews ?? [])
        setAvgRating(d.average ?? null)
      })
    fetch(`/api/trails/news?slug=${slug}`)
      .then(r => r.json())
      .then(d => setNews(d.items ?? []))
  }, [slug])

  if (!trail) {
    return (
      <main style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "#1C1917" }}>Trail not found</h1>
        <Link href="/trails" style={{ color: "#9A3412", fontFamily: "var(--font-body)" }}>← All Trails</Link>
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
      body: JSON.stringify({ trail_slug: slug, ...form }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
      setShowForm(false)
    } else {
      alert("Something went wrong. Try again.")
    }
  }

  const handleSupport = async () => {
    const res = await fetch("/api/trails/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trail_slug: slug, trail_name: trail.name, amount: supportAmount }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const handleBacker = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!backerEmail) return
    setBackerSubmitting(true)
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: backerEmail, source: `clt-backer-${backerTier}`, tags: ["clt-backer"] }),
    })
    setBackerSubmitting(false)
    setBackerDone(true)
  }

  const handleMerchSupport = async (amount: number, name: string) => {
    const res = await fetch("/api/trails/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trail_slug: "chief-ladiga-trail", trail_name: "Chief Ladiga Trail — " + name, amount }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <main style={{ background: "var(--color-ll-light)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(to bottom, #1C1917, #2D1A0A)", padding: "7.5rem 1.5rem 3rem", position: "relative", overflow: "hidden" }}>
        {trail.image && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${trail.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />
        )}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/topo-7.png)", backgroundSize: "400px", opacity: 0.07 }} />
        <div style={{ position: "relative", maxWidth: "52rem", margin: "0 auto" }}>
          <Link href="/trails" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(250,250,247,0.6)", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← All Trails</Link>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.75rem" }}>{trail.region} · {trail.state}</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAFAF7", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>{trail.name}</h1>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Stat label="Length" value={`${trail.length} mi${trail.lengthNote ? ` (${trail.lengthNote})` : ""}`} />
            <Stat label="Difficulty" value={difficultyLabel(trail.difficulty)} color={difficultyColor(trail.difficulty)} />
            <Stat label="Surface" value={surfaceLabel(trail.surface)} />
            <Stat label="Uses" value={trail.uses.join(", ")} />
            {trail.elevationGain && <Stat label="Elevation Gain" value={`${trail.elevationGain.toLocaleString()} ft`} />}
            <Stat label="Dogs" value={trail.dogs ? "Allowed" : "No"} />
            <Stat label="Fee" value={trail.fee ? (trail.feeNote ?? "Yes") : "Free"} />
          </div>

          {avgRating !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Stars rating={Math.round(avgRating)} size={18} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(250,250,247,0.8)" }}>
                {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Description */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "#3F3B36", lineHeight: 1.8, marginBottom: "1.5rem" }}>{trail.description}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#6B6560", lineHeight: 1.75 }}>{trail.history}</p>
        </section>

        {/* Highlights */}
        <section style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.75rem", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Highlights</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {trail.highlights.map((h, i) => (
              <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#3F3B36", lineHeight: 1.6, display: "flex", gap: "0.6rem" }}>
                <span style={{ color: "#CA8A04", flexShrink: 0 }}>→</span> {h}
              </li>
            ))}
          </ul>
        </section>

        {/* External links */}
        <section style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {trail.website && (
            <a href={trail.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#9A3412", border: "1px solid #9A3412", padding: "0.5rem 1rem", borderRadius: "3px", textDecoration: "none" }}>
              Official Site ↗
            </a>
          )}
          {trail.alltrailsUrl && (
            <a href={trail.alltrailsUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#3D6B4F", border: "1px solid #3D6B4F", padding: "0.5rem 1rem", borderRadius: "3px", textDecoration: "none" }}>
              AllTrails Map ↗
            </a>
          )}
        </section>

        {/* CLT Support widget */}
        {trail.slug === "chief-ladiga-trail" && (
          <section id="support" style={{ background: "#1C1917", borderRadius: "8px", padding: "2rem", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.5rem" }}>Support Chief Ladiga Trail</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "#FAFAF7", fontWeight: 400, marginBottom: "0.75rem" }}>Keep the trail open.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(250,250,247,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              CLT is volunteer-maintained and community-funded. Your contribution supports trail repairs, trailhead improvements, and new connections. Southern Legends keeps a 15% platform fee; 85% goes directly to CLT.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {[10, 25, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setSupportAmount(amt)}
                  style={{
                    padding: "0.5rem 1.25rem",
                    background: supportAmount === amt ? "#CA8A04" : "transparent",
                    color: supportAmount === amt ? "#1C1917" : "#FAFAF7",
                    border: `1px solid ${supportAmount === amt ? "#CA8A04" : "rgba(250,250,247,0.3)"}`,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    borderRadius: "3px",
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button
              onClick={handleSupport}
              style={{ background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9375rem", padding: "0.875rem 2rem", border: "none", cursor: "pointer", borderRadius: "3px" }}
            >
              Support CLT — ${supportAmount}
            </button>
          </section>
        )}

        {/* CLT Founding Backer — Kickstarter-style */}
        {trail.slug === "chief-ladiga-trail" && (
          <section style={{ background: "#0A1F12", border: "1px solid #2D4A30", borderRadius: "8px", padding: "2rem", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4ADE80", marginBottom: "0.5rem" }}>Founding Backer — 2026</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "#FAFAF7", fontWeight: 400, marginBottom: "0.75rem" }}>Be part of the reckoning.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(250,250,247,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              In 2032, the Chief Ladiga Trail turns 200 years from the treaty that removed Ladiga's people. I{"'"}m writing the book. The trail deserves backers who know its name. Choose a tier — your donation goes to CLT (85%) and the research project (15%).
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {CLT_BACKER_TIERS.map(tier => (
                <button
                  key={tier.amount}
                  onClick={() => setBackerTier(tier.amount)}
                  style={{
                    background: backerTier === tier.amount ? "#16A34A" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${backerTier === tier.amount ? "#16A34A" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: "6px",
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, color: "#FAFAF7", margin: "0 0 0.25rem" }}>{tier.label}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: backerTier === tier.amount ? "#BBF7D0" : "#CA8A04", fontWeight: 700, margin: "0 0 0.4rem" }}>${tier.amount}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "rgba(250,250,247,0.6)", margin: 0 }}>{tier.perks}</p>
                </button>
              ))}
            </div>
            {!backerDone ? (
              <form onSubmit={handleBacker} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="email"
                  required
                  value={backerEmail}
                  onChange={e => setBackerEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: "200px", fontFamily: "var(--font-body)", fontSize: "0.9rem", padding: "0.75rem 1rem", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#FAFAF7", outline: "none" }}
                />
                <button
                  type="submit"
                  disabled={backerSubmitting}
                  onClick={async (e) => {
                    e.preventDefault()
                    if (!backerEmail) return
                    setBackerSubmitting(true)
                    await fetch("/api/subscribe", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: backerEmail, source: `clt-backer-${backerTier}`, tags: ["clt-backer"] }),
                    })
                    const res = await fetch("/api/trails/support", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ trail_slug: "chief-ladiga-trail", trail_name: `CLT Founding Backer — ${CLT_BACKER_TIERS.find(t=>t.amount===backerTier)?.label}`, amount: backerTier }),
                    })
                    const { url } = await res.json()
                    setBackerSubmitting(false)
                    if (url) window.location.href = url
                    else setBackerDone(true)
                  }}
                  style={{ background: "#16A34A", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", borderRadius: "4px", whiteSpace: "nowrap", opacity: backerSubmitting ? 0.6 : 1 }}
                >
                  {backerSubmitting ? "Processing…" : `Back at $${backerTier} →`}
                </button>
              </form>
            ) : (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#4ADE80" }}>✓ You{"'"}re in. Watch your inbox.</p>
            )}
          </section>
        )}

        {/* CLT From the Journal */}
        {trail.slug === "chief-ladiga-trail" && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>From the Journal</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {CLT_ESSAYS.map(essay => (
                <Link key={essay.slug} href={`/essays/${essay.slug}`} style={{ display: "block", textDecoration: "none", background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ height: "160px", backgroundImage: `url(${essay.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div style={{ padding: "1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.4rem" }}>{essay.subtitle}</p>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#1C1917", marginBottom: "0.5rem" }}>{essay.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#6B6560", lineHeight: 1.6, margin: 0 }}>{essay.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CLT Merch */}
        {trail.slug === "chief-ladiga-trail" && (
          <section style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412" }}>Trail Gear</p>
              <Link href="/merch" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#9A3412", textDecoration: "none" }}>All merch →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {CLT_MERCH.map(item => (
                <div key={item.id} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "#1C1917", marginBottom: "0.25rem" }}>{item.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#9B8B7A", marginBottom: "0.75rem" }}>{item.note}</p>
                  <button
                    onClick={() => handleMerchSupport(item.price, item.name)}
                    style={{ width: "100%", background: "#9A3412", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", padding: "0.5rem", border: "none", cursor: "pointer", borderRadius: "3px" }}
                  >
                    ${item.price} — Order
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#9B8B7A", marginTop: "0.75rem" }}>Orders fulfilled via Southern Legends. Printed on demand, ships direct.</p>
          </section>
        )}

        {/* CLT Products — Chapbook + SaaS */}
        {trail.slug === "chief-ladiga-trail" && (
          <section style={{ background: "var(--color-ll-light)", borderRadius: "8px", padding: "1.75rem", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Products</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {/* Chapbook */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.4rem" }}>Digital Chapbook</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#1C1917", marginBottom: "0.5rem" }}>La-dee-ga: Three Essays</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#6B6560", lineHeight: 1.6, marginBottom: "1rem" }}>Chief Ladiga, 1832 + The Trail at Night + a new introduction. The seed of the 2030 book. $4.99 PDF — instant delivery.</p>
                <button
                  onClick={() => handleMerchSupport(4.99, "La-dee-ga Chapbook")}
                  style={{ width: "100%", background: "#CA8A04", color: "#1C1917", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem", border: "none", cursor: "pointer", borderRadius: "3px" }}
                >
                  Get the Chapbook — $4.99
                </button>
              </div>
              {/* SaaS */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#3D6B4F", marginBottom: "0.4rem" }}>Coming — Trail Tools</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#1C1917", marginBottom: "0.5rem" }}>CLT Conditions Reporter</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#6B6560", lineHeight: 1.6, marginBottom: "1rem" }}>Real-time trail conditions, volunteer coordination, and event calendar — embeddable on chiefladiga.com. Built for trail orgs.</p>
                <a
                  href="mailto:matt@gatherstudio.app?subject=CLT Trail Tools — Interest"
                  style={{ display: "block", width: "100%", background: "transparent", color: "#3D6B4F", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem", border: "1px solid #3D6B4F", borderRadius: "3px", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}
                >
                  Notify me when it{"'"}s ready
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Sponsor slot */}
        <section style={{ border: "1px dashed #CA8A04", borderRadius: "6px", padding: "1.25rem 1.5rem", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#CA8A04", marginBottom: "0.25rem" }}>Sponsor this trail page</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#6B6560", margin: 0 }}>Local outfitters, gear shops, and trail-adjacent businesses. $75/mo. Seen by every visitor to this page.</p>
          </div>
          <a href="mailto:matt@gatherstudio.app?subject=Trail Sponsor" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "#9A3412", textDecoration: "none", whiteSpace: "nowrap" }}>Get in touch →</a>
        </section>

        {/* Reviews */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "0.25rem" }}>Trail Reviews</p>
              {avgRating !== null
                ? <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>{avgRating.toFixed(1)} avg · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                : <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>No reviews yet — be first.</p>
              }
            </div>
            {!showForm && !submitted && (
              <button
                onClick={() => setShowForm(true)}
                style={{ background: "#9A3412", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem 1.25rem", border: "none", cursor: "pointer", borderRadius: "3px" }}
              >
                Write a Review
              </button>
            )}
          </div>

          {submitted && (
            <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#15803D", margin: 0 }}>
                ✓ Review submitted — thank you. It will appear after a quick check.
              </p>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "1.75rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1.5rem" }}>Your Review — {trail.name}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <Field label="Your name *">
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required style={inputStyle} placeholder="First name or trail name" />
                </Field>
                <Field label="Date hiked">
                  <input type="date" value={form.date_hiked} onChange={e => setForm(f => ({...f, date_hiked: e.target.value}))} style={inputStyle} />
                </Field>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Rating *</label>
                <StarInput value={form.rating} onChange={r => setForm(f => ({...f, rating: r}))} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <Field label="Trail conditions">
                  <select value={form.conditions} onChange={e => setForm(f => ({...f, conditions: e.target.value}))} style={inputStyle}>
                    <option value="">Select…</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty felt">
                  <select value={form.difficulty_felt} onChange={e => setForm(f => ({...f, difficulty_felt: e.target.value}))} style={inputStyle}>
                    <option value="">Select…</option>
                    {DIFFICULTY_FELT.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Review title">
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} style={inputStyle} placeholder="Optional short title" />
              </Field>
              <div style={{ marginTop: "1.25rem", marginBottom: "1.5rem" }}>
                <Field label="Your review *">
                  <textarea
                    value={form.body}
                    onChange={e => setForm(f => ({...f, body: e.target.value}))}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="What was the trail like? Conditions, highlights, tips for others…"
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={submitting} style={{ background: "#9A3412", color: "#FAFAF7", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", borderRadius: "3px", opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#6B6560", fontFamily: "var(--font-body)", fontSize: "0.875rem", padding: "0.75rem 1rem", border: "1px solid var(--color-ll-border)", cursor: "pointer", borderRadius: "3px" }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map(r => (
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
                  {(r.conditions || r.difficulty_felt) && (
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      {r.conditions && <Tag>{r.conditions}</Tag>}
                      {r.difficulty_felt && <Tag>{r.difficulty_felt}</Tag>}
                    </div>
                  )}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "#3F3B36", lineHeight: 1.75, margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "2.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "#1C1917", marginBottom: "0.5rem" }}>No reviews yet.</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#6B6560" }}>Be the first to review {trail.name}.</p>
            </div>
          )}
        </section>

        {/* Trail news */}
        {news.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Trail News</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {news.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", background: "#FFFFFF", border: "1px solid var(--color-ll-border)", borderRadius: "6px", padding: "0.875rem 1rem", textDecoration: "none" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "#1C1917", marginBottom: "0.25rem" }}>{item.title}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6B6560" }}>{item.source}{item.date ? ` · ${item.date}` : ""}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related trails */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A3412", marginBottom: "1rem" }}>Nearby Trails</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {TRAILS.filter(t => t.slug !== trail.slug).slice(0, 4).map(t => (
              <Link key={t.slug} href={`/trails/${t.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "#9A3412", border: "1px solid #9A3412", padding: "0.4rem 0.875rem", borderRadius: "3px", textDecoration: "none" }}>
                {t.shortName} →
              </Link>
            ))}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6560", background: "#F0EDE6", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>{children}</span>
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
