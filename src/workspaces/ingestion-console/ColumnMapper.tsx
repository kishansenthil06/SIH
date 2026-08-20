import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { CANONICAL_FIELDS } from '../../types/ingestion';
import type { ColumnMapping, IngestionJob } from '../../types/ingestion';
import { useIngestionStore } from '../../store/useIngestionStore';
import { ingestDataset, type IngestDatasetResult } from '../../tools/ingestDataset';
import type { ToolResult } from '../../tools/client';

const TYPE_TONE: Record<ColumnMapping['inferredType'], 'accent' | 'neutral'> = {
  number: 'accent',
  date: 'accent',
  string: 'neutral',
  unknown: 'neutral',
};

interface ColumnMapperProps {
  job: IngestionJob;
  rows: Record<string, string>[];
  onIngested: (result: ToolResult<IngestDatasetResult>) => void;
}

// Lets the user confirm/adjust the auto-guessed source-column -> canonical
// field mapping, then hands the mapping + raw rows to the mock ingestDataset
// tool for validation. Walks the job through mapping -> validated ->
// ingested so ValidationReport and IngestPreviewMap can react in sequence.
export function ColumnMapper({ job, rows, onIngested }: ColumnMapperProps) {
  const updateJob = useIngestionStore((s) => s.updateJob);
  const [isValidating, setIsValidating] = useState(false);

  const hasLatitude = job.columns.some((c) => c.targetField === 'latitude');
  const hasLongitude = job.columns.some((c) => c.targetField === 'longitude');
  const canValidate = hasLatitude && hasLongitude && !isValidating;

  function handleTargetChange(sourceColumn: string, targetField: string | null) {
    const columns = job.columns.map((c) => (c.sourceColumn === sourceColumn ? { ...c, targetField } : c));
    updateJob({ columns });
  }

  async function handleValidate() {
    setIsValidating(true);
    const mapping: Record<string, string | null> = {};
    for (const c of job.columns) mapping[c.sourceColumn] = c.targetField;

    const result = await ingestDataset({ rows, mapping });
    updateJob({ issues: result.data.issues, ingestedPoints: result.data.ingestedPoints, status: 'validated' });
    onIngested(result);
    setIsValidating(false);
    // Brief pause so "validated" (issues visible) is perceptible before the
    // map view appears -- matches the plan's "map columns, watch it
    // validate, appear on the map" demo beat.
    setTimeout(() => updateJob({ status: 'ingested' }), 700);
  }

  return (
    <Card title="Map columns" action={<Tag tone="neutral">{job.rowCount} rows detected</Tag>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-dim)]">
              <th className="py-2 pr-3 font-medium">Source column</th>
              <th className="py-2 pr-3 font-medium">Sample values</th>
              <th className="py-2 pr-3 font-medium">Inferred type</th>
              <th className="py-2 pr-3 font-medium">Maps to</th>
            </tr>
          </thead>
          <tbody>
            {job.columns.map((col) => (
              <tr key={col.sourceColumn} className="border-b border-[var(--color-border)]/60">
                <td className="py-2 pr-3 font-mono text-[var(--color-text)]">{col.sourceColumn}</td>
                <td className="py-2 pr-3 text-[var(--color-text-muted)]">{col.sampleValues.join(', ') || '—'}</td>
                <td className="py-2 pr-3">
                  <Tag tone={TYPE_TONE[col.inferredType]}>{col.inferredType}</Tag>
                </td>
                <td className="py-2 pr-3">
                  <select
                    value={col.targetField ?? ''}
                    onChange={(e) => handleTargetChange(col.sourceColumn, e.target.value === '' ? null : e.target.value)}
                    className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 py-1 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                  >
                    <option value="">— unmapped —</option>
                    {CANONICAL_FIELDS.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[var(--color-text-muted)]">
          {hasLatitude && hasLongitude
            ? 'Latitude and longitude are mapped — ready to validate.'
            : 'Map latitude and longitude columns to continue.'}
        </p>
        <button
          type="button"
          onClick={() => void handleValidate()}
          disabled={!canValidate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isValidating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Validate &amp; Ingest
        </button>
      </div>
    </Card>
  );
}
