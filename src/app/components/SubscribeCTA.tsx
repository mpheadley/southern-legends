"use client";

import { useState } from "react";

export default function SubscribeCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // TODO: Replace with actual form endpoint (Formspree, ConvertKit, etc.)
    // For now, simulate success after a short delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
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
          Get notified when we publish a new profile. No spam, no fluff — just
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
              className="px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors disabled:opacity-60"
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
