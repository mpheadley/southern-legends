import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content/listicles");

export interface GuideBusiness {
  name: string;
  city: string;
  zip?: string;
  tel?: string;
  web?: string;
  image?: string;
  photos?: string[];
  quote?: string;
  quoteAttrib?: string;
  badge?: string;       // e.g. "Featured at The Aisle · Oct 18"
  profile?: string;     // SL profile URL, e.g. /profiles/rons-goode-bbq
  aisleUrl?: string;    // theaisle.app vendor or expo URL
  registryUrl?: string; // Gather Registry link
}

export interface GuideEvent {
  name: string;
  date: string;
  location: string;
  distances?: string;
  category?: string;
  web?: string;
  image?: string;
  description: string;
  vendor?: string;
  section?: string;
}

export interface Listicle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  city: string;
  category?: string;
  image?: string;
  /** Pin to the top of guide lists. */
  featured?: boolean;
  intro?: string;
  businesses: GuideBusiness[];
  events?: GuideEvent[];
  itemlist?: string; // JSON-LD ItemList string
  /** Rolling events page: render upcoming events from content/data/events.json. */
  eventsFeed?: { city?: string; county?: string; category?: string };
  shelfLife?: "evergreen" | "timely";
  content: string; // legacy MDX body (empty for card-format guides)
}

/** Home-market cities shown first on guide lists. */
export const ANCHOR_GUIDE_CITIES = ["Anniston", "Calhoun County"];

/** Only keep a local /images path when the file is actually on disk (audit C-04:
 *  99 of 132 frontmatter image paths were missing, rendering broken cards). */
function verifiedImage(src: unknown): string | undefined {
  if (typeof src !== "string" || !src) return undefined;
  if (!src.startsWith("/")) return src;
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : undefined;
}

/** Real SL photography only (redesign B-05). The per-category files under
 *  /images/listicles and /images/guides are stock or generated and not of the
 *  place in question, so generic guides render a photo-free header instead. */
const REAL_PHOTO_PREFIXES = ["/images/profiles/", "/images/journal/", "/images/locations/", "/images/businesses/"];
function realPhoto(src: string | undefined): string | undefined {
  if (!src) return undefined;
  return REAL_PHOTO_PREFIXES.some((p) => src.startsWith(p)) ? src : undefined;
}

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveCity(slug: string): string {
  const m = slug.match(/-in-(.+)$/);
  return m ? titleCase(m[1]) : "";
}

export function getListicleSlugs(): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getListicle(slug: string): Listicle | null {
  const fp = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fp)) return null;
  const { data, content } = matter(fs.readFileSync(fp, "utf8"));
  return {
    slug,
    title: (data.title as string) ?? titleCase(slug),
    date: (data.date as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    city: (data.place as string) || deriveCity(slug),
    category: data.category as string | undefined,
    image: realPhoto(verifiedImage(data.image)),
    featured: data.featured === true,
    intro: data.intro as string | undefined,
    businesses: (data.businesses as GuideBusiness[]) ?? [],
    events: data.events as GuideEvent[] | undefined,
    itemlist: data.itemlist as string | undefined,
    eventsFeed: data.eventsFeed as Listicle["eventsFeed"],
    shelfLife: data.shelfLife as Listicle["shelfLife"],
    content: content.replace(/^\s*import .*$/gm, "").trim(),
  };
}

export function getAllListicles(): Listicle[] {
  return getListicleSlugs()
    .map(getListicle)
    .filter((l): l is Listicle => l !== null)
    .sort((a, b) => {
      // featured first, then home-market cities, then newest
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      const aa = ANCHOR_GUIDE_CITIES.includes(a.city), ba = ANCHOR_GUIDE_CITIES.includes(b.city);
      if (aa !== ba) return aa ? -1 : 1;
      const d = (b.date || "").localeCompare(a.date || "");
      return d !== 0 ? d : a.title.localeCompare(b.title);
    });
}

export function getListiclesByCity(city: string): Listicle[] {
  const key = city.toLowerCase();
  const keySlug = key.replace(/\s+/g, "-");
  return getAllListicles().filter(
    (l) => l.city.toLowerCase() === key || l.tags.some((t) => t.toLowerCase() === keySlug)
  );
}
