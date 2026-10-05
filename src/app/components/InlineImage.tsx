import Image from "next/image";

interface InlineImageProps {
  src: string;
  alt: string;
  caption?: string;
  /** "left" | "right" floats the image so body text wraps around it (a true
   * inline/run-around image). Omit for the original centered block behavior. */
  float?: "left" | "right";
}

export default function InlineImage({ src, alt, caption, float }: InlineImageProps) {
  const floated = float === "left" || float === "right";
  return (
    <div
      className={floated ? "not-prose my-2" : "not-prose my-8 mx-auto"}
      style={
        floated
          ? { maxWidth: "280px", float, margin: float === "left" ? "6px 20px 10px 0" : "6px 0 10px 20px" }
          : { maxWidth: "400px" }
      }
    >
      <Image
        src={src}
        alt={alt}
        width={400}
        height={533}
        className="w-full rounded-lg object-cover"
      />
      {caption && (
        <p className="mt-2 text-xs text-center italic text-ll-text-light">{caption}</p>
      )}
    </div>
  );
}
