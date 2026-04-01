import Image from "next/image";

type ImageLayout = "full" | "left" | "right" | "center";

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  layout?: ImageLayout;
  width?: number;
  height?: number;
}

const layoutClasses: Record<ImageLayout, string> = {
  full: "my-10 -mx-2 md:-mx-6",
  left: "clear-both my-6 mr-5 md:mr-6 float-left w-full md:w-[38%]",
  right: "clear-both my-6 ml-5 md:ml-6 float-right w-full md:w-[38%]",
  center: "clear-both my-10 mx-auto w-full md:w-[45%]",
};

export default function ArticleImage({
  src,
  alt,
  caption,
  priority = false,
  layout = "full",
  width = 900,
  height = 675,
}: ArticleImageProps) {
  return (
    <figure className={layoutClasses[layout]}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
          sizes={
            layout === "full"
              ? "(max-width: 768px) 100vw, 720px"
              : layout === "center"
                ? "(max-width: 768px) 65vw, 360px"
                : "(max-width: 768px) 55vw, 320px"
          }
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-ll-text-light text-center mt-3 italic px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
