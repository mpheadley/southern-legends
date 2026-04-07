"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedCard {
  slug: string;
  name: string;
  title: string;
  excerpt: string;
  location: string;
  category: string;
  heroImage: string;
  heroAlt: string;
  heroPosition?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  craftspeople: "#9A3412",
  food: "#CA8A04",
  music: "#6B4C8A",
  agriculture: "#3D6B4F",
  places: "#3D6B4F",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] || "#9A3412";
}

export default function FeaturedTilt({ cards }: { cards: FeaturedCard[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const hudDotRef = useRef<HTMLDivElement>(null);
  const hudTrackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Total panels = profile cards + 1 closing card
  const totalPanels = cards.length + 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion || cards.length === 0) return;

      // ── INITIAL STATES ──
      // All panels after first start below, tilted
      gsap.set(panelRefs.current.slice(1), { y: "110%", rotationX: 65 });

      // Text elements on all panels start hidden
      panelRefs.current.forEach((panel) => {
        if (!panel) return;
        const items = panel.querySelectorAll(".ft-stagger");
        gsap.set(items, { opacity: 0, y: 20 });
      });

      // First panel text entrance on load
      const firstPanel = panelRefs.current[0];
      if (firstPanel) {
        const items = firstPanel.querySelectorAll(".ft-stagger");
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          delay: 0.3,
          ease: "power2.out",
        });
      }

      // First panel Ken Burns — start immediately
      const firstBg = panelRefs.current[0]?.querySelector(".featured-panel-bg img");
      if (firstBg) {
        gsap.fromTo(
          firstBg,
          { scale: 1 },
          { scale: 1.06, duration: 8, ease: "none" }
        );
      }

      // HUD entrance
      gsap.set(hudRef.current, { opacity: 0 });
      gsap.to(hudRef.current, { opacity: 1, duration: 0.8, delay: 0.6 });

      // ── HUD DOT TRACKER ──
      function updateHUD(progress: number) {
        const track = hudTrackRef.current;
        const dot = hudDotRef.current;
        if (!track || !dot) return;
        gsap.set(dot, {
          y: progress * (track.offsetHeight - dot.offsetHeight),
        });
      }

      // ── PINNED SCROLL TIMELINE ──
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${(totalPanels - 1) * 1.0 * window.innerHeight}`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            updateHUD(self.progress);

            // Ken Burns: scale the active panel's image
            const activeIndex = Math.round(self.progress * (totalPanels - 1));
            panelRefs.current.forEach((panel, idx) => {
              if (!panel) return;
              const img = panel.querySelector(".featured-panel-bg img");
              if (!img) return;
              if (idx === activeIndex) {
                gsap.to(img, { scale: 1.06, duration: 4, ease: "none", overwrite: "auto" });
              } else {
                gsap.set(img, { scale: 1 });
              }
            });
          },
        },
      });

      for (let i = 1; i < totalPanels; i++) {
        const outgoing = panelRefs.current[i - 1];
        const incoming = panelRefs.current[i];

        // Exit: outgoing panel tips up
        pinTl.to(outgoing, {
          y: "-60%",
          rotationX: -65,
          ease: "none",
          duration: 2,
        });

        // Enter: incoming panel rises and flattens
        pinTl.to(
          incoming,
          {
            y: "0%",
            rotationX: 0,
            ease: "none",
            duration: 2,
          },
          "<"
        );

        // Text stagger starts at 40% through the transition
        if (incoming) {
          const items = incoming.querySelectorAll(".ft-stagger");
          pinTl.fromTo(
            items,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power2.out",
            },
            "<1.2" // 60% into the 2-duration tilt
          );
        }
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion, cards.length] }
  );

  if (cards.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-ll-dark">
        <p className="text-white/60 text-lg">No featured stories yet.</p>
      </section>
    );
  }

  return (
    <>
      {/* Progress HUD */}
      <nav
        className="featured-hud"
        ref={hudRef}
        aria-label="Story progress"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        <div className="featured-hud-track" ref={hudTrackRef}>
          <div className="featured-hud-dot" ref={hudDotRef} />
        </div>
        <div className="featured-hud-labels" aria-hidden="true">
          {cards.map((_, i) => (
            <span key={i}>{String(i + 1).padStart(2, "0")}</span>
          ))}
        </div>
      </nav>

      {/* Card-tilt section */}
      <section
        className="featured-pin-section"
        ref={sectionRef}
        style={{ perspective: "1200px" }}
      >
        <h1 className="sr-only">Featured Stories</h1>

        {/* Profile cards */}
        {cards.map((card, i) => (
          <div
            key={card.slug}
            className={`featured-panel ${reducedMotion && i > 0 ? "featured-panel-reduced" : ""}`}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
          >
            {/* Background image */}
            <div className="featured-panel-bg">
              {card.heroImage ? (
                <Image
                  src={card.heroImage}
                  alt={card.heroAlt || card.name}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover"
                  style={card.heroPosition ? { objectPosition: card.heroPosition } : undefined}
                />
              ) : (
                <div className="featured-panel-ghost">
                  <span className="ghost-initial">
                    {card.name.charAt(0)}
                  </span>
                </div>
              )}
              {/* Dark overlay for readability */}
              <div className="featured-panel-overlay" />
            </div>

            {/* Content overlay */}
            <div className="featured-panel-content ">
              <span
                className="featured-category-tag ft-stagger"
                style={{ backgroundColor: getCategoryColor(card.category) }}
              >
                {card.category}
              </span>

              <h2
                className="featured-panel-name ft-stagger"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {card.name}
              </h2>

              <p className="featured-panel-hook ft-stagger">{card.title}</p>

              <p className="featured-panel-location ft-stagger">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block mr-1 -mt-0.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {card.location}
              </p>

              <Link
                href={`/profiles/${card.slug}`}
                className="featured-panel-link ft-stagger"
              >
                Read the story
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>
        ))}

        {/* Closing card */}
        <div
          className={`featured-panel featured-closing ${reducedMotion ? "featured-panel-reduced" : ""}`}
          ref={(el) => {
            panelRefs.current[cards.length] = el;
          }}
        >
          <div className="featured-panel-bg">
            <div className="featured-closing-bg" />
            <div className="featured-panel-overlay" />
          </div>
          <div className="featured-closing-content">
            <p
              className="featured-closing-eyebrow ft-stagger"
            >
              Southern Legends
            </p>
            <p
              className="featured-closing-headline ft-stagger"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More stories from the foothills.
            </p>
            <div className="featured-closing-rule ft-stagger" />
            <Link
              href="/profiles"
              className="featured-panel-link ft-stagger"
            >
              See all stories
              <span aria-hidden="true"> →</span>
            </Link>
            <p className="featured-closing-attribution ft-stagger">
              Built by{" "}
              <a
                href="https://headleyweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="featured-closing-attribution-link"
              >
                Headley Web &amp; SEO
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
