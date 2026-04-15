import type { Metadata } from "next";
import { Source_Sans_3, Fraunces, Rock_Salt, Zeyada, Permanent_Marker, Caveat } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import CookieBanner from "./components/CookieBanner";
import LenisProvider from "./components/LenisProvider";
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
  axes: ["opsz"],
});

const rockSalt = Rock_Salt({
  variable: "--font-rock-salt",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const zeyada = Zeyada({
  variable: "--font-zeyada",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
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
        url: "/images/southern-legends-og.png",
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
    images: ["/images/southern-legends-og.png"],
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
      <body className={`${sourceSans.variable} ${fraunces.variable} ${rockSalt.variable} ${zeyada.variable} ${permanentMarker.variable} ${caveat.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ll-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <LenisProvider>
          <Nav />
          {children}
          <Footer />
          <ScrollReveal />
          <CookieBanner />
        </LenisProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
