import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut,
  ChevronDown,
  UserCheck,
  Home,
  Waves,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, DEMO_USERS } from '../../store/useAuthStore';

export function TopBar() {
  const navigate = useNavigate();
  const { user, quickLogin, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-2 text-xs text-[var(--color-text-muted)] select-none">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-panel-hover)] transition-colors"
          title="Return to Public Landing Page"
        >
          <Home className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span className="font-medium text-[11px]">Portal Home</span>
        </Link>
        <span className="text-[var(--color-border-strong)]">|</span>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-dim)]">
          <Waves className="h-3 w-3 text-cyan-400" />
          <span>Arabian Sea (Kerala Coast) · Live Intelligence Sandbox</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User profile dropdown & switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] hover:border-cyan-500/40 text-[var(--color-text)] transition-colors"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'User'}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-500/40"
            />
            <div className="flex items-center gap-1.5 text-left">
              <span className="font-semibold text-xs text-white">{user?.name || 'Dr. Researcher'}</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded font-bold text-[#070b11]"
                style={{ backgroundColor: user?.badgeColor || 'var(--color-accent)' }}
              >
                {user?.role || 'Scientist'}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-[var(--color-text-dim)] ml-0.5" />
          </button>

          {/* Persona Switcher Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0c121d] border border-[#232f46] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#1b2538] mb-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#617294]">
                  Active Session
                </p>
                <p className="text-xs font-semibold text-white mt-0.5">{user?.name}</p>
                <p className="text-[10.5px] text-[#7d8dae]">{user?.institution}</p>
              </div>

              <div className="py-1">
                <p className="px-3 py-1 text-[10px] font-semibold text-[#5a6887] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>Switch Demo Persona</span>
                </p>
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      quickLogin(demo);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      user?.id === demo.id
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'hover:bg-[#131b2a] text-[#a7b5d1]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={demo.avatarUrl}
                        alt={demo.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-medium text-white">{demo.name}</div>
                        <div className="text-[10px] text-[#71809e]">{demo.role}</div>
                      </div>
                    </div>
                    {user?.id === demo.id && <UserCheck className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-1 mt-1 border-t border-[#1b2538]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors text-xs font-medium"
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
          className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-rose-500/50 hover:bg-rose-500/10 text-[var(--color-text-muted)] hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
