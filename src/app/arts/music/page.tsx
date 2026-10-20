import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";
import HubList from "@/app/components/HubList";

export const metadata: Metadata = {
  title: "Music",
  description: "Songs, musicians, and the regional music scene from Northeast Alabama.",
  alternates: { canonical: "/arts/music" },
  openGraph: { url: "/arts/music" },
};

const MUSIC_TAGS = ["music", "songs", "musician", "band", "guitar", "singing", "songwriter", "studio", "recording"];

const REGIONAL_VENUES = [
  { name: "Studio 104", city: "Anniston", url: "https://studio104.gatherstudio.app", desc: "Recording studio in Anniston." },
  { name: "Gadsden Arts Center", city: "Gadsden", url: "/places/gadsden", desc: "Arts venue and performance space." },
];

export default function MusicPage() {
  const profiles = getAllProfiles().filter((p) =>
    p.frontmatter.tags?.some((t: string) => MUSIC_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter((p) =>
    p.frontmatter.tags?.some((t: string) => MUSIC_TAGS.includes(t.toLowerCase()))
  );

  return (
    <SectionHub
      kicker="Arts · Music"
      title="Music"
      intent="The musicians, venues, and sounds of the foothills. A music tradition that gets overlooked."
      parent={{ label: "Arts", href: "/arts" }}
      profiles={profiles}
      essays={essays}
      cta={{
        heading: "Are you a regional musician?",
        body: "I'm building a directory of Northeast Alabama musicians, bands, and studios. Tell me who belongs here.",
        label: "Nominate a musician",
        href: "/nominate",
      }}
      current="/arts"
    >
      <HubList heading="Where music happens here" items={REGIONAL_VENUES} />
    </SectionHub>
  );
}
