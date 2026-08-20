import { useState } from "react";
import { Map, MapControls, MapGeoJSON, MapMarker, MarkerPopup } from "@/components/ui/map";

const WORLD_COUNTRIES_GEOJSON =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

/**
 * Basic mapcn example component.
 * Demonstrates:
 * 1. Default tiled basemap (for streets, place labels, geographic context) with controls and marker popup
 * 2. Blank map (<Map blank>) with MapGeoJSON for vector data/country boundaries
 */
export function BasicMapExample() {
  const [mapMode, setMapMode] = useState<"tiled" | "blank">("tiled");

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            mapcn Map Component
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            MapLibre GL + Tailwind CSS + shadcn/ui
          </p>
        </div>
        <div className="flex gap-1.5 p-0.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setMapMode("tiled")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              mapMode === "tiled"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Tiled Basemap
          </button>
          <button
            type="button"
            onClick={() => setMapMode("blank")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              mapMode === "blank"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Blank Data Map
          </button>
        </div>
      </div>

      <div className="h-[360px] w-full overflow-hidden rounded-lg border border-[var(--color-border)] relative">
        {mapMode === "tiled" ? (
          <Map center={[76.2711, 9.9312]} zoom={8} className="h-full w-full">
            <MapControls showZoom showCompass showFullscreen position="bottom-right" />
            <MapMarker longitude={76.2711} latitude={9.9312}>
              <MarkerPopup closeButton>
                <div className="p-1">
                  <p className="font-semibold text-xs text-foreground">Kochi Port</p>
                  <p className="text-[11px] text-muted-foreground">Arabian Sea Oceanographic Station</p>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        ) : (
          <Map blank center={[0, 20]} zoom={1.5} className="h-full w-full">
            <MapGeoJSON
              data={WORLD_COUNTRIES_GEOJSON}
              fillPaint={{ "fill-color": "#22d3ee", "fill-opacity": 0.15 }}
              linePaint={{ "line-color": "#38bdf8", "line-width": 1 }}
            />
            <MapControls showZoom showCompass showFullscreen position="bottom-right" />
          </Map>
        )}
      </div>
    </div>
  );
}

/**
 * Standard minimal example from mapcn documentation
 */
export function MyMap() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </div>
  );
}
