"use client";
// Browser-side pieces of the Aisle ads, so the band can live in the site layout (every page,
// including new ones) without making pages dynamic. They tag the permanent /go/aisle link and
// QR with the current page, and keep the site-wide band off pages marked no-promo.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import QRCode from "qrcode";
import { X } from "lucide-react";

const GO = "https://southernlegends.org/go/aisle";

/** Fire-and-forget impression/click beacon. Never blocks the page; no cookies, no personal data. */
export function sendAdEvent(event: "impression" | "click" | "hover", placement: string, page: string, showSlug?: string) {
  try {
    const body = JSON.stringify({ event, placement, page, showSlug: showSlug ?? null, sessionId: sessionStorage.getItem("sl-ad-sid") ?? undefined });
    navigator.sendBeacon?.("/api/ad-event", new Blob([body], { type: "application/json" })) ||
      fetch("/api/ad-event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch { /* logging must never break the ad */ }
}
export const goHref = (path: string, spot: string, tier?: string) => `${GO}?from=${encodeURIComponent(`${path.replace(/^\//, "") || "home"}:${spot}`)}${tier ? `&tier=${tier}` : ""}`;

/** Paths that never get the site-wide band. */
const SKIP = [/^\/admin/, /^\/api/, /^\/go\//, /^\/support\/thanks/, /^\/r\//];

/**
 * Keeps site-wide ads off skipped paths and no-promo pages. With `askKey`, also stays off a
 * page that already makes that ask (an element marked data-sl-ask="<askKey>", e.g. the
 * closing block's Support button) — one ask per view.
 */
export function AdGate({ children, askKey }: { children: ReactNode; askKey?: string }) {
  const path = usePathname() ?? "/";
  const [show, setShow] = useState(false); // hidden until checked → never flashes on a grief page
  useEffect(() => {
    const blocked =
      SKIP.some((re) => re.test(path)) ||
      !!document.querySelector("[data-sl-no-promo]") ||
      (!!askKey && !!document.querySelector(`[data-sl-ask="${askKey}"]`));
    setShow(!blocked);
  }, [path, askKey]);
  return show ? <>{children}</> : null;
}
export const AisleGate = AdGate;

/** A plain link for scheduled (non-Aisle) ads that logs the click, then navigates normally. */
export function TrackedAdLink({ href, placement, campaignId, className, style, children }: { href: string; placement: string; campaignId: string; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const path = usePathname() ?? "/";
  const ext = href.startsWith("http");
  return (
    <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} className={className} style={style} onClick={() => sendAdEvent("click", placement, path, campaignId)}>
      {children}
    </a>
  );
}

export function AisleGoLink({ spot, tier, className, style, children }: { spot: string; tier?: string; className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const path = usePathname() ?? "/";
  return (
    <a href={goHref(path, spot, tier)} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );
}

export function AisleQR({ size }: { size: number }) {
  const path = usePathname() ?? "/";
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(goHref(path, "qr"), { type: "svg", margin: 1, color: { dark: "#1e2a4a", light: "#ffffff" } }).then(setSvg).catch(() => setSvg(""));
  }, [path]);
  return <span role="img" aria-label="Scan to register" className="ab-qr-svg" style={{ width: size, height: size, display: "block", margin: "0 auto" }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/**
 * Sticky sidebar behavior (convention): fades IN once the reader passes a quarter of the
 * page, stays visible while they read, and fades OUT only when the article reaches the footer.
 */
export function AfterQuarter({ children }: { children: ReactNode }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const check = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const footer = document.querySelector("footer");
      const footerTop = footer ? footer.getBoundingClientRect().top + y : Infinity;
      const card = 620; // card height + top offset: fade out before it touches the footer
      const fadeIn = max <= 0 ? 1 : y / max >= 0.25 ? 1 : 0;
      const fadeOut = footerTop - (y + window.innerHeight) < card ? 0 : 1;
      setOpacity(fadeIn && fadeOut);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);
  return (
    <div style={{ opacity, transition: "opacity 400ms ease", pointerEvents: opacity ? "auto" : "none" }}>
      {children}
    </div>
  );
}

/**
 * Shows a header row with the ad's label and a real close button so the reader can dismiss the
 * card. With a `campaignId`, the close is remembered in localStorage for `days` (default 7);
 * without one (e.g. MarginAisle's small floating card), it's session-only, same as before.
 */
export function Dismissible({ children, campaignId, label, days = 7 }: { children: ReactNode; campaignId?: string; label?: string; days?: number }) {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setReady(true);
      return;
    }
    try {
      const stored = localStorage.getItem(`sl-ad-closed:${campaignId}`);
      if (stored) {
        const closedAt = Number(stored);
        if (!Number.isNaN(closedAt) && Date.now() - closedAt < days * 24 * 60 * 60 * 1000) {
          setHidden(true);
        }
      }
    } catch { /* localStorage may be unavailable; fail open */ }
    setReady(true);
  }, [campaignId, days]);

  if (!ready || hidden) return null;

  const close = () => {
    setHidden(true);
    if (campaignId) {
      try { localStorage.setItem(`sl-ad-closed:${campaignId}`, String(Date.now())); } catch { /* ignore */ }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <style>{`.sl-ad-close-btn:hover{color:#ffffff}.sl-ad-close-btn:focus-visible{outline:2px solid #E8C98A;outline-offset:2px}`}</style>
      {/* Dark pill so the label + close read clearly over any page background; sentence case so it fits 300px on one line (2026-11-17). */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, margin: "0 0 6px", padding: "0 4px 0 14px", background: "#1C1917", borderRadius: 10, whiteSpace: "nowrap" }}>
        {label ? (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, letterSpacing: ".02em", color: "rgba(250,246,238,.72)", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{label}</p>
        ) : <span />}
        <button
          type="button"
          aria-label="Close this ad"
          onClick={close}
          className="sl-ad-close-btn inline-flex shrink-0 items-center gap-1 min-h-[44px] px-2 rounded text-[14px] font-semibold"
          style={{ color: "rgba(250,246,238,.85)", background: "transparent", border: 0, cursor: "pointer" }}
        >
          <X size={16} strokeWidth={2.25} aria-hidden />
          Close ad
        </button>
      </div>
      {children}
    </div>
  );
}

/** Logs ONE impression per placement per visit, once the card is actually on screen. */
export function ImpressionOnView({ placement, showSlug }: { placement: string; showSlug?: string }) {
  const path = usePathname() ?? "/";
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const key = `sl-ad-imp:${placement}:${path}`;
    if (sessionStorage.getItem(key)) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        sessionStorage.setItem(key, "1");
        sendAdEvent("impression", placement, path, showSlug);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    // Hover: a real pause on the card (≥800ms), logged once per placement per visit.
    const card = el.parentElement;
    const hoverKey = `sl-ad-hov:${placement}:${path}`;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const enter = () => { if (sessionStorage.getItem(hoverKey)) return; timer = setTimeout(() => { sessionStorage.setItem(hoverKey, "1"); sendAdEvent("hover", placement, path, showSlug); }, 800); };
    const leave = () => clearTimeout(timer);
    card?.addEventListener("mouseenter", enter);
    card?.addEventListener("mouseleave", leave);
    return () => { io.disconnect(); clearTimeout(timer); card?.removeEventListener("mouseenter", enter); card?.removeEventListener("mouseleave", leave); };
  }, [placement, path, showSlug]);
  return <span ref={ref} aria-hidden="true" style={{ display: "block", height: 1 }} />;
}
