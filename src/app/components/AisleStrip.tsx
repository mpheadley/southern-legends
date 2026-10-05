// AisleStrip — slim top-of-article Aisle campaign strip (runs only while The Aisle is the
// featured campaign). Seen by nearly every reader; the full AisleBand still closes the page.
// One message, one action. Aisle arch + AMAG at exactly half the arch height (brand rule).
import type { VentureCTA } from "@/lib/cta-router";
import { AISLE_SHOW_LOOK, showDayLabel } from "@/lib/ad-inventory";
import { getActiveAisleShow } from "@/lib/aisle-shows-live";
import { AisleGoLink, ImpressionOnView } from "@/app/components/AisleGo";

const ARCH_H = 52;

export default async function AisleStrip(_: { ad?: VentureCTA; page?: string }) {
  const show = await getActiveAisleShow();
  if (!show) return null;
  const look = AISLE_SHOW_LOOK[show.slug] ?? {};
  return (
    <AisleGoLink
      spot="top-strip"
      className="not-prose block no-underline rounded-lg overflow-hidden relative mb-10"
      style={{ color: "#fff", borderLeft: "5px solid #C9A227", boxShadow: "0 4px 14px rgba(0,0,0,.10)" }}
    >
            <ImpressionOnView placement="top-strip" showSlug={show.slug} />
      {show.photo ? <img src={show.photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%" }} /> : <span style={{ position: "absolute", inset: 0, background: "#1e2a4a" }} />}
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(30,42,74,.95) 0%, rgba(30,42,74,.86) 60%, rgba(30,42,74,.55) 100%)" }} />
      <style>{`a:has(>.as),.as,.as *{text-decoration:none!important}.as{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.as-logos{display:flex}`}</style>
      <span className="as relative" style={{ padding: "14px 18px" }}>
        <span className="as-logos" style={{ alignItems: "center", gap: 12 }}>
          <img src="/ad-assets/aisle-arch-cream.png" alt="The Aisle" style={{ height: ARCH_H, width: "auto" }} />
          {look.partnerLogo ? <img src={look.partnerLogo} alt={look.partnerAlt ?? ""} style={{ height: ARCH_H / 2, width: "auto" }} /> : null}
        </span>
        <span style={{ flex: 1, minWidth: 200 }}>
          <span style={{ display: "block", fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "1.2rem", lineHeight: 1.15 }}>
            Bridal Show
          </span>
          <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.85rem", opacity: 0.95, marginTop: 2 }}>
            The Aisle Bridal Show · {showDayLabel(show.date)} · {show.venue}, {show.city} · theaislebridalshows.com
          </span>
        </span>
        <span style={{ background: "#C9A227", color: "#1e2a4a", padding: "0.6rem 1.1rem", borderRadius: 6, fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
          Register free →
        </span>
      </span>
    </AisleGoLink>
  );
}
