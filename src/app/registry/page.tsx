import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Local Love Registry — Southern Legends',
  description: 'Register with local NE Alabama businesses for your wedding, baby shower, or any celebration. Stories behind every gift.',
  openGraph: {
    title: 'Local Love Registry — Southern Legends',
    description: 'Give and receive gifts from the people who built this place.',
  },
}

const REGISTRY_CATEGORIES = [
  {
    id: 'flowers',
    label: 'Flowers & Botanicals',
    icon: '🌸',
    desc: 'From bouquets to table arrangements. Local growers who know this soil.',
    businesses: [
      { name: 'Heather Florals', city: 'Anniston', url: 'https://heatherflorals.com', slUrl: '/businesses/heather-florals', note: 'Custom wedding arrangements, farm-grown' },
      { name: 'Bloom Bar', city: 'Anniston', slUrl: '/businesses/bloom-bar', note: 'DIY bouquet bar + pop-up floral events' },
      { name: 'Romarin Floral', city: 'Oxford', slUrl: '/profiles/aubrey-fullbright-romarin', note: 'Aubrey Fullbright, fine-art arrangements' },
    ],
  },
  {
    id: 'photography',
    label: 'Photography',
    icon: '📷',
    desc: 'People who know how the light hits here in the late afternoon.',
    businesses: [
      { name: 'A Bryan Photo', city: 'Anniston', slUrl: '/businesses/a-bryan-photo', note: 'Wedding + portrait, NE Alabama' },
      { name: 'Valerie Matthews Photography', city: 'NE Alabama', note: 'Fine art wedding photography, 5★' },
      { name: 'Joe Skaggs Photography', city: 'Oxford', note: 'Editorial + commercial, AL cycling + Foothills Mag' },
    ],
  },
  {
    id: 'venues',
    label: 'Venues & Spaces',
    icon: '🏛️',
    desc: 'The places that hold the weight of a good day.',
    businesses: [
      { name: 'Anniston Museum & Gardens', city: 'Anniston', slUrl: '/profiles/anniston-museums-gardens', note: 'Gorgeous outdoor ceremony space' },
      { name: 'Silver Run Chapel', city: 'Calhoun County', note: 'Two sisters, a chapel in the valley, and a long drive worth making' },
      { name: 'Camp Sumatanga', city: 'Gallant', slUrl: '/profiles/camp-sumatanga', note: 'Mountain retreat + event space' },
    ],
  },
  {
    id: 'food',
    label: 'Food & Catering',
    icon: '🍽️',
    desc: 'Southern table, local hands.',
    businesses: [
      { name: '1918 Catering', city: 'Anniston', slUrl: '/businesses/1918-catering', note: 'Full-service catering, full-service care' },
      { name: 'Called Coffee', city: 'Anniston', note: 'Noble Street coffee — Maria, Brodie, and the whole crew' },
      { name: 'Aquality Farms', city: 'NE Alabama', slUrl: '/profiles/aquality-farms', note: 'Local produce, farm-to-table' },
    ],
  },
  {
    id: 'music',
    label: 'Music & Entertainment',
    icon: '🎵',
    desc: 'People who fill a room and make it something.',
    businesses: [
      { name: 'The Evergreens', city: 'Anniston', slUrl: '/profiles/jean-ellison', note: 'Jean Ellison + Jason Wright, acoustic' },
      { name: 'Studio 104', city: 'Anniston', note: 'Brodie Boyd — lessons, live performance, worship' },
      { name: 'BeatStudio', city: 'Online', url: 'https://beatstudio-roan.vercel.app', note: 'AI-assisted chord charts + practice tools' },
    ],
  },
  {
    id: 'custom-apparel',
    label: 'Custom Apparel & Gifts',
    icon: '👕',
    desc: 'Something to keep. Something they\'ll wear.',
    businesses: [
      { name: 'Freestyle Graphix', city: 'Oxford', note: 'Custom shirts, banners, signage — 20+ years in Oxford' },
      { name: 'Madi Lou\'s Boutique', city: 'Anniston', note: 'Custom printing + boutique, $16/ea for qty 10+' },
      { name: 'Southern Legends Merch', city: 'NE Alabama', url: '/merch', note: 'Original NE Alabama designs, DTF print' },
    ],
  },
  {
    id: 'art-experience',
    label: 'Art & Experiences',
    icon: '🎨',
    desc: 'Gifts that last longer than a toaster.',
    businesses: [
      { name: 'Maria — Called Coffee', city: 'Anniston', note: 'Murals, graffiti, jewelry — trash art made beautiful' },
      { name: 'Jason Wright Art', city: 'NE Alabama', slUrl: '/profiles/jason-wright', note: 'Custom commissioned artwork' },
      { name: 'Anniston Museum & Gardens', city: 'Anniston', slUrl: '/profiles/anniston-museums-gardens', note: 'Membership gifts + guided experiences' },
    ],
  },
  {
    id: 'print-paper',
    label: 'Print & Paper',
    icon: '📄',
    desc: 'Invitations, programs, stationery — things worth keeping in a drawer.',
    businesses: [
      { name: 'Freestyle Graphix', city: 'Oxford', note: 'Business cards, programs, brochures — full-service print' },
      { name: 'Go Social Marketing', city: 'Oxford', note: 'Valerie — stickers, totes, branded paper goods' },
      { name: 'Tyson\'s Model City Glass & Graphics', city: 'Anniston', note: 'Signage + graphics, Julie & Andrew Tyson' },
    ],
  },
]

