// Aggregates every geo-taggable SL content type into map markers.
// Businesses have no lat/lon, and profiles/essays carry a `location` string,
// so everything geocodes to a city centroid + deterministic jitter (stable per id).
// The centroid dict is Northeast-Alabama-only on purpose — unknown cities are
// skipped, which keeps the map inside the corpus that is the actual moat.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getServableProfiles } from "@/lib/profiles";
import { localBusinesses, cityToSlug } from "@/lib/city-businesses";
import { getAllListicles } from "@/lib/listicles";
import { TRAILS } from "@/lib/trails";

export type MarkerType =
  | "profile"
  | "business"
  | "essay"
  | "trail"
  | "listicle"
  | "mattnote";

export type FilterBucket =
  | "people"
  | "businesses"
  | "food"
  | "trails"
  | "faith"
  | "outdoors"
  | "other";

export interface MapMarker {
  id: string;
  name: string;
  type: MarkerType;
  filter: FilterBucket;
  lat: number;
  lon: number;
  location: string;
  excerpt: string;
  url: string;
  photo?: string;
  color: string;
}

export interface TrailPath {
  id: string;
  name: string;
  coords: [number, number][]; // [lat, lon]
  url: string;
  color: string;
}

export interface MapData {
  markers: MapMarker[];
  trails: TrailPath[];
}

export const MARKER_COLORS: Record<MarkerType, string> = {
  profile: "#C9A227", // gold
  business: "#2d6a4f", // forest green
  essay: "#e8d9c0", // cream
  trail: "#c0392b", // red
  listicle: "#E8722A", // orange
  mattnote: "#7c9885", // sage
};

// Northeast Alabama centroids. [lat, lon]. Statewide business data is filtered
// to this set automatically — anything outside NE AL never gets a marker.
const CITY_CENTROIDS: Record<string, [number, number]> = {
  anniston: [33.6598, -85.8315],
  jacksonville: [33.8137, -85.761],
  oxford: [33.6148, -85.8346],
  gadsden: [34.0143, -86.0066],
  weaver: [33.749, -85.8127],
  heflin: [33.6487, -85.5902],
  piedmont: [33.9243, -85.6113],
  ohatchee: [33.7776, -85.9924],
  lineville: [33.3087, -85.7527],
  talladega: [33.4351, -86.1044],
  "rainbow city": [33.9543, -86.0428],
  centre: [34.1526, -85.6788],
  wellington: [33.7607, -85.8955],
  munford: [33.5262, -85.9505],
  alexandria: [33.7729, -85.8674],
  glencoe: [33.9548, -85.9333],
  "hokes bluff": [33.9915, -85.8636],
  attalla: [34.0198, -86.0894],
  southside: [33.9098, -86.0247],
  "pell city": [33.5862, -86.286],
  lincoln: [33.6118, -86.1194],
  sylacauga: [33.1732, -86.2516],
  childersburg: [33.2787, -86.3552],
  "sardis city": [34.1748, -86.1108],
  boaz: [34.2001, -86.1663],
  albertville: [34.2676, -86.209],
  guntersville: [34.358, -86.2947],
  fort_payne: [34.4443, -85.7197],
  "fort payne": [34.4443, -85.7197],
  scottsboro: [34.6723, -86.034],
  cedartown: [34.0112, -85.2555],
  ashville: [33.8368, -86.2536],
  steele: [33.9376, -86.1999],
  ragland: [33.7476, -86.1497],
  cropwell: [33.5665, -86.2472],
  eastaboga: [33.6023, -85.9319],
  jacksonville_al: [33.8137, -85.761],
  delta: [33.4351, -85.6708],
  ranburne: [33.5279, -85.3708],
  fruithurst: [33.7248, -85.4341],
  edwardsville: [33.6929, -85.507],
  woodland: [33.3654, -85.3924],
  roanoke: [33.1501, -85.3708],
  gaylesville: [34.2748, -85.5866],
  leesburg: [34.1798, -85.7649],
  collinsville: [34.2637, -85.8613],
  "gallant": [34.014, -86.2113],
  cleburne: [33.6754, -85.5199],
  "cleburne county": [33.6754, -85.5199],
};

function centroidFor(rawCity: string | undefined): [number, number] | null {
  if (!rawCity) return null;
  // location strings look like "Centre, Alabama" — take the part before the comma
  const city = rawCity.split(",")[0].trim().toLowerCase();
  if (CITY_CENTROIDS[city]) return CITY_CENTROIDS[city];
  const slug = city.replace(/\s+/g, "-");
  if (CITY_CENTROIDS[slug]) return CITY_CENTROIDS[slug];
  return null;
}

// Deterministic small offset so co-located markers (many per centroid) spread
// out instead of stacking on one pixel. Stable per id across renders.
function jitter(id: string): [number, number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  const a = ((h % 1000) / 1000 - 0.5) * 0.05; // ~±0.025 deg (~1.7mi)
  const b = (((h >> 10) % 1000) / 1000 - 0.5) * 0.05;
  return [a, b];
}

function place(
  id: string,
  city: string | undefined
): { lat: number; lon: number } | null {
  const c = centroidFor(city);
  if (!c) return null;
  const [ja, jb] = jitter(id);
  return { lat: c[0] + ja, lon: c[1] + jb };
}

