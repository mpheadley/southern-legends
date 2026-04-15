import { Link } from "next-view-transitions";
import Image from "next/image";
import type { JournalPost } from "@/lib/journal";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalCard({ post }: { post: JournalPost }) {
  const { slug, frontmatter } = post;

  return (
    <Link href={`/journal/${slug}`} className="group block">
      <div className="aspect-[3/2] relative overflow-hidden rounded-lg bg-ll-warm">
        {frontmatter.image ? (
          <Image
            src={frontmatter.image}
            alt={frontmatter.imageAlt || frontmatter.title}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-ll-warm" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs text-ll-text-light mb-1">{formatDate(frontmatter.date)}</p>
        <h3
          className="text-lg font-bold text-ll-dark group-hover:text-ll-primary transition-colors leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {frontmatter.title}
        </h3>
        <p className="mt-2 text-sm text-ll-text line-clamp-2">{frontmatter.excerpt}</p>
        <span className="mt-3 inline-block text-sm font-medium text-ll-primary">Read →</span>
      </div>
    </Link>
  );
}
