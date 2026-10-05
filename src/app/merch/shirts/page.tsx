'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MERCH, MerchItem } from '@/lib/merch'

const FW_URLS: Record<string, string> = {
  'pv-raiders-shirt':       'https://matt-headley-shop.fourthwall.com/products/pv-raiders-xc-pirate-tee',
  'david-dennis-shirt':     'https://matt-headley-shop.fourthwall.com/products/freedomriders-anniston-1961',
  'bloom-bar-tee':          'https://matt-headley-shop.fourthwall.com/products/bloom-bar-tee',
  'model-city-shirt':       'https://matt-headley-shop.fourthwall.com/products/the-model-city-anniston-alabama',
  'model-city-shirt-light': 'https://matt-headley-shop.fourthwall.com/products/the-model-city-anniston-alabama-light-version',
  'i-contain-multitudes':   'https://matt-headley-shop.fourthwall.com/products/i-contain-multitudes',
  'bipolar-proud':          'https://matt-headley-shop.fourthwall.com/products/bipolar-proud',
  'still-here':             'https://matt-headley-shop.fourthwall.com/products/still-here',
  'clt-shirt':              'https://matt-headley-shop.fourthwall.com/products/chief-ladiga-trail',
}

const COLLECTIONS: { label: string; desc: string; ids: string[] }[] = [
  {
    label: 'On Fourthwall — Order Now',
    desc: 'Ships to your door. All sizes. Multiple colorways.',
    ids: [
      'pv-raiders-shirt',
      'david-dennis-shirt',
      'model-city-shirt',
      'model-city-shirt-light',
      'i-contain-multitudes',
      'bipolar-proud',
      'still-here',
      'clt-shirt',
      'bloom-bar-tee',
    ],
  },
  {
    label: 'Local & At Events',
    desc: 'Available at shows, events, and select pop-ups.',
    ids: [
      'freedom-riders-shirt',
      'blossom-decay-shirt',
      'blossom-decay-roses-shirt',
      'blossom-decay-sugar-shirt',
      'clt-hike-explore-shirt',
      'cheaha-tower-shirt',
      'cheaha-skyway-shirt',
      'lickskillet-premium-shirt',
      'pinhoti-shirt',
      'noccalula-falls-shirt',
      'noccalula-water-thunders-shirt',
      'fort-mcclellan-shirt',
      'neuro-spicy-nutrition-shirt',
      'cheshire-shirt',
      'ecclesia-stone-shirt',
    ],
  },
]

function ShirtCard({ item }: { item: MerchItem }) {
  const [hovered, setHovered] = useState(false)
  const fwUrl = FW_URLS[item.id]
  const showBack = hovered && item.photoBack

  return (
    <div style={{
      background: '#111',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.2s',
    }}>
      {/* Image */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', aspectRatio: '1/1', background: '#1a1a1a', overflow: 'hidden', cursor: 'pointer' }}
      >
        <img
          src={showBack ? item.photoBack : item.photo}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.25s', display: 'block' }}
        />
        {item.badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: item.badgeColor ?? '#7a5c1e',
            color: '#fff',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 4,
            fontFamily: 'var(--font-body)',
          }}>
            {item.badge}
          </span>
        )}
        {item.photoBack && (
          <span style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.7)',
            fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase',
            padding: '2px 6px', borderRadius: 3,
            fontFamily: 'var(--font-body)',
          }}>
            {hovered ? 'Back' : 'Hover →'}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 400,
            color: '#f5f0e8', lineHeight: 1.2, marginBottom: 4,
          }}>
            {item.name}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#9a8a7a', lineHeight: 1.4 }}>
            {item.tagline}
          </p>
          {item.sub && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#6b5c50', marginTop: 3 }}>
              {item.sub}
            </p>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#f5f0e8' }}>
            ${item.price}
          </span>
          {fwUrl ? (
            <a
              href={fwUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#9a6c2f',
                color: '#f5f0e8',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '6px 14px',
                borderRadius: 5,
                textDecoration: 'none',
              }}
            >
              Buy →
            </a>
          ) : item.available ? (
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: '#4ade80', fontWeight: 700, letterSpacing: '0.05em',
            }}>
              At events
            </span>
          ) : (
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: '#6b7280', fontWeight: 700, letterSpacing: '0.05em',
            }}>
              Coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShirtsPage() {
  const byId = Object.fromEntries(MERCH.map(m => [m.id, m]))
  const shirts = MERCH.filter(m => m.category === 'shirt')
  const shirtIds = new Set(shirts.map(m => m.id))

  const collectioned = new Set<string>()
  COLLECTIONS.forEach(c => c.ids.forEach(id => collectioned.add(id)))

  const uncollectioned = shirts.filter(m => !collectioned.has(m.id) && m.available)

  return (
    <main id="main-content" style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f5f0e8' }}>

      {/* Header */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: 'clamp(80px, 10vw, 120px) 24px 48px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9a6c2f', marginBottom: 16,
        }}>
          Southern Legends · Shirts
        </p>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          fontWeight: 400, color: '#f5f0e8', lineHeight: 1.05, marginBottom: 20,
        }}>
          Wear the Story
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#9a8a7a',
          maxWidth: '42rem', lineHeight: 1.65,
        }}>
          Every design is a chapter. Northeast Alabama history, mental health, local
          landmarks, and the people who built this place. Wear it, give it, start a conversation.
        </p>
      </div>

      {/* Collections */}
      {COLLECTIONS.map((col) => {
        const items = col.ids.map(id => byId[id]).filter(Boolean)
        if (!items.length) return null
        return (
          <section key={col.label} style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 24px 64px' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40, marginBottom: 32 }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a6c2f', marginBottom: 8,
              }}>
                {col.label}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#6b5c50',
              }}>
                {col.desc}
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {items.map(item => <ShirtCard key={item.id} item={item} />)}
            </div>
          </section>
        )
      })}

      {/* Footer CTA */}
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: '#111', border: '1px solid rgba(154,108,47,0.2)',
          borderRadius: 12, padding: '40px 32px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: '#f5f0e8', marginBottom: 12,
          }}>
            Want a custom design?
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: '#9a8a7a',
            maxWidth: '36rem', margin: '0 auto 24px',
          }}>
            Southern Legends designs shirts for local businesses, events, and causes
            across Northeast Alabama. Get in touch.
          </p>
          <Link href="/places/nominate" style={{
            display: 'inline-block', background: '#9a6c2f', color: '#f5f0e8',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem',
            letterSpacing: '0.05em', padding: '10px 24px', borderRadius: 6, textDecoration: 'none',
          }}>
            Get in touch →
          </Link>
        </div>
      </div>

    </main>
  )
}
