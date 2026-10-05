import { loadEventsData, filterEvents, groupByWeek, fmtRange, eventJsonLd, todayCentral, type SLEvent } from "@/lib/events";
import { SponsoredBadge } from "@/app/components/SponsoredBadge";
import EventCategoryFilter from "@/app/components/EventCategoryFilter";

// Dated event facts live once in content/data/events.json (kept current by
// tools/sl-events-sync.py). Evergreen pages show whatever is upcoming; past events
// drop off on their own.

const GOLD = "#9a6c2f";

// Default card photo per venue, used when an event has no `image` of its own.
// Only photos Matt owns or that SL has rights to. Credit is shown under the card.
const VENUE_PHOTO: Record<string, { src: string; alt: string; credit: string }> = {};

// Per-event photo only. The shared venue photo is shown once above the list, not on every card.
function CardPhoto({ e }: { e: SLEvent }) {
  const ev = e as SLEvent & { image?: string; imageAlt?: string; credit?: string };
  if (!ev.image) return null;
  const img = { src: ev.image, alt: ev.imageAlt || e.name, credit: ev.credit || "" };
  return (
    <figure style={{ margin: "0 0 0.5rem" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={img.alt} style={{ width: "100%", maxWidth: "11rem", height: "auto", borderRadius: "0.375rem", display: "block" }} />
      {img.credit && <figcaption style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#6b5a44", marginTop: "0.25rem" }}>{img.credit}</figcaption>}
    </figure>
  );
}

function EventItem({ e }: { e: SLEvent }) {
  const meta = [fmtRange(e.start, e.end), e.time, e.venue && e.city && !e.venue.includes(e.city) ? `${e.venue}, ${e.city}` : e.venue || e.city]
    .filter(Boolean)
    .join(" · ");
  return (
    <li data-cat={e.category ?? "community"}>
      <CardPhoto e={e} />
      <p style={{ margin: 0, fontWeight: 600, color: "#1a1208" }}>
        {e.name}
        {e.sponsored && <SponsoredBadge />}
      </p>
      <p style={{ margin: "0.15rem 0 0", fontSize: "0.85rem", color: "#6b5a44" }}>{meta}</p>
      <p style={{ margin: "0.25rem 0 0", fontSize: "0.9375rem", color: "#4a3728", lineHeight: 1.55 }}>{e.summary}</p>
      <p style={{ margin: "0.35rem 0 0", fontSize: "0.875rem" }}>
        {e.url && (
          <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "underline" }}>
            {e.urlLabel ?? "Details"}
          </a>
        )}
        {e.source && e.auto && <span style={{ color: "#8a7a64" }}> · via {e.source}</span>}
        {e.profile && (
          <>
            {e.url && " · "}
            <a href={e.profile} style={{ color: GOLD, textDecoration: "underline" }}>
              Read the story
            </a>
          </>
        )}
      </p>
    </li>
  );
}

function VenueHeader({ photo }: { photo: { src: string; alt: string; credit: string; loop?: { src: string; alt: string }; loop2?: { src: string; alt: string } } }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", margin: "0 0 1rem", flexWrap: "wrap" }}>
      {!photo.loop && (
        <figure style={{ margin: 0, width: "9rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.alt} style={{ width: "100%", height: "auto", borderRadius: "0.375rem", display: "block" }} />
        </figure>
      )}
      {photo.loop && (
        <video src={photo.loop.src} aria-label={photo.loop.alt} controls preload="metadata" style={{ width: "100%", maxWidth: "18rem", height: "auto", borderRadius: "0.375rem", display: "block" }} />
      )}

      {photo.credit && <p style={{ flexBasis: "100%", margin: 0, fontSize: "0.75rem", fontStyle: "italic", color: "#6b5a44" }}>{photo.credit}</p>}
    </div>
  );
}

const listStyle = { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1.1rem" } as const;
const labelStyle = { fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, margin: "0 0 0.75rem" } as const;

export default async function UpcomingEvents({
  venue,
  city,
  county,
  category,
  title = "Coming up",
  exclude,
  grouped = false,
  filter = false,
  jsonLd = false,
  pageUrl = "https://southernlegends.org",
  limit,
  emptyText,
}: {
  venue?: string;
  city?: string;
  county?: string;
  category?: string;
  title?: string;
  /** Event id to skip, e.g. the event the current page is about. */
  exclude?: string;
  /** Group by "This weekend", "Next week", "Later this month"… */
  grouped?: boolean;
  /** Show category chips (music, arts, outdoors…). */
  filter?: boolean;
  /** Emit schema.org Event JSON-LD per event. */
  jsonLd?: boolean;
  pageUrl?: string;
  limit?: number;
  emptyText?: string;
}) {
  const data = await loadEventsData();
  const today = todayCentral();
  let events = filterEvents(data.events, { venue, city, county, category, exclude }, today);
  if (limit) events = events.slice(0, limit);
  if (events.length === 0) {
    return emptyText ? <p style={{ color: "#6b5a44" }}>{emptyText}</p> : null;
  }

  const ld = jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(events.map((e) => eventJsonLd(e, pageUrl))) }}
    />
  ) : null;

  const venueKey = venue ?? (events[0]?.venues ?? [])[0];
  const header = venueKey && VENUE_PHOTO[venueKey] ? <VenueHeader photo={VENUE_PHOTO[venueKey]} /> : null;

  if (!grouped) {
    return (
      <aside
        className="not-prose clear-both my-10"
        style={{ border: "1px solid rgba(154,108,47,0.25)", borderRadius: "0.5rem", padding: "1.25rem 1.5rem", background: "#faf6ee" }}
      >
        {ld}
        <p style={labelStyle}>{title}</p>
        {header}
        <ul style={listStyle}>
          {events.map((e) => (
            <EventItem key={e.id} e={e} />
          ))}
        </ul>
      </aside>
    );
  }

  const groups = groupByWeek(events, today);
  const cats = [...new Set(events.map((e) => e.category ?? "community"))].sort();
  return (
    <div className="not-prose clear-both sl-events" style={{ margin: "1rem 0 2.5rem" }}>
      {ld}
      {header}
      {filter && cats.length > 1 && <EventCategoryFilter categories={cats} />}
      {groups.map((g) => (
        <section key={g.label} className="sl-events-group" style={{ marginBottom: "2.25rem" }}>
          <h2
            style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "#1a1208", margin: "0 0 1rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(154,108,47,0.25)" }}
          >
            {g.label}
          </h2>
          <ul style={listStyle}>
            {g.events.map((e) => (
              <EventItem key={e.id} e={e} />
            ))}
          </ul>
        </section>
      ))}
      {data.updatedAt && (
        <p style={{ fontSize: "0.8rem", color: "#8a7a64", marginTop: "1rem" }}>
          Last updated{" "}
          {new Date(data.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })}. Dates and prices
          come from each organizer's own listing. Plans change, so check the link before you go.
        </p>
      )}
    </div>
  );
}
