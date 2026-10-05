// AisleStrip — slim top-of-article Aisle campaign strip (runs only while The Aisle is the
// featured campaign). Seen by nearly every reader; the full AisleBand still closes the page.
// One message, one action. Aisle arch + AMAG at exactly half the arch height (brand rule).
import type { VentureCTA } from "@/lib/cta-router";
import { aisleLink } from "@/lib/ad-inventory";

const ARCH_H = 52;

export default function AisleStrip({ ad, page = "" }: { ad: VentureCTA; page?: string }) {
  const href = aisleLink(ad.href, `${page || "sl"}:top-strip`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose block no-underline rounded-lg overflow-hidden relative mb-10"
      style={{ color: "#fff", borderLeft: "5px solid #C9A227", boxShadow: "0 4px 14px rgba(0,0,0,.10)" }}
    >
      <img src="/ad-assets/aisle-couple.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%" }} />
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(30,42,74,.95) 0%, rgba(30,42,74,.86) 60%, rgba(30,42,74,.55) 100%)" }} />
      <style>{`a:has(>.as),.as,.as *{text-decoration:none!important}.as{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.as-logos{display:flex}`}</style>
      <span className="as relative" style={{ padding: "14px 18px" }}>
        <span className="as-logos" style={{ alignItems: "center", gap: 12 }}>
          <img src="/ad-assets/aisle-arch-cream.png" alt="The Aisle" style={{ height: ARCH_H, width: "auto" }} />
          <img src="/ad-assets/amag-white.png" alt="Anniston Museums and Gardens" style={{ height: ARCH_H / 2, width: "auto" }} />
        </span>
        <span style={{ flex: 1, minWidth: 200 }}>
          <span style={{ display: "block", fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "1.2rem", lineHeight: 1.15 }}>
            Engaged? <span style={{ color: "#C9A227" }}>this is for you.</span>
          </span>
          <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.85rem", opacity: 0.95, marginTop: 2 }}>
            The Aisle Bridal Show · Sunday, Oct 18 · Longleaf Event Center, Anniston
          </span>
        </span>
        <span style={{ background: "#C9A227", color: "#1e2a4a", padding: "0.6rem 1.1rem", borderRadius: 6, fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
          {ad.cta} →
        </span>
      </span>
    </a>
  );
}
