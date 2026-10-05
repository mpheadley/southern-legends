"use client";

import { useEffect, useState } from "react";

const FREE_LIMIT = 3;
const READS_KEY = "sl_reads";
const MONTH_KEY = "sl_reads_month";
const UNLOCKED_KEY = "sl_unlocked";

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

function getReads(): string[] {
  try {
    // Reset the meter at the start of each calendar month so "this month" is honest.
    if (localStorage.getItem(MONTH_KEY) !== currentMonth()) {
      localStorage.setItem(MONTH_KEY, currentMonth());
      localStorage.setItem(READS_KEY, "[]");
      return [];
    }
    return JSON.parse(localStorage.getItem(READS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function isUnlocked(): boolean {
  return localStorage.getItem(UNLOCKED_KEY) === "true";
}

export default function ArticleGate({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [count, setCount] = useState(0);
  const [gated, setGated] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hideNote, setHideNote] = useState(false);

  useEffect(() => {
    if (isUnlocked()) {
      setUnlocked(true);
      setReady(true);
      return;
    }

    const reads = getReads();
    if (!reads.includes(slug)) {
      reads.push(slug);
      localStorage.setItem(READS_KEY, JSON.stringify(reads));
    }

    setCount(reads.length);
    // Wall only AFTER the free stories are used (was ">=", which walled the 3rd "free" story).
    if (reads.length > FREE_LIMIT) setGated(true);
    setReady(true);
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          source: "article-gate",
        }),
      });
      if (res.ok) {
        localStorage.setItem(UNLOCKED_KEY, "true");
        setStatus("success");
        setTimeout(() => {
          setGated(false);
          setUnlocked(true);
        }, 800);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!ready || unlocked) return null;

  // Heads-up: nothing on the first free stories (no clutter at the top of the article).
  // On the LAST free story only, a small dismissible note in the corner.
  if (!gated) {
    if (count !== FREE_LIMIT || hideNote) return null;
    return (
      <div className="not-prose fixed z-30 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bottom-[68px] lg:bottom-6 rounded-lg border border-ll-border bg-white shadow-lg px-4 py-3">
        <button type="button" aria-label="Close" onClick={() => setHideNote(true)} className="absolute top-1 right-2 text-ll-text-light text-lg leading-none">×</button>
        <p className="text-sm text-ll-dark font-semibold pr-4">This is your last free story this month.</p>
        <a href="/subscribe" className="text-sm font-semibold text-ll-primary hover:underline">Get every story free by email →</a>
      </div>
    );
  }

  // The wall — reader has used all free stories this month.
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20" style={{ top: "45%" }}>
      {/* Gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #f5f0eb)" }}
        aria-hidden="true"
      />

      {/* Gate card */}
      <div className="absolute top-32 left-0 right-0 bottom-0 bg-ll-light flex items-start justify-center px-6 pt-8">
        <div className="max-w-md w-full text-center">
          <img src="/ad-assets/sl-wordmark-crimson.png" alt="Southern Legends" className="mx-auto mb-4" style={{ height: 28, width: "auto" }} />
          <img src="/images/matt-headshot-square.webp" alt="Matt Headley" className="mx-auto mb-3 rounded-full object-cover" style={{ width: 84, height: 84, border: "3px solid #9A3412" }} />
          <p className="text-xs font-semibold tracking-widest uppercase text-ll-text-light mb-3">
            You&apos;ve read your {FREE_LIMIT} free stories this month
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-ll-dark mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Keep reading — it&apos;s free.
          </h2>
          <p className="text-base text-ll-text mb-6">
            Add your email and every Southern Legends story opens up, with new ones sent to you as they publish. No payment, ever.
            <br />
            <span className="text-sm text-ll-text-light">— Matt Headley</span>
          </p>

          {status === "success" ? (
            <p className="text-lg font-semibold text-ll-primary">
              You&apos;re in. Unlocking the story...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="sm:w-36 px-4 py-3 rounded text-ll-dark text-sm bg-white border border-ll-border focus:outline-none focus:ring-2 focus:ring-ll-accent"
                />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded text-ll-dark text-sm bg-white border border-ll-border focus:outline-none focus:ring-2 focus:ring-ll-accent"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "..." : "Send me the stories — free"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-500">Something went wrong. Try again.</p>
          )}

          <p className="mt-4 text-xs text-ll-text-light">
            No spam. Unsubscribe any time.
          </p>
        </div>
      </div>
    </div>
  );
}
