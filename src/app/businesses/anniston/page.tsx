import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ExternalLink } from 'lucide-react'
import { localBusinesses, cityToSlug } from '@/lib/city-businesses'
import { SL_PLACES } from '@/lib/places'
import { getAllProfiles } from '@/lib/profiles'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Anniston, Alabama Businesses — Southern Legends',
  description:
    'Local businesses in Anniston, Alabama — from the directory of 6,818 Alabama businesses curated by Southern Legends. Profiled, vouched for, and worth knowing.',
  keywords: 'Anniston Alabama businesses, Anniston local directory, Anniston AL businesses, Anniston small business',
  alternates: { canonical: '/businesses/anniston' },
  openGraph: {
    title: 'Anniston Businesses — Southern Legends',
    description: 'Local businesses in Anniston, Alabama, curated by Southern Legends.',
    url: `${siteConfig.url}/businesses/anniston`,
  },
}

const CALHOUN_CITIES = ['Anniston', 'Oxford', 'Jacksonville', 'Piedmont', 'Attalla', 'Alexandria', 'Ohatchee', 'Glencoe', 'Weaver', 'Heflin', 'Rainbow City']

const VERTICALS: Record<string, string> = {
  Florals: '#d97706',
  Wedding: '#be185d',
  Photography: '#7c3aed',
  'Food & Catering': '#b45309',
  Music: '#0369a1',
  'Market & Food': '#15803d',
  Church: '#4f46e5',
  'Local Business': '#6b7280',
  'Beauty & Wellness': '#db2777',
}

export default function AnnistonBusinessesPage() {
  const allProfiles = getAllProfiles()
  const annistonBizzes = localBusinesses.filter(b => b.city === 'Anniston')
  const featured = SL_PLACES.filter(p => p.city === 'Anniston')

  // Match businesses to profiles
  const withStory = annistonBizzes.filter(biz =>
    allProfiles.some(p =>
      p.frontmatter.title?.toLowerCase().includes(biz.name.toLowerCase().split(' ')[0]) ||
      biz.slug === p.slug
    )
  )

  const byVertical: Record<string, typeof annistonBizzes> = {}
  for (const biz of annistonBizzes) {
    const v = biz.vertical || 'Local Business'
    if (!byVertical[v]) byVertical[v] = []
    byVertical[v].push(biz)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Anniston, Alabama Local Business Directory',
    description: 'Businesses in Anniston, AL curated by Southern Legends',
    url: `${siteConfig.url}/businesses/anniston`,
    numberOfItems: annistonBizzes.length,
    itemListElement: annistonBizzes.slice(0, 50).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: b.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Anniston',
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
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              <Link href="/" style={{ color: '#CA8A04', textDecoration: 'none' }}>Southern Legends</Link>
              {' '}›{' '}
              <Link href="/businesses" style={{ color: '#CA8A04', textDecoration: 'none' }}>Businesses</Link>
              {' '}› Anniston
            </p>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
              Anniston, Alabama
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#c0bab2', lineHeight: 1.75, maxWidth: 560, marginBottom: '1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              {annistonBizzes.length} businesses in the Southern Legends directory. {featured.length > 0 && `${featured.length} profiled with a story behind them.`}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/places/anniston" style={{ color: '#CA8A04', fontSize: '0.9rem', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                Anniston city page →
              </Link>
              <Link href="/businesses/calhoun-county" style={{ color: '#CA8A04', fontSize: '0.9rem', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                All of Calhoun County →
              </Link>
            </div>
          </div>
        </div>

        {/* SL-profiled businesses */}
        {featured.length > 0 && (
          <section style={{ padding: '3rem 1.5rem', borderBottom: '1px solid #E5E5E0' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Profiled by Southern Legends</h2>
              <p style={{ fontSize: '0.9rem', color: '#6B6560', marginBottom: '1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                Businesses we have written about — the story behind the sign.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {featured.map(biz => (
                  <div key={biz.id} style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 8, padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9A3412', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                      {biz.category}
                    </p>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{biz.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B6560', lineHeight: 1.6, marginBottom: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                      {biz.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {biz.story && (
                        <Link href={`/profiles/${biz.story}`} style={{ fontSize: '0.8rem', color: '#9A3412', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                          Read the story →
                        </Link>
                      )}
                      {biz.website && (
                        <a href={biz.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#CA8A04', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                          Visit site ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* By vertical */}
        {Object.entries(byVertical)
          .filter(([, bizzes]) => bizzes.length > 0)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([vertical, bizzes]) => (
            <section key={vertical} style={{ padding: '2.5rem 1.5rem', borderBottom: '1px solid #E5E5E0' }}>
              <div style={{ maxWidth: 860, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: VERTICALS[vertical] ?? '#6b7280', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    {vertical}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#9A9690', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>{bizzes.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {bizzes.map(biz => (
                    <div key={biz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem', background: '#fff', borderRadius: 6, border: '1px solid #E5E5E0', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.15rem', fontSize: '0.95rem' }}>{biz.name}</p>
                        {biz.address && (
                          <p style={{ fontSize: '0.78rem', color: '#9A9690', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-geist-sans, sans-serif)', margin: 0 }}>
                            <MapPin size={11} />{biz.address.replace(', USA', '')}
                          </p>
                        )}
                      </div>
                      {biz.website && (
                        <a href={biz.website} target="_blank" rel="noopener noreferrer" style={{ color: '#CA8A04', flexShrink: 0 }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

        {/* Footer CTAs */}
        <section style={{ padding: '3rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/nominate" style={{ background: '#9A3412', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 600, fontSize: '0.9rem' }}>
              Nominate a business
            </Link>
            <Link href="/places/anniston" style={{ color: '#9A3412', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '0.9rem' }}>
              See all Anniston stories →
            </Link>
            <Link href="/businesses/calhoun-county" style={{ color: '#9A3412', textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontSize: '0.9rem' }}>
              All Calhoun County →
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
