import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SubscribeCTA from '@/app/components/SubscribeCTA'
import WoodstockMerch from './WoodstockMerch'

export const metadata: Metadata = {
  title: 'Woodstock 5K — Race-Day Guide',
  description:
    'Everything for the Publix Woodstock 5K in Anniston, Alabama — Saturday, August 1, 2026. Course, schedule, merch, and how to support the oldest continuous footrace in the Southeast.',
  alternates: { canonical: '/woodstock-5k' },
  openGraph: { url: '/woodstock', title: 'Woodstock 5K — Race-Day Guide' },
}

// Race-day facts (from the SL Woodstock 5K profile).
const RACE = {
  name: 'Publix Woodstock 5K',
  date: 'Saturday, August 1, 2026',
  window: '7:30 – 10:30 a.m.',
  where: 'Woodstock Avenue, near Anniston High School · Anniston, AL',
  champ: 'RRCA Alabama State 5K Championship',
  kids: 'Kidstock 1K runs alongside',
  host: 'Hosted by the Anniston Runners Club',
  cause: 'Proceeds → the Arc of Calhoun & Cleburne Counties + local schools',
  since: 'Run every August since 1981 — one of the oldest continuous footraces in the Southeast.',
}

export default function WoodstockPage() {
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: RACE.name,
    startDate: '2026-08-01T07:30:00-05:00',
    sport: 'Running',
    location: {
      '@type': 'Place',
      name: 'Woodstock Avenue, Anniston High School',
      address: { '@type': 'PostalAddress', addressLocality: 'Anniston', addressRegion: 'AL' },
    },
    organizer: { '@type': 'Organization', name: 'Anniston Runners Club' },
  }

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero — TODO: drop /images/profiles/woodstock-5k/start-line.webp to use a real race photo */}
      <section className="relative overflow-hidden bg-[#0f1c13] text-[#f0ede8]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_75%_-10%,rgba(232,114,42,0.18),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-14 md:pt-32 md:grid md:grid-cols-[1.4fr_1fr] md:gap-8 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#CA8A04]">
              Anniston · Calhoun County · Aug 1, 2026
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-black leading-tight">
              Woodstock 5K
            </h1>
            <p className="mt-2 text-lg text-[#9bb0a2]">{RACE.champ}</p>
            <p className="mt-4 max-w-prose text-[#cfe0d4]">{RACE.since}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#merch" className="rounded-full bg-[#E8722A] px-5 py-2.5 font-semibold text-[#180a02]">
                Shop race-day merch
              </a>
              <a href="#support" className="rounded-full border border-[#f0ede8]/30 px-5 py-2.5 font-semibold">
                Support the race
              </a>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center">
            <Image
              src="/print-files/WOODSTOCK-00-woodstock-avenue-oval-CREAM.png"
              alt="Woodstock Avenue Oval — Woodstock 5K, Anniston, Alabama"
              width={300}
              height={300}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Race facts */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="font-serif text-2xl font-black text-neutral-900">Race day</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            ['When', `${RACE.date} · ${RACE.window}`],
            ['Where', RACE.where],
            ['Championship', RACE.champ],
            ['Kids', RACE.kids],
            ['Host', RACE.host],
            ['Where the money goes', RACE.cause],
          ].map(([label, val]) => (
            <div key={label} className="rounded-xl border border-black/10 bg-[#faf7f2] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8a5a04]">{label}</p>
              <p className="mt-1 text-neutral-800">{val}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-600">
          Read the full story:{' '}
          <Link href="/profiles/woodstock-5k" className="font-semibold underline">
            Forty-Five Summers — the Woodstock 5K profile →
          </Link>
        </p>
      </section>

      {/* Merch */}
      <section id="merch" className="bg-[#f0ede8] py-14">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl font-black text-neutral-900">Race-day merch</h2>
          <p className="mt-2 max-w-prose text-neutral-700">
            Licensed through the Anniston Runners Club — a cut of every sale runs back to the
            club and the Arc of Calhoun & Cleburne Counties. Buying a shirt is another way to
            run the race without lacing up.
          </p>
          <div className="mt-8">
            <WoodstockMerch />
          </div>
        </div>
      </section>

      {/* Chief Ladiga Trail crosslink */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-black/10 bg-[#0f1c13] text-[#f0ede8] p-7 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CA8A04]">While you're here</p>
            <h2 className="mt-2 font-serif text-2xl font-black">Run the Chief Ladiga Trail</h2>
            <p className="mt-2 max-w-prose text-[#cfe0d4]">
              33.5 paved miles from Anniston to the Georgia line — the spine of Calhoun County's
              outdoor economy. Trailheads, events, and gear.
            </p>
          </div>
          <a
            href="https://chiefladigatrail.org"
            className="mt-4 md:mt-0 inline-block whitespace-nowrap rounded-full bg-[#E8722A] px-6 py-3 font-semibold text-[#180a02]"
          >
            Explore the trail →
          </a>
        </div>
      </section>

      {/* Support + Registry */}
      <section id="support" className="bg-[#faf7f2] py-14">
        <div className="mx-auto max-w-4xl px-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-7">
            <h2 className="font-serif text-2xl font-black text-neutral-900">Support</h2>
            <p className="mt-2 text-neutral-700">
              Southern Legends tells the stories of Northeast Alabama — free to read, reader-supported.
              Chip in and keep the stories coming.
            </p>
            <Link href="/support" className="mt-4 inline-block rounded-full bg-[#E8722A] px-5 py-2.5 font-semibold text-[#180a02]">
              Support Southern Legends →
            </Link>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-7">
            <h2 className="font-serif text-2xl font-black text-neutral-900">Sign up & registry</h2>
            <p className="mt-2 text-neutral-700">
              Register for events and manage signups through Gather Registry.
            </p>
            <a
              href="https://gather-registry.vercel.app"
              className="mt-4 inline-block rounded-full border border-black/20 px-5 py-2.5 font-semibold text-neutral-900"
            >
              Open Gather Registry →
            </a>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-2xl px-6 py-14 text-center">
        <h2 className="font-serif text-2xl font-black text-neutral-900">
          Get the next Anniston story
        </h2>
        <p className="mt-2 text-neutral-700">
          One email when there's something worth reading from Calhoun County. No noise.
        </p>
        <div className="mt-6">
          <SubscribeCTA variant="inline" source="woodstock-5k" />
        </div>
      </section>
    </main>
  )
}