export default function RegistryPage() {
  return (
    <main style={{ background: 'var(--color-ll-dark)', color: 'var(--color-ll-warm)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ borderBottom: '1px solid rgba(201,162,75,.12)', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(201,162,75,.6)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
            Southern Legends · NE Alabama
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem,7vw,5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: 'var(--color-ll-warm)',
            marginBottom: '20px',
          }}>
            Local Love<br />Registry
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(240,237,230,.6)', lineHeight: 1.7, marginBottom: '32px', fontFamily: 'var(--font-sans)', maxWidth: '580px', margin: '0 auto 32px' }}>
            Register with the people who built this place. Florists, photographers, caterers, artists — every business here has a story, and every gift goes somewhere real.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <a
              href="https://gather-registry.vercel.app/create"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'var(--color-ll-gold)',
                color: 'var(--color-ll-dark)',
                padding: '14px 28px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
                textTransform: 'uppercase',
                letterSpacing: '.5px',
              }}
            >
              Create Your Registry
            </a>
            <a
              href="#categories"
              style={{
                display: 'inline-block',
                border: '2px solid rgba(201,162,75,.35)',
                color: 'rgba(240,237,230,.7)',
                padding: '12px 26px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Browse Local Vendors
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 24px', background: 'rgba(201,162,75,.04)', borderBottom: '1px solid rgba(201,162,75,.08)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(201,162,75,.6)', marginBottom: '40px', fontFamily: 'var(--font-sans)' }}>How It Works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '40px' }}>
            {[
              { n: '1', t: 'Browse', d: 'Find local NE Alabama businesses below, sorted by category.' },
              { n: '2', t: 'Add to Registry', d: 'Click "Add to Registry" to deep-link into Gather Registry with the vendor pre-filled.' },
              { n: '3', t: 'Share', d: 'Send your registry link to guests. They buy from the businesses you chose.' },
              { n: '4', t: 'Support Local', d: 'Every purchase goes to a real NE Alabama business you picked.' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,162,75,.12)', border: '1px solid rgba(201,162,75,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: 'var(--color-ll-gold)' }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', marginBottom: '8px', color: 'var(--color-ll-warm)' }}>{s.t}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(240,237,230,.5)', fontFamily: 'var(--font-sans)', lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" style={{ padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(201,162,75,.6)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>Local Vendors by Category</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, textAlign: 'center', marginBottom: '56px', color: 'var(--color-ll-warm)' }}>The businesses behind every gift</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {REGISTRY_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ borderTop: '1px solid rgba(201,162,75,.12)', paddingTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ll-warm)', marginBottom: '4px' }}>{cat.label}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(240,237,230,.45)', fontFamily: 'var(--font-sans)' }}>{cat.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
                  {cat.businesses.map(biz => (
                    <div key={biz.name} style={{ background: 'rgba(201,162,75,.04)', border: '1px solid rgba(201,162,75,.1)', borderRadius: '8px', padding: '20px 20px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--color-ll-warm)' }}>{biz.name}</h4>
                        <span style={{ fontSize: '11px', color: 'rgba(240,237,230,.35)', fontFamily: 'var(--font-sans)', flexShrink: 0, marginLeft: '8px', paddingTop: '2px' }}>{biz.city}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(240,237,230,.5)', fontFamily: 'var(--font-sans)', lineHeight: 1.6, marginBottom: '14px' }}>{biz.note}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {biz.slUrl && (
                          <Link
                            href={biz.slUrl}
                            style={{ fontSize: '12px', color: 'rgba(201,162,75,.7)', fontFamily: 'var(--font-sans)', textDecoration: 'none', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}
                          >
                            Read Their Story →
                          </Link>
                        )}
                        {biz.url && !biz.url.startsWith('/') && (
                          <a
                            href={biz.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '12px', color: 'rgba(201,162,75,.5)', fontFamily: 'var(--font-sans)', textDecoration: 'none', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}
                          >
                            Visit Website →
                          </a>
                        )}
                        <a
                          href={`https://gather-registry.vercel.app/create?vendor=${encodeURIComponent(biz.name)}&city=${encodeURIComponent(biz.city)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px',
                            background: 'rgba(201,162,75,.15)',
                            color: 'var(--color-ll-gold)',
                            border: '1px solid rgba(201,162,75,.25)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '.5px',
                            cursor: 'pointer',
                          }}
                        >
                          + Registry
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: 'rgba(201,162,75,.06)', borderTop: '1px solid rgba(201,162,75,.1)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, marginBottom: '16px', color: 'var(--color-ll-warm)' }}>
            Your celebration. <br />Local roots.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(240,237,230,.55)', fontFamily: 'var(--font-sans)', lineHeight: 1.7, marginBottom: '32px' }}>
            Gather Registry lets you build a real list of people and experiences, not just stuff from a box store. Start free.
          </p>
          <a
            href="https://gather-registry.vercel.app/create"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'var(--color-ll-gold)',
              color: 'var(--color-ll-dark)',
              padding: '16px 34px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '16px',
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              letterSpacing: '.5px',
            }}
          >
            Create Your Free Registry →
          </a>
          <p style={{ marginTop: '16px', fontSize: '13px', color: 'rgba(240,237,230,.3)', fontFamily: 'var(--font-sans)' }}>
            Free to create. No account required to browse.
          </p>
        </div>
      </section>

      {/* Footer note */}
      <section style={{ padding: '32px 24px', borderTop: '1px solid rgba(201,162,75,.08)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(240,237,230,.25)', fontFamily: 'var(--font-sans)' }}>
          Local Love Registry is part of{' '}
          <Link href="/" style={{ color: 'rgba(201,162,75,.4)' }}>Southern Legends</Link>
          {' '}and powered by{' '}
          <a href="https://gather-registry.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(201,162,75,.4)' }}>Gather Registry</a>.
          {' '}Want to add your NE Alabama business?{' '}
          <a href="mailto:matt@gatherstudio.app?subject=Registry Partner" style={{ color: 'rgba(201,162,75,.5)' }}>Email us.</a>
        </p>
      </section>

    </main>
  )
}
