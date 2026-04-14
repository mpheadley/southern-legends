"use client";

import { useState } from "react";

export default function SubscribeCTA({ variant = "section" }: { variant?: "section" | "inline" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://formspree.io/f/xyknwdgp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "newsletter-southern-legends",
          newsletter_optin: "yes",
          _subject: "Southern Legends newsletter signup",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (variant === "inline") {
    return (
      <div className="max-w-md mx-auto text-center">
        <p
          className="text-lg font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Don&apos;t Miss a Story
        </p>
        <p className="text-sm text-white/60 mb-3">
          Get notified when new profiles drop. No spam.
        </p>

        {status === "success" ? (
          <p className="text-sm font-medium text-ll-accent">
            You&apos;re in. We&apos;ll let you know when the next story drops.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <label className="sr-only" htmlFor="footer-subscribe-email">Email address</label>
            <input
              id="footer-subscribe-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-ll-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 text-sm bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
        )}
      </div>
    );
  }

  return (
    <section className="subscribe-cta bg-ll-dark text-white">
      <div className="max-w-xl mx-auto px-6 py-14 md:py-18 text-center">
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Don&apos;t Miss a Story
        </h2>
        <p className="text-white/60 mb-8 text-base leading-relaxed">
          Get notified when we publish a new profile. No spam, no fluff. Just
          stories worth reading.
        </p>

        {status === "success" ? (
          <p className="text-lg font-medium text-ll-accent">
            You&apos;re in. We&apos;ll let you know when the next story drops.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {/* Honeypot */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            <label className="sr-only" htmlFor="subscribe-email">Email address</label>
            <input
              id="subscribe-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="subscribe-input flex-1 px-4 py-3 rounded text-ll-dark text-base bg-white placeholder:text-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
