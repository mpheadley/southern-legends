// HouseAdUnit.tsx — SL's one-per-page ad slot (end of article, before comments).
// PSBP for every venture: ONE message, ONE action, visible without interaction,
// honest label. Layout = a wide band: picture left · message middle · button right.
//   • testimonial set in ad-brand.ts → TestimonialBand (face + verbatim quote + ask)
//   • otherwise → venture band (its own creative + headline + one button)
// Label: adLabel() in lib/ad-inventory — our ventures → "<Venture> · Ad"; sold ads → "Advertisement · <advertiser>".
import type { VentureCTA } from "@/lib/cta-router";
import { brandFor } from "@/lib/ad-brand";
import { adLabel } from "@/lib/ad-inventory";
import TestimonialBand from "@/app/components/TestimonialBand";

export default function HouseAdUnit({ ad, page }: { ad: VentureCTA; page?: string }) {
  const b = brandFor(ad.key);
  const label = adLabel(ad.key, { paid: ad.paid, advertiser: ad.eyebrow });

  // The Aisle band renders site-wide from the layout (SiteAisleBand) — never twice on a page.
  if (ad.key === "aisle") return null;

  if (b.testimonial) {
    return <TestimonialBand ad={ad} t={b.testimonial} accent={b.accent} onAccent={b.onAccent} label={label} />;
  }

  const ext = ad.href.startsWith("http");
  const pic = b.hero ?? b.logo;
  return (
    <div className="px-6 py-8">
      <p className="max-w-3xl mx-auto text-[0.62rem] font-bold tracking-[0.16em] uppercase" style={{ color: "#8a8170", fontFamily: "var(--font-body)", marginBottom: 8 }}>
        {label}
      </p>
      <style>{`.vb{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center}.vb-ask{grid-column:1 / -1}@media(min-width:760px){.vb{grid-template-columns:auto 1fr auto}.vb-ask{grid-column:auto}}`}</style>
      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden" style={{ background: b.accent, color: b.onAccent ?? "#F0EDE6", boxShadow: "0 8px 24px rgba(0,0,0,.12)" }}>
        <div className="vb" style={{ padding: "20px 24px" }}>
          {pic ? (
            <img
              src={pic}
              alt={ad.eyebrow}
              style={b.hero ? { width: 96, height: 96, borderRadius: 10, objectFit: "cover" } : { width: 96, height: 96, objectFit: "contain" }}
            />
          ) : (
            <span style={{ width: 96, height: 96, borderRadius: 10, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, lineHeight: 1.1, padding: 8 }}>
              {ad.eyebrow}
            </span>
          )}
          <div style={{ minWidth: 0 }}>
            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase" style={{ fontFamily: "var(--font-body)", opacity: 0.8, margin: "0 0 4px" }}>
              {ad.eyebrow}
            </p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", lineHeight: 1.2, margin: 0 }}>{ad.headline}</p>
          </div>
          <div className="vb-ask">
            <a
              href={ad.href}
              target={ext ? "_blank" : undefined}
              rel={ext ? "noopener noreferrer" : undefined}
              className="inline-block no-underline"
              style={{ background: "#E8C98A", color: "#1a1208", padding: "0.75rem 1.3rem", borderRadius: 6, fontWeight: 700, fontSize: "0.92rem", whiteSpace: "nowrap" }}
            >
              {ad.cta} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
