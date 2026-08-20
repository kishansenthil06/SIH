import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Waves,
  Fish,
  Dna,
  Microscope,
  UploadCloud,
  FileText,
  Bot,
  LayoutDashboard,
  ChevronDown,
  Globe,
  Sparkles,
  LogOut,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore, DEMO_USERS } from '../../store/useAuthStore';
import { useCurationStore, pendingCurationCount } from '../../store/useCurationStore';
import { GlobalMapModal } from '../map/GlobalMapModal';

// Primary 4 Top Navigation Tabs
const PRIMARY_NAV_ITEMS = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/map', label: 'Oceanography', icon: Waves },
  { to: '/species', label: 'Fisheries', icon: Fish },
  { to: '/edna-lab', label: 'Molecular', icon: Dna },
];

// 'Others' Dropdown Options
const OTHERS_NAV_ITEMS = [
  {
    to: '/species',
    title: 'Species Profiler & SHAP Analysis',
    description: 'Explainable AI feature importance & habitat suitability modeling',
    icon: TrendingUp,
    badge: 'XAI',
  },
  {
    to: '/otolith-lab',
    title: 'Otolith CV Morphology Lab',
    description: 'Computer-vision specimen age & species morphometrics',
    icon: Microscope,
    hasPendingBadge: true,
  },
  {
    to: '/edna-lab',
    title: 'eDNA Metabarcoding Lab',
    description: 'Amplicon sequence variants (ASVs) & taxonomic profiling',
    icon: Dna,
  },
  {
    to: '/ingestion',
    title: 'Automated Ingestion Console',
    description: 'Upload custom field CSV surveys & validate on-the-fly for real-time analysis',
    icon: UploadCloud,
  },
];

