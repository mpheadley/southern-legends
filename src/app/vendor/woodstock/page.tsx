import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Woodstock 5K Print Files — Vendor Download',
  description: 'Print-ready files for Woodstock 5K merch. DTF/DTG-ready PNGs.',
  robots: { index: false, follow: false },
}

type PrintFile = {
  id: string
  name: string
  desc: string
  shirtColor: string
  shirtHex: string
  file: string
  thumb: string
  size: string
}

const FILES: PrintFile[] = [
  {
    id: 'ws-oval-cream',
    name: 'Woodstock Avenue Oval',
    desc: 'Cream / natural shirt · 10.5" print width recommended',
    shirtColor: 'Cream',
    shirtHex: '#f5f0e8',
    file: '/print-files/WOODSTOCK-00-woodstock-avenue-oval-CREAM.png',
    thumb: '/print-files/WOODSTOCK-00-woodstock-avenue-oval-CREAM.png',
    size: '~4.2MB PNG',
  },
  {
    id: 'ws-survived-black',
    name: 'I Survived Woodstock Avenue',
    desc: 'Black or dark shirt · transparent background · DTF-ready',
    shirtColor: 'Black',
    shirtHex: '#1a1a1a',
    file: '/print-files/WOODSTOCK-01-survived-woodstock-BLACK.png',
    thumb: '/print-files/WOODSTOCK-01-survived-woodstock-BLACK.png',
    size: '~3.8MB PNG',
  },
  {
    id: 'ws-pv-raiders-black',
    name: 'PV Raiders XC',
    desc: 'Black or dark shirt · front print · transparent bg',
    shirtColor: 'Black',
    shirtHex: '#1a1a1a',
    file: '/print-files/WOODSTOCK-10-pv-raiders-xc-BLACK.png',
    thumb: '/print-files/WOODSTOCK-10-pv-raiders-xc-BLACK.png',
    size: '~3.4MB PNG',
  },
  {
    id: 'ws-pv-raiders-back',
    name: 'PV Raiders XC — Back Print',
    desc: 'Back print version · black shirt · transparent bg',
    shirtColor: 'Black',
    shirtHex: '#1a1a1a',
    file: '/print-files/WOODSTOCK-10-pv-raiders-xc-BACK-BLACK.png',
    thumb: '/print-files/WOODSTOCK-10-pv-raiders-xc-BACK-BLACK.png',
    size: '~2.9MB PNG',
  },
  {
    id: 'ws-cheaha-skyway',
    name: 'Cheaha — Building the Skyway',
    desc: 'Black shirt · woodcut print · transparent bg',
    shirtColor: 'Black',
    shirtHex: '#1a1a1a',
    file: '/print-files/WOODSTOCK-11-cheaha-skyway-BLACK.png',
    thumb: '/print-files/WOODSTOCK-11-cheaha-skyway-BLACK.png',
    size: '~3.1MB PNG',
  },
  {
    id: 'ws-pinhoti-black',
    name: 'Pinhoti Trail',
    desc: 'Black shirt · transparent bg · DTF-ready',
    shirtColor: 'Black',
    shirtHex: '#1a1a1a',
    file: '/print-files/WOODSTOCK-06-pinhoti-trail-BLACK.png',
    thumb: '/print-files/WOODSTOCK-06-pinhoti-trail-BLACK.png',
    size: '~3.2MB PNG',
  },
  {
    id: 'ws-blossom-roses',
    name: 'Blossom & Decay — Roses',
    desc: 'Mocha / brown shirt · transparent bg',
    shirtColor: 'Mocha',
    shirtHex: '#6b4c35',
    file: '/print-files/WOODSTOCK-12-blossom-decay-roses-MOCHA.png',
    thumb: '/print-files/WOODSTOCK-12-blossom-decay-roses-MOCHA.png',
    size: '~4MB PNG',
  },
  {
    id: 'ws-blossom-trans',
    name: 'Blossom & Decay — Roses (transparent)',
    desc: 'Transparent bg · works on any dark shirt color',
    shirtColor: 'Any dark',
    shirtHex: '#3d2c1e',
    file: '/print-files/WOODSTOCK-12-blossom-decay-roses-trans.png',
    thumb: '/print-files/WOODSTOCK-12-blossom-decay-roses-trans.png',
    size: '~3.6MB PNG',
  },
]

export default function VendorWoodstockPage() {
  return (
    <main style={{ background: '#0a0908', color: '#f0ede8', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(240,237,232,0.08)',
        background: '#0f0d0b',
        padding: '32px 32px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(202,138,4,0.6)', marginBottom: 8 }}>
            Southern Legends · Vendor Portal
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '1.8rem', lineHeight: 1.1, marginBottom: 6 }}>
            Woodstock 5K — Print Files
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(240,237,232,0.35)', lineHeight: 1.5 }}>
            DTF/DTG-ready transparent PNGs · 300dpi · RGB · Aug 2, 2026 race
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(240,237,232,0.3)' }}>Questions: matt@gatherstudio.app</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(240,237,232,0.3)' }}>southernlegends.org</p>
        </div>
      </div>

      {/* Spec banner */}
      <div style={{
        background: 'rgba(202,138,4,0.06)', borderBottom: '1px solid rgba(202,138,4,0.12)',
        padding: '14px 32px', display: 'flex', gap: 32, flexWrap: 'wrap',
      }}>
        {[
          ['Format', 'PNG, transparent background'],
          ['Resolution', '300dpi minimum'],
          ['Color mode', 'RGB'],
          ['Print method', 'DTF or DTG'],
          ['Recommended width', '10.5" chest print'],
          ['Rights', 'Single-order vendor use only'],
        ].map(([label, val]) => (
          <div key={label}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(202,138,4,0.5)', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(240,237,232,0.65)' }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Files grid */}
      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {FILES.map(f => (
          <div key={f.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(240,237,232,0.07)',
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Preview on shirt color */}
            <div style={{
              position: 'relative', aspectRatio: '4/3',
              background: f.shirtHex,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.thumb}
                alt={f.name}
                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
              />
              <span style={{
                position: 'absolute', top: 10, right: 10,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                padding: '3px 8px', borderRadius: 6,
                background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)',
              }}>{f.shirtColor}</span>
            </div>

            {/* Info + download */}
            <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2 }}>{f.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(240,237,232,0.35)', lineHeight: 1.5 }}>{f.desc}</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(240,237,232,0.2)', fontFamily: 'monospace' }}>{f.size}</p>
              <a
                href={f.file}
                download
                style={{
                  display: 'block', textAlign: 'center', marginTop: 'auto',
                  padding: '9px 14px', borderRadius: 9,
                  background: '#1e3a1a', border: '1px solid rgba(74,222,128,0.2)',
                  color: '#4ade80', fontWeight: 700, fontSize: '0.75rem',
                  letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase',
                }}
              >
                Download PNG
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Usage note */}
      <div style={{
        margin: '0 32px 48px',
        padding: '20px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,232,0.06)',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(240,237,232,0.3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'rgba(240,237,232,0.5)' }}>Usage:</strong>{' '}
          These files are licensed for printing the Woodstock 5K merch order only.
          Do not redistribute, resell artwork, or use for other events.
          PV Raiders XC designs: 25% of gross per-shirt revenue to the Raiders XC program —
          report to matt@gatherstudio.app after fulfillment.
          Questions or spec issues: (256) 644-7334.
        </p>
      </div>
    </main>
  )
}
