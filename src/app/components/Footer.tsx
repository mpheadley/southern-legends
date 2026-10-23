import { Link } from "next-view-transitions";
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
            <Link href="/">
              <p
                className="text-2xl font-bold text-white tracking-tight uppercase tracking-[0.08em] hover:text-ll-accent transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {siteConfig.name}
              </p>
            </Link>
            <p className="text-sm mt-2 text-white/70 max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12">
            <nav className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Navigate</p>
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

            <nav className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Sections</p>
              {siteConfig.footerSections.map((item) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Get Involved</p>
              <Link
                href="/nominate"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Nominate a Story
              </Link>
              <Link
                href="/support"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Support This Work
              </Link>
              <a
                href="https://ecclesiacommunity.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Ecclesia Community
              </a>
              <Link
                href="/affiliate"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Partner Program
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Follow</p>
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
                href={siteConfig.podcast.rssUrl}
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Southern Legends RSS feed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.115-15.793-15.839-15.82zm0-8.18v4.819c12.951.115 23.363 10.627 23.478 23.625h.022v-4.819h-.022c-.115-13.262-10.873-23.861-23.478-23.625z" />
                </svg>
                RSS Feed
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Listen</p>
              <a
                href={siteConfig.podcast.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Listen on Spotify"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>
              <a
                href={siteConfig.podcast.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Listen on Apple Podcasts"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.071 0 3.938.8 5.324 2.1a7.456 7.456 0 0 1 2.176 5.303c0 1.758-.61 3.373-1.622 4.645a7.435 7.435 0 0 1-1.757 1.654c.044-.225.069-.457.069-.695 0-1.99-1.614-3.604-3.604-3.604s-3.604 1.614-3.604 3.604c0 .238.025.47.069.695a7.435 7.435 0 0 1-1.757-1.654A7.43 7.43 0 0 1 5.5 11.903c0-2.07.84-3.945 2.199-5.315A7.458 7.458 0 0 1 12 4.5zm0 2.625a4.778 4.778 0 1 0 0 9.557 4.778 4.778 0 0 0 0-9.557zm0 1.875a2.903 2.903 0 1 1 0 5.807 2.903 2.903 0 0 1 0-5.807z"/>
                </svg>
                Apple Podcasts
              </a>
              <a
                href={siteConfig.podcast.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Watch on YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                </svg>
                YouTube
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
              href="https://matthewheadley.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-ll-accent transition-colors font-semibold"
            >
              Matt Headley
            </a>
            {" "}·{" "}
            <a
              href="https://plainspokenblueprint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-ll-accent transition-colors"
            >
              Gather Studio
            </a>
          </p>
          <div className="flex gap-6">
            <Link href="/colophon" className="hover:text-white/80 transition-colors">
              Colophon
            </Link>
            <Link href="/privacy" className="hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
