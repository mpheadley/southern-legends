import Link from "next/link";

const SECTIONS = [
  { label: "Stories", href: "/profiles", desc: "People and places of the South" },
  { label: "Places", href: "/places", desc: "Cities and towns across Alabama" },
  { label: "Trails", href: "/trails", desc: "Chief Ladiga, Silver Comet, and NE Alabama trails" },
  { label: "Parks", href: "/parks", desc: "Cheaha, Noccalula, Little River Canyon, and more" },
  { label: "Arts", href: "/arts", desc: "Poetry, music, and theater" },
  { label: "Books", href: "/books", desc: "Literature from and about the South" },
  { label: "Land", href: "/land", desc: "Farming, gardening, and homesteading" },
  { label: "Essays", href: "/essays", desc: "Long-form from Matt Headley" },
  { label: "Theology", href: "/theology", desc: "The shape underneath the work" },
];

interface Props {
  current: string; // href of current section, e.g. "/arts"
  count?: number;  // how many to show (default 4)
}

/** Quiet cross-links row. SL tokens only (no stone/amber, no dark: variants). */
export default function SectionLinks({ current, count = 4 }: Props) {
  const others = SECTIONS.filter((s) => s.href !== current).slice(0, count);

  return (
    <div className="border-t border-ll-border pt-10 mt-16 text-left">
      <p className="text-sm uppercase tracking-widest text-ll-text-light mb-5">Explore Southern Legends</p>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {others.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group border border-ll-border rounded-lg p-4 bg-white/60 hover:border-ll-accent transition"
          >
            <p className="font-semibold text-ll-dark group-hover:text-ll-primary text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              {s.label} →
            </p>
            <p className="text-sm text-ll-text-light">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
