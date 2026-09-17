import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Say It Out Loud',
  description: 'A three-shirt mental health drop made in NE Alabama, for anyone who has been through it and stayed anyway.',
  alternates: { canonical: 'https://southernlegends.org/live' },
  openGraph: {
    title: 'Say It Out Loud',
    description: 'A three-shirt mental health drop made in NE Alabama, for anyone who has been through it and stayed anyway.',
    url: 'https://southernlegends.org/live',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
