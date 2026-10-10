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
  primary: Product;
  /** Kept for callers; only `primary` renders now (design audit QW-05: one item, merch lives on /merch). */
  secondary?: Product;
  tertiary?: Product;
  podcastUrls?: { spotify?: string; apple?: string; youtube?: string };
}

export default function ClosingSection({ shareUrl, title, excerpt, primary, podcastUrls }: ClosingSectionProps) {
  return (
    <section className="profile-closing">
      {/* Author credit */}
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
          <p className="profile-closing-bio">
            <Link href="/about" className="profile-closing-name">
              Matt Headley
            </Link>
            {" "}is pastor of Ecclesia Community, a fresh expression of Christian community, a flower farmer in Northeast Alabama, and the author of{" "}
            <Link href="/author" className="profile-closing-link">
              Tend: Before the Wedding
            </Link>
            {" "}and{" "}
            <Link href="/author" className="profile-closing-link">
              God & the Algorithm
            </Link>
            . He is the founder and editor of Southern Legends, the founder of{" "}
            <a href="https://plainspokenblueprint.com" target="_blank" rel="noopener noreferrer" className="profile-closing-link">
              Gather Studio
            </a>
            , a messaging coaching practice for small businesses, and the founder of{" "}
            <a href="https://theaisle.app" target="_blank" rel="noopener noreferrer" className="profile-closing-link">
              The Aisle
            </a>
            , a bridal show in Anniston.
          </p>
          <div className="mt-3">
            <Link
              href="/essays"
              className="btn-journal inline-block px-5 py-2 border-2 border-ll-accent font-bold text-sm rounded-md hover:bg-ll-accent transition-colors"
            >
              Matt also writes about his own story →
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="profile-closing-divider" />

      {/* Share + one merch item + Support */}
      <div className="profile-closing-share">
        <ShareButtons url={shareUrl} title={title} description={excerpt ?? ""} podcastUrls={podcastUrls} />

        <p className="text-sm text-ll-accent text-center mt-8 mb-2" style={{ letterSpacing: "0.05em" }}>
          Purchases support Southern Legends.
        </p>
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <Link href={primary.url}>
              <Image
                src={primary.image}
                alt={primary.name}
                width={140}
                height={140}
                className="rounded hover:opacity-90 transition-opacity"
                unoptimized
              />
            </Link>
            <span className="text-sm text-white/60">{primary.name}</span>
            <Link
              href={primary.url}
              className="inline-block text-sm font-medium text-white border border-white/50 px-4 py-2 hover:bg-white hover:text-ll-dark transition-colors"
            >
              Get the shirt →
            </Link>
          </div>
        </div>

        <a
          href="/support"
          className="btn-support inline-block mt-4 px-7 py-3 bg-ll-primary font-bold text-sm rounded-md hover:bg-ll-primary-dark transition-colors"
        >
          Support this work →
        </a>
      </div>
    </section>
  );
}
