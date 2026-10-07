"use client";

import { useState } from "react";
import TurnstileWidget from "./TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "";

export default function NewsletterCapture({ source = "unknown" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");  // honeypot: humans leave this empty
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [captchaToken, setCaptchaToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setErrorMsg("Please verify you're not a robot.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, email: email.trim(), source, captchaToken }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        background: "#1C1917",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          fontWeight: 400,
          color: "#FAFAF7",
          marginBottom: "0.4rem",
        }}
      >
        Stories from Northeast Alabama
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(250,250,247,0.55)",
          marginBottom: "0.5rem",
          maxWidth: "380px",
          margin: "0 auto 0.5rem",
          lineHeight: 1.65,
        }}
      >
        About twice a month. If I don&rsquo;t have one worth your time, I skip it.
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#C4622D",
          marginBottom: "1.5rem",
          maxWidth: "380px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        Subscribe and get SL Magazine Issue 1 free when it drops this fall.
      </p>

      {status === "success" ? (
        <p style={{ fontSize: "0.9rem", color: "#C4622D", fontWeight: 600 }}>
          You&rsquo;re in. Watch for the next story.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "420px",
            margin: "0 auto",
          }}
        >
          <label className="sr-only" htmlFor="nl-email">Email address</label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />
          <input
            id="nl-email"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            style={{
              flex: "1 1 200px",
              padding: "0.65rem 1rem",
              fontSize: "0.9rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              color: "#FAFAF7",
              outline: "none",
            }}
          />
          {TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <TurnstileWidget sitekey={TURNSTILE_SITE_KEY} onVerify={setCaptchaToken} />
            </div>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "0.65rem 1.4rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "#C4622D",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          {status === "error" && (
            <p
              style={{
                width: "100%",
                fontSize: "0.8rem",
                color: "#f87171",
                marginTop: "0.25rem",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
