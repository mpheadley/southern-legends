import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ministry in Northeast Alabama — Southern Legends",
  description:
    "United Methodist pastoral appointments, church communities, and ministry profiles across the East District of Northeast Alabama.",
  alternates: { canonical: "/ministry" },
  openGraph: { url: "/ministry" },
};

const EAST_DISTRICT = [
  { church: "Anniston First", city: "Anniston", pastor: "Rev. Tammy Jackson", status: "FE" },
  { church: "Anniston First (Associate)", city: "Anniston", pastor: "Rev. Kyle Bryan", status: "PD" },
  { church: "Jacksonville First", city: "Jacksonville", pastor: "Rev. Andy Curtis", status: "FE" },
  { church: "JSU Wesley Foundation", city: "Jacksonville", pastor: "Rev. Jay Robinson", status: "FE" },
  { church: "Heflin First", city: "Heflin", pastor: "Rev. Delaney Wray Holloway", status: "FE" },
  { church: "Pell City First", city: "Pell City", pastor: "Rev. Dr. Emmanuel Busambwa", status: "FE" },
  { church: "St. Mark", city: "Anniston", pastor: "Rev. Jeff Ponder-Twardy", status: "FE" },
  { church: "Sylacauga First", city: "Sylacauga", pastor: "Rev. Earl Freeman", status: "FE" },
  { church: "Dadeville First", city: "Dadeville", pastor: "Rev. Lloyd Gibbs Jr.", status: "FE" },
  { church: "Lineville First", city: "Lineville", pastor: "Rev. Christy Noren-Hentz", status: "FE" },
  { church: "Oak Grove", city: "Randolph County", pastor: "Rev. Christy Noren-Hentz", status: "FE" },
  { church: "Wedowee First", city: "Wedowee", pastor: "Rev. Todd Noren-Hentz", status: "FE" },
  { church: "Oxford First", city: "Oxford", pastor: "Rev. Amelia Sims", status: "RE" },
  { church: "Red Ridge", city: "St. Clair County", pastor: "Rev. Scott Coats", status: "FE" },
  { church: "Odenville", city: "Odenville", pastor: "Rev. David Teel", status: "FE" },
  { church: "Weaver First", city: "Weaver", pastor: "Rev. Dr. Bill Etheridge Jr.", status: "RE" },
  { church: "Alexander City First", city: "Alexander City", pastor: "Rev. Chip Vann III", status: "FE" },
  { church: "Saks First", city: "Saks", pastor: "Rev. Marian New", status: "RE" },
  { church: "Ranburne", city: "Ranburne", pastor: "Rev. Mark Williams", status: "FL" },
  { church: "Goodsell", city: "Randolph County", pastor: "Rev. Kelsey Barnes", status: "FL" },
  { church: "Lineville First", city: "Lineville", pastor: "Rev. Christy Noren-Hentz", status: "FE" },
  { church: "Haven", city: "Calhoun County", pastor: "Rev. Dann Huguley", status: "PLR" },
  { church: "Nances Creek", city: "Calhoun County", pastor: "Rev. Tommy Pritchett", status: "PLR" },
  { church: "Goodwater", city: "Goodwater", pastor: "Rev. Dr. Milton Smith", status: "OF" },
  { church: "Lanett First", city: "Lanett", pastor: "Rev. Jonathan Herston", status: "PL" },
];

const STATUS_LABELS: Record<string, string> = {
  FE: "Full Elder",
  FL: "Full Local Pastor",
  PL: "Provisional Local",
  PLR: "Part-time Local",
  RE: "Retired Elder",
  PD: "Provisional Deacon",
  RA: "Retired Associate",
  OF: "Other Full Connection",
  SY: "Supply",
};

export default function MinistryPage() {
  const unique = EAST_DISTRICT.filter(
    (item, idx, arr) =>
      arr.findIndex((x) => x.church === item.church && x.pastor === item.pastor) === idx
  );

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a3a1a 0%, #2d1a0a 100%)",
          padding: "5rem 1.5rem 3rem",
          color: "#f0ede6",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9a6c2f",
              marginBottom: "0.75rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Ministry · Northeast Alabama
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1rem",
              color: "#f0ede6",
            }}
          >
            United Methodist East District
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#d4c9b8", lineHeight: 1.7, maxWidth: "580px" }}>
            The East District of the North Alabama Conference covers Calhoun, Cleburne, Randolph,
            Talladega, Coosa, and parts of St. Clair and Shelby counties. Seventy-nine congregations.
            One district superintendent. Appointments effective July 1, 2026.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#9a6c2f", marginTop: "1.5rem" }}>
            District Superintendent: Rev. Dr. Clinton Hubbard Jr.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Featured: Ecclesia — fresh expression */}
        <a
          href="https://ecclesiacommunity.org"
          style={{
            display: "block",
            textDecoration: "none",
            background: "linear-gradient(135deg, #1a3a1a 0%, #2d1a0a 100%)",
            borderRadius: "8px",
            padding: "1.75rem 1.75rem",
            marginBottom: "3rem",
            color: "#f0ede6",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c79a4a",
              marginBottom: "0.6rem",
              fontFamily: "var(--font-body)",
            }}
          >
            A Fresh Expression · Anniston
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "0.6rem",
              color: "#f0ede6",
            }}
          >
            Ecclesia Community
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#d4c9b8", lineHeight: 1.65, maxWidth: "560px" }}>
            A fresh expression of Christian community in Northeast Alabama — gathered around the table,
            the land, and the work of walking together. Pastored by Matt Headley.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#c79a4a", marginTop: "1rem", fontFamily: "var(--font-body)" }}>
            Visit ecclesiacommunity.org →
          </p>
        </a>

        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9a6c2f",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-body)",
          }}
        >
          2026 Pastoral Appointments · East District
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {unique.map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid #e0d8cc",
                borderRadius: "6px",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#1a1208",
                  marginBottom: "0.2rem",
                }}
              >
                {item.church}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9a6c2f",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.city}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#3a2a1a",
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.pastor}
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#a09080",
                  marginTop: "0.25rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {STATUS_LABELS[item.status] ?? item.status}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #d4c9b8",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#9a6c2f",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            About this directory
          </p>
          <p style={{ fontSize: "0.88rem", color: "#5a4a3a", lineHeight: 1.7, maxWidth: "600px" }}>
            This directory reflects the 2026 North Alabama Annual Conference appointments effective
            July 1, 2026. Source: NAAC appointments document (umcna.org). Southern Legends covers
            Northeast Alabama — the churches, people, and communities making up this corner of the
            state.
          </p>
          <p style={{ fontSize: "0.88rem", color: "#5a4a3a", lineHeight: 1.7, maxWidth: "600px", marginTop: "0.75rem" }}>
            If you are a pastor in the East District and would like to be profiled in Southern
            Legends, reach out at{" "}
            <a
              href="mailto:matt@gatherstudio.app"
              style={{ color: "#9a6c2f", textDecoration: "underline" }}
            >
              matt@gatherstudio.app
            </a>
            .
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Link
            href="/essays"
            style={{
              display: "inline-block",
              fontSize: "0.85rem",
              color: "#9a6c2f",
              textDecoration: "underline",
              fontFamily: "var(--font-body)",
            }}
          >
            ← Back to essays
          </Link>
        </div>
      </section>
    </main>
  );
}
