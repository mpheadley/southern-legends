import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masthead',
  description: 'The editors and contributors behind Southern Legends — writers who know Northeast Alabama and the Southern diaspora from the inside.',
  alternates: { canonical: 'https://southernlegends.org/masthead' },
  openGraph: {
    title: 'Masthead',
    description: 'The editors and contributors behind Southern Legends — writers who know Northeast Alabama and the Southern diaspora from the inside.',
    url: 'https://southernlegends.org/masthead',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
