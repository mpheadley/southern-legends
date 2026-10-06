import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Members · Southern Legends',
  description: 'Access your Southern Legends member content.',
  robots: { index: false },
}

export default function MembersLoginPage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: 'var(--color-ll-light)' }}>
      <div className="w-full max-w-md">
        <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-accent)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Southern Legends
        </div>
        <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ll-dark)', fontWeight: 'normal' }}>
          Members Area
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6b6560', lineHeight: '1.7' }}>
          Enter the email address you subscribed with. Your access is tied to your email — no password needed.
        </p>
        <LoginClient />
        <p className="text-xs mt-6" style={{ color: '#9e968e' }}>
          Not a member?{' '}
          <a href="/support" style={{ color: 'var(--color-ll-accent)', textDecoration: 'underline' }}>
            Become a Reader, $5 a month →
          </a>
        </p>
      </div>
    </main>
  )
}
