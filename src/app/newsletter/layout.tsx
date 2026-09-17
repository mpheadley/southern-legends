import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter — Southern Legends',
  description: 'One or two stories a week about the people, places, and events of Northeast Alabama that never make the newspaper. No ads, no sponsors.',
  alternates: { canonical: 'https://southernlegends.org/newsletter' },
  openGraph: {
    title: 'Newsletter — Southern Legends',
    description: 'One or two stories a week about the people, places, and events of Northeast Alabama that never make the newspaper. No ads, no sponsors.',
    url: 'https://southernlegends.org/newsletter',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
