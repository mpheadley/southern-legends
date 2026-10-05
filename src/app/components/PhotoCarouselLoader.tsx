import fs from "fs";
import path from "path";
import PhotoCarousel from "./PhotoCarousel";
import type { CarouselSlide } from "./PhotoCarousel";

interface PhotoCarouselLoaderProps {
  slidesId: string;
  /** Show at most this many slides (keeps long galleries from overwhelming an article). */
  limit?: number;
  title?: string;
}

export default function PhotoCarouselLoader({
  slidesId,
  limit,
  title,
}: PhotoCarouselLoaderProps) {
  const filePath = path.join(
    process.cwd(),
    "content/carousels",
    `${slidesId}.json`
  );

  if (!fs.existsSync(filePath)) return null;

  const all: CarouselSlide[] = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
  const slides = limit ? all.slice(0, limit) : all;

  return (
    <div className="animate-on-scroll-slow">
      <PhotoCarousel slides={slides} title={title} />
    </div>
  );
}
