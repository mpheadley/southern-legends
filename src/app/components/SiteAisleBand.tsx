// SiteAisleBand — The Aisle band on EVERY SL page (new pages included), rendered once from
// the root layout above the footer. Server-renders the live show from Turso; AisleGate (client)
// keeps it off admin/utility routes and any page that marks itself no-promo (grief, illness…).
// Renders nothing when no Aisle show is scheduled.
import AisleBand from "@/app/components/AisleBand";
import { AisleGate } from "@/app/components/AisleGo";
import { featuredKey, showDayLabel } from "@/lib/ad-inventory";
import { getActiveAisleShow } from "@/lib/aisle-shows-live";
import MobileAisleBar from "@/app/components/MobileAisleBar";

export default async function SiteAisleBand() {
  if (featuredKey() !== "aisle") return null;
  const show = await getActiveAisleShow();
  return (
    <AisleGate>
      <div style={{ background: "#1a1208" }}>
        <AisleBand />
      </div>
      {show ? <MobileAisleBar dateLabel={showDayLabel(show.date)} showSlug={show.slug} /> : null}
    </AisleGate>
  );
}
