import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative bg-ll-dark text-white/70 overflow-hidden topo-texture">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {siteConfig.name}
            </p>
            <p className="text-sm mt-1">{siteConfig.tagline}</p>
          </div>

          <nav className="flex gap-6 text-sm">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-ll-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. A community
            project by{" "}
            <a
              href="https://headleyweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-ll-accent transition-colors"
            >
              Headley Web &amp; SEO
            </a>
          </p>
          <p>Northeast Alabama</p>
        </div>
      </div>
    </footer>
  );
}
