import { X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { formatNumber } from '../../utils/format';
import type { ToolResult } from '../../tools/client';

export interface CellInspectorData {
  h3Cell: string;
  lat: number;
  lon: number;
  value: number | null;
  valueLabel: string;
  valueUnit?: string;
}

interface CellInspectorProps {
  cell: CellInspectorData;
  result: ToolResult<unknown> | null;
  onClose: () => void;
}

// Side panel shown when a hex/point on the active map layer is clicked --
// surfaces the raw value plus which tool call produced it.
export function CellInspector({ cell, result, onClose }: CellInspectorProps) {
  return (
    <div className="absolute left-3 top-3 z-10 w-64">
      <Card
        title="Cell Inspector"
        action={
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-text-dim)] hover:bg-[var(--color-panel-hover)] hover:text-[var(--color-text)]"
            aria-label="Close cell inspector"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        }
      >
        <dl className="space-y-2 text-xs">
          <div>
            <dt className="text-[var(--color-text-dim)]">H3 Index</dt>
            <dd className="mt-0.5 break-all font-mono text-[var(--color-text)]">{cell.h3Cell}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-dim)]">Coordinates</dt>
            <dd className="mt-0.5 text-[var(--color-text)]">
              {formatNumber(cell.lat, 3)}, {formatNumber(cell.lon, 3)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-dim)]">{cell.valueLabel}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--color-accent)]">
              {cell.value === null ? '--' : formatNumber(cell.value, 3)}
              {cell.valueUnit ? ` ${cell.valueUnit}` : ''}
            </dd>
          </div>
        </dl>
        <div className="mt-3">
          <ProvenanceBadge result={result} />
        </div>
      </Card>
    </div>
  );
}
