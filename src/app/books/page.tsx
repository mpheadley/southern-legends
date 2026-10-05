import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllJournalPosts } from "@/lib/journal";
import SectionLinks from "@/app/components/SectionLinks";
import ShareRow from "@/app/components/ShareRow";
import { SHELF_LABELS, SHELF_ORDER, booksByCategory } from "@/data/faith-agrarian-booklist";

export const metadata: Metadata = {
  title: "Books & Literature — Southern Legends",
  description: "Books, literature, and magazines from and about the American South.",
  alternates: { canonical: "/books" },
  openGraph: { url: "/books" },
};

const BOOK_TAGS = ["books", "literature", "reading", "memoir", "novel", "poetry", "nonfiction", "fiction", "magazines", "publishing"];

// Matt's forthcoming books — covers live in /images/books/ and /images/journal/
const FORTHCOMING_BOOKS = [
  {
    slug: "forthcoming-tend-before-the-wedding",
    href: "/essays/forthcoming-tend-before-the-wedding",
    title: "Tend: Before the Wedding",
    tagline: "Five conversations before you say I do.",
    cover: "/images/journal/forthcoming-tend-before-the-wedding.webp",
    status: "Forthcoming",
    preorder: false,
  },
  {
    slug: "forthcoming-plainspoken-blueprint",
    href: "/essays/forthcoming-plainspoken-blueprint",
    title: "Plainspoken Blueprint",
    tagline: "Message first. Brand second. Website last.",
    cover: "/images/journal/forthcoming-plainspoken-blueprint.webp",
    status: "Forthcoming",
    preorder: false,
  },
  {
    slug: "forthcoming-god-and-the-algorithm",
    href: "/essays/forthcoming-god-and-the-algorithm",
    title: "God & the Algorithm",
    tagline: "How I became more rested and less productive.",
    cover: null,
    status: "Forthcoming",
    preorder: false,
  },
];

// Ministry & Formation Shelf — Don Miller, Hirsch, Rohr, fresh expressions
const MINISTRY_BOOKS = [
  {
    title: "Blue Like Jazz",
    author: "Donald Miller",
    blurb: "The book that made it okay to be confused about faith in your twenties. Still the best gateway drug to an honest Christianity.",
    mattNote: "I passed this around like contraband in my first ministry job. Still right.",
    url: "https://bookshop.org/a/gather/9780785261308",
  },
  {
    title: "A Million Miles in a Thousand Years",
    author: "Donald Miller",
    blurb: "Miller's best — the story of rewriting your own story. What makes a life worth living? What makes a character worth following?",
    mattNote: "This one hit harder than Blue Like Jazz. Story as the shape of a life.",
    url: "https://bookshop.org/a/gather/9781400202232",
  },
  {
    title: "The Forgotten Ways",
    author: "Alan Hirsch",
    blurb: "The missional DNA argument — Apostolic Genius as six elements every healthy movement embeds. The ecclesiology that shaped how I think about Ecclesia.",
    url: "https://bookshop.org/a/gather/9781587433023",
  },
  {
    title: "The New Parish",
    author: "Paul Sparks, Tim Soerens, Dwight Friesen",
    blurb: "Place-based church. The theological case for rooted, neighborhood-anchored ministry. This is what a fresh expression looks like grounded.",
    url: "https://bookshop.org/a/gather/9780830836079",
  },
  {
    title: "Everything Belongs",
    author: "Richard Rohr",
    blurb: "Contemplative spirituality as the center — not the edge — of Christian formation. The non-dualistic prayer that makes room for the real self.",
    url: "https://bookshop.org/a/gather/9780824519919",
  },
  {
    title: "Flesh and Bone and The Church",
    author: "Hugh Halter",
    blurb: "Incarnational ministry — showing up in bodies, in neighborhoods, in the mess. The theology of the limping guide.",
    url: "https://bookshop.org/a/gather/9781576839539",
  },
  {
    title: "The Sacred Overlap",
    author: "J.R. Briggs",
    blurb: "Ministry in the margins — the between-spaces where most of the actual kingdom work happens.",
    url: "https://bookshop.org/a/gather/9780310095989",
  },
  {
    title: "Liturgy of the Ordinary",
    author: "Tish Harrison Warren",
    blurb: "The sacred in the day's small acts. Morning prayer that starts with making the bed. The most honest spiritual formation book of the last decade.",
    url: "https://bookshop.org/a/gather/9780830846160",
  },
];

