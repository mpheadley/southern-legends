"use client";

import { useRef } from "react";
import type React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps {
  title: string;
  titleHtml?: string;
  subtitle?: string;
  eyebrow?: string;
  heroImage: string;
  heroAlt: string;
  heroPosition?: string;
  heroTextBottom?: boolean;
  heroFontSize?: string;
  displayTitle?: boolean;
  slug?: string;
  cardFont?: "serif" | "serif-bold" | "serif-italic" | "serif-caps" | "condensed";
  /** Photo attribution (e.g. "Jane Doe, CC BY-SA 2.0, via Wikimedia Commons") —
   * rendered as a small corner credit on the hero image. Was a typed frontmatter
   * field (ProfileFrontmatter.photoCredit) that nothing ever rendered — fixed 2026-10-01. */
  photoCredit?: string;
}

export default function ParallaxHero({
  title,
  titleHtml,
  subtitle,
  eyebrow,
  heroImage,
  heroAlt,
  heroPosition,
  heroTextBottom = false,
  heroFontSize,
  displayTitle = false,
  slug,
  cardFont,
  photoCredit,
}: ParallaxHeroProps) {
  const heroFontStyle: React.CSSProperties["fontStyle"] = cardFont === "serif-italic" ? "italic" : "normal";
  const heroFontWeight = cardFont === "serif-bold" ? 700 : undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;

      const isMobile = window.innerWidth <= 768;

      if (!heroTextBottom) {
        gsap.set(".ph-eyebrow", { y: 24, opacity: 0 });
        gsap.set(".ph-title", { y: 32, opacity: 0 });
        gsap.set(".ph-subtitle", { y: 20, opacity: 0 });
        gsap.set(".ph-scroll-hint", { y: 16, opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".ph-eyebrow", { opacity: 1, y: 0, duration: 1, delay: 0.3 })
          .to(".ph-title", { opacity: 1, y: 0, duration: 1.3 }, "-=0.6")
          .to(".ph-subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
          .to(".ph-scroll-hint", { opacity: 1, y: 0, duration: 1 }, "-=0.4");
      }

      gsap.to(".ph-bg", {
        y: isMobile ? "-8%" : "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: ".ph-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <section
        className="ph-hero st-hero"
        style={slug ? ({ viewTransitionName: `profile-hero-${slug}` } as React.CSSProperties) : undefined}
      >
        {/* The bg moves up by 20% of its own height while the hero scrolls out. At 120%
            tall it bottomed out at 96% of the hero and left a dark gap. It needs
            height × (1 − 0.20) ≥ 100%, so 135% keeps the image covering with margin. */}
        <div className="ph-bg st-hero-bg" style={{ top: 0, height: "135%" }}>
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover ph-hero-img"
            style={{ objectPosition: heroPosition ?? "center center" }}
          />
          <div
            aria-hidden="true"
            className={heroTextBottom ? "ph-overlay ph-overlay--bottom" : "ph-overlay ph-overlay--side"}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          />
        </div>

        {photoCredit && (
          <p
              style={{
                position: "absolute", bottom: "0.5rem", right: "0.75rem", zIndex: 3,
                margin: 0, fontSize: "1rem", fontWeight: 500, color: "rgba(255,255,255,0.92)",
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              }}
            >
            Photo: {photoCredit}
            </p>
          )}
        {heroTextBottom ? (
          <div
            className="ph-bottom-bar"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              padding: "clamp(1.5rem, 4vh, 2.5rem) clamp(1.5rem, 5vw, 4rem)",
            }}
          >
            {eyebrow && (
              <p
                className="ph-eyebrow st-hero-eyebrow"
                style={{ margin: 0, marginBottom: "0.4rem", opacity: 1, transform: "none" }}
              >
                {eyebrow}
              </p>
            )}
            <h1
              className={`ph-title st-hero-title${displayTitle ? " profile-title-display" : ""}`}
              style={{ margin: 0, opacity: 1, transform: "none", fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
            >
              {title}
            </h1>
          </div>
        ) : (
          <div
            className="st-hero-content"
            style={{ paddingTop: "clamp(6rem, 14vh, 9rem)" }}
          >
            {eyebrow && <p className="ph-eyebrow st-hero-eyebrow">{eyebrow}</p>}
            {titleHtml ? (
              <h1
                className={`ph-title st-hero-title${displayTitle ? " profile-title-display" : ""}`}
                style={{ ...(heroFontSize ? { fontSize: heroFontSize } : {}), fontStyle: heroFontStyle, ...(heroFontWeight ? { fontWeight: heroFontWeight } : {}) }}
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />
            ) : (
              <h1
                className={`ph-title st-hero-title${displayTitle ? " profile-title-display" : ""}`}
                style={{ ...(heroFontSize ? { fontSize: heroFontSize } : {}), fontStyle: heroFontStyle, ...(heroFontWeight ? { fontWeight: heroFontWeight } : {}) }}
              >{title}</h1>
            )}
            {subtitle && (
              <div
                className="ph-subtitle ph-subtitle-card st-hero-subtitle"
                style={{
                  display: "inline-block",
                  background: "rgba(20, 16, 14, 0.25)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "0.5rem",
                  padding: "0.875rem 1.25rem",
                  maxWidth: "38rem",
                }}
              >
                <p style={{ margin: 0 }}>{subtitle}</p>
              </div>
            )}
            <p className="ph-scroll-hint st-hero-scroll-hint">Scroll to read ↓</p>
          </div>
        )}
      </section>
    </div>
  );
}
