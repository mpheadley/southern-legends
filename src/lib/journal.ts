import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content/journal");

export interface JournalFrontmatter {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  published: boolean;
  image?: string;
  imageAlt?: string;
  originalPublication?: {
    name: string;
    url: string;
    date: string;
  };
}

export interface JournalPost {
  slug: string;
  frontmatter: JournalFrontmatter;
  content: string;
  readingTime: string;
}

export function getJournalSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getJournalPostBySlug(slug: string): JournalPost | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as JournalFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllJournalPosts(): JournalPost[] {
  return getJournalSlugs()
    .map(getJournalPostBySlug)
    .filter((p): p is JournalPost => p !== null && p.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}
