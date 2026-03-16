type VideoLayout = "full" | "wide" | "center";

interface VideoLoopProps {
  src: string;
  alt: string;
  caption?: string;
  layout?: VideoLayout;
}

const layoutClasses: Record<VideoLayout, string> = {
  full: "clear-both my-10 -mx-2 md:-mx-6",
  wide: "clear-both my-10",
  center: "clear-both my-10 mx-auto w-[80%] md:w-[65%]",
};

export default function VideoLoop({
  src,
  alt,
  caption,
  layout = "wide",
}: VideoLoopProps) {
  return (
    <figure className={layoutClasses[layout]}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
          className="w-full h-auto"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {caption && (
        <figcaption className="text-sm text-ll-text-light text-center mt-3 italic px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
