"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sl_support_popup_dismissed";
const SUBSCRIBE_KEY = "sl_subscribe_popup_dismissed";
const RESHOW_DAYS = 30;

export default function SupportPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed recently
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const days = (Date.now() - Number(dismissed)) / 86400000;
      if (days < RESHOW_DAYS) return;
    }

    // Don't compete with subscribe popup — wait until subscribe is dismissed
    function tryArm() {
      const subscribeShown = localStorage.getItem(SUBSCRIBE_KEY);
      if (!subscribeShown) return; // subscribe popup hasn't fired yet

      let fired = false;

      function onScroll() {
        if (fired) return;
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (pct >= 0.88) {
          fired = true;
          setTimeout(() => setVisible(true), 600);
          window.removeEventListener("scroll", onScroll);
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Poll briefly for subscribe popup to have fired, then arm
    const poll = setInterval(() => {
      const cleanup = tryArm();
      if (cleanup) {
        clearInterval(poll);
      }
    }, 2000);

    // Max wait 60s then arm regardless
    const fallback = setTimeout(() => {
      clearInterval(poll);
      tryArm();
    }, 60000);

    return () => {
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 9996,
          backdropFilter: "blur(2px)",
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-popup-heading"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 9997,
          width: "min(92vw, 360px)",
          background: "#1C1917",
          border: "1px solid rgba(196,98,45,0.35)",
          borderRadius: "6px",
          padding: "1.75rem 1.5rem 1.5rem",
          boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.85rem",
            background: "none",
            border: "none",
            color: "rgba(250,250,247,0.35)",
            fontSize: "1.3rem",
            lineHeight: 1,
            cursor: "pointer",
            padding: "0.2rem",
          }}
        >
          ×
        </button>

        <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4622D", marginBottom: "0.6rem", fontWeight: 600 }}>
          If this was worth your time
        </p>

        <h2
          id="support-popup-heading"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "#FAFAF7",
            marginBottom: "0.75rem",
            lineHeight: 1.3,
          }}
        >
          Southern Legends is free. Readers keep it that way.
        </h2>

        <p style={{ fontSize: "0.825rem", color: "rgba(250,250,247,0.55)", marginBottom: "1.25rem", lineHeight: 1.7 }}>
          $5 a month covers the gas, the memory card, and the afternoon it takes to sit with somebody. That&rsquo;s all it is.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <a
            href="/support"
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.7rem",
              background: "#C4622D",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Become a Reader, $5 a month
          </a>

          <button
            onClick={dismiss}
            style={{
              background: "none",
              border: "none",
              color: "rgba(250,250,247,0.35)",
              fontSize: "0.78rem",
              cursor: "pointer",
              padding: "0.25rem",
              textDecoration: "underline",
              textDecorationColor: "rgba(250,250,247,0.2)",
            }}
          >
            No thanks, I&rsquo;ll keep reading free
          </button>
        </div>
      </div>
    </>
  );
}