export function TopBar() {
  const navigate = useNavigate();
  const { user, quickLogin, logout } = useAuthStore();
  const pending = useCurationStore((s) => pendingCurationCount(s.tasks));

  const [othersOpen, setOthersOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const othersRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (othersRef.current && !othersRef.current.contains(event.target as Node)) {
        setOthersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOthersMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOthersOpen(true);
  };

  const handleOthersMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOthersOpen(false);
    }, 180);
  };

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#233554] bg-[#08132a] px-4 select-none z-30 font-sans backdrop-blur-md">
        {/* Left: Brand Logo & Title (Redirects to Landing Page) */}
        <div className="flex items-center gap-3 shrink-0 mr-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Return to Landing Page"
          >
            <div className="p-1.5 rounded-[4px] bg-gradient-to-br from-[#64ffda] to-[#00725e] shadow-md shadow-[#64ffda]/20 group-hover:scale-105 transition-transform">
              <Waves className="h-4 w-4 text-[#00382d]" strokeWidth={2.2} />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#d9e2ff] tracking-tight group-hover:text-[#64ffda] transition-colors leading-tight font-headline">
                  Abyssal Intelligence
                </p>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-[2px] bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30">
                  v2.6
                </span>
              </div>
              <p className="text-[9px] text-[#85948e] leading-tight font-mono">
                Deep Marine Tech · CMLRE
              </p>
            </div>
          </Link>
          <span className="hidden md:inline-block text-[#233554]">|</span>
        </div>

        {/* Center: Primary Navigation Tabs & 'Others' Dropdown */}
        <nav className="flex items-center gap-1.5 py-1 mx-2 flex-1 justify-start lg:justify-center">
          {PRIMARY_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'relative flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-[#151f37] text-[#64ffda] font-semibold border border-[#64ffda]/40 shadow-[0_0_12px_rgba(100,255,218,0.12)]'
                    : 'text-[#bacac3] hover:bg-[#151f37]/60 hover:text-[#d9e2ff] border border-transparent'
                )
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* 'Others' Dropdown with Hover & Click Support */}
          <div
            ref={othersRef}
            className="relative"
            onMouseEnter={handleOthersMouseEnter}
            onMouseLeave={handleOthersMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOthersOpen(!othersOpen)}
              className={clsx(
                'flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap border',
                othersOpen
                  ? 'bg-[#151f37] text-[#64ffda] border-[#64ffda]/40 shadow-[0_0_12px_rgba(100,255,218,0.12)]'
                  : 'text-[#bacac3] hover:bg-[#151f37]/60 hover:text-[#d9e2ff] border-transparent'
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#64ffda]" />
              <span>Others</span>
              {pending > 0 && (
                <span className="rounded-[2px] bg-[#fbbf24] px-1.5 py-0.2 text-[8.5px] font-mono font-bold text-[#08132a]">
                  {pending}
                </span>
              )}
              <ChevronDown
                className={clsx(
                  'h-3 w-3 text-[#85948e] transition-transform duration-200',
                  othersOpen && 'rotate-180 text-[#64ffda]'
                )}
              />
            </button>

            {/* Dropdown Menu Container */}
            {othersOpen && (
              <div className="absolute left-0 mt-1.5 w-[380px] rounded-[6px] bg-[#101b33] border border-[#233554] shadow-2xl p-2.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 backdrop-blur-xl">
                <div className="px-2 py-1.5 border-b border-[#233554] mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#85948e]">
                    Specialized Research Modules
                  </span>
                  <span className="text-[9.5px] font-mono text-[#64ffda]">4 Toolkits</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {OTHERS_NAV_ITEMS.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => {
                          setOthersOpen(false);
                          navigate(item.to);
                        }}
                        className="w-full text-left p-2.5 rounded-[4px] bg-[#08132a]/60 hover:bg-[#151f37] border border-transparent hover:border-[#64ffda]/30 transition-all flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="p-2 rounded-[4px] bg-[#101b33] border border-[#233554] group-hover:border-[#64ffda]/40 text-[#64ffda] transition-colors shrink-0 mt-0.5">
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-[#64ffda] transition-colors">
                              {item.title}
                            </span>
                            {item.hasPendingBadge && pending > 0 && (
                              <span className="rounded-[2px] bg-[#fbbf24] px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#08132a]">
                                {pending} pending
                              </span>
                            )}
                            {item.badge && (
                              <span className="rounded-[2px] bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 px-1 py-0.2 text-[8.5px] font-mono font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#bacac3] line-clamp-2 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Footer Quick Links */}
                <div className="pt-2 mt-2 border-t border-[#233554] flex items-center justify-between px-2 text-[10.5px] font-mono">
                  <button
                    onClick={() => {
                      setOthersOpen(false);
                      navigate('/copilot');
                    }}
                    className="text-[#85948e] hover:text-[#64ffda] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Bot className="h-3 w-3" /> Copilot AI
                  </button>
                  <span className="text-[#233554]">·</span>
                  <button
                    onClick={() => {
                      setOthersOpen(false);
                      navigate('/report');
                    }}
                    className="text-[#85948e] hover:text-[#64ffda] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="h-3 w-3" /> Report Builder
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Map Icon (Opens Complete Map) + User Profile & Persona Switcher */}
        <div className="flex items-center gap-2.5 shrink-0 ml-2">
          {/* Complete Map Icon Button (Replaces Arabian Sea Coordinates) */}
          <button
            type="button"
            onClick={() => setMapModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#101b33] border border-[#233554] hover:border-[#64ffda]/60 hover:bg-[#151f37] text-[#d9e2ff] hover:text-[#64ffda] transition-all cursor-pointer group shadow-xs hover:shadow-[0_0_16px_rgba(100,255,218,0.18)]"
            title="Open Complete Global Oceanic Telemetry Map"
          >
            <div className="relative flex items-center justify-center">
              <Globe className="h-4 w-4 text-[#64ffda] group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#64ffda] rounded-full animate-ping" />
            </div>
            <span className="hidden xl:inline-block font-mono text-[11px] font-semibold tracking-wider uppercase text-[#bacac3] group-hover:text-[#64ffda] transition-colors">
              Global Map
            </span>
          </button>

          {/* User profile dropdown & switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#151f37] border border-[#233554] hover:border-[#64ffda]/40 text-[#d9e2ff] transition-all cursor-pointer shadow-xs hover:shadow-[0_0_12px_rgba(100,255,218,0.08)]"
            >
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={user?.name || 'User'}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-[#64ffda]/40"
              />
              <div className="hidden sm:flex items-center gap-1.5 text-left">
                <span className="font-semibold text-xs text-[#d9e2ff] truncate max-w-[110px]">
                  {user?.name || 'Dr. Researcher'}
                </span>
                <span
                  className="text-[8.5px] font-mono px-1.5 py-0.2 rounded-[2px] font-bold text-[#00382d]"
                  style={{ backgroundColor: user?.badgeColor || '#64ffda' }}
                >
                  {user?.role || 'Scientist'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-[#85948e]" />
            </button>

            {/* Persona Switcher Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[6px] bg-[#101b33] border border-[#233554] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-[#233554] mb-1">
                  <p className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#85948e]">
                    Active Telemetry Session
                  </p>
                  <p className="text-xs font-semibold text-[#d9e2ff] mt-0.5">{user?.name}</p>
                  <p className="text-[10.5px] text-[#bacac3] font-mono">{user?.institution}</p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] font-mono font-semibold text-[#85948e] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#64ffda]" />
                    <span>Switch Demo Persona</span>
                  </p>
                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        quickLogin(demo);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                        user?.id === demo.id
                          ? 'bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30'
                          : 'hover:bg-[#151f37] text-[#bacac3]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={demo.avatarUrl}
                          alt={demo.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-medium text-[#d9e2ff]">{demo.name}</div>
                          <div className="text-[10px] font-mono text-[#85948e]">{demo.role}</div>
                        </div>
                      </div>
                      {user?.id === demo.id && <UserCheck className="h-3.5 w-3.5 text-[#64ffda]" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1 mt-1 border-t border-[#233554]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[4px] text-[#f07178] hover:bg-[#f07178]/10 hover:text-[#ffb4ab] transition-colors text-xs font-medium cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign Out Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-[4px] border border-[#233554] hover:border-[#f07178]/50 hover:bg-[#f07178]/10 text-[#85948e] hover:text-[#f07178] transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Complete Global Interactive Map Modal */}
      <GlobalMapModal isOpen={mapModalOpen} onClose={() => setMapModalOpen(false)} />
    </>
  );
}
