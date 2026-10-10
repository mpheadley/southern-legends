import type { Metadata } from "next"
import Link from "next/link"
import NominateForm from "./NominateForm"

export const metadata: Metadata = {
  title: "Nominate a Place — Southern Legends",
  description: "Know a local business worth featuring in SL Places? Nominate them. We read every submission.",
  alternates: { canonical: "/places/nominate" },
}

const ERROR_COPY: Record<string, string> = {
  missing: "A few required fields were empty. Please fill in the business name, city, your name, your email, and why they belong here.",
  email: "That email address does not look right. Please check it and try again.",
  website: "The website link needs to start with http:// or https://. You can also leave it blank.",
  captcha: "The quick check did not go through. Please try it again.",
  invalid: "We could not read that submission. Please try again.",
  send: "Your nomination did not go through on our end. Please try again in a minute, or email matt@gatherstudio.app.",
}

export default async function NominatePlacePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams
  const errorMessage = error ? (ERROR_COPY[error] ?? ERROR_COPY.invalid) : null

  return (
    <main id="main-content" style={{ backgroundColor: "#F0EDE6", minHeight: "100vh" }}>
      <div className="mx-auto max-w-2xl px-6 pt-28 pb-20 md:pt-36">
        <Link
          href="/places"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#9a6c2f",
            textDecoration: "none",
            marginBottom: "2rem",
            display: "inline-block",
          }}
        >
          ← Places
        </Link>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#9a6c2f",
          marginBottom: "0.75rem",
          marginTop: "1rem",
        }}>
          SL Places
        </p>

        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 400,
          color: "#1a1208",
          marginBottom: "1rem",
          lineHeight: 1.15,
        }}>
          Nominate a business
        </h1>

        {success === "1" ? (
          <section
            aria-live="polite"
            style={{
              background: "#fff",
              border: "1px solid rgba(154,108,47,0.3)",
              borderRadius: "6px",
              padding: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 400, color: "#1a1208", marginBottom: "0.75rem" }}>
              Thank you. We have it.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "#4a3728", lineHeight: 1.7, marginBottom: "1rem" }}>
              Every nomination gets read by a person. If the business fits SL Places, we will reach out to them and let you know.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.7 }}>
              <Link href="/places" style={{ color: "#9a6c2f", fontWeight: 600 }}>Back to Places</Link>
              <span style={{ color: "#4a3728" }}> or </span>
              <Link href="/places/nominate" style={{ color: "#9a6c2f", fontWeight: 600 }}>nominate another business</Link>
              <span style={{ color: "#4a3728" }}>.</span>
            </p>
          </section>
        ) : (
          <>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "#4a3728",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}>
              SL Places lists businesses with a story behind them, not the ones who paid to be here. If you know a local business in Northeast Alabama worth knowing, tell us about it. We read every submission and reach out to the ones that fit.
            </p>

            {errorMessage && (
              <p
                role="alert"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "#7a1f1f",
                  background: "#fbeaea",
                  border: "1px solid #e3b4b4",
                  borderRadius: "4px",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {errorMessage}
              </p>
            )}

            <NominateForm />
          </>
        )}
      </div>
    </main>
  )
}
