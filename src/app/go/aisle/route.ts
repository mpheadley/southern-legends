// /go/aisle — the one permanent destination every SL Aisle QR and button points to.
// It forwards to whichever show is current (live from Turso), tagged with where the person
// came from (?from=<page>:<spot>) and credited to Southern Legends (SLREFERS). A QR someone
// screenshotted in October still works in November — it just lands on the next show.
import { NextResponse, type NextRequest } from "next/server";
import { getActiveAisleShow } from "@/lib/aisle-shows-live";
import { aisleLink } from "@/lib/ad-inventory";
import { logAdEvent } from "@/lib/ad-events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const from = (req.nextUrl.searchParams.get("from") ?? "sl").slice(0, 120);
  const tier = req.nextUrl.searchParams.get("tier") === "vip" ? "vip" : null;
  const show = await getActiveAisleShow();
  const [placement, page] = from.includes(":") ? [from.split(":").pop()!, from.split(":")[0]] : ["sl", from];
  await logAdEvent({ event: "click", placement: placement === "qr" ? "qr" : placement, page, showSlug: show?.slug ?? null });
  const dest = show
    ? aisleLink(show.registerUrl, from, `aisle-${show.slug}`)
    : aisleLink("https://theaislebridalshows.com/next-expo", from, "aisle-next");
  const url = new URL(dest);
  if (tier) url.searchParams.set("tier", tier);
  return NextResponse.redirect(url.toString(), 302);
}
