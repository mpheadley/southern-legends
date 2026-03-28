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
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Follow</p>
              <a
                href="/profiles/feed.xml"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                RSS Feed
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/20 my-10" />

        <SubscribeCTA variant="inline" />

        <hr className="border-white/20 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
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
