import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Listen — Southern Legends",
  description:
    "Audio from Southern Legends — stories from the Appalachian foothills of Northeast Alabama. Podcast episodes and audiobook coming.",
  alternates: { canonical: "/listen" },
  openGraph: { url: "/listen" },
};

export default function ListenPage() {
  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section
        style={{
          background: "#292524",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#CA8A04",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            Audio
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading, 'Fraunces', serif)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#FAFAF7",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}
          >
            Listen to Southern Legends
          </h1>
          <p
            style={{
              color: "rgba(250,250,247,0.60)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "460px",
              margin: "0 auto",
            }}
          >
            Stories from Northeast Alabama — in audio form. The podcast is live.
            The audiobook is coming.
          </p>
        </div>
      </section>

      {/* ── Podcast ── */}
      <section
        style={{
          background: "#F0EDE6",
          padding: "4rem 1.5rem",
          borderTop: "1px solid rgba(41,37,36,0.12)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading, 'Fraunces', serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#292524",
              marginBottom: "0.5rem",
            }}
          >
            The Podcast
          </h2>
          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.65,
              marginBottom: "1.75rem",
            }}
          >
            Long-form audio stories about the people who built something here —
            and kept building when it got hard. Available wherever you listen.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            <a
              href={siteConfig.podcast.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.75rem 1.25rem",
                background: "#1DB954",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1.1rem", height: "1.1rem" }}>
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Listen on Spotify
            </a>

            <a
              href={siteConfig.podcast.apple}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.75rem 1.25rem",
                background: "#9A3412",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1.1rem", height: "1.1rem" }}>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.75 17.89c-.15.09-.33.11-.5.05a.598.598 0 0 1-.37-.56v-3.19a1.85 1.85 0 1 1 1.5 0v2.6l2.22-1.28c.27-.16.6-.06.76.21.16.27.06.6-.21.76l-3.4 1.41zm3.37-6.88a4.5 4.5 0 1 0-8.24 2.5.6.6 0 0 0 1.04-.6 3.3 3.3 0 1 1 6.16-1.9.6.6 0 0 0 1.04 0z" />
              </svg>
              Listen on Apple Podcasts
            </a>

            <a
              href={siteConfig.podcast.rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.75rem 1.25rem",
                background: "transparent",
                color: "#9A3412",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                border: "1.5px solid #9A3412",
                width: "fit-content",
              }}
            >
              RSS Feed
            </a>
          </div>

          <Link
            href="/podcast"
            style={{
              color: "#9A3412",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            View all episodes →
          </Link>
        </div>
      </section>

      {/* ── Audiobook coming soon ── */}
      <section
        style={{
          background: "#FAFAF7",
          padding: "4rem 1.5rem 5rem",
          borderTop: "1px solid rgba(41,37,36,0.10)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading, 'Fraunces', serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#292524",
              marginBottom: "0.5rem",
            }}
          >
            Audiobook — Coming Soon
          </h2>
          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.65,
              marginBottom: "1.5rem",
            }}
          >
            The Southern Legends stories are being prepared for audio. When they
            are ready, you will find them here — full narrations of the profiles
            that have appeared on this site, in the voice they were written in.
          </p>
          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.65,
            }}
          >
            In the meantime,{" "}
            <Link
              href="/profiles"
              style={{ color: "#9A3412", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              read the stories
            </Link>{" "}
            or{" "}
            <Link
              href="/subscribe"
              style={{ color: "#9A3412", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              subscribe
            </Link>{" "}
            to hear when new work is published.
          </p>
        </div>
      </section>
    </main>
  );
}
