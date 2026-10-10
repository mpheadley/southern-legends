"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { Profile } from "@/lib/profiles";
import { resolveCardTitle } from "@/lib/card-title-style";



interface HeroCarouselProps {
  profiles: Profile[];
}

export default function HeroCarousel({ profiles }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setCurrent((i) => (i + 1) % profiles.length);
  }, [profiles.length]);

  const nudge = (fn: () => void) => {
    fn();
    setPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setPaused(false), 4000);
  };

  useEffect(() => {
    if (paused || profiles.length <= 1) return;
    const id = setInterval(advance, 2200);
    return () => clearInterval(id);
  }, [advance, paused, profiles.length]);

  if (profiles.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + profiles.length) % profiles.length);
  const next = () => setCurrent((i) => (i + 1) % profiles.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) next();
    else if (delta > 50) prev();
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "calc(100svh - 4rem)" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding track */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {profiles.map((profile, i) => {
          const { slug, frontmatter } = profile;
          const { name, location, heroImage, heroAlt, heroPosition, heroPositionMobile } = frontmatter;
          const { displayTitle, resolvedHtml, useHtml, titleStyle } = resolveCardTitle(frontmatter, {
            containerPx: 346,
            scale: 1.4,
            opsz: 72,
            extraStyle: { lineHeight: "1.0", overflowWrap: "normal", maxWidth: "100%" },
          });

          return (
            <Link
              key={slug}
              href={`/profiles/${slug}`}
              tabIndex={i === current ? 0 : -1}
              className="relative w-full h-full flex-shrink-0 block"
              style={{ viewTransitionName: `profile-hero-${slug}` } as React.CSSProperties}
            >
              {/* Image */}
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={heroAlt || name || frontmatter.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                  style={{ objectPosition: heroPositionMobile || heroPosition || "center center" }}
                />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: "#292524" }} />
              )}

              {/* Gradient */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(20,16,14,0.95) 0%, rgba(20,16,14,0.6) 35%, rgba(20,16,14,0.08) 65%, transparent 100%)",
                }}
              />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 flex flex-col gap-2">
                {/* Title */}
                {useHtml ? (
                  <h2
                    className="leading-[1.0]"
                    style={titleStyle}
                    dangerouslySetInnerHTML={{ __html: resolvedHtml! }}
                  />
                ) : (
                  <h2
                    className="leading-[1.0]"
                    style={titleStyle}
                  >
                    {displayTitle}
                  </h2>
                )}

                {/* Name · Location */}
                <p
                  className="leading-snug mt-1"
                  style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 300, fontSize: "1.5rem", color: "rgba(250,250,247,0.65)" }}
                >
                  {name}&nbsp;&nbsp;·&nbsp;&nbsp;{location}
                </p>
              </div>

              {/* Progress dots — pinned to bottom edge, centered */}
              {profiles.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 pb-5 flex justify-center items-center gap-1.5 pointer-events-none">
                  {profiles.map((_, j) => (
                    <span
                      key={j}
                      className="block h-[3px] rounded-full transition-all duration-300"
                      style={{
                        width: j === current ? "1.75rem" : "0.375rem",
                        backgroundColor: j === current ? "#FAFAF7" : "rgba(255,255,255,0.35)",
                      }}
                    />
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Prev / Next arrows */}
      {profiles.length > 1 && (
        <>
          <button
            onClick={() => nudge(prev)}
            aria-label="Previous story"
            className="absolute left-3 top-[65%] -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-opacity duration-200 opacity-50 hover:opacity-90"
            style={{ backgroundColor: "rgba(20,16,14,0.55)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7L9 12" stroke="#FAFAF7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => nudge(next)}
            aria-label="Next story"
            className="absolute right-3 top-[65%] -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-opacity duration-200 opacity-50 hover:opacity-90"
            style={{ backgroundColor: "rgba(20,16,14,0.55)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2L10 7L5 12" stroke="#FAFAF7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
