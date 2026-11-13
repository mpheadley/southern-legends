import type { NextConfig } from "next";
import { withGatherSites } from "@headley/gathersites/next-config";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': [
      'merch/**',
      'images/**',
      'audio/**',
      'assets/**',
      'print/**',
      'interviews/**',
      'sessions/**',
      'podcast-production/**',
      'book/**',
      'bipolar-brand/**',
      'public/audio/**',
      'public/images/**',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.webp',
      '**/*.mp4',
      '**/*.mp3',
      '**/*.m4a',
      '**/*.wav',
    ],
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // /faith share cards (tools/sl-faith-snapshot.py uploads them to Vercel Blob at runtime)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/faith/**" },
    ],
  },
  async redirects() {
    // B-10 (2026-10-21): /businesses retired, /places is the one city directory.
    // A city that had a /businesses page maps to its /places page; everything else lands on /places.
    const BUSINESS_CITIES_WITH_PLACES_PAGE =
      "adamsville|alabaster|alexandria|altoona|anniston|arab|ardmore|ashford|ashville|athens|atlanta|attalla|auburn|autaugaville|axis|bay-minette|bayou-la-batre|belle-mina|berry|bessemer|billingsley|birmingham|glencoe|jacksonville|ohatchee|oxford|piedmont|weaver";
    return [
      { source: "/businesses", destination: "/places", permanent: true },
      { source: `/businesses/:city(${BUSINESS_CITIES_WITH_PLACES_PAGE})`, destination: "/places/:city", permanent: true },
      { source: "/businesses/:path*", destination: "/places", permanent: true },
      { source: "/featured", destination: "/", permanent: true },
      { source: "/journal", destination: "/essays", permanent: true },
      { source: "/journal/:slug", destination: "/essays/:slug", permanent: true },
      { source: "/essays/the-return", destination: "/essays/five-fifteen", permanent: true },
      { source: "/woodstock", destination: "/print/woodstock", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// withGatherSites: transpiles the editor package, allows Vercel Blob photos in next/image,
// and appends an X-Frame-Options: SAMEORIGIN rule after this site's own DENY so /edit can
// show the live page in its preview iframe.
export default withGatherSites(nextConfig);
