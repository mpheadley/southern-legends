import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Gather Almanac — Southern Legends",
  description:
    "The almanac for the modern South. Kept knowledge for the place you actually live — when things bloom, what's on the calendar, who to know — refreshed all year and printed once a year to keep.",
  robots: { index: false },
  alternates: { canonical: "/almanac" },
  openGraph: { url: "/almanac" },
};

const issues = [
  {
    slug: "/almanac/autumn-2026",
    season: "Autumn 2026",
    title: "Harvest Number",
    excerpt:
      "First frost math for Calhoun County, the fall festival calendar from Jacksonville to Piedmont, what to put in the ground before the ground goes hard, and the people keeping the season.",
    live: true,
  },
];

const sections = [
  ["When It Blooms", "Planting, first-and-last frost, and what the ground is doing this season — for here, not for the whole country."],
  ["The Calendar", "Festivals, markets, revivals, and gatherings across Northeast Alabama, kept in one place."],
  ["Weather Lore", "The old sayings, checked against the new records. What held. What didn't."],
  ["The People", "Short profiles of the folks who keep the season — growers, makers, cooks, and characters."],
  ["The Back Forty", "Southern Gothic agrarian satire finds its print home here."],
];

const label: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--color-ll-accent)",
  fontFamily: "var(--font-body)",
};

export default function AlmanacPage() {
  return (
    <main style={{ backgroundColor: "var(--color-ll-warm)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "7.5rem 1.5rem 6rem" }}>
        <p style={{ ...label, marginBottom: "0.75rem" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Southern Legends
          </Link>
          {" / "} The Gather Almanac
        </p>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "var(--color-ll-dark)",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          The Gather Almanac
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.15rem",
            color: "var(--color-ll-text)",
            lineHeight: 1.75,
            marginBottom: "1rem",
          }}
        >
          The almanac for the modern South. Kept knowledge for the place you actually
          live — when the dogwoods break, which festivals are worth the drive, who to
          know — refreshed all year and printed once a year to keep.
        </p>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            color: "var(--color-ll-text-light)",
            lineHeight: 1.75,
            marginBottom: "3rem",
          }}
        >
          The Old Farmer&rsquo;s Almanac is national and weather-anchored. Nobody&rsquo;s
          <em> local</em> almanac. This one has a place, a voice, and a spot on the counter.
        </p>

        <p style={{ ...label, marginBottom: "1rem" }}>Current Issue</p>
        {issues.map((it) => (
          <Link
            key={it.slug}
            href={it.slug}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <article
              style={{
                background: "var(--color-ll-white)",
                border: "1px solid var(--color-ll-border)",
                borderRadius: "0.5rem",
                padding: "1.75rem",
                marginBottom: "3rem",
              }}
            >
              <p style={{ ...label, color: "var(--color-ll-text-light)", marginBottom: "0.5rem" }}>
                {it.season}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--color-ll-dark)",
                  marginBottom: "0.6rem",
                  lineHeight: 1.15,
                }}
              >
                {it.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  color: "var(--color-ll-text)",
                  lineHeight: 1.7,
                }}
              >
                {it.excerpt}
              </p>
              <p style={{ ...label, color: "var(--color-ll-primary)", marginTop: "1rem" }}>
                Read the issue &rarr;
              </p>
            </article>
          </Link>
        ))}

        <p style={{ ...label, marginBottom: "1.25rem" }}>What&rsquo;s Inside Every Issue</p>
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {sections.map(([name, desc]) => (
            <div
              key={name}
              style={{
                borderLeft: "3px solid var(--color-ll-accent)",
                paddingLeft: "1rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--color-ll-dark)",
                  marginBottom: "0.3rem",
                }}
              >
                {name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.98rem",
                  color: "var(--color-ll-text)",
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3.5rem",
            padding: "1.75rem",
            background: "var(--color-ll-white)",
            border: "1px solid var(--color-ll-border)",
            borderRadius: "0.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--color-ll-dark)",
              marginBottom: "0.6rem",
            }}
          >
            Keep the Almanac
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--color-ll-text)",
              lineHeight: 1.7,
              marginBottom: "1.1rem",
            }}
          >
            The seasonal issues land free by email. A keepsake print annual comes later,
            once there&rsquo;s enough of us to keep it.
          </p>
          <Link
            href="/subscribe"
            style={{
              display: "inline-block",
              background: "var(--color-ll-primary)",
              color: "var(--color-ll-white)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 600,
              padding: "0.7rem 1.4rem",
              borderRadius: "0.4rem",
              textDecoration: "none",
            }}
          >
            Get the seasonal issue &rarr;
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--color-ll-text-light)",
            lineHeight: 1.6,
            marginTop: "2.5rem",
          }}
        >
          Edited by Matt Headley. Drafted by Iris — Matt&rsquo;s AI EA and creative partner.
        </p>
      </div>
    </main>
  );
}
