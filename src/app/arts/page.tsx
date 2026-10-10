import type { Metadata } from "next";
import Link from "next/link";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Arts — Southern Legends",
  description: "Poetry, music, and theater from the Appalachian foothills of Northeast Alabama.",
  alternates: { canonical: "/arts" },
  openGraph: { url: "/arts" },
};

const ARTS_TAGS = ["poetry", "music", "theater", "arts", "songs", "lyrics", "performance", "theatre"];

export default function ArtsPage() {
  const profiles = getAllProfiles().filter(p =>
    p.frontmatter.tags?.some((t: string) => ARTS_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter(p =>
    p.frontmatter.tags?.some((t: string) => ARTS_TAGS.includes(t.toLowerCase()))
  );

  return (
    <main className="page-light page-top max-w-3xl mx-auto px-4 pb-16">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-ll-text-light mb-3">Arts</p>
        <h1 className="text-4xl font-bold text-ll-dark mb-4">
          Poetry, Music & Theater
        </h1>
        <p className="text-lg text-ll-text leading-relaxed">
          Northeast Alabama has always made things worth hearing. This is where Southern Legends 
          publishes poems, songs, and stories from the stage — local voices and regional artists 
          from across the Appalachian foothills.
        </p>
      </div>

      {/* Contribute CTA */}
      <div className="bg-ll-warm border border-ll-border rounded-lg p-6 mb-12">
        <h2 className="text-xl font-semibold text-ll-dark mb-2">Contribute Your Work</h2>
        <p className="text-ll-text mb-4">
          Southern Legends publishes original poetry, song lyrics, and theater pieces from Alabama writers and performers. 
          No payment yet — but your work reaches a real regional audience.
        </p>
        <Link
          href="/nominate"
          className="inline-block bg-ll-primary text-white px-5 py-2 rounded font-medium hover:bg-ll-primary-dark transition"
        >
          Submit Your Work
        </Link>
      </div>

      {/* Sections */}
      <div className="grid gap-8 sm:grid-cols-3 mb-12">
        {[
          { label: "Poetry", href: "/arts/poetry", description: "Poems from NE Alabama and the foothills." },
          { label: "Music", href: "/arts/music", description: "Songs, lyrics, and musicians from the region." },
          { label: "Theater", href: "/arts/theater", description: "Stage work, scripts, and performance notes." },
        ].map(({ label, href, description }) => (
          <Link key={href} href={href} className="group border border-ll-border rounded-lg p-5 hover:border-ll-accent transition">
            <h3 className="font-semibold text-ll-dark group-hover:text-ll-primary mb-1">{label} →</h3>
            <p className="text-sm text-ll-text-light">{description}</p>
          </Link>
        ))}
      </div>

      {/* Articles tagged with arts */}
      {(profiles.length > 0 || essays.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold text-ll-dark mb-6">Arts Stories</h2>
          <div className="space-y-4">
            {profiles.map(p => (
              <article key={p.slug} className="border-b border-ll-border pb-4">
                <Link href={`/profiles/${p.slug}`} className="group">
                  <h3 className="font-semibold text-ll-dark group-hover:text-ll-primary">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-sm text-ll-text-light mt-1">{p.frontmatter.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
            {essays.map(p => (
              <article key={p.slug} className="border-b border-ll-border pb-4">
                <Link href={`/essays/${p.slug}`} className="group">
                  <h3 className="font-semibold text-ll-dark group-hover:text-ll-primary">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-sm text-ll-text-light mt-1">{p.frontmatter.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 && essays.length === 0 && (
        <p className="text-ll-text-light italic">
          First arts pieces coming soon. Submit your work above.
        </p>
      )}

      <ShareRow
        url="/arts"
        title="Arts — Southern Legends"
        description="Poetry, music, and theater from the Appalachian foothills of Northeast Alabama."
      />

      <SectionLinks current="/arts" />
    </main>
  );
}
