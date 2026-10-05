import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MERCH } from "@/lib/merch";

export const metadata: Metadata = {
  title: "Books by Matt Headley — Southern Legends",
  description:
    "Books by Matt Headley, who writes at Southern Legends and pastors Ecclesia Community in Northeast Alabama. Including Clever Confuses. Clarity Sells., Tend: Before the Wedding, Southern Legends Vol. 1, and Broken Ground.",
  alternates: { canonical: "/author" },
  openGraph: {
    url: "/author",
    title: "Books by Matt Headley",
    description:
      "Matt Headley writes at Southern Legends and pastors Ecclesia Community in Northeast Alabama. Books, works in progress, and newsletter signup.",
    images: [{ url: "/images/about/headshot-hedcut-matt-headley.webp" }],
  },
};

type BookStatus = "presell" | "forthcoming" | "drafting" | "serializing" | "longGame";

interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  tagline: string;
  status: BookStatus;
  statusLabel: string;
  coverImage?: string;
  series?: string;
  presellUrl?: string;
  signupLabel?: string;
  signupUrl?: string;
  tier: "near" | "later";
  siteUrl?: string;
  siteLabel?: string;
  eta?: string;
  description: string;
}

const STATUS_STYLES: Record<BookStatus, string> = {
  presell: "bg-amber-700 text-white",
  forthcoming: "bg-stone-800 text-stone-200",
  drafting: "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200",
  serializing: "bg-emerald-700 text-white",
  longGame: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
};

const BOOKS: Book[] = [
  {
    slug: "plainspoken-blueprint",
    title: "Clever Confuses. Clarity Sells.",
    subtitle: "The Plainspoken Blueprint field guide.",
    tagline: "Message first. Brand second. Website last.",
    status: "drafting",
    statusLabel: "Nearly done",
    tier: "near",
    series: "The Plainspoken Blueprint · the Gather Studio method",
    signupLabel: "Notify me when it's ready",
    signupUrl: "/subscribe",
    siteUrl: "https://gatherstudio.app",
    siteLabel: "See the method at Gather Studio",
    description:
      "Almost every small business has the sequence backwards. They fix the website before the brand. The brand before the message. This is the argument for one right order, and a field guide to working it. It's the same method I use with clients at Gather Studio.",
  },
  {
    slug: "tend-before-the-wedding",
    title: "Tend: Before the Wedding",
    tagline: "Five conversations before you say I do.",
    status: "presell",
    statusLabel: "Presell signup open · prints after the Oct 18 show",
    tier: "near",
    series: "The Tend Series",
    presellUrl: "/essays/forthcoming-tend-before-the-wedding",
    signupLabel: "Get notified when it ships",
    signupUrl: "/subscribe",
    description:
      "A premarital workbook built from five real conversations: money, family history, conflict, faith, and sex. Not prompts. Conversations. For couples who want to get somewhere before they walk the aisle.",
  },
  {
    slug: "southern-legends-vol1",
    title: "Southern Legends Vol. 1",
    tagline: "Collected profiles from Northeast Alabama.",
    status: "serializing",
    statusLabel: "Serializing now · email list gets first access",
    tier: "near",
    series: "Southern Legends",
    signupLabel: "Join the list for early access",
    signupUrl: "/subscribe",
    description:
      "The profiles, the places, the people doing quiet durable work in Northeast Alabama. Not because they are famous. Because they are here, and that is worth something. Compiled from the first years of the column.",
  },
  {
    slug: "broken-ground",
    title: "Broken Ground",
    tagline: "Losing a flower farm. Leaving a church. What it looked like to rebuild.",
    status: "forthcoming",
    statusLabel: "Memoir · in progress",
    tier: "later",
    series: "Standalone",
    signupLabel: "Notify me when it's ready",
    signupUrl: "/subscribe",
    description:
      "I lost a flower farm in Anniston. I resigned from a church I loved. I survived a manic episode I didn't recognize until the damage was done. This is the memoir of what it looked like to start over when you're not sure what you're starting toward.",
  },
  {
    slug: "god-and-the-algorithm",
    title: "God & the Algorithm",
    subtitle: "How I became more rested and less productive.",
    tagline: "I built God out of code. It wasn't what I needed.",
    status: "drafting",
    statusLabel: "Drafting now",
    tier: "later",
    coverImage: "/images/books/god-algorithm-cover.webp",
    series: "Standalone",
    signupLabel: "Notify me when it's ready",
    signupUrl: "/subscribe",
    description:
      "During a manic episode, I built a community of AI spiritual directors: one for each Enneagram type, plus a Richard Rohr and a figure I labeled Jesus. The technical execution worked. This book is what I found when I looked at it in daylight.",
  },
  {
    slug: "back-forty",
    title: "The Back Forty",
    tagline: "Dispatches on dirt, chickens, and the people who perform them.",
    status: "serializing",
    statusLabel: "Column in progress · read it now",
    tier: "later",
    coverImage: "/images/books/back-forty-cover.webp",
    series: "Southern Legends",
    presellUrl: "/back-forty",
    signupLabel: "Read the column",
    signupUrl: "/back-forty",
    description:
      "Southern Gothic agrarian satire, running on Southern Legends under my name. Half dispatch, half confession. A man who farmed for real and lost the farm anyway, on dirt, chickens, and the honest absurdity of growing things.",
  },
];

