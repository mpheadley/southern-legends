"use client";

import { useState, type CSSProperties } from "react";
import TurnstileWidget from "@/app/components/TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "";

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#1a1208",
  marginBottom: "0.4rem",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.875rem",
  border: "1px solid rgba(154,108,47,0.3)",
  borderRadius: "4px",
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  background: "#fff",
  color: "#1a1208",
  outline: "none",
  boxSizing: "border-box",
};

const FIELDS = [
  { name: "business_name", label: "Business name", type: "text", required: true, maxLength: 120, autoComplete: "organization" },
  { name: "city", label: "City", type: "text", required: true, maxLength: 120, autoComplete: "address-level2" },
  { name: "website", label: "Website or social link", type: "text", required: false, maxLength: 500, autoComplete: "url", placeholder: "https://" },
  { name: "your_name", label: "Your name", type: "text", required: true, maxLength: 120, autoComplete: "name" },
  { name: "your_email", label: "Your email", type: "email", required: true, maxLength: 254, autoComplete: "email" },
] as const;

/**
 * Plain HTML POST to /api/places/nominate. The server redirects back here with
 * ?success=1 or ?error=<code>; the page renders those. Same bot checks as the
 * subscribe form: a hidden honeypot field plus the Turnstile widget.
 */
export default function NominateForm() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [needsCaptcha, setNeedsCaptcha] = useState(false);

  return (
    <form
      action="/api/places/nominate"
      method="POST"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      onSubmit={(e) => {
        if (TURNSTILE_SITE_KEY && !captchaToken) {
          e.preventDefault();
          setNeedsCaptcha(true);
        }
      }}
    >
      {/* Honeypot: people never see or fill this. Bots usually do. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="nominate-company">Company</label>
        <input id="nominate-company" type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {FIELDS.map((field) => {
        const id = `nominate-${field.name}`;
        return (
          <div key={field.name}>
            <label htmlFor={id} style={labelStyle}>
              {field.label}
              {field.required && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={id}
              type={field.type}
              name={field.name}
              required={field.required}
              maxLength={field.maxLength}
              autoComplete={field.autoComplete}
              placeholder={"placeholder" in field ? field.placeholder : undefined}
              inputMode={field.name === "website" ? "url" : undefined}
              style={inputStyle}
            />
          </div>
        );
      })}

      <div>
        <label htmlFor="nominate-reason" style={labelStyle}>
          Why do they belong here?<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id="nominate-reason"
          name="reason"
          required
          maxLength={2000}
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Tell us what makes this business worth knowing."
        />
      </div>

      {TURNSTILE_SITE_KEY && (
        <div>
          <TurnstileWidget
            sitekey={TURNSTILE_SITE_KEY}
            onVerify={(t) => {
              setCaptchaToken(t);
              if (t) setNeedsCaptcha(false);
            }}
          />
          <input type="hidden" name="cf-turnstile-response" value={captchaToken} />
        </div>
      )}

      {needsCaptcha && (
        <p role="alert" style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#9a2f2f", margin: 0 }}>
          One more step: finish the quick check above, then press Submit again.
        </p>
      )}

      <button
        type="submit"
        style={{
          background: "#9a6c2f",
          color: "#F0EDE6",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "0.85rem 1.5rem",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        Submit nomination
      </button>
    </form>
  );
}
