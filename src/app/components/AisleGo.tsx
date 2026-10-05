"use client";
// Browser-side pieces of the Aisle ads, so the band can live in the site layout (every page,
// including new ones) without making pages dynamic. They tag the permanent /go/aisle link and
// QR with the current page, and keep the site-wide band off pages marked no-promo.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import QRCode from "qrcode";

const GO = "https://southernlegends.org/go/aisle";

/** Fire-and-forget impression/click beacon. Never blocks the page; no cookies, no personal data. */
export function sendAdEvent(event: "impression" | "click", placement: string, page: string, showSlug?: string) {
  try {
    const body = JSON.stringify({ event, placement, page, showSlug: showSlug ?? null, sessionId: sessionStorage.getItem("sl-ad-sid") ?? undefined });
    navigator.sendBeacon?.("/api/ad-event", new Blob([body], { type: "application/json" })) ||
      fetch("/api/ad-event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch { /* logging must never break the ad */ }
}
export const goHref = (path: string, spot: string, tier?: string) => `${GO}?from=${encodeURIComponent(`${path.replace(/^\//, "") || "home"}:${spot}`)}${tier ? `&tier=${tier}` : ""}`;

/** Paths that never get the site-wide band. */
const SKIP = [/^\/admin/, /^\/api/, /^\/go\//, /^\/support\/thanks/, /^\/r\//];

export function AisleGate({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "/";
  const [show, setShow] = useState(false); // hidden until checked → never flashes on a grief page
  useEffect(() => {
    const blocked = SKIP.some((re) => re.test(path)) || !!document.querySelector("[data-sl-no-promo]");
    setShow(!blocked);
  }, [path]);
  return show ? <>{children}</> : null;
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

/** Shows a visible × so the reader can dismiss the card for this visit. */
export function Dismissible({ children }: { children: ReactNode }) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div style={{ position: "relative" }}>
      {children}
      <button
        type="button"
        aria-label="Close this ad"
        onClick={() => setGone(true)}
        style={{ position: "absolute", top: -10, right: -10, width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(232,201,138,.8)", background: "#1e2a4a", color: "#fff", fontSize: 16, lineHeight: 1, cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
      >
        ×
      </button>
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
    return () => io.disconnect();
  }, [placement, path, showSlug]);
  return <span ref={ref} aria-hidden="true" style={{ display: "block", height: 1 }} />;
}
