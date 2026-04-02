import Link from "next/link";
import Image from "next/image";
import type { Profile } from "@/lib/profiles";

const categoryBgClass: Record<string, string> = {
  craftspeople: "category-bg-craftspeople",
  food: "category-bg-food",
  music: "category-bg-music",
  agriculture: "category-bg-agriculture",
};

function getCategoryBg(category: string): string {
  return categoryBgClass[category.toLowerCase()] || "category-bg-default";
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const { slug, frontmatter, readingTime } = profile;

  return (
    <Link href={`/profiles/${slug}`} className="group block profile-card">
      <div className="aspect-[3/2] relative overflow-hidden bg-ll-warm">
        {frontmatter.heroImage ? (
          <Image
            src={frontmatter.heroImage}
            alt={frontmatter.heroAlt || frontmatter.name}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className={`w-full h-full card-initial paper-grain ${getCategoryBg(frontmatter.category)}`}
          >
            <span className="card-initial-letter" aria-hidden="true">
              {frontmatter.name.charAt(0)}
            </span>
            <span className="card-initial-name">
              {frontmatter.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="category-tag">{frontmatter.category}</span>
        <h3
          className="mt-3 text-lg font-bold text-ll-dark group-hover:text-ll-primary transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {frontmatter.name}
        </h3>
        <p className="mt-1 text-sm text-ll-text-light">
          {frontmatter.location}
        </p>
        <p className="mt-3 text-sm text-ll-text line-clamp-2">
          {frontmatter.excerpt}
        </p>
      </div>
    </Link>
  );
}
