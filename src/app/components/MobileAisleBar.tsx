"use client";
// MobileAisleBar — a standard 320×50 sticky bottom bar for phones (below 1024px).
// Fades in once the reader passes a quarter of the page, fades out at the footer,
// and has a visible × to dismiss it for the visit. Same Aisle message and link as the desktop card.
import { useEffect, useState } from "react";
import { goHref, ImpressionOnView } from "@/app/components/AisleGo";
import { usePathname } from "next/navigation";

export default function MobileAisleBar({ dateLabel, showSlug }: { dateLabel: string; showSlug?: string }) {
  const path = usePathname() ?? "/";
  const [opacity, setOpacity] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const check = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const footer = document.querySelector("footer");
      const footerTop = footer ? footer.getBoundingClientRect().top + y : Infinity;
      const fadeIn = max <= 0 ? 1 : y / max >= 0.25 ? 1 : 0;
      const fadeOut = footerTop - (y + window.innerHeight) < 80 ? 0 : 1;
      setOpacity(fadeIn && fadeOut);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);
  if (gone) return null;
  return (
    <div className="mobile-aisle-bar" style={{ opacity, transition: "opacity 400ms ease", pointerEvents: opacity ? "auto" : "none" }}>
      <style>{`.mobile-aisle-bar{position:fixed;left:0;right:0;bottom:0;height:50px;z-index:40;display:flex;align-items:center;background:#1e2a4a;color:#fff;border-top:2px solid #C9A227}@media (min-width:1024px){.mobile-aisle-bar{display:none}}`}</style>
      <a href={goHref(path, "bottom-bar")} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", color: "#fff" }}>
        {opacity ? <ImpressionOnView placement="bottom-bar" showSlug={showSlug} /> : null}
        <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>Bridal Show</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", opacity: 0.9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dateLabel}</span>
        <span style={{ marginLeft: "auto", background: "#C9A227", color: "#1e2a4a", padding: "5px 9px", borderRadius: 5, fontWeight: 800, fontSize: "0.72rem", whiteSpace: "nowrap" }}>Register free →</span>
      </a>
      <button type="button" aria-label="Close this ad" onClick={() => setGone(true)} style={{ width: 34, height: 34, marginRight: 6, borderRadius: "50%", border: "1px solid rgba(232,201,138,.8)", background: "transparent", color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer", padding: 0 }}>×</button>
    </div>
  );
}
