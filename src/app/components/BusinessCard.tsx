"use client";

import Image from "next/image";
import { useState } from "react";
import { Star } from "lucide-react";

export interface GuideBusiness {
  name: string;
  city: string;
  zip?: string;
  tel?: string;
  web?: string;
  image?: string;
  photos?: string[];
  quote?: string;
  quoteAttrib?: string;
  badge?: string;
  profile?: string;
  aisleUrl?: string;
  registryUrl?: string;
}

function telHref(t: string) {
  return "tel:" + t.replace(/[^0-9]/g, "");
}

export function BusinessCard({ b, index }: { b: GuideBusiness; index: number }) {
  const allPhotos = [
    ...(b.image ? [b.image] : []),
    ...(b.photos || []).filter((p) => p !== b.image),
  ];
  const [active, setActive] = useState(0);
  const hasPhoto = allPhotos.length > 0;
  const hasMultiple = allPhotos.length > 1;

  return (
    <div style={{
      display: "flex", flexDirection: "column", background: "#fff",
      border: b.badge ? "2px solid var(--color-ll-accent-dark)" : "1px solid rgba(154,108,47,0.15)", borderRadius: "12px",
      overflow: "hidden",
    }}>
      {/* Aisle vendor badge */}
      {b.badge && (
        <div style={{ background: "var(--color-ll-accent-dark)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.35rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Star size={16} aria-hidden="true" fill="currentColor" /> {b.badge}
        </div>
      )}
      {/* Photo / Carousel */}
      {hasPhoto && (
        <div style={{ position: "relative", width: "100%", height: "220px", background: "#f0ede6" }}>
          <Image
            src={allPhotos[active]}
            alt={b.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 700px"
          />
          {/* gradient overlay bottom */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(26,18,8,0.55) 100%)" }} />
          {/* Number badge */}
          <div style={{
            position: "absolute", top: "0.75rem", left: "0.75rem",
            background: "rgba(26,18,8,0.65)", color: "#f0ede6",
            fontFamily: "var(--font-heading)", fontSize: "0.9rem",
            padding: "0.2rem 0.65rem", borderRadius: "4px", backdropFilter: "blur(4px)",
          }}>
            #{index + 1}
          </div>
          {/* Carousel arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={() => setActive((a) => (a - 1 + allPhotos.length) % allPhotos.length)}
                style={{
                  position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(26,18,8,0.55)", color: "#fff", border: "none",
                  borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer",
                  fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Previous photo"
              >‹</button>
              <button
                onClick={() => setActive((a) => (a + 1) % allPhotos.length)}
                style={{
                  position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(26,18,8,0.55)", color: "#fff", border: "none",
                  borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer",
                  fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Next photo"
              >›</button>
              {/* Dots */}
              <div style={{ position: "absolute", bottom: "0.6rem", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "0.35rem" }}>
                {allPhotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    style={{
                      width: i === active ? "1.4rem" : "0.45rem", height: "0.45rem",
                      borderRadius: "99px", border: "none", cursor: "pointer",
                      background: i === active ? "#f0ede6" : "rgba(240,237,230,0.5)",
                      transition: "all 0.2s",
                    }}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "1rem 1.25rem 1.1rem" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 400, color: "var(--color-ll-dark)", lineHeight: 1.2, margin: "0 0 0.15rem" }}>
          {b.web
            ? <a href={b.web} target="_blank" rel="noopener" style={{ color: "var(--color-ll-dark)", textDecoration: "none" }}>{b.name}</a>
            : b.name}
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--color-ll-text)", margin: "0 0 0.7rem" }}>
          {b.city}{b.zip ? ` · ${b.zip}` : ""}
        </p>

        {/* Pull quote */}
        {b.quote && (
          <blockquote style={{
            margin: "0 0 0.85rem",
            padding: "0.65rem 0.85rem",
            borderLeft: "3px solid var(--color-ll-accent-dark)",
            background: "#f9f5ef",
            borderRadius: "0 6px 6px 0",
          }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontStyle: "italic", color: "#2c1f0e", lineHeight: 1.45, margin: 0 }}>
              "{b.quote}"
            </p>
            {b.quoteAttrib && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-label)", color: "var(--color-ll-accent-dark)", marginTop: "0.35rem", marginBottom: 0 }}>
                — {b.quoteAttrib}
              </p>
            )}
          </blockquote>
        )}

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {b.tel && (
            <a href={telHref(b.tel)} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", fontWeight: 600, color: "var(--color-ll-accent-dark)", background: "#F0EDE6", padding: "0.3rem 0.7rem", borderRadius: "5px", textDecoration: "none" }}>
              {b.tel}
            </a>
          )}
          {b.web && (
            <a href={b.web} target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", fontWeight: 600, color: "#F0EDE6", background: "var(--color-ll-accent-dark)", padding: "0.3rem 0.8rem", borderRadius: "5px", textDecoration: "none" }}>
              Visit site →
            </a>
          )}
          {b.aisleUrl && (
            <a href={b.aisleUrl} target="_blank" rel="noopener" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", fontWeight: 600, color: "var(--color-ll-accent-dark)", background: "#fff5e6", border: "1px solid var(--color-ll-accent-dark)", padding: "0.3rem 0.8rem", borderRadius: "5px", textDecoration: "none" }}>
              See at The Aisle →
            </a>
          )}
        </div>
        {(b.profile || b.registryUrl) && (
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {b.profile && (
              <a href={b.profile} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "var(--color-ll-accent-dark)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                Read their story →
              </a>
            )}
            {b.registryUrl && (
              <a href={b.registryUrl} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-meta)", color: "var(--color-ll-text)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                Add to registry →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
