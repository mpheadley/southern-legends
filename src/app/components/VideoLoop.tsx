"use client";

import { useRef, useState } from "react";
type VideoLayout = "full" | "wide" | "center" | "portrait";

interface VideoLoopProps {
  src: string;
  alt: string;
  caption?: string;
  layout?: VideoLayout;
  /** Set false for clips with sound: the viewer presses play. */
  autoPlay?: boolean;
}

const layoutClasses: Record<VideoLayout, string> = {
  full: "clear-both my-10 -mx-2 md:-mx-6",
  wide: "clear-both my-10",
  center: "clear-both my-10 mx-auto w-[80%] md:w-[65%]",
  // Vertical phone clips: narrow so a 9:16 loop doesn't fill a whole screen.
  portrait: "clear-both my-10 mx-auto w-[70%] md:w-[38%]",
};

export default function VideoLoop({
  src,
  alt,
  caption,
  layout = "wide",
  autoPlay = true,
}: VideoLoopProps) {
  // Loops start muted (autoplay rule). The button unmutes for clips that have a sound track.
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };
  return (
    <figure className={layoutClasses[layout]}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <video
          ref={ref}
          autoPlay={autoPlay}
          muted={autoPlay}
          controls={!autoPlay}
          loop
          playsInline
          aria-label={alt}
          className="w-full h-auto"
        >
          <source src={src} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? "Unmute video" : "Mute video"}
          style={{ position: "absolute", right: 8, bottom: 8, zIndex: 2, background: "rgba(20,16,14,0.7)", color: "#fff", border: "none", borderRadius: 999, padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer" }}
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
      </div>
      {caption && (
        <figcaption className="text-sm text-ll-text-light text-center mt-3 italic px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
