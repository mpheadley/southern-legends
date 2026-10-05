// One layout rule for every media block on a profile or listicle.
//
// Placement is decided by the author (or by tools/sl-layout.py) with `float`:
//   - "left" | "right": text wraps beside the figure on tablet and desktop (≥768px).
//     On phones the figure drops to a full-width block, so no narrow text column.
//   - "center" or omitted: centered block, full width on phones.
//   - "full": edge-to-edge on all sizes.
//
// Sizes: `size` picks the desktop width. "sm" for small sidebars (e.g. field-guide covers),
// "md" default, "lg" for landscape photos. Phones always get full width.
//
// Works for images (src ends .webp/.jpg/.png) and video (.mp4). Video autoplays muted and loops.

import Image from "next/image";

type Float = "left" | "right" | "center" | "full";
type Size = "sm" | "md" | "lg";

const DESKTOP_WIDTH: Record<Size, string> = { sm: "34%", md: "40%", lg: "56%" };

export default function Figure({
  src,
  alt,
  caption,
  float = "center",
  size = "md",
  width = 1200,
  height = 800,
}: {
  src: string;
  alt: string;
  caption?: string;
  float?: Float;
  size?: Size;
  width?: number;
  height?: number;
}) {
  const isVideo = /\.(mp4|webm)$/i.test(src);
  const cls = [
    "sl-figure",
    `sl-figure--${float}`,
    `sl-figure--${size}`,
  ].join(" ");

  return (
    <figure className={cls + " not-prose"} data-float={float} data-size={size}>
      <div className="sl-figure__media">
        {isVideo ? (
          <video src={src} aria-label={alt} autoPlay loop muted playsInline preload="metadata" style={{ width: "100%", height: "auto", display: "block" }} />
        ) : (
          <Image src={src} alt={alt} width={width} height={height} style={{ width: "100%", height: "auto", display: "block" }} sizes="(min-width: 768px) 40vw, 100vw" />
        )}
      </div>
      {caption && <figcaption className="sl-figure__caption">{caption}</figcaption>}
      <style>{`
        .sl-figure { margin: 2.25rem 0; clear: both; }
        .sl-figure__media { border-radius: 0.5rem; overflow: hidden; }
        .sl-figure__caption { margin-top: 0.6rem; font-size: 0.8125rem; font-style: italic; text-align: center; color: #6b5a44; }
        .sl-figure--center { margin-left: auto; margin-right: auto; max-width: 42rem; }
        .sl-figure--full { margin-left: -1.5rem; margin-right: -1.5rem; }
        @media (min-width: 768px) {
          .sl-figure--left, .sl-figure--right { width: var(--sl-w, 40%); margin-top: 0.25rem; }
          .sl-figure--left { float: left; margin-right: 1.5rem; margin-bottom: 0.75rem; }
          .sl-figure--right { float: right; margin-left: 1.5rem; margin-bottom: 0.75rem; }
          .sl-figure--sm { --sl-w: ${DESKTOP_WIDTH.sm}; }
          .sl-figure--md { --sl-w: ${DESKTOP_WIDTH.md}; }
          .sl-figure--lg { --sl-w: ${DESKTOP_WIDTH.lg}; }
          .sl-figure--full { margin-left: -4rem; margin-right: -4rem; }
        }
        @media (max-width: 767px) {
          .sl-figure.sl-figure--left, .sl-figure.sl-figure--right { float: none; width: 100%; margin: 2rem 0; }
        }
      `}</style>
    </figure>
  );
}
