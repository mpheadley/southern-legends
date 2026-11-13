import type { Metadata } from "next";
import { Source_Sans_3, Fraunces } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { CmsProvider } from "@headley/gathersites/client";
import { SiteAdBand, MarginSlot } from "@/app/components/ScheduledAds";
import SiteChrome from "./components/SiteChrome";
import { TEXT_DEFAULTS } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Two faces only (B-11, 2026-10-21): Fraunces for headings and pull quotes, Source Sans 3 for
// body and labels. Barlow Condensed and IM Fell English are no longer loaded.

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/southern-legends-og.webp",
        width: 2396,
        height: 1250,
        alt: "Southern Legends — Stories from Northeast Alabama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/southern-legends-og.webp"],
  },
  authors: [{ name: siteConfig.author }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
    <html lang="en">
      <head>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [{ where: { href_matches: "/profiles/*" }, eagerness: "moderate" }],
            }),
          }}
        />
      </head>
      {/* Built by Gather Studio by Matt Headley | gatherstudio.app */}
      <body className={`${sourceSans.variable} ${fraunces.variable} antialiased`}>
        {/* GatherSites: published words layer over the built-in copy. storageKey "slContent"
            is this site's own draft key. SiteChrome skips nav/footer/ads/popups on /edit. */}
        <CmsProvider defaults={TEXT_DEFAULTS} storageKey="slContent">
          <SiteChrome
            adSlots={
              <>
                <SiteAdBand />
                <MarginSlot />
              </>
            }
          >
            {children}
          </SiteChrome>
        </CmsProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
