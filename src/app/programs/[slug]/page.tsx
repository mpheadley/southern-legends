import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProgramBySlug, getActivePrograms } from '@/lib/programs'

export async function generateStaticParams() {
  return getActivePrograms().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = getProgramBySlug(slug)
  if (!p) return {}
  return {
    title: `${p.school} ${p.name} — Southern Legends`,
    description: p.description,
    alternates: { canonical: `/programs/${slug}` },
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProgramBySlug(slug)
  if (!p) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href="/programs"
        className="text-sm text-stone-500 hover:text-stone-300 transition-colors mb-8 inline-block"
      >
        ← All programs
      </Link>

      <div
        className="h-1 rounded-full mb-8"
        style={{ background: p.heroColor }}
      />

      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          {p.city} · {p.school}
        </p>
        <h1
          className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
        >
          {p.mascot} {p.name}
        </h1>
        <p className="text-stone-400 leading-relaxed">{p.description}</p>
      </header>

      {p.merchHref && (
        <section className="mb-10 border border-stone-800 rounded-xl p-6 bg-stone-900/40">
          <h2
            className="text-xl mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
          >
            Official Merch
          </h2>
          <p className="text-stone-400 text-sm mb-4">
            25% of every sale goes directly back to the {p.name} program.
          </p>
          <Link
            href={p.merchHref}
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: p.heroColor }}
          >
            Shop {p.mascot} Merch →
          </Link>
        </section>
      )}

      <section className="border border-stone-800 rounded-xl overflow-hidden">
        <div className="h-1" style={{ background: p.heroColor }} />
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">
            Become a sponsor
          </p>
          <h2
            className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-cream, #f5f0e8)' }}
          >
            Support the {p.mascot}
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-6">
            Your business name and logo appears on this page and in the SL footer.
            One line. Your brand. Direct support for a local team.
            Cancel any time.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-stone-700 rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Trail Sponsor</p>
              <p className="text-2xl font-bold text-white mb-1">$49<span className="text-base font-normal text-stone-500">/mo</span></p>
              <ul className="text-sm text-stone-400 space-y-1 mb-4">
                <li>✓ Name + link on this page</li>
                <li>✓ Logo in SL footer rotation</li>
                <li>✓ Monthly social card mention</li>
                <li>✓ Cancel any time</li>
              </ul>
              <Link
                href={`/api/sponsorship/checkout?tier=trail&program=${p.slug}`} prefetch={false}
                className="block text-center py-2 px-4 border border-stone-600 text-stone-300 rounded-lg text-sm hover:border-stone-400 hover:text-white transition-colors"
              >
                Become a Trail Sponsor
              </Link>
            </div>

            <div className="border rounded-lg p-4" style={{ borderColor: p.heroColor }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: p.heroColor }}>
                Landmark Sponsor
              </p>
              <p className="text-2xl font-bold text-white mb-1">$99<span className="text-base font-normal text-stone-500">/mo</span></p>
              <ul className="text-sm text-stone-400 space-y-1 mb-4">
                <li>✓ Everything in Trail</li>
                <li>✓ Logo on city pages ({p.city})</li>
                <li>✓ Monthly spotlight card</li>
                <li>✓ Priority placement</li>
              </ul>
              <Link
                href={`/api/sponsorship/checkout?tier=landmark&program=${p.slug}`} prefetch={false}
                className="block text-center py-2 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: p.heroColor }}
              >
                Become a Landmark Sponsor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 text-center">
        <p className="text-stone-500 text-sm">
          Questions?{' '}
          <a
            href="mailto:matt@gatherstudio.app"
            className="text-[var(--color-ll-primary)] hover:underline"
          >
            matt@gatherstudio.app
          </a>
        </p>
      </div>
    </main>
  )
}
