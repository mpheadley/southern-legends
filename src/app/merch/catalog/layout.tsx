import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merch Catalog',
  description: 'The full catalog of Southern Legends gear — shirts, hoodies, hats, stickers, prints, and more, made for NE Alabama schools, races, and trails.',
  alternates: { canonical: 'https://southernlegends.org/merch/catalog' },
  openGraph: {
    title: 'Merch Catalog',
    description: 'The full catalog of Southern Legends gear — shirts, hoodies, hats, stickers, prints, and more, made for NE Alabama schools, races, and trails.',
    url: 'https://southernlegends.org/merch/catalog',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
