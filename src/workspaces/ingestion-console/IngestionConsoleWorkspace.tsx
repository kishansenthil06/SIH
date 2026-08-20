import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { useIngestionStore } from '../../store/useIngestionStore';
import { DropZone } from './DropZone';
import { ColumnMapper } from './ColumnMapper';
import { ValidationReport } from './ValidationReport';
import { IngestPreviewMap } from './IngestPreviewMap';
import type { ToolResult } from '../../tools/client';
import type { IngestDatasetResult } from '../../tools/ingestDataset';

// Composes the full "drag a messy CSV -> map columns -> validate -> see it
// on the map" demo flow. Raw parsed rows live here (IngestionJob has no room
// for them) and are passed down to whatever step needs them.
export function IngestionConsoleWorkspace() {
  const job = useIngestionStore((s) => s.job);
  const setJob = useIngestionStore((s) => s.setJob);

  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [ingestResult, setIngestResult] = useState<ToolResult<IngestDatasetResult> | null>(null);

  function handleLoaded(parsedRows: Record<string, string>[]) {
    setRows(parsedRows);
    setIngestResult(null);
  }

  function handleReset() {
    setJob(null);
    setRows([]);
    setIngestResult(null);
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <WorkspaceHeader
        title="Ingestion Console"
        description="Drag in a messy field survey CSV, map its columns, validate, and watch it appear on the map."
        action={
          job && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </button>
          )
        }
      />

      <div className="flex flex-col gap-4 p-6">
        {!job && <DropZone onLoaded={handleLoaded} />}

        {job && job.status === 'mapping' && <ColumnMapper job={job} rows={rows} onIngested={setIngestResult} />}

        {job && (job.status === 'validated' || job.status === 'ingested') && (
          <ValidationReport job={job} result={ingestResult} />
        )}

        {job && job.status === 'ingested' && <IngestPreviewMap points={job.ingestedPoints} />}
      </div>
    </div>
  );
}
