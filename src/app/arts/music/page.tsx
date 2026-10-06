import type { Metadata } from "next";
import Link from "next/link";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";

export const metadata: Metadata = {
  title: "Music — Southern Legends",
  description: "Songs, musicians, and the regional music scene from Northeast Alabama.",
  alternates: { canonical: "/arts/music" },
  openGraph: { url: "/arts/music" },
};

const MUSIC_TAGS = ["music", "songs", "musician", "band", "guitar", "singing", "songwriter", "studio", "recording"];

const REGIONAL_VENUES = [
  { name: "Studio 104", city: "Anniston", url: "https://studio104.gatherstudio.app", desc: "Recording studio in Anniston." },
  { name: "Noble Street Stage", city: "Anniston", url: "https://southernlegends.org/places/anniston", desc: "Live music on Noble Street corridor." },
  { name: "Gadsden Arts Center", city: "Gadsden", url: "https://southernlegends.org/places/gadsden", desc: "Arts venue and performance space." },
];

const REGIONAL_NEWS_FEEDS = [
  { name: "Alabama Music Box", url: "https://alabamamusicbox.com", desc: "Alabama's music news source." },
  { name: "Bitter Southerner", url: "https://bittersoutherner.com/category/music", desc: "Southern music features and essays." },
  { name: "Garden & Gun", url: "https://gardenandgun.com/feature/music/", desc: "Southern music culture." },
];

export default function MusicPage() {
  const profiles = getAllProfiles().filter(p =>
    p.frontmatter.tags?.some((t: string) => MUSIC_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter(p =>
    p.frontmatter.tags?.some((t: string) => MUSIC_TAGS.includes(t.toLowerCase()))
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-4">
        <Link href="/arts" className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 hover:underline">
          ← Arts
        </Link>
      </div>
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-stone-400 mb-3">Music</p>
        <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Music from the Region
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          Northeast Alabama has a music tradition that gets overlooked. This is where Southern Legends
          covers the musicians, venues, and sounds of the Appalachian foothills and the broader Southeast.
        </p>
      </div>

      {/* Featured venues */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">Where Music Happens Here</h2>
        <div className="space-y-3">
          {REGIONAL_VENUES.map(v => (
            <a
              key={v.name}
              href={v.url}
              className="flex items-start gap-3 p-4 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-500 transition group"
            >
              <div>
                <p className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 text-sm">
                  {v.name} <span className="text-stone-400 font-normal">· {v.city}</span>
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{v.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contribute CTA */}
      <div className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Are You a Regional Musician?</h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">
          We are building a directory of Northeast Alabama musicians, bands, and studios.
          Brodie Boyd (Studio 104) is our first featured artist — who else belongs here?
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/nominate"
            className="inline-block bg-amber-700 text-white px-5 py-2 rounded font-medium hover:bg-amber-800 transition text-sm"
          >
            Nominate a Musician
          </Link>
          <a
            href="mailto:matt@gatherstudio.app?subject=Music for Southern Legends"
            className="inline-block border border-amber-700 text-amber-700 dark:text-amber-400 px-5 py-2 rounded font-medium hover:bg-amber-50 dark:hover:bg-stone-700 transition text-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Published music profiles/essays */}
      {(profiles.length > 0 || essays.length > 0) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">Music Stories</h2>
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

      {/* Regional news sources */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">Regional Music Coverage</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {REGIONAL_NEWS_FEEDS.map(f => (
            <a
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 hover:border-amber-500 dark:hover:border-amber-500 transition group"
            >
              <p className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 text-sm mb-1">{f.name}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{f.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <ShareRow
        url="/arts/music"
        title="Music — Southern Legends"
        description="Songs, musicians, and the regional music scene from Northeast Alabama."
      />
      <SectionLinks current="/arts" />
    </main>
  );
}
