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
    <main>
      <SubscribeCTA variant="section" />
    </main>
  );
}
