"use client";

import { useState } from "react";

const TIERS = [
  { amount: "5", label: "$5", note: "Keeps a light on" },
  { amount: "10", label: "$10", note: "Patron letter monthly" },
  { amount: "20", label: "$20", note: "Welcome shirt + sticker", featured: true },
];

// tiers: which amounts to show, by key ("5", "10", "20"). Default shows all.
export default function PatronTiers({ tiers }: { tiers?: string[] } = {}) {
  const shown = tiers ? TIERS.filter((t) => tiers.includes(t.amount)) : TIERS;
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(tier: string) {
    setLoading(tier);
    try {
      const res = await fetch("/api/patron/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || "Something went wrong. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", maxWidth: "560px" }}>
      {shown.map((t) => (
        <button
          key={t.amount}
          onClick={() => subscribe(t.amount)}
          disabled={loading !== null}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
            padding: "1.25rem 1rem",
            borderRadius: "10px",
            border: t.featured ? "2px solid #9a6c2f" : "1px solid #d8cdbb",
            background: t.featured ? "#9a6c2f" : "#fff",
            color: t.featured ? "#fff" : "#1a1208",
            cursor: loading ? "wait" : "pointer",
            fontFamily: "var(--font-body)",
            transition: "transform 0.12s",
            opacity: loading && loading !== t.amount ? 0.5 : 1,
          }}
        >
          <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t.label}</span>
          <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>/ month</span>
          <span style={{ fontSize: "0.72rem", marginTop: "0.35rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
            {loading === t.amount ? (
              <>
                <span style={{
                  display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                  border: t.featured ? "2px solid rgba(255,255,255,0.4)" : "2px solid rgba(0,0,0,0.2)",
                  borderTopColor: t.featured ? "#fff" : "#9a6c2f",
                  animation: "spin 0.7s linear infinite",
                }} />
                Going to Stripe…
              </>
            ) : t.note}
          </span>
        </button>
      ))}
    </div>
  );
}
