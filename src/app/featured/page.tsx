import type { Metadata } from "next";
import { getFeaturedProfiles } from "@/lib/profiles";
import { siteConfig } from "@/lib/site-config";
import FeaturedTilt from "../components/FeaturedTilt";

export const metadata: Metadata = {
  title: "Featured Stories",
  description:
    "A cinematic showcase of handpicked stories from the Appalachian foothills of Northeast Alabama.",
  alternates: { canonical: "/featured" },
  openGraph: {
    url: "/featured",
    title: `Featured Stories — ${siteConfig.name}`,
    description:
      "A cinematic showcase of handpicked stories from the Appalachian foothills of Northeast Alabama.",
    images: [
      {
        url: "/images/southern-legends-og.png",
        width: 2396,
        height: 1250,
        alt: "Southern Legends — Stories from Northeast Alabama",
      },
    ],
  },
};

export default function FeaturedPage() {
  const profiles = getFeaturedProfiles();

  const cards = profiles.map((p) => ({
    slug: p.slug,
    name: p.frontmatter.name,
    title: p.frontmatter.title,
    excerpt: p.frontmatter.excerpt,
    location: p.frontmatter.location,
    category: p.frontmatter.category,
    heroImage: p.frontmatter.heroImage,
    heroAlt: p.frontmatter.heroAlt,
    heroPosition: p.frontmatter.heroPosition,
  }));

  return (
    <main id="main-content">
      <FeaturedTilt cards={cards} />
    </main>
  );
}
