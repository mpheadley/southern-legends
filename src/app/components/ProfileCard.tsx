"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import type { Profile } from "@/lib/profiles";
import { resolveCardTitle } from "@/lib/card-title-style";

export default function ProfileCard({ profile }: { profile: Profile }) {
  const { slug, frontmatter } = profile;
  const { name, location, heroImage, heroAlt, heroPosition, category } = frontmatter;

  const { displayTitle, resolvedHtml, useHtml, titleStyle } = resolveCardTitle(frontmatter, {
    containerPx: 300,
    opsz: 72,
    extraStyle: { lineHeight: "1.05", overflowWrap: "normal" },
  });

  return (
    <Link
      href={`/profiles/${slug}`}
      className="group block profile-card relative overflow-hidden"
      style={{ viewTransitionName: `profile-hero-${slug}` } as React.CSSProperties}
    >
      {/* Image */}
      <div className="aspect-[3/2] relative bg-ll-warm">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroAlt || name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={heroPosition ? { objectPosition: heroPosition } : undefined}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ll-dark">
            <span className="text-4xl font-bold text-white/30" style={{ fontFamily: "var(--font-heading)" }}>
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(20,16,14,0.92) 0%, rgba(20,16,14,0.5) 45%, rgba(20,16,14,0.05) 75%, transparent 100%)",
          }}
        />

        {/* Category tag — top left */}
        <span
          className="absolute top-3 left-3 category-tag z-10"
          style={{ fontSize: "var(--text-label)" }}
        >
          {category}
        </span>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex flex-col gap-1">
          {useHtml ? (
            <h3
              style={titleStyle}
              dangerouslySetInnerHTML={{ __html: resolvedHtml! }}
            />
          ) : (
            <h3 style={titleStyle}>{displayTitle}</h3>
          )}
          <p style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "var(--text-meta)",
            color: "rgba(250,250,247,0.65)",
            lineHeight: 1.3,
          }}>
            {name}&nbsp;&nbsp;·&nbsp;&nbsp;{location}
          </p>
        </div>
      </div>
    </Link>
  );
}
