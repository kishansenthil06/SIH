import { useState } from 'react';
import {
  Dna,
  Download,
  RefreshCw,
  Map as MapIcon,
  TrendingUp,
  ListFilter,
  AlertTriangle,
  Radio,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export function EdnaLabWorkspace() {
  const [depthFilter, setDepthFilter] = useState<'surface' | 'pelagic' | 'benthic'>('surface');
  const [timeframe, setTimeframe] = useState<'30d' | '6m' | 'ytd'>('30d');
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
      {/* Page Sub-Header */}
      <div className="px-6 sm:px-8 py-4 border-b border-[#233554] bg-[#08132a]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-[1600px] mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 rounded-[4px] font-mono text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider">
                <Dna className="h-3 w-3 text-[#64ffda]" />
                GENOMIC SURVEILLANCE
              </span>
              {syncSuccess && (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-[4px] font-mono text-[10px] font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="h-3 w-3" />
                  eDNA Sequencers Synced
                </span>
              )}
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Molecular Biodiversity
            </h1>
            <p className="text-xs sm:text-sm text-[#bacac3] mt-0.5">
              Environmental DNA (eDNA) real-time surveillance &amp; taxonomic profiling
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 font-mono text-xs font-medium rounded-[4px] bg-transparent border border-[#3c4a45] text-[#d9e2ff] hover:border-[#64ffda] hover:text-[#64ffda] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export Data
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2 font-mono text-xs font-semibold rounded-[4px] bg-[#151f37] border border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10 hover:shadow-[0_0_12px_rgba(100,255,218,0.2)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sequencing...' : 'Sync eDNA'}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Canvas */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Map Pod (Spans 8 cols) */}
          <div className="lg:col-span-8 glass-panel rounded-[4px] flex flex-col overflow-hidden h-[400px] bg-[#151f37]/70">
            <div className="p-3.5 border-b border-[#233554] flex justify-between items-center bg-[#08132a]/60">
              <h3 className="font-sans text-sm font-semibold text-white flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-[#64ffda]" />
                Sampling Sites: Monterey &amp; Arabian Sea Coast
              </h3>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-[#64ffda] text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
                  Live Feed Active
                </span>
                <div className="flex bg-[#101b33] rounded-[4px] p-0.5 border border-[#233554]">
                  <button
                    onClick={() => setDepthFilter('surface')}
                    className={`px-2 py-0.5 rounded-[2px] text-[11px] transition-colors cursor-pointer ${
                      depthFilter === 'surface'
                        ? 'bg-[#1f2942] text-white font-semibold'
                        : 'text-[#85948e] hover:text-white'
                    }`}
                  >
                    Surface
                  </button>
                  <button
                    onClick={() => setDepthFilter('pelagic')}
                    className={`px-2 py-0.5 rounded-[2px] text-[11px] transition-colors cursor-pointer ${
                      depthFilter === 'pelagic'
                        ? 'bg-[#1f2942] text-white font-semibold'
                        : 'text-[#85948e] hover:text-white'
                    }`}
                  >
                    Pelagic
                  </button>
                  <button
                    onClick={() => setDepthFilter('benthic')}
                    className={`px-2 py-0.5 rounded-[2px] text-[11px] transition-colors cursor-pointer ${
                      depthFilter === 'benthic'
                        ? 'bg-[#1f2942] text-white font-semibold'
                        : 'text-[#85948e] hover:text-white'
                    }`}
                  >
                    Benthic
                  </button>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-[#061122] overflow-hidden">
              <img
                alt="Map of Monterey Bay eDNA Sites"
                className="w-full h-full object-cover opacity-75 mix-blend-screen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv1Si18HiGn8nw9hetQWJQVd7n1V3oDaVlM5a8spAgDv1wLtWe-0QXE-FJE3KlzSIB2c317vdp_MRwBqqn0SotWa2LSXEoXweQxU_s1pOR58CYGir9Rle8r3Uj_Fw06tszrd1EFVxfFs96adFCB8F0QqQltSmbdv8lBtLr2fX5mYRQd3c6XU_mp_hWST6tqjwTWqNMHXCTSTKT0GrQoEw3QmkOk76spGL_yEuTDl1yH1BXl6gQ283lIA"
              />
              {/* Simulated Overlay Nodes */}
              <div className="absolute inset-0 p-4 pointer-events-none">
                {/* Node 1 */}
                <div className="absolute top-[35%] left-[48%] flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64ffda] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#64ffda]" />
                  </span>
                  <div className="bg-[#08132a]/90 border border-[#64ffda]/60 px-2.5 py-1 rounded-[4px] backdrop-blur-md text-[10.5px] font-mono text-[#64ffda] shadow-lg">
                    MB-04: High Activity · 42 ASVs
                  </div>
                </div>

                {/* Node 2 */}
                <div className="absolute top-[60%] left-[30%] flex items-center gap-2 opacity-80">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#38debb]" />
                  <div className="bg-[#08132a]/80 border border-[#233554] px-2 py-0.5 rounded-[4px] backdrop-blur text-[9.5px] font-mono text-[#bacac3]">
                    KC-02: Kerala Coastal Ridge
                  </div>
                </div>

                {/* Node 3 */}
                <div className="absolute top-[25%] left-[75%] flex items-center gap-2 opacity-80">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#b9c7e4]" />
                  <div className="bg-[#08132a]/80 border border-[#233554] px-2 py-0.5 rounded-[4px] backdrop-blur text-[9.5px] font-mono text-[#bacac3]">
                    MB-08: Submarine Canyon
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Species Richness & Top Detections (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-[400px]">
            {/* Richness Index */}
            <div className="glass-panel rounded-[4px] p-4 flex flex-col justify-between h-1/2 ai-glow-border bg-[#151f37]/80">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#64ffda] h-4 w-4" />
                  <span className="text-[#bacac3] text-xs font-mono uppercase tracking-wider">Shannon-Wiener Index</span>
                </div>
                <span className="bg-[#64ffda]/10 text-[#64ffda] px-2 py-0.5 rounded-[2px] text-[10px] font-mono border border-[#64ffda]/30 font-bold">
                  AI Verified
                </span>
              </div>
              <div className="mt-1">
                <div className="font-mono text-4xl font-bold text-white tracking-tight">4.82</div>
                <div className="text-[#64ffda] text-xs font-mono flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +0.15 (7d rolling avg)
                </div>
              </div>
              {/* Mini Trendline (SVG) */}
              <div className="h-10 mt-2 relative border-b border-l border-[#233554]/60">
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 80 Q 25 20, 50 50 T 100 10" fill="none" stroke="#64FFDA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0 80 Q 25 20, 50 50 T 100 10 L 100 100 L 0 100 Z" fill="url(#ednaGrad)" opacity="0.2" />
                  <defs>
                    <linearGradient id="ednaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#64FFDA" stopOpacity="1" />
                      <stop offset="100%" stopColor="#64FFDA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Top Detections */}
            <div className="glass-panel rounded-[4px] p-4 flex flex-col h-1/2 overflow-hidden bg-[#151f37]/70">
              <h3 className="text-xs font-mono uppercase text-[#85948e] border-b border-[#233554] pb-2 mb-2 flex items-center gap-2 tracking-wider">
                <ListFilter className="h-3.5 w-3.5 text-[#64ffda]" />
                Top Target Detections
              </h3>
              <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                <div className="flex justify-between items-center p-2 rounded-[4px] bg-[#101b33] border border-[#233554]">
                  <div className="flex flex-col">
                    <span className="font-mono text-white text-xs italic font-medium">Engraulis mordax</span>
                    <span className="text-[#85948e] text-[10px]">Northern Anchovy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 bg-[#08132a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#64ffda] w-[98%]" />
                    </div>
                    <span className="font-mono text-xs text-[#64ffda] font-bold">98%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-[4px] bg-[#93000a]/20 border border-[#f07178]/40 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f07178]" />
                  <div className="flex flex-col pl-1.5">
                    <span className="font-mono text-white text-xs italic flex items-center gap-1 font-medium">
                      Carcharodon carcharias
                      <AlertTriangle className="h-3 w-3 text-[#f07178]" />
                    </span>
                    <span className="text-[#ffb4ab] text-[10px]">White Shark (Apex Alert)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 bg-[#08132a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f07178] w-[87%]" />
                    </div>
                    <span className="font-mono text-xs text-[#f07178] font-bold">87%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-[4px] bg-[#101b33] border border-[#233554]">
                  <div className="flex flex-col">
                    <span className="font-mono text-white text-xs italic font-medium">Sardinops sagax</span>
                    <span className="text-[#85948e] text-[10px]">Pacific / Oil Sardine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 bg-[#08132a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#b9c7e4] w-[76%]" />
                    </div>
                    <span className="font-mono text-xs text-[#b9c7e4] font-bold">76%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sequence Alignment (Spans 12 cols) */}
          <div className="lg:col-span-12 glass-panel rounded-[4px] p-5 overflow-hidden ai-glow-border bg-[#151f37]/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#233554] pb-3 mb-4 gap-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Dna className="h-4 w-4 text-[#64ffda]" />
                16S rRNA Sequence Alignment &amp; Read Clustering
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#64ffda] font-bold">Consensus: 94.2%</span>
                <div className="bg-[#08132a] px-2.5 py-1 rounded-[4px] text-[10.5px] font-mono border border-[#233554] text-[#bacac3] flex gap-3">
                  <span>A: <span className="text-[#64ffda] font-bold">Green</span></span>
                  <span>T: <span className="text-[#f07178] font-bold">Red</span></span>
                  <span>C: <span className="text-[#b9c7e4] font-bold">Blue</span></span>
                  <span>G: <span className="text-white font-bold">White</span></span>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-nowrap bg-[#030d25] p-4 rounded-[4px] border border-[#233554]/60">
              <div className="flex items-center gap-4 mb-2 pb-1 border-b border-[#233554]/40">
                <span className="text-[#85948e] w-24 text-right font-bold text-[11px]">Reference</span>
                <span className="tracking-[0.25em] font-bold text-sm">
                  <span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span>
                </span>
              </div>
              <div className="flex items-center gap-4 mb-1.5">
                <span className="text-[#85948e] w-24 text-right text-[11px]">Read_001</span>
                <span className="tracking-[0.25em] text-sm">
                  <span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span>
                </span>
              </div>
              <div className="flex items-center gap-4 mb-1.5">
                <span className="text-[#85948e] w-24 text-right text-[11px]">Read_002</span>
                <span className="tracking-[0.25em] text-sm">
                  <span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#64ffda]">A</span><span className="text-[#f07178] bg-[#f07178]/25 border border-[#f07178]/60 px-0.5 rounded-[2px] font-bold">T</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#85948e] w-24 text-right text-[11px]">Read_003</span>
                <span className="tracking-[0.25em] text-sm">
                  <span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#64ffda]">A</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-white">G</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span><span className="text-[#b9c7e4]">C</span><span className="text-[#64ffda] bg-[#64ffda]/25 border border-[#64ffda]/60 px-0.5 rounded-[2px] font-bold">A</span><span className="text-[#64ffda]">A</span><span className="text-[#b9c7e4]">C</span><span className="text-[#f07178]">T</span><span className="text-[#64ffda]">A</span><span className="text-white">G</span>
                </span>
              </div>
            </div>
          </div>

          {/* Genetic Drift Analysis (Spans 12 cols) */}
          <div className="lg:col-span-12 glass-panel rounded-[4px] p-5 h-[300px] flex flex-col bg-[#151f37]/70">
            <div className="flex justify-between items-center border-b border-[#233554] pb-2.5 mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-[#64ffda]" />
                Genetic Drift Analysis: Allele Freq. vs Heterozygosity
              </h3>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as '30d' | '6m' | 'ytd')}
                className="bg-[#101b33] border border-[#233554] text-[#d9e2ff] text-xs font-mono rounded-[4px] px-2.5 py-1 focus:border-[#64ffda] focus:outline-none cursor-pointer"
              >
                <option value="30d">Last 30 Days</option>
                <option value="6m">Last 6 Months</option>
                <option value="ytd">YTD Timeline</option>
              </select>
            </div>
            <div className="flex-1 relative w-full bg-[#030d25] border border-[#233554]/50 rounded-[4px] overflow-hidden p-2">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 px-8 opacity-20 pointer-events-none">
                <div className="border-b border-[#233554] w-full h-0" />
                <div className="border-b border-[#233554] w-full h-0" />
                <div className="border-b border-[#233554] w-full h-0" />
                <div className="border-b border-[#233554] w-full h-0" />
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                {/* Allele Freq Line */}
                <path d="M 0 150 Q 100 120, 200 130 T 400 90 T 600 110 T 800 60 T 1000 80" fill="none" stroke="#64FFDA" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                {/* Heterozygosity Line */}
                <path d="M 0 100 Q 100 110, 200 90 T 400 120 T 600 80 T 800 140 T 1000 120" fill="none" stroke="#b9c7e4" strokeDasharray="5 5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="absolute bottom-2.5 right-4 flex gap-4 text-[10.5px] font-mono">
                <div className="flex items-center gap-1.5 text-[#64ffda]">
                  <span className="w-3 h-1 bg-[#64ffda] rounded-full inline-block" /> Allele Frequency
                </div>
                <div className="flex items-center gap-1.5 text-[#b9c7e4]">
                  <span className="w-3 h-1 bg-[#b9c7e4] border-t border-dashed border-[#b9c7e4] inline-block" /> Heterozygosity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
