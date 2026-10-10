"use client";

import { useState } from "react";
import TurnstileWidget from "./TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "";

export default function SubscribeCTA({
  variant = "section",
  source,
  heading,
  subhead,
  id,
  headingAs = "h2",
}: {
  variant?: "section" | "inline";
  source?: string;
  /** Optional section-variant overrides (e.g. /faith). Defaults keep the original copy. */
  heading?: string;
  subhead?: string;
  id?: string;
  /** Render the section heading as the page h1 (e.g. /subscribe). Default h2. */
  headingAs?: "h1" | "h2";
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");  // honeypot: humans leave this empty
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "captcha">("idle");
  const [captchaToken, setCaptchaToken] = useState("");

  // Both variants render the Turnstile widget whenever the site key is set. The server
  // (api/subscribe) rejects a submit with no token when TURNSTILE_SECRET_KEY is set, so
  // the widget must appear everywhere this form does.
  const ERROR_COPY = {
    error: "Something went wrong. Please try again.",
    captcha: "One more step: finish the quick check above, then press Subscribe again.",
  } as const;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus("captcha");
      return;
    }
    setStatus("loading");

    // ?source=forward (etc.) on the URL wins, so forwarded-email signups are visible.
    let urlSource: string | null = null;
    try {
      const raw = new URLSearchParams(window.location.search).get("source");
      if (raw && /^[a-z0-9_-]{1,40}$/i.test(raw)) urlSource = raw.toLowerCase();
    } catch {
      urlSource = null;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, email: email.trim(), firstName: firstName.trim(), captchaToken, source: urlSource ?? source ?? (variant === "inline" ? "footer" : "homepage") }),
      });
      if (res.ok) {
        setStatus("success");
        setFirstName("");
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
          Stories from Northeast Alabama
        </p>
        <p className="text-sm text-white/60 mb-3">
          Profiles of local makers and business owners, plus occasional personal writing from Matt.
        </p>

        {status === "success" ? (
          <p className="text-sm font-medium text-ll-accent">
            You&apos;re in. Watch for the next story.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="footer-subscribe-name">First name</label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />
              <input
                id="footer-subscribe-name"
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-28 px-3 py-2 text-sm rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-ll-accent"
              />
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
            </div>
            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <TurnstileWidget sitekey={TURNSTILE_SITE_KEY} onVerify={setCaptchaToken} />
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 text-sm bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}

        {(status === "error" || status === "captcha") && (
          <p className="mt-2 text-xs text-red-400" role="alert">{ERROR_COPY[status]}</p>
        )}
      </div>
    );
  }

  return (
    <section id={id} className="subscribe-cta text-white" style={{ background: "linear-gradient(to right, #1e3527, #5c3d02)" }}>
      <div className="max-w-xl mx-auto px-6 py-14 md:py-18 text-center">
        {(() => {
          const Heading = headingAs;
          return (
            <Heading
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {heading ?? "Stories from Northeast Alabama — and from the person writing them."}
            </Heading>
          );
        })()}
        {subhead && <p className="text-base text-white/75 mb-6">{subhead}</p>}

        {status === "success" ? (
          <p className="text-lg font-medium text-ll-accent">
            You&apos;re in. Watch for the next story.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="subscribe-name">First name</label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />
              <input
                id="subscribe-name"
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="subscribe-input sm:w-36 px-4 py-3 rounded text-ll-dark text-base bg-white placeholder:text-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-accent"
              />
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
            </div>
            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <TurnstileWidget sitekey={TURNSTILE_SITE_KEY} onVerify={setCaptchaToken} />
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {(status === "error" || status === "captcha") && (
          <p className="mt-4 text-sm text-red-400" role="alert">{ERROR_COPY[status]}</p>
        )}
      </div>
    </section>
  );
}
