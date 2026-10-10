import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autumn 2026: The Harvest Number — The Gather Almanac",
  description:
    "First frost math for Calhoun County, the fall festival calendar, what to plant before the ground goes hard, and the people keeping the season in Northeast Alabama.",
  robots: { index: false },
  alternates: { canonical: "/almanac/autumn-2026" },
  openGraph: { url: "/almanac/autumn-2026" },
};

const label: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--color-ll-accent)",
  fontFamily: "var(--font-body)",
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "1.7rem",
  fontWeight: 700,
  color: "var(--color-ll-dark)",
  lineHeight: 1.15,
  margin: "3rem 0 1rem",
};

const p: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.05rem",
  color: "var(--color-ll-text)",
  lineHeight: 1.75,
  marginBottom: "1.1rem",
};

const cal = [
  ["Oct 3", "Oxfordfest", "Downtown Oxford, first Saturday — 33 years of arts, crafts, music, and food on Main Street. [EDIT: confirm 2026 date]"],
  ["Oct", "Taste of the Town", "Jacksonville — the City, JSU, and area folks benefiting the Jacksonville Christian Outreach Center. [EDIT: confirm date]"],
  ["Oct 17", "The Aisle", "Gadsden area — bridal + gathering, our own fall anchor"],
  ["Oct 17–18", "Kentuck Festival of the Arts", "Now in Tuscaloosa (Snow Hinton Park) — 270+ artists, worth the drive west. Note the clash with The Aisle"],
  ["Oct 24–25", "Neewhollah on Noble", "Noble Street, Anniston — hay rides, costume contests for folks and pets, treat walks. The local one. [EDIT: confirm last-weekend date]"],
  ["Nov", "Harvest suppers & first-frost markets", "Countywide — the small church-and-fire-hall ones that matter"],
];

const lore = [
  [
    "“The wider the brown band on the woolly worm, the milder the winter.”",
    "Folk math. The band tracks the caterpillar’s age and the fall it grew up in, not the winter coming. A good story, a poor forecaster — keep it for the porch, not the planting.",
  ],
  [
    "“Frost comes three mornings after the first katydid quits.”",
    "Closer than it sounds. Katydids fall silent as nights cool, and the cool that quiets them is the same cool that brings frost. Not a clock, but not nothing.",
  ],
  [
    "“Heavy acorn fall means a hard winter.”",
    "A mast year is the oak answering last spring, not predicting next January. But a heavy fall does mean fat deer and busy squirrels — true, just backward-looking.",
  ],
];

