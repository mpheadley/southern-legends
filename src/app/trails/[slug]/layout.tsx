import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trails',
  description: 'Guides and reviews for the trails of Northeast Alabama — distance, difficulty, surface, and the stories behind them.',
  openGraph: {
    title: 'Trails',
    description: 'Guides and reviews for the trails of Northeast Alabama — distance, difficulty, surface, and the stories behind them.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
