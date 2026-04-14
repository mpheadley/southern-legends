import Link from "next/link";
import Image from "next/image";
import type { JournalPost } from "@/lib/journal";

interface JournalNavProps {
  prev: JournalPost | null;
  next: JournalPost | null;
}

function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group block text-left">
      {post.frontmatter.image && (
        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden mb-3">
          <Image
            src={post.frontmatter.image}
            alt={post.frontmatter.imageAlt ?? post.frontmatter.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 45vw, 300px"
            loading="lazy"
          />
        </div>
      )}
      <span
        className="block text-base font-bold text-ll-dark group-hover:text-ll-primary transition-colors leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {post.frontmatter.title}
      </span>
      <span className="mt-0.5 block text-sm text-ll-text-light line-clamp-2">
        {post.frontmatter.excerpt}
      </span>
    </Link>
  );
}

export default function JournalNav({ prev, next }: JournalNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="story-nav border-t border-ll-border" aria-label="More from the journal">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-10">
        <p className="text-xs font-medium uppercase tracking-wider text-ll-text-light mb-6">
          More from the Journal
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>{prev && <JournalCard post={prev} />}</div>
          <div>{next && <JournalCard post={next} />}</div>
        </div>
      </div>
    </nav>
  );
}
