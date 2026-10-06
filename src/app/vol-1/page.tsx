import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vol. 1 — Fall 2026 | Southern Legends",
  description:
    "Reserve your copy of Southern Legends Vol. 1, Fall 2026. Five profiles from Northeast Alabama — the Freedom Riders monument, a restaurant built on Noble Street, a healing farm, a hardware store, and a network of churches. 200 copies. $15.",
  openGraph: {
    title: "Southern Legends Vol. 1 — Fall 2026",
    description:
      "Five profiles. 200 copies. Northeast Alabama. $15 — 10% benefits early childhood literacy through UWECA.",
    url: "https://southernlegends.org/vol-1",
    images: [{ url: "https://southernlegends.org/images/og-default.webp", width: 1200, height: 630 }],
  },
};

// Reserve link: a real payment link once NEXT_PUBLIC_VOL1_PAYMENT_URL is set,
// email until then.
const PAYMENT_URL = process.env.NEXT_PUBLIC_VOL1_PAYMENT_URL?.trim() || "";
const RESERVE_HREF =
  PAYMENT_URL ||
  `mailto:matt@gatherstudio.app?subject=${encodeURIComponent("Reserve: Southern Legends Vol. 1")}&body=${encodeURIComponent("I'd like to reserve a copy of Southern Legends Vol. 1 ($15). Please let me know when and where to pick it up.")}`;

const PROFILES = [
  {
    title: "The Burning Bus",
    sub: "Freedom Riders National Monument · Anniston",
    desc: "On May 14, 1961, a Greyhound bus was firebombed outside Anniston. The photograph ran in forty countries. The place is now a national monument two blocks from a hardware store.",
  },
  {
    title: "The View from the Boat",
    sub: "Jean Ellison · Mom-To-Go & The Music Box",
    desc: "Jean Ellison spent twenty years at JSU. Then her second child was born, her car was repossessed, a friend sat with her on the floor, and she built a restaurant on Noble Street.",
  },
  {
    title: "A New Way of Growing",
    sub: "Samuel & John Mark Sawyer · Aquality Farms",
    desc: "A father and son growing food in water. Aquaculture in Alabama, twenty miles from where their family has farmed for four generations.",
  },
  {
    title: "1030 Gurnee",
    sub: "Lewis Downing · Downing and Sons",
    desc: "Lewis Downing has run his family's hardware store next door to the Freedom Riders monument his whole adult life. The store opened in 1963.",
  },
  {
    title: "When the Churches Stopped Competing",
    sub: "Interfaith Ministries of Calhoun County",
    desc: "What happens when forty congregations decide to stop working separately and start working together.",
  },
];

export default function Vol1Page() {
  return (
    <main style={{ background: "var(--ll-light, #FAFAF7)", minHeight: "100dvh" }}>

      {/* Hero */}
      <section
        style={{
          background: "#1C1917",
          padding: "5.5rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/topo-7.png')",
            backgroundSize: "cover",
            opacity: 0.2,
            mixBlendMode: "soft-light",
          }}
        />
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#CA8A04",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Southern Legends · Vol. 1
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 300,
              color: "#FAFAF7",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              marginBottom: "1.75rem",
            }}
          >
            Southern<br />Legends
          </h1>
          <div
            style={{
              width: "3rem",
              height: "1.5px",
              background: "#CA8A04",
              margin: "0 auto 1.5rem",
              opacity: 0.7,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "rgba(250,250,247,0.65)",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
            }}
          >
            Fall 2026 · Northeast Alabama · 200 copies
          </p>
          <a
            href="#reserve"
            style={{
              display: "inline-block",
              background: "#9A3412",
              color: "#FAFAF7",
              padding: "0.85rem 2rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            Reserve your copy — $15
          </a>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              color: "rgba(250,250,247,0.35)",
              marginTop: "1rem",
            }}
          >
            10% of proceeds support early childhood literacy through UWECA&rsquo;s<br />
            Imagination Library program — doubled by the State of Alabama.
          </p>
        </div>
      </section>

      {/* What's Inside */}
      <section style={{ padding: "5rem 2rem", background: "#F0EDE6" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#CA8A04",
              marginBottom: "1rem",
              fontFamily: "var(--font-body)",
            }}
          >
            In This Edition
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 400,
              color: "#1C1917",
              lineHeight: 1.2,
              marginBottom: "3rem",
            }}
          >
            Five profiles. Five people still building<br />in Northeast Alabama.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {PROFILES.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(28,25,23,0.1)",
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.75rem",
                    color: "#CA8A04",
                    paddingTop: "0.15rem",
                  }}
                >
                  {i + 1}.
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#1C1917",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#9A3412",
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p.sub}
                  </p>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#6B6560",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B6560",
              lineHeight: 1.75,
              marginTop: "2.5rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Plus: an essay by Matt Headley on the Bloom Bar — the converted horse trailer that started as a hat bar and became a flower shop. And an excerpt from{" "}
            <em>Chief Ladiga, 1832.</em>
          </p>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ padding: "5rem 2rem", background: "#FAFAF7" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#CA8A04",
              marginBottom: "1rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Reserve Your Copy
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 400,
              color: "#1C1917",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            200 copies. Fall 2026.
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#6B6560",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              fontFamily: "var(--font-body)",
            }}
          >
            $15 per copy. Available at{" "}
            <strong style={{ color: "#1C1917" }}>The Aisle: Anniston Bridal Show</strong> on October 18, 2026 at Anniston Museums & Gardens — and at select local spots in Northeast Alabama.
          </p>
          <a
            href={RESERVE_HREF}
            {...(PAYMENT_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            style={{
              display: "inline-block",
              background: "#9A3412",
              color: "#FAFAF7",
              padding: "0.9rem 2.25rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              marginBottom: "1.5rem",
            }}
          >
            {PAYMENT_URL ? "Reserve a copy → $15" : "Email to reserve → $15"}
          </a>
          <div
            style={{
              background: "#F0EDE6",
              borderLeft: "3px solid #CA8A04",
              padding: "1rem 1.25rem",
              textAlign: "left",
              marginTop: "2rem",
            }}
          >
            <p
              style={{
                fontSize: "0.82rem",
                color: "#3F3B36",
                lineHeight: 1.75,
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              <strong>10% of every copy sold</strong> supports early childhood literacy through UWECA&rsquo;s Imagination Library program.
              The State of Alabama doubles every dollar — so your $1.50 becomes $3 for a child&rsquo;s bookshelf.
            </p>
          </div>
        </div>
      </section>

      {/* Back to site */}
      <section style={{ padding: "2.5rem 2rem", textAlign: "center", borderTop: "1px solid rgba(28,25,23,0.08)" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.78rem",
            color: "#9A3412",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          ← Read the stories at southernlegends.org
        </Link>
      </section>

    </main>
  );
}
