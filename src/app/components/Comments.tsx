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
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
        body: JSON.stringify({ slug, name, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
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
            <p>Thank you. Your response will appear after review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="comment-form">
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
