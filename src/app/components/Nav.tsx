"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMoreOpen(false); };
    const onClick = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [moreOpen]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Stories", href: "/profiles" },
    { label: "Map", href: "/map" },
    { label: "Places", href: "/places" },
    { label: "Essays", href: "/essays" },
    { label: "Books", href: "/books" },
    { label: "About", href: "/about" },
  ];
  const moreLinks = [
    { label: "Guides", href: "/listicles" },
    { label: "Arts", href: "/arts" },
    { label: "The Land", href: "/land" },
    { label: "Theology", href: "/theology" },
    { label: "Merch", href: "/merch" },
  ];
  const supportLink = { label: "Support", href: "/support" };

  // Mobile: grouped by intent instead of a flat wall of 11 links.
  const mobileGroups = [
    { title: "Read", links: [
      { label: "Stories", href: "/profiles" },
      { label: "Essays", href: "/essays" },
      { label: "Guides", href: "/listicles" },
      { label: "Books", href: "/books" },
    ]},
    { title: "Explore", links: [
      { label: "Map", href: "/map" },
      { label: "Places", href: "/places" },
      { label: "The Land", href: "/land" },
      { label: "Arts", href: "/arts" },
    ]},
    { title: "More", links: [
      { label: "Theology", href: "/theology" },
      { label: "About", href: "/about" },
      { label: "Merch", href: "/merch" },
    ]},
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-ll-dark/95 backdrop-blur-sm ${
          scrolled ? "shadow-lg py-2" : "py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          {/* Wordmark */}
          <Link href="/" className="shrink-0">
            <span
              className="font-bold text-xl tracking-tight text-white uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Southern Legends
            </span>
          </Link>

          {/* Nav links — left-aligned after wordmark */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* More — groups the secondary sections */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1 min-h-[44px] px-1"
                aria-haspopup="true"
                aria-expanded={moreOpen}
              >
                More
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className={`absolute left-0 top-full pt-2 transition-all duration-150 ${moreOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="bg-ll-dark border border-white/10 rounded shadow-lg py-2 min-w-[9rem]">
                  {moreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Spacer */}
          <div className="hidden md:block flex-1" />

          {/* Support button — right side, desktop */}
          <Link
            href={supportLink.href}
            className="hidden md:inline-block px-4 py-1.5 bg-ll-primary text-white text-xs font-semibold uppercase tracking-[0.15em] rounded hover:bg-ll-primary-dark transition-colors"
          >
            {supportLink.label}
          </Link>

          {/* Search icon — right side */}
          <Link
            href="/search"
            className="hidden md:flex text-white/50 hover:text-white transition-colors"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {/* RSS icon — right side */}
          <a
            href="/profiles/feed.xml"
            className="hidden md:flex text-white/50 hover:text-white transition-colors"
            aria-label="RSS Feed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.115-15.793-15.839-15.82zm0-8.18v4.819c12.951.115 23.363 10.627 23.478 23.625h.022v-4.819h-.022c-.115-13.262-10.873-23.861-23.478-23.625z" />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <div className="flex-1 md:hidden" />
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay — grouped, left-aligned, scrollable */}
      <div
        className={`fixed inset-0 z-[60] bg-ll-dark/98 backdrop-blur-sm overflow-y-auto transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="min-h-full flex flex-col px-7 pt-6 pb-10">
          {/* Top row: wordmark + close */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="font-bold text-lg text-white uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-heading)" }}
              onClick={() => setMobileOpen(false)}
            >
              Southern Legends
            </Link>
            <button
              className="text-white p-2 -mr-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search — full-width entry point */}
          <Link
            href="/search"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 mb-7 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-sm font-medium">Search everything</span>
          </Link>

          {/* Grouped sections */}
          {mobileGroups.map((group) => (
            <div key={group.title} className="mb-7">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ll-accent/70 mb-1.5">
                {group.title}
              </p>
              <div className="flex flex-col">
                {group.links.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
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

          {/* Support — anchored CTA */}
          <Link
            href={supportLink.href}
            onClick={() => setMobileOpen(false)}
            className="mt-auto w-full text-center px-6 py-3.5 bg-ll-primary text-white text-lg font-semibold rounded-lg hover:bg-ll-primary-dark transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Support Southern Legends
          </Link>
          <a
            href="/profiles/feed.xml"
            className="mt-4 flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-xs font-medium uppercase tracking-[0.15em] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.115-15.793-15.839-15.82zm0-8.18v4.819c12.951.115 23.363 10.627 23.478 23.625h.022v-4.819h-.022c-.115-13.262-10.873-23.861-23.478-23.625z" />
            </svg>
            RSS
          </a>
        </div>
      </div>
    </>
  );
}
