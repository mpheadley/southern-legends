"use client";

import { useEffect } from "react";

// Interaction tracking for /faith. SL has no /api/events route; it tracks through GA4,
// which only loads after cookie consent (see components/Analytics.tsx). These events
// fire into window.gtag when it exists and are a silent no-op otherwise. Never blocks UX.
//
// Events (all with event_category "faith", plus page + slug):
//   faith_view (page load) · faith_column_click (to a /faith/[slug] page) · faith_longer_click (to the
//   longer version) · faith_star_click (outbound to annistonstar.com) · faith_hero_subscribe_click ·
//   faith_subscribe_focus (first focus on a #subscribe input) · faith_reel_click (outbound to a related reel).
// Click events come from data-faith-track / data-faith-slug attributes on the links.
export default function FaithTrack({ page, slug }: { page: "index" | "column"; slug?: string }) {
  useEffect(() => {
    const send = (name: string, params: Record<string, string>) => {
      try {
        if (typeof window.gtag === "function") window.gtag("event", name, { event_category: "faith", ...params });
      } catch {
        /* tracking never breaks the page */
      }
    };

    send("faith_view", { page, slug: slug ?? "" });

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-faith-track]");
      if (!el) return;
      send(el.dataset.faithTrack ?? "faith_click", { page, slug: el.dataset.faithSlug ?? slug ?? "" });
    }

    let focused = false;
    function onFocus(e: FocusEvent) {
      if (focused) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("#subscribe") && t.tagName === "INPUT") {
        focused = true;
        send("faith_subscribe_focus", { page, slug: slug ?? "" });
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
    };
  }, [page, slug]);

  return null;
}
