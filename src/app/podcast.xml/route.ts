import { getAllJournalPosts } from "@/lib/journal";
import { getAllProfiles } from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";

const SITE_URL = siteConfig.url;
const PODCAST_TITLE = "Southern Legends";
const PODCAST_DESCRIPTION =
  "Stories, essays, and dispatches from Northeast Alabama — on faith, community, small business, and what it means to build a life in a place people overlook.";
const PODCAST_AUTHOR = "Matt Headley";
const PODCAST_EMAIL = "matt@gatherstudio.app";
const PODCAST_COVER = `${SITE_URL}/images/podcast-cover.jpg`;
const PODCAST_LANGUAGE = "en-us";
const PODCAST_CATEGORY = "Society &amp; Culture";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfcDate(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET() {
  const journals = getAllJournalPosts().filter(
    (p) => p.frontmatter.audioUrl
  );
  const profiles = getAllProfiles().filter(
    (p) => (p.frontmatter as unknown as { audioUrl?: string }).audioUrl
  );

  type Episode = {
    title: string;
    description: string;
    url: string;
    mediaUrl: string;
    mediaType: "audio/mpeg";
    mediaSize: number;
    date: string;
    duration?: string;
  };

  const episodes: Episode[] = [
    ...journals.map((p) => {
      const fm = p.frontmatter as unknown as { audioUrl?: string; audioDuration?: string; description?: string; mediaSize?: number };
      return {
        title: p.frontmatter.title,
        description: fm.description ?? p.frontmatter.excerpt ?? p.frontmatter.subtitle ?? "",
        url: `${SITE_URL}/essays/${p.slug}`,
        mediaUrl: fm.audioUrl!,
        mediaType: "audio/mpeg" as const,
        mediaSize: fm.mediaSize ?? 0,
        date: p.frontmatter.date,
        duration: fm.audioDuration,
      };
    }),
    ...profiles.map((p) => {
      const fm = p.frontmatter as unknown as { audioUrl?: string; audioDuration?: string; description?: string; mediaSize?: number };
      return {
        title: p.frontmatter.title,
        description: fm.description ?? p.frontmatter.excerpt ?? p.frontmatter.subtitle ?? "",
        url: `${SITE_URL}/profiles/${p.slug}`,
        mediaUrl: fm.audioUrl!,
        mediaType: "audio/mpeg" as const,
        mediaSize: fm.mediaSize ?? 0,
        date: p.frontmatter.date,
        duration: fm.audioDuration,
      };
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = episodes
    .map(
      (ep) => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description)}</description>
      <link>${ep.url}</link>
      <guid isPermaLink="true">${ep.url}</guid>
      <pubDate>${rfcDate(ep.date)}</pubDate>
      <enclosure url="${ep.mediaUrl}" type="${ep.mediaType}" length="${ep.mediaSize}" />
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>
      <itunes:author>${PODCAST_AUTHOR}</itunes:author>
      ${ep.duration ? `<itunes:duration>${ep.duration}</itunes:duration>` : ""}
      <itunes:explicit>false</itunes:explicit>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(PODCAST_TITLE)}</title>
    <link>${SITE_URL}</link>
    <language>${PODCAST_LANGUAGE}</language>
    <description>${escapeXml(PODCAST_DESCRIPTION)}</description>
    <atom:link href="${SITE_URL}/podcast.xml" rel="self" type="application/rss+xml" />
    <itunes:author>${PODCAST_AUTHOR}</itunes:author>
    <itunes:owner>
      <itunes:name>${PODCAST_AUTHOR}</itunes:name>
      <itunes:email>${PODCAST_EMAIL}</itunes:email>
    </itunes:owner>
    <itunes:image href="${PODCAST_COVER}" />
    <image>
      <url>${PODCAST_COVER}</url>
      <title>${escapeXml(PODCAST_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
    <itunes:category text="${PODCAST_CATEGORY}" />
    <itunes:explicit>false</itunes:explicit>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
