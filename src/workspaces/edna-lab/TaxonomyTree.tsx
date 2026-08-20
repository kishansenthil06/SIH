import { useMemo } from 'react';
import { queryEdna } from '../../tools';
import { useToolCall } from '../../hooks/useToolCall';
import { Card } from '../../components/common/Card';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';

interface TaxonGroup {
  taxon: string;
  totalReads: number;
  sampleIds: Set<string>;
  stationNames: Set<string>;
}

const EDNA_QUERY_ARGS = {};

// Simple indented grouping of ASV records by taxon name -- not the full
// Knowledge Graph feature (that lives elsewhere), just a readable rollup of
// total reads and sample/station spread per taxon.
export function TaxonomyTree() {
  const { data: samples, result, loading } = useToolCall(queryEdna, EDNA_QUERY_ARGS, []);

  const groups = useMemo(() => {
    if (!samples) return [];
    const map = new Map<string, TaxonGroup>();
    for (const sample of samples) {
      for (const d of sample.detections) {
        const group = map.get(d.taxon) ?? { taxon: d.taxon, totalReads: 0, sampleIds: new Set(), stationNames: new Set() };
        group.totalReads += d.readCount;
        group.sampleIds.add(d.sampleId);
        group.stationNames.add(sample.stationName);
        map.set(d.taxon, group);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalReads - a.totalReads);
  }, [samples]);

  return (
    <Card title="Taxonomy Summary" action={<ProvenanceBadge result={result} />}>
      {loading ? (
        <LoadingLines lines={5} />
      ) : groups.length === 0 ? (
        <EmptyState title="No taxa detected" />
      ) : (
        <ul className="max-h-80 space-y-1 overflow-auto text-xs">
          {groups.map((g) => (
            <li key={g.taxon} className="rounded-lg px-2 py-1.5 hover:bg-[var(--color-panel-hover)]">
              <div className="flex items-center justify-between">
                <span className="italic font-medium text-[var(--color-text)]">{g.taxon}</span>
                <span className="text-[var(--color-text-dim)]">{g.totalReads.toLocaleString()} reads</span>
              </div>
              <div className="pl-3 text-[var(--color-text-muted)]">
                {g.sampleIds.size} sample{g.sampleIds.size !== 1 ? 's' : ''} · {g.stationNames.size} station
                {g.stationNames.size !== 1 ? 's' : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
