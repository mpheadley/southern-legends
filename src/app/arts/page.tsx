import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";

export const metadata: Metadata = {
  title: "Arts",
  description: "Poetry, music, and theater from the Appalachian foothills of Northeast Alabama.",
  alternates: { canonical: "/arts" },
  openGraph: { url: "/arts" },
};

const ARTS_TAGS = ["poetry", "music", "theater", "arts", "songs", "lyrics", "performance", "theatre"];

export default function ArtsPage() {
  const profiles = getAllProfiles().filter((p) =>
    p.frontmatter.tags?.some((t: string) => ARTS_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter((p) =>
    p.frontmatter.tags?.some((t: string) => ARTS_TAGS.includes(t.toLowerCase()))
  );

  return (
    <SectionHub
      kicker="Southern Legends · Arts"
      title="Arts"
      intent="Poems, songs, and stage work from people who live here. Northeast Alabama has always made things worth hearing."
      profiles={profiles}
      essays={essays}
      subLinks={[
        { label: "Poetry", href: "/arts/poetry" },
        { label: "Music", href: "/arts/music" },
        { label: "Theater", href: "/arts/theater" },
      ]}
      cta={{
        heading: "Make something here?",
        body: "I publish original poems, songs, and theater pieces from Alabama writers and performers. No payment yet, but a real regional audience.",
        label: "Submit your work",
        href: "/nominate",
      }}
      current="/arts"
    />
  );
}
