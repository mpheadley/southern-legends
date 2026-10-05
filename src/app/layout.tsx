import MarginAisle from "@/app/components/MarginAisle";
import SiteAisleBand from "@/app/components/SiteAisleBand";
import type { Metadata } from "next";
import { Source_Sans_3, Fraunces, IM_Fell_English, Barlow_Condensed } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import CookieBanner from "./components/CookieBanner";
import LenisProvider from "./components/LenisProvider";
import SubscribePopup from "./components/SubscribePopup";
import SupportPopup from "./components/SupportPopup";
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

const imFell = IM_Fell_English({
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-im-fell",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-condensed",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
      {/* Built by Headley Web & SEO | headleyweb.com */}
      <body className={`${sourceSans.variable} ${fraunces.variable} ${imFell.variable} ${barlowCondensed.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ll-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <LenisProvider>
          <Nav />
          {children}
          <SiteAisleBand />
          <MarginAisle />
          <Footer />
          <ScrollReveal />
          <CookieBanner />
          <SubscribePopup />
          <SupportPopup />
        </LenisProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