function bucketForBusiness(vertical?: string, category?: string): FilterBucket {
  const v = `${vertical ?? ""} ${category ?? ""}`.toLowerCase();
  if (/(church|faith|ministry|worship|chapel|baptist|methodist|catholic)/.test(v))
    return "faith";
  if (/(food|catering|cake|bakery|restaurant|coffee|brew|bbq|deli)/.test(v))
    return "food";
  if (/(trail|park|outdoor|recreation|hik|bike)/.test(v)) return "outdoors";
  return "businesses";
}

// Simplified polylines (a handful of points each) — visually correct routes,
// not survey-grade. USGS/OSM enrichment is a later pass.
const TRAIL_PATHS: Record<string, [number, number][]> = {
  "chief-ladiga-trail": [
    [33.749, -85.8127], // Weaver
    [33.8137, -85.761], // Jacksonville
    [33.8802, -85.7075],
    [33.9243, -85.6113], // Piedmont
    [33.86, -85.42],
    [33.75, -85.38], // GA line (Esom Hill)
  ],
  "silver-comet-trail": [
    [33.75, -85.38], // AL/GA line
    [34.011, -85.2555], // Cedartown
    [33.9, -84.9],
  ],
  "coldwater-mountain": [
    [33.62, -85.87],
    [33.605, -85.855],
    [33.6148, -85.8346], // Oxford
  ],
  "pinhoti-trail": [
    [33.485, -85.81], // Cheaha area
    [33.5262, -85.9505], // Munford
    [33.62, -85.62],
    [33.72, -85.55],
  ],
  "cheaha-state-park-trails": [
    [33.485, -85.808],
    [33.49, -85.82],
    [33.478, -85.83],
  ],
  "oxford-lake-trail": [
    [33.6148, -85.8346],
    [33.62, -85.83],
    [33.618, -85.84],
  ],
  "choccolocco-creek-greenway": [
    [33.6598, -85.8315], // Anniston
    [33.64, -85.83],
    [33.6148, -85.8346], // Oxford
  ],
};

async function readEssayMarkers(): Promise<MapMarker[]> {
  const dir = path.join(process.cwd(), "content", "essays");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const out: MapMarker[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      if (data.published === false || data.listed === false) continue;
      const slug = (data.slug as string) || file.replace(/\.mdx$/, "");
      const pos = place(`essay-${slug}`, data.location as string);
      if (!pos) continue;
      out.push({
        id: `essay-${slug}`,
        name: (data.title as string) || slug,
        type: "essay",
        filter: "people",
        lat: pos.lat,
        lon: pos.lon,
        location: (data.location as string) || "",
        excerpt: (data.excerpt as string) || "",
        url: `/essays/${slug}`,
        photo: (data.heroImage as string) || undefined,
        color: MARKER_COLORS.essay,
      });
    } catch {
      /* skip unreadable */
    }
  }
  return out;
}

export async function getMapData(): Promise<MapData> {
  const markers: MapMarker[] = [];

  // Profiles (people) — gold
  for (const p of getServableProfiles()) {
    if (p.frontmatter.listed === false) continue;
    const pos = place(`profile-${p.slug}`, p.frontmatter.location);
    if (!pos) continue;
    markers.push({
      id: `profile-${p.slug}`,
      name: p.frontmatter.name || p.frontmatter.title,
      type: "profile",
      filter: "people",
      lat: pos.lat,
      lon: pos.lon,
      location: p.frontmatter.location || "",
      excerpt: p.frontmatter.excerpt || p.frontmatter.subtitle || "",
      url: `/profiles/${p.slug}`,
      photo: p.frontmatter.heroImage,
      color: MARKER_COLORS.profile,
    });
  }

  // Businesses (scraped) — forest green. Statewide data auto-filtered to NE AL.
  for (const b of localBusinesses) {
    const pos = place(`business-${b.id}`, b.city);
    if (!pos) continue;
    markers.push({
      id: `business-${b.id}`,
      name: b.name,
      type: "business",
      filter: bucketForBusiness(b.vertical, b.category),
      lat: pos.lat,
      lon: pos.lon,
      location: `${b.city}, AL`,
      excerpt: [b.category, b.vertical].filter(Boolean).join(" · "),
      url: `/places/${cityToSlug(b.city)}`,
      color: MARKER_COLORS.business,
    });
  }

  // Essays — cream
  markers.push(...(await readEssayMarkers()));

  // Listicles / guides — orange
  for (const l of getAllListicles()) {
    const pos = place(`listicle-${l.slug}`, l.city);
    if (!pos) continue;
    markers.push({
      id: `listicle-${l.slug}`,
      name: l.title,
      type: "listicle",
      filter: "businesses",
      lat: pos.lat,
      lon: pos.lon,
      location: l.city || "",
      excerpt: (l.excerpt as string) || "",
      url: `/listicles/${l.slug}`,
      color: MARKER_COLORS.listicle,
    });
  }

  // Trails — red dot at midpoint + polyline
  const trails: TrailPath[] = [];
  for (const t of TRAILS) {
    const coords = TRAIL_PATHS[t.slug];
    if (coords && coords.length) {
      trails.push({
        id: `trail-${t.slug}`,
        name: t.name,
        coords,
        url: `/trails/${t.slug}`,
        color: MARKER_COLORS.trail,
      });
      const mid = coords[Math.floor(coords.length / 2)];
      markers.push({
        id: `trail-${t.slug}`,
        name: t.name,
        type: "trail",
        filter: "trails",
        lat: mid[0],
        lon: mid[1],
        location: "Northeast Alabama",
        excerpt: (t as { description?: string }).description?.slice(0, 140) || "",
        url: `/trails/${t.slug}`,
        color: MARKER_COLORS.trail,
      });
    }
  }

  return { markers, trails };
}
