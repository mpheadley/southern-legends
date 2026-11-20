// Junk submission filter (Nov 2026) — bots fill contact/tour forms with
// random mixed-case strings ("VToLyuUmInPPxvoPN"), dotted-gmail aliases
// ("ik.iduti.3.50@gmail.com") and impossible dates (1970). The honeypot
// misses them because they skip hidden fields. Same rules as
// gather/packages/shared/src/junk-registration.ts (keep in sync).

function isGibberish(s: unknown): boolean {
  const n = String(s ?? "").trim();
  if (!n || /\s/.test(n) || n.length < 10) return false;
  if (!/^[A-Za-z]+$/.test(n)) return false;
  if ((n.slice(1).match(/[A-Z]/g) ?? []).length >= 3) return true;
  return !/[aeiouyAEIOUY]/.test(n);
}

function isDottedGmailAlias(email: unknown): boolean {
  const e = String(email ?? "").trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at < 0) return false;
  const local = e.slice(0, at);
  const domain = e.slice(at + 1);
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  const dots = (local.match(/\./g) ?? []).length;
  return dots >= 3 || (dots === 2 && /(^|\.)[a-z0-9]\./.test(local));
}

/** Returns a reason when the submission looks like a bot, else null. */
// Disposable / test inboxes (Form Guard v2 list, Nov 20 2026).
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "grr.la",
  "10minutemail.com", "temp-mail.org", "tempmail.com", "tempmail.net", "tempail.com",
  "yopmail.com", "trashmail.com", "getnada.com", "nada.email", "dispostable.com",
  "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mohmal.com", "emailondeck.com",
  "mintemail.com", "spamgourmet.com", "burnermail.io", "moakt.com", "inboxkitten.com",
  "mailnesia.com", "mailcatch.com", "tmpmail.org", "tmail.ws", "spam4.me",
  "example.com", "test.com", "sagemindai.io", "ioud.co", "xwf.google.com",
]);

// Per-IP burst limit for public form routes (in-memory; resets on cold start).
const ipBuckets = new Map<string, number[]>();
export function rateLimited(req: { headers: Headers }, key: string, max = 5, windowMs = 60_000): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const k = `${key}:${ip}`;
  const now = Date.now();
  const hits = (ipBuckets.get(k) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  ipBuckets.set(k, hits);
  return hits.length > max;
}

export function junkReason(body: Record<string, unknown>): string | null {
  const nameFields = ["name", "firstName", "first_name", "lastName", "last_name", "partnerName", "partner_name"];
  if (nameFields.some((k) => isGibberish(body[k]))) return "gibberish name";
  const textFields = ["message", "notes", "details", "tourTimes", "vision", "comments"];
  if (textFields.some((k) => isGibberish(body[k]))) return "gibberish message";
  if (isDottedGmailAlias(body["email"])) return "dotted gmail alias";
  const domain = String(body["email"] ?? "").trim().toLowerCase().split("@")[1] ?? "";
  if (DISPOSABLE_DOMAINS.has(domain)) return "disposable email";
  const date = String(body["date"] ?? body["eventDate"] ?? body["weddingDate"] ?? "");
  const y = /^(\d{4})-/.exec(date)?.[1];
  if (y && Number(y) < 2000) return "impossible date";
  return null;
}
