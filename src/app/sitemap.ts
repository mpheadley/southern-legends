import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllProfiles } from "@/lib/profiles";

export default function sitemap(): MetadataRoute.Sitemap {
  const profiles = getAllProfiles();

  const profileEntries: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `${siteConfig.url}/profiles/${p.slug}`,
    lastModified: p.frontmatter.lastModified ?? p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
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
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...profileEntries,
  ];
}
