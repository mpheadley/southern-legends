"use client";

// Site chrome (nav, footer, ads, popups) for every page except the GatherSites editor.
// /edit renders bare: its shell is position: fixed and would be clipped/scrolled-over by
// the nav, footer, and Lenis's wheel handling.
//
// SiteAdBand/MarginSlot are passed in already rendered from the (server) layout, not
// imported here directly: their lib (ad-schedule-live.ts) uses "server-only", which errors
// if pulled into this client module's graph. Inside the editor's preview iframe the page keeps
// its nav + footer but drops the cookie banner and subscribe popup (they'd cover the preview).
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { inEditor } from "@headley/gathersites";
import Nav from "./Nav";
import Footer from "./Footer";
import ScrollReveal from "./ScrollReveal";
import CookieBanner from "./CookieBanner";
import LenisProvider from "./LenisProvider";
import SubscribePopup from "./SubscribePopup";

export default function SiteChrome({
  children,
  adSlots,
}: {
  children: React.ReactNode;
  adSlots: React.ReactNode;
}) {
  const pathname = usePathname();
  // Decided after mount so the server and first client render match.
  const [preview, setPreview] = useState(true);
  useEffect(() => { setPreview(inEditor()); }, []);
  if (pathname?.endsWith("/edit") || pathname?.includes("/edit/")) return <>{children}</>;
  return (
    <LenisProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ll-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <Nav />
      {children}
      {adSlots}
      <Footer />
      <ScrollReveal />
      {!preview && (
        <>
          <CookieBanner />
          {/* One overlay per visit (redesign B-01): SubscribePopup only. SupportPopup retired. */}
          <SubscribePopup />
        </>
      )}
    </LenisProvider>
  );
}
