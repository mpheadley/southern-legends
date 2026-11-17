"use client";
// MobileAdBar — the 320×50 sticky phone bar for a scheduled (non-Aisle) campaign, e.g. reader
// support. Same behavior as MobileAisleBar: fades in after a quarter of the page, fades out at
// the footer, visible × to dismiss for the visit. Hidden at 1024px and up.
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ImpressionOnView, TrackedAdLink } from "@/app/components/AisleGo";

const CLOSE_DAYS = 7;

export default function MobileAdBar({ short, cta, href, campaignId, accent = "#9A3412", portrait }: { short: string; cta: string; href: string; campaignId: string; accent?: string; portrait?: string }) {
  const [opacity, setOpacity] = useState(0);
  const [checked, setChecked] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sl-ad-closed:${campaignId}`);
      if (stored) {
        const closedAt = Number(stored);
        if (!Number.isNaN(closedAt) && Date.now() - closedAt < CLOSE_DAYS * 24 * 60 * 60 * 1000) {
          setGone(true);
        }
      }
    } catch { /* localStorage may be unavailable; fail open */ }
    setChecked(true);
  }, [campaignId]);

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

  if (!checked || gone) return null;

  const close = () => {
    setGone(true);
    try { localStorage.setItem(`sl-ad-closed:${campaignId}`, String(Date.now())); } catch { /* ignore */ }
  };

  return (
    <div className="mobile-ad-bar" data-ad-slot="mobile-bar" data-ad-campaign={campaignId} style={{ opacity, transition: "opacity 400ms ease", pointerEvents: opacity ? "auto" : "none" }}>
      <style>{`.mobile-ad-bar{position:fixed;left:0;right:0;bottom:0;height:50px;z-index:40;display:flex;align-items:center;background:#1a1208;color:#F0EDE6;border-top:2px solid #E8C98A}@media (min-width:1024px){.mobile-ad-bar{display:none}}.sl-mobile-close-btn{color:#fff}.sl-mobile-close-btn:hover{color:#E8C98A}.sl-mobile-close-btn:focus-visible{outline:2px solid #E8C98A;outline-offset:2px}`}</style>
      <TrackedAdLink href={href} placement="bottom-bar" campaignId={campaignId} className="no-underline" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", color: "#F0EDE6" }}>
        {opacity ? <ImpressionOnView placement="bottom-bar" showSlug={campaignId} /> : null}
        {portrait ? <img src={portrait} alt="" width={32} height={32} decoding="async" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flex: "none", border: "1.5px solid #E8C98A" }} /> : null}
        <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{short}</span>
        <span style={{ marginLeft: "auto", background: accent, color: "#F0EDE6", padding: "5px 9px", borderRadius: 5, fontWeight: 800, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{cta} →</span>
      </TrackedAdLink>
      <button
        type="button"
        aria-label="Close ad"
        title="Close ad"
        onClick={close}
        className="sl-mobile-close-btn"
        style={{ width: 44, height: 44, marginRight: 6, borderRadius: "50%", border: "1px solid rgba(232,201,138,.8)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
      >
        <X size={18} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
