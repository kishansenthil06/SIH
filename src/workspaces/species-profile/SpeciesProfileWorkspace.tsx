import { useState } from 'react';
import {
  Ship,
  Activity,
  AlertTriangle,
  Sparkles,
  Filter,
  Compass,
  BarChart2,
} from 'lucide-react';

export function SpeciesProfileWorkspace() {
  const [predictionTab, setPredictionTab] = useState<'6m' | '1y' | '5y'>('6m');
  const [dispatchedAlerts, setDispatchedAlerts] = useState<string[]>([]);

  const handleDispatch = (vesselId: string) => {
    if (!dispatchedAlerts.includes(vesselId)) {
      setDispatchedAlerts([...dispatchedAlerts, vesselId]);
    }
  };

  return (
    <div className="flex-1 min-h-full bg-[#08132a] text-[#d9e2ff] font-sans flex flex-col selection:bg-[#64ffda] selection:text-[#08132a]">
      {/* Scrollable Canvas */}
      <div className="p-6 sm:p-8 flex-1 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
        {/* Global Stats Banner (4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1: Active Vessels */}
          <div className="glass-panel rounded-[4px] p-4 flex flex-col justify-between bg-[#151f37]/70">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[#85948e] font-mono text-[11px] font-semibold uppercase tracking-wider">
                Active Vessels
              </span>
              <Ship className="text-[#b9c7e4] h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">1,402</span>
              <span className="text-[#64ffda] font-mono text-xs font-semibold ml-2">+12 today</span>
            </div>
          </div>

          {/* Stat 2: Global Quota Used */}
          <div className="glass-panel rounded-[4px] p-4 flex flex-col justify-between bg-[#151f37]/70">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[#85948e] font-mono text-[11px] font-semibold uppercase tracking-wider">
                Global Quota Used
              </span>
              <Activity className="text-[#b9c7e4] h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">64.2%</span>
              <div className="w-full bg-[#101b33] h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-[#64ffda] h-full" style={{ width: '64.2%' }} />
              </div>
            </div>
          </div>

          {/* Stat 3: Anomalies Detected */}
          <div className="glass-panel rounded-[4px] p-4 flex flex-col justify-between ai-glow-border bg-[#151f37]/80 relative overflow-hidden">
            <div className="flex items-start justify-between mb-2 relative z-10">
              <span className="text-[#64ffda] font-mono text-[11px] font-semibold flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Anomalies Detected
              </span>
              <AlertTriangle className="text-[#f07178] h-4 w-4" />
            </div>
            <div className="relative z-10 flex items-baseline">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#f07178]">3</span>
              <span className="text-[#85948e] font-mono text-xs ml-2">Review Required</span>
            </div>
          </div>

          {/* Stat 4: Predicted Biomass */}
          <div className="glass-panel rounded-[4px] p-4 flex flex-col justify-between bg-[#151f37]/70">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[#85948e] font-mono text-[11px] font-semibold uppercase tracking-wider">
                Predicted Biomass
              </span>
              <BarChart2 className="text-[#b9c7e4] h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">Stable</span>
              <span className="text-[#85948e] font-mono text-xs block mt-0.5">Next 30 Days Forecast</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout (Row 1: Map + Alert Panel + Catch Quotas) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Map / Species Population Heatmap (Spans 8 cols) */}
          <section className="glass-panel rounded-[4px] col-span-1 md:col-span-8 relative overflow-hidden flex flex-col min-h-[500px] bg-[#151f37]/70">
            <div className="p-3.5 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/90 backdrop-blur-md z-20">
              <h3 className="font-sans text-sm font-semibold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#64ffda]" />
                Species Population Heatmap &amp; Fleet Tracker
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#08132a] rounded-[2px] font-mono text-[10px] font-bold text-[#64ffda] border border-[#64ffda]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
                  Live Fleet Radar
                </span>
                <button className="p-1 text-[#85948e] hover:text-white transition-colors">
                  <Filter className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-[#061122] relative w-full h-full overflow-hidden">
              {/* Simulated Map Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-65 mix-blend-screen"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7snXSXXQFP40mqZrYzwSjDztr2RIh8B7mVo-tCrv6cbgrGnNKSmfNtizbpvf7yBGSLBaINjoXi4ifk182pEQ2Nw5Mv6-KTogfyiZUAXl_NtLWpaqdb_htUNeN2ma4juMuVxOlyaI8FsV7jVP0Cesue91mBLjLknnPKgGbOOM_mR7qQS8DUGLmtJopdbueBFQjPpoBTxlB_0upAxuxXME4C-YiTM2gFC2F8oPKl2CQ5mhaoq7TiOloKw')`,
                }}
              />

              {/* Heatmap Overlay Simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,_rgba(100,255,218,0.18)_0%,_transparent_40%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(100,255,218,0.22)_0%,_transparent_30%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,_rgba(255,180,171,0.15)_0%,_transparent_25%)] pointer-events-none" />

              {/* Vessel Markers */}
              <div className="absolute top-[30%] left-[40%] w-2.5 h-2.5 bg-[#64ffda] rounded-full shadow-[0_0_10px_rgba(100,255,218,0.9)] animate-pulse" />
              <div className="absolute top-[32%] left-[41%] w-2 h-2 bg-[#64ffda] rounded-full opacity-80" />
              <div className="absolute top-[28%] left-[72%] w-2.5 h-2.5 bg-[#64ffda] rounded-full shadow-[0_0_10px_rgba(100,255,218,0.9)]" />

              {/* Illegal Alert Marker with Tooltip */}
              <div className="absolute top-[65%] left-[25%] group cursor-pointer z-30">
                <div className="w-5 h-5 bg-[#f07178] rounded-full animate-ping absolute inset-0 opacity-50" />
                <div className="w-3.5 h-3.5 bg-[#f07178] rounded-full relative z-10 shadow-[0_0_12px_rgba(240,113,120,1)] border border-[#08132a]" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-[#101b33]/95 backdrop-blur-md p-2 rounded-[4px] font-mono text-[10.5px] text-[#ffb4ab] border border-[#f07178]/50 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Alert: Unauthorized entry<br />Zone C-4 (MPA Sanctuary)
                </div>
              </div>
            </div>
          </section>

          {/* Right Column (Spans 4 cols) - Split into Active Alerts + Catch Quotas */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
            {/* Active Alerts Panel */}
            <section className="glass-panel rounded-[4px] border-[#f07178]/40 flex flex-col relative overflow-hidden h-[240px] bg-[#151f37]/70">
              <div className="p-3 border-b border-[#f07178]/20 flex items-center gap-2 bg-[#93000a]/15">
                <AlertTriangle className="text-[#f07178] h-4 w-4" />
                <h3 className="font-mono text-xs font-bold text-[#f07178] uppercase tracking-wider">
                  Active Alerts
                </h3>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-2.5">
                {/* Alert Item 1 */}
                <div className="bg-[#101b33] border border-[#f07178]/30 p-2.5 rounded-[4px]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs font-bold text-[#f07178]">Vessel ID: UNK-892</span>
                    <span className="text-[10px] font-mono text-[#85948e]">2m ago</span>
                  </div>
                  <p className="text-xs text-[#d9e2ff] mb-2">Detected in restricted marine protected area (MPA-04).</p>
                  <div className="flex gap-2">
                    <button className="px-2.5 py-1 bg-[#08132a] border border-[#233554] rounded-[2px] font-mono text-[10.5px] text-white hover:border-[#64ffda] transition-colors cursor-pointer">
                      Track
                    </button>
                    <button
                      onClick={() => handleDispatch('UNK-892')}
                      className="px-2.5 py-1 bg-[#f07178]/20 border border-[#f07178]/50 rounded-[2px] font-mono text-[10.5px] font-semibold text-[#ffb4ab] hover:bg-[#f07178]/30 transition-colors cursor-pointer"
                    >
                      {dispatchedAlerts.includes('UNK-892') ? '✓ Dispatched' : 'Dispatch Guard'}
                    </button>
                  </div>
                </div>

                {/* Alert Item 2 */}
                <div className="bg-[#101b33] border border-[#233554] p-2.5 rounded-[4px]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs font-semibold text-[#b9c7e4]">Pattern Anomaly</span>
                    <span className="text-[10px] font-mono text-[#85948e]">14m ago</span>
                  </div>
                  <p className="text-xs text-[#bacac3]">Unusual loitering behavior near border zone.</p>
                </div>
              </div>
            </section>

            {/* Quota vs Actuals */}
            <section className="glass-panel rounded-[4px] flex flex-col h-[240px] bg-[#151f37]/70">
              <div className="p-3 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/60">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Catch Quotas
                </h3>
                <span className="font-mono text-[10.5px] text-[#85948e]">2026 Season</span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col gap-3 justify-center">
                {/* Progress Bar 1 */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-white font-medium">Atlantic Cod</span>
                    <span className="text-[#64ffda] font-bold">82%</span>
                  </div>
                  <div className="w-full bg-[#101b33] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#64ffda] h-full" style={{ width: '82%' }} />
                  </div>
                  <div className="flex justify-between text-[9.5px] font-mono text-[#85948e] mt-0.5">
                    <span>8,200t</span>
                    <span>10,000t cap</span>
                  </div>
                </div>

                {/* Progress Bar 2 */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-white font-medium">Bluefin Tuna</span>
                    <span className="text-[#f07178] font-bold">95% (Near Cap)</span>
                  </div>
                  <div className="w-full bg-[#101b33] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#f07178] h-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex justify-between text-[9.5px] font-mono text-[#85948e] mt-0.5">
                    <span>4,750t</span>
                    <span>5,000t cap</span>
                  </div>
                </div>

                {/* Progress Bar 3 */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-white font-medium">Indian Oil Sardine</span>
                    <span className="text-[#b9c7e4] font-bold">41%</span>
                  </div>
                  <div className="w-full bg-[#101b33] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#b9c7e4] h-full" style={{ width: '41%' }} />
                  </div>
                  <div className="flex justify-between text-[9.5px] font-mono text-[#85948e] mt-0.5">
                    <span>6,150t</span>
                    <span>15,000t cap</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Predictive Modeling Chart (Spans 12 cols) */}
        <section className="glass-panel ai-glow-border rounded-[4px] h-[350px] flex flex-col bg-[#151f37]/80">
          <div className="p-3.5 border-b border-[#233554] flex justify-between items-center bg-[#101b33]/60">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#64ffda] h-4 w-4" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Stock Level Prediction Model (AI Ecosystem Simulation)
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPredictionTab('6m')}
                className={`px-3 py-1 font-mono text-xs rounded-[2px] transition-colors cursor-pointer ${
                  predictionTab === '6m'
                    ? 'bg-[#1f2942] text-[#64ffda] border-b-2 border-[#64ffda] font-bold'
                    : 'text-[#85948e] hover:text-white'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setPredictionTab('1y')}
                className={`px-3 py-1 font-mono text-xs rounded-[2px] transition-colors cursor-pointer ${
                  predictionTab === '1y'
                    ? 'bg-[#1f2942] text-[#64ffda] border-b-2 border-[#64ffda] font-bold'
                    : 'text-[#85948e] hover:text-white'
                }`}
              >
                1 Year
              </button>
              <button
                onClick={() => setPredictionTab('5y')}
                className={`px-3 py-1 font-mono text-xs rounded-[2px] transition-colors cursor-pointer ${
                  predictionTab === '5y'
                    ? 'bg-[#1f2942] text-[#64ffda] border-b-2 border-[#64ffda] font-bold'
                    : 'text-[#85948e] hover:text-white'
                }`}
              >
                5 Years
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 relative flex flex-col">
            {/* Y-Axis Labels */}
            <div className="absolute left-4 top-4 bottom-8 flex flex-col justify-between text-[10px] font-mono text-[#85948e] z-10">
              <span>High (100k t)</span>
              <span>Med (50k t)</span>
              <span>Low (10k t)</span>
            </div>

            {/* Chart Area */}
            <div className="flex-1 ml-16 mb-6 relative border-l border-b border-[#233554]">
              {/* Historical Area Chart (Left Half) */}
              <div className="absolute bottom-0 left-0 w-1/2 h-full overflow-hidden">
                <svg className="w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,100 L0,40 Q20,30 40,50 T100,60 L100,100 Z" fill="url(#hist-grad)" />
                  <path d="M0,40 Q20,30 40,50 T100,60" fill="none" stroke="#b9c7e4" strokeWidth="2.5" />
                  <defs>
                    <linearGradient id="hist-grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#b9c7e4" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Predictive Future Chart (Right Half) */}
              <div className="absolute bottom-0 left-1/2 w-1/2 h-full overflow-hidden">
                {/* Confidence Interval */}
                <svg className="w-full h-full opacity-15" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,60 Q20,70 50,40 T100,30 L100,100 L0,100 Z" fill="#64ffda" />
                </svg>
                {/* Predictive Line */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,60 Q20,65 50,45 T100,40" fill="none" stroke="#64ffda" strokeDasharray="4 4" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Present Day Marker */}
              <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-[#f07178] z-20">
                <span className="absolute -top-4 -translate-x-1/2 bg-[#08132a] border border-[#f07178]/50 px-1.5 py-0.2 text-[9.5px] font-mono text-[#f07178] rounded-[2px]">
                  Today
                </span>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="ml-16 flex justify-between text-[10.5px] font-mono text-[#85948e]">
              <span>Q1 2025</span>
              <span>Q2 2025</span>
              <span>Q3 2025</span>
              <span className="text-[#64ffda] font-bold">Q4 (Predicted)</span>
              <span className="text-[#64ffda] font-bold">Q1 2026 (Predicted)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
