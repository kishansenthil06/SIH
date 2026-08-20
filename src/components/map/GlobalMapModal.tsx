import { useEffect, useState } from 'react';
import {
  X,
  Globe,
  Radio,
  Ship,
  Dna,
  Thermometer,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Map, MapControls, MapMarker, MarkerPopup, MapGeoJSON } from '@/components/ui/map';

const WORLD_GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson';

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StationMarker {
  id: string;
  name: string;
  category: 'CMLRE' | 'Buoy' | 'Reef' | 'Global';
  coords: [number, number]; // [lon, lat]
  metrics: {
    sst?: string;
    salinity?: string;
    status: string;
    details: string;
  };
}

const GLOBAL_STATIONS: StationMarker[] = [
  {
    id: 'kerala_cmlre',
    name: 'Kochi Marine Station (CMLRE)',
    category: 'CMLRE',
    coords: [76.2711, 9.9312],
    metrics: {
      sst: '28.6°C',
      salinity: '34.8 PSU',
      status: 'Active Surveillance',
      details: 'Arabian Sea coastal upwelling station · Live eDNA & Otolith sampling',
    },
  },
  {
    id: 'mumbai_offshore',
    name: 'Mumbai Offshore Array (IND-01)',
    category: 'Buoy',
    coords: [72.8777, 19.0760],
    metrics: {
      sst: '27.9°C',
      salinity: '35.4 PSU',
      status: 'Telemetry Online (99.8%)',
      details: 'Northern Arabian Sea buoy cluster · Significant Wave Ht: 1.8m',
    },
  },
  {
    id: 'lakshadweep_reef',
    name: 'Lakshadweep Reef Bio-Array',
    category: 'Reef',
    coords: [72.6369, 10.5667],
    metrics: {
      sst: '29.2°C',
      salinity: '34.6 PSU',
      status: 'Bleaching Alert (AURA-v4)',
      details: 'Coral reef sanctuary surveillance · Predicted high temp stress',
    },
  },
  {
    id: 'monterey_node',
    name: 'Monterey Bay Node (MB-04)',
    category: 'Global',
    coords: [-121.8947, 36.8007],
    metrics: {
      sst: '14.2°C',
      salinity: '33.9 PSU',
      status: 'Active eDNA Surveillance',
      details: 'Shannon-Wiener Index: 4.82 · 42 verified amplicon sequences',
    },
  },
  {
    id: 'atlantic_ridge',
    name: 'Mid-Atlantic Hydrothermal Ridge',
    category: 'Global',
    coords: [-44.87, 23.36],
    metrics: {
      sst: '19.8°C',
      salinity: '35.8 PSU',
      status: 'AMOC Flow Rate: 14.2 Sv',
      details: 'Thermohaline circulation telemetry · Vector decay accelerating',
    },
  },
];

