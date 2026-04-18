"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SendForm() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret") ?? "";

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [broadcastId, setBroadcastId] = useState("");

  if (!secret) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#9A3412" }}>Missing secret. Visit <code>/admin/send?secret=YOUR_SECRET</code></p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const html = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #292524; line-height: 1.8; padding: 24px;">
  ${body
    .split(/\n\n+/)
    .map((p) => `<p style="margin: 0 0 20px;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("")}
  <hr style="border: none; border-top: 1px solid #E7E5E4; margin: 40px 0 24px;">
  <p style="font-size: 13px; color: #78716C; margin: 0;">
    You're receiving this because you subscribed to Southern Legends.
    <a href="{{unsubscribe}}" style="color: #9A3412;">Unsubscribe</a>.
  </p>
</div>`;

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ subject, html }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setBroadcastId(data.broadcastId ?? "");
        setSubject("");
        setBody("");
      } else {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error.");
      setStatus("error");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Send Newsletter</h1>
      <p style={styles.meta}>Sends to all subscribed contacts in the Resend audience.</p>

      {status === "success" ? (
        <div style={styles.success}>
          <p>Sent. Broadcast ID: <code>{broadcastId}</code></p>
          <button style={styles.button} onClick={() => setStatus("idle")}>Send another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={200}
            style={styles.input}
            placeholder="From the editor..."
          />

          <label style={styles.label}>Body</label>
          <p style={styles.hint}>Plain text. Double line breaks = paragraphs. Wrapped in a basic email template.</p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={16}
            style={styles.textarea}
            placeholder={"Write your newsletter here.\n\nDouble line breaks create paragraphs."}
          />

          {status === "error" && <p style={styles.error}>{errorMsg}</p>}

          <button type="submit" disabled={status === "sending"} style={styles.button}>
            {status === "sending" ? "Sending..." : "Send to subscribers"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 680,
    margin: "60px auto",
    padding: "0 24px",
    fontFamily: "system-ui, sans-serif",
    color: "#292524",
  },
  heading: {
    fontFamily: "Georgia, serif",
    fontSize: 28,
    marginBottom: 8,
    color: "#292524",
  },
  meta: {
    color: "#78716C",
    fontSize: 14,
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 2,
  },
  hint: {
    fontSize: 13,
    color: "#78716C",
    margin: "-8px 0 4px",
  },
  input: {
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #D6D3D1",
    borderRadius: 4,
    width: "100%",
    boxSizing: "border-box" as const,
  },
  textarea: {
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #D6D3D1",
    borderRadius: 4,
    width: "100%",
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    lineHeight: 1.6,
  },
  button: {
    padding: "12px 24px",
    background: "#9A3412",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  success: {
    padding: "20px 24px",
    background: "#F0FDF4",
    border: "1px solid #86EFAC",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  error: {
    color: "#9A3412",
    fontSize: 14,
  },
};

export default function AdminSendPage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px 24px" }}>Loading...</div>}>
      <SendForm />
    </Suspense>
  );
}
