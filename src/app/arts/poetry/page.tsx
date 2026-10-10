import type { Metadata } from "next";
import Link from "next/link";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Poetry — Southern Legends",
  description: "Original poetry from Alabama writers and the Appalachian foothills.",
  alternates: { canonical: "/arts/poetry" },
  openGraph: { url: "/arts/poetry" },
};

const POETRY_TAGS = ["poetry", "poem", "poems", "verse", "lyric", "lyrics"];

export default function PoetryPage() {
  const profiles = getAllProfiles().filter(p =>
    p.frontmatter.tags?.some((t: string) => POETRY_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter(p =>
    p.frontmatter.tags?.some((t: string) => POETRY_TAGS.includes(t.toLowerCase()))
  );

  return (
    <main className="page-light page-top max-w-3xl mx-auto px-4 pb-16">
      <div className="mb-4">
        <Link href="/arts" className="text-sm font-semibold uppercase tracking-widest text-ll-primary hover:underline">
          ← Arts
        </Link>
      </div>
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-ll-text-light mb-3">Poetry</p>
        <h1 className="text-4xl font-bold text-ll-dark mb-4">
          Poems from the Foothills
        </h1>
        <p className="text-lg text-ll-text leading-relaxed">
          Southern Legends publishes original poetry from Alabama writers and artists of the
          Appalachian foothills. We are looking for poems that know where they live.
        </p>
      </div>

      {/* Contributors */}
      <div className="bg-ll-warm border border-ll-border rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-ll-dark mb-2">Contribute a Poem</h2>
        <p className="text-ll-text text-sm mb-3">
          We are inviting Alabama poets to submit original work. We are particularly interested in
          Brodie Boyd, Jason Wright, and other regional voices. No payment yet — but a real audience.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/nominate"
            className="inline-block bg-ll-primary text-white px-5 py-2 rounded font-medium hover:bg-ll-primary-dark transition text-sm"
          >
            Submit Your Work
          </Link>
          <a
            href="mailto:matt@gatherstudio.app?subject=Poetry for Southern Legends"
            className="inline-block border border-ll-primary text-ll-primary px-5 py-2 rounded font-medium hover:bg-ll-warm transition text-sm"
          >
            Email Directly
          </a>
        </div>
      </div>

      {/* Published poems */}
      {(profiles.length > 0 || essays.length > 0) ? (
        <div>
          <h2 className="text-2xl font-bold text-ll-dark mb-6">Published Poems</h2>
          <div className="space-y-6">
            {profiles.map(p => (
              <article key={p.slug} className="border-b border-ll-border pb-6">
                <Link href={`/profiles/${p.slug}`} className="group">
                  <h3 className="text-xl font-semibold text-ll-dark group-hover:text-ll-primary mb-1">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-ll-text-light">{p.frontmatter.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
            {essays.map(p => (
              <article key={p.slug} className="border-b border-ll-border pb-6">
                <Link href={`/essays/${p.slug}`} className="group">
                  <h3 className="text-xl font-semibold text-ll-dark group-hover:text-ll-primary mb-1">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-ll-text-light">{p.frontmatter.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-ll-text-light italic text-sm">
          First poems coming soon. We are actively seeking Alabama poets to contribute.
        </p>
      )}

      <ShareRow
        url="/arts/poetry"
        title="Poetry — Southern Legends"
        description="Original poetry from Alabama writers and the Appalachian foothills."
      />
      <SectionLinks current="/arts" />
    </main>
  );
}
