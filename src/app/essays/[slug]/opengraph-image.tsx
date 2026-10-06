import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";
import { getJournalPostBySlug } from "@/lib/journal";

const frauncesSemiBold = readFileSync(
  path.join(process.cwd(), "src/app/fonts/Fraunces-SemiBold.ttf")
);
const sourceSans = readFileSync(
  path.join(process.cwd(), "src/app/fonts/SourceSans3-Regular.ttf")
);

export const runtime = "nodejs";
export const revalidate = 0;
export const alt = "Southern Legends journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = "https://southernlegends.org";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);

  const fonts = [
    { name: "Fraunces", data: frauncesSemiBold, style: "normal" as const, weight: 600 as const },
    { name: "Source Sans 3", data: sourceSans, style: "normal" as const, weight: 400 as const },
  ];

  if (!post) {
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

  const { title, image } = post.frontmatter;
  const heroUrl = image
    ? `${BASE_URL}${image}`
    : `${BASE_URL}/images/essays/${slug}-hero.webp`;

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
        <img
          src={heroUrl}
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
            objectPosition: "center 35%",
          }}
        />

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
            Journal · Matt Headley
          </span>
        </div>

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
          <div
            style={{
              display: "flex",
              width: 80,
              height: 3,
              backgroundColor: "#CA8A04",
              marginBottom: 28,
            }}
          />

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
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
