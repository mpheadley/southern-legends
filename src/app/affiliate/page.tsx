'use client'
import { useState } from 'react'
import { AFFILIATE_CATALOG, CATEGORY_LABELS, type AffiliateProduct } from '@/lib/affiliate-catalog'

const REGISTRY_API = 'https://gather-registry.vercel.app/api/affiliate'

// YouTube demo videos per product key
const YOUTUBE_IDS: Record<string, string> = {
  'freedom-riders-shirt': '147xvOixWd0',  // Freedom Riders National Monument essay
  'sermoncoach': 'upVG97BpaFw',           // The Digital Gym — SermonCoach in context
}

// Thumbnail images per product key — all paths verified on disk
const THUMBNAILS: Record<string, string> = {
  'freedom-riders-shirt': '/print-files/FREEDOM-RIDERS-02-dennis-portrait-BLACK.png',
  'anniston-45-shirt': '/merch/anniston-45-mockup.webp',
  'woodstock-shirt': '/merch/20260726_182840_gpt_vintage-t-shirt-mockup-on-black-shirt,-d.webp',
  'pv-raiders-shirt': '/merch/fw/pv-raiders-xc-01.webp',
  'clt-shirt': '/merch/fw/chief-ladiga-trail-01.webp',
  'sl-stickers': '/print-files/FREEDOM-RIDERS-S1-burning-bus-sticker.png',
  'headley-bros': '/images/about/headshot-hedcut-matt-headley.webp',
  'heather-florals': '/images/heather/heather-headshot.webp',
  'bloom-bar': '/merch/bloom-bar-tee.webp',
  'blueprint-session': '/images/about/headshot-hedcut-matt-headley.webp',
  'gather-os': '/images/about/headshot-hedcut-matt-headley.webp',
  'cadence': '/images/about/headshot-hedcut-matt-headley.webp',
  'ecclesia-shirts': '/print-files/ECCLESIA-05-pilgrims-shirt.webp',
  'advent-kit': '/print-files/ECCLESIA-04-coin-8bit-shirt.webp',
  'ecclesia-marketing': '/print-files/ECCLESIA-03-coin-celtic-shirt.webp',
  'sermoncoach': '/images/about/headshot-hedcut-matt-headley.webp',
  'tend-presell': '/images/about/headshot-hedcut-matt-headley.webp',
  'sl-books': '/images/essays/broken-ground-book-hero.webp',
  'silver-run': '/images/about/headshot-hedcut-matt-headley.webp',
  'aisle-tickets': '/merch/aisle-vendor-tee-mockup.webp',
  'multitudes-shirt': '/merch/fw/i-contain-multitudes-01.webp',
  'neurospicy-shirt': '/print-files/NEUROSPICY-01-nutrition-label-CREAM.png',
  'gather-registry': '/images/about/headshot-hedcut-matt-headley.webp',
  'church-custom-shirt': '/print-files/ECCLESIA-05-pilgrims-shirt.webp',
}

const CATEGORY_ORDER: AffiliateProduct['category'][] = ['service', 'event', 'shop', 'product', 'merch']

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      style={{ padding: '0.4rem 0.9rem', background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(202,138,4,0.15)', border: `1px solid ${copied ? '#4ade80' : '#CA8A04'}`, borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, color: copied ? '#4ade80' : '#CA8A04', cursor: 'pointer', whiteSpace: 'nowrap' }}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

function ProductCard({ product, affiliateCode }: { product: AffiliateProduct; affiliateCode: string | null }) {
  const [showVideo, setShowVideo] = useState(false)
  const ytId = YOUTUBE_IDS[product.key]
  const thumb = THUMBNAILS[product.key]
  const refLink = affiliateCode
    ? `https://southernlegends.blog/r/${affiliateCode}?dest=${product.key}`
    : null

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(250,250,247,0.08)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Media area */}
      <div style={{ position: 'relative', height: 160, background: '#111', overflow: 'hidden' }}>
        {showVideo && ytId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none', display: 'block' }}
          />
        ) : thumb ? (
          <img
            src={thumb}
            alt={product.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.75 }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(154,52,18,0.3), rgba(202,138,4,0.2))' }} />
        )}
        {/* Play button if YT ID exists */}
        {ytId && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1C1917"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </button>
        )}
        {/* Commission badge */}
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', borderRadius: 4, padding: '0.2rem 0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CA8A04' }}>{product.commission}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0.9rem 1rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.35)', marginBottom: '0.25rem' }}>
          {product.venture}
        </p>
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FAFAF7', marginBottom: '0.3rem', lineHeight: 1.3 }}>
          {product.label}
        </p>
        <p style={{ fontSize: '0.76rem', color: 'rgba(250,250,247,0.55)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(250,250,247,0.5)' }}>{product.price}</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(202,138,4,0.7)' }}>{product.commissionNote}</span>
        </div>

        {/* Link row */}
        {refLink ? (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 4, padding: '0.3rem 0.5rem', overflow: 'hidden', minWidth: 0 }}>
              <p style={{ fontSize: '0.68rem', color: '#CA8A04', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {refLink}
              </p>
            </div>
            <CopyButton text={refLink} label="Copy" />
          </div>
        ) : (
          <p style={{ fontSize: '0.72rem', color: 'rgba(250,250,247,0.25)', fontStyle: 'italic' }}>Sign up below for your link</p>
        )}
      </div>
    </div>
  )
}

