import fs from "fs";
import path from "path";
import PhotoCarousel from "./PhotoCarousel";
import type { CarouselSlide } from "./PhotoCarousel";

interface PhotoCarouselLoaderProps {
  slidesId: string;
  title?: string;
}

export default function PhotoCarouselLoader({
  slidesId,
  title,
}: PhotoCarouselLoaderProps) {
  const filePath = path.join(
    process.cwd(),
    "content/carousels",
    `${slidesId}.json`
  );

  if (!fs.existsSync(filePath)) return null;

  const slides: CarouselSlide[] = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  return (
    <div className="animate-on-scroll-slow">
      <PhotoCarousel slides={slides} title={title} />
    </div>
  );
}
