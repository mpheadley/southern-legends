"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/profiles";

function headlineClass(title: string) {
  const len = title.length;
  if (len <= 20) return "hero-headline-lg";
  if (len <= 40) return "hero-headline";
  return "hero-headline-sm";
}

interface HeroCarouselProps {
  profiles: Profile[];
}

export default function HeroCarousel({ profiles }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setCurrent((i) => (i + 1) % profiles.length);
  }, [profiles.length]);

  useEffect(() => {
    if (paused || profiles.length <= 1) return;
    const id = setInterval(advance, 4000);
    return () => clearInterval(id);
  }, [advance, paused, profiles.length]);

  if (profiles.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + profiles.length) % profiles.length);
  const next = () => setCurrent((i) => (i + 1) % profiles.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Arrow + slide wrapper — relative so arrows can position freely without being clipped */}
      <div className="relative h-[300px] md:h-[620px]">

        {/* Prev arrow — sits just left of the image */}
        {profiles.length > 1 && (
          <button
            onClick={prev}
            className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            aria-label="Previous story"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Next arrow — right edge of text column */}
        {profiles.length > 1 && (
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            aria-label="Next story"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Clipped sliding area — inset to leave room for left arrow */}
        <div className="absolute inset-0 overflow-hidden">
        {/* Sliding track */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {profiles.map((profile, i) => {
            const mobileMode: "bg" | "stack" | "text" =
              profile.frontmatter.mobileHero ??
              (profile.frontmatter.heroImage ? "bg" : "text");
            const hasMobileImage =
              (mobileMode === "bg" || mobileMode === "stack") &&
              !!profile.frontmatter.heroImage;

            return (
            <Link
              key={profile.slug}
              href={`/profiles/${profile.slug}`}
              tabIndex={i === current ? 0 : -1}
              className="relative w-full h-full flex-shrink-0 group flex flex-col md:grid md:grid-cols-2 md:gap-12 items-center"
            >
              {/* Mobile background image (bg + stack modes) */}
              {hasMobileImage && (
                <div className="md:hidden absolute inset-0 z-0">
                  <Image
                    src={profile.frontmatter.heroImage}
                    alt={profile.frontmatter.heroAlt || profile.frontmatter.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                  <div
                    className={`absolute inset-0 ${
                      mobileMode === "stack"
                        ? "bg-gradient-to-t from-black/85 via-black/50 to-black/10"
                        : "bg-gradient-to-t from-black/80 via-black/50 to-black/30"
                    }`}
                  />
                </div>
              )}

              {/* Image — desktop only */}
              <div className="hidden md:block relative h-full overflow-hidden rounded-sm">
                {profile.frontmatter.heroImage ? (
                  <Image
                    src={profile.frontmatter.heroImage}
                    alt={profile.frontmatter.heroAlt || profile.frontmatter.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority={i === 0}
                  />
                ) : (
                  <div className="w-full h-full bg-ll-dark flex items-center justify-center">
                    <span
                      className="text-white/[0.06] select-none"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(14rem, 30vw, 28rem)",
                        fontWeight: 900,
                        lineHeight: 0.85,
                      }}
                      aria-hidden="true"
                    >
                      {profile.frontmatter.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className={`relative z-10 flex flex-col h-full w-full py-2 md:py-6 md:justify-between ${mobileMode === "stack" ? "justify-end" : "justify-between"}`}>
                {/* Top: title + subtitle + meta — min-h-0 allows flex shrink */}
                <div className="min-h-0 overflow-hidden">
                  {profile.frontmatter.titleHtml ? (
                    <h1
                      className={`text-white font-bold tracking-tight leading-[0.9] uppercase line-clamp-4 ${headlineClass(profile.frontmatter.title)}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                      dangerouslySetInnerHTML={{ __html: profile.frontmatter.titleHtml }}
                    />
                  ) : (
                    <h1
                      className={`text-white font-bold tracking-tight leading-[0.9] uppercase line-clamp-4 ${headlineClass(profile.frontmatter.title)}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {profile.frontmatter.title}
                    </h1>
                  )}
                  {profile.frontmatter.subtitle && (
                    <p
                      className="mt-4 text-white/70 text-sm md:text-base italic leading-relaxed max-w-md line-clamp-2"
                      style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
                    >
                      {profile.frontmatter.subtitle}
                    </p>
                  )}
                  <div className="mt-4 w-12 h-[2px] bg-white/30" aria-hidden="true" />
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/50 uppercase tracking-widest">
                    <span>{profile.frontmatter.name}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{profile.frontmatter.location}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{profile.readingTime}</span>
                  </div>
                </div>

                {/* Bottom: CTA — always visible */}
                <span className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-ll-accent group-hover:gap-3 transition-all duration-300">
                  Read the story
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          );
          })}
        </div>
        </div>{/* end overflow-hidden */}
      </div>{/* end relative wrapper */}

      {/* Nav dots — outside the clipped area, always visible */}
      {profiles.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {profiles.map((_, j) => (
            <button
              key={j}
              onClick={() => setCurrent(j)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                j === current
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Show story ${j + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