// Business & Messaging Shelf — Gather Studio / Plainspoken Blueprint reading
const BUSINESS_BOOKS = [
  {
    title: "Building a StoryBrand 2.0",
    author: "Donald Miller",
    blurb: "The framework behind Plainspoken Blueprint. Clarify the message or be ignored. The hero is always the customer, never the brand.",
    mattNote: "The foundation. Message before brand before website — in that order, every time.",
    url: "https://bookshop.org/a/gather/9781400245925",
    podcast: "The StoryBrand Podcast",
    podcastUrl: "https://podcasts.apple.com/us/podcast/the-storybrand-podcast/id1072199724",
  },
  {
    title: "Business Made Simple",
    author: "Donald Miller",
    blurb: "The daily operating system for a small business. Part business school, part field guide. Miller's most practical book.",
    url: "https://bookshop.org/a/gather/9781400226757",
  },
  {
    title: "How to Grow Your Small Business",
    author: "Donald Miller",
    blurb: "The six steps — every small business doing more with less. Read after StoryBrand.",
    url: "https://bookshop.org/a/gather/9780593719985",
  },
  {
    title: "This Is Marketing",
    author: "Seth Godin",
    blurb: "Marketing as service, not manipulation. The smallest viable market. Minimum viable audience. Godin's clearest statement.",
    url: "https://bookshop.org/a/gather/9780525540830",
  },
  {
    title: "Company of One",
    author: "Paul Jarvis",
    blurb: "Why staying small is the smartest play for solo builders. Growth as a choice, not a default. This is the Gather Studio operating posture.",
    url: "https://bookshop.org/a/gather/9780358213253",
  },
  {
    title: "The War of Art",
    author: "Steven Pressfield",
    blurb: "Resistance is real. Shipping is the answer. The internal battle every creator fights — and the pro mentality that wins it.",
    url: "https://bookshop.org/a/gather/9781936891023",
  },
  {
    title: "Perennial Seller",
    author: "Ryan Holiday",
    blurb: "Building work that lasts — the antidote to the dopamine algorithm. Ship the thing that will still matter in ten years.",
    url: "https://bookshop.org/a/gather/9780143109013",
  },
];

// Regional magazines and publishers
const REGIONAL_PUBS = [
  { name: "Oxford American", url: "https://oxfordamerican.org", description: "The literary magazine of the South." },
  { name: "Garden & Gun", url: "https://gardenandgun.com", description: "Southern culture, food, and outdoors." },
  { name: "Bitter Southerner", url: "https://bittersoutherner.com", description: "The new South in long-form." },
  { name: "Alabama Writers' Forum", url: "https://writersforum.org", description: "Alabama's literary organization." },
  { name: "Deep South Magazine", url: "https://deepsouthmag.com", description: "Stories from the American South." },
  { name: "Reckon Review", url: "https://reckon.news", description: "Southern journalism and culture." },
];

