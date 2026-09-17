import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Program — Southern Legends',
  description: 'Share Southern Legends shirts, services, and events with your own referral link and earn on every sale you send our way.',
  alternates: { canonical: 'https://southernlegends.org/affiliate' },
  openGraph: {
    title: 'Affiliate Program — Southern Legends',
    description: 'Share Southern Legends shirts, services, and events with your own referral link and earn on every sale you send our way.',
    url: 'https://southernlegends.org/affiliate',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
