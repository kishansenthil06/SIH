import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckGL } from '@deck.gl/react';
import { Map as MaplibreMap } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import type { ReactNode } from 'react';
import type { Layer } from '@deck.gl/core';
import { KERALA_COAST_BOUNDS } from '../../mock-data/constants';

// No-token raster basemap -- avoids needing a Mapbox/MapTiler key for the demo.
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

const INITIAL_VIEW_STATE = {
  longitude: (KERALA_COAST_BOUNDS.minLon + KERALA_COAST_BOUNDS.maxLon) / 2,
  latitude: (KERALA_COAST_BOUNDS.minLat + KERALA_COAST_BOUNDS.maxLat) / 2,
  zoom: 6.6,
  pitch: 0,
  bearing: 0,
};

interface MapCanvasProps {
  layers: Layer[];
  height?: number | string;
  children?: ReactNode;
}

export function MapCanvas({ layers, height = '100%', children }: MapCanvasProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[var(--color-border)]" style={{ height }}>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
        <MaplibreMap mapLib={maplibregl} mapStyle={OSM_STYLE} attributionControl={false} />
      </DeckGL>
      {children}
    </div>
  );
}
