"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Tab = "newsletter" | "post";

function SendForm() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret") ?? "";
  const [tab, setTab] = useState<Tab>("post");

  // Newsletter state
  const [nlSubject, setNlSubject] = useState("");
  const [nlBody, setNlBody] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [nlError, setNlError] = useState("");
  const [nlBroadcastId, setNlBroadcastId] = useState("");

  // Post announcement state
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postSection, setPostSection] = useState("New");
  const [postStatus, setPostStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [postError, setPostError] = useState("");
  const [postBroadcastId, setPostBroadcastId] = useState("");

  if (!secret) {
    return (
      <div style={s.container}>
        <p style={{ color: "#9A3412" }}>
          Missing secret. Visit <code>/admin/send?secret=YOUR_SECRET</code>
        </p>
      </div>
    );
  }

  async function sendNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNlStatus("sending");
    setNlError("");

    const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAFAF7;">
  <div style="background:#1C1917;padding:24px 32px 20px;border-bottom:2px solid #C4622D;">
    <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C4622D;font-family:system-ui,sans-serif;font-weight:600;">Southern Legends</p>
    <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(250,250,247,0.4);font-family:system-ui,sans-serif;">Northeast Alabama</p>
  </div>
  <div style="padding:40px 32px 32px;color:#292524;line-height:1.8;font-size:16px;">
    ${nlBody.split(/\n\n+/).map((p) => `<p style="margin:0 0 20px;">${p.replace(/\n/g, "<br>")}</p>`).join("")}
    <p style="margin:32px 0 0;font-size:14px;color:#78716C;">
      Matt Headley<br>
      <a href="https://southernlegends.org" style="color:#C4622D;text-decoration:none;">southernlegends.org</a>
    </p>
  </div>
  <div style="padding:20px 32px;background:#F0EDE8;border-top:1px solid #E7E5E4;">
    <p style="margin:0;font-size:11px;color:#A8A29E;font-family:system-ui,sans-serif;">
      You're receiving this because you subscribed to Southern Legends.
      <a href="{{unsubscribe}}" style="color:#9A3412;">Unsubscribe</a>.
    </p>
  </div>
</div>`;

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ subject: nlSubject, html }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNlStatus("success");
        setNlBroadcastId(data.broadcastId ?? "");
        setNlSubject("");
        setNlBody("");
      } else {
        setNlError(data.error ?? "Something went wrong.");
        setNlStatus("error");
      }
    } catch {
      setNlError("Network error.");
      setNlStatus("error");
    }
  }

  async function sendPost(e: React.FormEvent) {
    e.preventDefault();
    setPostStatus("sending");
    setPostError("");

    try {
      const res = await fetch("/api/newsletter/send-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          title: postTitle.trim(),
          excerpt: postExcerpt.trim(),
          postUrl: postUrl.trim(),
          section: postSection.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPostStatus("success");
        setPostBroadcastId(data.broadcastId ?? "");
        setPostTitle("");
        setPostExcerpt("");
        setPostUrl("");
        setPostSection("New");
      } else {
        setPostError(data.error ?? "Something went wrong.");
        setPostStatus("error");
      }
    } catch {
      setPostError("Network error.");
      setPostStatus("error");
    }
  }

  return (
    <div style={s.container}>
      <h1 style={s.heading}>Southern Legends — Email</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1px", marginBottom: "2rem", borderBottom: "2px solid #E7E5E4" }}>
        {(["post", "newsletter"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.6rem 1.2rem",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #9A3412" : "2px solid transparent",
              marginBottom: "-2px",
              fontWeight: tab === t ? 700 : 400,
              color: tab === t ? "#9A3412" : "#78716C",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {t === "post" ? "Announce a Post" : "Write a Newsletter"}
          </button>
        ))}
      </div>

      {/* Post announcement tab */}
      {tab === "post" && (
        <>
          <p style={s.meta}>
            Sends a branded post-announcement email to all subscribers. Use when a new piece publishes.
          </p>

          {postStatus === "success" ? (
            <div style={s.success}>
              <p>Sent. Broadcast ID: <code>{postBroadcastId}</code></p>
              <button style={s.btn} onClick={() => setPostStatus("idle")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={sendPost} style={s.form}>
              <label style={s.label}>Section / Label</label>
              <select
                value={postSection}
                onChange={(e) => setPostSection(e.target.value)}
                style={s.input}
              >
                <option>New</option>
                <option>Profile</option>
                <option>Essay</option>
                <option>The Back Forty</option>
                <option>Places</option>
                <option>Books</option>
                <option>Arts</option>
              </select>

              <label style={s.label}>Post title</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
                maxLength={200}
                style={s.input}
                placeholder="Jean Ellison and the flower she kept alive for thirty years"
              />

              <label style={s.label}>Excerpt / teaser</label>
              <p style={s.hint}>2–4 sentences. This is the hook in the email — plain voice, no clickbait.</p>
              <textarea
                value={postExcerpt}
                onChange={(e) => setPostExcerpt(e.target.value)}
                required
                rows={5}
                style={s.textarea}
                placeholder="A florist at the end of Noble Street has kept a single orchid alive since 1994. She thinks it might outlive her. This is what she does every morning before the shop opens."
              />

              <label style={s.label}>Post URL</label>
              <p style={s.hint}>Full path, e.g. /profiles/jean-ellison or https://southernlegends.org/essays/...</p>
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                required
                style={s.input}
                placeholder="/profiles/jean-ellison"
              />

              {postStatus === "error" && <p style={s.error}>{postError}</p>}

              <button type="submit" disabled={postStatus === "sending"} style={s.btn}>
                {postStatus === "sending" ? "Sending…" : "Send to all subscribers"}
              </button>
            </form>
          )}
        </>
      )}

      {/* Newsletter tab */}
      {tab === "newsletter" && (
        <>
          <p style={s.meta}>
            Write a custom newsletter. Double line breaks = paragraphs.
          </p>

          {nlStatus === "success" ? (
            <div style={s.success}>
              <p>Sent. Broadcast ID: <code>{nlBroadcastId}</code></p>
              <button style={s.btn} onClick={() => setNlStatus("idle")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={sendNewsletter} style={s.form}>
              <label style={s.label}>Subject</label>
              <input
                type="text"
                value={nlSubject}
                onChange={(e) => setNlSubject(e.target.value)}
                required
                maxLength={200}
                style={s.input}
                placeholder="From the editor..."
              />

              <label style={s.label}>Body</label>
              <textarea
                value={nlBody}
                onChange={(e) => setNlBody(e.target.value)}
                required
                rows={18}
                style={s.textarea}
                placeholder={"Write your newsletter here.\n\nDouble line breaks create paragraphs."}
              />

              {nlStatus === "error" && <p style={s.error}>{nlError}</p>}

              <button type="submit" disabled={nlStatus === "sending"} style={s.btn}>
                {nlStatus === "sending" ? "Sending…" : "Send to subscribers"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: { maxWidth: 700, margin: "60px auto", padding: "0 24px", fontFamily: "system-ui,sans-serif", color: "#292524" },
  heading: { fontFamily: "Georgia,serif", fontSize: 26, marginBottom: 8, color: "#292524" },
  meta: { color: "#78716C", fontSize: 14, marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontWeight: 600, fontSize: 14, marginBottom: 2 },
  hint: { fontSize: 13, color: "#78716C", margin: "-8px 0 4px" },
  input: { padding: "10px 12px", fontSize: 15, border: "1px solid #D6D3D1", borderRadius: 4, width: "100%", boxSizing: "border-box", background: "#fff" },
  textarea: { padding: "10px 12px", fontSize: 15, border: "1px solid #D6D3D1", borderRadius: 4, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, background: "#fff" },
  btn: { padding: "12px 24px", background: "#9A3412", color: "#fff", border: "none", borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", marginTop: 8 },
  success: { padding: "20px 24px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 6, display: "flex", flexDirection: "column", gap: 12 },
  error: { color: "#9A3412", fontSize: 14 },
};

export default function AdminSendPage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px 24px" }}>Loading…</div>}>
      <SendForm />
    </Suspense>
  );
}
