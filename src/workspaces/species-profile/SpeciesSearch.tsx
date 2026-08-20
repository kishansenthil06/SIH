import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { SPECIES_CATALOG } from '../../mock-data/constants';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { Tag } from '../../components/common/Tag';

const STATUS_TONE = {
  declining: 'danger',
  stable: 'neutral',
  increasing: 'success',
  data_deficient: 'warning',
} as const;

export function SpeciesSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);
  const selectedSpeciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const setSelectedSpeciesId = useSpeciesStore((s) => s.setSelectedSpeciesId);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return SPECIES_CATALOG;
    return SPECIES_CATALOG.filter(
      (s) => s.commonName.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q) || s.family.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-dim)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search species..."
          className="w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] py-1.5 pl-8 pr-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
      <ul className="flex flex-col gap-1">
        {filtered.map((species) => (
          <li key={species.speciesId}>
            <button
              type="button"
              onClick={() => setSelectedSpeciesId(species.speciesId)}
              className={clsx(
                'flex w-full flex-col items-start gap-1 rounded-md border px-2.5 py-2 text-left transition-colors',
                species.speciesId === selectedSpeciesId
                  ? 'border-[var(--color-accent-strong)]/40 bg-[var(--color-accent-soft)]'
                  : 'border-transparent hover:bg-[var(--color-panel-hover)]'
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-medium text-[var(--color-text)]">{species.commonName}</span>
                <Tag tone={STATUS_TONE[species.status]} className="shrink-0">
                  {species.status.replace('_', ' ')}
                </Tag>
              </div>
              <span className="text-[11px] italic text-[var(--color-text-muted)]">{species.scientificName}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="px-2.5 py-2 text-xs text-[var(--color-text-dim)]">No species match.</li>}
      </ul>
    </div>
  );
}
