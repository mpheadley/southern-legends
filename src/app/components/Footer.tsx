import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import SubscribeCTA from "./SubscribeCTA";

export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden gradient-hero">
      {/* Dark scrim for legibility over gradient */}
      <div className="absolute inset-0 bg-black/50 z-[1]" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <p
              className="text-2xl font-bold text-white tracking-tight uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {siteConfig.name}
            </p>
            <p className="text-sm mt-2 text-white/70 max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <nav className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Navigate</p>
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Get Involved</p>
              <Link
                href="/nominate"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Nominate a Story
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Follow</p>
              <a
                href="https://www.facebook.com/SouthernLegendsAL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Southern Legends on Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </a>
              <a
                href="/profiles/feed.xml"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Southern Legends RSS feed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.115-15.793-15.839-15.82zm0-8.18v4.819c12.951.115 23.363 10.627 23.478 23.625h.022v-4.819h-.022c-.115-13.262-10.873-23.861-23.478-23.625z" />
                </svg>
                RSS Feed
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/20 my-10" />

        <SubscribeCTA variant="inline" />

        <hr className="border-white/20 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Built by{" "}
            <a
              href="https://headleyweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-ll-accent transition-colors font-semibold"
            >
              Headley Web &amp; SEO
            </a>
          </p>
          <Link href="/privacy" className="hover:text-white/80 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