export default function AutumnIssue() {
  return (
    <main style={{ backgroundColor: "var(--color-ll-warm)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "7.5rem 1.5rem 6rem" }}>
        <p style={{ ...label, marginBottom: "0.75rem" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Southern Legends
          </Link>
          {" / "}
          <Link href="/almanac" style={{ color: "inherit", textDecoration: "none" }}>
            The Gather Almanac
          </Link>
          {" / "} Autumn 2026
        </p>

        <p style={{ ...label, color: "var(--color-ll-text-light)", marginBottom: "0.5rem" }}>
          Autumn 2026 &middot; No. 1
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "var(--color-ll-dark)",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}
        >
          The Harvest Number
        </h1>

        <p style={{ ...p, fontSize: "1.15rem", color: "var(--color-ll-text-light)" }}>
          The first issue of the almanac for the place you actually live. Everything below
          is for Calhoun County and the country around it &mdash; not the whole nation, not
          an average of it. Here.
        </p>

        {/* WHEN IT BLOOMS */}
        <h2 style={h2}>When It Blooms &mdash; and When It Goes Hard</h2>
        <p style={p}>
          Northeast Alabama sits where the mountains break the frost line. The first killing
          frost for Calhoun County usually lands in the <strong>first two weeks of
          November</strong>, and the low spots &mdash; the hollows and the creek bottoms &mdash;
          take it a week before the ridges do. If you farm a bottom, you already knew that.
        </p>
        <p style={p}>
          Put in before the ground goes hard: garlic and shallots (set the cloves a
          couple weeks ahead of that first frost), spring bulbs &mdash; daffodils, then
          tulips once the soil cools. Cool-season greens &mdash; collards, kale, turnips,
          mustard &mdash; sweeten after a frost rather than dying in it; that&rsquo;s the whole
          trick of a Southern fall garden. Pull the last green tomatoes the night before a
          hard frost and let them come in on the windowsill.
        </p>
        <p style={p}>
          What&rsquo;s turning: the sourwoods and black gums go first and reddest, then the
          sweetgums and maples flare, the hickories glow gold, the oaks hold deep orange and
          then brown into December. Dogwood berries redden for the birds. For the color
          drive, the Talladega Scenic Drive (AL 281), Cheaha State Park, and the Rock Garden
          overlook peak from <strong>the end of October through mid-November</strong>.
        </p>

        {/* THE CALENDAR */}
        <h2 style={h2}>The Calendar</h2>
        <p style={p}>
          Kept in one place so you don&rsquo;t have to hunt six Facebook pages for it. Dates
          marked for confirmation before this issue goes public.
        </p>
        <div style={{ display: "grid", gap: "0.75rem", margin: "1.5rem 0 1rem" }}>
          {cal.map(([when, what, where]) => (
            <div
              key={what}
              style={{
                display: "grid",
                gridTemplateColumns: "6.5rem 1fr",
                gap: "1rem",
                padding: "0.9rem 1rem",
                background: "var(--color-ll-white)",
                border: "1px solid var(--color-ll-border)",
                borderRadius: "0.4rem",
              }}
            >
              <span style={{ ...label, color: "var(--color-ll-primary)", paddingTop: "0.15rem" }}>
                {when}
              </span>
              <span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--color-ll-dark)",
                    display: "block",
                    marginBottom: "0.15rem",
                  }}
                >
                  {what}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "var(--color-ll-text-light)",
                    lineHeight: 1.5,
                  }}
                >
                  {where}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* WEATHER LORE */}
        <h2 style={h2}>Weather Lore, Checked</h2>
        <p style={p}>
          The old sayings, held up against what we actually know. Some hold. Some are just
          good company on the porch.
        </p>
        {lore.map(([saying, verdict]) => (
          <div
            key={saying}
            style={{ borderLeft: "3px solid var(--color-ll-accent)", paddingLeft: "1rem", marginBottom: "1.5rem" }}
          >
            <p
              style={{
                fontFamily: "var(--font-pull-quote)",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: "var(--color-ll-dark)",
                lineHeight: 1.5,
                marginBottom: "0.5rem",
              }}
            >
              {saying}
            </p>
            <p style={{ ...p, marginBottom: 0, fontSize: "0.98rem" }}>{verdict}</p>
          </div>
        ))}

        {/* THE PEOPLE */}
        <h2 style={h2}>The People Keeping the Season</h2>
        <p style={p}>
          Every issue, a few short profiles of the folks who keep the season &mdash; growers,
          makers, cooks, characters. This number:{" "}
          <span style={{ color: "var(--color-ll-text-light)" }}>
            [EDIT: pull 2&ndash;3 seasonal profile candidates from the SL entity graph / Nexus
            seasonal-entity emission once wired &mdash; a fall grower or orchard, a market
            maker, a cook with a harvest recipe. Draft in SL profile voice, credit + rights
            per the photo-rights rule before any public run.]
          </span>
        </p>

        {/* BACK FORTY */}
        <h2 style={h2}>From The Back Forty</h2>
        <p style={p}>
          The agrarian satire that lives here in print. This season&rsquo;s piece:{" "}
          <Link href="/back-forty" style={{ color: "var(--color-ll-primary)", fontWeight: 600 }}>
            The Back Forty &rarr;
          </Link>
        </p>

        {/* SUBSCRIBE */}
        <div
          style={{
            marginTop: "3.5rem",
            padding: "1.75rem",
            background: "var(--color-ll-white)",
            border: "1px solid var(--color-ll-border)",
            borderRadius: "0.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--color-ll-dark)",
              marginBottom: "0.6rem",
            }}
          >
            Get the next issue
          </h3>
          <p style={{ ...p, marginBottom: "1.1rem" }}>
            Winter comes in December. The seasonal issues land free by email.
          </p>
          <Link
            href="/subscribe"
            style={{
              display: "inline-block",
              background: "var(--color-ll-primary)",
              color: "var(--color-ll-white)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 600,
              padding: "0.7rem 1.4rem",
              borderRadius: "0.4rem",
              textDecoration: "none",
            }}
          >
            Subscribe &rarr;
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--color-ll-text-light)",
            lineHeight: 1.6,
            marginTop: "2.5rem",
          }}
        >
          Edited by Matt Headley. Drafted by Iris — Matt&rsquo;s AI EA and creative partner.
        </p>
      </div>
    </main>
  );
}
