import Image from "next/image";

type ImageLayout = "full" | "bleed" | "left" | "right" | "center";

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  captionHtml?: string;
  priority?: boolean;
  layout?: ImageLayout;
  width?: number;
  height?: number;
}

const layoutClasses: Record<ImageLayout, string> = {
  full: "my-10 -mx-2 md:-mx-6",
  bleed: "my-12 -mx-6 md:-mx-[calc(50vw-21rem)]",
  left: "clear-both my-6 mr-5 md:mr-6 float-left w-full md:w-[38%]",
  right: "clear-both my-6 ml-5 md:ml-6 float-right w-full md:w-[38%]",
  center: "clear-both my-10 mx-auto w-full md:w-[45%]",
};

export default function ArticleImage({
  src,
  alt,
  caption,
  captionHtml,
  priority = false,
  layout = "full",
  width = 900,
  height = 675,
}: ArticleImageProps) {
  return (
    <figure className={`${layoutClasses[layout]} animate-on-scroll-slow`}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
          sizes={
            layout === "bleed"
              ? "100vw"
              : layout === "full"
                ? "(max-width: 768px) 100vw, 720px"
                : layout === "center"
                  ? "(max-width: 768px) 65vw, 360px"
                  : "(max-width: 768px) 55vw, 320px"
          }
        />
      </div>
      {captionHtml ? (
        <figcaption
          className="text-sm text-ll-text-light text-center mt-3 italic px-2"
          dangerouslySetInnerHTML={{ __html: captionHtml }}
        />
      ) : caption ? (
        <figcaption className="text-sm text-ll-text-light text-center mt-3 italic px-2">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
