import { useState } from 'react';
import {
  Satellite,
  Layers as LayersIcon,
  Droplets,
  TrendingDown,
  Sparkles,
  Thermometer,
  Activity,
  Waves,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export function MapExplorerWorkspace() {
  const [activeBuoy, setActiveBuoy] = useState<string | null>('PAC-42');
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayerMode, setActiveLayerMode] = useState<'sst' | 'currents' | 'salinity'>('sst');

  return (
    <div className="flex-1 min-h-full bg-[#08132a] text-[#d9e2ff] font-sans flex flex-col selection:bg-[#64ffda] selection:text-[#08132a]">
      {/* Scrollable Dashboard Canvas */}
      <div className="p-6 sm:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Top Section: Map & Thermohaline (AMOC) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Global Oceanic Telemetry Map (Spans 8 cols) */}
          <div className="glass-panel rounded-[4px] lg:col-span-8 flex flex-col min-h-[460px] relative overflow-hidden bg-[#151f37]/70">
            {/* Header overlay */}
            <div className="px-4 py-3 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/90 backdrop-blur-md z-20">
              <div className="flex items-center gap-2.5">
                <Satellite className="text-[#64ffda] h-4 w-4" />
                <h2 className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                  Global Oceanic Telemetry
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
                  LIVE
                </span>
                <button
                  onClick={() => setShowLayers(!showLayers)}
                  className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono border transition-colors cursor-pointer flex items-center gap-1 ${
                    showLayers
                      ? 'bg-[#64ffda]/20 text-[#64ffda] border-[#64ffda]/50'
                      : 'bg-[#1f2942] text-[#bacac3] border-[#233554] hover:bg-[#2a344d]'
                  }`}
                >
                  <LayersIcon className="h-3 w-3" />
                  LAYERS
                </button>
              </div>
            </div>

            {/* Layer Picker Dropdown */}
            {showLayers && (
              <div className="absolute top-12 right-4 z-30 bg-[#101b33] border border-[#233554] rounded-[4px] p-2 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
                <p className="text-[10px] uppercase font-bold text-[#85948e] mb-1.5 px-2">Data Layers</p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setActiveLayerMode('sst')}
                    className={`text-left px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                      activeLayerMode === 'sst' ? 'bg-[#64ffda]/15 text-[#64ffda] font-bold' : 'text-[#bacac3] hover:bg-[#151f37]'
                    }`}
                  >
                    Sea Surface Temperature (SST)
                  </button>
                  <button
                    onClick={() => setActiveLayerMode('currents')}
                    className={`text-left px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                      activeLayerMode === 'currents' ? 'bg-[#64ffda]/15 text-[#64ffda] font-bold' : 'text-[#bacac3] hover:bg-[#151f37]'
                    }`}
                  >
                    Thermohaline Vector Currents
                  </button>
                  <button
                    onClick={() => setActiveLayerMode('salinity')}
                    className={`text-left px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                      activeLayerMode === 'salinity' ? 'bg-[#64ffda]/15 text-[#64ffda] font-bold' : 'text-[#bacac3] hover:bg-[#151f37]'
                    }`}
                  >
                    Salinity &amp; Bathymetry
                  </button>
                </div>
              </div>
            )}

            {/* Map Canvas with Currents and Nodes */}
            <div className="flex-1 relative bg-[#061122] overflow-hidden">
              {/* Map Background with currents */}
              <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen">
                <img
                  className="w-full h-full object-cover"
                  alt="Futuristic oceanic currents radar telemetry map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZg40XRDE6a6qU6Leqm4laFo3QxfCy8RiCzevk4C-LxEpsKVOVInsLelKt8Nug5qTZtpt5QQdMuW60qgfBFQJY0yms3R5Qjz6ujwtN3gvAkkCE3TKz7rXq7_luGu8bjQTMM0UCe4SGVMIR61_Tt1yfxfYajwB73p2K5vw5TIKC9PEfy5Y00T46j3-LwLZhjyG2CDaKoEDfKN5cv1vvGOopqvbmOvWRMzj2xp10CobjMp9es6uFd4lmiw"
                />
              </div>

              {/* Map Sensor Nodes */}
              <div className="absolute inset-0 z-10 p-4 pointer-events-auto">
                {/* Node 1: PAC-42 */}
                <div
                  onClick={() => setActiveBuoy('PAC-42')}
                  className="absolute top-[30%] left-[22%] group cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#64ffda] shadow-[0_0_12px_#64ffda] animate-pulse border border-[#08132a]" />
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#101b33]/95 backdrop-blur-md border border-[#233554] p-2.5 rounded-[4px] shadow-2xl z-50 min-w-[130px] transition-all ${
                    activeBuoy === 'PAC-42' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-mono text-[10px] text-[#85948e] mb-0.5">BUOY PAC-42 (N. PACIFIC)</div>
                    <div className="font-mono text-xs font-bold text-white">SST: <span className="text-[#64ffda]">24.2°C</span></div>
                    <div className="font-mono text-[9.5px] text-[#bacac3]">Salinity: 34.8 PSU</div>
                  </div>
                </div>

                {/* Node 2: IND-09 (Kerala Coast) */}
                <div
                  onClick={() => setActiveBuoy('IND-09')}
                  className="absolute top-[52%] left-[62%] group cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#64ffda] shadow-[0_0_12px_#64ffda] animate-pulse border border-[#08132a]" />
                  <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#101b33]/95 backdrop-blur-md border border-[#233554] p-2.5 rounded-[4px] shadow-2xl z-50 min-w-[130px] transition-all ${
                    activeBuoy === 'IND-09' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-mono text-[10px] text-[#85948e] mb-0.5">ARRAY IND-09 (KERALA)</div>
                    <div className="font-mono text-xs font-bold text-white">SST: <span className="text-[#64ffda]">28.6°C</span></div>
                    <div className="font-mono text-[9.5px] text-[#bacac3]">Upwelling: High</div>
                  </div>
                </div>

                {/* Node 3: ATL-14 */}
                <div
                  onClick={() => setActiveBuoy('ATL-14')}
                  className="absolute top-[40%] left-[45%] group cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#64ffda] shadow-[0_0_12px_#64ffda] animate-pulse border border-[#08132a]" />
                </div>
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-[#101b33]/90 backdrop-blur-md border border-[#233554] rounded-[4px] p-3 z-20 shadow-xl">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-semibold text-[#85948e] uppercase">TEMP ANOMALY</span>
                    <div className="w-28 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-[#64ffda] to-red-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-semibold text-[#85948e] uppercase">CURRENT VELOCITY</span>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-0.5 bg-[#64ffda]/30" />
                      <span className="w-6 h-0.5 bg-[#64ffda]/60" />
                      <span className="w-8 h-1 bg-[#64ffda]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thermohaline Circulation Analysis - AMOC Strength (Spans 4 cols) */}
          <div className="glass-panel rounded-[4px] lg:col-span-4 flex flex-col bg-[#151f37]/70">
            <div className="px-4 py-3 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/60">
              <h2 className="font-mono text-xs text-white tracking-widest uppercase font-bold flex items-center gap-2">
                <Droplets className="text-[#85948e] h-4 w-4" />
                AMOC Strength
              </h2>
            </div>
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#85948e] mb-1">CURRENT FLOW RATE</div>
                  <div className="font-mono text-4xl font-bold text-white flex items-baseline gap-1.5 tracking-tight">
                    14.2 <span className="text-sm text-[#85948e] font-mono font-normal">Sv</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#f07178] bg-[#f07178]/10 px-2 py-1 rounded-[2px] border border-[#f07178]/30">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs font-bold">-0.8 Sv</span>
                </div>
              </div>

              {/* Trend Chart (SVG) */}
              <div className="flex-1 relative min-h-[140px] mt-2 border-l border-b border-[#233554] flex items-end pt-4 pr-2">
                {/* Grid lines */}
                <div className="absolute w-full h-[1px] bg-[#233554]/40 bottom-[33%]" />
                <div className="absolute w-full h-[1px] bg-[#233554]/40 bottom-[66%]" />
                <div className="absolute w-full h-[1px] bg-[#233554]/40 top-0" />

                {/* SVG Trendline */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 40 Q 20 45, 40 30 T 70 50 L 100 70" fill="none" stroke="#64FFDA" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="M 70 50 L 100 70" fill="none" stroke="#64FFDA" strokeDasharray="4,4" strokeWidth="2" />
                  <path d="M 0 100 L 0 40 Q 20 45, 40 30 T 70 50 L 100 70 L 100 100 Z" fill="url(#amocGradient)" opacity="0.15" />
                  <defs>
                    <linearGradient id="amocGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#64FFDA" />
                      <stop offset="100%" stopColor="#64FFDA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Data point indicator */}
                <div className="absolute bottom-[50%] left-[70%] w-2.5 h-2.5 rounded-full bg-[#101b33] border-2 border-[#64ffda] z-10 -translate-x-1/2 -translate-y-1/2 shadow-xs" />

                {/* AI Insight Chip */}
                <div className="absolute top-2 right-2 bg-[#64ffda]/10 border border-[#64ffda]/30 rounded-[2px] px-2 py-1 flex items-center gap-1.5 backdrop-blur-sm shadow-xs">
                  <Sparkles className="text-[#64ffda] h-3 w-3" />
                  <span className="text-[#64ffda] font-mono text-[9.5px] font-bold tracking-wider">DECAY ACCELERATING</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#85948e] px-1">
                <span>1990</span>
                <span>2010</span>
                <span className="text-[#64ffda] font-bold">TODAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Grid & AI Predictor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Physical Parameters Grid (Spans 8 cols) */}
          <div className="glass-panel rounded-[4px] lg:col-span-8 flex flex-col bg-[#151f37]/70">
            <div className="px-4 py-3 border-b border-[#233554] bg-[#101b33]/60">
              <h2 className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                Physical Parameters (Basin Averages)
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Parameter 1: SST Anomaly */}
              <div className="bg-[#081221] border border-[#233554] rounded-[4px] p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10.5px] text-[#85948e] uppercase tracking-wider font-semibold">
                    SST Anomaly (N. Atl)
                  </span>
                  <Thermometer className="text-[#f07178] h-4 w-4" />
                </div>
                <div className="font-mono text-3xl font-bold text-white mt-1">
                  +1.4°<span className="text-sm font-mono text-[#85948e]">C</span>
                </div>
                <div className="w-full bg-[#101b33] h-1.5 mt-1 rounded-full overflow-hidden">
                  <div className="bg-[#f07178] h-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Parameter 2: Salinity */}
              <div className="bg-[#081221] border border-[#233554] rounded-[4px] p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10.5px] text-[#85948e] uppercase tracking-wider font-semibold">
                    Salinity (Eq. Pac)
                  </span>
                  <Activity className="text-[#64ffda] h-4 w-4" />
                </div>
                <div className="font-mono text-3xl font-bold text-white mt-1">
                  34.8<span className="text-sm font-mono text-[#85948e] ml-0.5">PSU</span>
                </div>
                <div className="w-full bg-[#101b33] h-1.5 mt-1 rounded-full overflow-hidden">
                  <div className="bg-[#64ffda] h-full" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Parameter 3: Significant Wave Height */}
              <div className="bg-[#081221] border border-[#233554] rounded-[4px] p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10.5px] text-[#85948e] uppercase tracking-wider font-semibold">
                    Sig. Wave Ht (S. Ocean)
                  </span>
                  <Waves className="text-[#b9c7e4] h-4 w-4" />
                </div>
                <div className="font-mono text-3xl font-bold text-white mt-1">
                  6.2<span className="text-sm font-mono text-[#85948e] ml-0.5">m</span>
                </div>
                <div className="w-full bg-[#101b33] h-1.5 mt-1 rounded-full overflow-hidden">
                  <div className="bg-[#b9c7e4] h-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Oceanographic Forecasting / Deep-Ocean Predictor (Spans 4 cols) */}
          <div className="glass-panel ai-glow-border rounded-[4px] lg:col-span-4 flex flex-col relative overflow-hidden bg-[#151f37]/80">
            <div className="px-4 py-3 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/80 z-10">
              <h2 className="font-mono text-xs text-[#64ffda] tracking-widest uppercase font-bold flex items-center gap-2">
                <Radio className="h-3.5 w-3.5" />
                Deep-Ocean Predictor
              </h2>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#64ffda] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#64ffda]" />
              </span>
            </div>

            <div className="p-4 flex flex-col gap-3.5 z-10 flex-1">
              <div className="bg-[#081221] border border-[#64ffda]/20 rounded-[4px] p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="text-[#f07178] h-3.5 w-3.5" />
                  <span className="font-mono text-[10.5px] text-[#f07178] tracking-wider uppercase font-bold">
                    High Probability Alert
                  </span>
                </div>
                <p className="text-xs text-[#bacac3] leading-relaxed">
                  Model <span className="text-white font-mono font-semibold">AURA-v4</span> predicts severe coral bleaching event in the Great Barrier Reef sector within 45 days. Confidence: <span className="text-[#64ffda] font-bold">92%</span>.
                </p>
                <button className="mt-2.5 text-[10px] font-mono text-[#64ffda] border border-[#64ffda]/30 hover:bg-[#64ffda]/10 px-3 py-1.5 rounded-[2px] transition-colors uppercase w-full cursor-pointer font-semibold">
                  View Model Parameters
                </button>
              </div>

              <div className="flex-1 border border-[#233554] rounded-[4px] bg-[#081221] p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-[#85948e] uppercase tracking-wider">
                    Projected SLR (2050)
                  </span>
                  <span className="text-[10px] font-mono text-[#64ffda]">IPCC SSP2-4.5</span>
                </div>
                <div className="font-mono text-3xl font-bold text-white text-center my-1">
                  +0.32<span className="text-sm font-mono text-[#85948e] ml-1">m</span>
                </div>
                <div className="text-[9.5px] font-mono text-center text-[#64ffda] uppercase font-semibold">
                  Trajectory steepening
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
