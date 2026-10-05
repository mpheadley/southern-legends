'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function MerchPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [notifyEmail, setNotifyEmail]   = useState('')
  const [notifySent,  setNotifySent]    = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const onScroll = () => { hero.style.backgroundPositionY = `${window.scrollY * 0.28}px` }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function submitNotify(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: notifyEmail, tag: 'merch-notify' }),
    })
    setNotifySent(true)
  }

  return (
    <main id="main-content" className="min-h-screen" style={{ background: 'var(--color-ll-dark)', color: 'var(--color-ll-warm)' }}>

      {/* ── HERO ── */}
      <div ref={heroRef} className="gradient-hero no-pseudo-topo relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div aria-hidden="true" className="grid-topo" />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(135deg, rgba(6,13,9,0.97) 0%, rgba(154,52,18,0.07) 55%, rgba(6,13,9,0.60) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-56 z-[1]" style={{ background: 'linear-gradient(to bottom, transparent, var(--color-ll-dark))' }} />

        {/* Right — product collage (desktop) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 z-[2]" style={{ width: '46%', overflow: 'hidden' }}>
          <div className="absolute inset-y-0 left-0 w-32 z-10" style={{ background: 'linear-gradient(to right, var(--color-ll-dark), transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-8 z-10" style={{ background: 'linear-gradient(to left, var(--color-ll-dark), transparent)' }} />
          <div className="grid h-full" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
            <img src="/merch/clt-hike-explore-mockup.webp"     alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
            <img src="/merch/model-city-mockup-cream.webp"     alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
            <img src="/merch/freedom-riders/shirt-mockup-dark.webp" alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
            <img src="/merch/clt-shirt-front-mockup.jpg"       alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
          </div>
        </div>

        {/* Left — editorial headline */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20"
          style={{ minHeight: '100svh', maxWidth: 'min(600px, 56vw)' }}>

          <p className="text-xs tracking-[0.45em] uppercase mb-5 font-bold" style={{ color: 'rgba(202,138,4,0.7)' }}>
            Southern Legends · NE Alabama
          </p>

          <h1 className="font-black leading-[0.88] mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(4rem, 9vw, 7.2rem)',
              color: 'var(--color-ll-warm)',
              textShadow: '0 2px 32px rgba(0,0,0,0.6)',
            }}>
            Wear<br />the<br />story.
          </h1>

          <p className="mb-10 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'rgba(240,237,230,0.55)', maxWidth: '380px' }}>
            Every shirt funds a story. Every story keeps a place alive.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#support"
              className="font-black uppercase tracking-widest rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-ll-warm)', color: 'var(--color-ll-dark)', fontSize: '0.82rem', padding: '0.95rem 1.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
              Support this work
            </a>
            <Link href="/merch/catalog"
              className="font-black uppercase tracking-widest rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'rgba(240,237,230,0.07)', color: 'var(--color-ll-warm)', border: '1px solid rgba(240,237,230,0.18)', fontSize: '0.82rem', padding: '0.95rem 1.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
              Shop the merch →
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 flex items-center gap-3" style={{ opacity: 0.3 }}>
            <div style={{ width: 1, height: 36, background: 'var(--color-ll-warm)' }} />
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          </div>
        </div>
      </div>

      {/* ── SUPPORT BLOCK ── */}
      <section id="support" className="relative px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-4xl mx-auto">

          <p className="text-xs tracking-[0.4em] uppercase mb-4 font-bold" style={{ color: 'rgba(202,138,4,0.6)' }}>
            Support Southern Legends
          </p>
          <h2 className="font-black mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--color-ll-warm)' }}>
            Every story is free.
          </h2>
          <p className="mb-12 max-w-xl leading-relaxed" style={{ fontSize: '1.05rem', color: 'rgba(240,237,230,0.5)' }}>
            No paywall. No algorithm. A monthly contribution keeps the archives growing and the researchers paid.
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>

            {/* Subscribe free */}
            <SupportCard
              eyebrow="Free"
              headline="Newsletter"
              body="New stories, profiles, and place essays — straight to your inbox."
              cta="Subscribe free →"
              href="/newsletter"
              accent="rgba(240,237,230,0.12)"
              ctaStyle={{ background: 'rgba(240,237,230,0.08)', color: 'var(--color-ll-warm)', border: '1px solid rgba(240,237,230,0.18)' }}
            />

            {/* $5/mo patron */}
            <SupportCard
              eyebrow="$5 / month"
              headline="Reader Patron"
              body="Keep the lights on. Cancel any time."
              cta="Become a patron →"
              href="https://buy.stripe.com/patron5"
              accent="rgba(154,52,18,0.25)"
              ctaStyle={{ background: 'var(--color-ll-primary)', color: 'var(--color-ll-warm)' }}
            />

            {/* Founding $15/mo */}
            <SupportCard
              eyebrow="$15 / month"
              headline="Founding Patron"
              body="Your name in the masthead. First access to print editions."
              cta="Founding Patron →"
              href="mailto:matt@gatherstudio.app?subject=Founding+Patron"
              accent="rgba(202,138,4,0.18)"
              ctaStyle={{ background: 'rgba(202,138,4,0.15)', color: '#C9A227', border: '1px solid rgba(202,138,4,0.35)' }}
            />

          </div>

          {/* Notify strip */}
          <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(240,237,230,0.07)' }}>
            <p className="text-sm mb-3" style={{ color: 'rgba(240,237,230,0.35)' }}>
              Cheaha Mountain, I Live Here On Purpose, and more drops incoming —
            </p>
            <form onSubmit={submitNotify} className="flex gap-3 max-w-md">
              <input type="email" required placeholder="your@email.com"
                value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,237,230,0.1)', color: 'var(--color-ll-warm)', outline: 'none' }} />
              <button type="submit" disabled={notifySent}
                className="px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'var(--color-ll-accent)', color: '#1C1917', cursor: notifySent ? 'default' : 'pointer', opacity: notifySent ? 0.7 : 1 }}>
                {notifySent ? '✓ Got it' : 'Notify me'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FLAGSHIP MERCH TEASER ── */}
      <section className="px-6 md:px-12 lg:px-20 pb-28">
        <div className="max-w-4xl mx-auto">

          <p className="text-xs tracking-[0.4em] uppercase mb-8 font-bold" style={{ color: 'rgba(202,138,4,0.6)' }}>
            The Store
          </p>

          <Link href="/merch/catalog" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.015]"
              style={{ background: '#0d1a0e', border: '1px solid rgba(240,237,230,0.07)', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}>

              {/* Large product image */}
              <div className="relative" style={{ aspectRatio: '16/7' }}>
                <Image
                  src="/merch/freedom-riders/shirt-mockup-dark.webp"
                  alt="Freedom Riders shirt"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 880px"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, rgba(6,13,9,0.92) 0%, rgba(6,13,9,0.6) 40%, rgba(6,13,9,0.15) 100%)' }} />
                <div className="absolute inset-0 md:hidden"
                  style={{ background: 'rgba(6,13,9,0.75)' }} />

                {/* Text on top */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12" style={{ maxWidth: '520px' }}>
                  <p className="text-xs tracking-[0.35em] uppercase font-bold mb-3" style={{ color: 'rgba(154,52,18,0.9)' }}>
                    Anniston, Alabama · 1961
                  </p>
                  <h2 className="font-black leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-ll-warm)' }}>
                    Freedom Riders
                  </h2>
                  <p className="mb-6 leading-relaxed" style={{ fontSize: '0.95rem', color: 'rgba(240,237,230,0.5)', maxWidth: '320px' }}>
                    Shirts, hoodies, prints, and stickers from the most significant civil rights moment in Alabama history.
                  </p>
                  <span className="inline-flex items-center gap-2 font-black uppercase tracking-widest rounded-xl self-start transition-all duration-200 group-hover:gap-4"
                    style={{ background: '#9A3412', color: '#fff', fontSize: '0.78rem', padding: '0.85rem 1.5rem', letterSpacing: '0.1em' }}>
                    Enter the store →
                  </span>
                </div>

                {/* Item count badge */}
                <div className="absolute top-5 right-5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(6,13,9,0.8)', color: 'rgba(240,237,230,0.5)', border: '1px solid rgba(240,237,230,0.12)', backdropFilter: 'blur(8px)' }}>
                  40+ designs
                </div>
              </div>

              {/* Bottom strip */}
              <div className="flex items-center justify-between px-8 md:px-12 py-5"
                style={{ borderTop: '1px solid rgba(240,237,230,0.06)' }}>
                <div className="flex gap-6">
                  {['Shirts', 'Hoodies', 'Totes', 'Stickers', 'Prints', 'Hats'].map(cat => (
                    <span key={cat} className="text-xs" style={{ color: 'rgba(240,237,230,0.3)' }}>{cat}</span>
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: 'rgba(202,138,4,0.6)' }}>
                  Browse all →
                </span>
              </div>
            </div>
          </Link>

        </div>
      </section>

    </main>
  )
}

// ─── Support Card ─────────────────────────────────────────────────────────────

function SupportCard({
  eyebrow, headline, body, cta, href, ctaStyle,
}: {
  eyebrow: string
  headline: string
  body: string
  cta: string
  href: string
  accent?: string
  ctaStyle?: React.CSSProperties
}) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto')
  const btnClass = 'inline-block font-black text-xs uppercase tracking-widest rounded-xl text-center hover:opacity-90 transition-opacity'
  const btnStyle = { padding: '0.75rem 1.25rem', textDecoration: 'none', ...ctaStyle }

  return (
    <div className="rounded-2xl p-7 flex flex-col"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,237,230,0.07)' }}>
      <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(240,237,230,0.35)' }}>
        {eyebrow}
      </p>
      <h3 className="font-black mb-2" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--color-ll-warm)' }}>
        {headline}
      </h3>
      <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'rgba(240,237,230,0.42)' }}>
        {body}
      </p>
      {isExternal
        ? <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass} style={btnStyle}>{cta}</a>
        : <Link href={href} className={btnClass} style={btnStyle}>{cta}</Link>
      }
    </div>
  )
}
