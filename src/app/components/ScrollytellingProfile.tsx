"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface ProseImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface PanelSection {
  heading: string;
  text: string;
  detail: string;
  bgImage: string;
  bgAlt: string;
  bgPosition?: string;
  caption: string;
}

interface ProseSection {
  paragraphs: string[];
  image?: ProseImage;
  pullQuote?: string;
}

interface ScrollytellingConfig {
  heroTitle: string;
  heroTitleHtml: string;
  heroSubtitle: string;
  heroImage: string;
  heroAlt: string;
  heroPosition?: string;
  eyebrow: string;
  sections: Array<{ panel: PanelSection; prose: ProseSection }>;
  closingProse: string[];
  closingInfo?: string;
  slug: string;
  authorName: string;
  authorBio: string;
}

export default function ScrollytellingProfile({
  config,
}: {
  config: ScrollytellingConfig;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;

      // ── INITIAL STATES ──
      gsap.set(".st-hero-eyebrow", { y: 24 });
      gsap.set(".st-hero-title", { y: 32 });
      gsap.set(".st-hero-subtitle", { y: 20 });
      gsap.set(".st-hero-scroll-hint", { y: 16 });
      gsap.set(".st-panel-line", { scaleY: 0 });

      const pinSections = gsap.utils.toArray<HTMLElement>(".st-pin-section");

      pinSections.forEach((section) => {
        const panel = section.querySelector(".st-panel");
        if (!panel) return;
        const h2 = panel.querySelector("h2");
        const ps = [...panel.querySelectorAll("p:not(.st-panel-caption)")];
        const num = panel.querySelector(".st-panel-number");
        if (h2) gsap.set(h2, { y: "70vh" });
        gsap.set(ps, { autoAlpha: 0, y: "30vh" });
        if (num) gsap.set(num, { autoAlpha: 0 });
      });

      // ── HERO ENTRANCE ──
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .to(".st-hero-eyebrow", { opacity: 1, y: 0, duration: 1, delay: 0.4 })
        .to(".st-hero-title", { opacity: 1, y: 0, duration: 1.3 }, "-=0.6")
        .to(".st-hero-subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(
          ".st-hero-scroll-hint",
          { opacity: 1, y: 0, duration: 1 },
          "-=0.4"
        )
        .to(".st-hud", { opacity: 1, duration: 0.8 }, "-=0.3");

      // ── HERO PARALLAX ──
      const isMobile = window.innerWidth <= 768;
      gsap.to(".st-hero-bg", {
        y: isMobile ? "-15%" : "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: ".st-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── PROSE REVEALS ──
      gsap.utils
        .toArray<HTMLElement>(
          ".st-prose-block p, .st-prose-block blockquote, .st-prose-image"
        )
        .forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

      // ── PINNED PANELS ──
      pinSections.forEach((section) => {
        const panel = section.querySelector(".st-panel");
        if (!panel) return;
        const bg = panel.querySelector(".st-panel-bg-wrap");
        const h2 = panel.querySelector("h2");
        const ps = [
          ...panel.querySelectorAll("p:not(.st-panel-caption)"),
        ];
        const line = panel.querySelector(".st-panel-line");
        const num = panel.querySelector(".st-panel-number");
        const caption = panel.querySelector(".st-panel-caption");

        if (caption) gsap.set(caption, { autoAlpha: 0, y: 10 });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=300vh",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: false,
        });

        if (bg) {
          gsap.to(bg, {
            y: isMobile ? "-8%" : "-10%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=300vh",
              scrub: isMobile ? 0.5 : 1.5,
            },
          });
        }

        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none none",
          },
        });

        if (h2) enterTl.to(h2, { y: 0, ease: "power2.out", duration: 0.9 });
        if (line)
          enterTl.to(
            line,
            { scaleY: 1, ease: "power2.out", duration: 0.4 },
            "<0.3"
          );
        if (num) enterTl.to(num, { autoAlpha: 1, duration: 0.5 }, "<");
        enterTl.to(
          ps,
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.7,
            stagger: 0.15,
          },
          "<0.2"
        );
        if (caption) {
          enterTl.to(
            caption,
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.3"
          );
        }
      });

      // ── HUD ──
      const TRACK_H = 200;
      const labelSpans = [
        ...document.querySelectorAll<HTMLElement>(".st-hud-labels span"),
      ];
      const labelCount = labelSpans.length;
      labelSpans.forEach((span, i) => {
        span.style.top = (i / (labelCount - 1)) * TRACK_H + "px";
      });

      const pinTriggers = pinSections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
        })
      );

      window.addEventListener("scroll", () => {
        const scrollProgress =
          window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const dot = document.querySelector<HTMLElement>(".st-hud-dot");
        const track = document.querySelector<HTMLElement>(".st-hud-track");
        if (dot && track) {
          gsap.set(dot, {
            y: scrollProgress * (track.offsetHeight - dot.offsetHeight),
          });
        }
        let activeIndex = -1;
        pinTriggers.forEach((trigger, i) => {
          if (trigger.isActive) activeIndex = i;
        });
        labelSpans.forEach((s, i) =>
          s.classList.toggle("active", i === activeIndex)
        );
      });

      // ── OUTRO ──
      const outroTl = gsap.timeline({
        scrollTrigger: { trigger: ".st-outro", start: "top 75%" },
      });
      outroTl
        .from(".st-outro-label", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        })
        .from(
          ".st-outro-title",
          { opacity: 0, y: 30, duration: 1, ease: "power2.out" },
          "-=0.5"
        )
        .from(
          ".st-outro-links",
          { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .from(
          ".st-outro-credit",
          { opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  const panelCount = config.sections.length;

  return (
    <div ref={containerRef} style={{ background: "var(--color-ll-dark)" }}>
      {/* HUD */}
      <nav className="st-hud" aria-label="Story progress">
        <div className="st-hud-track">
          <div className="st-hud-dot" />
        </div>
        <div className="st-hud-labels" aria-hidden="true">
          {config.sections.map((_, i) => (
            <span key={i}>{String(i + 1).padStart(2, "0")}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="st-hero">
        <div className="st-hero-bg">
          <Image
            src={config.heroImage}
            alt={config.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={
              config.heroPosition
                ? { objectPosition: config.heroPosition }
                : undefined
            }
          />
        </div>
        <div className="st-hero-content">
          <p className="st-hero-eyebrow">{config.eyebrow}</p>
          <h1
            className="st-hero-title"
            dangerouslySetInnerHTML={{ __html: config.heroTitleHtml }}
          />
          <p className="st-hero-subtitle">{config.heroSubtitle}</p>
          <p className="st-hero-scroll-hint">Scroll to explore ↓</p>
        </div>
      </section>

      {/* Opening prose (before first panel) */}
      {config.sections[0] && (
        <section className="st-prose-section">
          <div className="st-prose-block">
            {config.sections[0].prose.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {config.sections[0].prose.image && (
              <figure className="st-prose-image">
                <Image
                  src={config.sections[0].prose.image.src}
                  alt={config.sections[0].prose.image.alt}
                  width={config.sections[0].prose.image.width}
                  height={config.sections[0].prose.image.height}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 650px"
                />
                <figcaption>
                  {config.sections[0].prose.image.caption}
                </figcaption>
              </figure>
            )}
          </div>
        </section>
      )}

      {/* Alternating panels + prose */}
      {config.sections.map((section, i) => (
        <div key={i}>
          {/* Pinned panel */}
          <section className="st-pin-section" id={`st-pin-${i + 1}`}>
            <div className="st-panel">
              <div className="st-panel-bg-wrap">
                <Image
                  src={section.panel.bgImage}
                  alt={section.panel.bgAlt}
                  fill
                  sizes="100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover"
                  style={
                    section.panel.bgPosition
                      ? { objectPosition: section.panel.bgPosition }
                      : undefined
                  }
                />
              </div>
              <div
                className="st-panel-number"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="st-panel-content">
                <div className="st-panel-line" aria-hidden="true" />
                <h2>{section.panel.heading}</h2>
                <p>{section.panel.text}</p>
                <p className="st-panel-detail">{section.panel.detail}</p>
              </div>
              <p className="st-panel-caption">{section.panel.caption}</p>
            </div>
          </section>

          {/* Prose after panel (skip first — already rendered above) */}
          {i < config.sections.length - 1 && config.sections[i + 1] && (
            <section className="st-prose-section">
              <div className="st-prose-block">
                {config.sections[i + 1].prose.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {config.sections[i + 1].prose.image && (
                  <figure className="st-prose-image st-prose-image--wide">
                    <Image
                      src={config.sections[i + 1].prose.image!.src}
                      alt={config.sections[i + 1].prose.image!.alt}
                      width={config.sections[i + 1].prose.image!.width}
                      height={config.sections[i + 1].prose.image!.height}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 750px"
                    />
                    <figcaption>
                      {config.sections[i + 1].prose.image!.caption}
                    </figcaption>
                  </figure>
                )}
                {config.sections[i + 1].prose.pullQuote && (
                  <blockquote className="st-pull-quote">
                    <p>{config.sections[i + 1].prose.pullQuote}</p>
                  </blockquote>
                )}
              </div>
            </section>
          )}
        </div>
      ))}

      {/* Closing prose */}
      <section className="st-prose-section st-prose-section--closing">
        <div className="st-prose-block">
          {config.closingProse.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {config.closingInfo && (
            <p
              className="st-prose-info"
              dangerouslySetInnerHTML={{ __html: config.closingInfo }}
            />
          )}
        </div>
      </section>

      {/* Author byline */}
      <section className="st-prose-section">
        <div className="st-prose-block">
          <div className="st-byline">
            <Image
              src="/images/about/headshot-hedcut-matt-headley.webp"
              alt={config.authorName}
              width={48}
              height={48}
              className="st-byline-photo"
            />
            <p className="st-byline-text">
              <Link href="/about" className="st-byline-name">
                {config.authorName}
              </Link>{" "}
              lives in Jacksonville, Alabama. He builds websites for local businesses at{" "}
              <a href="https://headleyweb.com" target="_blank" rel="noopener noreferrer" className="st-byline-link">headleyweb.com</a>
              {" "}and writes about the people and places he finds along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="st-outro">
        <p className="st-outro-label">A Southern Legends Profile</p>
        <h2 className="st-outro-title">
          Read the full story
          <br />
          on <em>Southern Legends</em>
        </h2>
        <div className="st-outro-links">
          <Link href={`/profiles`} className="st-outro-cta">
            Explore All Stories
          </Link>
        </div>
        <div className="st-outro-credit">
          <p>
            Built by{" "}
            <a
              href="https://headleyweb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Headley Web & SEO
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
