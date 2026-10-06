"use client";

import { useEffect, useRef, useState } from "react";

interface VideoEmbedProps {
  url: string;
  caption?: string;
  /** Anchor for links straight to the video (emails link to <page>#video). */
  id?: string;
}

interface YtStats {
  viewCount: string;
  likeCount: string;
  publishedAt: string;
}

function parseVideoUrl(url: string): { embedUrl: string; videoId: string | null; platform: "youtube" | "vimeo"; isShort?: boolean } | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?rel=0`,
      videoId: shortsMatch[1],
      platform: "youtube",
      isShort: true,
    };
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`,
      videoId: ytMatch[1],
      platform: "youtube",
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`,
      videoId: null,
      platform: "vimeo",
    };
  }

  return null;
}

function formatCount(n: string): string {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export default function VideoEmbed({ url, caption, id = "video" }: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<YtStats | null>(null);
  const parsed = parseVideoUrl(url);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (parsed?.platform !== "youtube" || !parsed.videoId) return;
    fetch(`/api/youtube-stats?videoId=${parsed.videoId}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: YtStats | null) => { if (d) setStats(d) })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (!parsed) {
    return (
      <figure className="not-prose my-8 bg-ll-warm border border-ll-border rounded-lg px-5 py-4">
        <p className="text-sm text-ll-text-light italic">Unsupported video URL.</p>
      </figure>
    );
  }

  return (
    <figure id={id} className={`not-prose my-8 scroll-mt-24 bg-ll-warm border border-ll-border rounded-lg overflow-hidden ${parsed.isShort ? "max-w-xs mx-auto" : ""}`}>
      <div ref={containerRef} className="relative w-full" style={{ paddingBottom: parsed.isShort ? "177.78%" : "56.25%" }}>
        {visible ? (
          <iframe
            src={parsed.embedUrl}
            title={caption ?? "Embedded video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 bg-ll-border animate-pulse" />
        )}
      </div>
      {(caption || stats) && (
        <figcaption className="px-5 py-3 flex flex-col gap-0.5">
          {caption && (
            <span className="text-xs italic text-ll-text-light text-center block">{caption}</span>
          )}
          {stats && (
            <span className="text-[11px] text-ll-text-light/60 text-center block">
              ▶ {formatCount(stats.viewCount)} views
              {parseInt(stats.likeCount, 10) > 0 && ` · ${formatCount(stats.likeCount)} likes`}
              {stats.publishedAt && ` · ${new Date(stats.publishedAt).getFullYear()}`}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
