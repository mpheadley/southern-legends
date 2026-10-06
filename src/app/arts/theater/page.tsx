import type { Metadata } from "next";
import Link from "next/link";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Theater — Southern Legends",
  description: "Stage work, productions, and theater artists from Northeast Alabama and the Southeast.",
  alternates: { canonical: "/arts/theater" },
  openGraph: { url: "/arts/theater" },
};

const THEATER_TAGS = ["theater", "theatre", "stage", "performance", "play", "drama", "musical", "acting", "script"];

const REGIONAL_COMPANIES = [
  {
    name: "Theatre of Gadsden",
    city: "Gadsden",
    url: "https://theatreofgadsden.com",
    desc: "Community theater in Gadsden. Auditions and productions year-round.",
    contact: "Skylar Wheat, Director",
  },
  {
    name: "Anniston Community Theater",
    city: "Anniston",
    url: "https://southernlegends.org/places/anniston",
    desc: "Live theater in Calhoun County.",
    contact: null,
  },
  {
    name: "JSU Theater Department",
    city: "Jacksonville",
    url: "https://southernlegends.org/places/jacksonville",
    desc: "Jacksonville State University performing arts program.",
    contact: null,
  },
];

export default function TheaterPage() {
  const profiles = getAllProfiles().filter(p =>
    p.frontmatter.tags?.some((t: string) => THEATER_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter(p =>
    p.frontmatter.tags?.some((t: string) => THEATER_TAGS.includes(t.toLowerCase()))
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-4">
        <Link href="/arts" className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 hover:underline">
          ← Arts
        </Link>
      </div>
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-stone-400 mb-3">Theater</p>
        <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Stage Work in the Southeast
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          Community theater, university productions, and working playwrights from Northeast Alabama
          and across the Appalachian South. We cover the people who put things on stages.
        </p>
      </div>

      {/* Regional companies */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">Regional Theater Companies</h2>
        <div className="space-y-3">
          {REGIONAL_COMPANIES.map(c => (
            <a
              key={c.name}
              href={c.url}
              className="flex items-start gap-3 p-4 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-500 transition group"
              target={c.url.startsWith("http") && !c.url.includes("southernlegends") ? "_blank" : undefined}
              rel={c.url.startsWith("http") && !c.url.includes("southernlegends") ? "noopener noreferrer" : undefined}
            >
              <div>
                <p className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 text-sm">
                  {c.name} <span className="text-stone-400 font-normal">· {c.city}</span>
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{c.desc}</p>
                {c.contact && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{c.contact}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Know a Theater Artist Worth Featuring?</h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">
          Directors, playwrights, actors, set designers, stage managers — the theater is full of
          people doing serious work in small places. We want to write about them.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/nominate"
            className="inline-block bg-amber-700 text-white px-5 py-2 rounded font-medium hover:bg-amber-800 transition text-sm"
          >
            Nominate Someone
          </Link>
          <a
            href="mailto:matt@gatherstudio.app?subject=Theater for Southern Legends"
            className="inline-block border border-amber-700 text-amber-700 dark:text-amber-400 px-5 py-2 rounded font-medium hover:bg-amber-50 dark:hover:bg-stone-700 transition text-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Published profiles */}
      {(profiles.length > 0 || essays.length > 0) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">Theater Stories</h2>
          <div className="space-y-4">
            {profiles.map(p => (
              <article key={p.slug} className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <Link href={`/profiles/${p.slug}`} className="group">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {p.frontmatter.title}
                  </h3>
                  {p.frontmatter.excerpt && (
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{p.frontmatter.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
            {essays.map(p => (
              <article key={p.slug} className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <Link href={`/essays/${p.slug}`} className="group">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {p.frontmatter.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 && essays.length === 0 && (
        <p className="text-stone-400 italic text-sm mb-12">
          First theater profiles coming soon. Nominations welcome above.
        </p>
      )}

      <ShareRow
        url="/arts/theater"
        title="Theater — Southern Legends"
        description="Stage work and theater artists from Northeast Alabama and the Southeast."
      />
      <SectionLinks current="/arts" />
    </main>
  );
}
