// MarginAisle — a standard 300×250 (IAB medium rectangle) Aisle card in the RIGHT margin, wide
// screens only (≥1440px). Sized under 30% of a laptop screen, per sticky-ad guidance. Built in HTML, not as a baked image: the date, venue, door price,
// URL and QR all come from the live show (Turso), and the card links to /go/aisle.
// Arch + AMAG lockup: AMAG is exactly half the arch height. Hidden until the reader has
// scrolled a quarter of the way down, and never on no-promo pages.
import { AisleGoLink, AisleGate, AfterQuarter, Dismissible, ImpressionOnView } from "@/app/components/AisleGo";
import { getActiveAisleShow } from "@/lib/aisle-shows-live";
import { showDayLabel } from "@/lib/ad-inventory";

const ARCH_H = 64;

export default async function MarginAisle() {
  const show = await getActiveAisleShow();
  if (!show) return null;
  return (
    <AisleGate>
      <AfterQuarter>
        <aside className="margin-aisle" aria-label="The Aisle">
         <Dismissible>
          <style>{`@keyframes aisleDrift{from{transform:scale(1)}to{transform:scale(1.06)}}.margin-aisle .aisle-photo{animation:aisleDrift 12s ease-in-out infinite alternate}.margin-aisle .aisle-cta{transition:transform .2s ease,filter .2s ease}.margin-aisle .aisle-cta:hover{transform:translateY(-1px);filter:brightness(1.06)}@media (prefers-reduced-motion:reduce){.margin-aisle .aisle-photo{animation:none}.margin-aisle .aisle-cta{transition:none}}.margin-aisle{display:none}@media(min-width:1440px){.margin-aisle{display:block;position:fixed;right:20px;top:120px;width:300px;z-index:30}}`}</style>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#8a8170", margin: "0 0 6px" }}>From Southern Legends</p>
          <AisleGoLink spot="margin" className="block no-underline rounded-xl overflow-hidden relative" style={{ width: 300, height: 250, color: "#fff", background: "#1e2a4a", boxShadow: "0 8px 24px rgba(0,0,0,.2)", borderTop: "4px solid #C9A227" }}>
            <ImpressionOnView placement="margin" showSlug={show.slug} />
            <img className="aisle-photo" src={show.photo ?? "/ad-assets/aisle-couple.webp"} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 30%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,42,74,.25) 0%, rgba(30,42,74,.55) 45%, rgba(30,42,74,.95) 80%)" }} />
            <span style={{ position: "absolute", left: 20, right: 20, top: 16, display: "block" }}>
              <span style={{ display: "block", fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "1.6rem", lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
                Engaged? <span style={{ color: "#C9A227" }}>this is for you.</span>
              </span>
            </span>
            <span style={{ position: "absolute", left: 20, right: 20, bottom: 14, display: "block" }}>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#C9A227" }}>
                Bridal Show · {showDayLabel(show.date)}
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.8rem", margin: "4px 0 10px" }}>
                {show.venue}, {show.city}
              </span>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span className="aisle-cta" style={{ background: "#C9A227", color: "#1e2a4a", padding: "0.45rem 0.7rem", borderRadius: 6, fontWeight: 800, fontSize: "0.78rem", fontFamily: "var(--font-body)" }}>Register free →</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.68rem", color: "#C9A227" }}>theaislebridalshows.com</span>
              </span>
            </span>
          </AisleGoLink>
         </Dismissible>
        </aside>
      </AfterQuarter>
    </AisleGate>
  );
}
