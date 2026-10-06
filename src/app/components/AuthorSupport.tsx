import Image from "next/image";

export default function AuthorSupport() {
  return (
    <section style={{ borderTop: "1px solid #d4c9b8", background: "#faf8f4", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <Image
            src="/images/about/headshot-hedcut-matt-headley.webp"
            alt="Matt Headley"
            width={52}
            height={52}
            style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "#1a1208", lineHeight: 1.2 }}>
              Matt Headley
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#6b5040", lineHeight: 1.5, maxWidth: "30rem", marginTop: "0.2rem" }}>
              I cover Northeast Alabama — the people, places, and things worth knowing about. Southern Legends is independent and reader-supported.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
          <a
            href="/support"
            style={{ display: "inline-block", background: "#1a1208", color: "#f0ede6", fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, padding: "0.55rem 1.1rem", borderRadius: "6px", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Support this work →
          </a>
          <a
            href="/merch"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.73rem", color: "#9a6c2f", textDecoration: "underline", whiteSpace: "nowrap" }}
          >
            Shop the merch
          </a>
        </div>
      </div>
    </section>
  );
}
