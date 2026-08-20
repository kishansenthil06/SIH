import { useState } from 'react';
import { Info } from 'lucide-react';
import type { ToolResult } from '../../tools/client';
import { formatTimestamp } from '../../utils/format';

interface ProvenanceBadgeProps<T> {
  result: ToolResult<T> | null;
}

// Attaches a "which tool produced this number" chip to any figure/chart/map
// layer, satisfying the plan's "every number traceable to a tool call"
// explainability requirement uniformly across workspaces.
export function ProvenanceBadge<T>({ result }: ProvenanceBadgeProps<T>) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-2 py-0.5 text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
      >
        <Info className="h-3 w-3" />
        {result.toolName}()
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-3 text-xs shadow-xl">
          <p className="font-mono text-[var(--color-accent)]">{result.toolName}()</p>
          <p className="mt-1 break-all text-[var(--color-text-muted)]">{JSON.stringify(result.args)}</p>
          <p className="mt-2 text-[var(--color-text-dim)]">
            {formatTimestamp(result.calledAt)} · {result.latencyMs}ms · source: {result.source}
          </p>
        </div>
      )}
    </span>
  );
}
