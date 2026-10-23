import { localBusinesses } from "@/lib/city-businesses"

// Inline map — mirrors CATEGORY_AD_MAP in gather/packages/brand/house-ads.ts
const CATEGORY_AD_MAP: Record<string, { text: string; cta: string; url: string; label: string }> = {
  "Church":        { label: "Attune", text: "Daily contemplative practice for pastors. Examen, centering prayer, Lectio Divina.", cta: "Try Attune", url: "https://attuneprayer.app" },
  "Ministry":      { label: "Attune", text: "Daily contemplative practice for pastors. Examen, centering prayer, Lectio Divina.", cta: "Try Attune", url: "https://attuneprayer.app" },
  "Wedding Venue": { label: "The Aisle",   text: "NE Alabama's bridal show. Booths for the next show are open.", cta: "Reserve a booth", url: "https://theaisle.app/vendor" },
  "Wedding":       { label: "The Aisle",   text: "NE Alabama's bridal show. Booths for the next show are open.", cta: "Reserve a booth", url: "https://theaisle.app/vendor" },
  "Florist":       { label: "Petal Studio", text: "Built for florists who are tired of guessing their recipes.", cta: "Try Petal Studio", url: "https://petalstudio.app" },
  "Bridal":        { label: "The Aisle",   text: "NE Alabama's bridal show. Booths for the next show are open.", cta: "Reserve a booth", url: "https://theaisle.app/vendor" },
  "Restaurant":    { label: "MarketDay",   text: "Run a market or vendor event? MarketDay handles the logistics.", cta: "See MarketDay", url: "https://gatherstudio.app/marketday" },
  "Food Vendor":   { label: "MarketDay",   text: "Run a market or vendor event? MarketDay handles the logistics.", cta: "See MarketDay", url: "https://gatherstudio.app/marketday" },
  "Food Truck":    { label: "MarketDay",   text: "Run a market or vendor event? MarketDay handles the logistics.", cta: "See MarketDay", url: "https://gatherstudio.app/marketday" },
  "Mental Health": { label: "Steady",      text: "We built the mental health resource list for NE Alabama.", cta: "See the list", url: "https://gatherstudio.app/steady" },
  "Counseling":    { label: "Steady",      text: "We built the mental health resource list for NE Alabama.", cta: "See the list", url: "https://gatherstudio.app/steady" },
  "Therapist":     { label: "Steady",      text: "We built the mental health resource list for NE Alabama.", cta: "See the list", url: "https://gatherstudio.app/steady" },
}

const DEFAULT_AD = {
  label: "Gather Studio",
  text: "Does your business have a clear message? Find out in 90 minutes.",
  cta: "Book a Blueprint Session",
  url: "https://gatherstudio.app/book",
}

function getDominantCategory(citySlug: string): string | null {
  const bizzes = localBusinesses.filter(
    (b) => b.city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === citySlug
  )
  if (!bizzes.length) return null
  const counts: Record<string, number> = {}
  for (const b of bizzes) {
    if (b.category) counts[b.category] = (counts[b.category] ?? 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

export default function CityHouseAd({ citySlug }: { citySlug: string }) {
  const dominant = getDominantCategory(citySlug)
  const ad = (dominant && CATEGORY_AD_MAP[dominant]) ? CATEGORY_AD_MAP[dominant] : DEFAULT_AD

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(154,108,47,0.15)", borderRadius: "8px", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" as const, margin: "1.5rem 0" }}>
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#9a6c2f", marginBottom: "0.35rem" }}>
          {ad.label}
        </p>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 400, color: "#1a1208" }}>
          {ad.text}
        </p>
      </div>
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 700, background: "#9a6c2f", color: "#F0EDE6", padding: "0.5rem 1.125rem", borderRadius: "4px", textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" as const }}
      >
        {ad.cta} →
      </a>
    </div>
  )
}
