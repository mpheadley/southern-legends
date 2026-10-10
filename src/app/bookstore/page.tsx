import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bookstore — Southern Legends",
  description:
    "Books worth reading, honestly recommended. Southern fiction, agrarian nonfiction, faith and formation, theater. Matt Headley's curated shelf.",
  alternates: { canonical: "/bookstore" },
  openGraph: { url: "/bookstore" },
};

const AFFILIATE_ID = "southernlegends"; // bookshop.org/shop/southernlegends

function bookshopLink(isbn: string): string {
  return `https://bookshop.org/a/${AFFILIATE_ID}/${isbn}`;
}

const SECTIONS = [
  {
    title: "The Land",
    note: "What the dirt actually teaches you.",
    books: [
      {
        title: "The Unsettling of America",
        author: "Wendell Berry",
        note: "The original argument. Still unanswered.",
        url: bookshopLink("9781619020498"),
      },
      {
        title: "Ecology of a Cracker Childhood",
        author: "Janisse Ray",
        note: "Georgia longleaf pine as memoir. The best nature writing in the South.",
        url: bookshopLink("9781571312778"),
      },
      {
        title: "Animal, Vegetable, Miracle",
        author: "Barbara Kingsolver",
        note: "The honest version of what YouTube homesteading promises.",
        url: bookshopLink("9780060852559"),
      },
      {
        title: "Everything I Want to Do Is Illegal",
        author: "Joel Salatin",
        note: "The foil. Read it to understand what you're up against — or what people think they're reclaiming.",
        url: bookshopLink("9780963810946"),
      },
      {
        title: "A Childhood: The Biography of a Place",
        author: "Harry Crews",
        note: "South Georgia dirt and what grows in it. Not romantic. That's why it's great.",
        url: bookshopLink("9780820313177"),
      },
    ],
  },
  {
    title: "The Church",
    note: "What happens inside the building and what it costs.",
    books: [
      {
        title: "A Good Man Is Hard to Find",
        author: "Flannery O'Connor",
        note: "Grace arrives sideways. Always. O'Connor is the patron saint of this column.",
        url: bookshopLink("9780374504649"),
      },
      {
        title: "Brother to a Dragonfly",
        author: "Will Campbell",
        note: "A Mississippi Baptist preacher who figures out the gospel is bigger than his church. His brother dies. He keeps going.",
        url: bookshopLink("9780826413987"),
      },
      {
        title: "Telling the Truth",
        author: "Frederick Buechner",
        note: "The gospel as tragedy, comedy, and fairy tale. The only theological book I recommend to people who hate theological books.",
        url: bookshopLink("9780060611880"),
      },
      {
        title: "The Contemplative Pastor",
        author: "Eugene Peterson",
        note: "What the job actually is, versus what everyone thinks it is.",
        url: bookshopLink("9780802804129"),
      },
    ],
  },
  {
    title: "The South",
    note: "Stories that know what they're talking about.",
    books: [
      {
        title: "All Over But the Shoutin'",
        author: "Rick Bragg",
        note: "Alabama memoir. His mother. The thing she gave him and what it cost her.",
        url: bookshopLink("9780679774020"),
      },
      {
        title: "Clay's Quilt",
        author: "Silas House",
        note: "Appalachian Kentucky fiction. The real thing.",
        url: bookshopLink("9781565123793"),
      },
      {
        title: "Serena",
        author: "Ron Rash",
        note: "Appalachian noir. Biblical in structure. Devastating.",
        url: bookshopLink("9780061470851"),
      },
      {
        title: "Native Guard",
        author: "Natasha Trethewey",
        note: "Mississippi. The Civil War. Her mother. Poetry that reads like history that reads like grief.",
        url: bookshopLink("9780618872657"),
      },
      {
        title: "The Oxford American",
        author: "Various",
        note: "The magazine. Subscribe. Read the Southern Music Issue every year.",
        url: "https://oxfordamerican.org",
      },
    ],
  },
  {
    title: "The Stage",
    note: "Plays worth reading in a chair, not just watching in a theater.",
    books: [
      {
        title: "Fences",
        author: "August Wilson",
        note: "The Pittsburgh Cycle. Troy Maxson. A man who fails his son and loves him and can't close the gap. The best American play.",
        url: bookshopLink("9780452264014"),
      },
      {
        title: "The Trip to Bountiful",
        author: "Horton Foote",
        note: "Texas. An old woman trying to go home one more time. Foote is the Wendell Berry of American drama.",
        url: bookshopLink("9780743482912"),
      },
      {
        title: "A Streetcar Named Desire",
        author: "Tennessee Williams",
        note: "The definitive Southern Gothic stage work. Read it if you haven't. Read it again if you have.",
        url: bookshopLink("9780811216029"),
      },
      {
        title: "The Member of the Wedding",
        author: "Carson McCullers",
        note: "A novel and a play. Frankie Addams at 12 years old in a Georgia kitchen. One of the best things ever written about loneliness.",
        url: bookshopLink("9780618492398"),
      },
    ],
  },
];

