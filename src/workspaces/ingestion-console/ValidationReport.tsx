import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { EmptyState } from '../../components/common/EmptyState';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import type { IngestionJob } from '../../types/ingestion';
import type { ToolResult } from '../../tools/client';
import type { IngestDatasetResult } from '../../tools/ingestDataset';

interface ValidationReportProps {
  job: IngestionJob;
  result: ToolResult<IngestDatasetResult> | null;
}

// Groups the mock ingestDataset tool's validation issues by severity and
// shows the ingested/total row summary, once the job has moved past
// 'mapping'.
export function ValidationReport({ job, result }: ValidationReportProps) {
  const errors = job.issues.filter((i) => i.severity === 'error');
  const warnings = job.issues.filter((i) => i.severity === 'warning');
  const validRowCount = job.ingestedPoints.length;

  return (
    <Card
      title="Validation report"
      action={<ProvenanceBadge result={result} />}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-[var(--color-text)]">
          <span className="font-semibold text-[var(--color-accent)]">{validRowCount}</span> of {job.rowCount} rows ingested
        </p>
        {errors.length > 0 && <Tag tone="danger">{errors.length} error{errors.length === 1 ? '' : 's'}</Tag>}
        {warnings.length > 0 && <Tag tone="warning">{warnings.length} warning{warnings.length === 1 ? '' : 's'}</Tag>}
      </div>

      {job.issues.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="No issues found" description="Every row passed validation cleanly." />
      ) : (
        <ul className="max-h-72 space-y-1.5 overflow-auto pr-1">
          {job.issues.map((issue, idx) => (
            <li
              key={`${issue.row}-${issue.column}-${idx}`}
              className="flex items-start gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-hover)] px-3 py-2 text-xs"
            >
              {issue.severity === 'error' ? (
                <XCircle className="mt-0.5 h-3.5 w-3.5 flex-none text-[var(--color-danger)]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-[var(--color-warning)]" />
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag tone={issue.severity === 'error' ? 'danger' : 'warning'}>{issue.severity}</Tag>
                  <span className="text-[var(--color-text-dim)]">
                    row {issue.row + 1} · {issue.column}
                  </span>
                </div>
                <p className="mt-0.5 text-[var(--color-text-muted)]">{issue.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
