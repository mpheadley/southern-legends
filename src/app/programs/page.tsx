import type { Metadata } from 'next'
import Link from 'next/link'
import { getActivePrograms } from '@/lib/programs'

export const metadata: Metadata = {
  title: 'NE Alabama School Programs — Southern Legends',
  description: 'Supporting school programs across NE Alabama — cross country, theater, band, and more. Buy merch, become a sponsor.',
  alternates: { canonical: '/programs' },
}

const CATEGORY_LABELS: Record<string, string> = {
  xc: 'Cross Country',
  track: 'Track & Field',
  band: 'Band',
  theater: 'Theater',
  choir: 'Choir',
  football: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  softball: 'Softball',
  soccer: 'Soccer',
  swim: 'Swimming',
  wrestling: 'Wrestling',
  volleyball: 'Volleyball',
  tennis: 'Tennis',
  golf: 'Golf',
}

export default function ProgramsPage() {
  const programs = getActivePrograms()

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-widest text-[var(--color-ll-primary)] mb-3 font-medium">
          Community Programs
        </p>
        <h1
          className="text-4xl md:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
        >
          NE Alabama School Programs
        </h1>
        <p className="text-lg text-stone-400 max-w-xl leading-relaxed">
          Buy merch. Become a sponsor. Keep these programs alive.
          A percentage of every merch sale goes directly back to the team.
        </p>
      </header>

      {programs.length === 0 ? (
        <div className="border border-stone-800 rounded-xl p-8 text-center text-stone-500">
          <p className="mb-4">Programs are being added. PVXC is live.</p>
          <Link href="/merch/pvxc" className="text-[var(--color-ll-primary)] hover:underline">
            PV Raiders XC Merch →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {programs.map((p) => (
            <div
              key={p.slug}
              className="border border-stone-800 rounded-xl overflow-hidden bg-stone-900/50 hover:border-stone-600 transition-colors"
            >
              <div
                className="h-2"
                style={{ background: p.heroColor }}
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                  {p.city} · {CATEGORY_LABELS[p.category] ?? p.category}
                </p>
                <h2
                  className="text-xl mb-1"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
                >
                  {p.school}
                </h2>
                <p className="text-sm text-stone-400 mb-1">
                  {p.mascot} {p.name}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed mb-5">
                  {p.description.slice(0, 100)}…
                </p>
                <div className="flex gap-3 flex-wrap">
                  {p.merchHref && (
                    <Link
                      href={p.merchHref}
                      className="text-sm px-4 py-2 bg-[var(--color-ll-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Buy Merch
                    </Link>
                  )}
                  <Link
                    href={`/api/sponsorship/checkout?tier=trail&program=${p.slug}`} prefetch={false}
                    className="text-sm px-4 py-2 border border-stone-600 text-stone-300 rounded-lg hover:border-stone-400 hover:text-white transition-colors"
                  >
                    Sponsor — $49/mo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="mt-16 border border-stone-800 rounded-xl p-8 bg-stone-900/30">
        <h2
          className="text-2xl mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
        >
          Add your program
        </h2>
        <p className="text-stone-400 text-sm leading-relaxed mb-4">
          Coach or parent? If your school program is in NE Alabama, we want to help.
          We&apos;ll set up a merch page, handle orders, and send 25% back to your team.
          No upfront cost.
        </p>
        <a
          href={`mailto:matt@gatherstudio.app?subject=Add%20our%20program%20to%20Southern%20Legends&body=School%3A%0AProgram%20%2F%20sport%3A%0ACoach%20name%3A%0AContact%20phone%3A%0A`}
          className="inline-block text-sm px-5 py-2.5 bg-[var(--color-ll-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Get in touch →
        </a>
      </section>

      <section className="mt-8 text-center">
        <p className="text-stone-500 text-sm">
          Want site-wide sponsorship?{' '}
          <Link href="/sponsor" className="text-[var(--color-ll-primary)] hover:underline">
            See all sponsor tiers →
          </Link>
        </p>
      </section>
    </main>
  )
}
