"use client";

import { useEffect, useState, type CSSProperties } from "react";

// Read-only review list of AI-written profiles (frontmatter aiWritten: true).
// Same PIN gate as /admin and /admin/trail-reviews: PIN saved in localStorage
// under sl_admin_pin, sent as x-admin-pin, checked server-side against ADMIN_PIN.
// Nothing on this page writes anything. The /admin layout sets noindex.

const PIN_KEY = "sl_admin_pin";
const DARK = "#1C1917";
const BROWN = "#292524";
const AMBER = "#D97706";
const CREAM = "#FAFAF7";
const MUTED = "#A8A29E";

type ReviewProfile = {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  listed: boolean;
  category: string;
  location: string;
  readingTime: string;
};

const cell: CSSProperties = { padding: "0.6rem 0.75rem", fontSize: 14, verticalAlign: "top", borderBottom: "1px solid #3b3734" };
const head: CSSProperties = { ...cell, color: MUTED, fontWeight: 600, textAlign: "left", letterSpacing: "0.04em", textTransform: "uppercase" };

export default function ProfilesReviewPage() {
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [profiles, setProfiles] = useState<ReviewProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PIN_KEY);
      if (saved) { setPin(saved); setAuthed(true); }
    } catch { /* storage blocked; the PIN form still works */ }
  }, []);

  useEffect(() => {
    if (!authed || !pin) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch("/api/admin/profiles-review", { headers: { "x-admin-pin": pin } })
      .then(async (r) => {
        if (r.status === 401) {
          try { localStorage.removeItem(PIN_KEY); } catch { /* ignore */ }
          if (!cancelled) { setAuthed(false); setError("That PIN was not accepted."); }
          return;
        }
        const d = (await r.json()) as { ok?: boolean; profiles?: ReviewProfile[]; error?: string };
        if (cancelled) return;
        if (!d.ok) { setError(d.error ?? "Could not load the list."); return; }
        setProfiles(d.profiles ?? []);
      })
      .catch(() => { if (!cancelled) setError("Could not load the list."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [authed, pin]);

  function login() {
    const value = pinInput.trim();
    if (!value) return;
    try { localStorage.setItem(PIN_KEY, value); } catch { /* ignore */ }
    setPin(value);
    setAuthed(true);
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: DARK }}>
        <div style={{ background: BROWN, padding: "2rem", borderRadius: 8, minWidth: 280 }}>
          <label htmlFor="profiles-review-pin" style={{ display: "block", color: CREAM, marginBottom: "1rem", fontWeight: 600, fontSize: 16 }}>
            Profiles review (read-only)
          </label>
          <input
            id="profiles-review-pin"
            type="password"
            placeholder="PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 4, border: "1px solid #555", background: DARK, color: CREAM, fontSize: 16, boxSizing: "border-box" }}
          />
          <button onClick={login} style={{ width: "100%", background: AMBER, color: "#000", padding: "0.6rem", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
            Enter
          </button>
          {error && <p role="alert" style={{ color: "#FCA5A5", marginTop: "0.75rem", fontSize: 14 }}>{error}</p>}
        </div>
      </main>
    );
  }

  const publishedCount = profiles.filter((p) => p.published).length;

  return (
    <main style={{ minHeight: "100vh", background: DARK, color: CREAM, padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: "0.25rem" }}>
          <a href="/admin" style={{ color: AMBER }}>Admin</a> / Profiles review
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          AI-written profiles
        </h1>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 720 }}>
          Every profile in <code>content/profiles</code> with <code>aiWritten: true</code>. This page only reads.
          While that flag is set the public route stays off, so the profile links below will not resolve until the
          flag is cleared in the file. Edit the MDX (or use the /admin editor) to change anything.
        </p>

        {loading && <p style={{ fontSize: 16, color: MUTED }}>Loading…</p>}
        {error && <p role="alert" style={{ fontSize: 16, color: "#FCA5A5" }}>{error}</p>}

        {!loading && !error && (
          <>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: "0.75rem" }}>
              {profiles.length} flagged · {publishedCount} with <code>published: true</code> · {profiles.length - publishedCount} drafts
            </p>
            {profiles.length === 0 ? (
              <p style={{ fontSize: 16 }}>No profiles carry <code>aiWritten: true</code>.</p>
            ) : (
              <div style={{ overflowX: "auto", background: BROWN, borderRadius: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th style={head}>Title</th>
                      <th style={head}>Slug</th>
                      <th style={head}>Date</th>
                      <th style={head}>Published</th>
                      <th style={head}>Listed</th>
                      <th style={head}>Public route</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.slug}>
                        <td style={cell}>
                          <span style={{ fontWeight: 600 }}>{p.title}</span>
                          {(p.category || p.location) && (
                            <span style={{ display: "block", color: MUTED, marginTop: 2 }}>
                              {[p.category, p.location].filter(Boolean).join(" · ")}{p.readingTime ? ` · ${p.readingTime}` : ""}
                            </span>
                          )}
                        </td>
                        <td style={{ ...cell, fontFamily: "ui-monospace, monospace", color: MUTED }}>{p.slug}</td>
                        <td style={{ ...cell, whiteSpace: "nowrap" }}>{p.date || "—"}</td>
                        <td style={{ ...cell, color: p.published ? "#86EFAC" : MUTED }}>{p.published ? "yes" : "no"}</td>
                        <td style={{ ...cell, color: p.listed ? CREAM : MUTED }}>{p.listed ? "yes" : "no"}</td>
                        <td style={cell}>
                          <a href={`/profiles/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: AMBER }}>
                            /profiles/{p.slug}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
