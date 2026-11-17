// ScheduledAds — every SL ad slot, filled from the network-wide ad schedule
// (content/data/ad-schedule.json → Vercel Blob ads/schedule.json, read in lib/ad-schedule-live).
// Today's date picks the campaign at render time, so campaigns switch with no deploy.
//   aisle-show creative → the Aisle components (live show facts from Turso)
//   anything else       → the plain SL-styled units below (support, Vol. 1, sold ads)
// One message, one action per unit. Labels via adLabel(): house → "Southern Legends · Ad",
// paid → "Advertisement · <advertiser>".
import AisleBand from "@/app/components/AisleBand";
import AisleStrip from "@/app/components/AisleStrip";
import MarginAisle from "@/app/components/MarginAisle";
import MobileAisleBar from "@/app/components/MobileAisleBar";
import MobileAdBar from "@/app/components/MobileAdBar";
import { AdGate, AfterQuarter, Dismissible, ImpressionOnView, TrackedAdLink } from "@/app/components/AisleGo";
import { adLabel, showDayLabel } from "@/lib/ad-inventory";
import { isSupportAsk } from "@/lib/ad-schedule";
import { getSlAd, type SlAd } from "@/lib/ad-schedule-live";

const CREAM = "#F0EDE6";
const INK = "#1a1208";
const GOLD = "#E8C98A";
const LISTICLE_BTN = { display: "inline-block", background: "var(--color-ll-accent-dark)", color: CREAM, fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 700, padding: "0.65rem 1.2rem", borderRadius: "6px", textDecoration: "none", whiteSpace: "nowrap" } as const;

const labelFor = (ad: SlAd) =>
  ad.campaign.bucket === "paid" ? adLabel(ad.campaign.id, { paid: true, advertiser: ad.campaign.advertiser }) : adLabel("sl");
/** What this ad asks for — a page already making that ask hides the site-wide band. */
const askKey = (ad: SlAd) => (ad.show ? "aisle" : isSupportAsk(ad) ? "support" : ad.campaign.id);

/** Round face of the person asking. Sized in CSS px; the file is >= 3x so it stays sharp. */
function Portrait({ src, size, ring = GOLD }: { src: string; size: number; ring?: string }) {
  return <img src={src} alt="" width={size} height={size} decoding="async" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flex: "none", border: `2px solid ${ring}`, display: "block" }} />;
}

/** Light-on-dark wordmark lockup. */
function Logo({ src, width }: { src: string; width: number }) {
  return <img src={src} alt="Southern Legends" width={width} height={Math.round(width * 0.207)} decoding="async" style={{ width, height: "auto", display: "block" }} />;
}

/** Marker a slot drops so the site-wide band below doesn't repeat the same ask. */
export function AskMarker({ ad }: { ad: SlAd }) {
  return <span data-sl-ask={askKey(ad)} hidden />;
}

/* ── top strip (opens essays + profiles) ───────────────────────────────── */
export async function TopStripSlot() {
  const ad = await getSlAd("top-strip");
  if (!ad) return null;
  if (ad.show) {
    return (
      <div data-ad-slot="top-strip" data-ad-campaign={ad.campaign.id}>
        <AisleStrip show={ad.show} cta={ad.cta} />
      </div>
    );
  }
  const accent = ad.campaign.accent ?? "#9A3412";
  return (
    <div data-ad-slot="top-strip" data-ad-campaign={ad.campaign.id} className="not-prose mb-10">
      <TrackedAdLink href={ad.href} placement="top-strip" campaignId={ad.campaign.id} className="block no-underline rounded-lg overflow-hidden relative" style={{ background: INK, color: CREAM, borderLeft: `5px solid ${GOLD}`, boxShadow: "0 4px 14px rgba(0,0,0,.10)" }}>
        <ImpressionOnView placement="top-strip" showSlug={ad.campaign.id} />
        <style>{`.ss,.ss *{text-decoration:none!important}.ss{display:flex;align-items:center;gap:16px;flex-wrap:wrap}`}</style>
        <span className="ss" style={{ padding: "14px 18px" }}>
          {ad.campaign.portrait ? <Portrait src={ad.campaign.portrait} size={48} /> : null}
          <span style={{ flex: 1, minWidth: 200 }}>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD }}>{labelFor(ad)}</span>
            <span style={{ display: "block", fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "1.2rem", lineHeight: 1.2, marginTop: 2 }}>{ad.short}</span>
          </span>
          <span style={{ background: accent, color: CREAM, padding: "0.6rem 1.1rem", borderRadius: 6, fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>{ad.cta} →</span>
        </span>
      </TrackedAdLink>
    </div>
  );
}

