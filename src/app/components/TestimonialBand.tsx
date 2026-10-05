"use client";
// TestimonialBand — wide end-of-article ad unit. PSBP: one message, one action, visible
// without interaction. Face + short verbatim quote = proof; the ask sits beside it.
// Support ad → free email signup inline (no click-away). Any other ad → one button.
import { useState } from "react";
import type { VentureCTA } from "@/lib/cta-router";
import type { Testimonial } from "@/lib/ad-brand";

export default function TestimonialBand({
  ad,
  t,
  accent,
  onAccent,
  label,
}: {
  ad: VentureCTA;
  t: Testimonial;
  accent: string;
  onAccent?: string;
  label: string;
}) {
  const sl = t.look === "sl";
  const bg = sl ? "/ad-assets/bg-sl.webp" : "/ad-assets/bg-gs.webp";
  const scrim = sl ? "rgba(22,14,8,.62)" : "rgba(26,46,33,.66)";
  const isSupport = ad.key === "support";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "ad-band-support" }),
      });
      setState(res.ok ? "done" : "err");
    } catch {
      setState("err");
    }
  }

  const btn = { background: "#E8C98A", color: "#1a1208", padding: "0.7rem 1.2rem", borderRadius: 6, fontWeight: 700, fontSize: "0.9rem", border: 0, cursor: "pointer", whiteSpace: "nowrap" as const, textShadow: "none" };

  return (
    <div className="px-6 py-8">
      <p className="max-w-3xl mx-auto text-[0.62rem] font-bold tracking-[0.16em] uppercase" style={{ color: "#8a8170", fontFamily: "var(--font-body)", marginBottom: 8 }}>
        {label}
      </p>
      <style>{`.tb-input::placeholder{color:#7a6f60;opacity:1}.tb{display:grid;grid-template-columns:auto 1fr;gap:22px;align-items:center}.tb-ask{grid-column:1 / -1}@media(min-width:760px){.tb{grid-template-columns:auto 1fr minmax(260px,320px)}.tb-ask{grid-column:auto}}`}</style>
      <div
        className="max-w-3xl mx-auto rounded-xl overflow-hidden relative"
        style={{ background: "#2a1d14", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.12)" }}
      >
        {/* scaled past the watercolor's torn paper edges so they never show */}
        <img src={bg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.35)" }} />
        <span style={{ position: "absolute", inset: 0, background: scrim }} />
        <div className="tb relative" style={{ padding: "22px 26px", textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>
          {t.face ? (
            <img src={t.face} alt={t.name} style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", border: "3px solid #E8C98A" }} />
          ) : (
            <span style={{ width: 84, height: 84, borderRadius: "50%", background: "#E8C98A", color: "#1a1208", fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", textShadow: "none" }}>
              {t.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </span>
          )}

          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "1.2rem", lineHeight: 1.3, margin: 0 }}>
              “{open ? t.back : t.front}”
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", margin: "8px 0 0", opacity: 0.95 }}>
              <strong style={{ color: "#E8C98A" }}>{t.name}</strong> · {t.org}
              {t.back !== t.front && (
                <button onClick={() => setOpen(!open)} style={{ marginLeft: 10, background: "none", border: 0, color: "#fff", textDecoration: "underline", fontSize: "0.78rem", cursor: "pointer", padding: 0, opacity: 0.85 }}>
                  {open ? "Show less" : "Read all of it"}
                </button>
              )}
            </p>
          </div>

          <div className="tb-ask">
            {isSupport ? (
              state === "done" ? (
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", margin: 0 }}>You&rsquo;re in. Watch your inbox.</p>
              ) : (
                <form onSubmit={submit}>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", margin: "0 0 8px", lineHeight: 1.25 }}>
                    Get new stories free.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      aria-label="Email address"
                      className="tb-input"
                      style={{ flex: 1, minWidth: 0, padding: "0.7rem 0.85rem", borderRadius: 6, border: "1px solid rgba(232,201,138,.7)", background: "#FFFDF8", color: "#1a1208", fontSize: "0.95rem", textShadow: "none" }}
                    />
                    <button type="submit" disabled={state === "busy"} style={btn}>
                      {state === "busy" ? "…" : "Send me stories"}
                    </button>
                  </div>
                  {state === "err" && <p style={{ fontSize: "0.75rem", margin: "6px 0 0" }}>That didn&rsquo;t go through. Try again?</p>}
                </form>
              )
            ) : (
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", margin: "0 0 10px", lineHeight: 1.25 }}>{ad.headline}</p>
                <a href={ad.href} target={ad.href.startsWith("http") ? "_blank" : undefined} rel={ad.href.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-block no-underline" style={btn}>
                  {ad.cta} →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
