import Link from "next/link";
import type { ReactNode } from "react";
import type { Profile } from "@/lib/profiles";
import type { JournalPost } from "@/lib/journal";
import ProfileCardHero from "./ProfileCardHero";
import JournalCard from "./JournalCard";
import SectionLinks from "./SectionLinks";

export interface HubLink {
  label: string;
  href: string;
}

interface SectionHubProps {
  /** Small kicker above the title, e.g. "Southern Legends · Arts". */
  kicker: string;
  title: string;
  /** One line in Matt's voice. Plain, grounded. */
  intent: string;
  profiles: Profile[];
  essays: JournalPost[];
  /** Sub-sections rendered as a quiet row of links under the intro (navigation, not asks). */
  subLinks?: HubLink[];
  /** Back link for sub-hubs, e.g. { label: "Arts", href: "/arts" }. */
  parent?: HubLink;
  /** Optional extra block (a short "worth knowing" list). Rendered on the light surface. */
  children?: ReactNode;
  /** The ONE ask at the bottom of the page. */
  cta: { heading: string; body: string; label: string; href: string };
  /** Section href, so the cross-links row skips itself. */
  current: string;
}

/**
 * One template for every section hub (redesign B-03), built on the Stories index:
 * gradient hero with a one-line intent → story grid → essay list → one CTA.
 */
export default function SectionHub({ kicker, title, intent, profiles, essays, subLinks, parent, children, cta, current }: SectionHubProps) {
  const count = profiles.length + essays.length;
  const countLabel = count === 0 ? "Nothing here yet." : `${count} ${count === 1 ? "piece" : "pieces"} so far.`;

  return (
    <main id="main-content">
      <section className="gradient-hero no-pseudo-topo" style={{ position: "relative" }}>
        <div aria-hidden="true" className="grid-topo" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-10 md:pt-36 md:pb-12">
          {parent && (
            <Link
              href={parent.href}
              className="inline-block mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-ll-accent hover:text-white transition-colors"
            >
              ← {parent.label}
            </Link>
          )}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(250,220,150,0.9)" }}>
            {kicker}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.0,
              color: "#FAFAF7",
              fontVariationSettings: '"opsz" 72',
            }}
          >
            {title}
          </h1>
          <p className="mt-5 text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "rgba(250,250,247,0.72)" }}>
            {intent}
          </p>
          <p className="mt-3 text-sm" style={{ color: "rgba(250,250,247,0.45)" }}>
            {countLabel}
          </p>
          {subLinks && subLinks.length > 0 && (
            <nav aria-label={`${title} sections`} className="mt-6 flex flex-wrap gap-2">
              {subLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold px-3.5 py-1.5 rounded-full border border-white/25 text-white/85 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {l.label} →
                </Link>
              ))}
            </nav>
          )}
        </div>

        {profiles.length > 0 && (
          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, i) => (
                <div key={profile.slug} className="animate-on-scroll" style={{ transitionDelay: `${i * 50}ms` }}>
                  <ProfileCardHero profile={profile} />
                </div>
              ))}
            </div>
          </div>
        )}
        {profiles.length === 0 && essays.length === 0 && (
          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
            <p className="text-white/60">First pieces are in the works. If you know someone who belongs here, the ask is at the bottom.</p>
          </div>
        )}
      </section>

      {essays.length > 0 && (
        <section className="bg-ll-warm border-t border-ll-border py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ll-text-light mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Essays
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {essays.map((p) => (
                <JournalCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {children && (
        <section className="bg-ll-light border-t border-ll-border py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">{children}</div>
        </section>
      )}

      {/* The one ask */}
      <section className="bg-ll-light border-t border-ll-border py-12 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-xl font-bold text-ll-dark mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            {cta.heading}
          </h2>
          <p className="text-sm text-ll-text mb-6 max-w-sm mx-auto">{cta.body}</p>
          <Link
            href={cta.href}
            className="btn-primary inline-block px-7 py-3 bg-ll-primary text-white font-bold text-sm rounded-md hover:bg-ll-primary-dark"
          >
            {cta.label} →
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <SectionLinks current={current} />
        </div>
      </section>
    </main>
  );
}
