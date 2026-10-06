import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";
import { getProfileBySlug } from "@/lib/profiles";

const frauncesSemiBold = readFileSync(
  path.join(process.cwd(), "src/app/fonts/Fraunces-SemiBold.ttf")
);
const sourceSans = readFileSync(
  path.join(process.cwd(), "src/app/fonts/SourceSans3-Regular.ttf")
);

export const runtime = "nodejs";
export const alt = "Southern Legends profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = "https://southernlegends.org";

const CATEGORY_COLORS: Record<string, string> = {
  craftspeople: "#9A3412",
  food: "#CA8A04",
  music: "#6B4C8A",
  agriculture: "#3D6B4F",
  places: "#3D6B4F",
  people: "#9A3412",
};

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  const fonts = [
    { name: "Fraunces", data: frauncesSemiBold, style: "normal" as const, weight: 600 as const },
    { name: "Source Sans 3", data: sourceSans, style: "normal" as const, weight: 400 as const },
  ];

  // AI-written drafts are not publishable — render the generic fallback rather than an OG card for the draft.
  if (!profile || profile.frontmatter.aiWritten) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#292524",
            color: "#FAFAF7",
            fontSize: 48,
            fontFamily: "Fraunces",
          }}
        >
          Southern Legends
        </div>
      ),
      { ...size, fonts }
    );
  }

  const { title, name, location, heroImage, category, subtitle } = profile.frontmatter;
  const ogPosition = profile.frontmatter.ogPosition ?? 0.35;
  const heroUrl = heroImage ? `${BASE_URL}${heroImage}` : null;
  const categoryColor = CATEGORY_COLORS[(category || "").toLowerCase()] || "#9A3412";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#292524",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Full-bleed hero image */}
        {heroUrl && (
          <img
            src={heroUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `center ${(ogPosition * 100).toFixed(0)}%`,
            }}
          />
        )}

        {/* Bottom gradient for text readability */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "75%",
            background: "linear-gradient(to top, rgba(41,37,36,0.97) 0%, rgba(41,37,36,0.7) 40%, transparent 100%)",
          }}
        />

        {/* Side vignette */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, rgba(41,37,36,0.3) 0%, transparent 40%)",
          }}
        />

        {/* Top-right: site name */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 40,
            right: 56,
            fontFamily: "Source Sans 3",
            fontSize: 18,
            color: "#FAFAF7",
            opacity: 0.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          southernlegends.org
        </div>

        {/* Bottom-left: content block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            bottom: 56,
            left: 64,
            maxWidth: 720,
          }}
        >
          {/* Category tag */}
          <div
            style={{
              display: "flex",
              backgroundColor: categoryColor,
              color: "#FAFAF7",
              fontSize: 14,
              fontFamily: "Source Sans 3",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 14px",
              borderRadius: 3,
              marginBottom: 20,
              width: "fit-content",
            }}
          >
            {category}
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: title.length > 35 ? 64 : title.length > 22 ? 76 : 88,
              fontWeight: 600,
              color: "#FAFAF7",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontFamily: "Fraunces",
                fontSize: 26,

                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.4,
                marginBottom: 20,
                maxWidth: 640,
              }}
            >
              {subtitle.length > 80 ? subtitle.slice(0, 80) + "…" : subtitle}
            </div>
          )}

          {/* Name · Location */}
          <div
            style={{
              display: "flex",
              fontFamily: "Source Sans 3",
              fontSize: 18,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {name}&nbsp;&nbsp;·&nbsp;&nbsp;{location}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
