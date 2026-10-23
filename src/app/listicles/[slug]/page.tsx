export const revalidate = 300;

import CrisisLine from "@/app/components/CrisisLine";
import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { getListicle, getListicleSlugs, getAllListicles, GuideEvent } from "@/lib/listicles";
import ShareRow from "@/app/components/ShareRow";
import { BusinessCard } from "@/app/components/BusinessCard";
import { Calendar, MapPin, Route, ExternalLink, Star } from "lucide-react";
import UpcomingEvents from "@/app/components/UpcomingEvents";
import { ListicleSlot } from "@/app/components/ScheduledAds";

export function generateStaticParams() {
  return getListicleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getListicle(slug);
  if (!l) return {};
  return {
    title: `${l.title} — Southern Legends`,
    description: l.excerpt,
    alternates: { canonical: `/listicles/${slug}` },
    openGraph: { title: l.title, description: l.excerpt, url: `/listicles/${slug}`, images: l.image ? [l.image] : [] },
  };
}

const mdxComponents = {
  CrisisLine,
  Script: (props: React.ComponentProps<"script">) => <script {...props} />,
};

function EventCard({ event, index }: { event: GuideEvent; index: number }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e0d8cc",
      borderRadius: "10px",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: event.image ? "clamp(140px, 22%, 220px) 1fr" : "1fr",
    }}>
      {event.image && (
        <div style={{ position: "relative", minHeight: "180px" }}>
          <Image
            src={event.image}
            alt={event.name}
            fill
            sizes="220px"
            style={{ objectFit: "cover" }}
            loading={index < 2 ? "eager" : "lazy"}
          />
        </div>
      )}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.35rem" }}>
          {event.category ?? "Event"}
        </p>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-ll-dark)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
          {event.name}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Calendar size={13} color="var(--color-ll-accent-dark)" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-ll-text)" }}>{event.date}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <MapPin size={13} color="var(--color-ll-accent-dark)" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-ll-text)" }}>{event.location}</span>
          </div>
          {event.distances && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Route size={13} color="var(--color-ll-accent-dark)" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-ll-text)" }}>{event.distances}</span>
            </div>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#5a4030", lineHeight: 1.65, marginBottom: event.vendor ? "0.75rem" : "0" }}>
          {event.description}
        </p>
        {event.vendor && (
          <div style={{ background: "#f7f3ee", borderRadius: "6px", padding: "0.5rem 0.75rem", display: "flex", alignItems: "flex-start", gap: "0.4rem", marginTop: "0.5rem" }}>
            <Star size={12} color="var(--color-ll-accent-dark)" style={{ marginTop: "2px", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "#6b4a2a", lineHeight: 1.5, margin: 0 }}>
              <strong>Vendor note:</strong> {event.vendor}
            </p>
          </div>
        )}
        {event.web && (
          <a href={event.web} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.85rem", fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
            <ExternalLink size={11} /> Visit website
          </a>
        )}
      </div>
    </div>
  );
}