export default function BookstorePage() {
  return (
    <main style={{ backgroundColor: "var(--color-ll-warm)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "7.5rem 1.5rem 6rem" }}>

        {/* Breadcrumb */}
        <p style={{
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-ll-accent)",
          marginBottom: "0.75rem",
          fontFamily: "var(--font-body)",
        }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Southern Legends</Link>
          {" / "} Bookstore
        </p>

        {/* Header */}
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
          fontWeight: 700,
          color: "var(--color-ll-dark)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}>
          The Shelf
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.05rem",
          color: "var(--color-ll-text)",
          lineHeight: 1.75,
          marginBottom: "0.75rem",
        }}>
          Books I actually recommend, organized by what they're about.
          Buy links go to Bookshop.org, which supports independent bookstores.
          Affiliate links are labeled. My notes are my own.
        </p>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.88rem",
          color: "var(--color-ll-text-light)",
          lineHeight: 1.6,
          marginBottom: "3rem",
        }}>
          — Matt Headley, pastor of Ecclesia Community, a fresh expression of Christian community. Flower farmer, Northeast Alabama. Author of Tend: Before the Wedding.
        </p>

        {/* Matt's own books */}
        <div style={{
          backgroundColor: "var(--color-ll-dark)",
          borderRadius: "8px",
          padding: "2rem",
          marginBottom: "3rem",
        }}>
          <p style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-ll-accent)",
            marginBottom: "1rem",
            fontFamily: "var(--font-body)",
          }}>
            From This Desk
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#F5F0E8",
            marginBottom: "1.5rem",
          }}>
            Books by Matt Headley
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              {
                title: "Tend: Before the Wedding",
                tagline: "Five conversations before you say I do.",
                status: "Presell open — ships August 2026",
                href: "/essays/forthcoming-tend-before-the-wedding",
              },
              {
                title: "Southern Legends Vol. 1",
                tagline: "Collected profiles from the first year of the column.",
                status: "Forthcoming — email list gets first access",
                href: "/subscribe",
              },
              {
                title: "The Back Forty (Collected)",
                tagline: "Southern Gothic agrarian satire. Coming when there's enough of it.",
                status: "Column in progress",
                href: "/back-forty",
              },
            ].map(book => (
              <Link key={book.title} href={book.href} style={{ textDecoration: "none" }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#F5F0E8",
                    marginBottom: "0.2rem",
                  }}>{book.title} →</p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "#C4BAA8",
                    marginBottom: "0.2rem",
                  }}>{book.tagline}</p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.78rem",
                    color: "var(--color-ll-accent)",
                  }}>{book.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Curated sections */}
        {SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-ll-dark)",
              marginBottom: "0.35rem",
            }}>
              {section.title}
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "var(--color-ll-text-light)",
              fontStyle: "italic",
              marginBottom: "1.5rem",
            }}>
              {section.note}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.books.map(book => (
                <a
                  key={book.title}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-ll-border)",
                    borderRadius: "6px",
                    padding: "1.1rem 1.25rem",
                    textDecoration: "none",
                  }}
                >
                  <p style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--color-ll-dark)",
                    marginBottom: "0.15rem",
                  }}>
                    {book.title} <span style={{ fontWeight: 400, color: "var(--color-ll-text-light)" }}>— {book.author}</span>
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "var(--color-ll-text)",
                    lineHeight: 1.6,
                  }}>
                    {book.note}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.78rem",
          color: "var(--color-ll-text-light)",
          lineHeight: 1.6,
          borderTop: "1px solid var(--color-ll-border)",
          paddingTop: "2rem",
          marginTop: "1rem",
        }}>
          Bookshop.org affiliate links support independent bookstores and this publication.
          I earn a small commission on purchases at no added cost to you.
          I only list books I've read and mean.
        </p>

      </div>
    </main>
  );
}
