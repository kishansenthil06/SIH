import { NavLink, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Bot,
  Map,
  Fish,
  Microscope,
  Dna,
  UploadCloud,
  FileText,
  Waves,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useCurationStore, pendingCurationCount } from '../../store/useCurationStore';
import { useAuthStore } from '../../store/useAuthStore';

const NAV_ITEMS = [
  { to: '/copilot', label: 'Copilot', icon: Bot },
  { to: '/map', label: 'Map Explorer', icon: Map },
  { to: '/species', label: 'Species Profile', icon: Fish },
  { to: '/otolith-lab', label: 'Otolith Lab', icon: Microscope },
  { to: '/edna-lab', label: 'eDNA Lab', icon: Dna },
  { to: '/ingestion', label: 'Ingestion Console', icon: UploadCloud },
  { to: '/report', label: 'Report Builder', icon: FileText },
];

export function Sidebar() {
  const navigate = useNavigate();
  const pending = useCurationStore((s) => pendingCurationCount(s.tasks));
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <Link
        to="/"
        className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-panel-hover)] transition-colors group cursor-pointer"
        title="Go to Landing Page"
      >
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          <Waves className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--color-text)] tracking-tight group-hover:text-cyan-400 transition-colors">
            CMLRE Unified AI
          </p>
          <p className="text-[9.5px] text-[var(--color-text-dim)]">Ocean &amp; Fishery Intelligence</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-semibold'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)] hover:text-[var(--color-text)]'
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </span>
            {label === 'Otolith Lab' && pending > 0 && (
              <span className="rounded-full bg-[var(--color-warning)] px-1.5 py-0.5 text-[10px] font-bold text-[#1a1400]">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile pill & logout */}
      <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-panel)]/50">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0e141f] border border-[#1b2538]">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'User'}
              className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-cyan-500/40"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{user?.name || 'Researcher'}</p>
              <span
                className="inline-block text-[8.5px] px-1 py-0.2 rounded font-semibold text-[#070b11] truncate max-w-full"
                style={{ backgroundColor: user?.badgeColor || 'var(--color-accent)' }}
              >
                {user?.role || 'Scientist'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1 rounded-md text-[var(--color-text-dim)] hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9.5px] text-[var(--color-text-dim)] px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
            <span>SIH 2026</span>
          </span>
          <span>MoES / CMLRE</span>
        </div>
      </div>
    </aside>
  );
}
