import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Members · Southern Legends',
  description: 'Member-exclusive content from Southern Legends.',
  robots: { index: false },
}

const MEMBER_CONTENT = [
  {
    slug: 'the-hospital',
    title: 'The Hospital',
    description: 'What happened, and what I found on the other side of it.',
    tag: 'Personal Essay',
    status: 'coming-soon' as const,
  },
  {
    slug: 'ai-psychosis',
    title: 'The Manic Dream That Didn\'t Die',
    description: 'Twelve months of AI, mania, and the ideas that survived both.',
    tag: 'Personal Essay',
    status: 'coming-soon' as const,
  },
  {
    slug: 'silver-creek',
    title: 'Silver Creek',
    description: 'Notes from the road to Rome, Georgia. Two venues, one decision.',
    tag: 'Field Notes',
    status: 'coming-soon' as const,
  },
  {
    slug: 'shannon-jenkins-extended',
    title: 'Shannon Jenkins — The Full Conversation',
    description: 'The unedited interview: what he said at Called Coffee, word for word.',
    tag: 'Extended Interview',
    status: 'coming-soon' as const,
  },
  {
    slug: 'samuel-sawyer-extended',
    title: 'Samuel Sawyer — On Fear and Purpose',
    description: 'The full Q&A behind the Aquality Farms profile.',
    tag: 'Extended Interview',
    status: 'coming-soon' as const,
  },
  {
    slug: 'chief-ladiga-trail-notes',
    title: 'Chief Ladiga — The Research',
    description: 'Everything I found about the treaty, the town, and Ladiga\'s land.',
    tag: 'Research Notes',
    status: 'coming-soon' as const,
  },
]

async function LogoutButton() {
  return (
    <form action="/api/members/logout" method="POST">
      <button type="submit" className="text-xs underline" style={{ color: '#9e968e' }}>
        Sign out
      </button>
    </form>
  )
}

export default function MembersPage() {
  return (
    <main id="main-content" className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-accent)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Southern Legends
          </div>
          <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'normal', color: 'var(--color-ll-dark)' }}>
            Members Area
          </h1>
        </div>
        <LogoutButton />
      </div>

      <p className="text-sm mb-10" style={{ color: '#6b6560', lineHeight: '1.7' }}>
        Everything here is exclusive to subscribers — extended interviews, personal essays, field notes, and research that didn't make it into the published profiles.
      </p>

      <div className="flex flex-col gap-6">
        {MEMBER_CONTENT.map(item => (
          <div key={item.slug} className="border-t pt-6" style={{ borderColor: '#ddd6c8' }}>
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-accent)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {item.tag}
            </div>
            <h2 className="text-xl mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'normal', color: 'var(--color-ll-dark)' }}>
              {(item.status as string) === 'live' ? (
                <Link href={`/members/${item.slug}`} style={{ color: 'inherit' }}>{item.title}</Link>
              ) : (
                item.title
              )}
            </h2>
            <p className="text-sm" style={{ color: '#6b6560', lineHeight: '1.7' }}>{item.description}</p>
            {item.status === 'coming-soon' && (
              <span className="text-xs mt-1 inline-block" style={{ color: '#b0a898', fontStyle: 'italic' }}>Coming soon</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t text-xs" style={{ borderColor: '#ddd6c8', color: '#9e968e' }}>
        Questions? Email <a href="mailto:matt@gatherstudio.app" style={{ color: 'var(--color-ll-accent)' }}>matt@gatherstudio.app</a>
        {' · '}
        <a href="https://billing.stripe.com/p/login/bpc_1TezxsLAZU170UPnup6aRXfn" target="_blank" rel="noopener" style={{ color: 'var(--color-ll-accent)' }}>Manage subscription →</a>
      </div>
    </main>
  )
}
