import { ImageResponse } from "next/og";
import { getProfileBySlug, getProfileSlugs } from "@/lib/profiles";
import { readFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

export const runtime = "nodejs";
export const alt = "Southern Legends profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const frauncesSemiBold = readFileSync(
  join(process.cwd(), "src/app/fonts/Fraunces-SemiBold.ttf")
);
const sourceSans = readFileSync(
  join(process.cwd(), "src/app/fonts/SourceSans3-Regular.ttf")
);

export function generateStaticParams() {
  return getProfileSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  if (!profile) {
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
      { ...size }
    );
  }

  const { title, name, location, category, heroImage } = profile.frontmatter;

  let heroSrc: string | null = null;
  if (heroImage) {
    try {
      const imagePath = join(process.cwd(), "public", heroImage);
      const buffer = readFileSync(imagePath);
      const pngBuffer = await sharp(buffer).resize(1200, 630, { fit: "cover" }).png({ quality: 80 }).toBuffer();
      heroSrc = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    } catch {
      heroSrc = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#292524",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hero image background */}
        {heroSrc && (
          <img
            src={heroSrc}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to top, rgba(41,37,36,0.95) 0%, rgba(41,37,36,0.7) 40%, rgba(41,37,36,0.4) 100%)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "48px 60px",
            position: "relative",
          }}
        >
          {/* Top: Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Fraunces",
                fontSize: 32,
                fontWeight: 600,
                color: "#FAFAF7",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                opacity: 0.8,
              }}
            >
              Southern Legends
            </span>
          </div>

          {/* Center: Title + Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            {/* Decorative rule above title */}
            <div
              style={{
                display: "flex",
                width: 60,
                height: 2,
                backgroundColor: "#CA8A04",
                marginBottom: 28,
              }}
            />

            {/* Profile title */}
            <div
              style={{
                display: "flex",
                fontFamily: "Fraunces",
                fontSize: title.length > 40 ? 56 : title.length > 25 ? 68 : 76,
                fontWeight: 600,
                color: "#FAFAF7",
                textAlign: "center",
                lineHeight: 1.15,
                maxWidth: 1000,
                justifyContent: "center",
              }}
            >
              {title}
            </div>

            {/* Business/place name */}
            {name && name !== title && (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Source Sans 3",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "#CA8A04",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  marginTop: 20,
                }}
              >
                {name}
              </div>
            )}
          </div>

          {/* Bottom: Location + Category */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: "Source Sans 3",
                fontSize: 22,
                color: "#FAFAF7",
                opacity: 0.6,
              }}
            >
              By Matt Headley · {location}
            </span>

            {category && (
              <span
                style={{
                  fontFamily: "Source Sans 3",
                  fontSize: 20,
                  color: "#CA8A04",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  opacity: 0.8,
                }}
              >
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: frauncesSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Source Sans 3",
          data: sourceSans,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
