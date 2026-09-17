import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Woodstock 5K Merch — Southern Legends',
  description: 'Shirts and stickers for the Woodstock 5K and NE Alabama running crews. Pre-order online or grab one at the race.',
  alternates: { canonical: 'https://southernlegends.org/merch/woodstock' },
  openGraph: {
    title: 'Woodstock 5K Merch — Southern Legends',
    description: 'Shirts and stickers for the Woodstock 5K and NE Alabama running crews. Pre-order online or grab one at the race.',
    url: 'https://southernlegends.org/merch/woodstock',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
