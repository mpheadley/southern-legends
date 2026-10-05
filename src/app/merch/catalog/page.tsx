'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MERCH, MerchItem, MerchCategory } from '@/lib/merch'
import ShirtMockup from '@/components/ShirtMockup'

const CATEGORY_LABELS: Record<MerchCategory, string> = {
  'shirt':    'Shirts',
  'hoodie':   'Hoodies & Crewnecks',
  'hat':      'Hats',
  'sticker':  'Stickers',
  'patch':    'Patches',
  'pin':      'Enamel Pins',
  'tote':     'Totes',
  'print':    'Prints',
  'poster':   'Posters',
  'mug':      'Mugs',
  'sock':     'Socks',
  '3d-print': '3D Prints — Headley Bros',
  'bandana':  'Bandanas',
  'pennant':  'Pennants',
  'journal':  'Journals',
  'magazine': 'Magazines',
}

const CATEGORY_ORDER: MerchCategory[] = [
  'shirt', 'hoodie', 'hat', 'tote',
  'sticker', 'patch', 'pin',
  'print', 'poster', 'magazine', 'mug', 'sock',
  '3d-print', 'pennant', 'journal', 'bandana',
]

function groupByCategory(items: MerchItem[]) {
  const groups: Partial<Record<MerchCategory, MerchItem[]>> = {}
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = []
    groups[item.category]!.push(item)
  }
  return groups
}

function StatusChip({ item }: { item: MerchItem }) {
  if (item.comingSoon) return (
    <span style={{ background: 'rgba(202,138,4,0.12)', color: '#ca8a04', border: '1px solid rgba(202,138,4,0.25)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      Pre-order · Coming Soon
    </span>
  )
  if (item.available) return (
    <span style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      Available Now
    </span>
  )
  return (
    <span style={{ background: 'rgba(107,114,128,0.1)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      Unavailable
    </span>
  )
}

// Photo is a flat/compositable design if it's in print-files, has a trans/nobg name, or item.bg is set
function isCompositableDesign(item: MerchItem): boolean {
  return !!(
    item.bg ||
    item.rawGraphic ||
    item.photo.includes('/print-files/') ||
    item.photo.includes('-trans.') ||
    item.photo.includes('-nobg.')
  )
}

function MerchCard({ item }: { item: MerchItem }) {
  const [hovered, setHovered] = useState(false)
  const isShirt = item.category === 'shirt' || item.category === 'hoodie'

  return (
    <div style={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', aspectRatio: '1',
          background: isShirt ? 'rgba(255,255,255,0.015)' : '#141210',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isShirt ? (
          hovered && item.photoBack
            ? <div style={{ position: 'relative', width: 180, height: 180 }}>
                <Image src={item.photoBack} alt={`${item.name} back`} fill style={{ objectFit: 'contain', padding: 16 }} sizes="180px" />
              </div>
            : isCompositableDesign(item)
              ? <ShirtMockup
                  src={item.rawGraphic ?? item.photo}
                  alt={item.name}
                  shirtColor={item.bg}
                  size={180}
                />
              : <Image src={item.photo} alt={item.name} fill style={{ objectFit: 'contain', padding: 12 }} sizes="240px" />
        ) : (
          <Image src={item.photo} alt={item.name} fill style={{ objectFit: 'contain', padding: 12 }} sizes="240px" />
        )}
        {item.comingSoon && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#ca8a04', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ede8', marginBottom: 2 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: 'rgba(240,237,230,0.4)', marginBottom: 6 }}>{item.tagline}</div>
        {item.sub && <div style={{ fontSize: 10, color: 'rgba(202,138,4,0.7)', marginBottom: 6 }}>{item.sub}</div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <StatusChip item={item} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f0ede8' }}>${item.price}</span>
        </div>
        {item.fundraiser && (
          <div style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>25% → {item.fundraiser}</div>
        )}
      </div>
    </div>
  )
}

export default function MerchCatalogPage() {
  const groups = groupByCategory(MERCH)
  const available = MERCH.filter(m => m.available).length
  const comingSoon = MERCH.filter(m => m.comingSoon).length

  return (
    <main style={{ background: '#0e0c0b', minHeight: '100vh', padding: '48px 32px 80px', maxWidth: 1400, margin: '0 auto' }}>

      <div style={{ marginBottom: 40, borderBottom: '1px solid rgba(202,138,4,0.2)', paddingBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(202,138,4,0.6)', marginBottom: 8 }}>Southern Legends</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f0ede8', marginBottom: 6 }}>Full Merch Catalog</h1>
        <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.3)' }}>
          {available} items available now · {comingSoon} coming soon · All NE Alabama · Backed by <code style={{ fontSize: 10 }}>merch.ts</code>
        </p>
      </div>

      {CATEGORY_ORDER.map(cat => {
        const items = groups[cat]
        if (!items?.length) return null
        const avail = items.filter(m => m.available).length
        const soon = items.filter(m => m.comingSoon).length
        return (
          <section key={cat} style={{ marginBottom: 56, pageBreakAfter: 'always' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede8' }}>{CATEGORY_LABELS[cat]}</h2>
              <span style={{ fontSize: 11, color: 'rgba(240,237,230,0.3)' }}>
                {avail > 0 && `${avail} available`}{avail > 0 && soon > 0 && ' · '}{soon > 0 && `${soon} coming soon`}
              </span>
            </div>
            <div style={{ height: 1, background: 'linear-gradient(to right, rgba(202,138,4,0.3), transparent)', marginBottom: 16 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {items.map(item => <MerchCard key={item.id} item={item} />)}
            </div>
          </section>
        )
      })}

    </main>
  )
}
