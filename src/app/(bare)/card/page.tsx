import type { Metadata } from "next";
import Image from "next/image";
import { UserPlus, BookOpen, PenLine } from "lucide-react";
// Instagram removed from lucide-react — using SVG inline instead

export const metadata: Metadata = {
  title: "Matt Headley — Southern Legends",
  description: "Longform stories from Northeast Alabama. The people. The places. The ones worth remembering.",
  robots: { index: false, follow: false },
};

export default function SLCardPage() {
  return (
    <main id="main-content" className="min-h-[100dvh] flex flex-col">
      <style>{`
        html, body { margin: 0; padding: 0; background: #1C1917; }
        .sl-card:hover {
          background: rgba(250,250,247,0.08) !important;
          border-color: rgba(202,138,4,0.3) !important;
        }
      `}</style>

      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          minHeight: "58dvh",
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: "#1C1917",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/journal/matt-headley-clergy-robe.webp"
          alt=""
          fill
          priority
          aria-hidden="true"
          style={{ objectFit: "cover", objectPosition: "60% top" }}
          sizes="100vw"
        />
        {/* Left fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(28,25,23,0.95) 0%, rgba(28,25,23,0.70) 45%, rgba(28,25,23,0.15) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "90px",
            background: "linear-gradient(to bottom, transparent, #1C1917)",
          }}
        />

        {/* Name block */}
        <div style={{ position: "relative", zIndex: 1, padding: "clamp(20px,4vw,48px) clamp(20px,5vw,48px) clamp(24px,4vw,44px)" }}>
          <p
            style={{
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#CA8A04",
              marginBottom: "14px",
            }}
          >
            Northeast Alabama
          </p>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(3rem, 13vw, 6rem)",
              fontWeight: 700,
              lineHeight: 0.9,
              color: "#FAFAF7",
              marginBottom: "18px",
            }}
          >
            Matt
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "rgba(250,250,247,0.35)" }}>
              Headley
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "0.72rem",
              color: "rgba(250,250,247,0.5)",
              letterSpacing: "0.06em",
              fontStyle: "italic",
            }}
          >
            The people. The places. The ones worth remembering.
          </p>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="flex-1 px-5 py-7" style={{ background: "#1C1917" }}>
        <div style={{ maxWidth: "420px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.625rem" }}>

          {/* Primary — Read the Stories */}
          <a
            href="https://southernlegends.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.85rem 1.25rem",
              background: "#CA8A04",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#1C1917",
              textDecoration: "none",
              fontFamily: "var(--font-source-sans), sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            <BookOpen size={15} strokeWidth={2} />
            Read the Stories
          </a>

          {/* Nominate a story */}
          <a
            href="https://southernlegends.org/nominate"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              background: "rgba(250,250,247,0.06)",
              border: "1px solid rgba(202,138,4,0.25)",
              borderRadius: "10px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#CA8A04",
              textDecoration: "none",
              fontFamily: "var(--font-source-sans), sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            <PenLine size={14} strokeWidth={2} />
            Nominate a Story
          </a>

          {/* Save Contact */}
          <a
            href="/api/vcf"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "rgba(250,250,247,0.35)",
              textDecoration: "none",
              fontFamily: "var(--font-source-sans), sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            <UserPlus size={13} strokeWidth={1.5} />
            Save Contact
          </a>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(202,138,4,0.15)", margin: "4px 0" }} />

          {/* Instagram */}
          <a
            href="https://www.instagram.com/southern_legends_matt_headley/"
            target="_blank"
            rel="noopener noreferrer"
            className="sl-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              padding: "0.75rem 1rem",
              background: "rgba(250,250,247,0.05)",
              border: "1px solid rgba(202,138,4,0.12)",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            <span
              style={{
                width: "42px", height: "42px",
                borderRadius: "50%",
                background: "#9A3412",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(202,138,4,0.2)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FAFAF7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </span>
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#FAFAF7",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  marginBottom: "2px",
                }}
              >
                @southern_legends_matt_headley
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  color: "rgba(250,250,247,0.4)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                }}
              >
                Follow on Instagram
              </span>
            </span>
          </a>

          {/* Footer */}
          <p
            style={{
              marginTop: "1.25rem",
              textAlign: "center",
              fontSize: "0.6rem",
              color: "rgba(202,138,4,0.25)",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-source-sans), sans-serif",
              textTransform: "uppercase",
            }}
          >
            southernlegends.org
          </p>
        </div>
      </div>
    </main>
  );
}
