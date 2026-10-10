// Shared bot checks for public forms (api/subscribe, api/places/nominate).
// One home so every form behaves the same way.

/**
 * Honeypot: a hidden field people leave empty and most bots fill in.
 * Returns true when the submission should be dropped.
 */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: "missing" | "failed" };

/**
 * Cloudflare Turnstile server check. When TURNSTILE_SECRET_KEY is not set the
 * check is skipped (local dev) and reported as ok with skipped: true. In
 * production both keys must be set; the widget only renders with the site key.
 */
export async function verifyTurnstile(token: string | null | undefined, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true, skipped: true };

  const captchaToken = (token ?? "").trim();
  if (!captchaToken) return { ok: false, reason: "missing" };

  let body = `response=${encodeURIComponent(captchaToken)}&secret=${encodeURIComponent(secret)}`;
  if (remoteIp) body += `&remoteip=${encodeURIComponent(remoteIp)}`;

  try {
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const verifyData = (await verifyRes.json()) as { success?: boolean };
    return verifyData.success ? { ok: true, skipped: false } : { ok: false, reason: "failed" };
  } catch (err) {
    console.error("[turnstile] siteverify request failed:", err);
    return { ok: false, reason: "failed" };
  }
}
