import type { Metadata } from "next"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { getBusinessCities, getAllBusinesses, getBusinessesByCity, cityToSlug } from "@/lib/businesses"

export const metadata: Metadata = {
  title: "Businesses Worth Knowing — Southern Legends",
  description:
    "Local Alabama businesses worth knowing, city by city. From faith communities and food trucks to wedding vendors and market producers.",
  alternates: { canonical: "/businesses" },
  openGraph: {
    title: "Businesses Worth Knowing — Southern Legends",
    description: "Local Alabama businesses, city by city.",
    url: "/businesses",
  },
}

export const revalidate = 86400

export default function BusinessesIndexPage() {
  // Only list cities whose /businesses/[city] page actually renders (audit C-10:
  // e.g. "Anniston area" had no matching tag and 404'd)
  const cities = getBusinessCities().filter((c) => getBusinessesByCity(cityToSlug(c)).length > 0)
  const all = getAllBusinesses()
  const totalCount = all.length

  // Count per city
  const cityCount: Record<string, number> = {}
  for (const b of all) {
    const c = b.frontmatter.businessCity
    cityCount[c] = (cityCount[c] || 0) + 1
  }

  return (
    <main className="page-light page-top max-w-4xl mx-auto px-4 pb-16">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-ll-text-light mb-2">
          <Link href="/" className="hover:underline">Southern Legends</Link>
          <span>/</span>
          <span>Businesses</span>
        </div>
        <h1 className="text-3xl [font-family:var(--font-heading)] font-bold mb-3">Businesses Worth Knowing</h1>
        <p className="text-ll-text max-w-xl">
          {totalCount.toLocaleString()} Alabama businesses, city by city — churches, food trucks,
          wedding vendors, market producers, and the shops that keep a town breathing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cities.map((city) => {
          const slug = cityToSlug(city)
          const count = cityCount[city] || 0
          return (
            <Link
              key={city}
              href={`/businesses/${slug}`}
              className="flex items-center justify-between border border-ll-border rounded-lg px-4 py-3 hover:bg-ll-warm transition-colors"
            >
              <span className="font-medium text-sm">{city}</span>
              <span className="text-xs text-ll-text-light">{count}</span>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-ll-border text-sm text-ll-text-light">
        <p>
          Sourced from Gather Circle — Alabama's business directory for local communities.{" "}
          <Link href="/places" className="underline hover:text-ll-dark">
            Browse by city
          </Link>{" "}
          or{" "}
          <Link href="/nominate" className="underline hover:text-ll-dark">
            nominate a business
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
