import Link from "next/link";
import type { Profile } from "@/lib/profiles";

interface StoryNavProps {
  prev: Profile | null;
  next: Profile | null;
}

export default function StoryNav({ prev, next }: StoryNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="story-nav border-t border-ll-border" aria-label="More stories">
      <div className="max-w-3xl mx-auto px-6 py-10 grid grid-cols-2 gap-6">
        {/* Previous (older) */}
        <div>
          {prev && (
            <Link
              href={`/profiles/${prev.slug}`}
              className="group block text-left"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-ll-text-light">
                Previous Story
              </span>
              <span
                className="mt-1 block text-base font-bold text-ll-dark group-hover:text-ll-primary transition-colors leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {prev.frontmatter.name}
              </span>
              <span className="mt-0.5 block text-sm text-ll-text-light">
                {prev.frontmatter.location}
              </span>
            </Link>
          )}
        </div>

        {/* Next (newer) */}
        <div className="text-right">
          {next && (
            <Link
              href={`/profiles/${next.slug}`}
              className="group block text-right"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-ll-text-light">
                Next Story
              </span>
              <span
                className="mt-1 block text-base font-bold text-ll-dark group-hover:text-ll-primary transition-colors leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {next.frontmatter.name}
              </span>
              <span className="mt-0.5 block text-sm text-ll-text-light">
                {next.frontmatter.location}
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