export default function AffiliateSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [platform, setPlatform] = useState('')
  const [loading, setLoading] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const [error, setError] = useState('')

  const groupedProducts = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    products: AFFILIATE_CATALOG.filter(p => p.category === cat),
  })).filter(g => g.products.length > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(REGISTRY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          venture_slug: 'southern-legends',
          notes: handle ? `${platform || 'social'}: ${handle}` : '',
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setAffiliateCode(data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Email matt@southernlegends.blog.')
    }
    setLoading(false)
  }

  return (
    <main style={{ background: '#1C1917', color: '#FAFAF7', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1.25rem 6rem' }}>

        {/* Header */}
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#CA8A04', marginBottom: '0.75rem', opacity: 0.8 }}>
          Southern Legends · Partner Program
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '0.75rem' }}>
          Earn when you share the South.
        </h1>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'rgba(250,250,247,0.6)', marginBottom: '2.5rem', maxWidth: '55ch' }}>
          One link per product. Share what fits your audience — merch, workshops, wedding venues, church resources, strategy sessions, or books. Commissions paid monthly.
        </p>

        {/* Signup form — compact, top of page */}
        {!affiliateCode ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(250,250,247,0.1)', borderRadius: 8, padding: '1.25rem 1.5rem', marginBottom: '3rem', maxWidth: 520 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#CA8A04', marginBottom: '0.9rem' }}>
              Get your links — takes 10 seconds
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required
                  style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(250,250,247,0.12)', borderRadius: 5, color: '#FAFAF7', fontSize: '0.85rem', outline: 'none' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
                  style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(250,250,247,0.12)', borderRadius: 5, color: '#FAFAF7', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <input type="text" value={handle} onChange={e => setHandle(e.target.value)} placeholder="@handle (optional)"
                  style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(250,250,247,0.12)', borderRadius: 5, color: '#FAFAF7', fontSize: '0.85rem', outline: 'none' }} />
                <select value={platform} onChange={e => setPlatform(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', background: '#2a2320', border: '1px solid rgba(250,250,247,0.12)', borderRadius: 5, color: platform ? '#FAFAF7' : 'rgba(250,250,247,0.4)', fontSize: '0.85rem', outline: 'none' }}>
                  <option value="">Platform...</option>
                  <option>Instagram</option><option>Facebook</option><option>Newsletter</option>
                  <option>YouTube</option><option>Blog</option><option>TikTok</option><option>Podcast</option><option>Other</option>
                </select>
              </div>
              {error && <p style={{ fontSize: '0.78rem', color: '#f87171' }}>{error}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button type="submit" disabled={loading}
                  style={{ padding: '0.7rem 1.5rem', background: '#9A3412', color: '#FAFAF7', border: 'none', borderRadius: 5, fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Getting links...' : 'Get my links →'}
                </button>
                <p style={{ fontSize: '0.7rem', color: 'rgba(250,250,247,0.3)', margin: 0 }}>No quota. No expiry. Paid monthly.</p>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ background: 'rgba(34,85,34,0.15)', border: '1px solid rgba(100,200,100,0.2)', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '2.5rem', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '0.2rem' }}>You&rsquo;re in</p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,250,247,0.8)', margin: 0 }}>
                Code: <strong style={{ color: '#CA8A04' }}>{affiliateCode}</strong> — copy any link below
              </p>
            </div>
            <a href={`https://gather-registry.vercel.app/affiliate/dashboard?code=${affiliateCode}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)', color: '#FAFAF7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard →
            </a>
          </div>
        )}

        {/* Product catalog by category */}
        {groupedProducts.map(group => (
          <div key={group.category} style={{ marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.35)', borderBottom: '1px solid rgba(250,250,247,0.06)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              {group.label}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {group.products.map(product => (
                <ProductCard key={product.key} product={product} affiliateCode={affiliateCode} />
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(250,250,247,0.05)', borderRadius: 6 }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(250,250,247,0.35)', lineHeight: 1.65, margin: 0 }}>
            Commissions paid monthly via Venmo or PayPal once you hit $10. Questions or custom arrangements: matt@southernlegends.blog. Already have a code? <a href="https://gather-registry.vercel.app/affiliate/dashboard" style={{ color: '#CA8A04' }}>View your dashboard</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