export function GlobalMapModal({ isOpen, onClose }: GlobalMapModalProps) {
  const [mapStyle, setMapStyle] = useState<'streets' | 'blank'>('streets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStations =
    selectedCategory === 'all'
      ? GLOBAL_STATIONS
      : GLOBAL_STATIONS.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030d25]/85 backdrop-blur-xl animate-in fade-in duration-200 selection:bg-[#64ffda] selection:text-[#08132a]">
      <div
        className={`relative flex flex-col w-full bg-[#08132a] border border-[#233554] rounded-[6px] shadow-[0_0_50px_rgba(3,13,37,0.8)] overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-none' : 'h-[88vh] max-w-7xl'
        }`}
      >
        {/* Modal Header */}
        <header className="flex h-14 shrink-0 items-center justify-between px-5 border-b border-[#233554] bg-[#101b33]/90 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-[4px] bg-[#151f37] border border-[#64ffda]/40 shadow-[0_0_12px_rgba(100,255,218,0.15)]">
              <Globe className="h-4 w-4 text-[#64ffda]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-headline font-bold text-white tracking-tight">
                  Global Oceanic &amp; Marine Intelligence Map
                </h2>
                <span className="px-2 py-0.2 rounded-[2px] font-mono text-[9px] font-bold bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
                  LIVE RADAR
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#85948e]">
                Coordinates: 08°12'N 76°24'E · Arabian Sea Basin &amp; Global Array Network
              </p>
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-3">
            {/* Style switcher */}
            <div className="flex bg-[#08132a] p-0.5 rounded-[4px] border border-[#233554] text-xs font-mono">
              <button
                onClick={() => setMapStyle('streets')}
                className={`px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer text-[11px] ${
                  mapStyle === 'streets'
                    ? 'bg-[#1f2942] text-[#64ffda] font-bold'
                    : 'text-[#85948e] hover:text-white'
                }`}
              >
                Tiled Basemap
              </button>
              <button
                onClick={() => setMapStyle('blank')}
                className={`px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer text-[11px] ${
                  mapStyle === 'blank'
                    ? 'bg-[#1f2942] text-[#64ffda] font-bold'
                    : 'text-[#85948e] hover:text-white'
                }`}
              >
                Vector Bathymetry
              </button>
            </div>

            {/* Category Filter */}
            <div className="hidden sm:flex items-center gap-1">
              {['all', 'CMLRE', 'Buoy', 'Reef', 'Global'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-[2px] font-mono text-[10px] transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-[#64ffda]/15 text-[#64ffda] border-[#64ffda]/40 font-bold'
                      : 'bg-[#101b33] text-[#85948e] border-[#233554] hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Arrays' : cat}
                </button>
              ))}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-[4px] border border-[#233554] bg-[#151f37] hover:bg-[#1f2942] text-[#bacac3] hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] border border-[#233554] bg-[#151f37] hover:border-[#f07178]/60 hover:bg-[#f07178]/10 text-[#85948e] hover:text-[#f07178] transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Map Body */}
        <div className="relative flex-1 w-full h-full bg-[#061122] overflow-hidden">
          {mapStyle === 'streets' ? (
            <Map center={[72.8, 14.5]} zoom={4.2} className="h-full w-full">
              <MapControls showZoom showCompass showFullscreen={false} position="bottom-right" />

              {/* Render Stations */}
              {filteredStations.map((station) => (
                <MapMarker
                  key={station.id}
                  longitude={station.coords[0]}
                  latitude={station.coords[1]}
                >
                  <MarkerPopup closeButton>
                    <div className="p-2 min-w-[200px] font-sans">
                      <div className="flex items-center justify-between border-b border-[#233554] pb-1.5 mb-2">
                        <span className="font-mono text-[10px] font-bold text-[#64ffda] uppercase">
                          {station.category} ARRAY
                        </span>
                        <span className="text-[9px] font-mono text-[#85948e]">
                          {station.coords[1].toFixed(2)}°N, {station.coords[0].toFixed(2)}°E
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white mb-1">{station.name}</h4>
                      <p className="text-[11px] text-[#bacac3] mb-2 leading-tight">{station.metrics.details}</p>

                      <div className="grid grid-cols-2 gap-2 bg-[#08132a] p-1.5 rounded-[4px] border border-[#233554] font-mono text-[10px]">
                        <div>
                          <span className="text-[#85948e] block text-[9px]">SST</span>
                          <span className="text-[#64ffda] font-bold">{station.metrics.sst || '24.2°C'}</span>
                        </div>
                        <div>
                          <span className="text-[#85948e] block text-[9px]">SALINITY</span>
                          <span className="text-white font-bold">{station.metrics.salinity || '34.8 PSU'}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 text-[9.5px] font-mono text-[#38debb] flex items-center gap-1">
                        <Radio className="h-2.5 w-2.5 animate-pulse" />
                        {station.metrics.status}
                      </div>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>
          ) : (
            <Map blank center={[60, 15]} zoom={2.5} className="h-full w-full">
              <MapGeoJSON
                data={WORLD_GEOJSON_URL}
                fillPaint={{ 'fill-color': '#151f37', 'fill-opacity': 0.85 }}
                linePaint={{ 'line-color': '#64ffda', 'line-width': 1 }}
              />
              <MapControls showZoom showCompass showFullscreen={false} position="bottom-right" />

              {filteredStations.map((station) => (
                <MapMarker
                  key={station.id}
                  longitude={station.coords[0]}
                  latitude={station.coords[1]}
                >
                  <MarkerPopup closeButton>
                    <div className="p-2 min-w-[200px] font-sans">
                      <h4 className="font-bold text-xs text-white mb-1">{station.name}</h4>
                      <p className="text-[11px] text-[#bacac3] mb-2">{station.metrics.details}</p>
                      <div className="text-[10px] font-mono text-[#64ffda]">{station.metrics.status}</div>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>
          )}

          {/* Floating HUD Telemetry Overlay (Bottom Left) */}
          <div className="absolute bottom-5 left-5 z-20 hidden md:flex items-center gap-4 p-3 bg-[#101b33]/90 backdrop-blur-md border border-[#233554] rounded-[4px] shadow-2xl font-mono text-xs text-[#d9e2ff]">
            <div className="flex items-center gap-2 pr-3 border-r border-[#233554]">
              <Ship className="h-4 w-4 text-[#64ffda]" />
              <div>
                <div className="text-[9px] text-[#85948e] uppercase">Live AIS Vessels</div>
                <div className="font-bold text-white">1,402 Active</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-3 border-r border-[#233554]">
              <Thermometer className="h-4 w-4 text-[#f07178]" />
              <div>
                <div className="text-[9px] text-[#85948e] uppercase">Avg SST Anomaly</div>
                <div className="font-bold text-[#f07178]">+1.4°C (N. Atl)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-3 border-r border-[#233554]">
              <Activity className="h-4 w-4 text-[#38debb]" />
              <div>
                <div className="text-[9px] text-[#85948e] uppercase">AMOC Strength</div>
                <div className="font-bold text-[#38debb]">14.2 Sv</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dna className="h-4 w-4 text-[#b9c7e4]" />
              <div>
                <div className="text-[9px] text-[#85948e] uppercase">eDNA Stations</div>
                <div className="font-bold text-white">5 Active Clusters</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