export default function AuthorPage() {
  const nearBooks = BOOKS.filter(b => b.tier === "near");
  const laterBooks = BOOKS.filter(b => b.tier === "later");
  const shirts = MERCH.filter(m => m.fwUrl).slice(0, 6);

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="flex gap-6 items-start mb-14">
        <Image
          src="/images/about/headshot-hedcut-matt-headley.webp"
          alt="Matt Headley"
          width={96}
          height={96}
          className="rounded-full shrink-0"
          style={{ width: 96, height: 96 }}
        />
        <div>
          <p className="text-sm uppercase tracking-widest text-stone-400 mb-1">Author</p>
          <h1 className="text-3xl font-bold text-stone-100 mb-2 font-fraunces">
            Books by Matt Headley
          </h1>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
            Matt Headley writes at Southern Legends and pastors Ecclesia Community in
            Northeast Alabama. He also runs Gather Studio, building websites and messaging
            for small businesses.
          </p>
        </div>
      </div>

      <section className="mb-14">
        <h2 className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-5">Closest to done</h2>
        <div className="space-y-5">
          {nearBooks.map((book, i) => (
            <BookCard key={book.slug} book={book} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-5">Also in the works</h2>
        <div className="space-y-5">
          {laterBooks.map(book => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-5">Shirts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {shirts.map(item => (
            <a key={item.id} href={item.fwUrl} target="_blank" rel="noopener noreferrer"
              className="group block rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition">
              <div className="relative aspect-square isolate" style={{ background: "#ece5d8" }}>
                <Image src={item.photo} alt={item.name} fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" style={{ mixBlendMode: "multiply" }} />
              </div>
              <div className="p-3 flex justify-between items-baseline gap-2">
                <p className="text-sm font-medium text-stone-100 group-hover:text-amber-400 leading-snug">{item.name}</p>
                <span className="text-sm text-stone-500 dark:text-stone-400">${item.price}</span>
              </div>
            </a>
          ))}
        </div>
        <Link href="/merch/shirts" className="inline-block mt-4 text-sm text-amber-700 dark:text-amber-400 hover:underline">
          See all shirts →
        </Link>
      </section>

      {/* Newsletter + Support */}
      <section className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-6">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">Stay in the loop</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
            Email list gets early access to every book — presell announcements, chapters, and release dates before anyone else.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-amber-700 text-white text-sm font-medium px-5 py-2 rounded hover:bg-amber-800 transition"
          >
            Subscribe →
          </Link>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-6">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">Support this work</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
            Southern Legends and all the books are made by one person with a laptop and a farm.
            If it's been worth something, you can say so here.
          </p>
          <Link
            href="/support"
            className="inline-block border border-stone-400 dark:border-stone-500 text-stone-700 dark:text-stone-300 text-sm font-medium px-5 py-2 rounded hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
          >
            Support →
          </Link>
        </div>
      </section>

    </main>
  );
}

function BookCard({ book, featured = false }: { book: Book; featured?: boolean }) {
  return (
    <article
      className={`rounded-lg border p-6 ${
        featured
          ? "border-amber-600 bg-amber-950/30"
          : "border-stone-200 dark:border-stone-700"
      }`}
    >
      <div className="flex gap-5">
        <div className="shrink-0">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              width={72}
              height={100}
              className="rounded shadow-sm object-cover"
              style={{ width: 72, height: 100, objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true" className="rounded shadow-sm flex items-center justify-center text-center p-2"
              style={{ width: 72, height: 100, background: "#1B2A4A" }}>
              <span className="font-fraunces text-[11px] leading-tight text-amber-100">{book.title}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {book.series && (
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">{book.series}</p>
          )}
          <h3 className="font-bold text-stone-100 font-fraunces text-lg leading-snug mb-0.5">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="text-sm text-stone-500 dark:text-stone-400 italic mb-1">{book.subtitle}</p>
          )}
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">{book.tagline}</p>

          <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium mb-3 ${STATUS_STYLES[book.status]}`}>
            {book.statusLabel}
          </span>

          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {book.presellUrl && book.status === "presell" && (
              <Link
                href={book.presellUrl}
                className="inline-block bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded hover:bg-amber-800 transition"
              >
                Presell — {book.eta ?? "order now"} →
              </Link>
            )}
            {book.presellUrl && book.status === "serializing" && (
              <Link
                href={book.presellUrl}
                className="inline-block bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded hover:bg-stone-700 transition"
              >
                {book.signupLabel ?? "Read now"} →
              </Link>
            )}
            {book.signupUrl && book.status !== "serializing" && (
              <Link
                href={book.signupUrl}
                className="inline-block border border-stone-400 dark:border-stone-500 text-stone-700 dark:text-stone-300 text-sm px-4 py-2 rounded hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
              >
                {book.signupLabel ?? "Notify me"} →
              </Link>
            )}
            {book.siteUrl && (
              <a
                href={book.siteUrl}
                className="inline-block text-sm px-4 py-2 text-amber-700 dark:text-amber-400 hover:underline"
              >
                {book.siteLabel ?? "Learn more"} →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
