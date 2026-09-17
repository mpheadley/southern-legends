import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy — Southern Legends',
  description: 'Order Southern Legends gear — shirts, stickers, and prints made for NE Alabama schools, races, and trails.',
  openGraph: {
    title: 'Buy — Southern Legends',
    description: 'Order Southern Legends gear — shirts, stickers, and prints made for NE Alabama schools, races, and trails.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
