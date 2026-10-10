import type { Metadata } from 'next'
import Link from 'next/link'
import { localBusinesses, cityToSlug } from '@/lib/city-businesses'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Calhoun County, Alabama Business Directory — Southern Legends',
  description:
    'The full Calhoun County, Alabama business directory — 457 businesses across Anniston, Oxford, Jacksonville, Attalla, Rainbow City, and surrounding communities, curated by Southern Legends.',
  keywords:
    'Calhoun County Alabama businesses, Calhoun County business directory, Anniston Oxford Jacksonville AL businesses, Northeast Alabama business directory',
  alternates: { canonical: '/businesses/calhoun-county' },
  openGraph: {
    title: 'Calhoun County Business Directory — Southern Legends',
    description: '457 businesses across Anniston, Oxford, Jacksonville, and all of Calhoun County, Alabama.',
    url: `${siteConfig.url}/businesses/calhoun-county`,
  },
}

const CALHOUN_CITIES = ['Anniston', 'Oxford', 'Jacksonville', 'Attalla', 'Rainbow City', 'Alexandria', 'Ohatchee', 'Glencoe', 'Weaver', 'Heflin', 'Piedmont']

export default function CalhounCountyBusinessesPage() {
  const countyBizzes = localBusinesses.filter(b => CALHOUN_CITIES.includes(b.city))
  const byCity: Record<string, typeof countyBizzes> = {}
  for (const biz of countyBizzes) {
    if (!byCity[biz.city]) byCity[biz.city] = []
    byCity[biz.city].push(biz)
  }

  const cityOrder = CALHOUN_CITIES.filter(c => byCity[c]?.length > 0)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Calhoun County, Alabama Business Directory',
    description: 'Businesses across Calhoun County, AL curated by Southern Legends',
    url: `${siteConfig.url}/businesses/calhoun-county`,
    numberOfItems: countyBizzes.length,
    itemListElement: countyBizzes.slice(0, 100).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: b.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: b.city,
          addressRegion: 'AL',
          addressCountry: 'US',
        },
        url: b.website || undefined,
        telephone: b.phone || undefined,
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ background: '#FAFAF7', color: '#3F3B36', minHeight: '100vh', fontFamily: 'var(--font-heading)' }}>

        {/* Header */}
        <div style={{ background: '#1C1917', color: '#FAFAF7', padding: '7rem 1.5rem 2.5rem' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              <Link href="/" style={{ color: '#CA8A04', textDecoration: 'none' }}>Southern Legends</Link>
              {' '}›{' '}
              <Link href="/businesses" style={{ color: '#CA8A04', textDecoration: 'none' }}>Businesses</Link>
              {' '}› Calhoun County
            </p>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
              Calhoun County, Alabama
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#c0bab2', lineHeight: 1.75, maxWidth: 580, marginBottom: '1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              {countyBizzes.length} businesses across {cityOrder.length} communities in Calhoun County.
            </p>

            {/* City nav */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {cityOrder.map(city => (
                <a key={city} href={`#${cityToSlug(city)}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#c0bab2', padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                  {city} ({byCity[city]?.length ?? 0})
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Per-city sections */}
        {cityOrder.map(city => {
          const bizzes = byCity[city] ?? []
          const slug = cityToSlug(city)
          return (
            <section key={city} id={slug} style={{ padding: '2.5rem 1.5rem', borderBottom: '1px solid #E5E5E0' }}>
              <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{city}</h2>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9A9690', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>{bizzes.length} listed</span>
                    <Link href={`/places/${slug}`} style={{ fontSize: '0.8rem', color: '#CA8A04', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                      City page →
                    </Link>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem' }}>
                  {bizzes.map(biz => (
                    <div key={biz.id} style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 6, padding: '0.75rem 1rem' }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.1rem', fontSize: '0.875rem', lineHeight: 1.3 }}>{biz.name}</p>
                      {biz.category && (
                        <p style={{ fontSize: '0.72rem', color: '#9A3412', margin: 0, fontFamily: 'var(--font-geist-sans, sans-serif)' }}>{biz.category}</p>
                      )}
                      {biz.phone && (
                        <p style={{ fontSize: '0.72rem', color: '#9A9690', margin: '0.25rem 0 0', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                          <a href={`tel:${biz.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{biz.phone}</a>
                        </p>
                      )}
                      {biz.website && (
                        <a href={biz.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#CA8A04', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                          website ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* Footer */}
        <section style={{ padding: '3rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/nominate" style={{ background: '#9A3412', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 600, fontSize: '0.9rem' }}>
              Nominate a business
            </Link>
            <Link href="/businesses/anniston" style={{ color: '#9A3412', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '0.9rem' }}>
              Anniston only →
            </Link>
            <Link href="/places" style={{ color: '#9A3412', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '0.9rem' }}>
              All Alabama cities →
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
