import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Bot, Map, Fish, Microscope, Dna, UploadCloud, FileText, Waves } from 'lucide-react';
import { useCurationStore, pendingCurationCount } from '../../store/useCurationStore';

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
  const pending = useCurationStore((s) => pendingCurationCount(s.tasks));

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="flex items-center gap-2 px-4 py-4">
        <Waves className="h-6 w-6 text-[var(--color-accent)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">CMLRE Unified Platform</p>
          <p className="text-[10px] text-[var(--color-text-dim)]">Oceanographic &amp; Biodiversity Insights</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)] hover:text-[var(--color-text)]'
              )
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </span>
            {label === 'Otolith Lab' && pending > 0 && (
              <span className="rounded-full bg-[var(--color-warning)] px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1400]">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[var(--color-border)] px-4 py-3 text-[10px] text-[var(--color-text-dim)]">
        SIH 2026 · Ministry of Earth Sciences (CMLRE)
      </div>
    </aside>
  );
}
