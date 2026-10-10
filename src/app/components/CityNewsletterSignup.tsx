"use client"

import { useState } from "react"

export default function CityNewsletterSignup({ city }: { city: string }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/city-newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city }),
      })
      setStatus(res.ok ? "done" : "error")
    } catch {
      setStatus("error")
    }
  }

  // Styled to match SubscribeCTA (design audit QW-06); posts to the city list API.
  return (
    <div className="subscribe-cta text-white rounded-lg my-8 px-6 py-8 text-center" style={{ background: "linear-gradient(to right, #1e3527, #5c3d02)" }}>
      <p className="uppercase font-semibold text-ll-accent mb-2" style={{ fontSize: "var(--text-label)", letterSpacing: "0.15em" }}>
        Southern Legends
      </p>
      <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        The {city} Letter
      </p>
      <p className="text-base text-white/75 mb-5 max-w-md mx-auto">
        Weekly digest of what&apos;s happening in {city}. One story. One dispatch. When there&apos;s something worth sending.
      </p>
      {status === "done" ? (
        <p className="text-lg font-medium text-ll-accent">
          You&apos;re in. First issue coming soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <label className="sr-only" htmlFor={`city-letter-${city}`}>Email address</label>
          <input
            id={`city-letter-${city}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="subscribe-input flex-1 min-w-0 px-4 py-3 rounded text-ll-dark text-base bg-white placeholder:text-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-accent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark disabled:opacity-60"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
          {status === "error" && (
            <p className="w-full mt-1 text-sm text-red-400" role="alert">
              Something went wrong. Try again.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
