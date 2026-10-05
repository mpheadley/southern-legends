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
  featuredOrder?: number;
  titleHtml?: string;
  aiWritten?: boolean;
  /** evergreen = holds up indefinitely; timely = event preview/news, stale after validUntil. */
  shelfLife?: "evergreen" | "timely";
  /** YYYY-MM-DD. For timely pieces: last day the piece is current. */
  validUntil?: string;
  /** Label shown on a current timely piece, e.g. "Event preview · Oct. 9-10". */
  shelfLabel?: string;
  /** Evergreen page to point readers to once a timely piece expires. */
  evergreenHref?: string;
  listed?: boolean;
  photoCredit?: string;
  byline?: string;
  metaDescription?: string;
  mobileHero?: "bg" | "stack" | "text";
  heroPosition?: string;
  heroPositionMobile?: string;
  ogPosition?: number;
  heroCaption?: string;
  heroCaptionHtml?: string;
  facebook?: string;
  parallaxHero?: boolean;
  heroTextBottom?: boolean;
  heroFontSize?: string;
  displayTitle?: boolean;
  cardTextPosition?: "top" | "bottom";
  cardTitle?: string;
  cardTitleHtml?: string;
  cardFont?: "serif" | "serif-bold" | "serif-italic" | "serif-caps" | "condensed";
  cardTitleColor?: "white" | "gold";
  cardFontSize?: "sm" | "md" | "lg";
  cardGradientOffset?: number;
  cardTall?: boolean;
  cardShort?: boolean;
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

/** Slugs that are safe to serve — filtered by `published` and `!aiWritten`. Includes unlisted. */
export function getPublishedSlugs(): string[] {
  return getServableProfiles().map((p) => p.slug);
}

export function getProfileBySlug(slug: string): Profile | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
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

/** All profiles with a live route — published + !aiWritten. Includes listed:false. */
export function getServableProfiles(): Profile[] {
  const slugs = getProfileSlugs();
  return slugs
    .map(getProfileBySlug)
    .filter((p): p is Profile => p !== null && p.frontmatter.published && !p.frontmatter.aiWritten)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Listed profiles — shown in index, sitemap, feeds. Excludes listed:false. */
export function getAllProfiles(): Profile[] {
  return getServableProfiles().filter((p) => p.frontmatter.listed !== false).sort(
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

/** True when a timely piece is past its validUntil date. */
export function isExpired(fm: ProfileFrontmatter): boolean {
  return fm.shelfLife === "timely" && !!fm.validUntil && new Date().toISOString().slice(0, 10) > fm.validUntil;
}

/** Returns all profiles with `featured: true`, sorted by date descending. Expired timely pieces drop out. */
export function getFeaturedProfiles(): Profile[] {
  return getAllProfiles()
    .filter((p) => p.frontmatter.featured && !isExpired(p.frontmatter))
    .sort((a, b) => {
      const oa = a.frontmatter.featuredOrder ?? 999
      const ob = b.frontmatter.featuredOrder ?? 999
      if (oa !== ob) return oa - ob
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })
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
