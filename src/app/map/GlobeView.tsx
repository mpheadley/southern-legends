"use client";

// Loaded ONLY on the client (parent imports it with ssr:false) because
// react-globe.gl needs WebGL/window. NE Alabama centered, auto-rotates until
// the user grabs it.
import { useEffect, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { MapMarker, TrailPath } from "@/lib/map-data";

const CENTER = { lat: 33.66, lng: -85.83, altitude: 1.9 };

export default function GlobeView({
  markers,
  trails,
  onSelect,
}: {
  markers: MapMarker[];
  trails: TrailPath[];
  onSelect: (m: MapMarker) => void;
}) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(CENTER, 0);
    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    const stop = () => (controls.autoRotate = false);
    const el = wrapRef.current;
    el?.addEventListener("pointerdown", stop);
    return () => el?.removeEventListener("pointerdown", stop);
  }, [size.w]);

  const pathsData = trails.map((t) => ({
    coords: t.coords.map(([lat, lng]) => [lat, lng]),
    color: t.color,
    trail: t,
  }));

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="#0a0f0c"
          globeImageUrl="/images/map/earth-dark.webp"
          atmosphereColor="#2d6a4f"
          atmosphereAltitude={0.18}
          pointsData={markers}
          pointLat={(d) => (d as MapMarker).lat}
          pointLng={(d) => (d as MapMarker).lon}
          pointColor={(d) => (d as MapMarker).color}
          pointAltitude={0.012}
          pointRadius={0.32}
          pointLabel={(d) => (d as MapMarker).name}
          onPointClick={(d) => onSelect(d as MapMarker)}
          pathsData={pathsData}
          pathPoints="coords"
          pathPointLat={(p) => (p as number[])[0]}
          pathPointLng={(p) => (p as number[])[1]}
          pathColor={(d: object) => (d as { color: string }).color}
          pathStroke={2}
          pathTransitionDuration={0}
          onPathClick={(d) => {
            const t = (d as { trail: TrailPath }).trail;
            const mid = t.coords[Math.floor(t.coords.length / 2)];
            onSelect({
              id: t.id,
              name: t.name,
              type: "trail",
              filter: "trails",
              lat: mid[0],
              lon: mid[1],
              location: "Northeast Alabama",
              excerpt: "",
              url: t.url,
              color: t.color,
            });
          }}
        />
      )}
    </div>
  );
}
