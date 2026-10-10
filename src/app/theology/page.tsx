import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Theology — Southern Legends",
  description:
    "Essays on the shape underneath the work — Trinity, perichoresis, formation, and faith held honestly by a former United Methodist pastor in Northeast Alabama.",
  alternates: { canonical: "/theology" },
  openGraph: { url: "/theology" },
};

// A post belongs to Theology if it declares the category or carries a theology tag.
const THEOLOGY_TAGS = [
  "theology",
  "trinity",
  "perichoresis",
  "kenosis",
  "triskelion",
  "formation",
  "spiritual direction",
];

function isTheology(fm: { category?: string; tags?: string[] }): boolean {
  if (fm.category?.toLowerCase() === "theology") return true;
  return !!fm.tags?.some((t) => THEOLOGY_TAGS.includes(t.toLowerCase()));
}

export default function TheologyPage() {
  const essays = getAllJournalPosts().filter((p) => isTheology(p.frontmatter));

  return (
    <main className="page-light page-top max-w-3xl mx-auto px-4 pb-16">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-ll-text-light mb-3">Theology</p>
        <h1 className="text-4xl font-bold text-ll-dark mb-4">
          The Shape Underneath the Work
        </h1>
        <p className="text-lg text-ll-text leading-relaxed">
          I spent twenty years as a United Methodist pastor, mostly in the Hebrew Bible,
          trying to figure out what these old texts have to say about actual life. These are
          the essays where the theology comes to the surface — Trinity and perichoresis,
          the wound as credential, farming and church and the inner life all running under
          the same three-armed shape. Faith held honestly, with room for doubt and the dark.
        </p>
      </div>

      {essays.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-ll-dark mb-6">Essays</h2>
          <div className="space-y-6">
            {essays.map((p) => (
              <article
                key={p.slug}
                className="border-b border-ll-border pb-5"
              >
                <Link href={`/essays/${p.slug}`} className="group block">
                  <h3 className="text-xl font-semibold text-ll-dark group-hover:text-ll-primary">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-sm text-ll-text-light mt-1 leading-relaxed">
                      {p.frontmatter.excerpt}
                    </p>
                  )}
                  <p className="text-sm uppercase tracking-widest text-ll-text-light mt-2">
                    {p.readingTime}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-ll-warm rounded-lg p-8 text-center">
          <p className="text-ll-text-light">More theology essays coming soon.</p>
        </div>
      )}

      <ShareRow
        url="/theology"
        title="Theology — Southern Legends"
        description="Essays on the shape underneath the work — Trinity, perichoresis, formation, and faith held honestly."
      />

      <SectionLinks current="/theology" />
    </main>
  );
}
