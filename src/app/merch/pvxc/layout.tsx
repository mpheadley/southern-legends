import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PV Raiders XC Merch',
  description: 'Official Pleasant Valley Cross Country shirts. Team $25 · Parents $30. 25% back to the Raiders XC program.',
  openGraph: {
    title: 'PV Raiders XC — Official Merch',
    description: 'Team $25 · Parents $30 · 25% back to the program. Order online or grab one at Woodstock 5K Aug 2.',
    images: [{ url: '/merch/pvxc-og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function PVXCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
