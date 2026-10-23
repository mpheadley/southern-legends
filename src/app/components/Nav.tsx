"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { Search, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Routes whose first screen is a dark hero or dark gradient band. The header is
 * transparent over those until the reader scrolls 40px, then goes opaque.
 * Everything else (light reading surfaces) gets the opaque header from the top.
 */
const HERO_EXACT = new Set(["/", "/profiles", "/merch", "/trails", "/parks", "/map", "/theology", "/land", "/arts", "/arts/music", "/arts/poetry", "/arts/theater"]);
const HERO_PREFIX = ["/profiles/", "/essays/", "/listicles/", "/trails/", "/parks/"];

function isHeroRoute(pathname: string): boolean {
  if (HERO_EXACT.has(pathname)) return true;
  return HERO_PREFIX.some((p) => pathname.startsWith(p));
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the sheet on route change.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const transparent = isHeroRoute(pathname) && !scrolled;
  const navLinks = siteConfig.nav;
  const mobileGroups = siteConfig.mobileNav;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent ? "bg-transparent py-4" : "bg-ll-dark/95 backdrop-blur-sm shadow-lg py-2.5"
        }`}
      >
        {/* Legibility scrim while transparent — fades out with the header */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-300 ${transparent ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.55), rgba(10,8,6,0))" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 flex items-center gap-6">
          {/* Wordmark: SL badge + the real wordmark image */}
          <Link href="/" className="shrink-0 flex items-center gap-3" aria-label="Southern Legends — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/sl-badge-72.webp" alt="" aria-hidden="true" width={36} height={36} className="w-8 h-8 md:w-9 md:h-9 rounded-[6px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sl-wordmark-text-white.webp"
              alt="Southern Legends"
              width={1491}
              height={96}
              className="h-4 md:h-5 w-auto"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
            />
          </Link>

          {/* Desktop links — six items, nothing hidden in a More menu */}
          <nav className="hidden md:flex items-center gap-5 ml-2" aria-label="Primary">
            {navLinks.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  style={{ textShadow: transparent ? "0 1px 2px rgba(0,0,0,0.5)" : undefined }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Support — the one call to action in the bar */}
          <Link
            href="/support"
            className="hidden md:inline-block px-4 py-1.5 bg-ll-primary text-white text-sm font-semibold uppercase tracking-[0.12em] rounded hover:bg-ll-primary-dark transition-colors"
          >
            Support
          </Link>

          <Link
            href="/search"
            className="hidden md:flex text-white/70 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={18} aria-hidden="true" />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile sheet — grouped, left-aligned, scrollable. Secondary sections live here and in the footer. */}
      <div
        className={`fixed inset-0 z-[60] bg-ll-dark/98 backdrop-blur-sm overflow-y-auto transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
      >
        <div className="min-h-full flex flex-col px-7 pt-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)} aria-label="Southern Legends — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/sl-badge-72.webp" alt="" aria-hidden="true" width={36} height={36} className="w-8 h-8 rounded-[6px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/sl-wordmark-text-white.webp" alt="Southern Legends" width={1491} height={96} className="h-4 w-auto" />
            </Link>
            <button
              type="button"
              className="text-white p-2 -mr-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={26} aria-hidden="true" />
            </button>
          </div>

          <Link
            href="/search"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 mb-7 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
          >
            <Search size={18} aria-hidden="true" />
            <span className="text-sm font-medium">Search everything</span>
          </Link>

          {mobileGroups.map((group) => (
            <div key={group.title} className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-ll-accent/80 mb-1.5">
                {group.title}
              </p>
              <div className="flex flex-col">
                {group.links.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`py-2.5 text-xl font-semibold transition-colors border-b border-white/5 ${
                        isActive ? "text-ll-accent" : "text-white hover:text-ll-accent"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <Link
            href="/support"
            onClick={() => setMobileOpen(false)}
            className="mt-auto w-full text-center px-6 py-3.5 bg-ll-primary text-white text-lg font-semibold rounded-lg hover:bg-ll-primary-dark transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Support Southern Legends
          </Link>
        </div>
      </div>
    </>
  );
}
