import Image from "next/image";
import Link from "next/link";
import ShareButtons from "./ShareButtons";

interface Product {
  url: string;
  image: string;
  name: string;
}

interface ClosingSectionProps {
  shareUrl: string;
  title: string;
  excerpt?: string;
  /** Kept for callers. Merch no longer renders here (redesign B-01: one closing block, one ask). It lives on /merch. */
  primary?: Product;
  secondary?: Product;
  tertiary?: Product;
  podcastUrls?: { spotify?: string; apple?: string; youtube?: string };
}

/**
 * The one closing block at the end of every story and essay (redesign B-01).
 * Byline (hedcut, one sentence) → share row → ONE ask (Support).
 * Comments and related stories sit below it on the page.
 */
export default function ClosingSection({ shareUrl, title, excerpt, podcastUrls }: ClosingSectionProps) {
  return (
    <section className="profile-closing" aria-label="About the author">
      {/* Byline */}
      <div className="profile-closing-author">
        <Image
          src="/images/about/headshot-hedcut-matt-headley.webp"
          alt="Matt Headley"
          width={128}
          height={128}
          className="rounded-full shrink-0"
          style={{ width: "128px", height: "128px" }}
        />
        <div>
          <p className="profile-closing-bio" style={{ fontSize: "1rem" }}>
            <Link href="/about" className="profile-closing-name">
              Matt Headley
            </Link>
            {" "}writes Southern Legends from Northeast Alabama. He lost a farm, kept going, and now sits down with the people here who are still building.
          </p>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            <Link href="/essays" className="profile-closing-link">His own story is in the essays →</Link>
          </p>
        </div>
      </div>

      <div className="profile-closing-divider" />

      {/* Share + the one ask */}
      <div className="profile-closing-share">
        <ShareButtons url={shareUrl} title={title} description={excerpt ?? ""} podcastUrls={podcastUrls} />
        <p className="text-sm text-center mt-6" style={{ color: "rgba(255,255,255,0.75)", maxWidth: "26rem" }}>
          Southern Legends is independent and reader-supported. No paywall, no sponsors deciding who gets written about.
        </p>
        <a
          href="/support"
          className="btn-support inline-block mt-2 px-7 py-3 bg-ll-primary font-bold text-sm rounded-md hover:bg-ll-primary-dark transition-colors"
        >
          Support this work — $5 →
        </a>
      </div>
    </section>
  );
}
