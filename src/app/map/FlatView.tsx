"use client";

// Client-only (parent imports with ssr:false) — leaflet touches window.
// Uses leaflet.markercluster directly via a small imperative layer so it does
// not depend on any react-leaflet-cluster version compatibility.
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { MapMarker, TrailPath } from "@/lib/map-data";

function dotIcon(color: string) {
  return L.divIcon({
    className: "sl-dot",
    html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 8px ${color}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function ClusterLayer({
  markers,
  onSelect,
}: {
  markers: MapMarker[];
  onSelect: (m: MapMarker) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const group = L.markerClusterGroup({ maxClusterRadius: 50 });
    for (const m of markers) {
      const mk = L.marker([m.lat, m.lon], { icon: dotIcon(m.color) });
      mk.on("click", () => onSelect(m));
      mk.bindTooltip(m.name, { direction: "top", offset: [0, -8] });
      group.addLayer(mk);
    }
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [markers, map, onSelect]);
  return null;
}

export default function FlatView({
  markers,
  trails,
  onSelect,
}: {
  markers: MapMarker[];
  trails: TrailPath[];
  onSelect: (m: MapMarker) => void;
}) {
  return (
    <MapContainer
      center={[33.66, -85.83]}
      zoom={9}
      style={{ width: "100%", height: "100%", background: "#0a0f0c" }}
      scrollWheelZoom
    >
      <LayersControl position="topright">
        {/* CARTO dark_all now requires an API key (tiles render "API KEY REQUIRED").
            OSM standard tiles are free, no key, attribution required; the dark look
            comes from a CSS filter on this layer only (.sl-tiles-dark in globals.css). */}
        <LayersControl.BaseLayer checked name="Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            className="sl-tiles-dark"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {trails.map((t) => (
        <Polyline
          key={t.id}
          positions={t.coords}
          pathOptions={{ color: t.color, weight: 4, opacity: 0.85 }}
          eventHandlers={{
            click: () => {
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
            },
          }}
        />
      ))}

      <ClusterLayer markers={markers} onSelect={onSelect} />
    </MapContainer>
  );
}
