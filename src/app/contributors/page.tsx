import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProfiles } from '@/lib/profiles'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contributors — Southern Legends',
  description:
    'The people who have contributed to Southern Legends — profiles, essays, and stories from Northeast Alabama and the American South.',
  keywords: 'Southern Legends contributors, Alabama writers, Anniston storytellers, Southern writers',
  alternates: { canonical: '/contributors' },
  openGraph: {
    title: 'Contributors — Southern Legends',
    description: 'The people behind the stories.',
    url: `${siteConfig.url}/contributors`,
  },
}

const PERSON_SCHEMA = (profiles: ReturnType<typeof getAllProfiles>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Southern Legends Contributors',
  url: `${siteConfig.url}/contributors`,
  numberOfItems: profiles.length,
  itemListElement: profiles.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Person',
      name: p.frontmatter.name ?? p.frontmatter.title,
      url: `${siteConfig.url}/profiles/${p.slug}`,
      description: p.frontmatter.excerpt,
      image: p.frontmatter.heroImage ? `${siteConfig.url}${p.frontmatter.heroImage}` : undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: p.frontmatter.location,
      },
    },
  })),
})

export default function ContributorsPage() {
  const all = getAllProfiles().filter(p => p.frontmatter.published && !p.frontmatter.aiWritten)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA(all)) }}
      />
      <div style={{ background: '#FAFAF7', color: '#3F3B36', minHeight: '100vh', fontFamily: 'var(--font-heading)' }}>

        {/* Header */}
        <div style={{ background: '#1C1917', color: '#FAFAF7', padding: '7rem 1.5rem 2.5rem' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              <Link href="/" style={{ color: '#CA8A04', textDecoration: 'none' }}>Southern Legends</Link>
              {' '}› Contributors
            </p>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
              The People Behind the Stories
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#c0bab2', lineHeight: 1.75, maxWidth: 560, fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              Profiles, essays, and stories from {all.length} people across Northeast Alabama and the American South.
              These are the voices that make up Southern Legends.
            </p>
          </div>
        </div>

        {/* Profiles grid */}
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {all.map(profile => (
                <Link
                  key={profile.slug}
                  href={`/profiles/${profile.slug}`}
                  style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 10, overflow: 'hidden', textDecoration: 'none', color: '#3F3B36', display: 'block' }}
                >
                  {profile.frontmatter.heroImage && (
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <Image
                        src={profile.frontmatter.heroImage}
                        alt={profile.frontmatter.heroAlt ?? profile.frontmatter.name ?? ''}
                        fill
                        style={{ objectFit: 'cover', objectPosition: profile.frontmatter.heroPosition ?? '50% 20%' }}
                        sizes="280px"
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9A3412', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                      {profile.frontmatter.category} · {profile.frontmatter.location}
                    </p>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {profile.frontmatter.name ?? profile.frontmatter.title}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#6B6560', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-geist-sans, sans-serif)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                      {profile.frontmatter.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Contribute CTA */}
            <div style={{ background: '#1C1917', color: '#FAFAF7', borderRadius: 12, padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Your story belongs here.
              </h2>
              <p style={{ fontSize: '1rem', color: '#c0bab2', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                Southern Legends is built on the people who actually stayed. If you have a story
                worth telling — or know someone who does — nominate them.
              </p>
              <Link href="/nominate" style={{ background: '#9A3412', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 600, fontSize: '1rem', display: 'inline-block' }}>
                Nominate someone →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
