'use client'

import { useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getMerchItem } from '@/lib/merch'
import { use } from 'react'

export default function BuyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const item = getMerchItem(slug)
  if (!item) notFound()
  return <BuyForm item={item} />
}

import { MerchItem } from '@/lib/merch'

function BuyForm({ item }: { item: MerchItem }) {
  const [size, setSize] = useState(item.sizes?.[1] ?? '')
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showBack, setShowBack] = useState(false)

  async function checkout() {
    setLoading(true)
    const res = await fetch('/api/merch/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: [{ id: item.id, name: item.name + (size ? ` — ${size}` : ''), price: item.price, qty }],
      }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', color: '#f0ede8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back */}
        <a href="/merch" style={{ fontSize: 12, color: 'rgba(240,237,230,0.4)', letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', display: 'block', marginBottom: 32 }}>
          ← All merch
        </a>

        {/* Image */}
        <div
          onMouseEnter={() => setShowBack(true)}
          onMouseLeave={() => setShowBack(false)}
          style={{ background: '#161616', borderRadius: 16, overflow: 'hidden', marginBottom: 28, aspectRatio: '1', position: 'relative' }}
        >
          <Image
            src={item.photoBack && showBack ? item.photoBack : item.photo}
            alt={item.photoBack && showBack ? `${item.name} — back` : item.name}
            fill
            style={{ objectFit: 'contain', padding: 24 }}
            sizes="480px"
          />
          {item.photoBack && (
            <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'rgba(240,237,230,0.75)', fontSize: 10, fontWeight: 600, padding: '4px 9px', borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase', pointerEvents: 'none' }}>
              {showBack ? 'Back' : 'Hover for back'}
            </span>
          )}
          {item.badge && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: item.badgeColor ?? '#9A3412', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.06em' }}>
              {item.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>{item.name}</h1>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#E8722A', flexShrink: 0, marginLeft: 12 }}>${item.price}</span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(240,237,230,0.5)', margin: '0 0 4px' }}>{item.tagline}</p>
          {item.sub && <p style={{ fontSize: 12, color: 'rgba(202,138,4,0.7)', margin: 0 }}>{item.sub}</p>}
          {item.fundraiser && (
            <p style={{ fontSize: 12, color: '#4ade80', margin: '8px 0 0' }}>25% of this sale → {item.fundraiser}</p>
          )}
        </div>

        {/* Size picker */}
        {item.sizes && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', marginBottom: 10 }}>Size</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {item.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '1px solid',
                  borderColor: size === s ? '#E8722A' : 'rgba(240,237,230,0.15)',
                  background: size === s ? 'rgba(232,114,42,0.15)' : 'rgba(255,255,255,0.04)',
                  color: size === s ? '#E8722A' : 'rgba(240,237,230,0.6)',
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Qty */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', marginBottom: 10 }}>Qty</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(240,237,230,0.15)', background: 'rgba(255,255,255,0.04)', color: '#f0ede8', fontSize: 18, cursor: 'pointer' }}>−</button>
            <span style={{ fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(240,237,230,0.15)', background: 'rgba(255,255,255,0.04)', color: '#f0ede8', fontSize: 18, cursor: 'pointer' }}>+</button>
            <span style={{ fontSize: 14, color: 'rgba(240,237,230,0.4)', marginLeft: 8 }}>Total: ${(item.price * qty).toFixed(2)}</span>
          </div>
        </div>

        {/* Buy button */}
        <button onClick={checkout} disabled={loading || (!!item.sizes && !size)} style={{
          width: '100%', padding: '16px', borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
          background: loading ? 'rgba(232,114,42,0.5)' : '#E8722A',
          color: '#fff', fontSize: 16, fontWeight: 900, letterSpacing: '0.04em',
          opacity: (!!item.sizes && !size) ? 0.5 : 1,
          marginBottom: 16,
        }}>
          {loading ? 'Redirecting...' : `Buy now — $${(item.price * qty).toFixed(2)}`}
        </button>

        <p style={{ fontSize: 11, color: 'rgba(240,237,230,0.3)', textAlign: 'center', letterSpacing: '0.06em' }}>
          Secure checkout via Stripe · Pre-orders ship after Aug 2
        </p>

      </div>
    </main>
  )
}
