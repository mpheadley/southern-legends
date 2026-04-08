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
  titleHtml?: string;
  subtitle?: string;
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
  // Captured once at mount — never changes even when Safari dvh reflows
  const stableVh = useRef<number>(0);
  // Track active index to only create Ken Burns tweens on change, not every frame
  const lastActiveIndexRef = useRef<number>(-1);
  const kenBurnsTweensRef = useRef<(gsap.core.Tween | null)[]>([]);

  const totalPanels = cards.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock section height to the initial window.innerHeight (Safari dvh fix).
  // Also store it in stableVh so GSAP uses the same value and never recalculates.
  useEffect(() => {
    stableVh.current = window.innerHeight;
    if (sectionRef.current) {
      sectionRef.current.style.height = `${stableVh.current}px`;
    }
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
          end: `+=${(totalPanels - 1) * (stableVh.current || window.innerHeight)}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            updateHUD(self.progress);

            // Ken Burns: only create tweens when active index CHANGES, not every frame
            const activeIndex = Math.round(self.progress * (totalPanels - 1));
            if (activeIndex !== lastActiveIndexRef.current) {
              lastActiveIndexRef.current = activeIndex;
              panelRefs.current.forEach((panel, idx) => {
                if (!panel) return;
                const img = panel.querySelector(".featured-panel-bg img");
                if (!img) return;

                // Kill any existing tween for this panel
                if (kenBurnsTweensRef.current[idx]) {
                  kenBurnsTweensRef.current[idx]!.kill();
                }

                if (idx === activeIndex) {
                  // Reset scale, then start Ken Burns zoom
                  gsap.set(img, { scale: 1 });
                  kenBurnsTweensRef.current[idx] = gsap.to(img, {
                    scale: 1.06,
                    duration: 8,
                    ease: "none",
                  });
                } else {
                  // Reset inactive panels
                  gsap.set(img, { scale: 1 });
                  kenBurnsTweensRef.current[idx] = null;
                }
              });
            }
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
                  sizes="(max-width: 639px) 50vw, 100vw"
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

            {/* Content overlay — entire content card is clickable */}
            <Link href={`/profiles/${card.slug}`} className="featured-panel-content">
              <span
                className="featured-category-tag ft-stagger"
                style={{ backgroundColor: getCategoryColor(card.category) }}
              >
                {card.category}
              </span>

              {card.titleHtml ? (
                <h2
                  className="featured-panel-name ft-stagger"
                  style={{ fontFamily: "var(--font-heading)" }}
                  dangerouslySetInnerHTML={{ __html: card.titleHtml }}
                />
              ) : (
                <h2
                  className="featured-panel-name ft-stagger"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {card.title}
                </h2>
              )}

              {card.subtitle && (
                <p className="featured-panel-hook ft-stagger">{card.subtitle}</p>
              )}

              <p className="featured-panel-location ft-stagger">
                {card.name}&ensp;&middot;&ensp;{card.location}
              </p>

              <span className="featured-panel-link ft-stagger">
                Read the story →
              </span>
            </Link>
          </div>
        ))}

      </section>
    </>
  );
}
