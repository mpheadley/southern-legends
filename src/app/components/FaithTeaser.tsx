// FaithTeaser — the "From the essays" card's sibling on the homepage, pointing at the latest
// weekly faith column. Same glass-card style, so the two sit as equal doors into Matt's writing.
// Read-only use of src/lib/faith.ts: only existing fields (columns, headshot, title, date,
// pullQuote, card, slug). Returns null when there's nothing published yet.
import Image from "next/image";
import Link from "next/link";
import { getFaithData, formatFaithDate, type FaithColumn } from "@/lib/faith";
import { plain } from "@/app/faith/FaithText";

export default async function FaithTeaser() {
  const { columns, headshot } = await getFaithData();
  if (columns.length === 0) return null;

  // getFaithData() already sorts newest first.
  const latest: FaithColumn = columns[0];
  const image = latest.card ?? headshot;
  const quote = plain(latest.pullQuote);

  return (
    <div
      className="rounded-xl flex items-center gap-0 overflow-hidden"
      style={{
        background: "rgba(250,250,247,0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(250,250,247,0.2)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {image && (
        <Link
          href={`/faith/${latest.slug}`}
          className="group relative shrink-0 self-stretch overflow-hidden"
          style={{ width: "9rem" }}
          aria-hidden="true"
          tabIndex={-1}
        >
          <Image
            src={image.src}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ objectPosition: "center top" }}
            sizes="144px"
          />
        </Link>
      )}
      <Link href={`/faith/${latest.slug}`} className="flex-1 min-w-0 px-5 py-4 hover:opacity-80 transition-opacity">
        <p
          className="text-sm uppercase tracking-widest mb-1"
          style={{ color: "rgba(250,220,150,0.9)", fontFamily: "var(--font-heading)", fontWeight: 600 }}
        >
          Faith column · The Anniston Star
        </p>
        <h2
          className="text-lg md:text-xl leading-snug mb-1"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontStyle: "italic", color: "#FAFAF7" }}
        >
          {latest.title}
        </h2>
        {quote && (
          <p
            className="text-sm line-clamp-2"
            style={{ fontFamily: "var(--font-body)", color: "rgba(250,250,247,0.65)", lineHeight: 1.55 }}
          >
            “{quote}”{latest.pullQuoteBy ? ` — ${latest.pullQuoteBy}` : ""}
          </p>
        )}
        <p
          className="text-xs mt-1"
          style={{ fontFamily: "var(--font-body)", color: "rgba(250,250,247,0.5)" }}
        >
          {formatFaithDate(latest.date)} · Weekly
        </p>
      </Link>
    </div>
  );
}
