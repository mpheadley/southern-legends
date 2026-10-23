import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";
import HubList from "@/app/components/HubList";

export const metadata: Metadata = {
  title: "Theater",
  description: "Stage work, productions, and theater artists from Northeast Alabama and the Southeast.",
  alternates: { canonical: "/arts/theater" },
  openGraph: { url: "/arts/theater" },
};

const THEATER_TAGS = ["theater", "theatre", "stage", "performance", "play", "drama", "musical", "acting", "script"];

const REGIONAL_COMPANIES = [
  { name: "Theatre of Gadsden", city: "Gadsden", url: "https://theatreofgadsden.com", desc: "Community theater in Gadsden. Auditions and productions year-round." },
  { name: "Anniston Community Theater", city: "Anniston", url: "/places/anniston", desc: "Live theater in Calhoun County." },
  { name: "JSU Theater Department", city: "Jacksonville", url: "/places/jacksonville", desc: "Jacksonville State University performing arts program." },
];

export default function TheaterPage() {
  const profiles = getAllProfiles().filter((p) =>
    p.frontmatter.tags?.some((t: string) => THEATER_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter((p) =>
    p.frontmatter.tags?.some((t: string) => THEATER_TAGS.includes(t.toLowerCase()))
  );

  return (
    <SectionHub
      kicker="Arts · Theater"
      title="Theater"
      intent="Community theater, university productions, and working playwrights. The people who put things on stages in small places."
      parent={{ label: "Arts", href: "/arts" }}
      profiles={profiles}
      essays={essays}
      cta={{
        heading: "Know a theater artist worth writing about?",
        body: "Directors, playwrights, actors, set designers, stage managers. Serious work in small places. I want to write about them.",
        label: "Nominate someone",
        href: "/nominate",
      }}
      current="/arts"
    >
      <HubList heading="Regional companies" items={REGIONAL_COMPANIES} />
    </SectionHub>
  );
}