/* ── closing band + phone bar (every page, from the root layout) ───────── */
export async function SiteAdBand() {
  const [ad, bar] = await Promise.all([getSlAd("band"), getSlAd("mobile-bar")]);
  return (
    <>
      {ad ? (
        <AdGate askKey={askKey(ad)}>
          <div data-ad-slot="band" data-ad-campaign={ad.campaign.id} style={{ background: INK }}>
            {ad.show ? <AisleBand show={ad.show} cta={ad.cta} /> : <PlainBand ad={ad} />}
          </div>
        </AdGate>
      ) : null}
      {bar ? (
        <AdGate>
          {bar.show ? (
            <MobileAisleBar dateLabel={showDayLabel(bar.show.date)} showSlug={bar.show.slug} cta={bar.cta} campaignId={bar.campaign.id} />
          ) : (
            <MobileAdBar short={bar.short} cta={bar.cta} href={bar.href} campaignId={bar.campaign.id} accent={bar.campaign.accent} portrait={bar.campaign.portrait} />
          )}
        </AdGate>
      ) : null}
    </>
  );
}

function PlainBand({ ad }: { ad: SlAd }) {
  const accent = ad.campaign.accent ?? "#9A3412";
  return (
    <div className="px-6 py-8">
      <p className="max-w-3xl mx-auto text-[length:var(--text-label)] font-bold tracking-[0.16em] uppercase" style={{ color: "#8a8170", fontFamily: "var(--font-body)", marginBottom: 8 }}>{labelFor(ad)}</p>
      <style>{`.pb,.pb *{text-decoration:none!important}.pb{display:grid;grid-template-columns:1fr;gap:18px;align-items:center}@media(min-width:760px){.pb{grid-template-columns:1fr auto}}.pb-head{display:flex;gap:18px;align-items:center}@media(max-width:600px){.pb-face img{width:64px!important;height:64px!important}}`}</style>
      <TrackedAdLink href={ad.href} placement="band" campaignId={ad.campaign.id} className="block max-w-3xl mx-auto rounded-xl overflow-hidden relative no-underline" style={{ background: "#2a1d10", color: CREAM, boxShadow: "0 8px 24px rgba(0,0,0,.14)", borderLeft: `6px solid ${GOLD}` }}>
        <ImpressionOnView placement="band" showSlug={ad.campaign.id} />
        {ad.campaign.image ? <img src={ad.campaign.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} /> : null}
        <div className="pb relative" style={{ padding: "26px 28px 24px" }}>
          <div>
            {ad.campaign.logo ? <div style={{ marginBottom: 18 }}><Logo src={ad.campaign.logo} width={260} /></div> : null}
            <div className="pb-head">
            {ad.campaign.portrait ? <span className="pb-face"><Portrait src={ad.campaign.portrait} size={88} /></span> : null}
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.05, margin: 0 }}>{ad.headline}</p>
            </div>
            {ad.body ? <p style={{ fontFamily: "var(--font-body)", fontSize: "0.98rem", lineHeight: 1.55, margin: "12px 0 0", opacity: 0.9, maxWidth: 520 }}>{ad.body}</p> : null}
          </div>
          {ad.campaign.imageCredit ? <p style={{ position: "absolute", right: 10, bottom: 6, margin: 0, fontSize: 11, opacity: 0.7 }}>Photo: {ad.campaign.imageCredit}</p> : null}
          <span style={{ justifySelf: "start", background: accent, color: CREAM, padding: "0.85rem 1.4rem", borderRadius: 6, fontWeight: 800, fontSize: "0.98rem", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>{ad.cta} →</span>
        </div>
      </TrackedAdLink>
    </div>
  );
}

