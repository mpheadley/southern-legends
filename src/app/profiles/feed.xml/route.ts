import { getAllProfiles } from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const profiles = getAllProfiles();

  const items = profiles
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.frontmatter.title)}</title>
      <link>${siteConfig.url}/profiles/${p.slug}</link>
      <description>${escapeXml(p.frontmatter.excerpt)}</description>
      <pubDate>${new Date(p.frontmatter.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteConfig.url}/profiles/${p.slug}</guid>
      ${(p.frontmatter.tags ?? []).map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}/profiles</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/profiles/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
