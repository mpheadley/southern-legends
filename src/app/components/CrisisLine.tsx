// Safe-messaging notice for stories that touch suicide or self-harm. Goes near the top of the
// body so readers who need it see it before the story, not after. tools/sl-enrich.py lint
// flags any page that mentions suicide without it.
export default function CrisisLine() {
  return (
    <aside
      role="note"
      className="not-prose"
      style={{
        margin: "0 0 2rem",
        padding: "0.85rem 1.1rem",
        borderLeft: "4px solid #CA8A04",
        background: "#faf6ee",
        borderRadius: "0 0.5rem 0.5rem 0",
        fontSize: "0.95rem",
        lineHeight: 1.55,
        color: "#3F3B36",
      }}
    >
      This story talks about suicide. If you or someone you know is struggling, call or text{" "}
      <a href="tel:988" style={{ color: "#9A3412", fontWeight: 700 }}>988</a>, the Suicide &amp; Crisis
      Lifeline, any time. It&apos;s free and confidential.
    </aside>
  );
}
