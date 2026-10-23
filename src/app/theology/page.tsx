import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";

export const metadata: Metadata = {
  title: "Theology",
  description:
    "Essays on the shape underneath the work — Trinity, perichoresis, formation, and faith held honestly by a former United Methodist pastor in Northeast Alabama.",
  alternates: { canonical: "/theology" },
  openGraph: { url: "/theology" },
};

// A piece belongs to Theology if it declares the category or carries a theology tag.
const THEOLOGY_TAGS = [
  "theology",
  "trinity",
  "perichoresis",
  "kenosis",
  "triskelion",
  "formation",
  "spiritual direction",
];

function isTheology(fm: { category?: string; tags?: string[] }): boolean {
  if (fm.category?.toLowerCase() === "theology") return true;
  return !!fm.tags?.some((t) => THEOLOGY_TAGS.includes(t.toLowerCase()));
}

export default function TheologyPage() {
  const essays = getAllJournalPosts().filter((p) => isTheology(p.frontmatter));
  const profiles = getAllProfiles().filter((p) => isTheology(p.frontmatter));

  return (
    <SectionHub
      kicker="Southern Legends · Theology"
      title="The Shape Underneath"
      intent="I spent twenty years as a United Methodist pastor. These are the essays where the theology comes to the surface, with room left for doubt and the dark."
      profiles={profiles}
      essays={essays}
      cta={{
        heading: "Want these in your inbox?",
        body: "New essays go out by email first, a few times a month. No spam.",
        label: "Subscribe",
        href: "/subscribe",
      }}
      current="/theology"
    />
  );
}
