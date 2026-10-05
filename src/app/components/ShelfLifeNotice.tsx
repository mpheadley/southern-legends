// Timely pieces (event previews, news, seasonal guides) carry `shelfLife: timely`
// + `validUntil` in frontmatter. Before that date they get a small label; after it,
// a banner tells the reader the event has passed and points to the evergreen story.
export default function ShelfLifeNotice({
  shelfLife,
  validUntil,
  label,
  evergreenHref,
  evergreenLabel,
}: {
  shelfLife?: "evergreen" | "timely";
  validUntil?: string;
  label?: string;
  evergreenHref?: string;
  evergreenLabel?: string;
}) {
  if (shelfLife !== "timely" || !validUntil) return null;
  const today = new Date().toISOString().slice(0, 10);
  const expired = today > validUntil;
  const box: React.CSSProperties = {
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    margin: "0 0 2rem",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    background: expired ? "#f3ece0" : "#faf6ee",
    border: "1px solid rgba(154,108,47,0.25)",
    color: "#4a3728",
  };
  const date = new Date(validUntil + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return (
    <div className="not-prose" style={box} role="note">
      {expired ? (
        <>
          <strong>This piece covered an event that has passed</strong> (through {date}). Dates and prices below are as published.
          {evergreenHref && (
            <>
              {" "}
              <a href={evergreenHref} style={{ color: "#9a6c2f", textDecoration: "underline" }}>
                {evergreenLabel ?? "Read the evergreen story"}
              </a>
              .
            </>
          )}
        </>
      ) : (
        <>
          <strong>{label ?? "Event preview"}</strong> · current through {date}.
        </>
      )}
    </div>
  );
}