export default function BooksPage() {
  const essays = getAllJournalPosts().filter(p =>
    p.frontmatter.tags?.some((t: string) => BOOK_TAGS.includes(t.toLowerCase()))
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="text-sm uppercase tracking-widest text-stone-400 mb-3">Books &amp; Literature</p>
        <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Reading the South
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          The South has always been a place people write about — and write from. Books, shelves, and the reading behind the writing.
        </p>
      </div>

      {/* Forthcoming from Matt */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">Forthcoming from Matt Headley</h2>
        <div className="space-y-5">
          {FORTHCOMING_BOOKS.map(book => (
            <article key={book.slug} className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
              <Link href={book.href} className="group flex gap-0">
                {book.cover && (
                  <div className="relative w-28 sm:w-36 shrink-0 self-stretch">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 144px"
                    />
                  </div>
                )}
                <div className={`p-4 sm:p-5 flex flex-col justify-between flex-1 ${!book.cover ? "pl-5" : ""}`}>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                      {book.status}
                    </p>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 leading-snug mb-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 italic leading-relaxed">
                      {book.tagline}
                    </p>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
                    {book.preorder ? "Preorder →" : "Read the announcement →"}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Faith & Agrarian Shelf — from the canonical booklist */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">The Faith &amp; Agrarian Shelf</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">
          Faith, land, and vocation — the books that shaped how Matt thinks about the ground, and the reading behind the forthcoming <em>Company of Farmers</em>. Alabama titles first.
        </p>
        {SHELF_ORDER.map(cat => (
          <div key={cat} className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3 font-semibold">{SHELF_LABELS[cat]}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {booksByCategory(cat).map(book => (
                <div
                  key={book.slug}
                  className={`border rounded-lg p-5 flex flex-col ${book.alabama ? "border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 sm:col-span-2" : "border-stone-200 dark:border-stone-700"}`}
                >
                  {book.alabama && (
                    <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">Alabama</p>
                  )}
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{book.title}</h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">by {book.author}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{book.blurb}</p>
                  {book.mattNote && (
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-2 border-l-2 border-amber-400 dark:border-amber-500 pl-3 italic">
                      {book.mattNote}
                    </p>
                  )}
                  <div className="flex gap-3 mt-3 text-sm">
                    {book.relatedProfile && (
                      <Link href={book.relatedProfile} className="text-amber-700 dark:text-amber-400 hover:underline">Read the profile →</Link>
                    )}
                    {book.bookshopUrl && (
                      <a href={book.bookshopUrl} target="_blank" rel="noopener noreferrer" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:underline">Find the book →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
          The reading behind <Link href="/essays/forthcoming-homesteading-heroes" className="text-amber-700 dark:text-amber-400 hover:underline">Company of Farmers</Link>. Start with Matt&apos;s profile of <Link href="/profiles/noah-sanders" className="text-amber-700 dark:text-amber-400 hover:underline">Noah Sanders</Link>.
        </p>
      </div>

      {/* Ministry & Formation Shelf */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Ministry &amp; Formation</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">
          The shelf behind Ecclesia Community and the Plainspoken Blueprint&apos;s formation arc. Fresh expressions, contemplative prayer, incarnational ministry.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {MINISTRY_BOOKS.map(book => (
            <div key={book.title} className="border border-stone-200 dark:border-stone-700 rounded-lg p-5 flex flex-col">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{book.title}</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">by {book.author}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed flex-1">{book.blurb}</p>
              {book.mattNote && (
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-2 border-l-2 border-amber-400 dark:border-amber-500 pl-3 italic">
                  {book.mattNote}
                </p>
              )}
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:underline mt-3 text-sm"
              >
                Find the book →
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-4">
          Affiliate links support Southern Legends and independent bookstores via Bookshop.org.
        </p>
      </div>

      {/* Business & Messaging Shelf */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Business &amp; Messaging</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">
          The reading behind{" "}
          <a href="https://gatherstudio.app" target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-400 hover:underline">Gather Studio</a>{" "}
          and the Plainspoken Blueprint methodology. Message clarity, solo business, the war against resistance.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {BUSINESS_BOOKS.map(book => (
            <div key={book.title} className="border border-stone-200 dark:border-stone-700 rounded-lg p-5 flex flex-col">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{book.title}</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">by {book.author}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed flex-1">{book.blurb}</p>
              {book.mattNote && (
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-2 border-l-2 border-amber-400 dark:border-amber-500 pl-3 italic">
                  {book.mattNote}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-1">
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:underline text-sm"
                >
                  Find the book →
                </a>
                {book.podcast && (
                  <a
                    href={book.podcastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:underline text-sm"
                  >
                    Podcast: {book.podcast} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-4">
          Affiliate links support Southern Legends and independent bookstores via Bookshop.org.
        </p>
      </div>

      {/* Regional Publications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Southern Publications Worth Reading</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">Magazines and journals doing serious work on Southern culture and literature.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {REGIONAL_PUBS.map(pub => (
            <a
              key={pub.name}
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 hover:border-amber-500 dark:hover:border-amber-500 transition group"
            >
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 mb-1">
                {pub.name}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">{pub.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Essays tagged books */}
      {essays.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">Reading Notes</h2>
          <div className="space-y-4">
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

      {/* Gather Registry — Reading List CTA */}
      <div className="border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6 mb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-amber-700 dark:text-amber-500 mb-2">Free · Takes 2 minutes</p>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Build a reading list on Gather Registry.</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 leading-relaxed">
          Share one link. Anyone can gift you the books you actually want to read — perfect for birthdays, anniversaries, or just telling people what&apos;s on your nightstand.
        </p>
        <a
          href="https://gather-registry.vercel.app/create?type=reading&ref=southern-legends"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-700 text-white px-5 py-2 rounded font-medium hover:bg-amber-800 transition text-sm"
        >
          Create a reading list →
        </a>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-3">
          Powered by <a href="https://gather-registry.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700">Gather Registry</a>. All Bookshop.org links support independent bookstores and Southern Legends.
        </p>
      </div>

      {/* Contribute */}
      <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-8 mt-4">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Contribute a Review or Reading Note</h2>
        <p className="text-stone-500 dark:text-stone-400 mb-4 text-sm">
          Read something Southern worth telling people about? We publish brief reading notes and book reviews from regional contributors.
        </p>
        <Link
          href="/nominate"
          className="inline-block bg-amber-700 text-white px-5 py-2 rounded font-medium hover:bg-amber-800 transition text-sm"
        >
          Submit a Review
        </Link>
      </div>

      <ShareRow
        url="/books"
        title="Books & Literature — Southern Legends"
        description="Books, literature, and magazines from and about the American South."
      />

      <SectionLinks current="/books" />
    </main>
  );
}
