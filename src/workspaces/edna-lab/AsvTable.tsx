import { useMemo, useState } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import { queryEdna } from '../../tools';
import { useToolCall } from '../../hooks/useToolCall';
import { Card } from '../../components/common/Card';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { formatPercent } from '../../utils/format';

interface AsvRow {
  asvId: string;
  taxon: string;
  confidence: number;
  readCount: number;
  sampleId: string;
  stationName: string;
}

type SortKey = 'taxon' | 'stationName' | 'confidence' | 'readCount';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'taxon', label: 'Taxon' },
  { key: 'stationName', label: 'Station' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'readCount', label: 'Reads' },
];

const EDNA_QUERY_ARGS = {};

// Flattens every AsvRecord across all EdnaSamples into one client-side
// sortable/filterable table -- lets a user filter down to e.g. "Sardinella"
// to line up with other workspaces' species data, per the plan.
export function AsvTable() {
  const { data: samples, result, loading } = useToolCall(queryEdna, EDNA_QUERY_ARGS, []);
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('readCount');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows: AsvRow[] = useMemo(() => {
    if (!samples) return [];
    return samples.flatMap((sample) =>
      sample.detections.map((d) => ({
        asvId: d.asvId,
        taxon: d.taxon,
        confidence: d.confidence,
        readCount: d.readCount,
        sampleId: d.sampleId,
        stationName: sample.stationName,
      }))
    );
  }, [samples]);

  const filteredRows = useMemo(() => {
    const needle = filterText.trim().toLowerCase();
    const base = needle ? rows.filter((r) => r.taxon.toLowerCase().includes(needle)) : rows;
    return [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, filterText, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  return (
    <Card title="ASV Detections" action={<ProvenanceBadge result={result} />}>
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-2 py-1.5">
        <Filter className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-text-dim)]" />
        <input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by taxon…"
          className="w-full bg-transparent text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none"
        />
      </div>
      {loading ? (
        <LoadingLines lines={5} />
      ) : filteredRows.length === 0 ? (
        <EmptyState title="No ASV detections" description="Try a different taxon filter." />
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[var(--color-panel)]">
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="cursor-pointer select-none border-b border-[var(--color-border)] px-2 py-1.5 font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && <ArrowUpDown className="h-3 w-3 text-[var(--color-accent)]" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.asvId} className="border-b border-[var(--color-border)]/50 last:border-0">
                  <td className="px-2 py-1.5 italic text-[var(--color-text)]">{row.taxon}</td>
                  <td className="px-2 py-1.5 text-[var(--color-text-muted)]">{row.stationName}</td>
                  <td className="px-2 py-1.5 text-[var(--color-text-muted)]">{formatPercent(row.confidence)}</td>
                  <td className="px-2 py-1.5 text-[var(--color-text-muted)]">{row.readCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
