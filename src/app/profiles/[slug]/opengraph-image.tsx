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

  const { title, name, location, heroImage } = profile.frontmatter;

  let heroSrc: string | null = null;
  if (heroImage) {
    try {
      const imagePath = join(process.cwd(), "public", heroImage);
      const buffer = readFileSync(imagePath);
      const meta = await sharp(buffer).metadata();
      const srcW = meta.width || 1200;
      const srcH = meta.height || 630;
      const scale = Math.max(1200 / srcW, 630 / srcH);
      const scaledW = Math.round(srcW * scale);
      const scaledH = Math.round(srcH * scale);
      const topOffset = Math.round((scaledH - 630) * 0.35);
      const leftOffset = Math.round((scaledW - 1200) / 2);
      const pngBuffer = await sharp(buffer)
        .resize(scaledW, scaledH)
        .extract({ left: leftOffset, top: topOffset, width: 1200, height: 630 })
        .png({ quality: 80 })
        .toBuffer();
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

        {/* Side gradients — dark edges like homepage hero */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, rgba(41,37,36,0.5) 0%, transparent 30%, transparent 70%, rgba(41,37,36,0.5) 100%)",
          }}
        />

        {/* Topo texture overlay */}
        <img
          src={`data:image/png;base64,${readFileSync(join(process.cwd(), "public/topo-7.png")).toString("base64")}`}
          alt=""
          width={500}
          height={500}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
          }}
        />


        {/* Top bar — solid dark, like the site nav */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 80,
            backgroundColor: "#292524",
            padding: "0 60px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Fraunces",
              fontSize: 28,
              fontWeight: 600,
              color: "#FAFAF7",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            Southern Legends
          </span>

          <span
            style={{
              fontFamily: "Source Sans 3",
              fontSize: 24,
              color: "#FAFAF7",
              opacity: 0.7,
            }}
          >
            By Matt Headley · {location}
          </span>
        </div>

        {/* Title overlay — centered on image below bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 80,
            left: 0,
            width: "100%",
            height: 550,
            padding: "48px 60px",
          }}
        >
          {/* Decorative rule above title */}
          <div
            style={{
              display: "flex",
              width: 80,
              height: 3,
              backgroundColor: "#CA8A04",
              marginBottom: 28,
            }}
          />

          {/* Profile title */}
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: title.length > 40 ? 72 : title.length > 25 ? 84 : 96,
              fontWeight: 600,
              color: "#FAFAF7",
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: 1000,
              justifyContent: "center",
              textShadow: "0 3px 12px rgba(0,0,0,0.8)",
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
                fontSize: 36,
                fontWeight: 400,
                color: "#CA8A04",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                marginTop: 24,
                textShadow: "0 2px 8px rgba(0,0,0,0.7)",
              }}
            >
              {name}
            </div>
          )}
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
