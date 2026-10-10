import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBook } from "@/data/book-preorders";
import BookPreorder from "@/app/components/BookPreorder";
import ShareRow from "@/app/components/ShareRow";
import { getJournalPostBySlug } from "@/lib/journal";

const book = getBook("company-of-farmers")!;

export const metadata: Metadata = {
  title: `${book.title} — a forthcoming book by Matt Headley`,
  description: book.subtitle,
  alternates: { canonical: "/books/company-of-farmers" },
  openGraph: { url: "/books/company-of-farmers", title: book.title, description: book.subtitle },
};

const CHAPTERS = [
  { name: "Wendell Berry", href: "/essays/wendell-berry-profile", note: "The permission-giver." },
  { name: "Joel Salatin", href: "/essays/joel-salatin-profile", note: "The showman I argued with." },
  { name: "Jesse Frost", href: "/essays/jesse-frost-profile", note: "The living soil." },
  { name: "Toby Hemenway", href: "/essays/toby-hemenway-profile", note: "Gaia's Garden — the permaculture case for the backyard." },
  { name: "Amy Stross", href: "/essays/amy-stross-profile", note: "The Suburban Micro-Farm — the case for the small bet." },
  { name: "Justin Rhodes", href: "/essays/justin-rhodes-profile", note: "The YouTube farmer." },
  { name: "Noah Sanders", href: "/profiles/noah-sanders", note: "Northeast Alabama." },
  { name: "Indigo Ridge Farms", href: "/essays/indigo-ridge-farms-profile", note: "The Crosbys." },
];

/** Essay chapters link only once the essay is published; profiles always link. */
function chapterIsLive(href: string): boolean {
  if (!href.startsWith("/essays/")) return true;
  const post = getJournalPostBySlug(href.slice("/essays/".length));
  return !!post?.frontmatter.published;
}

const BOOKLIST = [
  { title: "The Living Soil Handbook", author: "Jesse Frost", url: "https://bookshop.org/a/gather/9781635020007" },
  { title: "Gaia's Garden", author: "Toby Hemenway", url: "https://bookshop.org/a/gather/9781603580298" },
  { title: "The Suburban Micro-Farm", author: "Amy Stross", url: "https://bookshop.org/a/gather/9781916355705" },
  { title: "Folks, This Ain't Normal", author: "Joel Salatin", url: "https://bookshop.org/a/gather/9781455501861" },
  { title: "Bringing It to the Table", author: "Wendell Berry", url: "https://bookshop.org/a/gather/9781582435435" },
  { title: "Pastured Poultry Profits", author: "Joel Salatin", url: "https://bookshop.org/a/gather/9780963552907" },
];

export default async function CompanyOfFarmersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a1208 0%, #2a1e0e 50%, #1a1208 100%)",
        backgroundImage:
          "url('/topo-7.png'), linear-gradient(160deg, #1a1208 0%, #2a1e0e 50%, #1a1208 100%)",
        backgroundBlendMode: "soft-light",
        backgroundSize: "auto, cover",
        color: "#f0ede8",
      }}
    >
      <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {success && (
          <div style={{ marginBottom: "2rem", borderRadius: "8px", border: "1px solid #C9A227", background: "rgba(201,162,39,0.1)", padding: "1.25rem" }}>
            <p style={{ fontWeight: 600, color: "#f0ede8" }}>Thank you.</p>
            <p style={{ fontSize: "0.875rem", color: "#d4c9b8", marginTop: "0.25rem" }}>
              {success === "support"
                ? "That gift goes straight toward the writing. I'll email you the chapters as they land."
                : "Your preorder is in. You'll get the chapters by email while I write, and the signed book on release."}
            </p>
          </div>
        )}

        {/* Eyebrow */}
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a6c2f", marginBottom: "0.75rem" }}>
          Forthcoming · Southern Legends
        </p>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#f0ede8", lineHeight: 1.1, marginBottom: "0.75rem" }}>
          {book.title}
        </h1>

        {/* Subtitle */}
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontStyle: "italic", color: "#d4c9b8", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          {book.subtitle}
        </p>

        {/* Cover */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", marginBottom: "2.5rem", border: "1px solid rgba(201,162,39,0.2)" }}>
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        {/* Body copy */}
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.8, color: "#e8ddd0", display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <p>Before I owned an acre, I owned a shelf of farmers.</p>
          <p>
            I collected them during the years my wife and I were building a flower farm on nine acres in Northeast Alabama.
            I read them looking for permission. Each one said yes in a different way.
            Some said yes to the hard thing. Some said yes to the small thing.
            A few said yes and then showed you the back side of the yes — the debt, the drought, the year it didn't work.
          </p>
          <p>
            Then I lost the farm. This is not a how-to.
            It is a book about why the land pulls at a certain kind of person,
            and what it costs to answer the pull, or to answer it and still come up short.
            The credential is the wreckage, not the podium.
          </p>
          <p style={{ color: "#d4c9b8", fontSize: "0.95rem", fontStyle: "italic" }}>
            Each chapter is a farmer. Each farmer is a mirror.
          </p>
        </div>

        {/* Preorder widget */}
        <BookPreorder book={book} />

        {/* Chapter list */}
        <div style={{ borderTop: "1px solid rgba(201,162,39,0.25)", paddingTop: "2rem", marginTop: "2.5rem" }}>
          <p style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a6c2f", marginBottom: "1.25rem" }}>
            The company
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {CHAPTERS.map((ch) => (
              <div key={ch.href} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                {chapterIsLive(ch.href) ? (
                  <Link
                    href={ch.href}
                    style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700, color: "#C9A227", textDecoration: "none", whiteSpace: "nowrap" }}
                  >
                    {ch.name}
                  </Link>
                ) : (
                  // Essay not published yet — show the name without a dead link (audit C-10)
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", fontWeight: 700, color: "#C9A227", whiteSpace: "nowrap", opacity: 0.75 }}>
                    {ch.name}
                  </span>
                )}
                <span style={{ fontSize: "0.82rem", color: "#9a8070", fontStyle: "italic" }}>{ch.note}</span>
              </div>
            ))}
          </div>
          <Link
            href="/books"
            style={{ display: "inline-block", marginTop: "1.25rem", fontSize: "0.8rem", color: "#9a6c2f", textDecoration: "underline" }}
          >
            The full shelf →
          </Link>
        </div>

        {/* Booklist — affiliate */}
        <div style={{ borderTop: "1px solid rgba(201,162,39,0.25)", paddingTop: "2rem", marginTop: "2.5rem" }}>
          <p style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a6c2f", marginBottom: "1.25rem" }}>
            Books from this shelf — buy from indie bookstores
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {BOOKLIST.map((b) => (
              <div key={b.title} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "#e8ddd0" }}>{b.title}</span>
                  <span style={{ fontSize: "0.8rem", color: "#9a8070", marginLeft: "0.5rem" }}>— {b.author}</span>
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.75rem", color: "#C9A227", textDecoration: "underline", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Bookshop.org →
                </a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.7rem", color: "#6b5040", marginTop: "1rem" }}>
            Affiliate links support Southern Legends and independent bookstores.
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <ShareRow url="/books/company-of-farmers" title={book.title} description={book.subtitle} />
        </div>
      </div>
    </main>
  );
}
