import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin } from "lucide-react"
import { getBusinessesByCity, getBusinessCities, cityToSlug } from "@/lib/businesses"

export const revalidate = 86400

type Props = { params: Promise<{ city: string }> }

export async function generateStaticParams() {
  const cities = getBusinessCities()
  return cities.map((c) => ({ city: cityToSlug(c) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params
  const cities = getBusinessCities()
  const cityName = cities.find((c) => cityToSlug(c) === citySlug)
  if (!cityName) return {}
  return {
    title: `Businesses in ${cityName}, Alabama — Southern Legends`,
    description: `Local businesses worth knowing in ${cityName}, Alabama — faith communities, food, vendors, and more.`,
    alternates: { canonical: `/businesses/${citySlug}` },
    openGraph: {
      title: `Businesses in ${cityName} — Southern Legends`,
      description: `Local businesses in ${cityName}, Alabama.`,
      url: `/businesses/${citySlug}`,
    },
  }
}

export default async function BusinessesCityPage({ params }: Props) {
  const { city: citySlug } = await params
  const cities = getBusinessCities()
  const cityName = cities.find((c) => cityToSlug(c) === citySlug)
  if (!cityName) notFound()

  const businesses = getBusinessesByCity(citySlug)
  if (businesses.length === 0) notFound()


  // Group by category
  const byCategory: Record<string, typeof businesses> = {}
  for (const b of businesses) {
    const cat = b.frontmatter.businessCategory || "Local Businesses"
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(b)
  }
  const categories = Object.keys(byCategory).sort()

  return (
    <main className="page-light page-top max-w-4xl mx-auto px-4 pb-16">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-ll-text-light mb-2">
          <Link href="/" className="hover:underline">Southern Legends</Link>
          <span>/</span>
          <Link href="/businesses" className="hover:underline">Businesses</Link>
          <span>/</span>
          <span>{cityName}</span>
        </div>
        <h1 className="text-3xl [font-family:var(--font-heading)] font-bold mb-2">{cityName}, Alabama</h1>
        <p className="text-ll-text-light text-sm flex items-center gap-1">
          <MapPin size={14} />
          {businesses.length} businesses worth knowing
          {" · "}
          <Link href={`/places/${citySlug}`} className="underline hover:text-ll-dark">
            City profile
          </Link>
        </p>
      </div>

      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-lg font-semibold mb-4 border-b border-ll-border pb-2">{cat}</h2>
          <div className="space-y-6">
            {byCategory[cat].map((b) => (
              <article key={b.slug} className="group">
                <h3 className="font-medium text-base mb-1">{b.frontmatter.title}</h3>
                <p className="text-sm text-ll-text leading-relaxed">{b.frontmatter.excerpt}</p>
                <div className="mt-2 text-xs text-ll-text-light">
                  {b.frontmatter.tags
                    .filter((t) => t !== "businesses" && t !== citySlug)
                    .map((t) => (
                      <span key={t} className="mr-2 capitalize">{t.replace(/-/g, " ")}</span>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-10 pt-6 border-t border-ll-border text-sm text-ll-text-light flex flex-wrap gap-4">
        <Link href={`/places/${citySlug}`} className="underline hover:text-ll-dark">
          {cityName} city profile →
        </Link>
        <Link href="/businesses" className="underline hover:text-ll-dark">
          All Alabama cities →
        </Link>
        <Link href="/nominate" className="underline hover:text-ll-dark">
          Nominate a business →
        </Link>
      </div>
    </main>
  )
}
