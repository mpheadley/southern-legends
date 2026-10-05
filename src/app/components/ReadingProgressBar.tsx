"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    // rAF loop instead of the native "scroll" event: the site uses Lenis
    // smooth-scroll, which doesn't fire continuous native scroll events, so a
    // scroll listener only updates when scrolling stops. A frame loop tracks it
    // live. Threshold-gated setState avoids needless re-renders.
    let raf = 0;
    let last = -1;
    const tick = () => {
      const { top, height } = article.getBoundingClientRect();
      const total = height - window.innerHeight;
      const scrolled = Math.max(0, -top);
      const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      if (Math.abs(pct - last) > 0.05) {
        last = pct;
        setProgress(pct);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[4px] bg-ll-accent"
      style={{ width: `${progress}%`, transition: "width 80ms linear", boxShadow: "0 0 6px rgba(202,138,4,0.7)" }}
      aria-hidden="true"
    />
  );
}
