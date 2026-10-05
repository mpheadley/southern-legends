"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sl_subscribe_popup_dismissed";
const RESHOW_DAYS = 14;

export default function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const days = (Date.now() - Number(dismissed)) / 86400000;
      if (days < RESHOW_DAYS) return;
    }

    let fired = false;

    function onScroll() {
      if (fired) return;
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct >= 0.45) {
        fired = true;
        setTimeout(() => setVisible(true), 400);
        window.removeEventListener("scroll", onScroll);
      }
    }

    // Fallback: show after 45s if no scroll
    const timer = setTimeout(() => {
      if (!fired) {
        fired = true;
        setVisible(true);
      }
    }, 45000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim(), source: "popup" }),
      });
      if (res.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setTimeout(() => setVisible(false), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "min(92vw, 480px)",
          background: "#1C1917",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
          padding: "2.5rem 2rem 2rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            color: "rgba(250,250,247,0.4)",
            fontSize: "1.4rem",
            lineHeight: 1,
            cursor: "pointer",
            padding: "0.25rem",
          }}
        >
          ×
        </button>

        {/* Eyebrow */}
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4622D", marginBottom: "0.75rem", fontWeight: 600 }}>
          Southern Legends
        </p>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.4rem", color: "#FAFAF7", marginBottom: "0.5rem" }}>
              You&rsquo;re in.
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(250,250,247,0.55)" }}>
              Watch for the next story.
            </p>
          </div>
        ) : (
          <>
            <h2
              id="popup-heading"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
                fontWeight: 400,
                color: "#FAFAF7",
                marginBottom: "0.6rem",
                lineHeight: 1.25,
              }}
            >
              Stories from Northeast Alabama
            </h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(250,250,247,0.55)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Profiles of local makers. Personal essays. New pieces sent when they&rsquo;re ready — no noise.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", margin: "0 0 1.25rem" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(240,237,230,.75)", lineHeight: 1.4 }}>
                You&rsquo;ll get a welcome note now, and new stories by email as they&rsquo;re published.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="First name (optional)"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={status === "loading"}
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  style={{ ...inputStyle, flex: "2 1 180px" }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  padding: "0.75rem",
                  background: "#C4622D",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  letterSpacing: "0.02em",
                }}
              >
                {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
              </button>

              {status === "error" && (
                <p style={{ fontSize: "0.8rem", color: "#f87171", textAlign: "center" }}>
                  Something went wrong. Try again.
                </p>
              )}
            </form>

            <p style={{ fontSize: "0.72rem", color: "rgba(250,250,247,0.3)", marginTop: "1rem", textAlign: "center" }}>
              No spam. Unsubscribe any time.
            </p>
          </>
        )}
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  flex: "1 1 130px",
  padding: "0.65rem 0.9rem",
  fontSize: "0.875rem",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "4px",
  color: "#FAFAF7",
  outline: "none",
};