/* ── 300×250 right-margin card (≥1440px only, from the root layout) ───── */
export async function MarginSlot() {
  const ad = await getSlAd("margin");
  if (!ad) return null;
  if (ad.show) {
    return (
      <AdGate>
        <MarginAisle show={ad.show} cta={ad.cta} campaignId={ad.campaign.id} />
      </AdGate>
    );
  }
  const accent = ad.campaign.accent ?? "#9A3412";
  return (
    <AdGate>
      <AfterQuarter>
        <aside className="margin-ad" aria-label={ad.campaign.advertiser} data-ad-slot="margin" data-ad-campaign={ad.campaign.id}>
          <Dismissible campaignId={ad.campaign.id} label={labelFor(ad)}>
            <style>{`.margin-ad{display:none}@media(min-width:1680px){.margin-ad{display:block;position:fixed;right:20px;top:120px;width:300px;z-index:30}}.margin-ad a,.margin-ad a *{text-decoration:none!important}`}</style>
            <TrackedAdLink href={ad.href} placement="margin" campaignId={ad.campaign.id} className="block no-underline rounded-xl overflow-hidden relative" style={{ width: 300, height: 250, color: CREAM, background: INK, boxShadow: "0 8px 24px rgba(0,0,0,.2)", borderTop: `4px solid ${GOLD}` }}>
              <ImpressionOnView placement="margin" showSlug={ad.campaign.id} />
              <span style={{ position: "absolute", left: 20, right: 20, top: 16, display: "block" }}>
                <span style={{ display: "block", fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.1 }}>{ad.headline}</span>
              </span>
              <span style={{ position: "absolute", left: 20, right: 20, bottom: 16, display: "block" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 10px" }}>
                  {ad.campaign.portrait ? <Portrait src={ad.campaign.portrait} size={56} /> : null}
                  <span style={{ display: "block" }}>
                    {ad.campaign.portraitName ? <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, color: GOLD, lineHeight: 1.3 }}>{ad.campaign.portraitName}</span> : null}
                    <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.3, opacity: 0.9 }}>{ad.short}</span>
                  </span>
                </span>
                <span style={{ display: "inline-block", background: accent, color: CREAM, padding: "0.55rem 0.9rem", borderRadius: 6, fontWeight: 800, fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>{ad.cta} →</span>
              </span>
            </TrackedAdLink>
          </Dismissible>
        </aside>
      </AfterQuarter>
    </AdGate>
  );
}

/* ── listicle unit (end of a local guide) ─────────────────────────────── */
export async function ListicleSlot({ weddingGuide }: { weddingGuide: boolean }) {
  const ad = await getSlAd("listicle");
  if (!ad) return null;
  // A bridal show ad only fits a wedding guide; other guides leave the slot empty.
  if (ad.show && !weddingGuide) return null;
  const show = ad.show;
  return (
    <div data-ad-slot="listicle" data-ad-campaign={ad.campaign.id} style={{ marginTop: "2rem", background: "var(--color-ll-dark)", borderRadius: "12px", padding: "1.5rem 1.75rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
      <AskMarker ad={ad} />
      <ImpressionOnView placement="listicle" showSlug={ad.campaign.id} />
      {!show && ad.campaign.portrait ? <Portrait src={ad.campaign.portrait} size={64} /> : null}
      <div style={{ flex: "1 1 260px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-ll-accent-dark)", marginBottom: "0.35rem" }}>
          {show ? `The Aisle · Bridal Show · ${showDayLabel(show.date)}` : labelFor(ad)}
        </p>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: CREAM, lineHeight: 1.35, marginBottom: "0.4rem" }}>
          {show ? `Meet these vendors in person at ${show.venue}, ${show.city}.` : ad.headline}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(240,237,230,0.75)", lineHeight: 1.55 }}>
          {show
            ? `${show.doorPrice ? `Free to register in advance · $${show.doorPrice} at the door${show.vipPrice ? ` · VIP $${show.vipPrice}` : ""}. ` : ""}Local vendors. Northeast Alabama's bridal show.`
            : ad.body}
        </p>
      </div>
      {show ? (
        // /go/aisle logs the click itself and forwards to the show's register page.
        <a href="/go/aisle?from=listicle:listicle" target="_blank" rel="noopener" style={LISTICLE_BTN}>{ad.cta} →</a>
      ) : (
        <TrackedAdLink href={ad.href} placement="listicle" campaignId={ad.campaign.id} style={LISTICLE_BTN}>{ad.cta} →</TrackedAdLink>
      )}
    </div>
  );
}
