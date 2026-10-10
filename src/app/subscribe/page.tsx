export const revalidate = 300

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import SubscribeCTA from "@/app/components/SubscribeCTA";

export const metadata: Metadata = {
  title: "Subscribe",
  description: `Get stories from Northeast Alabama delivered to your inbox — profiles of local makers and personal writing from Matt Headley.`,
  alternates: {
    canonical: "/subscribe",
  },
  openGraph: {
    url: "/subscribe",
  },
};

export default function SubscribePage() {
  return (
    <main className="page-top" style={{ background: "var(--color-ll-dark)" }}>
      <SubscribeCTA variant="section" headingAs="h1" />
    </main>
  );
}
