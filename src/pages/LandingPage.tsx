import { Link, useNavigate } from 'react-router-dom';
import {
  Waves,
  Bot,
  Map as MapIcon,
  Fish,
  Microscope,
  Dna,
  UploadCloud,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  UserCheck,
} from 'lucide-react';
import { useAuthStore, DEMO_USERS } from '../store/useAuthStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, quickLogin } = useAuthStore();

  const handleQuickLaunch = (demoUser = DEMO_USERS[0]) => {
    quickLogin(demoUser);
    navigate('/copilot');
  };

  return (
    <div className="min-h-screen bg-[#070b11] text-[#e2e8f5] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Background Glow Effect */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] bg-cyan-600/5 blur-3xl rounded-full" />
        <div className="absolute top-[60%] -right-32 w-[500px] h-[500px] bg-indigo-600/5 blur-3xl rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-[#1b2333]/80 bg-[#0a0e14]/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">CMLRE Marine AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10.5px] text-[#8a96b3]">Centre for Marine Living Resources &amp; Ecology</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-[#8a96b3]">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Platform Modules
            </a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">
              Sardinella Case Study
            </a>
            <a href="#stats" className="hover:text-cyan-400 transition-colors">
              Ecosystem Metrics
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/copilot')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Dashboard ({user?.name.split(' ')[0]})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-[#232b3d] text-xs font-medium text-[#c5d1eb] hover:bg-[#151d2d] hover:border-cyan-500/40 transition-all"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleQuickLaunch(DEMO_USERS[0])}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Launch Demo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-medium mb-6">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>Ministry of Earth Sciences · Smart India Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Unified Marine Intelligence &amp;{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Ocean Ecosystem Analytics
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#8a96b3] max-w-2xl mx-auto leading-relaxed">
          An integrated decision-support platform bridging satellite oceanography, environmental DNA metabarcoding,
          computer-vision otolith morphometrics, and automated ecological reasoning across the Arabian Sea.
        </p>

        {/* Hero CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-[#070b11] font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5"
          >
            <span>Enter Intelligence Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => handleQuickLaunch(DEMO_USERS[0])}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#131a27] border border-[#26334a] text-white text-sm font-medium hover:border-cyan-500/50 hover:bg-[#182133] transition-all"
          >
            <UserCheck className="h-4 w-4 text-cyan-400" />
            <span>1-Click Scientist Access</span>
          </button>
        </div>

        {/* Quick Persona Pills for Hackathon Testing */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-[#8a96b3]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6584]">Quick Roles:</span>
          {DEMO_USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => handleQuickLaunch(u)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101622] border border-[#1e273a] hover:border-cyan-500/40 hover:text-white transition-all text-[11px]"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: u.badgeColor }} />
              <span className="text-[#c5d1eb] font-medium">{u.name}</span>
              <span className="text-[#5a6584]">({u.role})</span>
            </button>
          ))}
        </div>

        {/* Live Metrics Ribbon */}
        <div id="stats" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'H3 Spatial Hexagons', value: '45,200+', icon: Layers, color: 'text-cyan-400' },
            { label: 'Otolith CV Accuracy', value: '98.4%', icon: Microscope, color: 'text-emerald-400' },
            { label: 'eDNA ASV Profiles', value: '1,280+', icon: Dna, color: 'text-purple-400' },
            { label: 'Satellite Revisit Cadence', value: 'Daily SST/Chl', icon: Activity, color: 'text-blue-400' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-[#0e131d]/80 border border-[#1b2333] backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-[#2b3952] transition-colors"
              >
                <Icon className={`h-5 w-5 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
                <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-[11px] text-[#717e9e] font-medium mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1b2333]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="h-3.5 w-3.5" />
            Core Platform Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Six Specialized Scientific Workspaces
          </h2>
          <p className="mt-2 text-sm text-[#8a96b3]">
            Engineered specifically to solve complex marine fishery challenges like the Indian Oil Sardine fluctuation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Copilot & Reasoning Engine',
              route: '/copilot',
              icon: Bot,
              color: 'from-cyan-500 to-blue-500',
              description:
                'Autonomous multi-step tool calling agent that correlates ocean time series, queries species distributions, and drafts executive summaries.',
              badge: 'Tool Calling & Graph LLM',
            },
            {
              title: 'Deck.gl Map Explorer',
              route: '/map',
              icon: MapIcon,
              color: 'from-blue-500 to-indigo-500',
              description:
                'Ultra high-performance geospatial map with H3 hexagon bins, live bathymetry, SST anomalies, and occurrence density overlays.',
              badge: 'MapLibre + Deck.GL',
            },
            {
              title: 'Species Profiler & SHAP Analysis',
              route: '/species',
              icon: Fish,
              color: 'from-teal-500 to-emerald-500',
              description:
                'Comprehensive marine taxa directory featuring environmental tolerance envelopes and explainable AI feature importance models.',
              badge: 'ML Explainability',
            },
            {
              title: 'Otolith CV Morphology Lab',
              route: '/otolith-lab',
              icon: Microscope,
              color: 'from-amber-500 to-orange-500',
              description:
                'Automated computer-vision classification for fish otolith age rings, daily increments, and human-in-the-loop curator feedback.',
              badge: 'Vision Classifier',
            },
            {
              title: 'eDNA Metabarcoding Lab',
              route: '/edna-lab',
              icon: Dna,
              color: 'from-purple-500 to-pink-500',
              description:
                'Environmental DNA sequencing breakdown with ASV tables, Shannon biodiversity indices, and phylogenetic taxonomy tree trees.',
              badge: 'Genomic Metabarcode',
            },
            {
              title: 'Automated Ingestion Console',
              route: '/ingestion',
              icon: UploadCloud,
              color: 'from-rose-500 to-red-500',
              description:
                'Drag-and-drop CSV dataset ingestion with fuzzy column matching, automated Darwin Core validation, and spatial preview.',
              badge: 'Data Pipeline QC',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-[#0e1420] border border-[#1b2436] p-6 hover:border-cyan-500/40 hover:bg-[#121929] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#182133] text-[#8a96b3] border border-[#243048] font-medium">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#8a96b3]">{feature.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#182133] flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(feature.route);
                      } else {
                        handleQuickLaunch(DEMO_USERS[0]);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <span className="text-[10px] text-[#4d5978] font-mono">{feature.route}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Case Study Highlight Teaser */}
      <section id="demo" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0d1524] via-[#0f1a2c] to-[#0a111d] border border-cyan-500/20 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Highlighted Investigation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                "Why is the Indian oil sardine (Sardinella longiceps) declining along the Kerala coast?"
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#94a3c2] leading-relaxed">
                Execute a 7-step autonomous reasoning workflow combining sea surface temperature anomaly detection,
                eDNA presence filters, and Species Distribution Modeling (SDM) to uncover upwelling disruptions.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleQuickLaunch(DEMO_USERS[0])}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Run Sardinella AI Investigation</span>
                </button>
                <Link
                  to="/report/print"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151e2e] border border-[#26344d] text-white text-xs font-medium hover:bg-[#1a2538] transition-all"
                >
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  <span>View Sample Report</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080d16]/90 border border-[#1c273c] rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c273c]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-[#c5d1eb]">Investigation Trace</span>
                </div>
                <span className="text-[10px] text-[#6b7a9e] font-mono">7 Tools Chained</span>
              </div>
              <div className="space-y-2 mt-3 text-xs font-mono">
                <div className="p-2 rounded bg-[#101724] border border-[#1b263b] text-cyan-300 flex items-center justify-between">
                  <span>1. get_ocean_timeseries (SST)</span>
                  <span className="text-[10px] text-emerald-400">✓ Done</span>
                </div>
                <div className="p-2 rounded bg-[#101724] border border-[#1b263b] text-cyan-300 flex items-center justify-between">
                  <span>2. correlate_variables (SST vs Catch)</span>
                  <span className="text-[10px] text-emerald-400">r = -0.74</span>
                </div>
                <div className="p-2 rounded bg-[#101724] border border-[#1b263b] text-cyan-300 flex items-center justify-between">
                  <span>3. query_edna (Taxon: Sardinella)</span>
                  <span className="text-[10px] text-emerald-400">12 Samples</span>
                </div>
                <div className="p-2 rounded bg-[#101724] border border-[#1b263b] text-cyan-300 flex items-center justify-between">
                  <span>4. run_sdm (Kerala Coast)</span>
                  <span className="text-[10px] text-emerald-400">Shift South</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#161e2e] bg-[#070a10] py-8 text-center text-xs text-[#5a6584]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-cyan-400" />
            <span className="text-[#8a96b3] font-medium">
              CMLRE · Centre for Marine Living Resources &amp; Ecology
            </span>
          </div>
          <div>Smart India Hackathon (SIH 2026) · Ministry of Earth Sciences, Govt. of India</div>
        </div>
      </footer>
    </div>
  );
}
