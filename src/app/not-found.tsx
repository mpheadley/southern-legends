import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content">
      <section className="relative bg-ll-dark text-white overflow-hidden topo-texture">
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
          <p
            className="text-8xl md:text-9xl font-bold opacity-20"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-hidden="true"
          >
            404
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold mt-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Wrong trail, friend.
          </h1>
          <p className="text-white/70 mt-4 text-lg max-w-md mx-auto">
            This page doesn&apos;t exist — but there are plenty of stories worth
            finding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/"
              className="inline-block bg-ll-primary text-white px-6 py-3 rounded font-semibold hover:bg-ll-primary/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/profiles"
              className="inline-block border border-white/30 text-white px-6 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
