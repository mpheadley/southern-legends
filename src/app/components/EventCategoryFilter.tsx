"use client";

import { useState } from "react";

const LABELS: Record<string, string> = {
  music: "Music", arts: "Arts", outdoors: "Outdoors", family: "Family", food: "Food",
  market: "Markets", civic: "Classes", faith: "Faith", sports: "Sports", community: "Community",
};

// Chips that hide events outside the chosen category. Pure CSS toggle, so the
// full list still renders server-side for search engines.
export default function EventCategoryFilter({ categories }: { categories: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const chip = (on: boolean) =>
    ({
      fontFamily: "var(--font-body)", fontSize: "0.8rem", padding: "0.35rem 0.8rem", borderRadius: "999px", cursor: "pointer",
      border: "1px solid rgba(154,108,47,0.4)", background: on ? "#1a1208" : "transparent", color: on ? "#f0ede6" : "#4a3728",
    }) as const;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.75rem" }} role="group" aria-label="Filter events by category">
      {active && (
        <style>{`.sl-events li[data-cat]:not([data-cat="${active}"]){display:none}.sl-events-group:not(:has(li[data-cat="${active}"])){display:none}`}</style>
      )}
      <button type="button" onClick={() => setActive(null)} style={chip(active === null)} aria-pressed={active === null}>
        All
      </button>
      {categories.map((c) => (
        <button key={c} type="button" onClick={() => setActive(c)} style={chip(active === c)} aria-pressed={active === c}>
          {LABELS[c] ?? c}
        </button>
      ))}
    </div>
  );
}
