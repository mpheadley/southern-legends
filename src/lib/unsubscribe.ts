import { createHmac, timingSafeEqual } from "crypto";
import { SL_SITE_URL } from "@/lib/email-sender";

// Token = HMAC-SHA256(lowercased email) keyed with ADMIN_SEND_SECRET, hex.
export function unsubscribeToken(email: string): string | null {
  const secret = process.env.ADMIN_SEND_SECRET?.trim();
  if (!secret) return null;
  return createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (!expected || !/^[0-9a-f]{64}$/i.test(token)) return false;
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(token.toLowerCase(), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

// Full unsubscribe URL for a welcome/drip email. Falls back to the contact
// address if the secret isn't set, so an email never goes out with no way out.
export function unsubscribeUrl(email: string): string {
  const token = unsubscribeToken(email);
  if (!token) {
    return `mailto:matt@gatherstudio.app?subject=${encodeURIComponent("Unsubscribe me from Southern Legends")}`;
  }
  const params = new URLSearchParams({ e: email.trim().toLowerCase(), t: token });
  return `${SL_SITE_URL}/api/unsubscribe?${params.toString()}`;
}

// Footer appended to every welcome/drip email.
export function unsubscribeFooterHtml(email: string): string {
  const url = unsubscribeUrl(email);
  return `<p style="margin-top:28px;font-size:12px;color:#78716C;line-height:1.6;">You're getting this because you signed up at southernlegends.org. <a href="${url}" style="color:#9A3412;">Unsubscribe</a>.</p>`;
}

export function unsubscribeFooterText(email: string): string {
  return `\n\n--\nYou're getting this because you signed up at southernlegends.org.\nUnsubscribe: ${unsubscribeUrl(email)}`;
}
