import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Waves,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { useAuthStore, DEMO_USERS } from '../store/useAuthStore';
import type { UserProfile } from '../store/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickLogin } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Determine redirect target
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/overview';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your research email address.');
      return;
    }
    setError('');
    login(email, password);
    navigate(from, { replace: true });
  };

  const handleQuickLogin = (demoUser: UserProfile) => {
    quickLogin(demoUser);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-[#e2e8f5] flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[15%] w-[550px] h-[550px] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">CMLRE Unified Portal</span>
            <span className="block text-[10px] text-[#7887a8]">Ministry of Earth Sciences</span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-[#8a96b3] hover:text-cyan-300 transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Landing</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Login Form */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0c121d]/90 border border-[#1b2538] p-7 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure Researcher Authentication</span>
              </div>

              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Sign in to Marine Intelligence
              </h1>
              <p className="text-xs text-[#8a96b3] mt-1.5">
                Access oceanographic time series, eDNA pipelines, and AI copilot workspaces.
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a6b5d4] mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5a6584]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="scientist@cmlre.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#111825] border border-[#212c40] text-sm text-white placeholder-[#515e7d] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#a6b5d4]">Password</label>
                    <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                      Demo password auto-filled
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5a6584]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#111825] border border-[#212c40] text-sm text-white placeholder-[#515e7d] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#8a96b3] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#26344d] bg-[#111825] text-cyan-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-[11px] text-[#6b7b9e]">SIH Test Sandbox</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-[#070b11] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate &amp; Enter</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-[#172133] text-center text-[11px] text-[#5a6584]">
              Government of India · Ministry of Earth Sciences Authentication Gateway
            </div>
          </div>

          {/* Right: Quick 1-Click Test Users for Evaluators */}
          <div className="lg:col-span-6 rounded-2xl bg-[#090f18]/90 border border-cyan-500/20 p-7 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Instant Hackathon Evaluation Access</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                1-Click Quick Demo Personas
              </h2>
              <p className="text-xs text-[#8a96b3] mt-1">
                Select a pre-configured researcher persona below to immediately log in with full role capabilities:
              </p>

              <div className="mt-5 space-y-3">
                {DEMO_USERS.map((demoUser) => (
                  <button
                    key={demoUser.id}
                    onClick={() => handleQuickLogin(demoUser)}
                    className="w-full text-left p-3.5 rounded-xl bg-[#101724] border border-[#1d293d] hover:border-cyan-400/60 hover:bg-[#141d2e] transition-all group relative flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={demoUser.avatarUrl}
                        alt={demoUser.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {demoUser.name}
                          </span>
                          <span
                            className="text-[9.5px] px-2 py-0.5 rounded font-semibold text-[#070b11]"
                            style={{ backgroundColor: demoUser.badgeColor }}
                          >
                            {demoUser.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7e8dae]">
                          <Building2 className="h-3 w-3 text-[#5a6584]" />
                          <span>{demoUser.institution}</span>
                          <span>•</span>
                          <span className="text-[10px] font-mono text-[#5f6f94]">{demoUser.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-8 w-8 rounded-lg bg-[#192438] group-hover:bg-cyan-500 group-hover:text-[#070b11] text-cyan-400 flex items-center justify-center transition-colors shrink-0 ml-2">
                      <UserCheck className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#172133] flex items-center justify-between text-[11px] text-[#6b7a9e]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Preloaded Arabian Sea Datasets</span>
              </span>
              <span className="font-mono text-[10.5px]">CMLRE-PROD-v2.6</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-[11px] text-[#4d5770]">
        Smart India Hackathon 2026 · Problem Statement: Marine Biodiversity AI &amp; Ecological Decision Engine
      </footer>
    </div>
  );
}
