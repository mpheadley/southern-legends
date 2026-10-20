import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";

export const metadata: Metadata = {
  title: "The Land",
  description: "Farming, gardening, and homesteading stories from Northeast Alabama.",
  alternates: { canonical: "/land" },
  openGraph: { url: "/land" },
};

const LAND_TAGS = ["farming", "farm", "garden", "gardening", "homestead", "homesteading", "agriculture", "land", "flowers", "market"];

export default function LandPage() {
  const profiles = getAllProfiles().filter((p) =>
    p.frontmatter.tags?.some((t: string) => LAND_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter((p) =>
    p.frontmatter.tags?.some((t: string) => LAND_TAGS.includes(t.toLowerCase()))
  );

  return (
    <SectionHub
      kicker="Southern Legends · The Land"
      title="The Land"
      intent="I used to farm here. These are the people who still do: farmers, gardeners, market vendors, and the ones building a life from the ground up."
      profiles={profiles}
      essays={essays}
      cta={{
        heading: "Know a farmer, gardener, or homesteader worth writing about?",
        body: "I'd like to hear about them. A name and a town is enough to start.",
        label: "Nominate someone",
        href: "/nominate",
      }}
      current="/land"
    />
  );
}
