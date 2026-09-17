import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parks',
  description: 'Guides and reviews for the parks and green spaces of Northeast Alabama — trails, difficulty, and what locals know.',
  openGraph: {
    title: 'Parks',
    description: 'Guides and reviews for the parks and green spaces of Northeast Alabama — trails, difficulty, and what locals know.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
