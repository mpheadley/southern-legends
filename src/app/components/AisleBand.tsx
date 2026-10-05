// AisleBand — The Aisle campaign ad, built from the church-screen banner (photo, navy fade,
// Fraunces "Engaged? / this is for you." treatment). PSBP: one message, one action.
// Promotes whichever show the schedule says is next (activeAisleShow) — date, venue, door
// price, register link and QR all come from the Turso snapshot, so it switches itself.
// Brand rules: Aisle arch on every Aisle graphic; a partner lockup is exactly half its height.
import type { VentureCTA } from "@/lib/cta-router";
import { AISLE_SHOW_LOOK, showDayLabel, adLabel } from "@/lib/ad-inventory";
import { getActiveAisleShow } from "@/lib/aisle-shows-live";
import { AisleGoLink, AisleQR, ImpressionOnView } from "@/app/components/AisleGo";

const ARCH_H = 64;

export default async function AisleBand({ label = adLabel("aisle") }: { ad?: VentureCTA; label?: string }) {
  const show = await getActiveAisleShow();
  if (!show) return null;
  const look = AISLE_SHOW_LOOK[show.slug] ?? {};
  return (
    <div className="px-6 py-8">
      <p className="max-w-3xl mx-auto text-[0.62rem] font-bold tracking-[0.16em] uppercase" style={{ color: "#8a8170", fontFamily: "var(--font-body)", marginBottom: 8 }}>
        {label}
      </p>
      <style>{`.ab-photo{object-position:30% 30%}@media(min-width:760px){.ab-photo{object-position:60% 30%}}.ab,.ab *{text-decoration:none!important}.ab{display:grid;grid-template-columns:1fr;gap:18px;align-items:end}.ab-ask{justify-self:start;display:flex;flex-direction:row;align-items:center;gap:14px}.ab-qr-svg svg{width:100%;height:100%;display:block}.ab-qr-svg{width:84px!important;height:84px!important}@media(min-width:760px){.ab{grid-template-columns:1fr auto}.ab-ask{justify-self:end;flex-direction:column}.ab-qr-svg{width:104px!important;height:104px!important}}`}</style>
      <AisleGoLink
        spot="band"
        className="block max-w-3xl mx-auto rounded-xl overflow-hidden relative no-underline"
        style={{ color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.14)", borderLeft: "6px solid #C9A227" }}
      >
            <ImpressionOnView placement="band" showSlug={show.slug} />
        {show.photo ? <img className="ab-photo" src={show.photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : null}
        <span style={{ position: "absolute", inset: 0, background: show.photo ? undefined : "#1e2a4a", backgroundImage: "linear-gradient(90deg, rgba(30,42,74,.95) 0%, rgba(30,42,74,.85) 34%, rgba(30,42,74,.25) 58%, rgba(30,42,74,.15) 78%, rgba(30,42,74,.45) 100%)" }} />
        <div className="ab relative" style={{ padding: "26px 28px 22px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.9rem, 4.6vw, 2.6rem)", lineHeight: 0.98, margin: 0, textShadow: "0 3px 10px rgba(0,0,0,.45)" }}>
              Engaged?
              <br />
              <span style={{ color: "#C9A227" }}>this is for you.</span>
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", fontSize: "0.82rem", color: "#C9A227", margin: "14px 0 4px" }}>
              Bridal Show · {showDayLabel(show.date)}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", margin: 0, opacity: 0.95 }}>
              {look.venueLine ?? `${show.venue} · ${show.city}, ${show.state}`}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16 }}>
              <img src="/ad-assets/aisle-arch-cream.png" alt="The Aisle" style={{ height: ARCH_H, width: "auto" }} />
              {look.partnerLogo ? <img src={look.partnerLogo} alt={look.partnerAlt ?? ""} style={{ height: ARCH_H / 2, width: "auto", opacity: 0.95 }} /> : null}
            </div>
          </div>
          <div className="ab-ask">
            {/* laptop: point your phone at it · phone: screenshot it or show your partner */}
            <div className="ab-qr" style={{ background: "#fff", padding: 8, borderRadius: 8, textAlign: "center" }}>
              <AisleQR size={104} />
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: ".06em", textTransform: "uppercase", color: "#1e2a4a", marginTop: 4 }}>Scan with your phone</span>
            </div>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ background: "#C9A227", color: "#1e2a4a", padding: "0.85rem 1.4rem", borderRadius: 6, fontWeight: 800, fontSize: "0.98rem", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
                Register free →
              </span>
              {/* canonical couple-facing wording: theaisle lib/ticket-pricing.ts (D-017) */}
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", textAlign: "center", maxWidth: 220, lineHeight: 1.35 }}>
                Free to register in advance{show.doorPrice ? ` · $${show.doorPrice} at the door` : ""}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 700, color: "#C9A227", textAlign: "center", letterSpacing: ".02em" }}>
                theaislebridalshows.com
              </span>
            </span>
          </div>
        </div>
      </AisleGoLink>
      {show.vipPrice ? (
        <p className="max-w-3xl mx-auto" style={{ margin: "10px auto 0", textAlign: "right", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
          <AisleGoLink spot="band-vip" tier="vip" className="no-underline" style={{ color: "#C9A227", fontWeight: 700 }}>
            Make it VIP · ${show.vipPrice}{show.slug === "anniston-oct-2026" ? " — early access, champagne, reserved seating" : ""} →
          </AisleGoLink>
        </p>
      ) : null}
    </div>
  );
}
