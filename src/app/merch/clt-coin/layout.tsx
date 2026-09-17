import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CLT Commemorative Coin',
  description: 'A die-struck collectible coin for the Chief Ladiga Trail — five finishes, 40mm, with the Anniston to Piedmont route on the back.',
  alternates: { canonical: 'https://southernlegends.org/merch/clt-coin' },
  openGraph: {
    title: 'CLT Commemorative Coin',
    description: 'A die-struck collectible coin for the Chief Ladiga Trail — five finishes, 40mm, with the Anniston to Piedmont route on the back.',
    url: 'https://southernlegends.org/merch/clt-coin',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
