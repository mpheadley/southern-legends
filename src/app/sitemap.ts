import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import { getBusinessCities, cityToSlug as bizCityToSlug } from "@/lib/businesses";
import { CITIES, cityToSlug as dbCityToSlug } from "@/lib/city-businesses";
import { TRAILS } from "@/lib/trails";
import { getAllParks } from "@/lib/parks";
import { getActivePrograms } from "@/lib/programs";
import { getAllListicles } from "@/lib/listicles";
import { SL_PLACES, cityToSlug as placeCityToSlug } from "@/lib/places";

const CALHOUN_CITIES = ['Anniston', 'Oxford', 'Jacksonville', 'Attalla', 'Rainbow City', 'Alexandria', 'Ohatchee', 'Glencoe', 'Weaver', 'Heflin', 'Piedmont']

export default function sitemap(): MetadataRoute.Sitemap {
  const profiles = getAllProfiles();
  const journalPosts = getAllJournalPosts().filter(p => p.frontmatter.published);

  const profileEntries: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `${siteConfig.url}/profiles/${p.slug}`,
    lastModified: p.frontmatter.lastModified ?? p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = journalPosts.map((p) => ({
    url: `${siteConfig.url}/essays/${p.slug}`,
    lastModified: p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // City pages — all 244 AL cities
  const cityEntries: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${siteConfig.url}/places/${dbCityToSlug(city)}`,
    changeFrequency: "weekly" as const,
    priority: city === "Anniston" ? 0.9 : 0.7,
  }));

  // Businesses — Calhoun County priority cities
  const businessCityEntries: MetadataRoute.Sitemap = CALHOUN_CITIES.map((city) => ({
    url: `${siteConfig.url}/businesses/${bizCityToSlug(city)}`,
    changeFrequency: "weekly" as const,
    priority: city === "Anniston" ? 0.85 : 0.65,
  }));


  const staticPaths = [
    "/affiliate", "/almanac", "/almanac/autumn-2026", "/arts/music", "/arts/poetry", "/arts/theater",
    "/back-forty", "/back-forty/resources", "/books/company-of-farmers", "/books/opinions", "/colophon",
    "/land", "/listen", "/listicles", "/map", "/masthead", "/merch/catalog", "/merch/clt-coin",
    "/merch/freedom-riders", "/merch/pvxc", "/merch/shirts", "/merch/woodstock", "/ministry", "/parks",
    "/places/nominate", "/podcast", "/pricing", "/privacy", "/programs", "/registry", "/sponsor",
    "/theology", "/trails", "/woodstock-5k", "/vol-1",
  ];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const trailEntries: MetadataRoute.Sitemap = TRAILS.map((t) => ({
    url: `${siteConfig.url}/trails/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));
  const parkEntries: MetadataRoute.Sitemap = getAllParks().map((k) => ({
    url: `${siteConfig.url}/parks/${k.slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));
  const programEntries: MetadataRoute.Sitemap = getActivePrograms().map((g) => ({
    url: `${siteConfig.url}/programs/${g.slug}`, changeFrequency: "monthly" as const, priority: 0.6,
  }));
  const listicleEntries: MetadataRoute.Sitemap = getAllListicles().map((l) => ({
    url: `${siteConfig.url}/listicles/${l.slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));
  const placeEntries: MetadataRoute.Sitemap = SL_PLACES.filter((b) => b.featured || b.story).map((b) => ({
    url: `${siteConfig.url}/places/${placeCityToSlug(b.city)}/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.6,
  }));

  return [
    // Core pages
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/profiles`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/essays`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/places`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/businesses`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/businesses/anniston`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/businesses/calhoun-county`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/contributors`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteConfig.url}/arts`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/books`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/land`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/subscribe`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/nominate`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/support`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteConfig.url}/merch`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Rolling events pages: evergreen URLs, content changes daily
    {
      url: `${siteConfig.url}/listicles/anniston-events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/listicles/calhoun-county-events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Content entries
    ...profileEntries,
    ...journalEntries,
    ...cityEntries,
    ...businessCityEntries,
    ...staticEntries,
    ...trailEntries,
    ...parkEntries,
    ...programEntries,
    ...listicleEntries,
    ...placeEntries,
  ];
}
