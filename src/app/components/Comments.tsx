"use client";

import { useState, useEffect } from "react";

type Comment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Bot checks (no third party): honeypot must stay empty; form must be open >=3s.
  const [trap, setTrap] = useState("");
  const [openedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const [notifyReplies, setNotifyReplies] = useState(false);

  // Post-submit subscribe prompt
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => {});
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/comments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, message, trap, openedMs: Date.now() - openedAt }),
      });

      if (res.ok) {
        setStatus("success");
        // Pre-fill subscribe prompt with commenter's email
        if (email) setSubscribeEmail(email);
        setName("");
        setEmail("");
        setMessage("");
        setNotifyReplies(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribeStatus("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail, source: "comment" }),
      });
      setSubscribeStatus(res.ok ? "done" : "idle");
    } catch {
      setSubscribeStatus("idle");
    }
  }

  return (
    <section className="comments-section">
      <div className="comments-inner">
        <h2 className="comments-heading">Responses</h2>

        {comments.length > 0 && (
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-meta">
                  <span className="comment-name">{c.name}</span>
                  <span className="comment-date">{formatDate(c.created_at)}</span>
                </div>
                <p className="comment-message">{c.message}</p>
              </div>
            ))}
          </div>
        )}

        {status === "success" ? (
          <div className="comment-thanks">
            <p>Thank you. Your response will appear shortly.</p>

            {/* Inline subscribe prompt */}
            {subscribeStatus === "done" ? (
              <p className="comment-subscribe-confirm">You&apos;re on the list.</p>
            ) : (
              <div className="comment-subscribe-nudge">
                <p>Want to hear when new stories go up?</p>
                <form onSubmit={handleSubscribe} className="comment-subscribe-form">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                  />
                  <button type="submit" disabled={subscribeStatus === "sending"}>
                    {subscribeStatus === "sending" ? "..." : "Subscribe"}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="comment-form">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />
            <div className="comment-field">
              <label htmlFor="comment-name">Name</label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                autoComplete="name"
              />
            </div>
            <div className="comment-field">
              <label htmlFor="comment-email">Email</label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={notifyReplies}
                maxLength={200}
                autoComplete="email"
              />
            </div>
            <div className="comment-field">
              <label htmlFor="comment-message">Message</label>
              <textarea
                id="comment-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={2000}
                rows={4}
              />
            </div>
            {status === "error" && (
              <p className="comment-error">Something went wrong. Try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="comment-submit"
            >
              {status === "submitting" ? "Sending..." : "Leave a response"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
