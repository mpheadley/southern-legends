import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content/profiles");

export interface ProfileFrontmatter {
  title: string;
  name: string;
  location: string;
  category: string;
  tags: string[];
  date: string;
  lastModified?: string;
  excerpt: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  published: boolean;
  featured?: boolean;
  titleHtml?: string;
  aiWritten?: boolean;
  photoCredit?: string;
  byline?: string;
  metaDescription?: string;
  mobileHero?: "bg" | "stack" | "text";
  heroPosition?: string;
  heroCaption?: string;
  facebook?: string;
}

export interface Profile {
  slug: string;
  frontmatter: ProfileFrontmatter;
  content: string;
  readingTime: string;
}

export function getProfileSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProfileBySlug(slug: string): Profile {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as ProfileFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllProfiles(): Profile[] {
  const slugs = getProfileSlugs();
  return slugs
    .map(getProfileBySlug)
    .filter((p) => p.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Returns the profile with `featured: true`, or falls back to the most recent published profile. */
export function getFeaturedProfile(): Profile | null {
  const all = getAllProfiles();
  if (all.length === 0) return null;
  return all.find((p) => p.frontmatter.featured) ?? all[0];
}

export function getCategories(): string[] {
  const profiles = getAllProfiles();
  const categories = new Set(profiles.map((p) => p.frontmatter.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const profiles = getAllProfiles();
  const tags = new Set(profiles.flatMap((p) => p.frontmatter.tags ?? []));
  return Array.from(tags).sort();
}

/** Returns two profiles to show as "More Stories" — adjacent by date, filling gaps if at the start or end. */
export function getAdjacentProfiles(slug: string): {
  prev: Profile | null;
  next: Profile | null;
} {
  const all = getAllProfiles();
  const idx = all.findIndex((p) => p.slug === slug);
  let prev: Profile | null = idx < all.length - 1 ? all[idx + 1] : null;
  let next: Profile | null = idx > 0 ? all[idx - 1] : null;

  if (!prev || !next) {
    const others = all.filter(
      (p) => p.slug !== slug && p.slug !== prev?.slug && p.slug !== next?.slug
    );
    if (!next && others.length > 0) next = others[0];
    else if (!prev && others.length > 0) prev = others[others.length - 1];
  }

  return { prev, next };
}
