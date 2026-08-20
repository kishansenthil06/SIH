import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Download,
  RefreshCw,
  Waves,
  Fish,
  Dna,
  ArrowRight,
  FileText,
  Edit3,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export function PlatformHubWorkspace() {
  const navigate = useNavigate();
  const [platformDetails, setPlatformDetails] = useState(
    'OceanSight v4.2 serves as the central nervous system for deep-sea data acquisition. Initiated in 2024 to consolidate fragmented marine sensor arrays into a singular, AI-augmented analytical engine. Current deployment covers the Atlantic Ridge, Marianas Trench, and select coastal reef systems. The architecture relies on robust edge-computing within submersible drone swarms to pre-process telemetry before uplink.'
  );
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 min-h-full bg-[#08132a] text-[#d9e2ff] font-sans flex flex-col selection:bg-[#64ffda] selection:text-[#08132a]">
      {/* Page Header (Sticky Sub-header) */}
      <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-[#233554] bg-[#08132a]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 rounded-[4px] font-mono text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#64ffda]" />
                SYSTEM HUB
              </span>
              {syncSuccess && (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-[4px] font-mono text-[10px] font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="h-3 w-3" />
                  Submersibles Synced (14 Feeds Active)
                </span>
              )}
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
              Marine Intelligence Gateway
            </h1>
            <p className="text-sm sm:text-base text-[#bacac3] max-w-2xl leading-relaxed">
              Unified data portal for deep ocean analytics. Synthesizing disparate oceanic datastreams into actionable insights for sustainable marine operations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/report')}
              className="px-4 py-2 font-mono text-xs font-medium rounded-[4px] bg-transparent border border-[#3c4a45] text-[#d9e2ff] hover:border-[#64ffda] hover:text-[#64ffda] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export Report
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2 font-mono text-xs font-semibold rounded-[4px] bg-transparent text-[#64ffda] border border-[#64ffda] hover:bg-[#64ffda]/10 hover:shadow-[0_0_12px_rgba(100,255,218,0.2)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Submersibles'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="p-6 sm:p-8 flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Modules Grid (3 Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Oceanographic Analysis */}
          <div className="glass-panel rounded-[4px] p-6 flex flex-col h-full hover:border-[#64ffda]/50 transition-all group relative overflow-hidden bg-[#151f37]/70">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Waves className="h-20 w-20 text-[#64ffda]" />
            </div>
            <div className="w-12 h-12 rounded-[4px] bg-[#08132a] border border-[#233554] flex items-center justify-center mb-4 z-10 group-hover:border-[#64ffda]/50 transition-colors">
              <Waves className="h-6 w-6 text-[#64ffda]" />
            </div>
            <h3 className="font-headline text-lg font-semibold text-white mb-2 z-10">
              Oceanographic Analysis
            </h3>
            <p className="text-xs sm:text-sm text-[#bacac3] flex-1 mb-6 z-10 leading-relaxed">
              Real-time telemetry from deep-sea buoys and autonomous submersibles. Monitor thermohaline circulation, salinity vectors, and bathymetric anomalies.
            </p>
            <button
              onClick={() => navigate('/map')}
              className="w-full py-2 bg-transparent text-[#64ffda] border border-[#64ffda] hover:bg-[#64ffda]/10 hover:shadow-[0_0_10px_rgba(100,255,218,0.2)] rounded-[4px] font-mono text-xs font-semibold flex items-center justify-center gap-2 z-10 cursor-pointer transition-all"
            >
              Launch Module <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Fisheries Management */}
          <div className="glass-panel rounded-[4px] p-6 flex flex-col h-full hover:border-[#64ffda]/60 transition-all group relative overflow-hidden ai-glow-border bg-[#151f37]/80">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Fish className="h-20 w-20 text-[#64ffda]" />
            </div>
            <div className="flex justify-between items-start mb-4 z-10">
              <div className="w-12 h-12 rounded-[4px] bg-[#08132a] border border-[#233554] flex items-center justify-center group-hover:border-[#64ffda]/50 transition-colors">
                <Fish className="h-6 w-6 text-[#64ffda]" />
              </div>
              <span className="px-2 py-0.5 bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 rounded-[4px] text-[10px] uppercase font-mono font-bold flex items-center gap-1 tracking-wider shadow-xs">
                <Sparkles className="h-3 w-3" /> Active AI
              </span>
            </div>
            <h3 className="font-headline text-lg font-semibold text-white mb-2 z-10">
              Fisheries Management
            </h3>
            <p className="text-xs sm:text-sm text-[#bacac3] flex-1 mb-6 z-10 leading-relaxed">
              Predictive modeling of pelagic fish migrations based on current shifts and phytoplankton density. Optimize commercial harvesting zones sustainably.
            </p>
            <button
              onClick={() => navigate('/species')}
              className="w-full py-2 bg-transparent text-[#64ffda] border border-[#64ffda] hover:bg-[#64ffda]/10 hover:shadow-[0_0_10px_rgba(100,255,218,0.2)] rounded-[4px] font-mono text-xs font-semibold flex items-center justify-center gap-2 z-10 cursor-pointer transition-all"
            >
              Launch Module <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Molecular Biodiversity */}
          <div className="glass-panel rounded-[4px] p-6 flex flex-col h-full hover:border-[#64ffda]/50 transition-all group relative overflow-hidden bg-[#151f37]/70">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Dna className="h-20 w-20 text-[#64ffda]" />
            </div>
            <div className="w-12 h-12 rounded-[4px] bg-[#08132a] border border-[#233554] flex items-center justify-center mb-4 z-10 group-hover:border-[#64ffda]/50 transition-colors">
              <Dna className="h-6 w-6 text-[#64ffda]" />
            </div>
            <h3 className="font-headline text-lg font-semibold text-white mb-2 z-10">
              Molecular Biodiversity
            </h3>
            <p className="text-xs sm:text-sm text-[#bacac3] flex-1 mb-6 z-10 leading-relaxed">
              eDNA (environmental DNA) sampling sequences cross-referenced against global biodiversity databases to track invasive species and reef health.
            </p>
            <button
              onClick={() => navigate('/edna-lab')}
              className="w-full py-2 bg-transparent text-[#64ffda] border border-[#64ffda] hover:bg-[#64ffda]/10 hover:shadow-[0_0_10px_rgba(100,255,218,0.2)] rounded-[4px] font-mono text-xs font-semibold flex items-center justify-center gap-2 z-10 cursor-pointer transition-all"
            >
              Launch Module <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* About / Documentation & System Status Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) - Platform Documentation */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-[4px] flex flex-col overflow-hidden bg-[#151f37]/70">
              <div className="px-6 py-3.5 border-b border-[#233554] flex justify-between items-center bg-[#08132a]/60">
                <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#64ffda]" />
                  Platform Documentation
                </h3>
                <span className="text-[#85948e] hover:text-[#64ffda] transition-colors p-1 cursor-pointer" title="Edit Platform Docs">
                  <Edit3 className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="font-mono text-[11px] font-semibold text-[#85948e] uppercase tracking-widest block mb-2">
                    Platform Details (Editable)
                  </label>
                  <textarea
                    value={platformDetails}
                    onChange={(e) => setPlatformDetails(e.target.value)}
                    className="w-full bg-[#08132a] border border-[#233554] rounded-[4px] p-4 text-xs sm:text-sm text-[#d9e2ff] focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda] focus:outline-none transition-colors resize-y min-h-[110px] font-sans leading-relaxed"
                    spellCheck={false}
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-semibold text-[#85948e] uppercase tracking-widest block mb-2">
                    Project Methodology
                  </label>
                  <div className="bg-[#08132a] border border-[#233554] rounded-[4px] p-4 font-mono text-xs text-[#bacac3] overflow-x-auto">
                    <pre className="leading-relaxed">
{`[METHODOLOGY_PROTOCOL_09A]
1. Autonomous Deployment: Routine sweeps via 'Nautilus' drone class.
2. Data Harvesting: Sonar, Thermal, Salinity, eDNA sequence capture.
3. Neural Uplink: Encrypted burst transmission to surface buoys.
4. Core Synthesis: Aggregation and noise-reduction via AI Core.
5. Distribution: Visualization routing to client terminals (Hub).
-- END PROTOCOL --`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) - System Status */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel rounded-[4px] overflow-hidden bg-[#151f37]/70">
              <div className="px-6 py-3.5 border-b border-[#233554] bg-[#08132a]/60">
                <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#64ffda]" />
                  System Status
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {/* Status Item 1 */}
                <div className="flex justify-between items-center border-b border-[#233554] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
                    <span className="font-mono text-xs text-[#d9e2ff]">AI Processing Core</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#64ffda]">ONLINE</span>
                </div>

                {/* Status Item 2 */}
                <div className="flex justify-between items-center border-b border-[#233554] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#64ffda]" />
                    <span className="font-mono text-xs text-[#d9e2ff]">Sat-Link Array</span>
                  </div>
                  <span className="font-mono text-xs text-[#bacac3]">99.8%</span>
                </div>

                {/* Status Item 3 */}
                <div className="flex justify-between items-center border-b border-[#233554] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                    <span className="font-mono text-xs text-[#d9e2ff]">Buoy Cluster Delta</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ffb4ab]">OFFLINE</span>
                </div>

                {/* Diagnostic Notes */}
                <div className="mt-2">
                  <label className="font-mono text-[11px] font-semibold text-[#85948e] uppercase tracking-widest block mb-2">
                    Diagnostic Notes
                  </label>
                  <textarea
                    value={diagnosticNotes}
                    onChange={(e) => setDiagnosticNotes(e.target.value)}
                    className="w-full bg-[#08132a] border border-[#233554] rounded-[4px] p-3 text-xs text-[#d9e2ff] placeholder:text-[#62728d] focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda] focus:outline-none transition-colors resize-none h-[84px] font-sans"
                    placeholder="Add operational notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
