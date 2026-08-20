import { TrendingDown, TrendingUp, Minus, HelpCircle } from 'lucide-react';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { SPECIES_CATALOG } from '../../mock-data/constants';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import { SpeciesSearch } from './SpeciesSearch';
import { TrendChart } from './TrendChart';
import { OccurrenceMap } from './OccurrenceMap';
import { ShapPanel } from './ShapPanel';

const STATUS_TONE = {
  declining: 'danger',
  stable: 'neutral',
  increasing: 'success',
  data_deficient: 'warning',
} as const;

const STATUS_ICON = {
  declining: TrendingDown,
  stable: Minus,
  increasing: TrendingUp,
  data_deficient: HelpCircle,
} as const;

export function SpeciesProfileWorkspace() {
  const selectedSpeciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const species = SPECIES_CATALOG.find((s) => s.speciesId === selectedSpeciesId) ?? SPECIES_CATALOG[0];
  const StatusIcon = STATUS_ICON[species.status];

  return (
    <div className="flex h-full flex-col">
      <WorkspaceHeader
        title="Species Profile"
        description="Population trends, occurrence records, and habitat suitability for a selected species."
      />
      <div className="grid flex-1 grid-cols-[260px_1fr] gap-4 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          <Card title="Species">
            <SpeciesSearch />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">{species.commonName}</h2>
                <p className="text-sm italic text-[var(--color-text-muted)]">{species.scientificName}</p>
                <p className="mt-1 text-xs text-[var(--color-text-dim)]">
                  Family: {species.family} · AphiaID: {species.aphiaId}
                </p>
              </div>
              <Tag tone={STATUS_TONE[species.status]} className="text-[11px]">
                <StatusIcon className="h-3 w-3" />
                {species.status.replace('_', ' ')}
              </Tag>
            </div>
          </Card>

          <TrendChart />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <OccurrenceMap />
            <ShapPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
