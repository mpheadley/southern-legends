import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getWideMerch } from "@/lib/merch";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const slMerch = getWideMerch(3)
  return (
    <main id="main-content">
      <section className="relative text-white overflow-hidden gradient-hero">
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
            This page doesn&apos;t exist. But there are plenty of stories worth
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

      {slMerch.length > 0 && (
        <section style={{ background: "#1a1208", borderTop: "1px solid rgba(154,108,47,0.12)" }}>
          <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a6c2f", marginBottom: "0.4rem", textAlign: "center" }}>While you&apos;re here</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "#F0EDE6", fontWeight: 400, marginBottom: "1.25rem", textAlign: "center" }}>Southern Legends merch</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
              {slMerch.map((item) => (
                <a key={item.id} href={`/merch#${item.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: "5px", overflow: "hidden", background: "#2a1e10" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.photo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", color: "#F0EDE6", lineHeight: 1.2 }}>{item.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(240,237,230,0.5)" }}>${item.price}</p>
                </a>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <a href="/merch" style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#c4974a", fontWeight: 600, textDecoration: "none" }}>See all Southern Legends merch →</a>
            </div>
          </div>
        </section>
      )}

      {/* Iris easter egg */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes iris-in  { from { opacity:0; transform:translateY(16px) scale(0.85); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes iris-out { from { opacity:1; } to { opacity:0; } }
        #iris-egg { position:fixed; bottom:20px; right:20px; width:88px; height:auto;
          image-rendering:pixelated; opacity:0; pointer-events:none; z-index:9999; }
        #iris-egg.show { animation: iris-in 0.5s ease forwards; }
        #iris-egg.hide { animation: iris-out 0.7s ease forwards; }
      `}} />
      <img id="iris-egg" alt="" aria-hidden="true" />
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var el = document.getElementById('iris-egg');
          if(!el) return;
          // Load the gif only once a real 404 renders (keeps it out of prefetch/preload)
          setTimeout(function(){ el.src = '/images/iris-cat-jump.gif'; }, 2500);
          setTimeout(function(){ el.classList.add('show'); }, 3000);
          setTimeout(function(){ el.classList.add('hide'); }, 9500);
          setTimeout(function(){ el.style.display='none'; }, 10300);
        })();
      `}} />
    </main>
  );
}
