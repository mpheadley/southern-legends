'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MERCH } from '@/lib/merch'
import ShirtMockup from '@/components/ShirtMockup'

const DROP = MERCH.filter(m => ['neuro-spicy-nutrition-shirt', 'i-contain-multitudes', 'bipolar-proud'].includes(m.id))

export default function LivePage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [size, setSize] = useState<Record<string, string>>({})

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-ll-dark)', color: 'var(--color-ll-warm)' }}>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(202,138,4,0.15)' }}>
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(202,138,4,0.7)' }}>
            Southern Legends
          </Link>
          <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
            Live Drop
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: 'rgba(202,138,4,0.6)' }}>
          Mental Health · Southern Legends
        </p>
        <h1 className="font-black mb-5" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(3rem,8vw,5rem)',
          lineHeight: 1,
          color: 'var(--color-ll-warm)',
        }}>
          Say It Out Loud.
        </h1>
        <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(240,237,230,0.5)' }}>
          Three shirts. Made in NE Alabama. For anyone who's been through it and stayed anyway.
        </p>
      </div>

      {/* Shirts */}
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {DROP.map(item => {
            const isHovered = hovered === item.id
            const selectedSize = size[item.id] || ''
            return (
              <div
                key={item.id}
                className="flex flex-col items-center gap-4"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Shirt mockup — blank by default, color on hover */}
                <ShirtMockup
                  src={item.photo}
                  alt={item.name}
                  shirtColor={isHovered ? item.bg : undefined}
                  size={260}
                />

                {/* Name + price */}
                <div className="text-center">
                  <div className="font-bold text-lg mb-1" style={{ color: 'var(--color-ll-warm)', fontFamily: 'var(--font-heading)' }}>
                    {item.name}
                  </div>
                  <div className="text-sm mb-3" style={{ color: 'rgba(202,138,4,0.8)' }}>
                    ${item.price}
                  </div>

                  {/* Size selector */}
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {(item.sizes ?? ['S','M','L','XL','2XL']).map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(prev => ({ ...prev, [item.id]: s }))}
                        className="text-xs px-2.5 py-1 rounded"
                        style={{
                          background: selectedSize === s ? 'var(--color-ll-gold)' : 'rgba(240,237,230,0.08)',
                          color: selectedSize === s ? '#1a0e04' : 'rgba(240,237,230,0.6)',
                          border: selectedSize === s ? '1px solid var(--color-ll-gold)' : '1px solid rgba(240,237,230,0.12)',
                          fontWeight: selectedSize === s ? 700 : 400,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <a
                    href={`mailto:matt@gatherstudio.app?subject=Order: ${encodeURIComponent(item.name)}&body=Size: ${selectedSize || '(please select)'}%0AName:%0AShipping address:`}
                    className="inline-block text-sm px-5 py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: 'rgba(124,58,237,0.85)',
                      color: '#fff',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Order — ${item.price}
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sub-note */}
        <p className="text-center text-xs mt-16 leading-relaxed" style={{ color: 'rgba(240,237,230,0.28)' }}>
          DTF print · made to order · ships in 7–10 days · NE Alabama made<br />
          Questions? <a href="mailto:matt@gatherstudio.app" style={{ color: 'rgba(202,138,4,0.5)' }}>matt@gatherstudio.app</a>
        </p>
      </div>
    </main>
  )
}
