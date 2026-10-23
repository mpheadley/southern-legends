import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/profiles";
import { getAllJournalPosts } from "@/lib/journal";
import SectionHub from "@/app/components/SectionHub";

export const metadata: Metadata = {
  title: "Poetry",
  description: "Original poetry from Alabama writers and the Appalachian foothills.",
  alternates: { canonical: "/arts/poetry" },
  openGraph: { url: "/arts/poetry" },
};

const POETRY_TAGS = ["poetry", "poem", "poems", "verse", "lyric", "lyrics"];

export default function PoetryPage() {
  const profiles = getAllProfiles().filter((p) =>
    p.frontmatter.tags?.some((t: string) => POETRY_TAGS.includes(t.toLowerCase()))
  );
  const essays = getAllJournalPosts().filter((p) =>
    p.frontmatter.tags?.some((t: string) => POETRY_TAGS.includes(t.toLowerCase()))
  );

  return (
    <SectionHub
      kicker="Arts · Poetry"
      title="Poetry"
      intent="Poems that know where they live. Original work from Alabama writers and the foothills."
      parent={{ label: "Arts", href: "/arts" }}
      profiles={profiles}
      essays={essays}
      cta={{
        heading: "Write poems?",
        body: "I'm inviting Alabama poets to submit original work. No payment yet, but a real audience that reads to the end.",
        label: "Submit a poem",
        href: "/nominate",
      }}
      current="/arts"
    />
  );
}
