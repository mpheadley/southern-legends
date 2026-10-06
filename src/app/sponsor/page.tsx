import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sponsor a Story — Southern Legends",
  description:
    "Sponsor an honest Southern Legends story about your business. $250, labeled as sponsored, and you read it before it runs.",
  alternates: { canonical: "/sponsor" },
  openGraph: { url: "/sponsor" },
}

// One offer. The old $25/$75/$150 city tiers (and /api/sponsorship/checkout)
// are not shown here until a city page has traffic worth quoting.
const PHONE_DISPLAY = "(256) 644-7334"
const PHONE_TEL = "+12566447334"
const EMAIL = "matt@gatherstudio.app"

const WHAT_YOU_GET = [
  "An honest profile of your business, written by me in the same voice as every other story here",
  "Labeled “Sponsored” at the top, so readers know",
  "You read it before it runs. If I got a fact wrong, I fix it",
  "It goes to readers and the Southern Legends Facebook page the same week",
  "A mention in the next letter to subscribers",
]

export default function SponsorPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-[var(--color-ll-primary)] mb-3 font-medium">
          Sponsor a story
        </p>
        <h1
          className="text-4xl md:text-5xl mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ll-cream, #f5f0e8)" }}
        >
          I&apos;d write about you the way I write about everyone else
        </h1>
        <p className="text-lg text-stone-400 max-w-xl mx-auto leading-relaxed">
          Southern Legends readers grew up here, or they never stopped thinking about home.
          A sponsored story puts your business in front of them, told honestly.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--color-ll-primary)] bg-stone-900 p-8 mb-16">
        <h2
          className="text-2xl mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ll-cream, #f5f0e8)" }}
        >
          Sponsor a story
        </h2>
        <p className="text-4xl font-bold text-white mb-1">$250</p>
        <p className="text-xs text-stone-500 mb-6">One story. No contract, no monthly bill.</p>
        <ul className="text-sm text-stone-300 space-y-2 mb-8">
          {WHAT_YOU_GET.map((f) => (
            <li key={f} className="flex gap-2 items-start">
              <span className="text-[var(--color-ll-primary)] mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-stone-400 mb-4">Call or email to talk it over.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="block text-center py-2.5 px-5 rounded-lg text-sm font-medium bg-[var(--color-ll-primary)] text-white hover:bg-[var(--color-ll-primary-dark)] transition-colors"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Sponsor a story")}`}
            className="block text-center py-2.5 px-5 rounded-lg text-sm font-medium border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-white transition-colors"
          >
            Email {EMAIL}
          </a>
        </div>
      </section>

      <section className="border-t border-stone-800 pt-12">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ll-cream, #f5f0e8)" }}
        >
          What a sponsored story is, and isn&apos;t
        </h2>
        <div className="prose prose-stone prose-invert max-w-none text-stone-400 text-sm leading-relaxed space-y-3">
          <p>
            It&apos;s a real story. I come sit with you, I write what I see, and I put
            &ldquo;Sponsored&rdquo; at the top so nobody has to guess who paid for it.
          </p>
          <p>
            It isn&apos;t ad copy or a press release. You&apos;ll see it before it publishes,
            and if something&apos;s wrong, I&apos;ll fix it. But I&apos;m not going to make it
            sound like an ad. That&apos;s the only reason it&apos;s worth reading.
          </p>
        </div>
      </section>

      <section className="mt-12 border-t border-stone-800 pt-12 text-center">
        <p className="text-stone-500 text-sm">
          Want to support without sponsoring?{" "}
          <Link href="/support" className="text-[var(--color-ll-primary)] hover:underline">
            Become a Reader →
          </Link>
        </p>
      </section>
    </main>
  )
}
