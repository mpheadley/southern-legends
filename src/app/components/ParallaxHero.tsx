"use client";

import { useRef, useState, useEffect } from "react";
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
}

export default function ParallaxHero({
  title,
  titleHtml,
  subtitle,
  eyebrow,
  heroImage,
  heroAlt,
  heroPosition,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useGSAP(
    () => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;

      gsap.set(".ph-eyebrow", { y: 24, opacity: 0 });
      gsap.set(".ph-title", { y: 32, opacity: 0 });
      gsap.set(".ph-subtitle", { y: 20, opacity: 0 });
      gsap.set(".ph-scroll-hint", { y: 16, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ph-eyebrow", { opacity: 1, y: 0, duration: 1, delay: 0.3 })
        .to(".ph-title", { opacity: 1, y: 0, duration: 1.3 }, "-=0.6")
        .to(".ph-subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(".ph-scroll-hint", { opacity: 1, y: 0, duration: 1 }, "-=0.4");

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
      <section className="ph-hero st-hero">
        <div className="ph-bg st-hero-bg" style={{ top: 0, height: "120%" }}>
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            className="object-cover"
            style={{ objectPosition: isMobile ? "center 35%" : (heroPosition ?? "center center") }}
          />
        </div>
        <div className="st-hero-content" style={{ paddingTop: "clamp(6rem, 14vh, 9rem)" }}>
          {eyebrow && <p className="ph-eyebrow st-hero-eyebrow">{eyebrow}</p>}
          {titleHtml ? (
            <h1
              className="ph-title st-hero-title"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          ) : (
            <h1 className="ph-title st-hero-title">{title}</h1>
          )}
          {subtitle && (
            <div
              className="ph-subtitle st-hero-subtitle"
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
      </section>
    </div>
  );
}