function EventList({ events }: { events: GuideEvent[] }) {
  const sections = [...new Set(events.map((e) => e.section ?? "Events"))];
  return (
    <div style={{ marginTop: "2rem" }}>
      {sections.map((section) => (
        <div key={section} style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "1rem", borderBottom: "1px solid #e0d8cc", paddingBottom: "0.5rem" }}>
            {section}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {events.filter((e) => (e.section ?? "Events") === section).map((event, i) => (
              <EventCard key={event.name + i} event={event} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ListiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getListicle(slug);
  if (!l) notFound();

  // Same-city guides first, then the rest (redesign B-05).
  const others = getAllListicles()
    .filter((x) => x.slug !== slug)
    .sort((a, b) => Number(b.city === l.city) - Number(a.city === l.city))
    .slice(0, 6);
  const isEvent = l.events && l.events.length > 0;
  const isCard = !isEvent && l.businesses && l.businesses.length > 0;
  const weddingCategories = ["photographer", "florist", "venue", "catering", "bridal", "chapel", "jeweler", "jewelry", "bakery", "cake", "hair salon", "salon", "spa", "rental", "music", "alterations", "boutique", "nail", "wedding planner", "planner"];
  const isWeddingGuide = weddingCategories.some(c => (l.category ?? "").toLowerCase().includes(c) || l.tags.some(t => t.toLowerCase().includes(c)));

  // JSON-LD: Event schema for event listicles, ItemList for all
  const eventSchema = isEvent ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": l.title,
    "description": l.excerpt,
    "itemListElement": l.events!.map((e, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Event",
        "name": e.name,
        "startDate": e.date,
        "location": { "@type": "Place", "name": e.location },
        "url": e.web ?? `https://southernlegends.org/listicles/${slug}`,
        "description": e.description,
      }
    }))
  } : null;

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      {eventSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      )}
      {l.itemlist && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: l.itemlist }} />
      )}

      {/* Hero — image + title + intro text */}
      {l.image ? (
        <div style={{ position: "relative", width: "100%", height: "clamp(520px, 70vh, 820px)" }}>
          <Image src={l.image} alt={l.title} fill priority style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,18,8,.1) 0%, rgba(26,18,8,.45) 45%, rgba(26,18,8,.88) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 1.5rem 2.5rem" }}>
            <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F0EDE6", opacity: 0.8, marginBottom: "0.6rem" }}>
                Southern Legends · Local Guide
              </p>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: "#fff", marginBottom: l.intro ? "1.1rem" : "0" }}>
                {l.title}
              </h1>
              {l.intro && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "rgba(240,237,230,0.88)", lineHeight: 1.6, maxWidth: "38rem" }}>
                  {l.intro}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--color-ll-dark)", padding: "7rem 1.5rem 2.5rem" }}>
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.6rem" }}>
              Southern Legends · Local Guide
            </p>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: "#f0ede6", marginBottom: l.intro ? "1.1rem" : "0" }}>
              {l.title}
            </h1>
            {l.intro && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "rgba(240,237,230,0.75)", lineHeight: 1.6, maxWidth: "38rem" }}>
                {l.intro}
              </p>
            )}
            {!l.eventsFeed && !isEvent && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "rgba(240,237,230,0.55)", lineHeight: 1.5, maxWidth: "38rem", marginTop: "1rem" }}>
                How this list is made: public data first, then what I know from living here. Nobody paid to be on it.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <Link href="/listicles" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", textDecoration: "none" }}>
          ← Local Guides
        </Link>

        {/* Byline + support */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", margin: "1.25rem 0 2rem", paddingBottom: "1.25rem", borderBottom: "1px solid #d4c9b8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <Image src="/images/about/headshot-hedcut-matt-headley.webp" alt="Matt Headley" width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-ll-dark)", lineHeight: 1.2 }}>Matt Headley</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "var(--color-ll-accent-dark)", lineHeight: 1.2 }}>
                Southern Legends{l.date && !l.eventsFeed ? ` · ${new Date(l.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : ""}
              </p>
            </div>
          </div>
          <a href="/support" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--color-ll-dark)", color: "#f0ede6", fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", fontWeight: 600, padding: "0.45rem 0.9rem", borderRadius: "6px", textDecoration: "none" }}>
            Support this work →
          </a>
        </div>

        {l.eventsFeed ? (
          <>
            <UpcomingEvents
              {...l.eventsFeed}
              grouped
              filter
              jsonLd
              pageUrl={`https://southernlegends.org/listicles/${slug}`}
              emptyText="Nothing on the calendar yet. Check back soon."
            />
            {l.content && (
              <article className="prose prose-lg max-w-none" style={{ fontFamily: "var(--font-body)" }}>
                <MDXRemote source={l.content} components={mdxComponents} />
              </article>
            )}
          </>
        ) : isEvent ? (
          <EventList events={l.events!} />
        ) : isCard ? (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {l.businesses.map((b, i) => (
              <BusinessCard key={b.name + i} b={b} index={i} />
            ))}
          </div>
        ) : (
          <article className="prose prose-lg max-w-none" style={{ fontFamily: "var(--font-body)" }}>
            <MDXRemote source={l.content} components={mdxComponents} />
          </article>
        )}

        {/* Scheduled ad (lib/ad-schedule): today's campaign — reader support, or The Aisle on
            wedding guides while a show campaign runs. */}
        <ListicleSlot weddingGuide={isWeddingGuide} />

        {isEvent && (
          <div style={{ background: "var(--color-ll-dark)", borderRadius: "10px", padding: "1.5rem 1.75rem", marginTop: "2.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.35rem" }}>
                Sponsor This Guide
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#f0ede6", lineHeight: 1.55 }}>
                Reach vendors and attendees planning for NE Alabama events. $150/mo sponsor spotlight.
              </p>
            </div>
            <a href="mailto:matt@gatherstudio.app?subject=Sponsor%20Inquiry" style={{ display: "inline-block", background: "var(--color-ll-accent-dark)", color: "#f0ede6", fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, padding: "0.6rem 1.1rem", borderRadius: "6px", textDecoration: "none", whiteSpace: "nowrap" }}>
              Get in touch
            </a>
          </div>
        )}

        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-ll-text)", marginTop: "2rem", fontStyle: "italic" }}>
          A living list, honestly kept. Know an event we missed? <a href="mailto:matt@gatherstudio.app" style={{ color: "var(--color-ll-accent-dark)" }}>Tell us.</a>
        </p>

        {/* Share */}
        <div style={{ marginTop: "1.5rem" }}>
          <ShareRow url={`/listicles/${slug}`} title={l.title} description={l.excerpt} />
        </div>

        {others.length > 0 && (
          <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(154,108,47,0.18)", paddingTop: "2rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "1rem" }}>
              More local guides
            </p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {others.map((o) => (
                <Link key={o.slug} href={`/listicles/${o.slug}`} style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "var(--color-ll-dark)", textDecoration: "none" }}>
                  {o.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
