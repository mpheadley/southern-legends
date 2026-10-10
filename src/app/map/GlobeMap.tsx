"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Link } from "next-view-transitions";
import { Globe, MapPin } from "lucide-react";
import type { MapMarker, TrailPath, FilterBucket } from "@/lib/map-data";

// WebGL / window-dependent views — never SSR them.
const GlobeView = dynamic(() => import("./GlobeView"), { ssr: false });
const FlatView = dynamic(() => import("./FlatView"), { ssr: false });

type Mode = "globe" | "flat";

const FILTERS: { key: FilterBucket | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "people", label: "People" },
  { key: "businesses", label: "Businesses" },
  { key: "food", label: "Food" },
  { key: "trails", label: "Trails" },
  { key: "faith", label: "Faith" },
  { key: "outdoors", label: "Outdoors" },
];

const TYPE_LABEL: Record<MapMarker["type"], string> = {
  profile: "Story",
  business: "Business",
  essay: "Essay",
  trail: "Trail",
  listicle: "Guide",
  mattnote: "Note",
};

export default function GlobeMap({
  markers,
  trails,
}: {
  markers: MapMarker[];
  trails: TrailPath[];
}) {
  const [mode, setMode] = useState<Mode>("globe");
  const [filter, setFilter] = useState<FilterBucket | "all">("all");
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Globe degrades badly on small screens — force flat on mobile.
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (m) setMode("flat");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? markers : markers.filter((m) => m.filter === filter)),
    [markers, filter]
  );
  const filteredTrails = useMemo(
    () => (filter === "all" || filter === "trails" || filter === "outdoors" ? trails : []),
    [trails, filter]
  );

  return (
    <div className="sl-map" style={{ position: "relative", zIndex: 0, isolation: "isolate", width: "100%", height: "100dvh", background: "#0a0f0c", overflow: "hidden" }}>
      {mode === "globe" && !isMobile ? (
        <GlobeView markers={filtered} trails={filteredTrails} onSelect={setSelected} />
      ) : (
        <FlatView markers={filtered} trails={filteredTrails} onSelect={setSelected} />
      )}

      {/* Mode pills + filter row, overlaid top-center */}
      <div
        style={{
          position: "absolute",
          top: "5.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100, // above Leaflet panes (400) + controls (1000); the wrapper's isolation keeps it under the site header
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          width: "min(92vw, 720px)",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-heading)", color: "#F0EDE6", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, lineHeight: 1.1, margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          The Map
        </h1>
        {!isMobile && (
          <div style={pillWrap}>
            <button onClick={() => setMode("globe")} style={pill(mode === "globe")}><Globe size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "-3px", marginRight: 6 }} />Globe</button>
            <button onClick={() => setMode("flat")} style={pill(mode === "flat")}><MapPin size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "-3px", marginRight: 6 }} />Map</button>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem" }}>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={chip(filter === f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "var(--text-meta)", color: "rgba(240,237,232,0.8)", letterSpacing: "0.02em", margin: 0, textAlign: "center", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
          Stories, businesses, essays, and trails · {filtered.length} places across Northeast Alabama
        </p>
      </div>

      {/* Slide-in card panel */}
      <aside
        style={{
          position: "fixed",
          top: "4.75rem",
          right: 0,
          height: "calc(100dvh - 4.75rem)",
          width: "min(380px, 88vw)",
          background: "#0f1c13",
          borderLeft: "1px solid rgba(201,162,39,0.25)",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.5)",
          transform: selected ? "translateX(0)" : "translateX(105%)",
          transition: "transform 0.32s cubic-bezier(0.16,1,0.3,1)",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selected && (
          <>
            <button onClick={() => setSelected(null)} style={closeBtn} aria-label="Close">×</button>
            {selected.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.photo} alt={selected.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            )}
            <div style={{ padding: "1.25rem 1.4rem", overflowY: "auto" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "var(--text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#0a0f0c",
                  background: selected.color,
                  padding: "0.18rem 0.5rem",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                {TYPE_LABEL[selected.type]}
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", color: "#f0ede8", fontSize: "1.4rem", margin: "0.7rem 0 0.35rem", lineHeight: 1.15 }}>
                {selected.name}
              </h2>
              {selected.location && (
                <div style={{ color: "rgba(240,237,232,0.6)", fontSize: "var(--text-label)", marginBottom: "0.8rem" }}>{selected.location}</div>
              )}
              {selected.excerpt && (
                <p style={{ color: "rgba(240,237,232,0.85)", fontSize: "0.92rem", lineHeight: 1.55, marginBottom: "1.1rem" }}>{selected.excerpt}</p>
              )}
              <Link href={selected.url} style={{ color: "#C9A227", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>
                Read more →
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

const pillWrap: React.CSSProperties = {
  display: "flex",
  gap: "0.25rem",
  background: "rgba(15,28,19,0.85)",
  backdropFilter: "blur(8px)",
  padding: "0.25rem",
  borderRadius: 999,
  border: "1px solid rgba(201,162,39,0.2)",
};

function pill(active: boolean): React.CSSProperties {
  return {
    border: "none",
    cursor: "pointer",
    borderRadius: 999,
    padding: "0.45rem 1.1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: active ? "#0a0f0c" : "#f0ede8",
    background: active ? "#C9A227" : "transparent",
    transition: "all 0.18s",
  };
}

function chip(active: boolean): React.CSSProperties {
  return {
    border: "1px solid rgba(240,237,232,0.18)",
    cursor: "pointer",
    borderRadius: 999,
    padding: "0.32rem 0.85rem",
    fontSize: "var(--text-label)",
    fontWeight: 500,
    color: active ? "#0a0f0c" : "rgba(240,237,232,0.9)",
    background: active ? "#f0ede8" : "rgba(15,28,19,0.7)",
    backdropFilter: "blur(8px)",
    transition: "all 0.18s",
  };
}

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "0.6rem",
  right: "0.7rem",
  zIndex: 2,
  width: 32,
  height: 32,
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  background: "rgba(10,15,12,0.7)",
  color: "#f0ede8",
  fontSize: "1.3rem",
  lineHeight: 1,
};
